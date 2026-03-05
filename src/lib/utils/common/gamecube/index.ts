import type { ColorType } from "$lib/types";

import { getInt, getString } from "../../bytes";
import Canvas from "../../canvas";
import debug from "../../debug";
import { getColor, getPalette } from "../../graphics";

export interface GvrTexture {
  width: number;
  height: number;
  colorType: ColorType;
  data: Uint8Array;
}

// Source from https://code.google.com/archive/p/puyotools/wikis/GVRTexture.wiki
export function getGvrTexture(canvas: Canvas, dataView: DataView): GvrTexture {
  const header = getString(0x0, 0x4, "uint8", {}, dataView);

  if (header !== "GCIX") {
    return {
      width: 0,
      height: 0,
      colorType: "RGB5A3",
      data: new Uint8Array(),
    };
  }

  // const mimaps = getInt(0x1a, "bit", { bit: 0 }, dataView);
  // const externalClut = getInt(0x1a, "bit", { bit: 1 }, dataView);
  // const embeddedClut = getInt(0x1a, "bit", { bit: 2 }, dataView);
  const pixelFormat = getInt(0x1a, "upper4", {}, dataView);
  const dataFormat = getInt(0x1b, "uint8", {}, dataView);
  const width = getInt(0x1c, "uint16", { bigEndian: true }, dataView);
  const height = getInt(0x1e, "uint16", { bigEndian: true }, dataView);

  canvas.resize(width, height);

  let colorType: ColorType = "RGB5A3";

  switch (dataFormat) {
    case 4:
      colorType = "RGB565";
      break;
    case 5:
      colorType = "RGB5A3";
      break;
    case 6:
      colorType = "ARGB8888";
      break;
    case 14:
      colorType = "RGB565";
      break;
  }

  // If texture uses indexed palette
  if ([8, 9].includes(dataFormat)) {
    switch (pixelFormat) {
      case 1:
        colorType = "RGB565";
        break;
      case 2:
        colorType = "RGB5A3";
        break;
    }
  }

  if (![4, 5, 6, 8, 9, 14].includes(dataFormat)) {
    debug.warn(`Data format '${dataFormat}' not handled yet.`, {
      pixelFormat,
      dataFormat,
      width,
      height,
      dataView,
    });
  } else if (dataFormat === 6) {
    const rows = height / 0x4;
    const columns = width / 0x4;

    let offset = 0x20;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x10; tile += 0x1) {
          const int1 = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore
          const int2 = getInt(offset + 0x20, "uint16", { bigEndian: true }, dataView); // prettier-ignore

          const color = getColor((int1 << 0x10) | int2, colorType);

          tileData.push(...color);

          offset += 0x2;

          if (offset % 0x20 === 0x0) {
            offset += 0x20;
          }
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 4, 4, column * 4, row * 4);
      }
    }
  } else if (dataFormat === 8) {
    const rows = height / 0x8;
    const columns = width / 0x8;

    const palette = getPalette(colorType, 0x20, 0x10, {
      bigEndian: true,
      dataView,
    });

    let offset = 0x40;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x20; tile += 0x1) {
          const int = getInt(offset, "uint8", {}, dataView);

          const p1 = int >> 0x4;
          const p2 = int & 0xf;

          tileData.push(...palette[p1], ...palette[p2]);

          offset += 0x1;
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 8, 8, column * 0x8, row * 0x8);
      }
    }
  } else if (dataFormat === 9) {
    const rows = height / 0x4;
    const columns = width / 0x8;

    const palette = getPalette(colorType, 0x20, 0x100, {
      bigEndian: true,
      dataView,
    });

    let offset = 0x220;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x20; tile += 0x1) {
          const int = getInt(offset, "uint8", {}, dataView);

          tileData.push(...palette[int]);

          offset += 0x1;
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 8, 4, column * 0x8, row * 0x4);
      }
    }
  } else if (dataFormat === 14) {
    const rows = height / 0x8;
    const columns = width / 0x2;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        const offset = 0x20 + row * width * 0x4 + column * 0x8;

        const int0 = getInt(offset, "uint16", { bigEndian: true }, dataView);
        const int1 = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore
        const code = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

        const color0 = getColor(int0, "RGB565");
        const color1 = getColor(int1, "RGB565");
        const color2 = [0, 0, 0, 255];
        const color3 = [0, 0, 0, int0 < int1 ? 0 : 255];

        for (let i = 0; i < 3; i += 1) {
          if (int0 > int1) {
            color2[i] = (2 * color0[i] + color1[i]) / 3;
            color3[i] = (color0[i] + 2 * color1[i]) / 3;
          } else {
            color2[i] = (color0[i] + color1[i]) / 2;
            color3[i] = 0x0;
          }
        }

        const palette = [color0, color1, color2, color3];

        for (let i = 30; i >= 0; i -= 2) {
          tileData.push(...palette[(code >> i) & 0x3]);
        }

        const data = new Uint8Array(tileData);

        const x = (Math.floor(column / 4) * 2 + (column % 2)) * 4;
        const y = (row * 2 + ((column & 2) >> 1)) * 4;

        canvas.addGraphic("texture", data, 4, 4, x, y);
      }
    }
  } else {
    const rows = height / 0x4;
    const columns = width / 0x4;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x10; tile += 0x1) {
          const offset =
            0x20 + row * columns * 0x20 + column * 0x10 * 0x2 + tile * 0x2;

          const int = getInt(offset, "uint16", { bigEndian: true }, dataView);

          const color = getColor(int, colorType);

          tileData.push(...color);
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 4, 4, column * 4, row * 4);
      }
    }
  }

  const data = canvas.exportGraphicData("texture");

  return {
    width,
    height,
    colorType,
    data,
  };
}
