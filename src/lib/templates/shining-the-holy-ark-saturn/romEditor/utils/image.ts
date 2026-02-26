import { getInt } from "$lib/utils/bytes";
import { File } from "$lib/utils/common/iso9660";
import {
  getDecompressedIconData,
  getDecompressedSpriteData,
  getImage,
  Image,
  ImagesCanvas,
  parseCHRFile,
} from "$lib/utils/common/saturn/shining";
import { applyPalette, getColor, getPalette } from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import { cache, getFileOffset, getFilteredFiles, iso } from "../utils";
import { X09_POINTERS } from "./constants";

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
    case "DEBUG.FNT":
      imagesCanvas.width = 40;
      for (let i = 0x0; i < file.dataView.byteLength / 0x40; i += 0x1) {
        imagesCanvas.images.push(getImage(4, 8, file.dataView, i * 0x40));
      }
      break;

    case "NOWLOAD.SPR":
      imagesCanvas.width = 192;
      imagesCanvas.images.push(getImage(192, 34, file.dataView));
      break;

    case "X07.BIN":
      imagesCanvas.width = 800;
      imagesCanvas.images = getX07Icons();
      break;

    case "X09.BIN":
      imagesCanvas.width = 800;
      imagesCanvas.images = parseX09File(file);
      break;

    case "EVFACES.SPR":
      imagesCanvas.width = 448;
      for (let i = 0x0; i < file.dataView.byteLength / 0x2000; i += 0x1) {
        imagesCanvas.images.push(getImage(56, 64, file.dataView, i * 0x2000));
      }
      break;

    case "WIFACES.SPR":
      imagesCanvas.width = 448;
      imagesCanvas.images = parseWiFacesFile(file);
      break;

    case "LOGOS.SPR":
      imagesCanvas.width = 336;
      for (let i = 0x0; i < file.dataView.byteLength / 0x23000; i += 0x1) {
        imagesCanvas.images.push(
          getImage(336, 208, file.dataView, i * 0x23000),
        );
      }
      break;

    case "KARIOWAR.SPR":
      imagesCanvas.width = 336;
      imagesCanvas.images.push(getImage(336, 208, file.dataView));
      break;
  }

  if (file.name.match(/.CHR$/)) {
    imagesCanvas.width = 800;
    imagesCanvas.images = parseCHRFile(file, 1, 0x0, (file, offset) => {
      if (file.name.match(/^(M501_E_|X5)/)) {
        return getFileOffset("chr2", offset, file.dataView);
      } else if (file.name === "XINTRNL.CHR") {
        return getFileOffset("chr3", offset, file.dataView);
      }
      return getFileOffset("chr1", offset, file.dataView);
    });
  }

  return imagesCanvas;
}

export function getIcon(type: "item" | "spell", index: number): Uint8Array {
  const file = iso.getFile("X07.BIN") as File;

  const pointerIndex = type === "item" ? 0x0 : 0x4;

  const pointer = getFileOffset("x07", pointerIndex, file.dataView);
  const offset = getFileOffset("x07", pointer + index * 0x4, file.dataView);

  const data = getDecompressedIconData(offset, 0x120, file.dataView);

  return applyPalette(data, cache.mainPalette);
}

export function getMainPalette(): Palette {
  const file = iso.getFile("X09.BIN") as File;

  const offset = getFileOffset("x09", X09_POINTERS.palette, file.dataView);

  return getPalette("BGR555", offset, 0x100, {
    firstTransparent: true,
    bigEndian: true,
    dataView: file.dataView,
  });
}

function parseWiFacesFile(file: File): Image[] {
  const images: Image[] = [];

  for (let i = 0x0; i < 0x20; i += 0x4) {
    const offset = getInt(i, "uint32", { bigEndian: true }, file.dataView);

    const decompressedData = getDecompressedSpriteData(
      offset - 0x604e000,
      0x1c00,
      1,
      file.dataView,
    );

    const spriteData = new Uint8Array(decompressedData.length * 0x4);

    for (let j = 0x0; j < decompressedData.length; j += 0x1) {
      spriteData.set(getColor(decompressedData[j], "ABGR555"), j * 0x4);
    }

    images.push({ width: 56, height: 64, data: spriteData });
  }

  return images;
}

function getX07Icons(): Image[] {
  const images: Image[] = [];

  for (let i = 0x0; i < 0xd3; i += 0x1) {
    images.push({
      width: 24,
      height: 24,
      data: getIcon("item", i),
      group: 0,
    });
  }

  for (let i = 0x0; i < 0x28; i += 0x1) {
    images.push({
      width: 24,
      height: 24,
      data: getIcon("spell", i),
      group: 1,
    });
  }

  return images;
}

// prettier-ignore
function parseX09File(file: File): Image[] {
  const images: Image[] = [];

  const icons = [
    { offset: X09_POINTERS.icons1a, shift: 0x0, width: 16, height: 8, count: 2 },
    { offset: X09_POINTERS.icons2, shift: 0x0, width: 24, height: 24, count: 10 },
    { offset: X09_POINTERS.icons3, shift: 0x0, width: 8, height: 8, count: 28 },
    { offset: X09_POINTERS.icons4, shift: 0x0, width: 32, height: 8, count: 4 },
    { offset: X09_POINTERS.icons5, shift: 0x0, width: 8, height: 8, count: 5 },
    { offset: X09_POINTERS.icons5, shift: 0x140, width: 32, height: 8, count: 2 },
    { offset: X09_POINTERS.icons6, shift: 0x0, width: 16, height: 8, count: 2 },
    { offset: X09_POINTERS.icons6, shift: 0x100, width: 24, height: 24, count: 1 },
    { offset: X09_POINTERS.icons6, shift: 0x340, width: 32, height: 24, count: 1 },
    { offset: X09_POINTERS.icons7, shift: 0x0, width: 32, height: 24, count: 29 },
    { offset: X09_POINTERS.icons8, shift: 0x0, width: 32, height: 24, count: 29 },
    { offset: X09_POINTERS.icons9, shift: 0x0, width: 48, height: 80, count: 4 },
    { offset: X09_POINTERS.icons10, shift: 0x0, width: 32, height: 24, count: 4 },
  ];

  icons.forEach((icon, index) => {
    let offset = getFileOffset("x09", icon.offset, file.dataView) + icon.shift;
    const length = icon.width * icon.height;

    for (let i = 0x0; i < icon.count; i += 0x1) {
      const data = new Uint8Array(
        file.dataView.buffer.slice(offset, offset + length),
      );

      const image = applyPalette(data, cache.mainPalette);

      images.push({
        width: icon.width,
        height: icon.height,
        data: image,
        group: index,
      });

      offset += length;
    }
  });

  return images;
}
