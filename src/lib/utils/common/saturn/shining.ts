import { getInt } from "$lib/utils/bytes";
import { getColor } from "$lib/utils/graphics";

import { ColorType } from "$lib/types";

import { File } from "../iso9660";

export interface Image {
  width: number;
  height: number;
  group?: number;
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

export function getDecompressedSpriteData(
  offset: number,
  size: number,
  mode: 1 | 2,
  dataView: DataView,
): Uint16Array {
  const decompressedData = new Uint16Array(size);

  const bufferSize = mode === 1 ? 0x7e : 0x7d;

  const buffer = new Uint16Array(bufferSize + 0x3);

  let bufferIndex = 0x0;
  let dataIndex = 0x0;

  const offsetEnd = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  let offset2 = offsetEnd;

  offset += 0x4;

  let mask = 0x0;

  if ((offsetEnd & 0x1) !== 0x0) {
    mask = 0x80000000;
  } else {
    mask = getInt(offset2++, "uint8", {}, dataView);
    mask = (mask << 0x18) | 0x800000;
  }

  // Set end of buffer that will not be erased
  buffer.set([0x0000], bufferSize);
  buffer.set([0x8000], bufferSize + 0x1);
  buffer.set([0x7fff], bufferSize + 0x2);

  while (offset < offsetEnd) {
    let byte1 = getInt(offset++, "uint8", {}, dataView);
    let byte2 = 0x0;

    if (byte1 < 0x80) {
      byte2 = buffer[byte1];
    } else {
      byte2 = (byte1 << 0x8) | getInt(offset++, "uint8", {}, dataView);

      buffer.set([byte2], bufferIndex++);

      bufferIndex %= bufferSize;
    }

    let next = false;

    while (!next) {
      let condition = (mask & 0x80000000) !== 0x0;

      mask <<= 0x1;

      if (condition) {
        let unknown = 0x1;

        if (mask !== 0x0) {
          while (!next) {
            condition = (mask & 0x80000000) === 0x0;

            mask <<= 0x1;

            if (condition) {
              byte1 = 0x1;

              while (!next) {
                byte1 *= 0x2;

                if ((mask & 0x80000000) !== 0x0) {
                  byte1 += 0x1;
                }

                mask <<= 0x1;

                unknown -= 0x1;

                if (mask !== 0x0) {
                  if (unknown === 0x0) {
                    if ((mask & 0x80000000) !== 0x0) {
                      mask |= 0x80000000;
                    } else {
                      mask &= 0x7fffffff;
                    }

                    unknown = 0x2;

                    decompressedData.set([byte2], dataIndex++);

                    if (byte1 !== unknown) {
                      byte1 -= 0x1;

                      const count = (byte1 >> 2) * 2;

                      if ((byte1 & 0x2) !== 0x0) {
                        decompressedData.set([byte2], dataIndex++);
                        decompressedData.set([byte2], dataIndex++);
                      }

                      for (let i = 0x0; i < count; i += 0x1) {
                        decompressedData.set([byte2], dataIndex++);
                        decompressedData.set([byte2], dataIndex++);
                      }

                      if ((byte1 & 0x1) !== 0x0) {
                        decompressedData.set([byte2], dataIndex++);
                      }
                    } else {
                      decompressedData.set([byte2], dataIndex++);
                    }

                    next = true;
                  }
                } else {
                  unknown += 0x1;

                  mask = getInt(offset2, "uint16", { bigEndian: true }, dataView); // prettier-ignore

                  offset2 += 0x2;

                  byte1 >>= 1;

                  mask = (mask << 0x10) | 0x8000;
                }
              }
            }

            if (mask === 0x0) {
              mask = getInt(offset2, "uint16", { bigEndian: true }, dataView);

              offset2 += 0x2;

              mask = (mask << 0x10) | 0x8000;
            } else {
              unknown += 0x1;
            }
          }
        }

        if (!next) {
          mask = getInt(offset2, "uint16", { bigEndian: true }, dataView);

          offset2 += 0x2;

          mask = (mask << 0x10) | 0x8000;
        }
      } else {
        decompressedData.set([byte2], dataIndex++);

        next = true;
      }
    }
  }

  return new Uint16Array(decompressedData);
}

export function parseCHRFile(
  file: File,
  mode: 1 | 2,
  baseOffset = 0x0,
  offsetCallback?: (file: File, offset: number) => number,
): Image[] {
  const images: Image[] = [];

  let basePointer = baseOffset;

  while (true) {
    const spriteId = getInt(basePointer, "int16", { bigEndian: true }, file.dataView); // prettier-ignore

    if (spriteId === -1) {
      break;
    }

    const width = getInt(basePointer + 0x2, "uint16", { bigEndian: true }, file.dataView); // prettier-ignore
    const height = getInt(basePointer + 0x4, "uint16", { bigEndian: true }, file.dataView); // prettier-ignore

    let pointer = baseOffset;

    if (typeof offsetCallback === "function") {
      pointer += offsetCallback(file, basePointer + 0x10);
    } else {
      pointer += getInt(basePointer + 0x10, "uint32", { bigEndian: true }, file.dataView); // prettier-ignore
    }

    while (pointer < file.dataView.byteLength) {
      let offset = 0x0;

      if (typeof offsetCallback === "function") {
        offset = offsetCallback(file, pointer);
      } else {
        offset = getInt(pointer, "uint32", { bigEndian: true }, file.dataView);
      }

      if (offset <= 0x0) {
        break;
      }

      const decompressedData = getDecompressedSpriteData(
        baseOffset + offset,
        width * height * 2,
        mode,
        file.dataView,
      );

      const spriteData = new Uint8Array(decompressedData.length * 0x4);

      for (let j = 0x0; j < decompressedData.length; j += 0x1) {
        spriteData.set(getColor(decompressedData[j], "ABGR555"), j * 0x4);
      }

      images.push({ width, height, group: basePointer, data: spriteData });

      pointer += 0x4;
    }

    basePointer += 0x18;
  }

  return images;
}
