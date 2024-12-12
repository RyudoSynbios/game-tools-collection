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
} from "$lib/types";

import Abilities from "./components/Abilities.svelte";
import { mognetLetters } from "./utils/resource";

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

export function getComponent(component: string): typeof Abilities | undefined {
  if (component === "Abilities") {
    return Abilities;
  }
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
    return getSlotShifts("correspondance", shifts, index, 1);
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
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint16");
    const locationType = getInt(itemInt.offset - 0x20, "uint8");

    if (locationType === 0x3) {
      int = 0x0;
    }

    return [true, int];
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

    if (int === 0x0) {
      setInt(itemInt.offset - 0x20, "uint8", 0x3);
    } else {
      setInt(itemInt.offset - 0x20, "uint8", 0x1);
    }

    setInt(itemInt.offset, "uint16", value);

    updateLocation(itemInt.offset, int);
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const itemString = item as ItemString;

    setString(
      itemString.offset,
      itemString.length,
      "uint8",
      value,
      itemString.fallback,
      {
        resource: itemString.resource,
      },
    );

    setInt(itemString.offset + value.length, "uint8", 0xff);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "disc") {
    const itemInt = item as ItemInt;

    setInt(itemInt.offset + 0x7c, "uint8", 0x3);

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

const dataArray = [
  0x0000, 0x1189, 0x2312, 0x329b, 0x4624, 0x57ad, 0x6536, 0x74bf, 0x8c48,
  0x9dc1, 0xaf5a, 0xbed3, 0xca6c, 0xdbe5, 0xe97e, 0xf8f7, 0x1081, 0x0108,
  0x3393, 0x221a, 0x56a5, 0x472c, 0x75b7, 0x643e, 0x9cc9, 0x8d40, 0xbfdb,
  0xae52, 0xdaed, 0xcb64, 0xf9ff, 0xe876, 0x2102, 0x308b, 0x0210, 0x1399,
  0x6726, 0x76af, 0x4434, 0x55bd, 0xad4a, 0xbcc3, 0x8e58, 0x9fd1, 0xeb6e,
  0xfae7, 0xc87c, 0xd9f5, 0x3183, 0x200a, 0x1291, 0x0318, 0x77a7, 0x662e,
  0x54b5, 0x453c, 0xbdcb, 0xac42, 0x9ed9, 0x8f50, 0xfbef, 0xea66, 0xd8fd,
  0xc974, 0x4204, 0x538d, 0x6116, 0x709f, 0x0420, 0x15a9, 0x2732, 0x36bb,
  0xce4c, 0xdfc5, 0xed5e, 0xfcd7, 0x8868, 0x99e1, 0xab7a, 0xbaf3, 0x5285,
  0x430c, 0x7197, 0x601e, 0x14a1, 0x0528, 0x37b3, 0x263a, 0xdecd, 0xcf44,
  0xfddf, 0xec56, 0x98e9, 0x8960, 0xbbfb, 0xaa72, 0x6306, 0x728f, 0x4014,
  0x519d, 0x2522, 0x34ab, 0x0630, 0x17b9, 0xef4e, 0xfec7, 0xcc5c, 0xddd5,
  0xa96a, 0xb8e3, 0x8a78, 0x9bf1, 0x7387, 0x620e, 0x5095, 0x411c, 0x35a3,
  0x242a, 0x16b1, 0x0738, 0xffcf, 0xee46, 0xdcdd, 0xcd54, 0xb9eb, 0xa862,
  0x9af9, 0x8b70, 0x8408, 0x9581, 0xa71a, 0xb693, 0xc22c, 0xd3a5, 0xe13e,
  0xf0b7, 0x0840, 0x19c9, 0x2b52, 0x3adb, 0x4e64, 0x5fed, 0x6d76, 0x7cff,
  0x9489, 0x8500, 0xb79b, 0xa612, 0xd2ad, 0xc324, 0xf1bf, 0xe036, 0x18c1,
  0x0948, 0x3bd3, 0x2a5a, 0x5ee5, 0x4f6c, 0x7df7, 0x6c7e, 0xa50a, 0xb483,
  0x8618, 0x9791, 0xe32e, 0xf2a7, 0xc03c, 0xd1b5, 0x2942, 0x38cb, 0x0a50,
  0x1bd9, 0x6f66, 0x7eef, 0x4c74, 0x5dfd, 0xb58b, 0xa402, 0x9699, 0x8710,
  0xf3af, 0xe226, 0xd0bd, 0xc134, 0x39c3, 0x284a, 0x1ad1, 0x0b58, 0x7fe7,
  0x6e6e, 0x5cf5, 0x4d7c, 0xc60c, 0xd785, 0xe51e, 0xf497, 0x8028, 0x91a1,
  0xa33a, 0xb2b3, 0x4a44, 0x5bcd, 0x6956, 0x78df, 0x0c60, 0x1de9, 0x2f72,
  0x3efb, 0xd68d, 0xc704, 0xf59f, 0xe416, 0x90a9, 0x8120, 0xb3bb, 0xa232,
  0x5ac5, 0x4b4c, 0x79d7, 0x685e, 0x1ce1, 0x0d68, 0x3ff3, 0x2e7a, 0xe70e,
  0xf687, 0xc41c, 0xd595, 0xa12a, 0xb0a3, 0x8238, 0x93b1, 0x6b46, 0x7acf,
  0x4854, 0x59dd, 0x2d62, 0x3ceb, 0x0e70, 0x1ff9, 0xf78f, 0xe606, 0xd49d,
  0xc514, 0xb1ab, 0xa022, 0x92b9, 0x8330, 0x7bc7, 0x6a4e, 0x58d5, 0x495c,
  0x3de3, 0x2c6a, 0x1ef1, 0x0f78,
];

export function generateChecksum(item: ItemChecksum): number {
  const checksum = generateCrcCcitt(item, dataArray);

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): {
  [value: number]: string;
} {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: { [value: number]: string } = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  [...Array(9).keys()].forEach((index) => {
    const name = trimCharacterName(
      itemString,
      itemString.offset + index * 0x90,
    );

    names[index] = name.trim() || "???";
  });

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
