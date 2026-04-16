import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { checkValidator } from "$lib/utils/validator";

import {
  getEntryType,
  type Directory,
  type Entry,
  type File,
  type FileOffset,
  type Page,
  type Save,
} from ".";

export default class PSV {
  private dataView: DataView;
  private _root: Directory[];
  private _saves: Save[];

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this._root = [];
    this._saves = [];

    if (!isPSVFile(dataView)) {
      debug.error("Not a valid PSV file.");
      return;
    }

    const count = getInt(0x64, "uint32", {}, this.dataView);

    this.readDirectory(0x68, count, this._root);
  }

  get root() {
    return this._root;
  }

  get saves() {
    return this._saves;
  }

  private readDirectory(
    offset: number,
    length: number,
    parentDirectory: Entry[],
  ): FileOffset[] {
    const fileOffsets: FileOffset[] = [];

    let parentPath = "";

    for (let i = 0x0; i <= length; i += 0x1) {
      const entry = this.getPage(offset);

      const headerOffset = offset;

      offset += 0x38;

      let path = entry.name;

      if (parentPath) {
        path = `${parentPath}/${path}`;
      }

      if (length === 0) {
        length = entry.length;
      }

      const entryType = getEntryType(entry.mode);
      const isDeleted = (entry.mode & 0x8000) === 0x0;

      if (isDeleted) {
        continue;
      }

      if (entryType === "directory") {
        const directory: Directory = {
          type: "directory",
          name: entry.name,
          path,
          headerOffset,
          content: [],
        };

        parentDirectory.push(directory);

        if (i === 0) {
          parentDirectory = directory.content;
          parentPath = path;
        }
      } else if (entryType === "file") {
        const file = {
          type: "file",
          name: entry.name,
          path,
          headerOffset,
          size: entry.length,
          clusters: [getInt(offset, "uint32", {}, this.dataView)],
          dataView: new DataView(new ArrayBuffer(0)),
        } as File;

        parentDirectory.push(file);

        offset += 0x4;
      }
    }

    return fileOffsets;
  }

  // prettier-ignore
  private getPage(offset: number): Page {
    return {
      created: {
        seconds: getInt(offset + 0x1, "uint8", {}, this.dataView),
        minutes: getInt(offset + 0x2, "uint8", {}, this.dataView),
        hours: getInt(offset + 0x3, "uint8", {}, this.dataView),
        day: getInt(offset + 0x4, "uint8", {}, this.dataView),
        month: getInt(offset + 0x5, "uint8", {}, this.dataView),
        year: getInt(offset + 0x6, "uint16", {}, this.dataView),
      },
      startCluster: 0x0,
      dirEntry: 0x0,
      modified: {
        seconds: getInt(offset + 0x8 + 0x1, "uint8", {}, this.dataView),
        minutes: getInt(offset + 0x8 + 0x2, "uint8", {}, this.dataView),
        hours: getInt(offset + 0x8 + 0x3, "uint8", {}, this.dataView),
        day: getInt(offset + 0x8 + 0x4, "uint8", {}, this.dataView),
        month: getInt(offset + 0x8 + 0x5, "uint8", {}, this.dataView),
        year: getInt(offset + 0x8 + 0x6, "uint16", {}, this.dataView),
      },
      length: getInt(offset + 0x10, "uint32", {}, this.dataView),
      mode: getInt(offset + 0x14, "uint16", {}, this.dataView),
      attr: 0x0,
      name: getString(offset + 0x18, 0x20, "uint8", { endCode: 0x0 }, this.dataView),
    };
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

export function isPSVFile(dataView?: DataView): boolean {
  const validator1 = [0x0, 0x56, 0x53, 0x50, 0x0]; // " VSP "
  const validator2 = [0x53, 0x43]; // "SC"

  return (
    checkValidator(validator1, 0x0, dataView) &&
    !checkValidator(validator2, 0x84, dataView)
  );
}
