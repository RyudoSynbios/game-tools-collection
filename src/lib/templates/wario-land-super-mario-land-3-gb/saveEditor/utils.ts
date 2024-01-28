import { extractBit, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { Item, ItemBitflag, ItemChecksum } from "$lib/types";

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/level-/)) {
    const split = item.id.split("-");

    let offsetIndex = parseInt(split[1]);

    const offset = flag.offset - offsetIndex + 1;

    let int = 0;

    const worlds = [
      getInt(offset, "uint8"),
      getInt(offset + 0x1, "uint8"),
      getInt(offset + 0x5, "uint8"),
      getInt(offset + 0x6, "uint8"),
      getInt(offset + 0x7, "uint8"),
      getInt(offset + 0x8, "uint8"),
      getInt(offset + 0x9, "uint8"),
    ];

    worlds.forEach((world, index) => {
      int += world.toBitCount();

      const conditions = [
        index === 0 && extractBit(world, 2) && extractBit(world, 3),
        index === 1 && extractBit(world, 1) && extractBit(world, 2),
        index === 2 && extractBit(world, 3) && extractBit(world, 4),
        index === 5 && extractBit(world, 1) && extractBit(world, 2),
        index === 5 && extractBit(world, 3) && extractBit(world, 4),
      ];

      int -= conditions.filter(Boolean).length;
    });

    setInt(offset + 0x2, "uint8", int, { binaryCodedDecimal: true });
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
