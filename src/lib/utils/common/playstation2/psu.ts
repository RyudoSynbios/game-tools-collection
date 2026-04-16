import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { checkValidator } from "$lib/utils/validator";

import {
  getEntry,
  getEntryType,
  type Directory,
  type Entry,
  type File,
  type FileOffset,
  type Page,
  type Save,
} from ".";

interface Options {
  hideWorkingDirectories: boolean;
}

const PAGE_LENGTH = 0x200;
const PAGES_PER_CLUSTER = 0x2;

export default class PSU {
  private dataView: DataView;
  private options: Options;
  private _root: Directory[];
  private _saves: Save[];

  constructor(dataView: DataView, options?: Options) {
    this.dataView = dataView;
    this.options = {
      hideWorkingDirectories: options?.hideWorkingDirectories || false,
    };
    this._root = [];
    this._saves = [];

    if (!isPSUFile(dataView)) {
      debug.error("Not a valid PSU file.");
      return;
    }

    this.readDirectory(0x0, 0x0, "", this._root);
  }

  get root() {
    return this._root;
  }

  get saves() {
    return this._saves;
  }

  private readDirectory(
    pageIndex: number,
    length: number,
    parentPath: string,
    parentDirectory: Entry[],
  ): void {
    for (let i = 0x0; i < PAGES_PER_CLUSTER; i += 0x1) {
      const pageOffset = pageIndex * PAGE_LENGTH;

      const entry = getEntry(pageOffset, this.dataView);

      let path = entry.name;

      if (parentPath) {
        path = `${parentPath}/${path}`;
      }

      if (length === 0) {
        length = entry.length;
      }

      const entryType = getEntryType(entry.mode);
      const isDeleted = (entry.mode & 0x8000) === 0x0;

      if (!entryType) {
        pageIndex += 0x1;
        continue;
      }

      if (
        isDeleted ||
        ([".", ".."].includes(entry.name) &&
          this.options.hideWorkingDirectories)
      ) {
        pageIndex += 0x1;
        length -= 1;

        if (parentDirectory.length === length) {
          break;
        }

        continue;
      }

      if (entryType === "directory") {
        const directory: Directory = {
          type: "directory",
          name: entry.name,
          path,
          headerOffset: pageOffset,
          content: [],
        };

        parentDirectory.push(directory);

        if (pageIndex === 0x0) {
          parentDirectory = directory.content;
          parentPath = path;
        }
      } else if (entryType === "file") {
        const file: File = {
          type: "file",
          name: entry.name,
          path,
          headerOffset: pageOffset,
          size: entry.length,
          clusters: [pageOffset + PAGE_LENGTH],
          dataView: new DataView(new ArrayBuffer(0)),
        };

        pageIndex += Math.ceil(entry.length / PAGE_LENGTH);

        parentDirectory.push(file);
      }

      pageIndex += 0x1;

      if (parentDirectory.length === length) {
        break;
      }
    }

    if (parentDirectory.length !== length) {
      this.readDirectory(pageIndex, length, parentPath, parentDirectory);
    }
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFiles(directory: Entry[] = this._root): File[] {
    return directory.reduce((files: File[], entry) => {
      if (entry.type === "directory") {
        files.push(...this.getFiles(entry.content));
      } else {
        files.push(entry);
      }

      return files;
    }, []);
  }

  public getFile(path: string): File | undefined {
    const buffer = new Uint8Array(this.dataView.buffer);

    const file = this.getFiles().find((file) => file.path === path);

    if (file) {
      if (file.dataView.byteLength > 0) {
        return file;
      }

      const part = buffer.slice(file.clusters[0], file.clusters[0] + file.size);

      file.dataView = new DataView(part.buffer);

      return file;
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public writeFile(path: string, binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);

    const file = this.getFile(path);

    if (file) {
      buffer.set(binary, file.clusters[0]);

      file.dataView = new DataView(binary.buffer);
      this.dataView = new DataView(buffer.buffer);
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public unpack(): DataView {
    this._saves = [];

    this._root[0].content.forEach((entry) => {
      if (entry.type === "file") {
        const file = this.getFile(entry.path)!;

        this._saves.push({ file: entry, offset: file.clusters[0] });
      }
    });

    return this.dataView;
  }

  public repack(): ArrayBufferLike {
    return this.dataView.buffer;
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this._root = [];
    this._saves = [];
  }
}

export function isPSUFile(dataView?: DataView): boolean {
  const validator1 = [0x27, 0x84, 0x0, 0x0];
  const validator2 = [0x2e, 0x0, 0x0, 0x0];

  return (
    checkValidator(validator1, PAGE_LENGTH, dataView) &&
    checkValidator(validator2, PAGE_LENGTH + 0x40, dataView)
  );
}
