import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

// The general-save and Challenge Machine blocks are written by
// WriteSaveDataToSRAM as `stored = wram_value + mask`, where mask runs a seeded
// x3 chain (`sla a; add b`). Because the chain depends only on the seed and the
// byte's position, mask(i) has the closed form `seed * 3^(i+1) mod 256` -- so a
// single field can be unmasked and rewritten without disturbing its neighbours.
// Verified against the sequential form in work/check_mask.py.
const BANK2 = 0x4000;

const BLOCKS = [
  // [start, length, seed offset]
  [BANK2 + 0x1801, 0x1b9, BANK2 + 0x1aa2], // sGeneralSaveDataMain
  [BANK2 + 0x1aa4, 0x40, BANK2 + 0x1ae6], // sChallengeMachineSaveData
] as const;

// Every field that lives inside one of those blocks and therefore has to be
// unmasked on read and re-masked on write.
const MASKED_IDS = [
  "playtime",
  "chips",
  "bankedChips",
  "eventVar",
  "generalVar",
];

function blockFor(
  offset: number,
): readonly [number, number, number] | undefined {
  return BLOCKS.find(
    ([start, length]) => offset >= start && offset < start + length,
  );
}

function maskAt(offset: number): number {
  const block = blockFor(offset);

  if (!block) {
    return 0x0;
  }

  const [start, , seedOffset] = block;

  let mask = getInt(seedOffset, "uint8") & 0xff;

  for (let i = start; i <= offset; i += 0x1) {
    mask = (mask * 0x3) & 0xff;
  }

  return mask;
}

function getMasked(offset: number, length: number): number {
  let value = 0x0;

  for (let i = 0; i < length; i += 0x1) {
    const byte = (getInt(offset + i, "uint8") - maskAt(offset + i)) & 0xff;

    value |= byte << (0x8 * i);
  }

  return value >>> 0x0;
}

function setMasked(offset: number, length: number, value: number): void {
  for (let i = 0; i < length; i += 0x1) {
    const byte = (value >> (0x8 * i)) & 0xff;

    setInt(offset + i, "uint8", (byte + maskAt(offset + i)) & 0xff);
  }
}

function maskedLength(item: ItemInt): number {
  return item.dataType === "uint16" ? 0x2 : 0x1;
}

// A deck struct is 24 bytes of name followed by 72 bytes of compressed card
// list. DecompressSRAMDeck (poketcg2/src/engine/bank01.asm:6589) walks the
// compressed area as eight groups of one flags byte plus eight low bytes:
//
//   [flags][low0..low7][flags][low0..low7] ...      8 x 9 = 72 bytes
//
// Each card id is `low | (flagBit << 8)`, and the flags byte is consumed
// MSB-first (`rl b`), so card j of a group uses bit (7 - j).
const DECK_STRUCT_SIZE = 0x60;
const DECK_COMPRESSED_START = 0x18; // DECK_NAME_SIZE
const DECK_GROUP_SIZE = 9; // 1 flags byte + 8 low bytes
// Decks live in the bank 2 copy (0x4000 + $a300 - $a000); see template.ts.
const DECK_GRID_ORIGIN = 0x4000 + 0x300 + DECK_COMPRESSED_START;

// TX_HALFWIDTH: a name starting with this byte is 1-byte ASCII, not full-width
// 2-byte pairs. Same trick TCG1 uses.
const TX_HALFWIDTH = 0x6;

// Every deck struct -- the four built decks at $a300 and the fifty Deck Save
// Machine slots at $a4e0 -- sits on the same 0x60 grid starting at $a300
// (0x4e0 - 0x300 == 5 * 0x60), so a card slot's group can be recovered from its
// absolute offset alone.
function deckCardLocation(offset: number): { flags: number; bit: number } {
  const withinDeck = (offset - DECK_GRID_ORIGIN) % DECK_STRUCT_SIZE;
  const group = Math.floor((withinDeck - 1) / DECK_GROUP_SIZE);
  const slot = (withinDeck - 1) % DECK_GROUP_SIZE;

  return {
    flags: offset - withinDeck + group * DECK_GROUP_SIZE,
    bit: 7 - slot,
  };
}

export function overrideParseItem(item: Item): Item {
  // Covers the player name and every deck name; they share the encoding.
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    if (getInt(itemString.offset, "uint8") === TX_HALFWIDTH) {
      itemString.offset += 0x1;
      itemString.length -= 0x1;
      itemString.letterDataType = "uint8";
      itemString.fallback = 0x20;
      itemString.resource = "lettersAscii";
    }

    return itemString;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && MASKED_IDS.includes(item.id as string)) {
    const itemInt = item as ItemInt;

    return [true, getMasked(itemInt.offset, maskedLength(itemInt))];
  }

  if ("id" in item && item.id === "deckCard") {
    const itemInt = item as ItemInt;

    const { flags, bit } = deckCardLocation(itemInt.offset);

    const low = getInt(itemInt.offset, "uint8");
    const high = getInt(flags, "bit", { bit });

    return [true, low | (high << 0x8)];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && MASKED_IDS.includes(item.id as string)) {
    const itemInt = item as ItemInt;

    setMasked(itemInt.offset, maskedLength(itemInt), parseInt(value) || 0x0);

    return true;
  }

  if ("id" in item && item.id === "deckCard") {
    const itemInt = item as ItemInt;

    const { flags, bit } = deckCardLocation(itemInt.offset);

    const int = parseInt(value) || 0x0;

    setInt(itemInt.offset, "uint8", int & 0xff);
    setInt(flags, "bit", (int >> 0x8) & 0x1, { bit });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "card") {
    const itemInt = item as ItemInt;

    // Bit 7 is CARD_NOT_OWNED. Editing a count means the card has been seen,
    // so clear it -- otherwise the album still shows the card as unseen.
    setInt(itemInt.offset, "bit", 0x0, { bit: 7 });
  } else if ("id" in item && item.id === "collection") {
    // The Collection tab toggles CARD_NOT_OWNED directly (reversed bitflag).
    // Marking a card as seen with a count of 0 is a state the game never
    // produces, so give it one copy.
    const owned = getInt(flag.offset, "bit", { bit: 7 }) === 0x0;

    if (
      owned &&
      getInt(flag.offset, "uint8", {
        binary: { bitStart: 0, bitLength: 7 },
      }) === 0x0
    ) {
      setInt(flag.offset, "uint8", 0x1, {
        binary: { bitStart: 0, bitLength: 7 },
      });
    }
  }
}

// Transcribed from LoadSaveDataFromSRAM `.loop_checksum`
// (poketcg2/src/engine/save.asm). Two accumulators over the *unmasked* values:
// checksum0 is an 8-bit sum, checksum1 an 8-bit xor. They are stored swapped,
// checksum1 first, which the item's bigEndian flag accounts for.
//
// The seed is read from the save and preserved -- never regenerated. The game
// picks a fresh one on each of its own saves, and it is what the stored
// checksums were computed against.
export function generateChecksum(item: ItemChecksum): number {
  let checksum0 = 0x0;
  let checksum1 = 0x0;

  for (
    let offset = item.control.offsetStart;
    offset < item.control.offsetEnd;
    offset += 0x1
  ) {
    const value = (getInt(offset, "uint8") - maskAt(offset)) & 0xff;

    checksum1 ^= value;
    checksum0 = (checksum0 + value) & 0xff;
  }

  return formatChecksum((checksum1 << 0x8) | checksum0, item.dataType);
}
