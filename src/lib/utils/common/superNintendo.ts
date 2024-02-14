import { getInt } from "$lib/utils/bytes";

export function getTileData(offset: number): number[] {
  const tileData = [];

  for (let line = 0; line < 8; line += 1) {
    const rowA = getInt(offset + line * 2, "uint8").toBinary();
    const rowB = getInt(offset + line * 2 + 0x1, "uint8").toBinary();
    const rowC = getInt(offset + line + 0x10, "uint8").toBinary();

    for (let pixel = 0; pixel < 8; pixel += 1) {
      const index =
        parseInt(rowA[pixel]) +
        parseInt(rowB[pixel]) * 2 +
        parseInt(rowC[pixel]) * 4;

      tileData.push(index);
    }
  }

  return tileData;
}
