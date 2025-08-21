import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { checkValidator } from "$lib/utils/validator";

import {
  getEntryType,
  getPage,
  saves,
  type Directory,
  type Entry,
  type File,
  type FileOffset,
  type Page,
} from ".";

const PAGE_LENGTH = 0x200;
const PAGES_PER_CLUSTER = 0x2;

export function generatePsu(dataView: DataView): Directory[] {
  const pages = [];

  for (let i = 0x0; i < dataView.byteLength / PAGE_LENGTH; i += 0x1) {
    const pageOffset = i * PAGE_LENGTH;

    pages.push(getPage(pageOffset, dataView));
  }

  const root: Directory[] = [];

  readDirectory(pages, 0x0, 0, root);

  return root;
}

export function isPsu(dataView?: DataView): boolean {
  const $gameTemplate = get(gameTemplate);

  let isValid = false;

  Object.values($gameTemplate.validator.regions).forEach((condition) => {
    const validator = Object.values(condition)[0] as number[];

    if (checkValidator(validator, 0x40, dataView)) {
      isValid = true;
    }
  });

  return isValid;
}

function readDirectory(
  pages: Page[],
  pageIndex: number,
  length: number,
  parentDirectory: Entry[],
): void {
  for (let i = 0x0; i < PAGES_PER_CLUSTER; i += 0x1) {
    const page = pages[pageIndex];

    const headerOffset = pageIndex * PAGE_LENGTH;

    if (length === 0) {
      length = page.entryLength;
    }

    const entryType = getEntryType(page.entryMode);

    if (entryType === "directory") {
      const directory = {
        type: "directory",
        name: page.entryName,
        headerOffset,
        content: [],
      } as Directory;

      parentDirectory.push(directory);

      if (pageIndex === 0) {
        parentDirectory = directory.content;
      } else if (pageIndex > 2) {
        readDirectory(pages, pageIndex + 1, length, directory.content);
      }
    } else if (entryType === "file") {
      const file = {
        type: "file",
        name: page.entryName,
        headerOffset,
        size: page.entryLength,
        startCluster: page.entryCluster,
      } as File;

      pageIndex += Math.ceil(page.entryLength / 0x200);

      parentDirectory.push(file);
    }

    pageIndex += 1;

    if (parentDirectory.length === length) {
      break;
    }
  }

  if (pageIndex < pages.length) {
    readDirectory(pages, pageIndex, length, parentDirectory);
  }
}

export function unpackPsu(dataView: DataView): DataView {
  if (isPsu(dataView)) {
    const root = generatePsu(dataView);

    const fileOffsets: FileOffset[] = [];

    root[0].content.forEach((entry) => {
      if (entry.type === "file") {
        fileOffsets.push({
          name: entry.name,
          offset: entry.headerOffset + PAGE_LENGTH,
        });
      }
    });

    saves.push({ directory: root[0], offset: 0x0, fileOffsets });
  }

  return dataView;
}
