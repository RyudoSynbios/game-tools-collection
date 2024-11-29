import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import {
  type File,
  customGetRegions,
  getFile,
  getFiles,
  hasSectors,
  readIso9660,
  resetIso9660,
  writeFile,
} from "$lib/utils/common/iso9660";
import { decodeCamelotFont, decodeWindows31J } from "$lib/utils/decode";
import { getRegionArray } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type { Item, ItemContainer, ItemInt } from "$lib/types";

import FileList from "./components/FileList.svelte";
import ImageViewer from "./components/ImageViewer.svelte";
import ModelViewer from "./components/ModelViewer.svelte";
import Shops from "./components/Shops.svelte";
import TextViewer from "./components/TextViewer.svelte";
import TxtViewer from "./components/TxtViewer.svelte";
import VideoViewer from "./components/VideoViewer.svelte";
import {
  characterCount,
  characterNamesStartIndexes,
  classNamesStartIndexes,
  enemyCount,
  enemyNamesStartIndexes,
  itemCount,
  itemDescriptionsStartIndexes,
  itemNamesStartIndexes,
  itemOffsetShift,
  itemTypesStartIndexes,
  specialAttackCount,
  specialAttackNamesStartIndexes,
  spellCount,
  spellNamesStartIndexes,
} from "./template";
import { decodeKanji } from "./utils/decode";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

const dataViews = [
  { name: "x002", fileName: "X002.BIN" }, // Items
  { name: "x019", fileName: "X019.BIN" }, // Enemies
  { name: "x023", fileName: "X023.BIN" }, // Shops
  { name: "x033", fileName: "X033.BIN" }, // Party
];

export function beforeItemsParsing(): void {
  const $dataViewAlt = get(dataViewAlt);

  readIso9660();

  dataViews.forEach((dataView) => {
    const file = getFile(dataView.fileName);

    if (file) {
      $dataViewAlt[dataView.name] = file.dataView;
    }
  });
}

export function overrideParseItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "party") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = getRegionArray(characterCount);
  } else if ("dataViewAltKey" in item && item.dataViewAltKey === "x033") {
    if (!cache.partyStatsBaseOffset) {
      const shifts = getCharacterShifts();

      cache.partyStatsBaseOffset = getFileOffset(
        "x033",
        shifts.stats,
        $dataViewAlt.x033,
      );
      cache.partyMiscBaseOffset = getFileOffset(
        "x033",
        shifts.misc,
        $dataViewAlt.x033,
      );
    }

    if (item.type === "bitflags") {
      item.flags.map((flag) => ({
        ...flag,
        offset: (flag.offset += cache.partyStatsBaseOffset),
      }));
    } else {
      item.offset += cache.partyStatsBaseOffset;
    }
  } else if ("id" in item && item.id === "items") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = getRegionArray(itemCount);
  } else if ("dataViewAltKey" in item && item.dataViewAltKey === "x002") {
    if (!cache.itemsBaseOffset) {
      const shift = getRegionArray(itemOffsetShift);

      const baseOffset = getFileOffset("x002", 0x80, $dataViewAlt.x002);

      cache.itemsBaseOffset = getFileOffset(
        "x002",
        baseOffset + shift,
        $dataViewAlt.x002,
      );
    }

    if (item.type === "bitflags") {
      item.flags.map((flag) => ({
        ...flag,
        offset: (flag.offset += cache.itemsBaseOffset),
      }));
    } else {
      item.offset += cache.itemsBaseOffset;
    }
  } else if ("id" in item && item.id === "enemies") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = getRegionArray(enemyCount);
  } else if ("dataViewAltKey" in item && item.dataViewAltKey === "x019") {
    if (!cache.enemiesBaseOffset) {
      cache.enemiesBaseOffset = getFileOffset("x019", 0x0, $dataViewAlt.x019);
    }

    if (item.type === "bitflags") {
      item.flags.map((flag) => ({
        ...flag,
        offset: (flag.offset += cache.enemiesBaseOffset),
      }));
    } else {
      item.offset += cache.enemiesBaseOffset;
    }
  } else if ("id" in item && item.id?.match(/assetViewer-/)) {
    const [, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    const itemContainer = item as ItemContainer;

    itemContainer.instances = files.length;
  }

  return item;
}

export function onReady(): void {
  updateResources("characterNames");
}

let cache: {
  partyStatsBaseOffset: number;
  partyMiscBaseOffset: number;
  itemsBaseOffset: number;
  enemiesBaseOffset: number;
  dummyTextFile: DataView;
  texts: string[];
} = {
  partyStatsBaseOffset: 0x0,
  partyMiscBaseOffset: 0x0,
  itemsBaseOffset: 0x0,
  enemiesBaseOffset: 0x0,
  dummyTextFile: new DataView(new ArrayBuffer(0)),
  texts: [],
};

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "iEffectValue") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x1, "uint8", {}, $dataViewAlt.x002);

    if (int === 0x11) {
      itemInt.name = "Spell";
      itemInt.resource = "itemEffectSpells";
    } else if (int === 0x12) {
      itemInt.name = "Special";
      itemInt.resource = "specialAttackNames";
    } else {
      itemInt.name = "Value";
      itemInt.resource = undefined;
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/cName-/)) {
    const [index] = item.id.splitInt();

    const names = getCharacterNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/cMisc-/)) {
    const itemInt = item as ItemInt;

    const cStatsItem = getItem(item.id.replace("cMisc", "cIndex")) as ItemInt;

    const index = getInt(cStatsItem.offset, "uint8", {}, $dataViewAlt.x033);

    const int = getInt(
      cache.partyMiscBaseOffset + itemInt.offset + index * 0x20,
      itemInt.dataType as "bit" | "int8" | "uint8" | "int16" | "uint16",
      {
        bigEndian: itemInt.bigEndian,
        binary: itemInt.binary,
        bit: itemInt.bit,
      },
      $dataViewAlt.x033,
    );

    return [true, int];
  } else if ("id" in item && item.id?.match(/iName-/)) {
    const [index] = item.id.splitInt();

    const names = getItemNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/iDescription-/)) {
    const [index] = item.id.splitInt();

    const names = getItemDescriptions();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/eName-/)) {
    const [index] = item.id.splitInt();

    const names = getEnemyNames();

    return [true, names[index] || "???"];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/cMisc-/)) {
    const itemInt = item as ItemInt;

    const cStatsItem = getItem(item.id.replace("cMisc", "cIndex")) as ItemInt;

    const index = getInt(cStatsItem.offset, "uint8", {}, $dataViewAlt.x033);

    setInt(
      cache.partyMiscBaseOffset + itemInt.offset + index * 0x20,
      itemInt.dataType as "bit" | "int8" | "uint8" | "int16" | "uint16",
      value,
      {
        bigEndian: itemInt.bigEndian,
        binary: itemInt.binary,
        bit: itemInt.bit,
      },
      "x033",
    );

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "iEffectType") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.x002);

    if (int === 0x11 || int === 0x12) {
      setInt(itemInt.offset + 0x1, "uint8", 0x0, {}, "x002");
    }
  }
}

export function getComponent(
  component: string,
):
  | typeof FileList
  | typeof ImageViewer
  | typeof ModelViewer
  | typeof Shops
  | typeof TextViewer
  | typeof TxtViewer
  | typeof VideoViewer
  | undefined {
  if (component === "FileList") {
    return FileList;
  } else if (component === "ImageViewer") {
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

  dataViews.forEach((dataView) => {
    writeFile(dataView.fileName, $dataViewAlt[dataView.name]);
  });

  return $dataView.buffer;
}

export function onReset(): void {
  cache = {
    partyStatsBaseOffset: 0x0,
    partyMiscBaseOffset: 0x0,
    itemsBaseOffset: 0x0,
    enemiesBaseOffset: 0x0,
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
  const $dataViewAlt = get(dataViewAlt);

  const characterNamesStartIndex = getRegionArray(characterNamesStartIndexes);
  const count = getRegionArray(characterCount);

  const names: { [value: number]: string } = {};

  const shifts = getCharacterShifts();

  const offset = getFileOffset("x033", shifts.stats, $dataViewAlt.x033);

  const indexes = [];

  for (let i = 0x0; i < count; i += 0x1) {
    const characterIndex = getInt(offset + i * 0x7b, "uint8", {}, $dataViewAlt.x033); // prettier-ignore

    let promoted = "";

    if (indexes[characterIndex]) {
      promoted = "(Promoted)";
    }

    indexes[characterIndex] = true;

    names[i] =
      `${getText(characterNamesStartIndex + characterIndex)}${promoted ? ` ${promoted}` : ""}`;
  }

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
  const count = getRegionArray(enemyCount);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getText(enemyNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getItemDescriptions(): { [value: number]: string } {
  const itemDescriptionStartIndex = getRegionArray(
    itemDescriptionsStartIndexes,
  );
  const count = getRegionArray(itemCount);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getText(itemDescriptionStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getItemEffectSpells(): { [value: number]: string } {
  const scenario = getScenario();
  const spellNames = getSpellNames();

  const spells = [
    0x0, 0x27, 0x12, 0x29, 0xc, 0x2, 0xd, 0xe, 0x5, 0xe, 0x1, 0x8, 0xb, 0x3,
    0x4, 0x7, 0xa, 0x4,
  ];

  // prettier-ignore
  switch (scenario) {
    case "1":
      spells.push(0x0, 0x26, 0x28);
      break;
    case "2":
      spells.push(0x0, 0x26, 0x28, 0x34, 0x36, 0x37);
      break;
    case "3":
    case "premium":
      spells.push(0x35, 0x26, 0x28, 0x34, 0x36, 0x37, 0x9, 0x3e, 0x3f, 0x47, 0x1, 0x3, 0x46);
      break;
  }

  const names: { [value: number]: string } = {};

  spells.forEach((spell, index) => {
    if (index === 0 || spell !== 0x0) {
      names[index] = spellNames[spell];
    }
  });

  names[0x0] = "-";

  return names;
}

export function getItemNames(): { [value: number]: string } {
  const itemNamesStartIndex = getRegionArray(itemNamesStartIndexes);
  const count = getRegionArray(itemCount);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getText(itemNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getItemTypes(): { [value: number]: string } {
  const itemTypesStartIndex = getRegionArray(itemTypesStartIndexes);

  const scenario = getScenario();

  const types = [
    0x0, 0x1, 0xa, 0xb, 0xc, 0xd, 0xe, 0xf, 0x14, 0x15, 0x16, 0x1e, 0x1f, 0x20,
    0x21, 0x32, 0x33, 0x34, 0x3c, 0x3d, 0x3e, 0x46, 0x47, 0x48, 0x4a, 0x50,
    0x7a, 0x7b, 0x7c, 0x81,
  ];

  switch (scenario) {
    case "2":
      types.push(0x5a);
      break;
    case "3":
    case "premium":
      types.push(0x3f, 0x51, 0x52, 0x5a);
      break;
  }

  const names: { [value: number]: string } = {};

  types.forEach((type) => {
    names[type] = getText(itemTypesStartIndex + type);
  });

  names[0x0] = "-";
  names[0x1] = "Item";
  names[0x7a] = "Bracer";
  names[0x7b] = "Tiara";
  names[0x7c] = "Helmet";
  names[0x81] = "Accessory";

  return names;
}

export function getSpecialAttackNames(): { [value: number]: string } {
  const specialAttackNamesStartIndex = getRegionArray(
    specialAttackNamesStartIndexes,
  );
  const count = getRegionArray(specialAttackCount);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getText(specialAttackNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getSpellNames(): { [value: number]: string } {
  const spellNamesStartIndex = getRegionArray(spellNamesStartIndexes);
  const count = getRegionArray(spellCount);

  const names: { [value: number]: string } = {};

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getText(spellNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getCharacterShifts(): { misc: number; stats: number } {
  const $dataViewAlt = get(dataViewAlt);

  let misc = 0x0;
  let stats = 0x0;

  for (let i = 0x0; i < $dataViewAlt.x033.byteLength; i += 0x4) {
    const value = getInt(i, "uint32", { bigEndian: true }, $dataViewAlt.x033);

    if (value === 0xfd00f4) {
      misc = i + 0x4;
    } else if (value === 0xf40000) {
      misc = i + 0x4;
    } else if (value === 0xb6073) {
      stats = i + 0x4;
    }

    if (misc && stats) {
      break;
    }
  }

  return { misc, stats };
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
    } else if (file.name.match(/.CHP$/) || file.name.match(/.CHR$/)) {
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
    } else if (!file.isDirectory) {
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
  const scenario = getScenario();

  const absoluteOffset = getInt(
    offset,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  if (identifier === "x002") {
    if (scenario === "1") {
      return absoluteOffset - 0x6028800;
    }

    return absoluteOffset - 0x602a000;
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

function isPatched(): boolean {
  const $dataView = get(dataView);

  const validator = [0x53, 0x46, 0x33, 0x54, 0x52, 0x41, 0x4e, 0x53]; // "SF3TRANS"

  const offset = hasSectors($dataView) ? 0x30 : 0x20;

  return checkValidator(validator, offset);
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
      const file = getFile("X5SHOP_T.BIN");

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
  const patched = isPatched();

  if (dataView.byteLength > 0) {
    const treesPointerOffset = scenario === "1" && !patched ? 0xc : 0x18;
    const treesOffset = getFileOffset("x5", treesPointerOffset, dataView);

    const pagesPointerOffset = scenario === "1" && !patched ? 0x18 : 0x24;

    const page = Math.floor(index / 0x100);

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
          text += decodeKanji(scenario, letter);
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
