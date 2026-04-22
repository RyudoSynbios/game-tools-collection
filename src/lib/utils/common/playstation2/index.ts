import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import { numberArrayToString } from "$lib/utils/format";
import { getRegionValidator } from "$lib/utils/validator";

import MemoryCard, { isMemoryCardFile } from "./memoryCard";
import PSU, { isPSUFile } from "./psu";
import PSV, { isPSVFile } from "./psv";

export type Entry = Directory | File;

export interface Directory {
  type: "directory";
  path: string;
  name: string;
  headerOffset: number;
  content: Entry[];
}

export interface File {
  type: "file";
  path: string;
  name: string;
  headerOffset: number;
  size: number;
  clusters: number[];
  dataView: DataView;
}

export interface Page {
  mode: number;
  length: number;
  created: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  startCluster: number;
  dirEntry: number;
  modified: {
    seconds: number;
    minutes: number;
    hours: number;
    day: number;
    month: number;
    year: number;
  };
  attr: number;
  name: string;
}

export interface Save {
  file: File;
  offset: number;
}

let memoryCard: MemoryCard;
let psu: PSU;
let psv: PSV;

export let saves: Save[] = [];

export function getEntryType(mode: number): "directory" | "file" | undefined {
  if (mode & 0x20) {
    return "directory";
  } else if (mode & 0x10) {
    return "file";
  }
}

export function getEntry(offset: number, dataView: DataView): Page {
  return {
    mode: getInt(offset, "uint16", {}, dataView),
    length: getInt(offset + 0x4, "uint32", {}, dataView),
    created: {
      seconds: getInt(offset + 0x8 + 0x1, "uint8", {}, dataView),
      minutes: getInt(offset + 0x8 + 0x2, "uint8", {}, dataView),
      hours: getInt(offset + 0x8 + 0x3, "uint8", {}, dataView),
      day: getInt(offset + 0x8 + 0x4, "uint8", {}, dataView),
      month: getInt(offset + 0x8 + 0x5, "uint8", {}, dataView),
      year: getInt(offset + 0x8 + 0x6, "uint16", {}, dataView),
    },
    startCluster: getInt(offset + 0x10, "uint32", {}, dataView),
    dirEntry: getInt(offset + 0x14, "uint32", {}, dataView),
    modified: {
      seconds: getInt(offset + 0x18 + 0x1, "uint8", {}, dataView),
      minutes: getInt(offset + 0x18 + 0x2, "uint8", {}, dataView),
      hours: getInt(offset + 0x18 + 0x3, "uint8", {}, dataView),
      day: getInt(offset + 0x18 + 0x4, "uint8", {}, dataView),
      month: getInt(offset + 0x18 + 0x5, "uint8", {}, dataView),
      year: getInt(offset + 0x18 + 0x6, "uint16", {}, dataView),
    },
    attr: getInt(offset + 0x20, "uint32", {}, dataView),
    name: getString(offset + 0x40, 0x20, "uint8", { endCode: 0x0 }, dataView),
  };
}

export function unpackFile(dataView: DataView): DataView {
  if (isMemoryCardFile(dataView)) {
    memoryCard = new MemoryCard(dataView);

    return memoryCard.unpack();
  } else if (isPSUFile(dataView)) {
    psu = new PSU(dataView);

    return psu.unpack();
  } else if (isPSVFile(dataView)) {
    psv = new PSV(dataView);

    return psv.unpack();
  }

  return dataView;
}

export function repackFile(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (memoryCard?.isInitialized()) {
    return memoryCard.repack();
  } else if (psu?.isInitialized()) {
    return psu.repack();
  } else if (psv?.isInitialized()) {
    return psv.repack();
  }

  return $dataView.buffer;
}

export function customGetRegions(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  let saves: Save[] = [];

  if (memoryCard?.isInitialized()) {
    saves = memoryCard.saves;
  } else if (psu?.isInitialized()) {
    saves = psu.saves;
  } else if (psv?.isInitialized()) {
    saves = psv.saves;
  }

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator: number[] = Object.values(condition)[0];

      const validatorStringified = numberArrayToString(validator);

      if (saves.some((save) => save.file.name.includes(validatorStringified))) {
        regions.push(region);
      }
    },
  );

  return regions;
}

export function getRegionSaves(usePath = false): Save[] {
  const validator = getRegionValidator(0x0);
  const validatorStringified = numberArrayToString(validator);

  let saves: Save[] = [];

  if (memoryCard?.isInitialized()) {
    saves = memoryCard.saves;
  } else if (psu?.isInitialized()) {
    saves = psu.saves;
  } else if (psv?.isInitialized()) {
    saves = psv.saves;
  }

  return saves
    .filter(
      (save) =>
        (usePath && save.file.path.includes(validatorStringified)) ||
        save.file.name.includes(validatorStringified),
    )
    .sort((a, b) =>
      a.file.path.localeCompare(b.file.path, "en", { numeric: true }),
    );
}

export function getFileOffset(index: number, name = ""): number {
  if (name) {
    const saves = getRegionSaves(true);

    const filteredSaves = saves.filter((save) => save.file.name === name);

    if (filteredSaves[index]) {
      return filteredSaves[index].offset;
    }
  } else {
    const saves = getRegionSaves();

    if (saves[index]) {
      return saves[index].offset;
    }
  }

  return 0x0;
}

export function getSlotShifts(index: number): [boolean, number[]] {
  const saves = getRegionSaves();

  if (saves[index]) {
    return [true, [saves[index].offset]];
  }

  return [true, [-1]];
}

export function resetState(): void {
  saves = [];

  if (memoryCard?.isInitialized()) {
    memoryCard.destroy();
  } else if (psu?.isInitialized()) {
    psu.destroy();
  } else if (psv?.isInitialized()) {
    psv.destroy();
  }
}
