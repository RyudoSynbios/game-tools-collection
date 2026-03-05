import { get } from "svelte/store";

import { dataView, dataViewAlt, dataViewAltMetas } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Iso9660, {
  customGetRegions,
  type File,
} from "$lib/utils/common/iso9660";
import { isInRange } from "$lib/utils/format";
import {
  generateDataViewAltPatch,
  importDataViewAltPatch,
  type PatchData,
} from "$lib/utils/patch";
import { getRegionName } from "$lib/utils/validator";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemSection,
  Palette,
  Patch,
  Resource,
} from "$lib/types";

import IconCanvas from "./components/IconCanvas.svelte";
import ImageViewer from "./components/ImageViewer.svelte";
import TxtViewer from "./components/TxtViewer.svelte";
import {
  CHARACTER_NAMES_START_INDEX,
  CLASS_NAMES_START_INDEX,
  ENEMY_NAMES_START_INDEX,
  ITEM_DESCRIPTIONS_START_INDEX,
  ITEM_NAMES_START_INDEX,
  ITEM_TYPES_START_INDEX,
  SPELL_NAMES_START_INDEX,
  X09_POINTERS,
} from "./utils/constants";
import { getText } from "./utils/encoding";
import { getMainPalette } from "./utils/image";

export let iso: Iso9660;

const dataViews = [{ name: "x09", fileName: "X09.BIN" }];

export let cache: {
  dummyTextFile: DataView;
  mainPalette: Palette;
  shops: number[][];
  texts: string[];
} = {
  dummyTextFile: new DataView(new ArrayBuffer(0)),
  mainPalette: [],
  shops: [],
  texts: [],
};

export function getComponent(
  component: string,
): typeof IconCanvas | typeof ImageViewer | typeof TxtViewer | undefined {
  switch (component) {
    case "IconCanvas":
      return IconCanvas;
    case "ImageViewer":
      return ImageViewer;
    case "TxtViewer":
      return TxtViewer;
  }
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  iso = new Iso9660($dataView);

  dataViews.forEach((dataView) => {
    const file = iso.getFile(dataView.fileName);

    if (file) {
      $dataViewAlt[dataView.name] = file.dataView;
    }
  });

  cache.mainPalette = getMainPalette();
  cache.shops = generateShops();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/assetViewer-/)) {
    const itemContainer = item as ItemContainer;

    const [, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    itemContainer.instances = files.length;

    return itemContainer;
  } else if ("id" in item && item.id === "shops") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = cache.shops.length;

    return itemContainer;
  } else if ("id" in item && item.id?.match(/shopItemSection-/)) {
    const itemSection = item as ItemSection;

    const [shopIndex, index] = item.id.splitInt();

    if (cache.shops[shopIndex][index] === undefined) {
      itemSection.hidden = true;
      (itemSection.items[0] as ItemInt).hidden = true;
      (itemSection.items[1] as ItemInt).hidden = true;
    }

    return itemSection;
  } else if ("id" in item && item.id?.match(/shopItem-/)) {
    const itemInt = item as ItemInt;

    const [shopIndex, index] = item.id.splitInt();

    itemInt.offset += cache.shops[shopIndex][index] || 0x0;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "cItemStatus") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.x09);

    itemInt.disabled = int === 0xff;

    return itemInt;
  } else if ("id" in item && item.id?.match(/shopItem-(.*?)-flag/)) {
    const itemInt = item as ItemInt;

    const flag = getInt(itemInt.offset, "uint16", { bigEndian: true }, $dataViewAlt.x09); // prettier-ignore
    const int = getInt(itemInt.offset - 0x2, "uint16", { bigEndian: true }, $dataViewAlt.x09); // prettier-ignore

    itemInt.name = `Flag (${flag.toHex(0, true)})`;
    itemInt.hidden = int < 0x2bc;

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
  } else if ("id" in item && item.id?.match(/clName-/)) {
    const [index] = item.id.splitInt();

    const names = getClassNames("true");

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id === "cItemStatus") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/iName-/)) {
    const [index] = item.id.splitInt();

    const names = getItemNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/iDescription-/)) {
    const [index] = item.id.splitInt();

    const descriptions = getItemDescriptions();

    return [true, descriptions[index] || "???"];
  } else if ("id" in item && item.id === "iEffectType") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset + 0x4, "uint8", {}, $dataViewAlt.x09);

    if (value === 0x0) {
      return [true, 0xff];
    }
  } else if ("id" in item && item.id?.match(/eName-/)) {
    const [index] = item.id.splitInt();

    const names = getEnemyNames();

    return [true, names[index] || "???"];
  } else if ("id" in item && item.id?.match(/shopItem-/)) {
    const itemInt = item as ItemInt;

    const [, , , type] = item.id.split("-");

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true }, $dataViewAlt.x09); // prettier-ignore

    let typeIndex = 0;
    let itemIndex = int;

    if (isInRange(int, 0x190, 0x2bb)) {
      typeIndex = 1;
      itemIndex -= 0x190;
    } else if (int >= 0x2bc) {
      typeIndex = 2;
      itemIndex -= 0x2bc;
    }

    if (type === "item") {
      return [true, itemIndex];
    } else if (type === "type") {
      return [true, typeIndex];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  // prettier-ignore
  if ("id" in item && item.id === "cItem") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.x09);

    if (int === 0xfff) {
      setInt(itemInt.offset, "uint8", 0xf, {
        binary: { bitStart: 4, bitLength: 4 },
      }, "x09");
    } else if (previous === 0xff) {
      setInt(itemInt.offset, "uint8", 0x0, {
        binary: { bitStart: 4, bitLength: 4 },
      }, "x09");
    }

    setInt(itemInt.offset, "uint16", int, {
      bigEndian: true,
      binary: itemInt.binary,
    }, "x09");

    return true;
  } else if ("id" in item && item.id === "iEffectType") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    const previous = getInt(itemInt.offset + 0x4, "uint8", {}, $dataViewAlt.x09);

    if (int === 0xff) {
      int = 0x0;
      setInt(itemInt.offset + 0x4, "uint8", 0x0, {}, "x09");
    } else if (previous === 0x0) {
      setInt(itemInt.offset + 0x4, "uint8", 0x1, {}, "x09");
    }

    setInt(itemInt.offset, "uint8", int, {}, "x09");

    return true;
  }

  return false;
}

export function pointerToOffset(pointer: number): number {
  const $dataViewAlt = get(dataViewAlt);

  return getFileOffset("x09", pointer, $dataViewAlt.x09);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);

  dataViews.forEach((dataView) => {
    if ($dataViewAltMetas[dataView.name]?.isDirty) {
      iso.writeFile(dataView.fileName, $dataViewAlt[dataView.name]);
    }
  });

  return iso.getBuffer();
}

export function onReset(): void {
  cache = {
    dummyTextFile: new DataView(new ArrayBuffer(0)),
    mainPalette: [],
    shops: [],
    texts: [],
  };
}

export function importPatch(patch: Patch<PatchData>): void {
  importDataViewAltPatch(patch);
}

export function generatePatch(): Patch<PatchData> {
  const regions = [getRegionName()];

  return generateDataViewAltPatch(
    "shining-the-holy-ark-saturn",
    "1.0",
    regions,
  );
}

export function getAssetNames(type: string): Resource {
  const names: Resource = {};

  const files = getFilteredFiles(type);

  files.forEach((file, index) => {
    names[index] = file.name;
  });

  return names;
}

export function getCharacterNames(): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0x8; i += 0x1) {
    names[i] = getText(CHARACTER_NAMES_START_INDEX + i);
  }

  return names;
}

export function getClassNames(reorder = "false"): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0x10; i += 0x1) {
    let index = i;

    if (reorder === "true") {
      index = Math.floor(i / 2) + (i % 2 ? 8 : 0);
    }

    names[i] = getText(CLASS_NAMES_START_INDEX + index);
  }

  return names;
}

export function getEnemyNames(): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0x68; i += 0x1) {
    names[i] = getText(ENEMY_NAMES_START_INDEX + i);
  }

  return names;
}

export function getItemDescriptions(): Resource {
  const descriptions: Resource = {};

  for (let i = 0x0; i < 0xd2; i += 0x1) {
    descriptions[i] = getText(ITEM_DESCRIPTIONS_START_INDEX + i);
  }

  return descriptions;
}

export function getItemNames(isDropItem = "false"): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0xd2; i += 0x1) {
    names[i] = getText(ITEM_NAMES_START_INDEX + i);
  }

  if (isDropItem === "true") {
    names[0xffff] = "-";
  } else {
    names[0xfff] = "-";
  }

  return names;
}

export function getItemTypeNames(): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0x7; i += 0x1) {
    names[i] = getText(ITEM_TYPES_START_INDEX + i);
  }

  return names;
}

export function getSpellNames(): Resource {
  const names: Resource = {};

  for (let i = 0x0; i < 0x28; i += 0x1) {
    names[i] = getText(SPELL_NAMES_START_INDEX + i);
  }

  return names;
}

export function getFileData(type: string, index: number): DataView {
  const files = getFilteredFiles(type);
  const file = iso.getFile(files[index].name);

  if (file) {
    return file.dataView;
  }

  return new DataView(new ArrayBuffer(0));
}

export function getFilteredFiles(type: string): File[] {
  const files = iso.getFiles();

  return files.filter((file) => {
    if (file.name.match(/.CHR$/)) {
      return type === "sprite";
    } else if (
      file.name === "X07.BIN" ||
      file.name === "X09.BIN" ||
      file.name.match(/.FNT$/) ||
      file.name.match(/.SPR$/)
    ) {
      return type === "image";
    } else if (file.name.match(/.TXT$/)) {
      return type === "txt";
    } else {
      return type === "asset";
    }
  });
}

// prettier-ignore
export function getFileOffset(
  identifier: string,
  offset: number,
  dataView: DataView,
): number {
  const absoluteOffset = getInt(offset, "uint32", { bigEndian: true }, dataView);

  switch (identifier) {
    case "chr1":
      return absoluteOffset - 0x280000;
    case "chr2":
      return absoluteOffset - 0x290000;
    case "chr3":
      return absoluteOffset - 0x2fe000;
    case "mdx":
      return absoluteOffset - 0x217800;
    case "x07":
      return absoluteOffset - 0x609d000;
    case "x09":
      return absoluteOffset - 0x200000
  }

  return absoluteOffset;
}

function generateShops(): number[][] {
  const $dataViewAlt = get(dataViewAlt);

  const shops: number[][] = [];

  let offset = getFileOffset("x09", X09_POINTERS.shops, $dataViewAlt.x09);
  let instanceOffset = 0x0;

  let shop = [];

  while (offset < $dataViewAlt.x09.byteLength) {
    const item = getInt(offset, "uint16", { bigEndian: true }, $dataViewAlt.x09); // prettier-ignore

    if (item === 0x3e7) {
      shops.push(shop);
      shop = [];
    } else if (item !== 0xffff) {
      shop.push(instanceOffset);

      if (item >= 0x2bc) {
        instanceOffset += 0x2;
        offset += 0x2;
      }
    } else {
      break;
    }

    instanceOffset += 0x2;
    offset += 0x2;
  }

  return shops;
}
