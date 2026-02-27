import { getInt } from "$lib/utils/bytes";
import type { File } from "$lib/utils/common/iso9660";
import {
  getDecompressedIconData,
  getImage,
  Image,
  ImagesCanvas,
  parseCHRFile,
} from "$lib/utils/common/saturn/shining";
import { getRegionArray } from "$lib/utils/format";
import { applyPalette, getPalette } from "$lib/utils/graphics";
import { checkValidator } from "$lib/utils/validator";

import type { Palette } from "$lib/types";

import {
  cache,
  getDecompressedData,
  getFileOffset,
  getFilteredFiles,
  getScenario,
  isDummy,
  iso,
} from "../utils";
import {
  ITEM_COUNT,
  MAIN_PALETTE_OFFSET,
  SPELL_COUNT,
  SPELL_ICON_OFFSET_SHIFT,
} from "./constants";

export function getImagesCanvas(
  index: number,
  type: "image" | "sprite",
): ImagesCanvas {
  const files = getFilteredFiles(type);
  const file = iso.getFile(files[index].name);

  const imagesCanvas: ImagesCanvas = {
    width: 0,
    images: [],
  };

  if (!file) {
    return imagesCanvas;
  }

  switch (file.name) {
    case "NOWLOAD.SPR":
      imagesCanvas.width = 192;
      imagesCanvas.images.push(getImage(192, 34, file.dataView));
      break;

    case "DEBUG.FNT":
      imagesCanvas.width = 40;
      for (let i = 0x0; i < file.dataView.byteLength / 0x40; i += 0x1) {
        imagesCanvas.images.push(getImage(4, 8, file.dataView, i * 0x40));
      }
      break;

    case "ITEM_CG.DAT":
      imagesCanvas.width = 800;
      imagesCanvas.images = getItemCGIcons();
      break;

    case "LOGO.SPR":
    case "ENDLOGO.SPR":
    case "HAJUNOMA.SPR":
    case "MOVIESEL.SPR":
    case "MODESEL.SPR":
    case "MOVSEL2.SPR":
      imagesCanvas.width = 320;
      imagesCanvas.images.push(getImage(320, 224, file.dataView));
      break;

    case "STTL1.SPR":
      imagesCanvas.width = 288;
      for (let i = 0x0; i < 0xc; i += 0x1) {
        imagesCanvas.images.push(getImage(48, 48, file.dataView, i * 0x1200));
      }
      imagesCanvas.images.push(getImage(288, 672, file.dataView, 0xd800));
      break;

    case "TOMEGA.SPR":
      imagesCanvas.width = 224;
      imagesCanvas.images.push(getImage(224, 896, file.dataView));
      break;

    case "NSLOGO.BIN":
    case "NSLOGOS.BIN":
    case "LOGOBLK.BIN":
    case "LOGONEW.BIN":
      imagesCanvas.width = 304;
      imagesCanvas.images.push(getImage(304, 112, file.dataView));
      break;

    case "THREE.BIN":
    case "THREES.BIN":
      imagesCanvas.width = 104;
      imagesCanvas.images.push(getImage(104, 104, file.dataView));
      break;

    case "LOGOBG.BIN":
      imagesCanvas.width = 320;
      imagesCanvas.images.push(getImage(320, 240, file.dataView));
      break;

    case "ENDING.SPR":
      imagesCanvas.width = 320;
      imagesCanvas.images.push(
        getImage(320, 448, file.dataView, 0x0, "ABGR555"),
      );
      break;

    case "KODERA.SPR":
      imagesCanvas.width = 40;
      imagesCanvas.images.push(getImage(40, 40, file.dataView));
      break;
  }

  if (file.name.match(/^FACE64(.*?).DAT$/)) {
    imagesCanvas.width = 640;

    for (let i = 0x0; i < file.dataView.byteLength / 0x2000; i += 0x1) {
      imagesCanvas.images.push(getImage(64, 64, file.dataView, i * 0x2000));
    }
  } else if (file.name.match(/^FACE32(.*?).DAT$/)) {
    imagesCanvas.width = 128;
    imagesCanvas.images = parseFace32File(file);
  } else if (file.name.match(/.CHP$/)) {
    imagesCanvas.width = 800;
    imagesCanvas.images = parseCHPFile(file);
  } else if (file.name.match(/.CHR$/)) {
    imagesCanvas.width = 800;
    imagesCanvas.images = parseCHRFile(file, 2);
  } else if (file.name.match(/^KAO(.*?).DAT$/)) {
    imagesCanvas.width = 192;
    imagesCanvas.images = parseKaoFile(file);
  } else if (
    file.name.match(/^X4EN(.*?).BIN$/) &&
    !isDummy(0x0, file.dataView)
  ) {
    imagesCanvas.width = 512;
    imagesCanvas.images.push({
      width: 512,
      height: 256,
      data: applyPalette(
        new Uint8Array(file.dataView.buffer.slice(0x200)),
        getPalette("BGR555", 0x0, 0x200, {
          bigEndian: true,
          dataView: file.dataView,
        }),
      ),
    });
  }

  return imagesCanvas;
}

export function getIcon(type: "item" | "spell", index: number): Uint8Array {
  const file = iso.getFile("ITEM_CG.DAT") as File;
  const x021 = iso.getFile("X021.BIN") as File;

  const pointerIndex = type === "item" ? 0x3c : 0x30;

  const pointer = getFileOffset("x021", pointerIndex, x021.dataView);
  let offset = getInt(pointer + index * 0x4, "uint32", { bigEndian: true }, x021.dataView); // prettier-ignore

  if (type === "spell") {
    offset += getRegionArray(SPELL_ICON_OFFSET_SHIFT);
  }

  const data = getDecompressedIconData(offset, 0x120, file.dataView);

  return applyPalette(data, cache.mainPalette);
}

export function getMainPalette(): Palette {
  const file = iso.getFile("X003.BIN") as File;

  const pointer = getRegionArray(MAIN_PALETTE_OFFSET);
  const offset = getFileOffset("x003", pointer, file.dataView);

  return getPalette("BGR555", offset, 0x100, {
    firstTransparent: true,
    bigEndian: true,
    dataView: file.dataView,
  });
}

function parseCHPFile(file: File): Image[] {
  const images: Image[] = [];

  const offsets = [];

  let spriteId = -1;

  let offset = 0x0;

  while (spriteId === -1) {
    spriteId = getInt(offset, "int16", { bigEndian: true }, file.dataView); // prettier-ignore

    if (spriteId === -1) {
      offset += 0x800;
    }
  }

  if (spriteId < 0xc9) {
    const validator = [];

    for (let i = offset; i < offset + 0x6; i += 0x1) {
      const int = getInt(i, "uint8", {}, file.dataView);

      validator.push(int);
    }

    for (let i = offset; i < file.dataView.byteLength; i += 0x100) {
      if (checkValidator(validator, i, file.dataView)) {
        offsets.push(i);
      }
    }
  } else {
    for (let i = offset; i < file.dataView.byteLength; i += 0x100) {
      const validator1 = [spriteId >> 0x8, spriteId & 0xff, 0x0];
      const validator2 = [0xff, 0xff, 0x0, 0x0];

      if (checkValidator(validator1, i, file.dataView)) {
        offsets.push(i);

        spriteId += 0x1;
      } else if (checkValidator(validator2, i, file.dataView)) {
        spriteId += 0x1;
      }
    }
  }

  offsets.forEach((offset) => {
    images.push(...parseCHRFile(file, 2, offset));
  });

  return images;
}

function parseFace32File(file: File): Image[] {
  const images: Image[] = [];

  const spritesOffsets = [];

  let paletteOffsetEnd = -1;

  let offset = 0x0;

  while (paletteOffsetEnd === -1) {
    paletteOffsetEnd = getInt(offset, "int32", { bigEndian: true }, file.dataView); // prettier-ignore

    offset += 0x4;
  }

  const paletteOffsetStart = paletteOffsetEnd - 0x200;

  for (let i = 0x0; i < paletteOffsetStart; i += 0x4) {
    const offset = getInt(i, "int32", { bigEndian: true }, file.dataView);

    spritesOffsets.push(offset);
  }

  const palette = getPalette("BGR555", paletteOffsetStart, 0x200, {
    bigEndian: true,
    dataView: file.dataView,
  });

  for (let i = 0x0; i < spritesOffsets.length; i += 0x1) {
    if (spritesOffsets[i] !== -1) {
      let spriteData = new Uint8Array();

      if (
        getScenario() === "premium" &&
        ["FACE32D.DAT", "FACE32P.DAT"].includes(file.name)
      ) {
        spriteData = new Uint8Array(file.dataView.buffer).slice(
          spritesOffsets[i],
          spritesOffsets[i] + 0x1000,
        );
      } else {
        spriteData = getDecompressedData(spritesOffsets[i], file.dataView);
      }

      images.push({
        width: 32,
        height: 32,
        data: applyPalette(spriteData, palette),
      });
    } else {
      images.push({
        width: 32,
        height: 32,
        data: new Uint8Array(0x1000),
      });
    }
  }

  return images;
}

function parseKaoFile(file: File): Image[] {
  const images: Image[] = [];

  const offsets = [];

  for (let i = 0x0; i < file.dataView.byteLength; i += 0x1) {
    const validator = [0x0, 0x40, 0x0, 0x40];

    if (checkValidator(validator, i, file.dataView)) {
      offsets.push(i - 0x2);
    }
  }

  offsets.forEach((baseOffset) => {
    const decompressedData = getDecompressedData(baseOffset, file.dataView);

    const dataView = new DataView(decompressedData.buffer);

    const width = getInt(0x0, "uint16", { bigEndian: true }, dataView);
    const height = getInt(0x2, "uint16", { bigEndian: true }, dataView);

    const spriteData = decompressedData.slice(0x222, 0x222 + width * height);

    const palette = getPalette("BGR555", 0x22, 0x200, {
      firstTransparent: true,
      bigEndian: true,
      dataView,
    });

    for (let i = 0x0; i < 0x2; i += 0x1) {
      const layerWidth = getInt(0x16 + i * 0x4, "uint16", { bigEndian: true }, dataView); // prettier-ignore
      const layerHeight = getInt(0x18 + i * 0x4, "uint16", { bigEndian: true }, dataView); // prettier-ignore
      const layerRelX = getInt(0x1e + i * 0x2, "int8", {}, dataView);
      const layerRefY = getInt(0x1f + i * 0x2, "int8", {}, dataView);

      const layerX = width / 2 - layerWidth / 2 + layerRelX;
      const layerY = height / 2 - layerHeight / 2 + layerRefY;

      const count = i === 0 ? 0x3 : 0x6;

      for (let j = 0x0; j < count; j += 0x1) {
        let offset = getInt(0x4 + i * 0x6+ j * 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

        if (offset < decompressedData.length) {
          offset += 0x222;

          const layerData = new Uint8Array(spriteData);

          for (let k = 0x0; k < layerHeight; k += 0x1) {
            for (let l = 0x0; l < layerWidth; l += 0x1) {
              const int = decompressedData[offset + k * layerWidth + l];

              if (int) {
                layerData[layerY * width + layerX + k * width + l] = int;
              }
            }
          }

          images.push({
            width: width,
            height: height,
            data: applyPalette(layerData, palette),
          });
        }
      }
    }
  });

  return images;
}

function getItemCGIcons(): Image[] {
  const images: Image[] = [];

  for (let i = 0x0; i < getRegionArray(ITEM_COUNT); i += 0x1) {
    images.push({
      width: 24,
      height: 24,
      data: getIcon("item", i),
      group: 0,
    });
  }

  for (let i = 0x0; i < getRegionArray(SPELL_COUNT); i += 0x1) {
    images.push({
      width: 24,
      height: 24,
      data: getIcon("spell", i),
      group: 1,
    });
  }

  return images;
}
