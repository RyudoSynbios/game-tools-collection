import debug from "$lib/utils/debug";
import { isObjIsEmpty } from "$lib/utils/format";

import { getInt, getString } from "../bytes";
import Parser from "./parser";
import Writer from "./writer";

export enum PropertyType {
  Array = "ArrayProperty",
  Bool = "BoolProperty",
  Byte = "ByteProperty",
  Enum = "EnumProperty",
  Float = "FloatProperty",
  Int = "IntProperty",
  Int8 = "Int8Property",
  Map = "MapProperty",
  Name = "NameProperty",
  Str = "StrProperty",
  Struct = "StructProperty",
  UInt64 = "UInt64Property",
}

export type ArrayProperty = (
  | boolean
  | bigint
  | number
  | string
  | StructProperty
)[];
export type MapProperty = Map<string, boolean | number | StructProperty>;
export type StructProperty = {
  [key: string]:
    | boolean
    | number
    | string
    | ArrayProperty
    | MapProperty
    | StructProperty;
};

export type Json = StructProperty;
export type Types = { [key: string]: string };

interface Header {
  saveVersion: number;
  packageVersion: number;
  engineVersion: {
    major: number;
    minor: number;
    patch: number;
    build: number;
    name: string;
  };
  customVersion: number;
  customUUID: unknown[];
  saveType: string;
}

export default class Gvas {
  private dataView: DataView;
  private offset: number;
  private bufferSize: number;
  private _header: Header;
  private _json: Json;
  private _types: Types;

  constructor(dataView: DataView) {
    this.dataView = dataView;
    this.offset = 0x0;
    this.bufferSize = 0x1000000;
    this._header = this.getHeader();
    this._json = {};
    this._types = {};
  }

  get header() {
    return this._header;
  }

  get json() {
    return this._json;
  }

  get types() {
    return this._types;
  }

  private getHeader(): Header {
    if (!isGVASFile(this.dataView)) {
      debug.error("Not a valid GVAS file.");
      return { saveType: "" } as Header;
    }

    const header: Header = {
      saveVersion: getInt(this.offset + 0x4, "uint32", {}, this.dataView),
      packageVersion: getInt(this.offset + 0x8, "uint32", {}, this.dataView),
      engineVersion: {
        major: getInt(this.offset + 0xc, "uint16", {}, this.dataView),
        minor: getInt(this.offset + 0xe, "uint16", {}, this.dataView),
        patch: getInt(this.offset + 0x10, "uint16", {}, this.dataView),
        build: getInt(this.offset + 0x12, "uint32", {}, this.dataView),
        name: this.getString(this.offset + 0x16),
      },
      customVersion: 0x0,
      customUUID: [],
      saveType: "",
    };

    this.offset += header.engineVersion.name.length + 0x1b;

    header.customVersion = getInt(this.offset, "uint32", {}, this.dataView);

    const length = getInt(this.offset + 0x4, "uint32", {}, this.dataView);

    this.offset += 0x8;

    for (let i = 0x0; i < length; i += 0x1) {
      header.customUUID.push({
        uuid: this.getUUID(this.offset),
        version: getInt(this.offset + 0x10, "uint32", {}, this.dataView),
      });

      this.offset += 0x14;
    }

    header.saveType = this.getString(this.offset);

    this.offset += header.saveType.length + 0x5;

    return header;
  }

  // prettier-ignore
  private getString(offset: number): string {
    const length = getInt(offset, "uint32", {}, this.dataView);

    return getString(offset + 0x4, length, "uint8", { endCode: 0x0 }, this.dataView);
  }

  private getUUID(offset: number): string {
    let uuid = "";

    for (let j = 0x0; j < 0x10; j += 0x4) {
      uuid += getInt(offset + j, "uint32", {}, this.dataView).toHex(8);
    }

    return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20, 32)}`;
  }

  public parseToJson(): Json {
    if (!this.header.saveType) {
      return {};
    }

    const parser = new Parser(this.dataView, this.offset);

    parser.parse();

    this._json = parser.json;
    this._types = parser.types;

    return this._json;
  }

  public updateTypes(path: string, type: string): void {
    this._types[path] = type;
  }

  public updateJson(json: Json): void {
    if (isObjIsEmpty(json)) {
      debug.error("JSON is empty.");
      return;
    }

    this._json = json;
  }

  public writeToBuffer(): ArrayBufferLike {
    const header = new Uint8Array(this.dataView.buffer.slice(0x0, this.offset));

    const writer = new Writer(
      this.bufferSize,
      this._json,
      this._types,
      header,
      this.offset,
    );

    writer.write({}, true, true);

    return writer.buffer;
  }

  public destroy(): void {
    this.offset = 0x0;
    this._header = {} as Header;
    this._json = {};
    this._types = {};
  }
}

export function isGVASFile(dataView: DataView): boolean {
  const magic = getString(0x0, 0x4, "uint8", {}, dataView);

  return magic === "GVAS";
}
