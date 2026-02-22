import { get } from "svelte/store";

import { dataView, dataViewAlt, dataViewAltMetas } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Iso9660, {
  customGetRegions,
  type File,
} from "$lib/utils/common/iso9660";
import {
  generateDataViewAltPatch,
  importDataViewAltPatch,
  type PatchData,
} from "$lib/utils/patch";
import { getRegionName } from "$lib/utils/validator";

import type { Item, ItemContainer, ItemInt, Patch, Resource } from "$lib/types";

import ImageViewer from "./components/ImageViewer.svelte";
import TxtViewer from "./components/TxtViewer.svelte";

export function getComponent(
  component: string,
): typeof ImageViewer | typeof TxtViewer | undefined {
  switch (component) {
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

export let iso: Iso9660;

const dataViews = [{ name: "x09", fileName: "X09.BIN" }];

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
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/assetViewer-/)) {
    const [, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    const itemContainer = item as ItemContainer;

    itemContainer.instances = files.length;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if (item.id === "items") {
    const pointer = getInt(0x3c, "uint32", { bigEndian: true }, $dataViewAlt.x09); // prettier-ignore
    const offset = (pointer & 0xfffff) + index * item.length;

    return [true, [offset]];
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "iEffectType") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset + 0x4, "uint8", {}, $dataViewAlt.x09);

    if (value === 0x0) {
      return [true, 0xff];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "iEffectType") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    const previous = getInt(itemInt.offset + 0x4, "uint8", {}, $dataViewAlt.x09); // prettier-ignore

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
    if (file.name.match(/.FNT$/) || file.name.match(/.SPR$/)) {
      return type === "image";
    } else if (file.name.match(/.TXT$/)) {
      return type === "txt";
    } else {
      return type === "asset";
    }
  });
}
