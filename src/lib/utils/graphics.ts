import { getInt } from "$lib/utils/bytes";

import type { Palette } from "$lib/types";

export function getPalette15Bit(
  offset: number,
  length: number,
  transparent = false,
): Palette {
  const palette = [];

  for (let i = 0x0; i < length; i += 0x1) {
    const color = getInt(offset + i * 0x2, "uint16");

    const red = (color & 0x1f) << 0x3;
    const green = ((color >> 0x5) & 0x1f) << 0x3;
    const blue = ((color >> 0xa) & 0x1f) << 0x3;
    const alpha = transparent && i === 0x0 ? 0 : 255;

    palette.push([red, green, blue, alpha]);
  }

  return palette;
}

export function convertPaletteMegaDrive(
  rawPalette: number[],
  transparent = false,
): Palette {
  const palette: number[][] = [];

  rawPalette.forEach((color, index) => {
    let red = color & 0xf;
    let green = (color & 0xf0) >> 0x4;
    let blue = (color & 0xf00) >> 0x8;

    const alpha = transparent && index === 0x0 ? 0x0 : 0xff;

    red = (red << 4) | red;
    green = (green << 4) | green;
    blue = (blue << 4) | blue;

    palette.push([red, green, blue, alpha]);
  });

  return palette;
}

export function flipTileData(
  data: number[],
  size: number,
  axis: "x" | "y",
): number[] {
  const flippedData = [];

  if (axis === "x") {
    for (let i = 0; i < data.length; i += size) {
      flippedData.push(...data.slice(i, i + size).reverse());
    }
  } else if (axis === "y") {
    for (let i = data.length; i > 0; i -= size) {
      flippedData.push(...data.slice(i - size, i));
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
      tileData[index * 4 + 3] = color[3]; // Alpha
    }
  });

  return tileData;
}
