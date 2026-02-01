import { get } from "svelte/store";

import { dataViewAlt, gameRegion, gameTemplate, locale } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { File, getFile, getFiles, resetGcm } from "$lib/utils/common/gamecube";
import { getRegionArray, mergeUint8Arrays } from "$lib/utils/format";
import Lzss from "$lib/utils/lzss";
import { getItem, getResource, updateResources } from "$lib/utils/parser";
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

import ImageViewer from "./components/ImageViewer.svelte";
import ModelViewer from "./components/ModelViewer.svelte";
import ScriptViewer from "./components/ScriptViewer.svelte";
import Texture from "./components/Texture.svelte";
import { RANDOM_ENCOUNTER_RATE_OFFSET } from "./utils/constants";
import { exportDataViewAlt, initDataViewAlt } from "./utils/dataView";
import {
  DESCRIPTION_LENGTH_OFFSET,
  LOCALE_LENGTH,
  NAME_LENGTH,
  NAME_LENGTH_OFFSET,
} from "./utils/locales";
import { NjcmFile } from "./utils/njcm";
import { abilityTypes, mainDolModels } from "./utils/resource";

export function beforeItemsParsing(): void {
  initDataViewAlt();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/-(name|description)-/)) {
    const itemString = item as ItemString;

    if ($gameRegion === 2) {
      itemString.encoding = "windows31J";
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/assetViewer-/)) {
    const [, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    const itemContainer = item as ItemContainer;

    itemContainer.instances = files.length;
  } else if ("id" in item && item.id === "randomEncounterRate") {
    const itemInt = item as ItemInt;

    const offset = getRegionArray(RANDOM_ENCOUNTER_RATE_OFFSET);

    itemInt.offset = offset;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);
  const $locale = get(locale);

  if ("id" in item && item.id?.match(/-(name|description)-/)) {
    const itemString = item as ItemString;

    let [modelName] = item.id.split("-");
    const [, type] = item.id.split("-");
    let [index] = item.id.splitInt();

    if ($gameRegion !== 0 && item.id.match(/description/)) {
      itemString.length = getLocaleStringLength(itemString.offset, itemString.dataViewAltKey!, type); // prettier-ignore
    }

    if ($gameRegion !== 0 || !itemString.dataViewAltKey?.match(/Locales$/)) {
      return itemString;
    }

    if (["magic", "superMoves", "crewSuperMoves"].includes(modelName)) {
      switch (modelName) {
        case "superMoves":
          index += abilityTypes[0].count;
          break;
        case "crewSuperMoves":
          index += abilityTypes[0].count + abilityTypes[1].count;
          break;
      }

      modelName = "abilities";
    }

    const model = mainDolModels[modelName];

    const localeIndex = $gameTemplate.localization!.languages.findIndex(
      (region) => region === $locale,
    );

    index += localeIndex * model.count;

    if (type === "name") {
      itemString.offset = index * LOCALE_LENGTH;
    } else if (type === "description") {
      itemString.offset = index * LOCALE_LENGTH + NAME_LENGTH;
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/crewDisabled-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift, "uint8", {}, $dataViewAlt.crew);

    itemInt.hidden = int === 0xff;
  } else if ("id" in item && item.id?.match(/enemydropItemRelated-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset + shift, "uint16", { bigEndian: true }, $dataViewAlt.enemies); // prettier-ignore

    itemInt.disabled = int === 0xffff;
  } else if ("id" in item && item.id?.match(/enemyGroupIndex-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    if (index >= 0x3 && index <= 0xf) {
      itemInt.resource = "enemyStandards";
    }
  } else if ("id" in item && item.id?.match(/enemyEventGroupNamePosition-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift, "uint8", {}, $dataViewAlt.enemyEventGroups); // prettier-ignore

    itemInt.disabled = int === 0xff;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/reversePercent-/)) {
    const itemInt = item as ItemInt;

    const [, dataViewAltKey] = item.id.split("-");

    let int = getInt(itemInt.offset, "uint8", {}, $dataViewAlt[dataViewAltKey]);

    int = (int - 100) * -1;

    return [true, int];
  } else if ("id" in item && item.id?.match(/shop-name-/)) {
    const itemString = item as ItemString;

    const int = getInt(itemString.offset, "uint32", { bigEndian: true }, $dataViewAlt.shops); // prettier-ignore

    const name = getShopName(int, itemString);

    return [true, name];
  } else if ("id" in item && item.id === "crewSpiritCost") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x1, "uint8", {}, $dataViewAlt.crew);

    if (int === 0xff) {
      return [true, 0];
    }
  } else if ("id" in item && item.id?.match(/enemydropItemRelated-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset + shift, "uint16", { bigEndian: true }, $dataViewAlt.enemies); // prettier-ignore

    if (int === 0xffff) {
      return [true, 0];
    }
  } else if ("id" in item && item.id?.match(/enemyGroup-/)) {
    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const enemies = getEnemyGroupDetails(type === "event" ? -1 : index).enemies;

    return [true, enemies.length];
  } else if ("id" in item && item.id?.match(/enemyEventGroupNamePosition-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift, "uint8", {}, $dataViewAlt.enemyEventGroups); // prettier-ignore

    if (int === 0xff) {
      return [true, 0];
    }
  } else if ("id" in item && item.id === "weaponColor") {
    const itemInt = item as ItemInt;

    const redRaw = getInt(itemInt.offset, "float32", { bigEndian: true }, $dataViewAlt.weaponColors); // prettier-ignore
    const greenRaw = getInt(itemInt.offset + 0x4, "float32", { bigEndian: true }, $dataViewAlt.weaponColors); // prettier-ignore
    const blueRaw = getInt(itemInt.offset + 0x8, "float32", { bigEndian: true }, $dataViewAlt.weaponColors); // prettier-ignore

    const red = Math.floor(redRaw * 0xff);
    const green = Math.floor(greenRaw * 0xff);
    const blue = Math.floor(blueRaw * 0xff);

    return [true, (red << 0x10) | (green << 0x8) | blue];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/reversePercent-/)) {
    const itemInt = item as ItemInt;

    const [, dataViewAltKey] = item.id.split("-");

    let int = parseInt(value);

    int = (int - 100) * -1;

    setInt(itemInt.offset, "uint8", int, {}, dataViewAltKey);

    return true;
  } else if ("id" in item && item.id === "enemyEventGroupName") {
    const itemInt = item as ItemInt;

    const previousInt = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.enemyEventGroups); // prettier-ignore
    const int = parseInt(value);

    if (previousInt === 0xff || int === 0xff) {
      let value = 0x1;

      if (int === 0xff) {
        value = 0xff;
      }

      setInt(itemInt.offset + 0x1, "uint8", value, {}, "enemyEventGroups");
      setInt(itemInt.offset + 0x2, "uint8", value, {}, "enemyEventGroups");
    }

    setInt(itemInt.offset, "uint8", value, {}, "enemyEventGroups");

    updateResources("enemyEventGroupNames");
  } else if ("id" in item && item.id === "weaponColor") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const red = ((int >> 0x10) & 0xff) / 0xff;
    const green = ((int >> 0x8) & 0xff) / 0xff;
    const blue = (int & 0xff) / 0xff;

    setInt(itemInt.offset, "float32", red, { bigEndian: true }, "weaponColors"); // prettier-ignore
    setInt(itemInt.offset + 0x4, "float32", green, { bigEndian: true }, "weaponColors"); // prettier-ignore
    setInt(itemInt.offset + 0x8, "float32", blue, { bigEndian: true }, "weaponColors"); // prettier-ignore

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);
  const $locale = get(locale);

  if ("id" in item && item.id?.match(/-name-/)) {
    const [type] = item.id.split("-");

    if ($gameRegion === 0 && $locale !== "english") {
      return;
    }

    const resources: { [key: string]: string } = {
      accessories: "accessoryNames",
      armors: "armorNames",
      crew: "crewNames",
      crewSuperMoves: "crewSuperMoveNames",
      enemyShips: "enemyShipNames",
      keyItems: "keyItemNames",
      items: "itemNames",
      magic: "magicNames",
      party: "characterNames",
      ranks: "rankNames",
      shipAccessories: "shipAccessoryNames",
      shipWeapons: "shipWeaponNames",
      shipItems: "shipItemNames",
      superMoves: "superMoveNames",
      weapons: "weaponNames",
    };

    const resource = resources[type];

    // We force the update of the current resource then update all resources
    updateResources(resource);
    updateResources();
  } else if ("id" in item && item.id === "enemydropItem") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16", { bigEndian: true }, $dataViewAlt.enemies); // prettier-ignore

    let value = 0x0;

    if (int === 0xffff) {
      value = 0xffff;
    }

    setInt(itemInt.offset - 0x4, "uint16", value, { bigEndian: true }, "enemies"); // prettier-ignore
    setInt(itemInt.offset - 0x2, "uint16", value, { bigEndian: true }, "enemies"); // prettier-ignore
  } else if ("id" in item && item.id?.match(/weaponCondition/)) {
    updateResources("weaponConditionNames");
  }
}

export function getComponent(
  component: string,
):
  | typeof ImageViewer
  | typeof ModelViewer
  | typeof ScriptViewer
  | typeof Texture
  | undefined {
  if (component === "ImageViewer") {
    return ImageViewer;
  } else if (component === "ModelViewer") {
    return ModelViewer;
  } else if (component === "ScriptViewer") {
    return ScriptViewer;
  } else if (component === "Texture") {
    return Texture;
  }
}

export function beforeSaving(): ArrayBufferLike {
  return exportDataViewAlt();
}

export function onReset(): void {
  resetGcm();
}

export function importPatch(patch: Patch<PatchData>): void {
  importDataViewAltPatch(patch);
}

export function generatePatch(): Patch<PatchData> {
  return generateDataViewAltPatch("skies-of-arcadia-legends-gc", "1.0");
}

export function getAssetNames(type: string): Resource {
  const names: Resource = {};

  const files = getFilteredFiles(type);

  files.forEach((file, index) => {
    names[index] = file.name;
  });

  return names;
}

export function getCompressedData(dataView: DataView): Uint8Array {
  const data = new Uint8Array(dataView.buffer);

  const s1 = (data.length >> 0x18) & 0xff;
  const s2 = (data.length >> 0x10) & 0xff;
  const s3 = (data.length >> 0x8) & 0xff;
  const s4 = data.length & 0xff;

  // prettier-ignore
  const header = new Uint8Array([0x41, 0x4b, 0x4c, 0x5a, 0x7e, 0x3f, 0x51, 0x64, 0x3d, 0xcc, 0xcc, 0xcd, s1, s2, s3, s4]);

  const compressedData = new Lzss().compress(data);

  return mergeUint8Arrays(header, compressedData);
}

export function getDecompressedData(dataView: DataView): Uint8Array {
  const size = getInt(0xc, "uint32", { bigEndian: true }, dataView);

  const compressedData = new Uint8Array(dataView.buffer.slice(0x10));

  return new Lzss().decompress(compressedData, size);
}

export function getEnemyGroupDetails(index: number): {
  enemies: number[];
  groupCount: number;
} {
  const $dataViewAlt = get(dataViewAlt);

  const isEventGroup = index === -1;

  let dataView = $dataViewAlt.enemyGroups;
  let enemiesOffset = index * 0x150;
  let maxEnemies = 0xa;
  let groupsOffset = enemiesOffset + 0x10;
  let groupEnemyCount = 0x8;
  let groupLength = 0xa;
  let maxGroups = 0x20;

  if (isEventGroup) {
    dataView = $dataViewAlt.enemyEventGroups;
    enemiesOffset = 0x0;
    maxEnemies = 0x92;
    groupsOffset = 0xa0;
    groupEnemyCount = 0x7;
    groupLength = 0x25;
    maxGroups = 0x100;
  }

  const enemiesTmp: number[] = [];
  let groupCount = 0;

  while (groupCount < maxGroups) {
    for (let i = 0x0; i < groupEnemyCount; i += 0x1) {
      const offset = groupsOffset + (isEventGroup ? 0xd + i * 0x3 : 0x2 + i);

      const index = getInt(offset, "uint8", {}, dataView);

      enemiesTmp.push(index);
    }

    groupCount += 1;
    groupsOffset += groupLength;
  }

  const enemies = enemiesTmp.reduce((enemies: number[], enemy) => {
    if (
      !enemies.includes(enemy) &&
      enemy !== 0xff &&
      enemies.length <= maxEnemies
    ) {
      enemies.push(enemy);
    }

    return enemies;
  }, []);

  return { enemies, groupCount };
}

export function getFileData(type: string, index: number): DataView {
  const files = getFilteredFiles(type);
  const file = getFile(files[index].path);

  if (file) {
    const magic = getString(0x0, 0x4, "uint8", {}, file.dataView);

    if (magic === "AKLZ") {
      return new DataView(getDecompressedData(file.dataView).buffer);
    } else {
      return file.dataView;
    }
  }

  return new DataView(new ArrayBuffer(0));
}

export function getFilteredFiles(type: string): File[] {
  const files = getFiles();

  return files.filter((file) => {
    if (
      file.path.match(/.gvr$/) ||
      file.path.match(/^field\/hakken(.*?).mld$/) ||
      file.path.match(/^field\/HRSBin.mld$/) ||
      file.path.match(/^field\/KKenGet.mld$/) ||
      file.path.match(/^field\/sbp_(.*?).mld$/) ||
      file.path.match(/^field\/sekai(.*?).mld$/) ||
      file.path.match(/^field\/sonar.mld$/) ||
      file.path.match(/^field\/sora(.*?).mld$/) ||
      file.path.match(/^field\/sprite(.*?).mld$/) ||
      file.path.match(/^field\/st(.*?).mld$/) ||
      file.path.match(/^field\/ts(.*?).mld$/) ||
      file.path.match(/^field\/wanted(.*?).mld$/)
    ) {
      return type === "image";
    } else if (
      file.path !== "field/a099a_ep.enp" &&
      file.path.match(/.enp$/i)
    ) {
      return type === "enemyGroup";
    } else if (file.path.match(/^battle\/(.*?).sml$/i)) {
      return type === "battleStage";
    } else if (file.path.match(/^bchara\/(cr|ma|mb|mg)(.*?).mld$/i)) {
      return type === "battleCharacter";
    } else if (file.path.match(/^bchara\/(.*?).mld$/)) {
      return type === "weapon";
    } else if (file.path.match(/^field\/fiel(.*?).mld$/)) {
      return type === "worldMap";
    } else if (
      file.path.match(/^field\/a(.*?).mld$/) &&
      !file.path.match(/^field\/(a017x|a034j|a102|a221a|a300d)(.*?).mld$/)
    ) {
      return type === "mld";
    } else if (file.path.match(/^field\/(.*?).mld$/)) {
      return type === "misc";
    } else if (file.path.match(/^field\/(.*?).sct$/)) {
      return type === "map";
    }
  });
}

function getLocaleStringLength(
  offset: number,
  dataViewAltKey: string,
  type: string,
): number {
  const $dataViewAlt = get(dataViewAlt);

  if (type === "name" && !dataViewAltKey.match(/Descriptions|Locales/)) {
    if (dataViewAltKey.match(/ranks/)) {
      return 0x18;
    } else {
      return 0x10;
    }
  }

  if (type === "name") {
    offset += NAME_LENGTH_OFFSET;
  } else if (type === "description") {
    offset += DESCRIPTION_LENGTH_OFFSET;
  }

  return getInt(offset, "uint8", {}, $dataViewAlt[dataViewAltKey]);
}

export function getMapFiles(index: number): File[] {
  const files = getFilteredFiles("map");
  const file = files[index];

  return getFilteredFiles("mld").filter((map) =>
    map.path.match(new RegExp(`^field/a${file.path.slice(8, -4)}`, "i")),
  );
}

export function getNames(type: string, relative: string): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const item = getItem(`${type}-name-0`) as ItemString;

  let base = 0;

  let abilityCount = 0;

  if (["magic", "superMoves", "crewSuperMoves"].includes(type)) {
    const abilityType = abilityTypes.find(
      (abilityType) => abilityType.id === type,
    );

    if (abilityType) {
      abilityCount = abilityType.count;
    }

    type = "abilities";
  }

  const modelObj = Object.entries(mainDolModels).find(([name, model]) => {
    if (name === type) {
      return true;
    } else if (relative && model.isInventory) {
      base += model.count;
    }
  });

  if (modelObj) {
    const count = abilityCount || modelObj[1].count;

    let length = modelObj[1].length;

    if (item.dataViewAltKey?.match(/Locales$/)) {
      length = LOCALE_LENGTH;
    }

    // prettier-ignore
    for (let i = 0x0; i < count; i += 0x1) {
      const name = getString(item.offset + i * length, NAME_LENGTH, item.letterDataType, {
        encoding: item.encoding,
        endCode: item.endCode,
      }, $dataViewAlt[item.dataViewAltKey!]);

      names[base + i] = name;
    }
  }

  if (relative) {
    names[0xffff] = "-";
  }

  return names;
}

export function getEnemyEventGroupNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const enemies = getResource("enemies") as Resource;

  // prettier-ignore
  for (let i = 0x0; i < 0x100; i += 0x1) {
    const enemyIndex = getInt(0xad + i * 0x25, "uint8", {}, $dataViewAlt.enemyEventGroups);

    if (enemyIndex !== 0xff) {
      names[i] = enemies[enemyIndex];
    }
  }

  return names;
}

export function getInventoryNames(): Resource {
  let names: Resource = {};

  Object.entries(mainDolModels).forEach(([name, model]) => {
    if (model.isInventory) {
      const resource = getNames(name, "true");

      names = { ...names, ...resource };
    }
  });

  names[0xffff] = "-";

  return names;
}

function getShopName(offset: number, item: ItemString): string {
  const $dataViewAlt = get(dataViewAlt);

  offset = (offset & 0xffffff) - 0x3000;

  const name = getString(
    offset,
    0x10,
    item.letterDataType,
    {
      letterBigEndian: item.letterBigEndian,
      encoding: item.encoding,
      endCode: item.endCode,
    },
    $dataViewAlt["main.dol"],
  );

  return name;
}

export function getShopNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const item = getItem("shop-name-0") as ItemString;

  for (let i = 0x0; i < mainDolModels.shops.count; i += 0x1) {
    const offset = item.offset + i * mainDolModels.shops.length;

    const int = getInt(offset, "uint32", { bigEndian: true }, $dataViewAlt.shops); // prettier-ignore

    names[i] = getShopName(int, item);
  }

  return names;
}

export function getWeaponConditionNames(): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const conditions = getResource("conditions") as Resource;

  const itemString = getItem("weaponCondition-name-0") as ItemString;

  for (let i = 0x0; i < mainDolModels.weaponConditions.count; i += 0x1) {
    const offset =
      itemString.offset + i * mainDolModels.weaponConditions.length;

    const condition = getInt(offset + 0x12, "uint8", {}, $dataViewAlt.weaponConditions); // prettier-ignore
    let hit = getInt(offset + 0x13, "uint8", {}, $dataViewAlt.weaponConditions);

    hit = (hit - 100) * -1;

    names[i] = `${conditions[condition]} (${hit}%)`;
  }

  names[0xff] = "-";

  return names;
}

export interface Model {
  entities: Entity[];
  grndFiles: { [key: number]: GrndFile };
  njcmFiles: { [key: number]: NjcmFile };
  njtlFiles: { [key: number]: NjtlFile };
  nmdmFiles: { [key: number]: NmdmFile };
  textures: { [key: string]: DataView };
}

export interface Entity {
  index: number;
  unknown: number;
  entityId: number;
  name: string;
  linkedGrndFiles: number[];
  linkedNjcmFiles: number[];
  linkedNjtlFiles: number[];
  linkedNmdmFiles: number[];
  transform: {
    positionX: number;
    positionY: number;
    positionZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
  };
}

export interface GrndFile {
  size: number;
}

export function unpackGrnd(offset: number, dataView: DataView): GrndFile {
  const file: GrndFile = {
    size: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
  };

  return file;
}

export interface NjtlFile {
  size: number;
  textures: string[];
}

export function unpackNjtl(offset: number, dataView: DataView): NjtlFile {
  const file: NjtlFile = {
    size: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
    textures: [],
  };

  offset += 0x8;

  const count = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView);

  for (let i = 0x0; i < count; i += 0x1) {
    const pointer = getInt(offset + 0x8 + i * 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const name = getString(offset + pointer, 0x10, "uint8", { endCode: 0x0 }, dataView); // prettier-ignore

    file.textures.push(name);
  }

  return file;
}

export interface NmdmFile {
  size: number;
}

export function unpackNmdm(offset: number, dataView: DataView): NmdmFile {
  const file: NmdmFile = {
    size: getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView),
  };

  return file;
}
