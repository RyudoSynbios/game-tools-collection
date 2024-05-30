import { getInt } from "$lib/utils/bytes";

import type { Color, ColorType, Palette } from "$lib/types";

export function getColor(raw: number, type: ColorType): Color {
  let red = 0;
  let green = 0;
  let blue = 0;
  let alpha = 0;

  switch (type) {
    case "BGR333": // ---- BBB- GGG- RRR-
      blue = ((raw & 0xe00) >> 0x8) | ((raw & 0xe00) >> 0x4);
      green = (raw & 0xe0) | ((raw & 0xe0) >> 0x4);
      red = ((raw & 0xe) << 0x4) | (raw & 0xe);
      alpha = 255;
      break;
    case "BGR555": // -BBB BBGG GGGR RRRR
      blue = ((raw >> 0xa) & 0x1f) << 0x3;
      green = ((raw >> 0x5) & 0x1f) << 0x3;
      red = (raw & 0x1f) << 0x3;
      alpha = 255;
      break;
    case "ABGR555": // ABBB BBGG GGGR RRRR
      alpha = ((raw >> 0xf) & 0x1) * 255;
      blue = ((raw >> 0xa) & 0x1f) << 0x3;
      green = ((raw >> 0x5) & 0x1f) << 0x3;
      red = (raw & 0x1f) << 0x3;
      break;
    case "RGBA555": // RRRR RGGG GGBB BBBA
      red = ((raw >> 0xb) & 0x1f) << 0x3;
      green = ((raw >> 0x6) & 0x1f) << 0x3;
      blue = ((raw >> 0x1) & 0x1f) << 0x3;
      alpha = (raw & 0x1) * 255;
      break;
  }

  return [red, green, blue, alpha];
}

export function getPalette(
  type: ColorType,
  offset: number,
  length: number,
  options?: {
    firstTransparent?: boolean;
    bigEndian?: boolean;
    array?: number[] | Uint8Array;
    dataView?: DataView;
  },
): Palette {
  const firstTransparent = options?.firstTransparent || false;
  const bigEndian = options?.bigEndian || false;
  const array = options?.array;
  const dataView = options?.dataView;

  const palette: Color[] = [];

  for (let i = 0x0; i < length; i += 0x1) {
    if (i === 0x0 && firstTransparent) {
      palette.push([0, 0, 0, 0]);
    } else {
      let raw = 0x0;

      if (array) {
        raw = getIntFromArray(array, offset + i * 0x2, "uint16", bigEndian);
      } else {
        raw = getInt(offset + i * 0x2, "uint16", { bigEndian }, dataView);
      }

      const color = getColor(raw, type);

      palette.push(color);
    }
  }

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

export function applyPalette(
  data: number[] | Uint8Array,
  palette: Palette,
): Uint8Array {
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
