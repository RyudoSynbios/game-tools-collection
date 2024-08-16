import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import {
  type File,
  customGetRegions,
  getFile,
  getFiles,
  readIso9660,
  resetIso9660,
  writeFile,
} from "$lib/utils/common/iso9660";
import { decodeCamelotFont, decodeWindows31J } from "$lib/utils/decode";
import { getRegionArray } from "$lib/utils/format";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

import ImageViewer from "./components/ImageViewer.svelte";
import ModelViewer from "./components/ModelViewer.svelte";
import Shops from "./components/Shops.svelte";
import TextViewer from "./components/TextViewer.svelte";
import TxtViewer from "./components/TxtViewer.svelte";
import VideoViewer from "./components/VideoViewer.svelte";
import {
  characterNamesStartIndexes,
  classNamesStartIndexes,
  enemyNamesStartIndexes,
  itemNamesStartIndexes,
  spellNamesStartIndexes,
  weaponSpecialNamesStartIndexes,
} from "./template";
import { decodeKanji } from "./utils/decode";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function beforeItemsParsing(): void {
  readIso9660();
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/assetViewer-/)) {
    const [_, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    const itemContainer = item as ItemContainer;

    itemContainer.instances = files.length;
  }

  return item;
}

let cache: {
  characters: DataView;
  items: DataView;
  enemies: DataView;
  dummyTextFile: DataView;
  texts: string[];
} = {
  characters: new DataView(new ArrayBuffer(0)),
  items: new DataView(new ArrayBuffer(0)),
  enemies: new DataView(new ArrayBuffer(0)),
  dummyTextFile: new DataView(new ArrayBuffer(0)),
  texts: [],
};

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/cName-/)) {
    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const names = getCharacterNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);
    const type = split[2];

    if (cache.characters.byteLength === 0) {
      const file = getFile("X033.BIN");

      if (file) {
        cache.characters = file.dataView;
      }
    }

    let offset = 0x0;
    let length = 0x0;

    if (type === "miscellaneous") {
      offset = getFileOffset("x033", 0x2e4, cache.characters);
      length = index * 0x20;
    } else if (type === "stats") {
      offset = getFileOffset("x033", 0x34c, cache.characters);
    }

    const int = getInt(
      offset + itemInt.offset + length,
      itemInt.dataType as "int8" | "uint8" | "int16" | "uint16",
      { bigEndian: itemInt.bigEndian },
      cache.characters,
    );

    return [true, int];
  } else if ("id" in item && item.id?.match(/iName-/)) {
    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const names = getItemNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    if (cache.items.byteLength === 0) {
      const file = getFile("X002.BIN");

      if (file) {
        cache.items = file.dataView;
      }
    }

    const baseOffset = getFileOffset("x002", 0x80, cache.items);
    const offset = getFileOffset("x002", baseOffset + 0xb0, cache.items);

    const int = getInt(
      offset + itemInt.offset,
      itemInt.dataType as "int8" | "uint8" | "int16" | "uint16",
      { bigEndian: itemInt.bigEndian },
      cache.items,
    );

    return [true, int];
  } else if ("id" in item && item.id?.match(/eName-/)) {
    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const names = getEnemyNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id === "enemy") {
    const itemInt = item as ItemInt;

    if (cache.enemies.byteLength === 0) {
      const file = getFile("X019.BIN");

      if (file) {
        cache.enemies = file.dataView;
      }
    }

    const offset = getFileOffset("x019", 0x0, cache.enemies);

    const int = getInt(
      offset + itemInt.offset,
      itemInt.dataType as "int8" | "uint8" | "int16" | "uint16",
      { bigEndian: itemInt.bigEndian },
      cache.enemies,
    );

    return [true, int];
  }

  return [false, undefined];
}

export function getComponent(component: string): any {
  if (component === "ImageViewer") {
    return ImageViewer;
  } else if (component === "ModelViewer") {
    return ModelViewer;
  } else if (component === "Shops") {
    return Shops;
  } else if (component === "TextViewer") {
    return TextViewer;
  } else if (component === "TxtViewer") {
    return TxtViewer;
  } else if (component === "VideoViewer") {
    return VideoViewer;
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  if ($dataViewAlt.x023) {
    writeFile("X023.BIN", $dataViewAlt.x023);
  }

  return $dataView.buffer;
}

export function onReset(): void {
  cache = {
    characters: new DataView(new ArrayBuffer(0)),
    items: new DataView(new ArrayBuffer(0)),
    enemies: new DataView(new ArrayBuffer(0)),
    dummyTextFile: new DataView(new ArrayBuffer(0)),
    texts: [],
  };

  resetIso9660();
}

export function getAssetNames(type: string): { [value: number]: string } {
  const files = getFilteredFiles(type);

  const names: { [value: number]: string } = {};

  files.forEach((file, index) => {
    names[index] = file.name;
  });

  return names;
}

export function getCharacterNames(): { [value: number]: string } {
  const characterNamesStartIndex = getRegionArray(characterNamesStartIndexes);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0x14; i += 0x1) {
    names[i] = getText(characterNamesStartIndex + i);
  }

  for (let i = 0x0; i < 0xb; i += 0x1) {
    names[0x14 + i] = `${getText(characterNamesStartIndex + i)} (Promoted)`;
  }

  names[0x1f] = `${getText(characterNamesStartIndex + 0xe)} (Promoted)`;

  return names;
}

export function getClassesNames(): { [value: number]: string } {
  const classNamesStartIndex = getRegionArray(classNamesStartIndexes);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0x46; i += 0x1) {
    names[i] = getText(classNamesStartIndex + i);
  }

  return names;
}

export function getEnemyNames(): { [value: number]: string } {
  const enemyNamesStartIndex = getRegionArray(enemyNamesStartIndexes);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0x8d; i += 0x1) {
    names[i] = getText(enemyNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getItemNames(): { [value: number]: string } {
  const itemNamesStartIndex = getRegionArray(itemNamesStartIndexes);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0x100; i += 0x1) {
    names[i] = getText(itemNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getSpellNames(): { [value: number]: string } {
  const spellNamesStartIndex = getRegionArray(spellNamesStartIndexes);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0x33; i += 0x1) {
    names[i] = getText(spellNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getWeaponSpecialNames(): { [value: number]: string } {
  const weaponSpecialNamesStartIndex = getRegionArray(
    weaponSpecialNamesStartIndexes,
  );

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < 0xbc; i += 0x1) {
    names[i] = getText(weaponSpecialNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getDecompressedData(
  offset: number,
  dataView: DataView,
): Uint8Array {
  const decompressedData: number[] = [];

  let rewindCount = 0;
  let rewindPosition = 0;
  let count = 0;
  let counts: number[] = [];

  while (true) {
    const byte1 = getInt(offset, "uint8", {}, dataView);
    const byte2 = getInt(offset + 0x1, "uint8", {}, dataView);

    if (counts.length === 0) {
      const binary = `${byte1.toBinary()}${byte2.toBinary()}`;

      counts = binary.split("1").map((i) => i.length * 2);
    } else {
      rewindPosition = (byte1 << 4) | (byte2 >> 4);

      rewindCount = 4 + (byte2 & 0xf) * 2;

      if (rewindCount === 4 && rewindPosition === 0) {
        return new Uint8Array(decompressedData);
      }
    }

    offset += 2;

    if (rewindCount && rewindPosition) {
      while (rewindCount > 0) {
        const size = decompressedData.length;

        if (rewindPosition % 2 !== 0) {
          rewindCount += 32;
          rewindPosition -= 1;
        }

        decompressedData.push(decompressedData[size - rewindPosition]);

        rewindCount -= 1;
      }
    }

    count = counts.shift()!;

    while (count > 0) {
      const value = getInt(offset, "uint8", {}, dataView);

      decompressedData.push(value);

      count -= 1;
      offset += 1;
    }
  }
}

export function getFileData(type: string, index: number): DataView {
  const files = getFilteredFiles(type);
  const file = getFile(files[index].name);

  if (file) {
    return file.dataView;
  }

  return new DataView(new ArrayBuffer(0));
}

export function getFilteredFiles(type: string): File[] {
  const files = getFiles().filter((file) => {
    if (file.name.match(/.CPK$/)) {
      return type === "video";
    } else if (file.name.match(/.CHR$/)) {
      return type === "sprite";
    } else if (
      file.name.match(/^FACE(.*?).DAT$/) ||
      file.name.match(/^KAO(.*?).DAT$/)
    ) {
      return type === "face";
    } else if (
      file.name === "LOGOBG.BIN" ||
      file.name === "LOGOBLK.BIN" ||
      file.name === "LOGONEW.BIN" ||
      file.name === "NSLOGO.BIN" ||
      file.name === "NSLOGOS.BIN" ||
      file.name === "THREE.BIN" ||
      file.name === "THREES.BIN" ||
      file.name.match(/.FNT$/) ||
      file.name.match(/.SPR$/) ||
      file.name.match(/^X4EN(.*?).BIN$/)
    ) {
      return type === "image";
    } else if (file.name.match(/.MPD$/) && file.name !== "SHIP2.MPD") {
      return type === "location";
    } else if (file.name.match(/.TXT$/)) {
      return type === "txt";
    } else if (file.name.match(/^X2ST(.*?).BIN$/)) {
      return type === "battleStage";
    } else if (file.name.match(/^X5(.*?).BIN$/)) {
      return type === "text";
    } else if (file.name.match(/^X8PC(.*?).BIN$/)) {
      return type === "battleCharacter";
    } else {
      return type === "asset";
    }
  });

  return files;
}

export function getFileOffset(
  identifier: string,
  offset: number,
  dataView: DataView,
  subOffset = 0x0,
): number {
  const absoluteOffset = getInt(
    offset,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  if (identifier === "x002") {
    return absoluteOffset - 0x6028800;
  } else if (identifier === "x019") {
    return absoluteOffset - 0x60a0000;
  } else if (identifier === "x023") {
    return absoluteOffset - 0x6078000;
  } else if (identifier === "x033") {
    return absoluteOffset - 0x6078000;
  } else if (identifier === "x5") {
    return absoluteOffset - 0x200000;
  } else if (identifier === "mpd" && absoluteOffset >= 0x60a0000) {
    return absoluteOffset - (0x60a0000 - subOffset);
  } else if (identifier === "mpd" && absoluteOffset >= 0x290000) {
    return absoluteOffset - 0x290000;
  }

  return absoluteOffset;
}

export function getScenario(): string {
  const $gameRegion = get(gameRegion);

  switch ($gameRegion) {
    case 0:
    case 1:
      return "1";
    case 2:
      return "2";
    case 3:
      return "3";
    case 4:
      return "premium";
    default:
      return "";
  }
}

export function isDummy(offset: number, dataView: DataView): boolean {
  if (dataView.byteLength === 2) {
    return true;
  }

  const validator = [0x64, 0x75, 0x6d, 0x6d, 0x79, 0xa]; // "dummy"

  return checkValidator(validator, offset, dataView);
}

export function readTxt(dataView: DataView): string {
  let text = "";

  for (let i = 0x0; i < dataView.byteLength - 1; i += 0x1) {
    const code8 = getInt(i, "uint8", {}, dataView);
    const code16 = getInt(i, "uint16", { bigEndian: true }, dataView);

    if (code8 >= 0x81) {
      text += decodeWindows31J(code16);

      i += 0x1;
    } else {
      text += decodeWindows31J(code8);
    }
  }

  return text;
}

export function getText(
  index: number,
  format = true,
  dataView?: DataView,
): string {
  let text = "";

  if (cache.dummyTextFile.byteLength === 0) {
    const files = getFilteredFiles("text");

    if (files.length > 0) {
      const file = getFile(files[0].name);

      if (file) {
        cache.dummyTextFile = file.dataView;
      }
    }
  }

  if (dataView) {
    text = decodeText(index, dataView);
  } else {
    if (!cache.texts[index]) {
      cache.texts[index] = decodeText(index, cache.dummyTextFile);
    }

    text = cache.texts[index];
  }

  if (format) {
    return text.replace(/\{.*?\}/g, "");
  }

  return text;
}

export const decodeTextError = "DECODE ERROR!";

function decodeText(index: number, dataView: DataView): string {
  const $gameRegion = get(gameRegion);

  const scenario = getScenario();

  if (dataView.byteLength > 0) {
    const treesPointerOffset = scenario === "1" ? 0xc : 0x18;
    const treesOffset = getFileOffset("x5", treesPointerOffset, dataView);

    const pagesPointerOffset = scenario === "1" ? 0x18 : 0x24;

    let page = Math.floor(index / 0x100);

    index -= page * 0x100;

    const pagesOffset = getFileOffset("x5", pagesPointerOffset, dataView);

    if (pagesOffset + page * 0x4 >= dataView.byteLength) {
      return decodeTextError;
    }

    let wordOffset = getFileOffset("x5", pagesOffset + page * 0x4, dataView);

    for (let i = 0x0; i < index; i += 0x1) {
      wordOffset += getInt(wordOffset, "uint8", {}, dataView) + 0x1;

      const size = getInt(wordOffset, "uint8", {}, dataView);

      if (size === 0x0) {
        if ((i & 0xff) === 0xff) {
          i -= 0x1;
        } else {
          return decodeTextError;
        }
      }
    }

    wordOffset += 0x1;

    let text = "";

    let letter = 0xffff;
    let lastLetter = 0x0;

    let treeIndex = 0x0;
    let local10 = 0x80;

    while (letter !== 0x0) {
      letter = 0x0;

      for (let i = 0x0; i < 0x2; i += 0x1) {
        let mask = 0x80;

        const treeOffset = treesOffset + (treeIndex << 0x2) * 0x2;
        const lettersOffset = getFileOffset("x5", treeOffset, dataView);

        let local1c = getFileOffset("x5", treeOffset + 0x4, dataView);
        let leaf = 0x0;

        while (true) {
          let bVar1 = getInt(local1c, "uint8", {}, dataView) & mask;

          mask >>= 0x1;

          if (mask === 0x0) {
            local1c += 0x1;
            mask = 0x80;
          }

          if (bVar1 !== 0x0) {
            break;
          }

          bVar1 = getInt(wordOffset, "uint8", {}, dataView) & local10;

          local10 >>= 0x1;

          if (local10 === 0x0) {
            wordOffset += 0x1;
            local10 = 0x80;
          }

          if (bVar1 !== 0x0) {
            let iVar3 = 0x0;

            while (iVar3 >= 0x0) {
              if ((getInt(local1c, "uint8", {}, dataView) & mask) === 0x0) {
                iVar3 += 0x1;
              } else {
                leaf += 0x1;
                iVar3 -= 0x1;
              }

              mask >>= 0x1;

              if (mask === 0x0) {
                local1c += 0x1;
                mask = 0x80;
              }
            }
          }
        }

        const leafValue = getInt(lettersOffset + leaf, "uint8", {}, dataView);

        letter = (letter << 0x8) | leafValue;
        treeIndex = leafValue;
      }

      if (letter < 0x20) {
        text += `{${letter.toHex(2)}}`;
      } else if ($gameRegion === 0 || letter < 0x80) {
        text += String.fromCharCode(letter);
      } else {
        if (letter >= 0x100) {
          text += decodeKanji(letter);
        } else if ([0xde, 0xdf].includes(letter)) {
          text = text.slice(0, -1);
          text += decodeCamelotFont((lastLetter << 0x8) | letter);
        } else {
          text += decodeCamelotFont(letter);
        }
      }

      lastLetter = letter;
    }

    return text;
  }

  return decodeTextError;
}
