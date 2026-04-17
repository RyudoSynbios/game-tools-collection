import { getInt, setInt } from "$lib/utils/bytes";

import { Item, ItemBitflag, ItemBitflags, ItemInt } from "$lib/types";

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    setInt(itemInt.offset, "bit", 1, { bit: 7 });
  } else if ("id" in item && item.id === "hiddenEvents") {
    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    setInt(flag.offset + 0x1, "bit", checked, { bit: flag.bit });
    setInt(flag.offset + 0x2, "bit", checked, { bit: flag.bit });
  } else if ("id" in item && item.id?.match(/trophies-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift;

    let count = 0;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      count += getInt(offset + i * 0x4, "uint32").toBitCount();
    }

    setInt(offset + 0x1a, "uint8", count);
  }
}
