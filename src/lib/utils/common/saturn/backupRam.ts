import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import debug from "$lib/utils/debug";

import { addPadding, getInt, getString, removePadding } from "../../bytes";
import { mergeUint8Arrays, numberArrayToString } from "../../format";
import {
  checkValidator,
  getPlatformRegions,
  getRegionValidator,
} from "../../validator";

const HEADER_SIZE = 0x20;

const HEADER_VALIDATOR = [
  0x42, 0x61, 0x63, 0x6b, 0x55, 0x70, 0x52, 0x61, 0x6d, 0x20, 0x46, 0x6f, 0x72,
  0x6d, 0x61, 0x74,
]; // "BackUpRam Format"

export interface File {
  name: string;
  blocks: number[];
  size: number;
}

interface Save {
  file: File;
  offset: number;
}

interface System {
  type: "external" | "internal";
  blockSize: number;
  blocks: number;
  isPadded: boolean;
  paddedValue: number;
}

export default class BackupRam {
  private dataView: DataView;
  private system: System;
  private _root: File[];
  private _saves: Save[];

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this.system = this.generateSystem();
    this._root = [];
    this._saves = [];

    if (this.system.type) {
      this.generateRoot();
    } else {
      debug.error("Not a valid Backup Ram file.");
    }
  }

  get root() {
    return this._root;
  }

  get saves() {
    return this._saves;
  }

  private generateSystem(): System {
    const system = {} as System;

    system.isPadded = getInt(0x0, "uint8", {}, this.dataView) !== 0x42;

    if (!checkBackupRamValidator(HEADER_VALIDATOR, 0x0, this.dataView)) {
      return system;
    }

    let headerCount = 0;
    let blockCount = 0;

    for (let i = 0x0; i < this.dataView.byteLength; i += 0x10) {
      const blockValidator = [...Array(0x10).fill(0x0)];

      if (checkBackupRamValidator(HEADER_VALIDATOR, i, this.dataView)) {
        headerCount += 1;
      } else if (
        (system.isPadded &&
          checkBackupRamValidator(blockValidator, i, this.dataView)) ||
        checkValidator(blockValidator, i, this.dataView)
      ) {
        blockCount += 1;
      } else {
        break;
      }
    }

    if (headerCount === 4 && blockCount === 4) {
      system.type = "internal";
      system.blockSize = 0x40;
    } else if (headerCount === 4 && blockCount === 124) {
      system.type = "external";
      system.blockSize = 0x400;
    } else {
      system.type = "external";
      system.blockSize = 0x200;
    }

    if (!system.type) {
      return system;
    }

    if (system.isPadded) {
      system.paddedValue = getInt(0x0, "uint8", {}, this.dataView);

      this.dataView = removePadding(this.dataView);
    }

    system.blocks = Math.floor(this.dataView.byteLength / system.blockSize);

    return system;
  }

  private generateRoot(): void {
    const root: File[] = [];

    const usedBlocks: number[] = [];

    // prettier-ignore
    for (let i = 0x1; i < this.system.blocks; i += 0x1) {
      let offset = i * this.system.blockSize;

      const isUsed = getInt(offset, "uint8", {}, this.dataView) === 0x80;

      if (isUsed && !usedBlocks.includes(i)) {
        const file: File = {
          name: getString(offset + 0x4, 0xc, "uint8", { endCode: 0x0 }, this.dataView),
          size: HEADER_SIZE + getInt(offset + 0x20, "uint16", { bigEndian: true }, this.dataView),
          blocks: [i],
        };

        offset += 0x22;

        while (true) {
          const blockIndex = getInt(offset, "uint16", { bigEndian: true }, this.dataView);

          if (blockIndex === 0x0) {
            break;
          }

          offset += 0x2;

          if (offset % this.system.blockSize === 0x0) {
            i += 0x1;
            offset += 0x4;
            usedBlocks.push(i);
          }

          file.blocks.push(blockIndex);
          usedBlocks.push(blockIndex);
        }

        this._root.push(file);
        usedBlocks.push(i);
      }
    }
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFile(file: File): Uint8Array {
    const buffer = new Uint8Array(this.dataView.buffer);
    const uint8Arrays: Uint8Array[] = [];

    const offset = file.blocks[0] * this.system.blockSize;

    uint8Arrays.push(buffer.slice(offset, offset + HEADER_SIZE));

    let indexesToRemove = (file.blocks.length + 0x1) * 0x2;

    // prettier-ignore
    file.blocks.forEach((blockIndex, index) => {
      const offset = blockIndex * this.system.blockSize;
      const shift = index === 0 ? HEADER_SIZE : 0x4;

      const part = buffer.slice(
        offset + shift + indexesToRemove,
        offset + this.system.blockSize,
      );

      uint8Arrays.push(part);

      indexesToRemove = Math.max(0, indexesToRemove - (this.system.blockSize - shift));
    });

    const padding = 0x10 - ((HEADER_SIZE + file.size) % 0x10);
    const dataSize = HEADER_SIZE + file.size + padding;

    const uint8Array = new Uint8Array(dataSize);

    uint8Array.set(mergeUint8Arrays(...uint8Arrays).slice(0x0, dataSize));

    return uint8Array;
  }

  public writeFile(file: File, binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);
    const header = new Uint8Array(binary.slice(0x0, HEADER_SIZE));

    buffer.set(header, file.blocks[0] * this.system.blockSize);

    let offset = HEADER_SIZE;

    let indexesToSkip = (file.blocks.length + 0x1) * 0x2;

    // prettier-ignore
    file.blocks.forEach((blockIndex, index) => {
      const shift = index === 0 ? HEADER_SIZE : 0x4;

      const part = binary.slice(
        offset,
        Math.max(0, offset + this.system.blockSize - shift - indexesToSkip),
      );

      buffer.set(
        part,
        blockIndex * this.system.blockSize + shift + indexesToSkip,
      );

      offset += part.length;
      indexesToSkip = Math.max(0, indexesToSkip - (this.system.blockSize - shift));
    });

    this.dataView = new DataView(buffer.buffer);
  }

  public unpack(): DataView {
    this._saves = [];

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    const platformRegions = getPlatformRegions();

    Object.values(platformRegions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      if (validator) {
        const validatorStringified = numberArrayToString(validator);

        this._root.forEach((file) => {
          if (file.name.includes(validatorStringified)) {
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

    if (this.system.isPadded) {
      return addPadding(this.dataView, this.system.paddedValue).buffer;
    }

    return this.dataView.buffer;
  }

  public getRegions(): string[] {
    const regions: string[] = [];

    const platformRegions = getPlatformRegions();

    Object.entries(platformRegions).forEach(([region, condition]) => {
      const validator: number[] = Object.values(condition)[0];

      const validatorStringified = numberArrayToString(validator);

      if (
        this._saves.some((save) =>
          save.file.name.includes(validatorStringified),
        )
      ) {
        regions.push(region);
      }
    });

    return regions;
  }

  public getRegionSaves(): Save[] {
    const validator = getRegionValidator(0x0);
    const validatorStringified = numberArrayToString(validator);

    return this._saves
      .filter((save) => save.file.name.includes(validatorStringified))
      .sort((a, b) =>
        a.file.name.localeCompare(b.file.name, "en", { numeric: true }),
      );
  }

  public getSlotShifts(index: number): [boolean, number[] | undefined] {
    const saves = this.getRegionSaves();

    if (saves[index]) {
      return [true, [saves[index].offset]];
    }

    return [true, [-1]];
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this.system = {} as System;
    this._root = [];
    this._saves = [];
  }
}

function checkBackupRamValidator(
  validator: number[],
  offset: number,
  dataView: DataView,
): boolean {
  const isValid = checkValidator(validator, offset, dataView);

  const isPaddedValid = validator.every((int, index) => {
    if (
      getInt(offset * 0x2 + 0x1 + index * 0x2, "uint8", {}, dataView) === int
    ) {
      return true;
    }
  });

  return isValid || isPaddedValid;
}

export function isBackupRam(dataView: DataView): boolean {
  return checkBackupRamValidator(HEADER_VALIDATOR, 0x0, dataView);
}
