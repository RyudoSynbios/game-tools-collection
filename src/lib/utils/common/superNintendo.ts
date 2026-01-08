import { getInt } from "$lib/utils/bytes";

export function getTileData(
  offset: number,
  type: "3bpp" | "4bpp",
  data?: Uint8Array,
): number[] {
  const tileData = [];

  const jIncrement = type === "3bpp" ? 0x1 : 0x2;

  for (let i = 0x0, j = 0x0; i < 0x10; i += 0x2, j += jIncrement) {
    let rowA = 0x0;
    let rowB = 0x0;
    let rowC = 0x0;
    let rowD = 0x0;

    if (data) {
      rowA = data[offset + i];
      rowB = data[offset + i + 0x1];
      rowC = data[offset + j + 0x10];
      rowD = data[offset + j + 0x11];
    } else {
      rowA = getInt(offset + i, "uint8");
      rowB = getInt(offset + i + 0x1, "uint8");
      rowC = getInt(offset + j + 0x10, "uint8");
      rowD = getInt(offset + j + 0x11, "uint8");
    }

    for (let k = 0x7; k >= 0x0; k -= 0x1) {
      let index =
        ((rowA >> k) & 0x1) |
        (((rowB >> k) & 0x1) << 0x1) |
        (((rowC >> k) & 0x1) << 0x2);

      if (type === "4bpp") {
        index |= ((rowD >> k) & 0x1) << 0x3;
      }

      tileData.push(index);
    }
  }

  return tileData;
}
