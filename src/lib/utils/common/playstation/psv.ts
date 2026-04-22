import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { checkValidator } from "$lib/utils/validator";

import type { File, Save } from ".";

const HEADER_OFFSET = 0x64;
const DATA_OFFSET = 0x84;

export default class PSV {
  private dataView: DataView;
  private _root: File[];
  private _saves: Save[];

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this._root = [];
    this._saves = [];

    if (!isPSVFile(dataView)) {
      debug.error("Not a valid PSV file.");
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

  // prettier-ignore
  private generateRoot(): void {
    const file: File = {
      size: getInt(0x40, "uint32", {}, this.dataView),
      countryCode: getString(HEADER_OFFSET, 0x2, "uint8", {}, this.dataView),
      productCode: getString(HEADER_OFFSET + 0x2, 0xa, "uint8", {}, this.dataView),
      identifier: getString(HEADER_OFFSET + 0xc, 0x8, "uint8", { endCode: 0x0 }, this.dataView),
      blocks: [],
    };

    this._root.push(file);
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public getFile(): Uint8Array {
    const buffer = new Uint8Array(this.dataView.buffer);

    return buffer.slice(DATA_OFFSET);
  }

  public writeFile(binary: Uint8Array): void {
    const buffer = new Uint8Array(this.dataView.buffer);

    buffer.set(binary, DATA_OFFSET);

    this.dataView = new DataView(buffer.buffer);
  }

  public unpack(): DataView {
    this._saves = [{ file: this._root[0], offset: 0x0 }];

    const uint8Array = new Uint8Array(this.dataView.buffer.slice(DATA_OFFSET));

    return new DataView(uint8Array.buffer);
  }

  public repack(): ArrayBufferLike {
    const $dataView = get(dataView);

    this.writeFile(new Uint8Array($dataView.buffer));

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
    checkValidator(validator2, 0x84, dataView)
  );
}
