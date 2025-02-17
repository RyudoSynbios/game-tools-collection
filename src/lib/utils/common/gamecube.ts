import { get } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";

import type { ColorType } from "$lib/types";

import { getInt, getString, setInt } from "../bytes";
import Canvas from "../canvas";
import debug from "../debug";
import { getColor, getPalette } from "../graphics";

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

export interface Gcm {
  gameCode: string;
  markerCode: string;
  disc: number;
  version: number;
  gameName: string;
  root: Entry[];
}

// Global object

let gcm = {} as Gcm;

// Source from https://wiki.re.virtualworld.fr/index.php?title=GCM_(File_format)
export function readGcm(): void {
  gcm.gameCode = getString(0x0, 0x4, "uint8");
  gcm.markerCode = getString(0x4, 0x2, "uint8");
  gcm.disc = getInt(0x6, "uint8");
  gcm.version = getInt(0x7, "uint8");
  gcm.gameName = getString(0x20, 0x40, "uint8", { zeroTerminated: true });

  const bootSize = 0x2440;
  const apploaderSize = getInt(0x400, "uint32", { bigEndian: true });
  const dolOffset = getInt(0x420, "uint32", { bigEndian: true });
  const fstOffset = getInt(0x424, "uint32", { bigEndian: true });
  const fstSize = getInt(0x428, "uint32", { bigEndian: true });

  gcm.root = [
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
          size: bootSize,
          dataView: new DataView(new ArrayBuffer(0)),
          isDirty: false,
        },
        {
          index: 0,
          type: "file",
          path: "system/apploader.img",
          name: "apploader.img",
          offset: bootSize,
          size: apploaderSize,
          dataView: new DataView(new ArrayBuffer(0)),
          isDirty: false,
        },
        {
          index: 0,
          type: "file",
          path: "system/main.dol",
          name: "main.dol",
          offset: dolOffset,
          size: fstOffset - dolOffset,
          dataView: new DataView(new ArrayBuffer(0)),
          isDirty: false,
        },
        {
          index: 0,
          type: "file",
          path: "system/fst.bin",
          name: "fst.bin",
          offset: fstOffset,
          size: fstSize,
          dataView: new DataView(new ArrayBuffer(0)),
          isDirty: false,
        },
      ],
    },
  ];

  const entryCount = getInt(fstOffset + 0x8, "uint32", { bigEndian: true });

  const nameBlockOffset = fstOffset + entryCount * 0xc;

  let currentDirectoryIndex = 0x0;
  let nextEntryIndex = 0x0;

  for (let i = 0x1; i < entryCount; i += 0x1) {
    const offset = fstOffset + i * 0xc;

    const isDirectory = getInt(offset, "uint8") === 0x1;
    const nameOffset = getInt(offset + 0x1, "uint24", { bigEndian: true });

    const entryName = getString(nameBlockOffset + nameOffset, 0x100, "uint8", {
      zeroTerminated: true,
    });

    let path = entryName;

    if (i === nextEntryIndex) {
      currentDirectoryIndex = 0x0;
    }

    if (isDirectory) {
      const parentIndex = getInt(offset + 0x4, "uint32", { bigEndian: true });

      nextEntryIndex = getInt(offset + 0x8, "uint32", {
        bigEndian: true,
      });

      let directory: Entry[] = gcm.root;

      if (parentIndex !== 0) {
        const entry = gcm.root.find((entry) => entry.index === parentIndex);

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

      currentDirectoryIndex = i;
    } else {
      const fileOffset = getInt(offset + 0x4, "uint32", { bigEndian: true });
      const fileSize = getInt(offset + 0x8, "uint32", { bigEndian: true });

      let directory: Entry[] = gcm.root;

      if (currentDirectoryIndex !== 0) {
        const entry = gcm.root.find(
          (entry) => entry.index === currentDirectoryIndex,
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
}

export function rebuildGcm(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const files = getFiles();

  // Update entries

  const fst = getFile("system/fst.bin") as File;
  $dataViewAlt.fst = fst.dataView;

  const fileOffsets: { previous: number; new: number }[] = [];

  let entryCount = 0;
  let fileCount = 4;
  let fileOffset = files[4].offset;

  files.slice(0, 4).forEach((file) => {
    fileOffsets.push({ previous: file.offset, new: file.offset });
  });

  while (fileCount < files.length) {
    const offset = entryCount * 0xc;

    const isDirectory = getInt(offset, "uint8", {}, fst?.dataView) === 0x1;

    if (!isDirectory) {
      const file = files[fileCount];

      setInt(offset + 0x4, "uint32", fileOffset, { bigEndian: true }, "fst");
      setInt(offset + 0x8, "uint32", file.size, { bigEndian: true }, "fst");

      fileOffsets.push({ previous: file.offset, new: fileOffset });

      file.offset = fileOffset;

      fileOffset = Math.ceil((fileOffset + file.size) / 0x4) * 0x4;

      fileCount += 1;
    }

    entryCount += 1;
  }

  writeFile("system/fst.bin", $dataViewAlt.fst);

  // Rebuild DataView

  const lastFile = files[files.length - 1];

  const size = lastFile.offset + lastFile.size;

  const uint8Array = new Uint8Array(Math.max($dataView.byteLength, size));

  files.forEach((file, index) => {
    let data = new Uint8Array(file.dataView.buffer);

    if (data.byteLength === 0) {
      const offset = fileOffsets[index].previous;

      data = new Uint8Array($dataView.buffer.slice(offset, offset + file.size));
    }

    uint8Array.set(data, fileOffsets[index].new);
  });

  dataView.set(new DataView(uint8Array.buffer));
}

export function resetGcm(): void {
  gcm = {} as Gcm;
}

export function getFile(path: string): File | undefined {
  const $dataView = get(dataView);

  const file = getFiles().find((file) => file.path === path);

  if (file) {
    const uint8Array = new Uint8Array(
      $dataView.buffer.slice(file.offset, file.offset + file.size),
    );

    file.dataView = new DataView(uint8Array.buffer);

    return file;
  } else {
    debug.error(`File ${path} not found.`);
  }
}

export function getEntries(): Entry[] {
  return gcm.root;
}

export function getFiles(directory = gcm.root): File[] {
  return directory.reduce((files: File[], entry) => {
    if (entry.type === "directory") {
      files.push(...getFiles(entry.content));
    } else {
      files.push(entry);
    }

    return files;
  }, []);
}

export function writeFile(path: string, dataView: DataView): void {
  const file = getFile(path);

  if (file) {
    file.size = dataView.byteLength;
    file.dataView = dataView;
    file.isDirty = true;
  } else {
    debug.error(`File ${path} not found.`);
  }
}

export interface GvrTexture {
  width: number;
  height: number;
  data: Uint8Array;
}

// Source from https://code.google.com/archive/p/puyotools/wikis/GVRTexture.wiki
export function getGvrTexture(canvas: Canvas, dataView: DataView): GvrTexture {
  const header = getString(0x0, 0x4, "uint8", {}, dataView);

  if (header !== "GCIX") {
    return {
      width: 0,
      height: 0,
      data: new Uint8Array(),
    };
  }

  // const mimaps = getInt(0x1a, "bit", { bit: 0 }, dataView);
  // const externalClut = getInt(0x1a, "bit", { bit: 1 }, dataView);
  // const embeddedClut = getInt(0x1a, "bit", { bit: 2 }, dataView);
  const pixelFormat = getInt(0x1a, "upper4", {}, dataView);
  const dataFormat = getInt(0x1b, "uint8", {}, dataView);
  const width = getInt(0x1c, "uint16", { bigEndian: true }, dataView);
  const height = getInt(0x1e, "uint16", { bigEndian: true }, dataView);

  canvas.resize(width, height);

  let colorType: ColorType = "RGB5A3";

  switch (dataFormat) {
    case 4:
      colorType = "RGB565";
      break;
    case 5:
      colorType = "RGB5A3";
      break;
    case 14:
      colorType = "RGB565";
      break;
  }

  // If texture uses indexed palette
  if ([8, 9].includes(dataFormat)) {
    switch (pixelFormat) {
      case 1:
        colorType = "RGB565";
        break;
      case 2:
        colorType = "RGB5A3";
        break;
    }
  }

  if (![4, 5, 8, 14].includes(dataFormat)) {
    debug.warn(`Data format '${dataFormat}' not handled yet.`, {
      pixelFormat,
      dataFormat,
      width,
      height,
      dataView,
    });
  } else if (dataFormat === 8) {
    const rows = height / 0x8;
    const columns = width / 0x8;

    const palette = getPalette(colorType, 0x20, 0x10, {
      bigEndian: true,
      dataView,
    });

    let offset = 0x40;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x20; tile += 0x1) {
          const int = getInt(offset, "uint8", {}, dataView);

          const p1 = int >> 0x4;
          const p2 = int & 0xf;

          tileData.push(...palette[p1], ...palette[p2]);

          offset += 0x1;
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 8, 8, column * 0x8, row * 0x8);
      }
    }
  } else if (dataFormat === 14) {
    const rows = height / 0x8;
    const columns = width / 0x2;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        const offset = 0x20 + row * width * 0x4 + column * 0x8;

        const int0 = getInt(offset, "uint16", { bigEndian: true }, dataView);
        const int1 = getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView); // prettier-ignore
        const code = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

        const color0 = getColor(int0, "RGB565");
        const color1 = getColor(int1, "RGB565");
        const color2 = [0, 0, 0, 255];
        const color3 = [0, 0, 0, int0 < int1 ? 0 : 255];

        for (let i = 0; i < 3; i += 1) {
          if (int0 > int1) {
            color2[i] = (2 * color0[i] + color1[i]) / 3;
            color3[i] = (color0[i] + 2 * color1[i]) / 3;
          } else {
            color2[i] = (color0[i] + color1[i]) / 2;
            color3[i] = 0x0;
          }
        }

        const palette = [color0, color1, color2, color3];

        for (let i = 30; i >= 0; i -= 2) {
          tileData.push(...palette[(code >> i) & 0x3]);
        }

        const data = new Uint8Array(tileData);

        const x = (Math.floor(column / 4) * 2 + (column % 2)) * 4;
        const y = (row * 2 + ((column & 2) >> 1)) * 4;

        canvas.addGraphic("texture", data, 4, 4, x, y);
      }
    }
  } else {
    const rows = height / 0x4;
    const columns = width / 0x4;

    for (let row = 0x0; row < rows; row += 0x1) {
      for (let column = 0x0; column < columns; column += 0x1) {
        const tileData = [];

        for (let tile = 0x0; tile < 0x10; tile += 0x1) {
          const offset =
            0x20 + row * columns * 0x20 + column * 0x10 * 0x2 + tile * 0x2;

          const int = getInt(offset, "uint16", { bigEndian: true }, dataView);

          const color = getColor(int, colorType);

          tileData.push(...color);
        }

        const data = new Uint8Array(tileData);

        canvas.addGraphic("texture", data, 4, 4, column * 4, row * 4);
      }
    }
  }

  const data = canvas.exportGraphicData("texture");

  return {
    width,
    height,
    data,
  };
}
