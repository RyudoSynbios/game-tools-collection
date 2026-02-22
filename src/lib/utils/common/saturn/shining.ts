import { getInt } from "$lib/utils/bytes";
import { getColor } from "$lib/utils/graphics";

import { ColorType } from "$lib/types";

export interface Image {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface ImagesCanvas {
  width: number;
  images: Image[];
}

export function getImage(
  width: number,
  height: number,
  dataView: DataView,
  offset = 0x0,
  colorType: ColorType = "BGR555",
): Image {
  const length = width * height * 0x2;

  const imageData = [];

  for (let i = offset; i < offset + length; i += 0x2) {
    const rawColor = getInt(i, "uint16", { bigEndian: true }, dataView);

    const color = getColor(rawColor, colorType);

    imageData.push(...color);
  }

  return {
    width,
    height,
    data: new Uint8Array(imageData),
  };
}
