import { extractBit, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/nintendoDs";
import { getRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
} from "$lib/types";

import { locations } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const checksum = getInt(shift + 0x14, "uint32", {}, dataView);

  if (checksum === 0x0) {
    return [];
  }

  return getRegions(dataView, shift);
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "quest") {
    const itemInt = item as ItemInt;

    const dataType = itemInt.dataType as "lower4" | "upper4";

    const quest = getInt(itemInt.offset, dataType);

    let status = 0x0;

    if (extractBit(quest, 3)) {
      status = 0x8;
    } else if (extractBit(quest, 2)) {
      status = 0x4;
    } else if (extractBit(quest, 0)) {
      status = 0x1;
    }

    return [true, status];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "quest") {
    const itemInt = item as ItemInt;

    const dataType = itemInt.dataType as "lower4" | "upper4";

    let status = parseInt(value);

    if (status === 0x8) {
      status = 0xc;
    }

    setInt(itemInt.offset, dataType, status);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const dataType = itemInt.dataType as "uint32";

    const int = getInt(itemInt.offset, dataType);

    setInt(itemInt.offset - shift, dataType, int);
    setInt(itemInt.offset - shift - 0x30, dataType, int);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    const location = locations[int];

    setInt(itemInt.offset - 0x163, "uint8", location.preview);
    setInt(itemInt.offset - 0x133, "uint8", location.preview);
    setInt(itemInt.offset - 0x128, "uint8", location.preview);

    // We force Red to mount Dahak
    setInt(itemInt.offset - 0x118, "bit", 0, { bit: 0 });

    setInt(itemInt.offset + 0x1, "uint8", location.area);
    setInt(itemInt.offset + 0x2, "uint8", location.zone);

    setInt(itemInt.offset + 0xb, "uint32", location.coordinates[0]);
    setInt(itemInt.offset + 0xf, "uint32", location.coordinates[1]);
    setInt(itemInt.offset + 0x13, "uint32", location.coordinates[2]);

    setInt(itemInt.offset + 0x1b, "uint32", location.coordinates[0]);
    setInt(itemInt.offset + 0x1f, "uint32", location.coordinates[1]);
    setInt(itemInt.offset + 0x23, "uint32", location.coordinates[2]);
  } else if ("id" in item && item.id === "pendingQuest") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x9, "bit", int === 0x0 ? 0 : 1, { bit: 0 });
  } else if ("id" in item && item.id?.match(/parts-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0x4f; i += 0x1) {
      count += getInt(offset + i, "uint8");
    }

    setInt(offset - 0x2, "uint8", count);
  } else if ("id" in item && item.id === "albumFragments") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.label.match(/^Fragment/) && hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }

    let count = 0;

    itemBitflags.flags.forEach((flag) => {
      if (!flag.hidden) {
        count += getInt(flag.offset, "bit", { bit: flag.bit });
      }
    });

    const completed = count === 4 ? 1 : 0;

    const unknownFlag = itemBitflags.flags.at(-3)!;
    const photoFlag = itemBitflags.flags.at(-2)!;

    setInt(unknownFlag.offset, "bit", completed, { bit: unknownFlag.bit });
    setInt(photoFlag.offset, "bit", completed, { bit: photoFlag.bit });
  } else if ("id" in item && item.id === "albumPhoto") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    itemBitflags.flags.slice(0, 4).forEach((flag) => {
      setInt(flag.offset, "bit", checked, { bit: flag.bit });
    });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
