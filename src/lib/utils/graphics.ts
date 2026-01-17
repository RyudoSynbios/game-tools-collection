import { extractBit, getInt, getIntFromArray } from "$lib/utils/bytes";

import type { Color, ColorType, Palette } from "$lib/types";

import Canvas from "./canvas";

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
    case "RGB565": // RRRR RGGG GGGB BBBB
      red = ((raw >> 0xb) & 0x1f) << 0x3;
      green = ((raw >> 0x5) & 0x3f) << 0x2;
      blue = (raw & 0x1f) << 0x3;
      alpha = 255;
      break;
    case "ARGB555": // ABBB BBGG GGGR RRRR
      alpha = ((raw >> 0xf) & 0x1) * 255;
      red = ((raw >> 0xa) & 0x1f) << 0x3;
      green = ((raw >> 0x5) & 0x1f) << 0x3;
      blue = (raw & 0x1f) << 0x3;
      break;
    case "RGB555": // -RRR RRGG GGGB BBBB
      red = ((raw >> 0xa) & 0x1f) << 0x3;
      green = ((raw >> 0x5) & 0x1f) << 0x3;
      blue = (raw & 0x1f) << 0x3;
      alpha = 255;
      break;
    case "RGB5A3":
      if (extractBit(raw, 15)) {
        // -RRR RRGG GGGB BBBB
        red = ((raw >> 0xa) & 0x1f) << 0x3;
        green = ((raw >> 0x5) & 0x1f) << 0x3;
        blue = (raw & 0x1f) << 0x3;
        alpha = 255;
      } else {
        // -AAA RRRR GGGG BBBB
        alpha = Math.min(((raw >> 0xc) & 0x7) * 36.5, 255);
        red = ((raw >> 0x8) & 0xf) << 0x4;
        green = ((raw >> 0x4) & 0xf) << 0x4;
        blue = (raw & 0xf) << 0x4;
      }
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
    case "ARGB8888":
      alpha = (raw >> 0x18) & 0xff;
      red = (raw >> 0x10) & 0xff;
      green = (raw >> 0x8) & 0xff;
      blue = raw & 0xff;
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
    let raw = 0x0;

    if (array) {
      raw = getIntFromArray(array, offset + i * 0x2, "uint16", bigEndian);
    } else {
      raw = getInt(offset + i * 0x2, "uint16", { bigEndian }, dataView);
    }

    const color = getColor(raw, type);

    palette.push(color);
  }

  if (palette.length > 0 && firstTransparent) {
    palette[0][3] = 0x0;
  }

  return palette;
}

export function flipTileData(
  data: number[],
  width: number,
  axis: "x" | "y",
): number[] {
  const flippedData = [];

  if (axis === "x") {
    for (let i = 0; i < data.length; i += width) {
      flippedData.push(...data.slice(i, i + width).reverse());
    }
  } else if (axis === "y") {
    for (let i = data.length; i > 0; i -= width) {
      flippedData.push(...data.slice(i - width, i));
    }
  }

  return flippedData;
}

export function flipUvs(uvs: number[], axis: "x" | "y"): number[] {
  return uvs.map((uv, index) => {
    if (
      (axis === "x" && index % 2 === 0) ||
      (axis === "y" && index % 2 !== 0)
    ) {
      uv ^= 1;
    }

    return uv;
  });
}

export function rotateUvs(uvs: number[], angle: 90 | 180): number[] {
  if (angle === 90) {
    const ref90 = [4, 0, 1, 1, 2, 4];

    const rotatedUvs: number[] = [];

    ref90.forEach((ref) => {
      rotatedUvs.push(uvs[ref * 2], uvs[ref * 2 + 1]);
    });

    return rotatedUvs;
  } else if (angle === 180) {
    return uvs.map((uv) => (uv ^= 1));
  }

  return uvs;
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

export function renderDebugPalettes(palettes: Palette[], canvas: Canvas): void {
  if (palettes.length === 0) {
    canvas.reset();
    return;
  }

  canvas.resize(palettes[0].length * 8, palettes.length * 8);

  palettes.forEach((palette, paletteIndex) => {
    palette.forEach((color, colorIndex) => {
      const tileData = new Uint8Array(0x10000);

      for (let j = 0; j < tileData.length; j += 0x4) {
        tileData[j] = color[0];
        tileData[j + 1] = color[1];
        tileData[j + 2] = color[2];
        tileData[j + 3] = 0xff;
      }

      canvas.addGraphic(
        "palettes",
        tileData,
        8,
        8,
        colorIndex * 8,
        paletteIndex * 8,
      );
    });
  });

  canvas.render();
}

interface GraphicsSheet {
  width: number;
  height: number;
  coordinates: Coordinates[];
}

interface Coordinates {
  x: number;
  y: number;
}

export function generateGraphicsSheet(
  width: number,
  images: { width: number; height: number }[],
): GraphicsSheet {
  const sheet: GraphicsSheet = {
    width,
    height: 1,
    coordinates: [],
  };

  let previousY = 0;

  images.forEach((image, index) => {
    let x =
      index > 0 ? sheet.coordinates[index - 1].x + images[index - 1].width : 0;
    let y = previousY;

    if (x + image.width > sheet.width) {
      x = 0;
      y = sheet.height;
      previousY = sheet.height;
    }

    sheet.coordinates.push({ x, y });

    if (!width && image.width > width) {
      sheet.width = image.width;
    }

    if (y + image.height > sheet.height) {
      sheet.height = y + image.height;
    }
  });

  return sheet;
}
