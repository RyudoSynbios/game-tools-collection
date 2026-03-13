import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { isInRange } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
} from "$lib/types";

import { checksumShifts, isCrystal } from "../utils";

export function japanShift(shift: number): number {
  const $gameRegion = get(gameRegion);

  return $gameRegion === 1 ? shift : 0x0;
}

export function japanParseItemAdaptater(item: Item): Item {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id?.match(/^name/) && !item?.id.match(/-box-/)) {
    const itemString = item as ItemString;

    itemString.length = 0x5;

    if (itemString.overrideShift) {
      if (item.id.match(/daycare/)) {
        itemString.overrideShift = { parent: 1, shift: 0x2f };
      } else {
        itemString.overrideShift = { parent: 1, shift: 0x6 };
      }
    }
  }

  if ("id" in item && item.id?.match(/japanShift-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    itemInt.offset -= shift;
  }

  if ("id" in item && item.id?.match(/mail-(.*?)-(45|47)/)) {
    const itemInt = item as ItemInt;

    const [, shift] = item.id.splitInt();

    if (shift === 45) {
      itemInt.offset -= 0x6;
    } else if (shift === 47) {
      itemInt.offset -= 0x5;
    }
  }

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    if (isCrystal) {
      itemChecksum.offset += checksumShifts[3].offset;
      itemChecksum.control.offsetEnd += checksumShifts[3].offsetEnd;
    } else {
      itemChecksum.offset += checksumShifts[1].offset;
      itemChecksum.control.offsetEnd += checksumShifts[1].offsetEnd;
    }

    return itemChecksum;
  } else if ("id" in item && item.id === "boxes") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x54a;
    itemContainer.instances = 9;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/pokemon-box/)) {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0xa;

    return itemInt;
  } else if ("id" in item && item.id?.match(/name-pokemonName-box/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x118;

    return itemString;
  } else if ("id" in item && item.id?.match(/name-originalTrainer-box/)) {
    const itemString = item as ItemString;

    itemString.offset += 0x140;

    return itemString;
  } else if ("id" in item && item.id?.match(/pokemonTabs-box/)) {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = 30;

    return itemContainer;
  } else if ("id" in item && item.id === "pokemonTabs-daycare") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x2f;

    return itemContainer;
  } else if ("id" in item && item.id === "isDeposited-1") {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0xa;

    return itemInt;
  } else if ("id" in item && item.id === "mails") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x2a;

    return itemContainer;
  } else if ("id" in item && item.id === "hallOfFameTabs") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x44;

    return itemContainer;
  } else if ("id" in item && item.id === "hallOfFameParty") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0xb;

    return itemContainer;
  }

  return item;
}

export function japanParseContainerAdaptater(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if ($gameRegion !== 1) {
    return [false, undefined];
  }

  if (item.id === "boxes" && index >= 6) {
    return [true, [...shifts, 0x2000 + item.length * (index - 0x6)]];
  } else if (item.id?.match(/pokemonTabs-box/)) {
    return [true, [...shifts, 0xa, index * item.length]];
  }

  return [false, undefined];
}

const shifts = [
  [
    { offset: 0x2011, shift: -0x5 },
    { offset: 0x2016, shift: -0x5 },
    { offset: 0x201d, shift: -0x5 },
    { offset: 0x2023, shift: -0x5 },
    { offset: 0x2028, shift: -0xb },
    { offset: 0x2758, shift: -0x2d },
    { offset: 0x298a, shift: -0x1e },
    { offset: 0x29ae, shift: -0x14 },
    { offset: 0x2a31, shift: -0x5 },
    { offset: 0x2a36, shift: -0x5 },
  ],
  [
    { offset: 0x2011, shift: -0x5 },
    { offset: 0x2016, shift: -0x5 },
    { offset: 0x201d, shift: -0x5 },
    { offset: 0x2023, shift: -0x5 },
    { offset: 0x2028, shift: -0xb },
    { offset: 0x23ba, shift: +0x2 },
    { offset: 0x2508, shift: -0x20 },
    { offset: 0x26e2, shift: -0x5 },
    { offset: 0x2758, shift: -0x2d },
    { offset: 0x27e7, shift: +0x1 },
    { offset: 0x281a, shift: -0x2 },
    { offset: 0x2966, shift: -0x1e },
    { offset: 0x2977, shift: -0x14 },
    { offset: 0x2a0d, shift: -0x5 },
    { offset: 0x2a12, shift: -0x5 },
  ],
];

function getShift(offset: number): number {
  if (isInRange(offset, 0x600, 0xb9d)) {
    if (offset >= 0x6fc) {
      offset -= 0x1e;
    }

    if (offset >= 0x7f8) {
      offset -= 0x1e;
    }
  } else if (isInRange(offset, 0x2000, 0x2c8b)) {
    shifts[isCrystal ? 1 : 0].forEach((step) => {
      if (offset >= step.offset) {
        offset += step.shift;
      }
    });
  } else if (isInRange(offset, 0x31ba, 0x3fff)) {
    if (offset >= 0x31ba) {
      offset += 0x96;
    }
  }

  return offset;
}
