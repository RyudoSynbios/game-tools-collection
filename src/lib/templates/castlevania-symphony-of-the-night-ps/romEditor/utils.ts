import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  gameRegion,
  gameTemplate,
} from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import Iso9660, { customGetRegions } from "$lib/utils/common/iso9660";
import { getRegionArray } from "$lib/utils/format";
import { getItem, getResource } from "$lib/utils/parser";
import {
  generateDataViewAltPatch,
  importDataViewAltPatch,
  type PatchData,
} from "$lib/utils/patch";

import type {
  Item,
  ItemContainer,
  ItemInt,
  ItemString,
  Patch,
  Resource,
} from "$lib/types";

import { equipmentList } from "../saveEditor/utils/resource";
import { SHOP_OFFSET, TACTICS_OFFSET } from "./utils/constants";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

let iso: Iso9660;

const dataViews = [
  { name: "dra", fileName: "DRA.BIN" }, // Main
  { name: "lib", fileName: "ST/LIB/LIB.BIN" }, // Library
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
  if (item.id === "shop") {
    return [true, [getRegionArray(SHOP_OFFSET), index * item.length]];
  } else if (item.id === "tactics") {
    return [true, [getRegionArray(TACTICS_OFFSET), index * item.length]];
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/pointerText/)) {
    const itemString = item as ItemString;

    const string = getText(
      itemString.offset,
      itemString.dataViewAltKey!,
      itemString.resource,
    );

    return [true, string];
  } else if ("id" in item && item.id === "libItem") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint16", {}, $dataViewAlt.lib);

    const type = getInt(itemInt.offset - 0x2, "uint8", {}, $dataViewAlt.lib);

    if (type >= 0x1 && type <= 0x4) {
      int += 0x100;
    } else {
      int |= type << 0x8;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "libItem") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);
    let type = int >> 0x8;

    int &= 0xff;

    if (type === 1) {
      const equipment = equipmentList.find((item) => item.index === int);

      if (equipment) {
        type = equipment.type + 0x1;
      }
    }

    setInt(itemInt.offset - 0x2, "uint8", type, {}, "lib");
    setInt(itemInt.offset, "uint16", int, {}, "lib");

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
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  Object.keys($gameTemplate.validator.regions).forEach((region, index) => {
    if (
      ($gameRegion === 2 && index === 2) || // japan_japanrev1
      ($gameRegion === 3 && index === 3) || // japanrev2
      ([0, 1, 4].includes($gameRegion) && [0, 1, 4].includes(index))
    ) {
      regions.push(region);
    }
  });

  return generateDataViewAltPatch(
    "castlevania-symphony-of-the-night-ps",
    "1.0",
    regions,
  );
}

export function getDropItemNames(): Resource {
  let names: Resource = {};

  names = {
    0x0: "-",
    0x1: "Big Heart",
    0x2: "$1",
    0x3: "$25",
    0x4: "$50",
    0x5: "$100",
    0x6: "$250",
    0x7: "$400",
    0x8: "$700",
    0x9: "$1000",
    0xa: "$2000",
    0xb: "$5000",
    0xc: "Heart Max Up",
    0xd: "Turkey",
    0xe: "Knife",
    0xf: "Axe",
    0x10: "Cross",
    0x11: "Holy Water",
    0x12: "Clock",
    0x13: "Book",
    0x14: "Diamond",
    0x15: "Fist",
    0x16: "Gun",
    0x17: "Life Max Up",
    0x18: "Heart",
    ...getWeaponNames(0x80),
    ...getEquipmentNames(0x129),
  };

  return names;
}

export function getEnemyNames(): Resource {
  const names: Resource = {};

  const equName = getItem("pointerText-0-eneName") as ItemString;

  for (let i = 0x0; i < 0x190; i += 0x1) {
    names[i] = getText(equName.offset + i * 0x28, "dra");
  }

  return names;
}

export function getEquipmentNames(startIndex = 0x0): Resource {
  const names: Resource = {};

  const eneName = getItem("pointerText-0-equName") as ItemString;

  for (let i = 0x0; i < 0x5a; i += 0x1) {
    names[startIndex + i] = getText(eneName.offset + i * 0x20, "dra");
  }

  return names;
}

export function getLibItemNames(): Resource {
  let names: Resource = {};

  const offset = getRegionArray(TACTICS_OFFSET) - 0x90;

  names = {
    ...getWeaponNames(),
    ...getEquipmentNames(0x100),
    0x500: getText(offset, "lib"),
    0x600: getText(offset + 0x4, "lib"),
    0x601: getText(offset + 0x8, "lib"),
    0x602: getText(offset + 0xc, "lib"),
    0x603: getText(offset + 0x10, "lib"),
    0x604: getText(offset + 0x14, "lib"),
    0x605: getText(offset + 0x18, "lib"),
  };

  return names;
}

export function getTacticNames(): Resource {
  const names: Resource = {};

  const offset = getRegionArray(TACTICS_OFFSET);

  for (let i = 0x0; i < 0x1d; i += 0x1) {
    names[i] = getText(offset - 0x74 + i * 0x4, "lib");
  }

  return names;
}

export function getWeaponNames(startIndex = 0x0): Resource {
  const names: Resource = {};

  const weaName = getItem("pointerText-0-weaName") as ItemString;

  for (let i = 0x0; i < 0xd9; i += 0x1) {
    names[startIndex + i] = getText(weaName.offset + i * 0x34, "dra");
  }

  return names;
}

export function pointerToOffset(
  pointer: number,
  dataViewAltKey?: string,
): number {
  const $dataViewAlt = get(dataViewAlt);

  if (dataViewAltKey === undefined) {
    dataViewAltKey = "dra";
  }

  const dataView = $dataViewAlt[dataViewAltKey];

  let offset = getInt(pointer, "uint24", {}, dataView);

  switch (dataViewAltKey) {
    case "dra":
      offset -= 0xa0000;
      break;
    case "lib":
      offset -= 0x180000;
      break;
  }

  return offset;
}

function getText(
  pointer: number,
  dataViewAltKey: string,
  resource?: string,
): string {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  const dataView = $dataViewAlt[dataViewAltKey];

  const offset = pointerToOffset(pointer, dataViewAltKey);

  const isJapan = [2, 3].includes($gameRegion);

  // prettier-ignore
  if (resource === "letters2") {
    return getString(offset, 0x64, "uint8", {
      letterIsAdaptive: !isJapan,
      encoding: isJapan ? "windows31J" : undefined,
      endCode: 0x0,
      resource: !isJapan ? resource : undefined,
    }, dataView);
  }

  const letters = getResource("letters1") as Resource;

  let text = "";

  for (let i = 0x0; i < 0x64; i += 0x1) {
    let code = getInt(offset + i, "uint8", {}, dataView);

    const code16 = getInt(offset + i, "uint16", { bigEndian: true }, dataView);
    const code24 = getInt(offset + i, "uint24", { bigEndian: true }, dataView);

    if (code16 === 0xff00) {
      break;
    }

    if (code16 > 0xff && letters[code16]) {
      code = code16;
      i += 0x1;
    } else if (letters[code24]) {
      code = code24;
      i += 0x2;
    }

    text += letters[code] || `{${code.toHex()}}`;
  }

  return text;
}
