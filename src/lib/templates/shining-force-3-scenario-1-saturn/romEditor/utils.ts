import { getInt } from "$lib/utils/bytes";
import {
  type File,
  customGetRegions,
  getFile,
  getFiles,
  readIso9660,
  resetIso9660,
} from "$lib/utils/common/iso9660";
import { decodeWindows31J } from "$lib/utils/decode";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

import ImageViewer from "./components/ImageViewer.svelte";
import ModelViewer from "./components/ModelViewer.svelte";
import TextViewer from "./components/TextViewer.svelte";
import VideoViewer from "./components/VideoViewer.svelte";
import {
  characterNames,
  classNames,
  enemyNames,
  itemNames,
  spellNames,
  weaponSpecialNames,
} from "./utils/temporary";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  readIso9660();

  return shifts;
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
} = {
  characters: new DataView(new ArrayBuffer(0)),
  items: new DataView(new ArrayBuffer(0)),
  enemies: new DataView(new ArrayBuffer(0)),
};

// TODO: X023.BIN > Shops

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

    if (cache.characters.byteLength === 0x0) {
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

    if (cache.items.byteLength === 0x0) {
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

    if (cache.enemies.byteLength === 0x0) {
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
  } else if (component === "TextViewer") {
    return TextViewer;
  } else if (component === "VideoViewer") {
    return VideoViewer;
  }
}

export function onReset(): void {
  cache = {
    characters: new DataView(new ArrayBuffer(0)),
    items: new DataView(new ArrayBuffer(0)),
    enemies: new DataView(new ArrayBuffer(0)),
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
  return characterNames;
}

export function getClassesNames(): { [value: number]: string } {
  return classNames;
}

export function getEnemyNames(): { [value: number]: string } {
  return enemyNames;
}

export function getItemNames(): { [value: number]: string } {
  return itemNames;
}

export function getSpellNames(): { [value: number]: string } {
  return spellNames;
}

export function getWeaponSpecialNames(): { [value: number]: string } {
  return weaponSpecialNames;
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
      file.name === "LOGOBG.BIN" ||
      file.name === "LOGOBLK.BIN" ||
      file.name === "LOGONEW.BIN" ||
      file.name === "NSLOGO.BIN" ||
      file.name === "NSLOGOS.BIN" ||
      file.name === "THREE.BIN" ||
      file.name === "THREES.BIN" ||
      file.name.match(/.FNT$/) ||
      file.name.match(/.SPR$/) ||
      file.name.match(/^FACE(.*?).DAT$/) ||
      file.name.match(/^KAO(.*?).DAT$/) ||
      file.name.match(/^X4EN(.*?).BIN$/)
    ) {
      return type === "image";
    } else if (file.name.match(/.MPD$/) && file.name !== "SHIP2.MPD") {
      return type === "location";
    } else if (file.name.match(/.TXT$/)) {
      return type === "text";
    } else if (file.name.match(/^X2ST(.*?).BIN$/)) {
      return type === "battleStage";
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
  } else if (identifier === "x033") {
    return absoluteOffset - 0x6078000;
  } else if (identifier === "mpd" && absoluteOffset >= 0x60a0000) {
    return absoluteOffset - 0x609df00;
  } else if (identifier === "mpd" && absoluteOffset >= 0x290000) {
    return absoluteOffset - 0x290000;
  }

  return absoluteOffset;
}

export function isDummy(dataView: DataView): boolean {
  if (dataView.byteLength === 2) {
    return true;
  }

  const validator = [0x64, 0x75, 0x6d, 0x6d, 0x79, 0xa]; // "dummy"

  return checkValidator(validator, 0x0, dataView);
}

export function readText(dataView: DataView): string {
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
