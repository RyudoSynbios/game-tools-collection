import { getInt } from "$lib/utils/bytes";
import { File } from "$lib/utils/common/iso9660";
import {
  getDecompressedSpriteData,
  getImage,
  Image,
  ImagesCanvas,
  parseCHRFile,
} from "$lib/utils/common/saturn/shining";
import { getColor } from "$lib/utils/graphics";

import { getFileOffset, getFilteredFiles, iso } from "../utils";

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
