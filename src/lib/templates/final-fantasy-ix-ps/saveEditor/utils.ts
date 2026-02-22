import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import Abilities from "./components/Abilities.svelte";
import { mognetLetters } from "./utils/resource";

export function getComponent(component: string): typeof Abilities | undefined {
  switch (component) {
    case "Abilities":
      return Abilities;
  }
}

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id === "time" &&
    ($gameRegion === 1 || $gameRegion === 2)
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if (
    "id" in item &&
    item.id?.match(/characterName-/) &&
    $gameRegion === 2
  ) {
    const itemString = item as ItemString;

    itemString.length = 0x6;

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts("correspondance", shifts, index, { leadingZeros: 1 });
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    let disc = getInt(itemInt.offset - 0x9c, "uint8");

    if (disc === 0x4) {
      disc = 0x3;
    } else if (disc === 0x8) {
      disc = 0x4;
    }

    itemInt.resource = `disc${disc}Locations`;

    return itemInt;
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x1, "uint8");
    const quantity = getInt(itemInt.offset, "uint8");

    itemInt.disabled = itemIndex === 0xff || quantity === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationType = getInt(itemInt.offset - 0x20, "uint8");

    if (locationType === 0x3) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const itemString = item as ItemString;

    const string = trimCharacterName(item, itemString.offset);

    return [true, string];
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    let itemIndex = getInt(itemInt.offset, "uint8");
    const quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (quantity === 0x0) {
      itemIndex = 0xff;
    }

    return [true, itemIndex];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint16", value);

    updateLocation(itemInt.offset, int);
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const itemString = item as ItemString;

    // prettier-ignore
    setString(itemString.offset, itemString.length, "uint8", value, itemString.fallback, {
      resource: itemString.resource,
    });

    setInt(itemString.offset + value.length, "uint8", 0xff);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "disc") {
    const itemInt = item as ItemInt;

    const disc = getInt(itemInt.offset, "uint8");
    let progression = getInt(itemInt.offset + 0xbc, "uint16");

    if (disc === 0x1 && progression > 0xf3b) {
      progression = 0xf3b;
    } else if (disc === 0x2 && progression < 0xf3c) {
      progression = 0xf3c;
    } else if (disc === 0x2 && progression > 0x1b4d) {
      progression = 0x1b4d;
    } else if (disc === 0x4 && progression < 0x1b4e) {
      progression = 0x1b4e;
    } else if (disc === 0x4 && progression > 0x2af2) {
      progression = 0x2af2;
    } else if (disc === 0x8 && progression < 0x2b52) {
      progression = 0x2b52;
    }

    setInt(itemInt.offset + 0xbc, "uint16", progression);

    updateLocation(itemInt.offset + 0x9c);
  } else if ("id" in item && item.id === "gil") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0xdb8, "uint32", int);
  } else if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, formationIndex] = item.id.splitInt();

    const characterIndex = getInt(itemInt.offset, "uint8");

    let enabled = 0x0;
    let portrait = 0xff;
    let name = "";
    let level = 0x0;

    const itemString = getItem(
      `slot-${slotIndex}-characterName-0`,
    ) as ItemString;

    if (characterIndex !== 0x9) {
      const offset = itemString.offset + characterIndex * 0x90;

      const characterId = getInt(offset + 0x34, "uint8");

      enabled = 0x1;
      name = trimCharacterName(itemString, offset);
      level = getInt(offset + 0xb, "uint8");

      switch (characterId) {
        case 0x0:
        case 0x10:
          portrait = 0x0;
          break;
        case 0x21:
          portrait = 0x1;
          break;
        case 0x32:
        case 0x42:
          portrait = 0x2;
          break;
        case 0x73:
          portrait = 0x4;
          break;
        case 0x95:
          portrait = 0x5;
          break;
        case 0xa6:
        case 0xb6:
          portrait = 0x6;
          break;
        case 0xc4:
          portrait = 0x7;
          break;
        case 0xd7:
          portrait = 0x8;
          break;
        case 0xf6:
          portrait = 0x9;
          break;
      }
    }

    if (formationIndex === 0x0) {
      const offset = itemInt.offset - formationIndex - 0xddb;

      setInt(offset, "uint8", level);
      setString(
        offset + 0x1,
        itemString.length,
        "uint8",
        name,
        itemString.fallback,
        {
          resource: itemString.resource,
        },
      );
    }

    const offset =
      itemInt.offset - formationIndex - 0xdac + formationIndex * 0x10;

    setInt(offset, "uint8", enabled);
    setInt(offset + 0x1, "uint8", portrait);
    setInt(offset + 0xc, "uint8", level);

    setString(
      offset + 0x2,
      itemString.length,
      "uint8",
      name,
      itemString.fallback,
      {
        resource: itemString.resource,
      },
    );
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");
    const quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (itemIndex === 0xff) {
      setInt(itemInt.offset + 0x1, "uint8", 0x0);
    } else if (quantity === 0x0) {
      setInt(itemInt.offset + 0x1, "uint8", 0x1);
    }
  } else if ("id" in item && item.id === "mognetLetter") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const letter = mognetLetters[int];

    let enabled = 0x0;
    let sender = 0x0;
    let receiver = 0x0;

    if (letter) {
      enabled = 0x1;
      sender = letter.sender;
      receiver = letter.receiver;
    }

    setInt(itemInt.offset - 0x1, "uint8", enabled);
    setInt(itemInt.offset + 0x1, "uint8", sender);
    setInt(itemInt.offset + 0x2, "uint8", receiver);
  } else if ("id" in item && item.id?.match(/mognetDeliveredLetters/)) {
    const itemBitflags = item as ItemBitflags;

    const total = getItem(`${itemBitflags.id}Total`) as ItemInt;

    let count = 0;

    itemBitflags.flags.forEach((flag, index) => {
      const itemBitflag = flag as ItemBitflag;

      if (
        ![
          0, 4, 9, 12, 15, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
          35,
        ].includes(index)
      ) {
        count += getInt(itemBitflag.offset, "bit", {
          bit: itemBitflag.bit,
        });
      }
    });

    setInt(total.offset, "uint8", count);
  } else if ("id" in item && item.id?.match(/stiltzkinItemSets/)) {
    const itemBitflags = item as ItemBitflags;

    const int = getInt(flag.offset, "bit", { bit: flag.bit });

    for (let i = 1; i <= 3; i += 1) {
      setInt(flag.offset, "bit", int, { bit: flag.bit + i });
    }

    const total = getItem(`${itemBitflags.id}Total`) as ItemInt;

    let count = 0;

    itemBitflags.flags.forEach((flag, index) => {
      const itemBitflag = flag as ItemBitflag;

      if (!itemBitflag.hidden && index !== itemBitflags.flags.length - 1) {
        count += getInt(itemBitflag.offset, "bit", {
          bit: itemBitflag.bit,
        });
      }
    });

    setInt(total.offset, "uint8", count);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  const checksum = generateCrcCcitt(item);

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  for (let i = 0x0; i < 0x9; i += 0x1) {
    names[i] = trimCharacterName(
      itemString,
      itemString.offset + i * 0x90,
    ).trim();
  }

  names[0x9] = "-";

  return names;
}

function trimCharacterName(item: Item, offset: number): string {
  const itemString = item as ItemString;

  let string = getString(offset, itemString.length, "uint8", {
    resource: itemString.resource,
  });

  for (let i = 0x0; i < itemString.length; i += 0x1) {
    if (getInt(offset + i, "uint8") === 0xff) {
      string = string.substring(0, i);
      break;
    }
  }

  return string;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

function updateLocation(offset: number, value = 0x0): void {
  let locationType = 0x1;

  // If location is World Map, we force the Location Type
  if (value === 0x0) {
    locationType = 0x3;
  }

  setInt(offset - 0x20, "uint8", locationType);

  let disc = getInt(offset - 0x9c, "uint8");

  if (disc === 0x4) {
    disc = 0x3;
  } else if (disc === 0x8) {
    disc = 0x4;
  }

  const locations = getResource(`disc${disc}Locations`);

  if (locations) {
    const locationString = locations[value] as string;

    setString(offset - 0x90, 0x1c, "uint8", locationString, 0xff, {
      resource: "letters",
    });
  }
}
