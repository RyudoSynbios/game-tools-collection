import debug from "$lib/utils/debug";
import { isObjIsEmpty } from "$lib/utils/format";

import Parser from "./parser";
import Writer from "./writer";

export enum PropertyType {
  Array = "ArrayProperty",
  Bool = "BoolProperty",
  Byte = "ByteProperty",
  Enum = "EnumProperty",
  Int = "IntProperty",
  Int8 = "Int8Property",
  Map = "MapProperty",
  Name = "NameProperty",
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
export type MapProperty = Map<string, number | StructProperty>;
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

export default class Gvas {
  private dataView: DataView;
  private offset: number;
  private json: Json;
  private types: Types;

  constructor(dataView: DataView, offset: number) {
    this.dataView = dataView;
    this.offset = offset;
    this.json = {};
    this.types = {};
  }

  public parseToJson(): Json {
    const parser = new Parser(this.dataView, this.offset);

    parser.parse();

    this.json = parser.getJson();
    this.types = parser.getTypes();

    return this.json;
  }

  public updateTypes(path: string, type: string): void {
    this.types[path] = type;
  }

  public updateJson(json: Json): void {
    if (isObjIsEmpty(json)) {
      debug.error("JSON is empty.");
      return;
    }

    this.json = json;
  }

  public writeToBuffer(): ArrayBufferLike {
    const writer = new Writer(
      this.dataView,
      this.offset,
      this.json,
      this.types,
    );

    writer.write();

    return writer.getBuffer();
  }
}
