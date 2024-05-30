import { getInt } from "$lib/utils/bytes";
import { getFile } from "$lib/utils/common/iso9660";
import debug from "$lib/utils/debug";
import { applyPalette } from "$lib/utils/graphics";

import type { Palette } from "$lib/types";

import { getDecompressedData, getFilteredFiles, isDummy } from "../utils";

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
): Image {
  const length = width * height * 2;

  const imageData = [];

  for (let i = offset; i < offset + length; i += 0x2) {
    const color = getInt(i, "uint16", { bigEndian: true }, dataView);

    const blue = (color >> 0xa) << 0x3;
    const green = ((color >> 0x5) & 0x1f) << 0x3;
    const red = (color & 0x1f) << 0x3;
    const alpha = 255;

    imageData.push(red, green, blue, alpha);
  }

  return {
    width,
    height,
    data: new Uint8Array(imageData),
  };
}

export function getPalette(
  offset: number,
  length: number,
  transparent = false,
  dataView: DataView,
): Palette {
  const palette: Palette = [];

  for (let i = offset; i < offset + length; i += 0x2) {
    const color = getInt(i, "uint16", { bigEndian: true }, dataView);

    const blue = (color >> 0xa) << 0x3;
    const green = ((color >> 0x5) & 0x1f) << 0x3;
    const red = (color & 0x1f) << 0x3;
    const alpha = transparent && palette.length === 0 ? 0 : 255;

    palette.push([red, green, blue, alpha]);
  }

  return palette;
}

interface ImagesCanvas {
  width: number;
  images: Image[];
}

export function getImagesCanvas(index: number): ImagesCanvas {
  const files = getFilteredFiles("image");
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

      const palette = getPalette(
        paletteOffsetStart,
        0x200,
        false,
        file.dataView,
      );

      for (let i = 0x0; i < spritesOffsets.length; i += 0x1) {
        if (spritesOffsets[i] !== -1) {
          imagesCanvas.images.push({
            width: 32,
            height: 32,
            data: applyPalette(
              getDecompressedData(spritesOffsets[i], file.dataView),
              palette,
            ),
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
      const pointer = getInt(0xc50, "uint32", { bigEndian: true }, file.dataView); //prettier-ignore

      let test: number[] = [];

      for (let i = 0; i < 0x20; i += 1) {
        const byte = getInt(pointer + i, "uint8", {}, file.dataView);
        const nextByte = getInt(pointer + i + 0x1, "uint8", {}, file.dataView);

        debug.color(`read ${byte.toHex()}`, "blue");

        if (byte === 0x0 && nextByte === 0x0) {
          //
        } else if (byte === 0x7f) {
          const nextByte = getInt(pointer + i + 0x1, "uint8", {}, file.dataView); //prettier-ignore

          debug.color(`next ${nextByte.toHex()}`, "darkblue");

          switch (nextByte) {
            case 0x7d:
              test.push(0x0, 0x0);
              debug.color("push 00 00", "green");
              break;
            case 0x7e:
              test.push(0x80, 0x0);
              debug.color("push 80 00", "green");
              break;
            default:
              test.push(0x7f, 0xff, nextByte);
              debug.color(`push 7F FF ${nextByte.toHex(2)}`, "green");
              break;
          }
          i += 0x1;
        } else {
          test.push(byte);

          debug.color(`push ${byte.toHex()}`, "green");
        }
      }

      console.log(test.map((a) => a.toHex(2)));

      const spriteData = [];

      for (let j = 0x0; j < test.length; j += 0x2) {
        const color = (test[j] << 0x8) | test[j + 0x1];
        const blue = (color >> 0xa) << 0x3;
        const green = ((color >> 0x5) & 0x1f) << 0x3;
        const red = (color & 0x1f) << 0x3;
        const alpha = (color >> 0xf) * 255;

        spriteData.push(red, green, blue, alpha);
      }

      imagesCanvas.width = 40;
      imagesCanvas.images.push({
        width: 40,
        height: 40,
        data: spriteData,
      });
    } else if (file.name.match(/^KAO(.*?).DAT$/)) {
      imagesCanvas.width = 192;

      const offsets = [];

      for (let i = 0x0; i < file.dataView.byteLength; i += 0x1) {
        const validator = [0x0, 0x40, 0x0, 0x40];

        const isSprite = validator.every((hex, index) => {
          if (getInt(i + index, "uint8", {}, file.dataView) === hex) {
            return true;
          }
        });

        if (isSprite) {
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
        const palette = getPalette(0x22, 0x200, true, dataView);

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
    } else if (["LOGO.SPR", "ENDLOGO.SPR"].includes(file.name)) {
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
    } else if (file.name.match(/^X4EN(.*?).BIN$/) && !isDummy(file.dataView)) {
      imagesCanvas.width = 512;
      imagesCanvas.images.push({
        width: 512,
        height: 256,
        data: applyPalette(
          new Uint8Array(file.dataView.buffer.slice(0x200)),
          getPalette(0x0, 0x200, false, file.dataView),
        ),
      });
    } else if (file.name === "KODERA.SPR") {
      imagesCanvas.width = 40;
      imagesCanvas.images.push(getImage(40, 40, file.dataView));
    }
  }

  return imagesCanvas;
}
