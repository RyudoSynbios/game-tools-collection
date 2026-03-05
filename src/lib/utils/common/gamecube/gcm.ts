import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";

import { getInt, getString, intToArray, setInt } from "../../bytes";
import debug from "../../debug";
import { mergeUint8Arrays } from "../../format";

const BOOT_SIZE = 0x2440;

type Entry = Directory | File;

export interface Directory {
  index: number;
  type: "directory";
  path: string;
  name: string;
  content: Entry[];
}

export interface File {
  index: number;
  type: "file";
  path: string;
  name: string;
  offset: number;
  size: number;
  dataView: DataView;
  isDirty: boolean;
}

export interface Header {
  gameCode: string;
  markerCode: string;
  disc: number;
  version: number;
  gameName: string;
  apploaderSize: number;
  dolOffset: number;
  fstOffset: number;
  fstSize: number;
}

// Source from https://wiki.re.virtualworld.fr/index.php?title=GCM_(File_format)
export default class GCM {
  private dataView: DataView;
  private header: Header;
  private _root: Entry[];
  private tmp: {
    datas: number[];
    names: number[];
    entryIndex: number;
    fileOffset: number;
    fileOffsets: { previous: number; new: number }[];
  };

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this.header = this.generateHeader();
    this._root = this.generateRoot();
    this.tmp = {
      datas: [],
      names: [],
      entryIndex: 0,
      fileOffset: 0x0,
      fileOffsets: [],
    };
  }

  get root() {
    return this._root;
  }

  // prettier-ignore
  private generateHeader(): Header {
    return {
      gameCode: getString(0x0, 0x4, "uint8", {}, this.dataView),
      markerCode: getString(0x4, 0x2, "uint8", {}, this.dataView),
      disc: getInt(0x6, "uint8", {}, this.dataView),
      version: getInt(0x7, "uint8", {}, this.dataView),
      gameName: getString(0x20, 0x40, "uint8", { endCode: 0x0 }, this.dataView),
      apploaderSize: getInt(0x400, "uint32", { bigEndian: true }, this.dataView),
      dolOffset: getInt(0x420, "uint32", { bigEndian: true }, this.dataView),
      fstOffset: getInt(0x424, "uint32", { bigEndian: true }, this.dataView),
      fstSize: getInt(0x428, "uint32", { bigEndian: true }, this.dataView),
    };
  }

  // prettier-ignore
  private generateRoot(): Entry[] {
    const root: Entry[] = [
      {
        index: 0,
        type: "directory",
        path: "system",
        name: "system",
        content: [
          {
            index: 0,
            type: "file",
            path: "system/boot.bin",
            name: "boot.bin",
            offset: 0x0,
            size: BOOT_SIZE,
            dataView: new DataView(new ArrayBuffer(0)),
            isDirty: false,
          },
          {
            index: 0,
            type: "file",
            path: "system/apploader.img",
            name: "apploader.img",
            offset: BOOT_SIZE,
            size: this.header.apploaderSize,
            dataView: new DataView(new ArrayBuffer(0)),
            isDirty: false,
          },
          {
            index: 0,
            type: "file",
            path: "system/main.dol",
            name: "main.dol",
            offset: this.header.dolOffset,
            size: this.header.fstOffset - this.header.dolOffset,
            dataView: new DataView(new ArrayBuffer(0)),
            isDirty: false,
          },
          {
            index: 0,
            type: "file",
            path: "system/fst.bin",
            name: "fst.bin",
            offset: this.header.fstOffset,
            size: this.header.fstSize,
            dataView: new DataView(new ArrayBuffer(0)),
            isDirty: false,
          },
        ],
      },
    ];

    const entryCount = getInt(this.header.fstOffset + 0x8, "uint32", { bigEndian: true }, this.dataView);

    const nameBlockOffset = this.header.fstOffset + entryCount * 0xc;

    const directories: Directory[] = [];
    const directoryIndexes: number[] = [];
    const nextEntryIndexes: number[] = [];

    for (let i = 0x1; i < entryCount; i += 0x1) {
      const offset = this.header.fstOffset + i * 0xc;

      const isDirectory = getInt(offset, "uint8", {}, this.dataView) === 0x1;
      const nameOffset = getInt(offset + 0x1, "uint24", { bigEndian: true }, this.dataView);

      const entryName = getString(nameBlockOffset + nameOffset, 0x100, "uint8", { endCode: 0x0 }, this.dataView);

      let path = entryName;

      while (i === nextEntryIndexes.at(-1)) {
        directoryIndexes.pop();
        nextEntryIndexes.pop();
      }

      if (isDirectory) {
        const parentIndex = getInt(offset + 0x4, "uint32", { bigEndian: true }, this.dataView);
        const nextEntryIndex = getInt(offset + 0x8, "uint32", { bigEndian: true }, this.dataView);

        nextEntryIndexes.push(nextEntryIndex);

        let directory: Entry[] = root;

        if (parentIndex !== 0) {
          const entry = directories.find(
            (entry) => entry.index === parentIndex,
          );

          if (entry?.type === "directory") {
            directory = entry.content;

            path = `${entry.path}/${path}`;
          }
        }

        directory.push({
          index: i,
          type: "directory",
          path,
          name: entryName,
          content: [],
        });

        directories.push(directory.at(-1) as Directory);
        directoryIndexes.push(i);
      } else {
        const fileOffset = getInt(offset + 0x4, "uint32", { bigEndian: true }, this.dataView);
        const fileSize = getInt(offset + 0x8, "uint32", { bigEndian: true }, this.dataView);

        let directory: Entry[] = root;

        if (directoryIndexes.length > 0) {
          const entry = directories.find(
            (entry) => entry.index === directoryIndexes.at(-1),
          );

          if (entry?.type === "directory") {
            directory = entry.content;

            path = `${entry.path}/${path}`;
          }
        }

        directory.push({
          index: i,
          type: "file",
          path,
          name: entryName,
          offset: fileOffset,
          size: fileSize,
          dataView: new DataView(new ArrayBuffer(0)),
          isDirty: false,
        });
      }
    }

    return root;
  }

  private buildFst(directory = this._root, parentIndex = 0): void {
    directory.forEach((entry) => {
      const isDirectory = entry.type === "directory";

      this.tmp.datas.push(isDirectory ? 0x1 : 0x0);
      this.tmp.datas.push(...intToArray(this.tmp.names.length, "uint24", true));

      if (entry.index !== 0) {
        for (let i = 0; i < entry.name.length; i += 1) {
          this.tmp.names.push(entry.name.charCodeAt(i));
        }
        this.tmp.names.push(0x0);
      }

      this.tmp.entryIndex += 1;

      if (isDirectory) {
        if (entry.index === 0) {
          this.tmp.datas.push(...intToArray(parentIndex, "uint32", true));
          this.tmp.datas.push(...intToArray(0x0, "uint32", true)); // Entry count updated later

          (entry.content as File[]).forEach((file) => {
            this.tmp.fileOffsets.push({
              previous: file.offset,
              new: this.tmp.fileOffset,
            });

            file.offset = this.tmp.fileOffset;

            this.tmp.fileOffset =
              Math.ceil((this.tmp.fileOffset + file.size) / 0x10) * 0x10;
          });

          return;
        }

        const nextEntryIndex =
          this.tmp.entryIndex + this.getEntryCount(entry.content);

        this.tmp.datas.push(...intToArray(parentIndex, "uint32", true));
        this.tmp.datas.push(...intToArray(nextEntryIndex, "uint32", true));

        this.buildFst(entry.content, this.tmp.entryIndex - 1);
      } else {
        this.tmp.datas.push(...intToArray(this.tmp.fileOffset, "uint32", true));
        this.tmp.datas.push(...intToArray(entry.size, "uint32", true));

        this.tmp.fileOffsets.push({
          previous: entry.offset,
          new: this.tmp.fileOffset,
        });

        entry.offset = this.tmp.fileOffset;

        this.tmp.fileOffset =
          Math.ceil((this.tmp.fileOffset + entry.size) / 0x4) * 0x4;
      }
    });
  }

  private getEntryCount(directory = this._root): number {
    return directory.reduce((count, entry) => {
      if (entry.type === "directory") {
        if (entry.index === 0) {
          return count + 0x1;
        }

        count += 0x1 + this.getEntryCount(entry.content);
      } else {
        count += 0x1;
      }

      return count;
    }, 0);
  }

  private getFstSize(directory = this._root): number {
    return directory.reduce((size, entry) => {
      if (entry.type === "directory") {
        if (entry.index === 0) {
          return size + 0xc;
        }

        size += 0xc + entry.name.length + 1 + this.getFstSize(entry.content);
      } else {
        size += 0xc + entry.name.length + 1;
      }

      return size;
    }, 0);
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFiles(directory = this._root): File[] {
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
    const file = this.getFiles().find((file) => file.path === path);

    if (file) {
      if (file.dataView.byteLength > 0) {
        return file;
      }

      const uint8Array = new Uint8Array(
        this.dataView.buffer.slice(file.offset, file.offset + file.size),
      );

      file.dataView = new DataView(uint8Array.buffer);

      return file;
    } else {
      debug.error(`File "${path}" not found.`);
    }
  }

  public writeFile(path: string, dataView: DataView): void {
    const file = this.getFile(path);

    if (file) {
      file.size = dataView.byteLength;
      file.dataView = dataView;
      file.isDirty = true;
    } else {
      const directories = path.split("/");
      const entryName = directories.pop();

      let currentDirectory = this._root;

      while (directories.length > 0) {
        const directory = currentDirectory.find(
          (item) => item.name === directories.at(-1),
        );

        if (directory) {
          currentDirectory = (directory as Directory).content;
        } else {
          // TODO: Create directory
        }

        directories.pop();
      }

      currentDirectory.push({
        index: this.getEntryCount(),
        type: "file",
        path,
        name: entryName,
        offset: 0x0,
        size: dataView.byteLength,
        dataView: dataView,
        isDirty: true,
      } as File);

      debug.warn(`File "${path}" created.`);
    }
  }

  // prettier-ignore
  public rebuild(): ArrayBufferLike {
    const $dataViewAlt = get(dataViewAlt);

    this.tmp = {
      datas: [],
      names: [],
      fileOffsets: [],
      entryIndex: 0,
      fileOffset: 0x0,
    };

    const files = this.getFiles();

    // Rebuild fst.bin

    // Set new fst file size
    ((this._root[0] as Directory).content[3] as File).size = this.getFstSize();

    this.buildFst();

    const fst = mergeUint8Arrays(
      new Uint8Array(this.tmp.datas),
      new Uint8Array(this.tmp.names),
    );

    $dataViewAlt.boot = this.getFile("system/boot.bin")!.dataView;
    $dataViewAlt.fst = new DataView(fst.buffer);

    setInt(0x8, "uint32", this.tmp.entryIndex, { bigEndian: true }, "fst");

    this.writeFile("system/fst.bin", $dataViewAlt.fst);

    // Update boot.bin

    setInt(0x400, "uint32", files[1].size, { bigEndian: true }, "boot"); // apploader.img size
    setInt(0x420, "uint32", this.tmp.fileOffsets[2].new, { bigEndian: true }, "boot"); // main.dol offset
    setInt(0x424, "uint32", this.tmp.fileOffsets[3].new, { bigEndian: true }, "boot"); // fst.bin offset
    setInt(0x428, "uint32", files[3].size, { bigEndian: true }, "boot"); // fst.bin size
    setInt(0x42c, "uint32", files[3].size, { bigEndian: true }, "boot"); // fst.bin size

    this.writeFile("system/boot.bin", $dataViewAlt.boot);

    // Rebuild DataView

    const lastFile = files.at(-1)!;

    const size = lastFile.offset + lastFile.size;

    const uint8Array = new Uint8Array(Math.max(this.dataView.byteLength, size));

    files.forEach((file, index) => {
      let data = new Uint8Array(file.dataView.buffer);

      if (data.length === 0) {
        const offset = this.tmp.fileOffsets[index].previous;

        data = new Uint8Array(
          this.dataView.buffer.slice(offset, offset + file.size),
        );
      }

      uint8Array.set(data, this.tmp.fileOffsets[index].new);
    });

    return uint8Array.buffer;
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this.header = {} as Header;
    this._root = [];
  }
}

export function isGCMFile(dataView: DataView): boolean {
  const date = getString(BOOT_SIZE, 0xa, "uint8", {}, dataView);

  return Boolean(date.match(/\d{4}\/\d{2}\/\d{2}/));
}
