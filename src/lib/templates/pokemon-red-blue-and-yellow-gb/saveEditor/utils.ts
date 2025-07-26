import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { copyInt, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { capitalize, clone } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  DataViewABL,
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

import { japanAdaptater, japanShift } from "./utils/japan";
import { moveList, pokemonList } from "./utils/resource";

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 1) {
    shifts = [...shifts, -0xa];
  }

  return shifts;
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemSection = $gameTemplate.items[0] as ItemSection;
  const itemChecksum = clone(itemSection.items[0]) as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  for (let i = 0x0; i < 0x2; i += 0x1) {
    itemChecksum.offset += i * 0x71;
    itemChecksum.control.offsetEnd += i * 0x71;

    const checksum = generateChecksum(itemChecksum, dataView);

    if (checksum === getInt(itemChecksum.offset, "uint8", {}, dataView)) {
      switch (i) {
        case 0x0:
          return ["europe_usa_france_italy_spain", "germany"];
        case 0x1:
          return ["japan"];
      }
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/checksumBox-/)) {
    const itemChecksum = item as ItemChecksum;

    const [index] = item.id.splitInt();

    if (index === 0) {
      itemChecksum.control.offsetStart += 0xf40;
      itemChecksum.control.offsetEnd += 0xf40;
    }

    if (index >= 6) {
      itemChecksum.offset += 0x1ffa;
    }
  } else if ("id" in item && item.id === "yellowExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = isYellowVersion();

    return itemInt;
  } else if ("id" in item && item.id === "yellowOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = !isYellowVersion();

    return itemInt;
  }

  return japanAdaptater(item);
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "boxes" && $gameRegion !== 1) {
    if (index === getCurrentBox()) {
      return [true, [...shifts, -0xf40]];
    } else if (index >= 6) {
      return [true, [...shifts, 0x2000 + item.length * (index - 0x6)]];
    }
  }

  if ($gameRegion === 1) {
    if (item.id === "bagItems") {
      return [true, [...shifts, 0x5, index * item.length]];
    } else if (item.id === "boxes") {
      if (index === getCurrentBox()) {
        return [true, [...shifts, -0xfbf]];
      } else if (index >= 4) {
        return [true, [...shifts, 0x2000 + item.length * (index - 0x4)]];
      }
    } else if (item.id === "pokemonTab-party") {
      return [true, [...shifts, -0x4d, index * item.length]];
    } else if (item.id?.match(/pokemonTab-box-/)) {
      const [boxIndex] = item.id.splitInt();

      if (boxIndex !== getCurrentBox()) {
        return [true, [...shifts, 0x14, index * item.length]];
      }
    } else if (item.id === "pokemonTab-daycare") {
      return [true, [...shifts, -0x4d]];
    } else if (item.id === "hallOfFameDetails") {
      return [true, [...shifts, 0xa, index * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/pokemonUnset/)) {
    if ("flags" in item) {
      const itemBitflags = item as ItemBitflags;

      const [shift] = item.id.splitInt();

      const pokemonIndex = getInt(
        itemBitflags.flags[0].offset - shift,
        "uint8",
      );

      itemBitflags.disabled = pokemonIndex === 0xff;
    } else {
      const itemInt = item as ItemInt;

      const [, index] = item.id.splitInt();
      let [shift] = item.id.splitInt();

      if (item.id.match(/^move/)) {
        shift += index;
      }

      const pokemonIndex = getInt(itemInt.offset - shift, "uint8");

      itemInt.disabled = pokemonIndex === 0xff;
    }
  }

  if ("id" in item && item.id?.match(/pokemonTab-/)) {
    const itemTabs = item as ItemTabs;

    if (item.id.match(/daycare/)) {
      return itemTabs;
    }

    const isHallOfFale = item.id.match(/hallOfFame/);

    const slotsItem = getItem(
      item.id.replace("pokemonTab", "pokemonSlots"),
    ) as ItemInt;

    let slots = getInt(slotsItem.offset, "uint8");

    if (!isHallOfFale && slots === 0xff) {
      slots = 0x0;
    }

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if (
    "id" in item &&
    (item.id?.match(/name-pokemon/) || item.id?.match(/name-originalTrainer/))
  ) {
    const itemString = item as ItemString;

    const [boxIndex, index] = item.id.splitInt();

    let itemId = `pokemon-party-0-${boxIndex}`;

    if (item.id.match(/Box/)) {
      itemId = `pokemon-box-${boxIndex}-${index}`;
    }

    const nameItem = getItem(itemId) as ItemString;

    const pokemonIndex = getInt(nameItem.offset, "uint8");

    itemString.disabled = pokemonIndex === 0xff;

    return itemString;
  } else if ("id" in item && item.id?.match(/moveMaxPP-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x15, "uint8");

    let move = moveList.find((move) => move.index === int);

    if (itemInt.disabled) {
      move = undefined;
    }

    itemInt.resource = `move${move?.maxPP || 0}PPs`;
    itemInt.disabled = !Boolean(move);

    return itemInt;
  } else if ("id" in item && item.id?.match(/HallOfFame-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x10 - shift;

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      if (getInt(offset + i * 0x10, "uint8") === 0xff) {
        break;
      }

      count += 1;
    }

    let disabled = index >= count;

    if (item.id.match(/pokemonHallOfFame/) && index === count) {
      disabled = false;
    }

    itemInt.disabled = disabled;

    return itemInt;
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    const offset = itemInt.offset - 0x1 - index * 0x2 - shift;

    const int = getInt(offset, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [
  boolean,
  number | string | (ItemBitflag & { checked: boolean })[] | undefined,
] {
  if ("id" in item && item.id?.match(/pokemonUnset/)) {
    if ("flags" in item) {
      const itemBitflags = item as ItemBitflags;

      const flags = itemBitflags.flags.reduce(
        (flags: (ItemBitflag & { checked: boolean })[], flag) => {
          flags.push({ ...flag, checked: false, disabled: true });

          return flags;
        },
        [],
      );

      if (itemBitflags.disabled) {
        return [true, flags];
      }
    } else {
      const itemInt = item as ItemInt;

      if (itemInt.disabled) {
        return [true, 0x0];
      }
    }
  }

  if ("id" in item && item.id === "badges") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint8").toBitCount();

    return [true, count];
  } else if ("id" in item && item.id?.match(/ownedPokemon/)) {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x13; i += 0x1) {
      count += getInt(itemInt.offset + i, "uint8").toBitCount();
    }

    return [true, count];
  } else if (
    "id" in item &&
    (item.id?.match(/name-pokemon/) || item.id?.match(/name-originalTrainer/))
  ) {
    const itemString = item as ItemString;

    if (itemString.disabled) {
      return [true, ""];
    }
  } else if ("id" in item && item.id === "type2") {
    const itemInt = item as ItemInt;

    const type1 = getInt(itemInt.offset - 0x1, "uint8");
    const type2 = getInt(itemInt.offset, "uint8");

    if (type1 === type2) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id?.match(/HallOfFame-/)) {
    if (item.id.match(/name/)) {
      const itemString = item as ItemString;

      if (itemString.disabled) {
        return [true, ""];
      }
    } else {
      const itemInt = item as ItemInt;

      if (itemInt.disabled) {
        if (item.id.match(/pokemon/)) {
          return [true, 0xff];
        }

        return [true, 0x0];
      }
    }
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/^pokemon-/)) {
    const itemInt = item as ItemInt;

    const [boxIndex, index] = item.id.splitInt();

    const pokemonIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset, "uint8", pokemonIndex);

    const pokemon = pokemonList.find(
      (pokemon) => pokemon.index === pokemonIndex,
    );

    const isBox = Boolean(item.id.match(/box-/));
    const isParty = Boolean(item.id.match(/party-/));

    const statsOffset = getPokemonStatsOffset(itemInt.offset, index, isBox);

    setInt(statsOffset, "uint8", pokemonIndex);
    setInt(statsOffset + 0x5, "uint8", pokemon?.types[0] || 0x0);
    setInt(statsOffset + 0x6, "uint8", pokemon?.types[1] || 0x0);

    if (previous === 0xff) {
      setInt(itemInt.offset - index - 0x1, "uint8", index + 0x1);
      setInt(itemInt.offset + 0x1, "uint8", 0xff);

      initPokemon(statsOffset, index, isBox, boxIndex);
    } else if (pokemonIndex === 0xff) {
      setInt(itemInt.offset - index - 0x1, "uint8", index);
    }

    if (isBox) {
      updatePokemonNames(`box-${boxIndex}`);
    } else if (isParty) {
      updatePokemonNames("party");
    }

    return true;
  } else if ("id" in item && item.id?.match(/pokemonHallOfFame-/)) {
    const itemInt = item as ItemInt;

    const pokemonIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset, "uint8", pokemonIndex);

    if (previous === 0xff) {
      setInt(itemInt.offset + 0x1, "uint8", 0x1); // Level
      setInt(itemInt.offset + 0x2, "uint8", 0x50); // Pokémon Name
      setInt(itemInt.offset + 0x10, "uint8", 0xff); // Next Pokémon
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    const [boxIndex] = item.id.splitInt();

    setInt(itemString.offset + itemString.length, "uint8", 0x50);

    if (item.id?.match(/pokemonParty/)) {
      updatePokemonNames("party");
    } else if (item.id?.match(/pokemonBox/)) {
      updatePokemonNames(`box-${boxIndex}`);
    }
  } else if ("id" in item && item.id?.match(/itemSlots-/)) {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset + 0x1 + count * 0x2;

    setInt(offset, "uint8", 0xff);

    for (let i = 0x0; i < count; i += 0x1) {
      const offset = itemInt.offset + 0x1 + i * 0x2;

      const itemIndex = getInt(offset, "uint8");

      if (itemIndex === 0xff) {
        setInt(offset, "uint8", 0x0);
        setInt(offset + 0x1, "uint8", 0x0);
      }
    }
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    let quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (itemIndex !== 0x0 && quantity === 0x0) {
      quantity = 0x1;
    } else if (itemIndex === 0x0) {
      quantity = 0x0;
    }

    setInt(itemInt.offset + 0x1, "uint8", quantity);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  checksum ^= 0xff;

  return formatChecksum(checksum, item.dataType);
}

// This function only works for parsing processes
export function getCurrentBox(): number {
  const box = getItem("currentBox") as ItemInt;

  return getInt(box.offset - japanShift(0xa), "uint8", {
    binary: { bitStart: 0, bitLength: 7 },
  });
}

export function getPokemonNames(type: string): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  const slotsItem = getItem(`pokemonSlots-${type}`) as ItemInt;
  const nameItem = getItem(`name-pokemon${capitalize(type)}-0`) as ItemString;

  let slots = getInt(slotsItem.offset, "uint8");

  if (slots === 0xff) {
    slots = 0x0;
  }

  let count = 0x6;

  if (type.match(/box/)) {
    if ($gameRegion === 1) {
      count = 0x1e;
    } else {
      count = 0x14;
    }
  }

  for (let i = 0x0; i < count; i += 0x1) {
    if (i < slots) {
      names[i] = getString(
        nameItem.offset + i * nameItem.overrideShift!.shift,
        nameItem.length,
        nameItem.letterDataType,
        { endCode: nameItem.endCode, resource: nameItem.resource },
      );
    } else {
      names[i] = "???";
    }
  }

  return names;
}

function getPokemonNameOffset(type: string, index: number): number {
  const nameItem = getItem(
    `name-pokemon${capitalize(type)}-${index}`,
  ) as ItemString;

  return nameItem.offset;
}

function getTrainerNameOffset(type: string, index: number): number {
  const nameItem = getItem(
    `name-originalTrainer${capitalize(type)}-${index}`,
  ) as ItemString;

  return nameItem.offset;
}

function getPokemonStatsOffset(
  offset: number,
  index: number,
  isBox: boolean,
): number {
  const $gameRegion = get(gameRegion);

  let shift = 0x7;
  let instanceShift = 0x2c;

  if (isBox) {
    if ($gameRegion === 1) {
      shift = 0x1f;
    } else {
      shift = 0x15;
    }

    instanceShift = 0x21;
  }

  return offset + index * instanceShift - index + shift;
}

function initPokemon(
  offset: number,
  index: number,
  isBox: boolean,
  boxIndex: number,
): void {
  const nameItem = getItem("name-trainer") as ItemString;

  const pokemonOffset = getPokemonNameOffset(
    isBox ? `box-${boxIndex}` : "party",
    index,
  );

  const trainerSrcOffset = nameItem.offset;
  const trainerDstOffset = getTrainerNameOffset(
    isBox ? `box-${boxIndex}` : "party",
    index,
  );

  const noIdSrcOffset = nameItem.offset + 0x6d - japanShift(0xa);

  setInt(pokemonOffset, "uint8", 0x50); // Pokémon Name
  copyInt(trainerSrcOffset, trainerDstOffset, nameItem.length); // Trainer Name

  setInt(offset + 0x1, "uint16", 0x1, { bigEndian: true }); // HP
  setInt(offset + 0x3, "uint8", 0x0); // Level Preview
  setInt(offset + 0x4, "uint8", 0x0); // Condition
  setInt(offset + 0x7, "uint8", 0x0); // Catch Rate
  setInt(offset + 0x8, "uint8", 0x0); // Move 1
  setInt(offset + 0x9, "uint8", 0x0); // Move 2
  setInt(offset + 0xa, "uint8", 0x0); // Move 3
  setInt(offset + 0xb, "uint8", 0x0); // Move 4
  copyInt(noIdSrcOffset, offset + 0xc, 0x2); // No ID
  setInt(offset + 0xe, "uint24", 0x0, { bigEndian: true }); // Experience
  setInt(offset + 0x11, "uint16", 0x0, { bigEndian: true }); // HP EV
  setInt(offset + 0x13, "uint16", 0x0, { bigEndian: true }); // Attack EV
  setInt(offset + 0x15, "uint16", 0x0, { bigEndian: true }); // Defense EV
  setInt(offset + 0x17, "uint16", 0x0, { bigEndian: true }); // Speed EV
  setInt(offset + 0x19, "uint16", 0x0, { bigEndian: true }); // Special EV
  setInt(offset + 0x1b, "uint8", 0x0); // Attack / Defense IV
  setInt(offset + 0x1c, "uint8", 0x0); // Speed / Special IV
  setInt(offset + 0x1d, "uint8", 0x0); // Move 1 PP
  setInt(offset + 0x1e, "uint8", 0x0); // Move 2 PP
  setInt(offset + 0x1f, "uint8", 0x0); // Move 3 PP
  setInt(offset + 0x20, "uint8", 0x0); // Move 4 PP

  if (!isBox) {
    setInt(offset + 0x21, "uint8", 0x1); // Level
    setInt(offset + 0x22, "uint16", 0x1, { bigEndian: true }); // Max HP
    setInt(offset + 0x24, "uint16", 0x0, { bigEndian: true }); // Attack
    setInt(offset + 0x26, "uint16", 0x0, { bigEndian: true }); // Defense
    setInt(offset + 0x28, "uint16", 0x0, { bigEndian: true }); // Speed
    setInt(offset + 0x2a, "uint16", 0x0, { bigEndian: true }); // Special
  }
}

// This function only works for parsing processes
export function isYellowVersion(): boolean {
  const box = getItem("isYellowVersion") as ItemInt;

  return Boolean(getInt(box.offset - japanShift(0xa), "uint8"));
}

export function onBoxChange(tabIndex: number): void {
  let type = "party";

  if (tabIndex > 0) {
    type = `box-${tabIndex - 1}`;
  }

  updatePokemonNames(type);
}

export function onMainTabChange(tabIndex: number): void {
  if (tabIndex !== 2) {
    return;
  }

  const pokemonItem = getItem("pokemon-daycare-0-0") as ItemInt;

  const hasPokemon = getInt(
    pokemonItem.offset - 0x17 + japanShift(0xa),
    "uint8",
  );

  if (!hasPokemon) {
    setInt(pokemonItem.offset, "uint8", 0xff);
  }
}

export function onPokemonChange(tabIndex: number, itemId: string): void {
  const [, ...types] = itemId.split("-");

  let type = "party-0";

  if (types[0] === "box") {
    type = types.join("-");
  }

  const pokemonItemSrc = getItem(`pokemon-${type}-${tabIndex}`) as ItemInt;
  const pokemonItemDst = getItem(
    `pokemonPreview-${type}-${tabIndex}`,
  ) as ItemInt;

  copyInt(pokemonItemSrc.offset, pokemonItemDst.offset);
}

export function updatePokemonNames(type: string): void {
  const values = getPokemonNames(type);

  updateResources("pokemonNames", values);
}
