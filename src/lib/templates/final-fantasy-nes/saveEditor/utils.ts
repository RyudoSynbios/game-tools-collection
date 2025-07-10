import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  DataViewABL,
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemString,
  Resource,
} from "$lib/types";

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = $gameTemplate.items[0] as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return [];
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (checksum === getInt(itemChecksum.offset, "uint8", {}, dataView)) {
    return ["usa", "japan"];
  }

  return [];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/name-/)) {
    updateResources("characterNames");
  } else if ("id" in item && item.id === "hiddenEvents") {
    const itemBitflags = item as ItemBitflags;
    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    if (i !== item.offset) {
      checksum += getInt(i, "uint8", {}, dataView);
    }
  }

  while (checksum > 0xff) {
    checksum = (checksum & 0xff) + (checksum >> 0x8);
  }

  checksum ^= 0xff;

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(): Resource {
  const names: Resource = {};

  const itemString = getItem(`name-0`) as ItemString;

  [...Array(4).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x40,
      itemString.length,
      itemString.letterDataType,
      {
        resource: "letters",
      },
    );

    names[index] = name;
  });

  names[0x9] = "-";

  return names;
}
