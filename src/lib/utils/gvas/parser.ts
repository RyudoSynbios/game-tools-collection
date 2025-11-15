import {
  dataTypeToLength,
  getBigInt,
  getInt,
  getString,
} from "$lib/utils/bytes";
import debug from "$lib/utils/debug";

import {
  PropertyType,
  type ArrayProperty,
  type Json,
  type MapProperty,
  type StructProperty,
  type Types,
} from ".";

export default class Parser {
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

  public getJson(): Json {
    return this.json;
  }

  public getTypes(): Types {
    return this.types;
  }

  public parse(): void {
    if (!this.dataView || this.dataView.byteLength === 0) {
      debug.error("DataView is empty.");
      return;
    }

    this.json = {};
    this.types = {};

    while (this.getString(false) !== "None") {
      this.parseProperty(this.json, "");
    }
  }

  private getInt(
    dataType: "int8" | "uint8" | "int32" | "uint32" | "float32",
    increment = true,
  ): number {
    const int = getInt(this.offset, dataType, {}, this.dataView);

    if (increment) {
      this.offset += dataTypeToLength(dataType);
    }

    return int;
  }

  private getBigInt(dataType: "uint64"): bigint {
    const int = getBigInt(this.offset, dataType, {}, this.dataView);

    this.offset += dataTypeToLength(dataType);

    return int;
  }

  private getIdentifier(): string {
    let identifier = "";

    for (let i = 0x0; i < 0x10; i += 0x1) {
      identifier += this.getInt("uint8").toHex(2);
    }

    return identifier;
  }

  private getString(increment = true): string {
    const length = this.getInt("uint32", increment);
    const string = getString(this.offset + (!increment ? 0x4 : 0x0), length, "uint8", { endCode: 0x0 }, this.dataView); // prettier-ignore

    if (increment) {
      this.offset += length;
    }

    return string;
  }

  private parseProperty(parent: StructProperty, path: string): void {
    const propertyName = this.getString();
    const propertyType = this.getString();

    path += `${path !== "" ? "." : ""}${propertyName}`;

    if (
      propertyType !== PropertyType.Array &&
      propertyType !== PropertyType.Enum &&
      propertyType !== PropertyType.Map &&
      propertyType !== PropertyType.Struct
    ) {
      this.types[path] = propertyType;
    }

    switch (propertyType) {
      case PropertyType.Array:
        parent[propertyName] = this.parseArray(path);
        break;
      case PropertyType.Bool:
        parent[propertyName] = this.parseBool();
        break;
      case PropertyType.Byte:
        parent[propertyName] = this.parseByte();
        break;
      case PropertyType.Enum:
        parent[propertyName] = this.parseEnum(path);
        break;
      case PropertyType.Int:
        parent[propertyName] = this.parseInt();
        break;
      case PropertyType.Map:
        parent[propertyName] = this.parseMap(path, propertyName);
        break;
      case PropertyType.Name:
        parent[propertyName] = this.parseName();
        break;
      case PropertyType.Struct:
        parent[propertyName] = this.parseStruct(path);
        break;
      default:
        throw new Error(
          `Property type "${propertyType}" on "parseProperty()" is not handled yet (${this.offset.toHex(0, true)}).`,
        );
    }
  }

  private parseArray(path: string): ArrayProperty {
    const array: ArrayProperty = [];

    const blockLength = this.getInt("uint32");

    this.offset += 0x4;

    const propertyType = this.getString();

    this.offset += 0x1;

    const count = this.getInt("uint32");

    let structName = "";
    let structType = "";
    let structIdentifier = "";
    let isEnum = false;

    if (propertyType === PropertyType.Byte) {
      isEnum = blockLength !== count + 0x4;
    } else if (propertyType === PropertyType.Struct) {
      structName = this.getString();

      const structProperty = this.getString();
      // const blockLength = this.getInt("uint32");

      if (structProperty !== PropertyType.Struct) {
        throw new Error(
          `Property "${structName}" should be a "structProperty" on a Struct[].`,
        );
      }

      this.offset += 0x8;

      structType = this.getString();
      structIdentifier += this.getIdentifier();

      this.offset += 0x1;
    }

    this.types[path] = `${PropertyType.Array}:${propertyType}`;

    for (let i = 0x0; i < count; i += 0x1) {
      switch (propertyType) {
        case PropertyType.Bool:
          array.push(this.parseBool(true));
          break;
        case PropertyType.Byte:
          array.push(this.parseByte(isEnum, true));
          break;
        case PropertyType.Int:
          array.push(this.parseInt(true));
          break;
        case PropertyType.Struct:
          array.push(
            this.parseStruct(
              path,
              true,
              structType,
              `${PropertyType.Array}($1)`,
              structIdentifier,
            ),
          );
          break;
        case PropertyType.UInt64:
          array.push(this.parseUInt64(true));
          break;
        default:
          throw new Error(
            `Array Property type "${propertyType}" is not handled yet (${this.offset.toHex(0, true)}).`,
          );
      }
    }

    return array;
  }

  private parseBool(isArray = false): boolean {
    if (!isArray) {
      // const blockLength = this.getInt("uint32");

      this.offset += 0x8;
    }

    const boolean = this.getInt("uint8") === 0x1;

    if (!isArray) {
      this.offset += 0x1;
    }

    return boolean;
  }

  private parseByte(isEnum = false, isArray = false): number | string {
    if (!isArray) {
      const blockLength = this.getInt("uint32");

      if (blockLength > 0x1) {
        isEnum = true;
      }

      this.offset += 0x4;

      const string = this.getString();

      if (!isEnum && string !== "None") {
        throw new Error(`parseByte doesn\'t finish with "None" (${string}).`);
      }

      this.offset += 0x1;
    }

    if (isEnum) {
      return this.getString();
    }

    return this.getInt("uint8");
  }

  private parseEnum(path: string): string {
    // const blockLength = this.getInt("uint32");

    this.offset += 0x8;

    const enumName = this.getString();

    this.offset += 0x1;

    this.types[path] = `${PropertyType.Enum}:${enumName}`;

    return this.getString();
  }

  private parseInt(isArray = false): number {
    if (!isArray) {
      // const blockLength = this.getInt("uint32");

      this.offset += 0x9;
    }

    return this.getInt("int32");
  }

  private parseInt8(isArray = false): number {
    if (!isArray) {
      throw new Error("parseInt8 not as array."); // TODO
    }

    return this.getInt("int8");
  }

  private parseMap(path: string, propertyName: string): MapProperty {
    const map = new Map();

    // const blockLength = this.getInt("uint32");

    this.offset += 0x8;

    const keyType = this.getString();
    const valueType = this.getString();

    this.offset += 0x5;

    const count = this.getInt("uint32");

    this.types[path] = `${PropertyType.Map}:${keyType}-${valueType}`;

    for (let i = 0x0; i < count; i += 0x1) {
      let key = "";

      switch (keyType) {
        case PropertyType.Enum:
          key = this.parseName(true);
          break;
        case PropertyType.Int:
          key = `${this.parseInt(true)}`;
          break;
        default:
          throw new Error(
            `Key type "${keyType}" on MapProperty "parseMap()" is not handled yet (${this.offset.toHex(0, true)}).`,
          );
      }

      switch (valueType) {
        case PropertyType.Int:
          map.set(key, this.parseInt(true));
          break;
        case PropertyType.Int8:
          map.set(key, this.parseInt8(true));
          break;
        case PropertyType.Struct:
          map.set(
            key,
            this.parseStruct(
              path,
              true,
              propertyName,
              `${PropertyType.Map}:${keyType}($1)`,
            ),
          );
          break;
        default:
          throw new Error(
            `Value type "${valueType}" on MapProperty "parseMap()" is not handled yet (${this.offset.toHex(0, true)}).`,
          );
      }
    }

    return map;
  }

  private parseName(isArray = false): string {
    if (!isArray) {
      // const blockLength = this.getInt("uint32");

      this.offset += 0x9;
    }

    return this.getString();
  }

  private parseStruct(
    path = "",
    isArray = false,
    type = "",
    parentType = "",
    identifier = "",
  ): StructProperty {
    const struct: StructProperty = {};

    if (!isArray) {
      // const blockLength = this.getInt("uint32");

      this.offset += 0x8;

      type = this.getString();
      identifier += this.getIdentifier();

      this.offset += 0x1;
    }

    let pathType = `${PropertyType.Struct}:${type}`;

    if (parentType) {
      const symbol = parentType.match(`^${PropertyType.Array}`) ? ":" : "-";
      this.types[path] = parentType.replace("($1)", `${symbol}${pathType}`);
    } else {
      this.types[path] = pathType;
    }

    if (type === "Vector") {
      struct.x = this.getInt("float32");
      struct.y = this.getInt("float32");
      struct.z = this.getInt("float32");
    } else {
      this.types[`${path}$ID`] = identifier;

      while (this.getString(false) !== "None") {
        this.parseProperty(struct, path);
      }

      this.offset += 0x9;
    }

    return struct;
  }

  private parseUInt64(isArray = false): bigint {
    if (!isArray) {
      // const blockLength = this.getInt("uint32");

      this.offset += 0x9;
    }

    return this.getBigInt("uint64");
  }
}
