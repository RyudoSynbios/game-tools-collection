import { getInt, getString } from "$lib/utils/bytes";
import { checkValidator } from "$lib/utils/validator";

import {
  getEntryType,
  saves,
  type Directory,
  type Entry,
  type File,
  type FileOffset,
  type Page,
} from ".";

export function generatePsu(dataView: DataView): {
  root: Directory[];
  fileOffsets: FileOffset[];
} {
  const count = getInt(0x64, "uint32", {}, dataView);

  const root: Directory[] = [];

  const fileOffsets = readDirectory(dataView, 0x68, count, root);

  return { root, fileOffsets };
}

// prettier-ignore
export function getPage(offset: number, dataView: DataView): Page {
  const page = {} as Page;

  page.entryCreated = {
    seconds: getInt(offset + 0x1, "uint8", {}, dataView),
    minutes: getInt(offset + 0x2, "uint8", {}, dataView),
    hours: getInt(offset + 0x3, "uint8", {}, dataView),
    day: getInt(offset + 0x4, "uint8", {}, dataView),
    month: getInt(offset + 0x5, "uint8", {}, dataView),
    year: getInt(offset + 0x6, "uint16", {}, dataView),
  };

  page.entryModified = {
    seconds: getInt(offset + 0x8 + 0x1, "uint8", {}, dataView),
    minutes: getInt(offset + 0x8 + 0x2, "uint8", {}, dataView),
    hours: getInt(offset + 0x8 + 0x3, "uint8", {}, dataView),
    day: getInt(offset + 0x8 + 0x4, "uint8", {}, dataView),
    month: getInt(offset + 0x8 + 0x5, "uint8", {}, dataView),
    year: getInt(offset + 0x8 + 0x6, "uint16", {}, dataView),
  };

  page.entryLength = getInt(offset + 0x10, "uint32", {}, dataView);
  page.entryMode = getInt(offset + 0x14, "uint16", {}, dataView);

  page.entryName = getString(offset + 0x18, 0x20, "uint8", { endCode: 0x0 }, dataView);

  // Unused
  page.entryCluster = 0x0;
  page.entryDirEntry = 0x0;
  page.entryAttr = 0x0;

  return page;
}

export function isPsv(dataView?: DataView): boolean {
  const validator = [0x0, 0x56, 0x53, 0x50, 0x0]; // " VSP "

  return checkValidator(validator, 0x0, dataView);
}

function readDirectory(
  dataView: DataView,
  offset: number,
  length: number,
  parentDirectory: Entry[],
): FileOffset[] {
  const fileOffsets: FileOffset[] = [];

  for (let i = 0x0; i <= length; i += 0x1) {
    const page = getPage(offset, dataView);

    const headerOffset = offset;

    offset += 0x38;

    const entryType = getEntryType(page.entryMode);

    if (entryType === "directory") {
      const directory = {
        type: "directory",
        name: page.entryName,
        headerOffset,
        content: [],
      } as Directory;

      parentDirectory.push(directory);

      if (i === 0) {
        parentDirectory = directory.content;
      }
    } else if (entryType === "file") {
      const file = {
        type: "file",
        name: page.entryName,
        headerOffset,
        size: page.entryLength,
        startCluster: page.entryCluster,
      } as File;

      fileOffsets.push({
        name: page.entryName,
        offset: getInt(offset, "uint32", {}, dataView),
      });

      offset += 0x4;

      parentDirectory.push(file);
    }
  }

  return fileOffsets;
}

export function unpackPsv(dataView: DataView): DataView {
  if (isPsv(dataView)) {
    const { root, fileOffsets } = generatePsu(dataView);

    saves.push({ directory: root[0], offset: 0x0, fileOffsets });
  }

  return dataView;
}
