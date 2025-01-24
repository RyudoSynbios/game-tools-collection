import { get } from "svelte/store";

import { dataViewAlt, gameRegion } from "$lib/stores";
import { extractBit, getInt, getString } from "$lib/utils/bytes";
import {
  File,
  getEntries,
  getFile,
  getFiles,
  resetGcm,
} from "$lib/utils/common/gamecube";
import { getItem, updateResources } from "$lib/utils/parser";

import { Item, ItemContainer, ItemString, Resource } from "$lib/types";

import ImageViewer from "./components/ImageViewer.svelte";
import ModelViewer from "./components/ModelViewer.svelte";
import ScriptViewer from "./components/ScriptViewer.svelte";
import Texture from "./components/Texture.svelte";
import { exportDataViewAlts, initDataViewAlts } from "./utils/dataView";
import { mainDolDataViews } from "./utils/resource";

export function beforeItemsParsing(): void {
  initDataViewAlts();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);
  if ("id" in item && item.id?.match(/-name-/)) {
    const itemString = item as ItemString;

    if ($gameRegion === 0 && !item.id.match(/party-name-/)) {
      itemString.disabled = true;
    } else if ($gameRegion === 2) {
      itemString.letterDataType = "uint16";
      itemString.letterBigEndian = true;
    }

    return itemString;
  } else if ("id" in item && item.id?.match(/assetViewer-/)) {
    const [, type] = item.id.split("-");

    const files = getFilteredFiles(type);

    const itemContainer = item as ItemContainer;

    itemContainer.instances = files.length;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/-name-/)) {
    const [type] = item.id.split("-");

    const resources: { [key: string]: string } = {
      accessories: "accessoryNames",
      armors: "armorNames",
      crew: "crewNames",
      enemyShips: "enemyShipNames",
      keyItems: "keyItemNames",
      items: "itemNames",
      party: "characterNames",
      shipAccessories: "shipAccessoryNames",
      shipWeapons: "shipWeaponNames",
      shipItems: "shipItemNames",
      magic: "magicNames",
      ranks: "rankNames",
      weapons: "weaponNames",
    };

    const resource = resources[type];

    // We force the update of the current resource then update all resources
    updateResources(resource);
    updateResources();
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
  return exportDataViewAlts();
}

export function onReset(): void {
  resetGcm();
}

export function getAssetNames(type: string): Resource {
  const files = getFilteredFiles(type);

  const names: Resource = {};

  files.forEach((file, index) => {
    names[index] = file.name;
  });

  return names;
}

export function getDecompressedData(dataView: DataView): Uint8Array {
  const decompressedData: number[] = [];

  let offset = 0xc;

  const size = getInt(offset, "uint32", { bigEndian: true }, dataView);

  offset += 0x4;

  const buffer = [...Array(0x1000).keys()].fill(0x0);

  let bufferIndex = 0x0;

  while (decompressedData.length < size) {
    const mask = getInt(offset, "uint8", {}, dataView);

    offset += 0x1;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      if (extractBit(mask, i)) {
        const value = getInt(offset, "uint8", {}, dataView);

        buffer[bufferIndex] = value;
        decompressedData.push(value);

        bufferIndex = (bufferIndex + 0x1) & 0xfff;
      } else {
        const special = getInt(offset, "uint16", { bigEndian: true }, dataView);
        const wordPosition =
          0x1000 +
          ((((special & 0xf0) >> 0x4) << 0x8) | (special >> 0x8)) -
          0xfee;
        const count = 3 + (special & 0xf);

        for (let j = 0; j < count; j += 1) {
          const value = buffer[(wordPosition + j) & 0xfff];

          buffer[bufferIndex] = value;
          decompressedData.push(value);

          bufferIndex = (bufferIndex + 0x1) & 0xfff;
        }

        offset += 0x1;
      }

      offset += 0x1;

      if (decompressedData.length === size) {
        break;
      }
    }
  }

  return new Uint8Array(decompressedData);
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
    } else if (file.path.match(/^bchara\/(cr|ma|mb|mg)(.*?).mld$/i)) {
      return type === "battleCharacter";
    } else if (file.path.match(/^bchara\/(.*?).mld$/)) {
      return type === "weapon";
    } else if (file.path.match(/^field\/fiel(.*?).mld$/)) {
      return type === "worldMap";
    } else if (file.path.match(/^field\/(.*?).mld$/)) {
      return type === "model";
    } else if (file.path.match(/^field\/(.*?).sct$/)) {
      return type === "script";
    }
  });
}

export function getNames(type: string, relative: string): Resource {
  const $dataViewAlt = get(dataViewAlt);

  const names: Resource = {};

  const item = getItem(`${type}-name-0`) as ItemString;

  let base = 0;

  const model = mainDolDataViews.find((model) => {
    if (model.name === type) {
      return true;
    } else if (relative && model.isInventory) {
      base += model.count;
    }
  });

  if (model) {
    for (let i = 0; i < model.count; i += 1) {
      const name = getString(
        item.offset + i * model.length,
        item.length,
        item.letterDataType,
        {
          letterBigEndian: item.letterBigEndian,
          zeroTerminated: item.zeroTerminated,
        },
        $dataViewAlt[type],
      );

      names[base + i] = name;
    }
  }

  if (relative) {
    names[0xffff] = "-";
  }

  return names;
}

export function getInventoryNames(): Resource {
  let names: Resource = {};

  mainDolDataViews.forEach((model) => {
    if (model.isInventory) {
      const resource = getNames(model.name, "true");

      names = { ...names, ...resource };
    }
  });

  names[0xffff] = "-";

  return names;
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

  const count = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  for (let i = 0x0; i < count; i += 0x1) {
    const pointer = getInt(offset + 0x8 + i * 0xc, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const name = getString(offset + pointer, 0x10, "uint8", { zeroTerminated: true }, dataView); // prettier-ignore

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

// TODO: Remove
export function aob(aob: number[]) {
  const $dataViewAlt = get(dataViewAlt);

  const root = getEntries();

  const files: { fileName: string; data: DataView }[] = [];

  root.forEach((entry) => {
    if (entry.type === "directory") {
      entry.content.forEach((subentry) => {
        const file = getFile(`${entry.name}/${subentry.name}`) as File & {
          dataView: DataView;
        };

        if (getInt(file.offset, "uint32", { bigEndian: true }) === 0x414b4c5a) {
          const data = getDecompressedData(file.dataView);

          files.push({
            fileName: `${entry.name}/${subentry.name}`,
            data: new DataView(data.buffer),
          });
        } else {
          files.push({
            fileName: `${entry.name}/${subentry.name}`,
            data: file.dataView,
          });
        }
      });
    } else if (entry.type === "file") {
      const file = getFile(entry.name) as File & {
        dataView: DataView;
      };

      if (getInt(file.offset, "uint32", { bigEndian: true }) === 0x414b4c5a) {
        const data = getDecompressedData(file.dataView);

        files.push({ fileName: entry.name, data: new DataView(data.buffer) });
      } else {
        files.push({ fileName: entry.name, data: file.dataView });
      }
    }
  });

  files.forEach((file) => {
    const dv = new DataView(file.data.buffer);

    for (let i = 0x0; i < dv.byteLength - 0x3; i += 0x2) {
      if (
        getInt(i, "uint32", { bigEndian: true }, dv) === aob[0] &&
        getInt(i + 0x4, "uint32", { bigEndian: true }, dv) === aob[1]
      ) {
        console.log(file.fileName, i.toHex());
        $dataViewAlt[file.fileName] = dv;
      }
    }
  });
}
