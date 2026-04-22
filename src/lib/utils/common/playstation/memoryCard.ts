import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { mergeUint8Arrays, numberArrayToString } from "$lib/utils/format";
import { checkValidator } from "$lib/utils/validator";

import type { File, Save } from ".";
import { DEX_DRIVE_HEADER_SIZE, isDexDriveFile } from "./dexDrive";
import { isVMPFile, VMP_HEADER_SIZE } from "./vmp";

const BLOCK_SIZE = 0x2000;
const FRAME_SIZE = 0x80;

type Format = "mcr" | "vmp" | "gme";

// Source from https://www.psdevwiki.com/ps3/PS1_Savedata
export default class MemoryCard {
  private dataView: DataView;
  private format: Format;
  private headerSize: number;
  private _root: File[];
  private _saves: Save[];

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this.format = getFormat(this.dataView);
    this.headerSize = getFormatHeaderSize(this.format);
    this._root = [];
    this._saves = [];

    if (!isMemoryCardFile(dataView)) {
      debug.error("Not a valid Memory Card file.");
      return;
    }

    this.generateRoot();
  }

  get root() {
    return this._root;
  }

  get saves() {
    return this._saves;
  }

  private generateRoot(): void {
    for (let i = 0x0; i < 0xf; i += 0x1) {
      const offset = this.headerSize + (i + 0x1) * FRAME_SIZE;

      const mode = getInt(offset, "uint8", {}, this.dataView);

      if (mode !== 0x51) {
        continue;
      }

      // prettier-ignore
      const file: File = {
        size: getInt(offset + 0x4, "uint32", {}, this.dataView),
        countryCode: getString(offset + 0xa, 0x2, "uint8", {}, this.dataView),
        productCode: getString(offset + 0xc, 0xa, "uint8", {}, this.dataView),
        identifier: getString(offset + 0x16, 0x8, "uint8", { endCode: 0x0 }, this.dataView),
        blocks: [i],
      };

      let blockIndex = file.blocks[0];

      while (true) {
        const offset = this.headerSize + (blockIndex + 0x1) * FRAME_SIZE + 0x8;

        blockIndex = getInt(offset, "uint16", {}, this.dataView);

        if (blockIndex === 0xffff) {
          break;
        }

        file.blocks.push(blockIndex);
      }

      this._root.push(file);
    }
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFile(file: File): Uint8Array {
    const buffer = new Uint8Array(this.dataView.buffer);
    const uint8Arrays: Uint8Array[] = [];

    file.blocks.forEach((blockIndex) => {
      const offset = this.headerSize + (blockIndex + 0x1) * BLOCK_SIZE;

      const part = buffer.slice(offset, offset + BLOCK_SIZE);

      uint8Arrays.push(part);
    });

    return mergeUint8Arrays(...uint8Arrays);
  }

  public writeFile(file: File, binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);

    file.blocks.forEach((blockIndex, index) => {
      const offsetSrc = index * BLOCK_SIZE;
      const offsetDst = this.headerSize + (blockIndex + 0x1) * BLOCK_SIZE;

      const part = binary.slice(offsetSrc, offsetSrc + BLOCK_SIZE);

      buffer.set(part, offsetDst);
    });

    this.dataView = new DataView(buffer.buffer);
  }

  public unpack(): DataView {
    const $gameTemplate = get(gameTemplate);

    this._saves = [];

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    Object.values($gameTemplate.validator.regions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      if (validator) {
        const validatorStringified = numberArrayToString(validator);

        this._root.forEach((file) => {
          if (file.productCode.includes(validatorStringified)) {
            const binary = this.getFile(file);

            uint8Arrays.push(binary);

            this._saves.push({ file, offset });

            offset += binary.length;
          }
        });
      }
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    return new DataView(uint8Array.buffer);
  }

  public repack(): ArrayBufferLike {
    const $dataView = get(dataView);

    this._saves.forEach((save) => {
      const binary = new Uint8Array(
        $dataView.buffer.slice(save.offset, save.offset + save.file.size),
      );

      this.writeFile(save.file, binary);
    });

    return this.dataView.buffer;
  }

  public getRegions(): string[] {
    const $gameTemplate = get(gameTemplate);

    const regions: string[] = [];

    Object.entries($gameTemplate.validator.regions).forEach(
      ([region, condition]) => {
        const validator: number[] = Object.values(condition)[0];

        const validatorStringified = numberArrayToString(validator);

        if (
          this._saves.some((save) =>
            save.file.productCode.includes(validatorStringified),
          )
        ) {
          regions.push(region);
        }
      },
    );

    return regions;
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this._root = [];
    this._saves = [];
  }
}

function getFormat(dataView: DataView): Format {
  if (isDexDriveFile(dataView)) {
    return "gme";
  } else if (isVMPFile(dataView)) {
    return "vmp";
  }

  return "mcr";
}

function getFormatHeaderSize(format: Format): number {
  switch (format) {
    case "gme":
      return DEX_DRIVE_HEADER_SIZE;
    case "vmp":
      return VMP_HEADER_SIZE;
  }

  return 0x0;
}

export function isMemoryCardFile(dataView: DataView, shift?: number): boolean {
  const validator = [0x4d, 0x43]; // "MC"

  if (shift === undefined) {
    const format = getFormat(dataView);

    shift = getFormatHeaderSize(format);
  }

  if (
    dataView.byteLength >= 0x20000 &&
    checkValidator(validator, shift, dataView)
  ) {
    return true;
  }

  return false;
}
