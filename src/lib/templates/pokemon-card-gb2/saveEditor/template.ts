import { paginate } from "$lib/utils/format";

import type { GameJson, Item } from "$lib/types";

import { letters, lettersAscii } from "./utils/letters";
import { cardCollections, cardList, cards, cardTypes } from "./utils/resource";

// A raw .sav maps SRAM bank n address $aXXX to file offset
// n * 0x2000 + (addr - 0xa000).
//
// Which bank is authoritative differs by region, and getting this wrong makes
// edits silently revert. Verified in an emulator (see work/FINDINGS.md):
//
//   $a000-$a0ff  settings, player name, duel counters -> BANK 0 (file 0x0000+)
//   $a100-$bfff  cards, decks, deck-tail fields       -> BANK 2 (file 0x4000+)
//
// The reason is BulkCopySRAM: on load the game restores `sCardAndDeckSaveData`
// ($a100) onwards from the bank 2 backup over bank 0, but never touches
// $a000-$a0ff, which only BackupMainSave's mode 2 copies. Editing cards in
// bank 0 alone is undone before the player ever sees it. TCG1's template reads
// its card collection from bank 2 for the same reason.
const BANK2 = 0x4000; // file offset of SRAM bank 2

const DECK_STRUCT_SIZE = 0x60; // DECK_NAME_SIZE (24) + DECK_COMPRESSED_SIZE (72)
const DECK_NAME_LENGTH = 0x14; // DECK_NAME_SIZE_WO_SUFFIX
const NUM_DECKS = 4; // sDeck1..sDeck4 at $a300
const NUM_DECK_SAVE_MACHINE_SLOTS = 50; // sSavedDeck1..50 at $a4e0
const DECK_SIZE = 60; // cards per deck

const BUILT_DECKS = BANK2 + 0x300; // sBuiltDecks
const SAVED_DECKS = BANK2 + 0x4e0; // sSavedDecks
const CARD_COLLECTION = BANK2 + 0x100; // sCardCollection

// The general-save and Challenge Machine blocks are serialised streams, not
// structs: each stored byte is `wram_value + mask`, where the mask is a seeded
// x3 chain. The mask depends only on the seed and the byte's position, never on
// the data, so individual fields can be unmasked in place -- see utils.ts and
// work/check_mask.py. Field positions come from work/gen_offsets.py.
const GENERAL_MAIN = BANK2 + 0x1801; // sGeneralSaveDataMain, 441 bytes
const GENERAL_CHECKSUM = BANK2 + 0x1aa0; // checksum1 then checksum0 (swapped)
const CHALLENGE_MAIN = BANK2 + 0x1aa4; // sChallengeMachineSaveData, 64 bytes
const CHALLENGE_CHECKSUM = BANK2 + 0x1ae4;

const PLAYTIME = BANK2 + 0x1801; // wPlayTimeCounter: frames, secs, mins, hours
const EVENT_VARS = BANK2 + 0x1827; // wEventVars, 50 bytes
const GENERAL_VARS = BANK2 + 0x1859; // wGeneralVars, 50 bytes
const GAME_CENTER_CHIPS = BANK2 + 0x19b4;
const GAME_CENTER_BANKED_CHIPS = BANK2 + 0x19b6;

// An unlabelled byte grid beats a wrong label (PLAN.md §4), so the story flags
// are exposed raw rather than guessed at.
function maskedByteGrid(
  id: string,
  base: number,
  count: number,
  prefix: string,
): Item[] {
  return [...Array(count).keys()].map((index) => ({
    id,
    name: `${prefix} ${index.toString(16).padStart(2, "0")}`,
    offset: base + index,
    type: "variable",
    dataType: "uint8",
    hex: true,
    // Int.svelte sets maxlength to leadingZeros + 1, so without this a byte
    // field accepts only one hex digit and anything above $0f is unenterable.
    leadingZeros: 1,
  }));
}

// Compressed deck layout, from DecompressSRAMDeck (src/engine/bank01.asm:6589):
// eight groups of one flags byte followed by eight low bytes. A card id is
// `low | (flagBit << 8)`, with the flags byte consumed MSB-first.
function deckCardOffset(base: number, index: number): number {
  return base + 0x18 + (index >> 3) * 9 + 1 + (index % 8);
}

function deckItems(base: number): Item[] {
  return [
    {
      id: "name",
      name: "Name",
      offset: base,
      length: DECK_NAME_LENGTH,
      type: "variable",
      dataType: "string",
      letterDataType: "uint16",
      letterBigEndian: true,
      fallback: 0x0,
      endCode: 0x0,
      resource: "letters",
    },
    {
      type: "section",
      flex: true,
      items: [...Array(DECK_SIZE).keys()].map((index) => ({
        id: "deckCard",
        name: `Card ${index + 1}`,
        offset: deckCardOffset(base, index),
        type: "variable",
        dataType: "uint8",
        resource: "cards",
        autocomplete: true,
      })),
    },
  ];
}

const template: GameJson = {
  validator: {
    platforms: {
      gameboycolor: {
        // sGeneralSaveDataHeader is written as $16 by _SaveGame, in bank 0 and
        // in the bank 2 backup. Deleting a save zeroes both (src/engine/save.asm
        // lines 153-165), so this rejects deleted.sav and empty.sav alike, and
        // distinguishes TCG2 from TCG1 (which stores $08 at 0x5800).
        japan: {
          $and: [{ 0x1800: [0x16] }, { 0x5800: [0x16] }],
        },
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: GENERAL_CHECKSUM,
      type: "checksum",
      dataType: "uint16",
      bigEndian: true, // stored swapped: checksum1 at $baa0, checksum0 at $baa1
      control: {
        offsetStart: GENERAL_MAIN,
        offsetEnd: GENERAL_MAIN + 0x1b9,
      },
    },
    {
      name: "Checksum (Challenge Machine)",
      offset: CHALLENGE_CHECKSUM,
      type: "checksum",
      dataType: "uint16",
      bigEndian: true,
      control: {
        offsetStart: CHALLENGE_MAIN,
        offsetEnd: CHALLENGE_MAIN + 0x40,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "name",
                  name: "Name",
                  offset: 0x10,
                  length: 0x10,
                  type: "variable",
                  dataType: "string",
                  letterDataType: "uint16",
                  letterBigEndian: true,
                  fallback: 0x0,
                  endCode: 0x0,
                  resource: "letters",
                  test: true,
                },
                {
                  name: "Game Cleared",
                  offset: 0xa,
                  type: "variable",
                  dataType: "boolean",
                },
                {
                  // wram.asm documents the order as frames, seconds, minutes,
                  // then hours as a 16-bit value.
                  name: "Playtime",
                  type: "group",
                  mode: "time",
                  items: [
                    {
                      id: "playtime",
                      offset: PLAYTIME + 0x3,
                      type: "variable",
                      dataType: "uint16",
                      max: 999,
                    },
                    {
                      id: "playtime",
                      offset: PLAYTIME + 0x2,
                      type: "variable",
                      dataType: "uint8",
                      leadingZeros: 1,
                      max: 59,
                    },
                    {
                      id: "playtime",
                      offset: PLAYTIME + 0x1,
                      type: "variable",
                      dataType: "uint8",
                      leadingZeros: 1,
                      max: 59,
                    },
                  ],
                },
                {
                  id: "playtime",
                  name: "Playtime (Frames)",
                  offset: PLAYTIME,
                  type: "variable",
                  dataType: "uint8",
                  max: 59,
                  hidden: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  id: "chips",
                  name: "Game Center Chips",
                  offset: GAME_CENTER_CHIPS,
                  type: "variable",
                  dataType: "uint16",
                  max: 9999,
                  test: true,
                },
                {
                  id: "bankedChips",
                  name: "Game Center Chips (Banked)",
                  offset: GAME_CENTER_BANKED_CHIPS,
                  type: "variable",
                  dataType: "uint16",
                  max: 9999,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Duels Played",
                  offset: 0x20,
                  type: "variable",
                  dataType: "uint16",
                  max: 9999,
                },
                {
                  name: "Link Duels Played",
                  offset: 0x22,
                  type: "variable",
                  dataType: "uint16",
                  max: 9999,
                },
                {
                  name: "Card Pop! Count",
                  offset: 0x5,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Unnamed Deck Counter",
                  offset: BANK2 + 0x17a1,
                  type: "variable",
                  dataType: "uint16",
                  max: 999,
                },
              ],
            },
            {
              name: "Booster Packs Obtained",
              type: "bitflags",
              flags: [
                { offset: BANK2 + 0x17a3, bit: 0, label: "Beginning Pokémon" },
                { offset: BANK2 + 0x17a3, bit: 1, label: "Legendary Power" },
                { offset: BANK2 + 0x17a3, bit: 2, label: "Island of Fossil" },
                { offset: BANK2 + 0x17a3, bit: 3, label: "Psychic Battle" },
                { offset: BANK2 + 0x17a3, bit: 4, label: "Sky-Flying Pokémon" },
                { offset: BANK2 + 0x17a3, bit: 5, label: "We Are Team Rocket" },
                {
                  offset: BANK2 + 0x17a3,
                  bit: 6,
                  label: "Team Rocket's Ambition",
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Text Speed",
                  offset: 0x6,
                  type: "variable",
                  dataType: "uint8",
                  resource: "textSpeeds",
                },
                {
                  name: "Duel Animations",
                  offset: 0x7,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Coin Toss Animation",
                  offset: 0xb,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Text Box Frame Colour",
                  offset: 0xc,
                  type: "variable",
                  dataType: "uint8",
                },
                {
                  name: "Skip Delay Allowed",
                  offset: 0x9,
                  type: "variable",
                  dataType: "boolean",
                },
                {
                  name: "Printer Contrast",
                  offset: 0x3,
                  type: "variable",
                  dataType: "uint8",
                },
              ],
            },
          ],
        },
        {
          name: "Card Album",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Collection",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: cardCollections.map((collection) => {
                        const cards = cardList
                          .filter(
                            (card) => card.collection === collection.index,
                          )
                          .sort((a, b) => a.order - b.order);

                        return {
                          name: collection.name,
                          flex: true,
                          items: paginate(cards, 10, true).map((page) => ({
                            id: "collection",
                            type: "bitflags",
                            reversed: true,
                            flags: page.map((card) => ({
                              offset: CARD_COLLECTION + card.index,
                              bit: 7,
                              label: `${card.prefix} ${card.name}`,
                            })),
                          })),
                        };
                      }),
                    },
                  ],
                },
                {
                  name: "Cards",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: cardTypes.map((type) => ({
                        name: type.name,
                        flex: true,
                        items: cardList
                          .filter((card) => card.type === type.index)
                          .map((card) => ({
                            id: "card",
                            name: card.name,
                            offset: CARD_COLLECTION + card.index,
                            type: "variable",
                            dataType: "uint8",
                            binary: { bitStart: 0, bitLength: 7 },
                            // MAX_AMOUNT_OF_CARD; AddCardToCollection refuses more.
                            max: 99,
                          })),
                      })),
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Progress Flags",
          items: [
            {
              type: "tabs",
              vertical: true,
              items: [
                {
                  name: "Event Vars",
                  flex: true,
                  items: maskedByteGrid("eventVar", EVENT_VARS, 50, "Event"),
                },
                {
                  name: "General Vars",
                  flex: true,
                  items: maskedByteGrid(
                    "generalVar",
                    GENERAL_VARS,
                    50,
                    "General",
                  ),
                },
              ],
            },
          ],
        },
        {
          name: "Decks",
          items: [
            {
              length: DECK_STRUCT_SIZE,
              type: "container",
              instanceType: "tabs",
              instances: NUM_DECKS,
              enumeration: "Deck %d",
              disableSubinstanceIf: {
                offset: BUILT_DECKS,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0x0,
              },
              vertical: true,
              items: deckItems(BUILT_DECKS),
            },
          ],
        },
        {
          name: "Deck Save Machine",
          items: [
            {
              length: DECK_STRUCT_SIZE,
              type: "container",
              instanceType: "tabs",
              instances: NUM_DECK_SAVE_MACHINE_SLOTS,
              enumeration: "Deck %d",
              disableSubinstanceIf: {
                offset: SAVED_DECKS,
                type: "variable",
                dataType: "uint8",
                operator: "=",
                value: 0x0,
              },
              vertical: true,
              items: deckItems(SAVED_DECKS),
            },
          ],
        },
      ],
    },
  ],
  resources: {
    cards: {
      0x0: "-",
      ...cards,
    },
    // Full-width name characters are stored as (charset << 8) | code; see
    // work/gen_letters.py and src/constants/charmaps.asm.
    letters,
    // Names beginning with TX_HALFWIDTH ($06) switch to 1-byte ASCII.
    lettersAscii,
    textSpeeds: {
      0x0: "Slow",
      0x1: "Normal",
      0x2: "Fast",
    },
  },
  resourcesLabels: {
    // Card ids are grouped by category, so a header at the first id of each
    // run splits the deck autocomplete the same way tcg1 does.
    cards: {
      0x001: "Energy Cards",
      0x00c: "Pokémon Cards",
      0x189: "Trainer Cards",
    },
  },
};

export default template;
