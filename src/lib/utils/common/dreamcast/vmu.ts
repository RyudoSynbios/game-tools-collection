import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import { mergeUint8Arrays, numberArrayToString } from "$lib/utils/format";
import { getRegionValidator } from "$lib/utils/validator";

import { generateChecksum, type FileType } from ".";

const BLOCK_SIZE = 0x200;
const VMU_SIZE = 0x100 * BLOCK_SIZE;

interface File {
  type: FileType;
  copyDisabled: number;
  name: string;
  dateCreated: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minutes: number;
    seconds: number;
  };
  unknown: number;
  size: number;
  blocks: number[];
}

interface Management {
  system: {
    block: number;
    size: number;
  };
  fat: {
    block: number;
    size: number;
  };
  fileInformation: {
    block: number;
    size: number;
  };
  data: {
    block: number;
    size: number;
  };
}

interface Save {
  file: File;
  offset: number;
}

export default class VMU {
  private dataView: DataView;
  private management: Management;
  private root: File[];
  private saves: Save[];

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this.management = this.generateManagement();
    this.root = this.generateRoot();
    this.saves = [];
  }

  private generateManagement(): Management {
    const systemBlock = 0xff;

    return {
      system: {
        block: systemBlock,
        size: 0x1,
      },
      fat: {
        block: this.getInt16(systemBlock, 0x46),
        size: this.getInt16(systemBlock, 0x48),
      },
      fileInformation: {
        block: this.getInt16(systemBlock, 0x4a),
        size: this.getInt16(systemBlock, 0x4c),
      },
      data: {
        block: this.getInt16(systemBlock, 0x4e),
        size: this.getInt16(systemBlock, 0x50),
      },
    };
  }

  private generateRoot(): File[] {
    const files: File[] = [];

    const { block, size } = this.management.fileInformation;

    // prettier-ignore
    for (let i = block; i >= block - size + 0x1; i -= 0x1) {
      for (let j = i * BLOCK_SIZE; j < (i + 0x1) * BLOCK_SIZE; j += 0x20) {
        const type = getInt(j, "uint8", {}, this.dataView);

        if (type) {
          const startBlock = getInt(j + 0x2, "uint16", {}, this.dataView);

          const file: File = {
            type,
            copyDisabled: getInt(j + 0x1, "int8", {}, this.dataView),
            name: getString(j + 0x4, 0xc, "uint8", {}, this.dataView),
            dateCreated: {
              year: getInt(j + 0x10, "uint16", { binaryCodedDecimal: true, bigEndian: true }, this.dataView),
              month: getInt(j + 0x12, "uint8", { binaryCodedDecimal: true }, this.dataView),
              day: getInt(j + 0x13, "uint8", { binaryCodedDecimal: true }, this.dataView),
              hour: getInt(j + 0x14, "uint8", { binaryCodedDecimal: true }, this.dataView),
              minutes: getInt(j + 0x15, "uint8", { binaryCodedDecimal: true }, this.dataView),
              seconds: getInt(j + 0x16, "uint8", { binaryCodedDecimal: true }, this.dataView),
            },
            unknown: getInt(j + 0x17, "uint8", {}, this.dataView),
            size: getInt(j + 0x18, "uint8", {}, this.dataView),
            blocks: [startBlock],
          };

          const offset = this.management.fat.block * BLOCK_SIZE;

          let blockIndex = file.blocks[0];

          for (let k = 0x0; k < file.size - 0x1; k += 0x1) {
            blockIndex = getInt(offset + blockIndex * 0x2, 'uint16', {}, this.dataView);

            file.blocks.push(blockIndex);
          }

          files.push(file);
        }
      }
    }

    return files;
  }

  private readFile(file: File): Uint8Array {
    const buffer = new Uint8Array(this.dataView.buffer);
    const uint8Arrays: Uint8Array[] = [];

    file.blocks.forEach((blockIndex) => {
      const offset = blockIndex * BLOCK_SIZE;

      const part = buffer.slice(offset, offset + BLOCK_SIZE);

      uint8Arrays.push(part);
    });

    return mergeUint8Arrays(...uint8Arrays);
  }

  private writeFile(file: File, binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);

    file.blocks.forEach((blockIndex, index) => {
      const offset = index * BLOCK_SIZE;

      const part = binary.slice(offset, offset + BLOCK_SIZE);

      buffer.set(part, blockIndex * BLOCK_SIZE);
    });

    console.log(buffer.buffer);

    this.dataView = new DataView(buffer.buffer);
  }

  private getInt16(block: number, offset: number): number {
    return getInt(block * BLOCK_SIZE + offset, "uint16", {}, this.dataView);
  }

  public isInitialized(): boolean {
    return this.root.length > 0;
  }

  public unpack(): DataView {
    const $gameTemplate = get(gameTemplate);

    const uint8Arrays: Uint8Array[] = [];

    let offset = 0x0;

    Object.values($gameTemplate.validator.regions).forEach((condition) => {
      const validator: number[] = Object.values(condition)[0];

      if (validator) {
        const validatorStringified = numberArrayToString(validator);

        this.root.forEach((file) => {
          if (file.name === validatorStringified) {
            const binary = this.readFile(file);

            uint8Arrays.push(binary);

            this.saves.push({ file, offset });

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

    this.saves.forEach((save) => {
      generateChecksum(save.offset);

      const binary = new Uint8Array(
        $dataView.buffer.slice(
          save.offset,
          save.offset + save.file.size * BLOCK_SIZE,
        ),
      );

      console.log(binary);

      this.writeFile(save.file, binary);
    });

    return this.dataView.buffer;
  }

  public getRegions(): string[] {
    const $gameTemplate = get(gameTemplate);

    const regions: string[] = [];

    Object.entries($gameTemplate.validator.regions).forEach(
      ([region, condition]) => {
        const validator = Object.values(condition)[0] as number[];

        const validatorStringified = numberArrayToString(validator);

        if (
          this.saves.some((save) => save.file.name === validatorStringified)
        ) {
          regions.push(region);
        }
      },
    );

    return regions;
  }

  public getShift(): number[] {
    const validator = getRegionValidator(0x4);
    const validatorStringified = numberArrayToString(validator);

    const save = this.saves.find((save) =>
      save.file.name.includes(validatorStringified),
    );

    if (save) {
      return [save.offset];
    }

    return [0x0];
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this.management = {} as Management;
    this.root = [];
    this.saves = [];
  }
}

export function isVmuFile(dataView: DataView): boolean {
  if (dataView.byteLength === VMU_SIZE) {
    const magic = getInt(0x1fe00, "uint8", {}, dataView);

    return magic === 0x55;
  }

  return false;
}
