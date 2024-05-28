import { get } from "svelte/store";

import { fileHeaderShift } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/nintendoDs";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetInt(
  item: Item,
): [boolean, (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "abilities") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked:
            getInt(flag.offset, flag.bit === 0 ? "lower4" : "upper4") > 0,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/gold-/)) {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    const goldSp = getItem(item.id.replace("gold", "goldSp")) as ItemInt;

    if (goldSp) {
      setInt(goldSp.offset, "uint32", value);
    }
  } else if ("id" in item && item.id?.match(/location-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let value = int;

    switch (int) {
      case 0x1:
        value = 0x4;
        break;
      case 0x2:
        value = 0x1;
        break;
      case 0x3:
        value = 0x2;
        break;
      case 0x4:
        value = 0x3;
        break;
      case 0x7:
        value = 0x8;
        break;
      case 0x8:
        value = 0x9;
        break;
      case 0x9:
        value = 0x7;
        break;
    }

    const locationSp = getItem(
      item.id.replace("location", "locationSp"),
    ) as ItemInt;

    if (locationSp) {
      setInt(locationSp.offset, "uint8", value);
    }
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    const levelSp = getItem(item.id.replace("level", "levelSp")) as ItemInt;

    if (levelSp) {
      setInt(levelSp.offset, "uint8", value);
    }
  } else if ("id" in item && item.id === "abilities") {
    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    setInt(
      flag.offset,
      flag.bit === 0 ? "lower4" : "upper4",
      isChecked ? 1 : 0,
    );
  }
}

const values = [
  0x0000, 0xcc01, 0xd801, 0x1400, 0xf001, 0x3c00, 0x2800, 0xe401, 0xa001,
  0x6c00, 0x7800, 0xb401, 0x5000, 0x9c01, 0x8801, 0x4400,
];

// Adapted from https://github.com/OpenEmu/DeSmuME-Core/blob/42d926603872451f1a1fb8aef16a2e65acdba76f/src/bios.cpp#L1071
export function generateChecksum(item: ItemChecksum): number {
  const $fileHeaderShift = get(fileHeaderShift);

  let offset = $fileHeaderShift + 0x90;

  if (item.id?.match(/checksumSlot-/)) {
    const split = item.id.split("-");

    const index = parseInt(split[1]);

    offset += (index + 1) * 0x4;
  }

  let checksum = getInt(offset, "uint16");

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    let int = getInt(i, "uint16");

    for (let j = 0x0; j < 0x4; j += 0x1) {
      let value = values[checksum & 0xf];

      checksum >>= 0x4;

      checksum ^= value;

      const valueTmp = int >> (j * 0x4);

      value = values[valueTmp & 0xf];

      checksum ^= value;
    }
  }

  return formatChecksum(checksum, item.dataType);
}
