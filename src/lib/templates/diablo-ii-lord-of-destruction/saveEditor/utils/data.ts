import { get } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";
import { bitToOffset, getInt, getString, setInt } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { mergeUint32Arrays } from "$lib/utils/format";

import {
  DATA_START_OFFSET,
  HERO_STATUS_ATTRIBUTES_LENGTHS,
  HERO_STATUS_END,
  ITEM_ATTRIBUTES_BASE_LENGTHS,
  ITEM_ATTRIBUTES_EXTENDED_LENGTHS,
  ITEM_LENGTH,
} from "./constants";

enum ItemAttribute {
  Unknown0 = 0x0,
  IsIdentified = 0x1,
  Unknown2 = 0x2,
  IsSocketed = 0x3,
  Unknown4 = 0x4,
  LastSavePickedUp = 0x5,
  Unknown6 = 0x6,
  IsPlayerEar = 0x7,
  IsStartItem = 0x8,
  Unknown9 = 0x9,
  IsSimple = 0xa,
  IsEthereal = 0xb,
  UnknownC = 0xc,
  IsPersonalized = 0xd,
  UnknownE = 0xe,
  UnknownF = 0xf,
  Unknown10 = 0x10,
  Unknown11 = 0x11,
  Location = 0x12,
  EquippedLocation = 0x13,
  MatrixColumn = 0x14,
  MatrixRow = 0x15,
  StoredLocation = 0x16,
  Code = 0x17,
  AttachedGems = 0x18,
}

export default class Data {
  private offset: number;
  private _heroStatus: Uint32Array;
  private _heroSkills: Uint8Array;
  private _temporary: Uint8Array;
  private _itemCount: number;
  private _inventory: Uint32Array;

  constructor() {
    this.offset = DATA_START_OFFSET;

    this._heroStatus = this.decompressHeroStatus();
    this._heroSkills = this.extractHeroSkills();
    this._temporary = this.copyDataView();
    this._itemCount = this.getItemCount();
    this._inventory = this.decompressInventory();
  }

  get heroStatus() {
    return this._heroStatus;
  }

  get heroSkills() {
    return this._heroSkills;
  }

  get itemCount() {
    return this._itemCount;
  }

  get inventory() {
    return this._inventory;
  }

  get temporary() {
    return this._temporary;
  }

  private decompressHeroStatus(): Uint32Array {
    const heroStatus = new Uint32Array(HERO_STATUS_ATTRIBUTES_LENGTHS.length);

    const magic = getString(this.offset, 0x2, "uint8");

    if (magic !== "gf") {
      debug.error("Error while parsing hero status.");
      return heroStatus;
    }

    this.offset += 0x2;

    let bit = 0;

    for (let i = 0; i < HERO_STATUS_ATTRIBUTES_LENGTHS.length; i += 1) {
      const attributeId = getInt(this.offset + bitToOffset(bit), "uint16", {
        binary: { bitStart: bit % 8, bitLength: 9 },
      });

      bit += 9;

      if (attributeId === HERO_STATUS_END) {
        break;
      }

      const length = HERO_STATUS_ATTRIBUTES_LENGTHS[attributeId];

      let value = this.extractBinary(this.offset, bit, length);

      // Health, Mana and Stamina
      if (length === 21) {
        value >>= 0x8;
      }

      heroStatus[attributeId] = value;

      bit += length;
    }

    this.offset += bitToOffset(bit) + 0x1;

    return heroStatus;
  }

  // prettier-ignore
  public compressHeroStatus(): Uint8Array {
    const $dataViewAlt = get(dataViewAlt);

    $dataViewAlt.compressedData = new DataView(new ArrayBuffer(0x36));

    let offset = 0x0;
    let bit = 0;

    for (let i = 0; i < HERO_STATUS_ATTRIBUTES_LENGTHS.length; i += 1) {
      const length = HERO_STATUS_ATTRIBUTES_LENGTHS[i];

      let value = getInt(i * 0x4, "uint32", {}, $dataViewAlt.heroStatus);

      // Health, Mana and Stamina
      if (length === 21) {
        value <<= 0x8;
      }

      if (value) {
        setInt(offset + bitToOffset(bit), "uint16", i, {
          binary: { bitStart: bit % 8, bitLength: 9 },
        }, "compressedData");

        bit += 9;

        setInt(offset + bitToOffset(bit), "uint32", value, {
          binary: { bitStart: bit % 8, bitLength: length },
        }, "compressedData");

        bit += length;
      }
    }

    setInt(offset + bitToOffset(bit), "uint16", HERO_STATUS_END, {
      binary: { bitStart: bit % 8, bitLength: 9 },
    }, "compressedData");

    const compressedData = new Uint8Array($dataViewAlt.compressedData.buffer);

    const length = offset + Math.ceil((bit + 9) / 8);

    return compressedData.slice(0, length);
  }

  private extractHeroSkills(): Uint8Array {
    const $dataView = get(dataView);

    const magic = getString(this.offset, 0x2, "uint8");

    if (magic !== "if") {
      debug.error("Error while parsing hero skills.");
      return new Uint8Array(0x20);
    }

    const heroSkills = new Uint8Array(
      $dataView.buffer.slice(this.offset, this.offset + 0x20),
    );

    this.offset += 0x20;

    return heroSkills;
  }

  private copyDataView(): Uint8Array {
    const $dataView = get(dataView);

    return new Uint8Array($dataView.buffer.slice(this.offset));
  }

  private extractBinary(
    offset: number,
    bitStart: number,
    bitLength: number,
  ): number {
    const bitLengthLimit = 32 - (bitStart % 8);

    const value = getInt(offset + bitToOffset(bitStart), "uint32", {
      binary: {
        bitStart: bitStart % 8,
        bitLength: Math.min(bitLength, bitLengthLimit),
      },
    });

    // If value is in the 32 bits range of the initial getInt, we return it
    if (bitToOffset(bitStart + bitLength) - bitToOffset(bitStart) < 0x4) {
      return value;
    }

    const int = getInt(offset + bitToOffset(bitStart + 32), "uint32", {
      binary: { bitStart: 0, bitLength: bitLength - bitLengthLimit },
    });

    return (int << bitLengthLimit) | value;
  }

  private getItemCount(): number {
    const magic = getString(this.offset, 0x2, "uint8");

    if (magic !== "JM") {
      debug.error("Error while parsing inventory.");
      return 0;
    }

    const count = getInt(this.offset + 0x2, "uint16");

    this.offset += 0x4;

    return count;
  }

  private decompressInventory(): Uint32Array {
    const inventory: Uint32Array[] = [];

    for (let i = 0; i < this._itemCount; i += 1) {
      const magic = getString(this.offset, 0x2, "uint8");

      if (magic !== "JM") {
        debug.error(`Error while parsing item "${i}" on inventory.`);
        break;
      }

      this.offset += 0x2;

      const item = new Uint32Array(ITEM_LENGTH);

      let bit = 0;
      let attributeIndex = 0;

      for (let j = 0; j < ITEM_ATTRIBUTES_BASE_LENGTHS.length; j += 1) {
        const length = ITEM_ATTRIBUTES_BASE_LENGTHS[j];

        item[attributeIndex++] = this.extractBinary(this.offset, bit, length);

        bit += length;
      }

      // Socketed items are not included in the initial count
      if (item[ItemAttribute.Location] === 0x6) {
        this._itemCount += 0x1;
      }

      if (!item[ItemAttribute.IsSimple]) {
        for (let j = 0; j < ITEM_ATTRIBUTES_EXTENDED_LENGTHS.length; j += 1) {
          const length = ITEM_ATTRIBUTES_EXTENDED_LENGTHS[j];

          item[attributeIndex++] = this.extractBinary(this.offset, bit, length);

          bit += length;
        }
      }

      inventory.push(item);

      this.offset += bitToOffset(bit) + 0x1;

      const nextMagic = getString(this.offset, 0x2, "uint8");

      if (nextMagic !== "JM") {
        debug.error(`Incomplete parsing item "${i}" on inventory.`);
        this.goToNextIdentifier(0x4d4a); // "JM"
      }
    }

    return mergeUint32Arrays(...inventory);
  }

  private goToNextIdentifier(identifier: number): number {
    while (true) {
      if (getInt(this.offset, "uint16") === identifier) {
        return this.offset;
      }

      this.offset += 0x1;
    }
  }
}
