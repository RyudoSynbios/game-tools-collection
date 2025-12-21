import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  gameRegion,
  gameTemplate,
} from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import Iso9660, { customGetRegions } from "$lib/utils/common/iso9660";
import {
  generateDataViewAltPatch,
  importDataViewAltPatch,
  type PatchData,
} from "$lib/utils/patch";

import type { Item, ItemContainer, Patch, Resource } from "$lib/types";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

let iso: Iso9660;

const dataViews = [
  { name: "mDat", fileName: "BATLE/M_DAT.BIN" }, // Enemies
  { name: "sys", fileName: "BATLE/SYS.IDX" }, // Enemy Pointers
  { name: "mchar", fileName: "BIN/MCHAR.DAT" }, // Party
  { name: "windt", fileName: "FIELD/WINDT.BIN" }, // Items & Magic
];

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

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  // prettier-ignore
  if (item.id === "enemies") {
    const enemiesOffset = getInt(0x4, "uint32", {}, $dataViewAlt.sys);
    const enemyOffset = getInt(enemiesOffset + index * 0x8, "uint16", {}, $dataViewAlt.sys) << 0xb;
    const enemyStats = getInt(enemyOffset + 0xc, "uint32", {}, $dataViewAlt.mDat);

    return [true, [enemyOffset, enemyStats]];
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/(Name|ShortName|Description)/)) {
    let [index] = item.id.splitInt();

    const isShortName = item.id.match(/ShortName/);

    let pointer = 0x0;

    if (item.id.match(/iName/)) {
      pointer = 0x4;
    } else if (item.id.match(/iDescription/)) {
      pointer = 0x8;
    } else if (item.id.match(/mShortName/)) {
      pointer = 0x10;
    } else if (item.id.match(/mName/)) {
      pointer = 0x14;
    } else if (item.id.match(/mDescription/)) {
      pointer = 0x18;
    }

    let offset = getInt(pointer, "uint32", {}, $dataViewAlt.windt) + 0x1;

    while (index >= 0) {
      const int = getInt(offset, "uint8", {}, $dataViewAlt.windt);

      if (index === 0) {
        if (!isShortName) {
          offset += 0x1;
        }

        const string = getString(offset, 0x64, "uint8", { endCode: 0x0 }, $dataViewAlt.windt); // prettier-ignore

        return [true, string];
      } else if (int === 0x0) {
        index -= 1;
      }

      offset += 0x1;
    }

    return [true, ""];
  }

  return [false, undefined];
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
  return generateDataViewAltPatch("grandia-ps", "1.0");
}

export function getEnemyNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const enemiesOffset = getInt(0x4, "uint32", {}, $dataViewAlt.sys);

  // prettier-ignore
  [...Array(256).keys()].forEach((index) => {
    const enemyOffset = getInt(enemiesOffset + index * 0x8, "uint16", {}, $dataViewAlt.sys) << 0xb;
    const enemyStats = getInt(enemyOffset + 0xc, "uint32", {}, $dataViewAlt.mDat);

    names[index] = getString(enemyOffset + enemyStats + 0x49, 0x64, "uint8", { endCode: 0x0 }, $dataViewAlt.mDat);
  });

  return names;
}

export function getItemNames(startIndex = 0x0): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  let offset = getInt(0x4, "uint32", {}, $dataViewAlt.windt) + 0x2;

  // prettier-ignore
  [...Array(511).keys()].forEach((index) => {
    names[startIndex + index] = getString(offset, 0x64, "uint8", { endCode: 0x0 }, $dataViewAlt.windt);
    offset += names[startIndex + index].length + 0x2;
  });

  if (startIndex > 0x0) {
    names[0x0] = "-";
  }

  return names;
}

export function getMagicNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  let offset = getInt(0x14, "uint32", {}, $dataViewAlt.windt) + 0x2;

  // prettier-ignore
  [...Array(117).keys()].forEach((index) => {
    names[index] = getString(offset, 0x64, "uint8", { endCode: 0x0 }, $dataViewAlt.windt);
    offset += names[index].length + 0x2;
  });

  return names;
}
