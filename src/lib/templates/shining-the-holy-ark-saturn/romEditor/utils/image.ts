import { getImage, ImagesCanvas } from "$lib/utils/common/saturn/shining";

import { getFilteredFiles, iso } from "../utils";

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

    // case "WIFACES.SPR":
    //   imagesCanvas.width = 448;
    //   for (let i = 0x0; i < file.dataView.byteLength / 0x2000; i += 0x1) {
    //     imagesCanvas.images.push(getImage(56, 64, file.dataView));
    //   }
    //   break;

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

  return imagesCanvas;
}
