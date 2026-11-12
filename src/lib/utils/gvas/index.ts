import debug from "$lib/utils/debug";
import { isObjEmpty } from "$lib/utils/format";

import { DataTypeUInt } from "$lib/types";

import { dataTypeToLength, getInt, getString } from "../bytes";
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
  boolean | bigint | number | string | StructProperty
)[];
export type MapProperty = Map<string, boolean | number | StructProperty>;
export type StructProperty = {
  [key: string]:
    boolean | number | string | ArrayProperty | MapProperty | StructProperty;
};

export type Json = StructProperty;
export type Types = { [key: string]: string };

export interface Header {
  saveVersion: number;
  packageVersions: Record<string, number>[];
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
    this.offset = 0x4;
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

    const saveVersion = this.getInt("uint32");

    const packageVersions: Record<string, number>[] = [
      { ue4: this.getInt("uint32") },
    ];

    if (saveVersion === 3) {
      packageVersions.push({ ue5: this.getInt("uint32") });
    }

    const header: Header = {
      saveVersion,
      packageVersions,
      engineVersion: {
        major: this.getInt("uint16"),
        minor: this.getInt("uint16"),
        patch: this.getInt("uint16"),
        build: this.getInt("uint32"),
        name: this.getString(),
      },
      customVersion: 0x0,
      customUUID: [],
      saveType: "",
    };

    header.customVersion = this.getInt("uint32");

    const length = this.getInt("uint32");

    for (let i = 0x0; i < length; i += 0x1) {
      header.customUUID.push({
        uuid: this.getUUID(),
        version: this.getInt("uint32"),
      });
    }

    header.saveType = this.getString();

    if (saveVersion === 3) {
      this.offset += 0x1;
    }

    return header;
  }

  private getInt(dataType: DataTypeUInt): number {
    const int = getInt(this.offset, dataType, {}, this.dataView);

    this.offset += dataTypeToLength(dataType);

    return int;
  }

  // prettier-ignore
  private getString(): string {
    const length = this.getInt("uint32");

    const string = getString(this.offset, length, "uint8", { endCode: 0x0 }, this.dataView);

    this.offset += length;

    return string;
  }

  private getUUID(): string {
    let uuid = "";

    for (let j = 0x0; j < 0x10; j += 0x4) {
      uuid += this.getInt("uint32").toHex(8);
    }

    return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20, 32)}`;
  }

  public parseToJson(): Json {
    if (!this.header.saveType) {
      return {};
    }

    const parser = new Parser(this.header, this.dataView, this.offset);

    parser.parse();

    this._json = parser.json;
    this._types = parser.types;

    return this._json;
  }

  public updateTypes(path: string, type: string): void {
    this._types[path] = type;
  }

  public updateJson(json: Json): void {
    if (isObjEmpty(json)) {
      debug.error("JSON is empty.");
      return;
    }

    this._json = json;
  }

  public writeToBuffer(): ArrayBufferLike {
    const header = new Uint8Array(this.dataView.buffer.slice(0x0, this.offset));

    const writer = new Writer(
      this.header,
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
