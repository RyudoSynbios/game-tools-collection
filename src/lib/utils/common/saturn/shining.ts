import { byteswap16, getInt } from "$lib/utils/bytes";
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

export function getDecompressedIconData(
  offset: number,
  size: number,
  dataView: DataView,
): Uint8Array {
  const buffer = new Uint16Array(size);

  let bufferIndex = 0x0;

  let int = getInt(offset, "uint16", { bigEndian: true }, dataView);

  offset += 0x2;

  while (true) {
    let flags = (int << 0x10) | 0x8000;

    while (true) {
      while (true) {
        int = getInt(offset, "uint16", { bigEndian: true }, dataView);

        offset += 0x2;

        if (flags >> 0x1f) {
          break;
        }

        buffer[bufferIndex++] = byteswap16(int);

        flags <<= 0x1;
      }

      flags <<= 0x1;

      if (flags === 0x0) {
        break;
      }

      if (int === 0x0) {
        return new Uint8Array(buffer.buffer);
      }

      const count = (int & 0x1f) + 0x2;
      let position = bufferIndex - (int >> 0x5);

      for (let i = 0x0; i < count; i += 0x1) {
        buffer[bufferIndex++] = buffer[position++];
      }
    }
  }
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

  let flags = 0x0;

  if ((offsetEnd & 0x1) !== 0x0) {
    flags = 0x80000000;
  } else {
    flags = getInt(offset2++, "uint8", {}, dataView);
    flags = (flags << 0x18) | 0x800000;
  }

  // Set end of buffer that will not be erased
  buffer[bufferSize] = 0x0;
  buffer[bufferSize + 0x1] = 0x8000;
  buffer[bufferSize + 0x2] = 0x7fff;

  while (offset < offsetEnd) {
    let byte1 = getInt(offset++, "uint8", {}, dataView);
    let byte2 = 0x0;

    if (byte1 >> 0x7) {
      byte2 = (byte1 << 0x8) | getInt(offset++, "uint8", {}, dataView);

      buffer[bufferIndex++] = byte2;

      bufferIndex %= bufferSize;
    } else {
      byte2 = buffer[byte1];
    }

    let stop = false;

    while (!stop) {
      if (flags >> 0x1f) {
        let unknown = 0x1;

        flags <<= 0x1;

        if (flags !== 0x0) {
          while (!stop) {
            if (flags >> 0x1f === 0x0) {
              byte1 = 0x1;

              flags <<= 0x1;

              while (!stop) {
                byte1 <<= 0x1;

                if (flags >> 0x1f) {
                  byte1 += 0x1;
                }

                flags <<= 0x1;
                unknown -= 0x1;

                if (flags !== 0x0) {
                  if (unknown === 0x0) {
                    if (flags >> 0x1f) {
                      flags |= 0x80000000;
                    } else {
                      flags &= 0x7fffffff;
                    }

                    for (let i = 0x0; i < byte1; i += 0x1) {
                      decompressedData[dataIndex++] = byte2;
                    }

                    stop = true;
                  }
                } else {
                  flags = getInt(offset2, "uint16", { bigEndian: true }, dataView); // prettier-ignore
                  flags = (flags << 0x10) | 0x8000;

                  byte1 >>= 0x1;
                  offset2 += 0x2;
                  unknown += 0x1;
                }
              }
            } else {
              flags <<= 0x1;
            }

            if (flags === 0x0) {
              flags = getInt(offset2, "uint16", { bigEndian: true }, dataView);
              flags = (flags << 0x10) | 0x8000;

              offset2 += 0x2;
            } else {
              unknown += 0x1;
            }
          }
        }

        if (!stop) {
          flags = getInt(offset2, "uint16", { bigEndian: true }, dataView);
          flags = (flags << 0x10) | 0x8000;

          offset2 += 0x2;
        }
      } else {
        decompressedData[dataIndex++] = byte2;
        flags <<= 0x1;
        break;
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
