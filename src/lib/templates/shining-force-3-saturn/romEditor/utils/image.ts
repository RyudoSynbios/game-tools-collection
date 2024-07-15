import { getInt, getIntFromArray, intToArray } from "$lib/utils/bytes";
import { getFile } from "$lib/utils/common/iso9660";
import { applyPalette, getColor, getPalette } from "$lib/utils/graphics";
import { checkValidator } from "$lib/utils/validator";

import type { ColorType, Palette } from "$lib/types";

import {
  getDecompressedData,
  getFilteredFiles,
  getScenario,
  isDummy,
} from "../utils";

interface Image {
  width: number;
  height: number;
  data: Uint8Array;
}

function getImage(
  width: number,
  height: number,
  dataView: DataView,
  offset = 0x0,
  colorType: ColorType = "BGR555",
): Image {
  const length = width * height * 2;

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

interface ImagesCanvas {
  width: number;
  images: Image[];
}

export function getImagesCanvas(
  index: number,
  type: "image" | "sprite",
): ImagesCanvas {
  const files = getFilteredFiles(type);
  const file = getFile(files[index].name);

  const imagesCanvas: ImagesCanvas = {
    width: 0,
    images: [],
  };

  if (file) {
    if (file.name === "NOWLOAD.SPR") {
      imagesCanvas.width = 192;
      imagesCanvas.images.push(getImage(192, 34, file.dataView));
    } else if (file.name === "DEBUG.FNT") {
      imagesCanvas.width = 40;

      for (let i = 0; i < file.dataView.byteLength / 0x40; i += 1) {
        imagesCanvas.images.push(getImage(4, 8, file.dataView, i * 0x40));
      }
    } else if (file.name.match(/^FACE64(.*?).DAT$/)) {
      imagesCanvas.width = 640;

      for (let i = 0; i < file.dataView.byteLength / 0x2000; i += 1) {
        imagesCanvas.images.push(getImage(64, 64, file.dataView, i * 0x2000));
      }
    } else if (file.name.match(/^FACE32(.*?).DAT$/)) {
      imagesCanvas.width = 128;

      const spritesOffsets = [];

      let paletteOffsetEnd = -1;

      let offset = 0x0;

      while (paletteOffsetEnd === -1) {
        paletteOffsetEnd = getInt(
          offset,
          "int32",
          { bigEndian: true },
          file.dataView,
        );

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

          imagesCanvas.images.push({
            width: 32,
            height: 32,
            data: applyPalette(spriteData, palette),
          });
        } else {
          imagesCanvas.images.push({
            width: 32,
            height: 32,
            data: new Uint8Array(0x1000),
          });
        }
      }
    } else if (file.name.match(/.CHR$/)) {
      let basePointer = 0x0;

      while (true) {
        const unknown = getInt(basePointer, "int16", { bigEndian: true }, file.dataView); // prettier-ignore

        if (unknown === -1) {
          break;
        }

        const width = getInt(basePointer + 0x2, "uint16", { bigEndian: true }, file.dataView); // prettier-ignore
        const height = getInt(basePointer + 0x4, "uint16", { bigEndian: true }, file.dataView); // prettier-ignore

        let pointer = getInt(basePointer + 0x10, "uint32", { bigEndian: true }, file.dataView); // prettier-ignore

        while (true) {
          const offset = getInt(pointer , "uint32", { bigEndian: true }, file.dataView); // prettier-ignore

          if (offset === 0x0) {
            break;
          }

          const decompressedData = getDecompressedSpriteData(
            offset,
            file.dataView,
          );

          const spriteData = [];

          for (let j = 0x0; j < decompressedData.length; j += 0x2) {
            const rawColor = getIntFromArray(decompressedData, j, "uint16", true); // prettier-ignore

            const color = getColor(rawColor, "ABGR555");

            spriteData.push(...color);
          }

          imagesCanvas.width = 800;
          imagesCanvas.images.push({
            width,
            height,
            data: new Uint8Array(spriteData),
          });

          pointer += 0x4;
        }

        basePointer += 0x18;
      }
    } else if (file.name.match(/^KAO(.*?).DAT$/)) {
      imagesCanvas.width = 192;

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

        const spriteData = decompressedData.slice(
          0x222,
          0x222 + width * height,
        );

        const palette = getPalette("BGR555", 0x22, 0x200, {
          firstTransparent: true,
          bigEndian: true,
          dataView,
        });

        for (let i = 0x0; i < 2; i += 0x1) {
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

              imagesCanvas.images.push({
                width: width,
                height: height,
                data: applyPalette(layerData, palette),
              });
            }
          }
        }
      });
    } else if (
      [
        "LOGO.SPR",
        "ENDLOGO.SPR",
        "HAJUNOMA.SPR",
        "MOVIESEL.SPR",
        "MODESEL.SPR",
        "MOVSEL2.SPR",
      ].includes(file.name)
    ) {
      imagesCanvas.width = 320;
      imagesCanvas.images.push(getImage(320, 224, file.dataView));
    } else if (file.name === "STTL1.SPR") {
      imagesCanvas.width = 288;

      for (let i = 0; i < 12; i += 1) {
        imagesCanvas.images.push(getImage(48, 48, file.dataView, i * 0x1200));
      }

      imagesCanvas.images.push(getImage(288, 672, file.dataView, 0xd800));
    } else if (file.name === "TOMEGA.SPR") {
      imagesCanvas.width = 224;
      imagesCanvas.images.push(getImage(224, 896, file.dataView));
    } else if (
      ["NSLOGO.BIN", "NSLOGOS.BIN", "LOGOBLK.BIN", "LOGONEW.BIN"].includes(
        file.name,
      )
    ) {
      imagesCanvas.width = 304;
      imagesCanvas.images.push(getImage(304, 112, file.dataView));
    } else if (["THREE.BIN", "THREES.BIN"].includes(file.name)) {
      imagesCanvas.width = 104;
      imagesCanvas.images.push(getImage(104, 104, file.dataView));
    } else if (file.name === "LOGOBG.BIN") {
      imagesCanvas.width = 320;
      imagesCanvas.images.push(getImage(320, 240, file.dataView));
    } else if (file.name === "ENDING.SPR") {
      imagesCanvas.width = 320;
      imagesCanvas.images.push(
        getImage(320, 448, file.dataView, 0x0, "ABGR555"),
      );
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
    } else if (file.name === "KODERA.SPR") {
      imagesCanvas.width = 40;
      imagesCanvas.images.push(getImage(40, 40, file.dataView));
    }
  }

  return imagesCanvas;
}

function getDecompressedSpriteData(
  offset: number,
  dataView: DataView,
): Uint8Array {
  const decompressedData: number[] = [];

  const buffer = new Uint8Array(0x100);

  let bufferIndex = 0x0;

  const offsetEnd = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  let offset2 = offsetEnd;

  offset += 0x4;

  let mask = 0x0;

  if ((offsetEnd & 0x1) !== 0x0) {
    mask = 0x80000000;
  } else {
    mask = getInt(offset2, "uint8", {}, dataView);
    offset2 += 0x1;
    mask = (mask << 0x18) | 0x800000;
  }

  // Set end of buffer that will not be erased
  buffer.set([0x00, 0x00], 0xfa);
  buffer.set([0x80, 0x00], 0xfc);
  buffer.set([0x7f, 0xff], 0xfe);

  while (offset < offsetEnd) {
    let byte1 = getInt(offset, "uint8", {}, dataView);
    let byte2 = 0x0;

    offset += 0x1;

    if (byte1 < 0x80) {
      byte2 = getIntFromArray(buffer, byte1 * 0x2, "uint16", true);
    } else {
      byte2 = (byte1 << 0x8) | getInt(offset, "uint8", {}, dataView);

      offset += 0x1;

      buffer.set(intToArray(byte2, "uint16", true), bufferIndex);

      bufferIndex = (bufferIndex + 0x2) % 0xfa;
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
                byte1 = byte1 * 2;

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

                    decompressedData.push(...intToArray(byte2, "uint16", true));

                    if (byte1 !== unknown) {
                      byte1 -= 0x1;

                      let count = (byte1 >> 2) * 2;

                      byte2 = (byte2 << 0x10) | byte2;

                      if ((byte1 & 0x2) !== 0x0) {
                        decompressedData.push(
                          ...intToArray(byte2, "uint32", true),
                        );
                      }

                      for (let i = 0x0; i < count; i += 0x1) {
                        decompressedData.push(
                          ...intToArray(byte2, "uint32", true),
                        );
                      }

                      if ((byte1 & 0x1) !== 0x0) {
                        decompressedData.push(
                          ...intToArray(byte2, "uint16", true),
                        );
                      }
                    } else {
                      decompressedData.push(
                        ...intToArray(byte2, "uint16", true),
                      );
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
        decompressedData.push(...intToArray(byte2, "uint16", true));

        next = true;
      }
    }
  }

  return new Uint8Array(decompressedData);
}
