import { get } from "svelte/store";

import { dataView, gameRegion, gameTemplate } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import { getObjKey, numberArrayToString } from "$lib/utils/format";

import type { Validator } from "$lib/types";

import {
  isMemoryCard,
  isUnpackedMemoryCard,
  repackMemoryCard,
  resetMemoryCard,
  unpackMemoryCard,
} from "./memoryCard";
import { isPsu, unpackPsu } from "./psu";
import { isPsv, unpackPsv } from "./psv";

export type Entry = Directory | File;

export interface Directory {
  type: "directory";
  name: string;
  headerOffset: number;
  content: Entry[];
}

export interface File {
  type: "file";
  name: string;
  headerOffset: number;
  size: number;
  startCluster: number;
}

export interface FileOffset {
  name: string;
  offset: number;
}

export interface Page {
  entryMode: number;
  entryLength: number;
  entryCreated: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  entryCluster: number;
  entryDirEntry: number;
  entryModified: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  entryAttr: number;
  entryName: string;
}

interface Save {
  directory: Directory;
  offset: number;
  fileOffsets: FileOffset[];
}

// Global objects

export let saves: Save[] = [];
let filteredSaves: Save[] = [];

export function resetState(): void {
  saves = [];
  filteredSaves = [];

  resetMemoryCard();
}

export function getEntryType(mode: number): "directory" | "file" | undefined {
  if (mode & 0x20) {
    return "directory";
  } else if (mode & 0x10) {
    return "file";
  }
}

export function getFile(
  directory: Directory,
  name: string,
  isPartial = false,
): File | undefined {
  return directory.content.find(
    (file) => file.name === name || (isPartial && file.name.includes(name)),
  ) as File;
}

// prettier-ignore
export function getPage(offset: number, dataView: DataView): Page {
  const page = {} as Page;

  page.entryMode = getInt(offset, "uint16", {}, dataView);
  page.entryLength = getInt(offset + 0x4, "uint32", {}, dataView);

  page.entryCreated = {
    seconds: getInt(offset + 0x8 + 0x1, "uint8", {}, dataView),
    minutes: getInt(offset + 0x8 + 0x2, "uint8", {}, dataView),
    hours: getInt(offset + 0x8 + 0x3, "uint8", {}, dataView),
    day: getInt(offset + 0x8 + 0x4, "uint8", {}, dataView),
    month: getInt(offset + 0x8 + 0x5, "uint8", {}, dataView),
    year: getInt(offset + 0x8 + 0x6, "uint16", {}, dataView),
  };

  page.entryCluster = getInt(offset + 0x10, "uint32", {}, dataView);
  page.entryDirEntry = getInt(offset + 0x14, "uint32", {}, dataView);

  page.entryModified = {
    seconds: getInt(offset + 0x18 + 0x1, "uint8", {}, dataView),
    minutes: getInt(offset + 0x18 + 0x2, "uint8", {}, dataView),
    hours: getInt(offset + 0x18 + 0x3, "uint8", {}, dataView),
    day: getInt(offset + 0x18 + 0x4, "uint8", {}, dataView),
    month: getInt(offset + 0x18 + 0x5, "uint8", {}, dataView),
    year: getInt(offset + 0x18 + 0x6, "uint16", {}, dataView),
  };

  page.entryAttr = getInt(offset + 0x20, "uint32", {}, dataView);
  page.entryName = getString(offset + 0x40, 0x20, "uint8", { endCode: 0x0 }, dataView);

  return page;
}

export function unpackFile(dataView: DataView): DataView {
  if (isMemoryCard(dataView)) {
    return unpackMemoryCard(dataView);
  } else if (isPsv(dataView)) {
    return unpackPsv(dataView);
  } else if (isPsu(dataView)) {
    return unpackPsu(dataView);
  }

  return dataView;
}

export function repackFile(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMemoryCard()) {
    return repackMemoryCard();
  }

  return $dataView.buffer;
}

export function customGetRegions(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator = Object.values(condition)[0] as number[];

      if (saves.length > 0) {
        const validatorStringified = numberArrayToString(validator);

        if (
          saves.some((save) =>
            save.directory.name.includes(validatorStringified),
          )
        ) {
          regions.push(region);
        }
      }
    },
  );

  return regions;
}

export function generateFilteredSaves(): void {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const region = $gameTemplate.validator.regions[
    getObjKey($gameTemplate.validator.regions, $gameRegion)
  ] as Validator;

  const validator = region[0];

  const validatorStringified = numberArrayToString(validator);

  filteredSaves = saves
    .filter((save) => save.directory.name.includes(validatorStringified))
    .sort((a, b) =>
      a.directory.name.localeCompare(b.directory.name, "en", { numeric: true }),
    );
}

export function getSaves(): Save[] {
  if (filteredSaves.length === 0) {
    generateFilteredSaves();
  }

  return filteredSaves;
}

export function getFileOffset(index: number, name = ""): number {
  const saves = getSaves();

  if (saves[index]) {
    if (!name) {
      name = saves[index].directory.name;
    }

    const file = saves[index].fileOffsets.find((file) => file.name === name);

    if (file) {
      return file.offset;
    }
  }

  return 0x0;
}
