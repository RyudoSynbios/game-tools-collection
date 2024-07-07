import { getInt } from "$lib/utils/bytes";

export function getTileData(offset: number): number[] {
  const tileData = [];

  for (let line = 0x0; line < 0x8; line += 0x1) {
    const rowA = getInt(offset + line * 0x2, "uint8").toBinary();
    const rowB = getInt(offset + line * 0x2 + 0x1, "uint8").toBinary();
    const rowC = getInt(offset + line + 0x10, "uint8").toBinary();

    for (let pixel = 0x0; pixel < 0x8; pixel += 0x1) {
      const index =
        parseInt(rowA[pixel]) +
        parseInt(rowB[pixel]) * 0x2 +
        parseInt(rowC[pixel]) * 0x4;

      tileData.push(index);
    }
  }

  return tileData;
}
