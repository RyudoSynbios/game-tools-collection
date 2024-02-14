import { getInt } from "$lib/utils/bytes";

import type { Palette } from "$lib/types";

export function getPalette24Bit(
  offset: number,
  length: number,
  transparent = false,
): Palette {
  const palette = [];

  for (let i = 0; i < length; i += 1) {
    const hex = getInt(offset + i * 2, "uint16");

    let red = (hex & 31) << 3;
    let green = ((hex >> 5) & 31) << 3;
    let blue = ((hex >> 10) & 31) << 3;

    if (transparent && i === 0) {
      palette.push([]);
    } else {
      palette.push([red, green, blue]);
    }
  }

  return palette;
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
