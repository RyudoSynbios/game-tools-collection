import { getInt } from "$lib/utils/bytes";

import type { Palette } from "$lib/types";

export function getPalette(offset: number, transparent = false): Palette {
  const palette = [];

  for (let i = 0; i < 8; i += 1) {
    const hex = getInt(offset + i * 2, "uint16");

    let red = (hex & 31) << 3;
    let green = ((hex >> 5) & 31) << 3;
    let blue = ((hex >> 10) & 31) << 3;

    red = red / 8;
    green = green / 8;
    blue = blue / 8;

    const ratio = 255 / 31;

    red = Math.floor(red * ratio);
    green = Math.floor(green * ratio);
    blue = Math.floor(blue * ratio);

    if (transparent && i === 0) {
      palette.push([]);
    } else {
      palette.push([red, green, blue]);
    }
  }

  return palette;
}

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

export function flipTileData(data: number[], size: number, axis: "x" | "y") {
  const flippedData = [];

  if (axis === "x") {
    for (let i = 0; i < data.length; i += size) {
      flippedData.push(...data.slice(i, i + size).reverse());
    }
  }

  return flippedData;
}

export function applyPalette(data: number[], palette: Palette): Uint8Array {
  const tileData = new Uint8Array(data.length * 4);

  data.forEach((paletteIndex, index) => {
    const color = palette[paletteIndex];

    if (color.length > 0) {
      tileData[index * 4 + 0] = color[0]; // Red
      tileData[index * 4 + 1] = color[1]; // Green
      tileData[index * 4 + 2] = color[2]; // Blue
      tileData[index * 4 + 3] = 255; // Alpha
    }
  });

  return tileData;
}
