import Long from "long";

import {
  dataTypeToLength,
  float32ToInt,
  intToArray,
  stringToArray,
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
import { isObjEmpty } from "../format";

export default class Writer {
  private bufferSize: number;
  private json: Json;
  private types: Types;
  private initData: Uint8Array;
  private offset: number;
  private _buffer: Uint8Array;

  constructor(
    bufferSize: number,
    json: Json = {},
    types: Types = {},
    initData: Uint8Array = new Uint8Array(),
    offset = 0x0,
  ) {
    this.bufferSize = bufferSize;
    this.json = json;
    this.types = types;
    this.initData = initData;
    this.offset = offset;
    this._buffer = new Uint8Array(bufferSize);
  }

  get buffer() {
    return this._buffer.buffer;
  }

  public write(json: Json = {}, end = true, resetBuffer = false): void {
    if (isObjEmpty(json)) {
      json = this.json;
    }

    if (isObjEmpty(json)) {
      debug.error("JSON is empty.");
      return;
    }

    if (resetBuffer) {
      this._buffer = new Uint8Array(this.bufferSize);
    }

    if (this.initData.byteLength > 0) {
      this._buffer.set(this.initData);
    }

    Object.entries(json).forEach(([key, value]) => {
      this.writeProperty(key, value);
    });

    if (end) {
      this.setString("None");

      this.end(0x4);
    }
  }

  public shiftOffset(shift: number): void {
    this.offset += shift;
  }

  public end(shift = 0x0): void {
    this._buffer = this._buffer.slice(0x0, this.offset + shift);
  }

  public setInt(
    int: number,
    dataType: "int8" | "uint8" | "int32" | "uint32" | "float32",
    offset?: number,
  ): void {
    if (dataType === "float32") {
      int = float32ToInt(int);
      dataType = "uint32";
    }

    if (dataType === "int8" || dataType === "uint8") {
      this._buffer.set([int], this.offset);
    } else {
      this._buffer.set(intToArray(int, dataType), offset || this.offset);
    }

    if (offset === undefined) {
      this.offset += dataTypeToLength(dataType);
    }
  }

  public setBigInt(int: bigint, dataType: "uint64"): void {
    const array: number[] = [];

    const long = Long.fromBigInt(int);

    for (let i = 0x0; i < 0x8; i += 0x1) {
      array.push(
        long
          .shiftRight(i * 0x8)
          .and(0xff)
          .toInt(),
      );
    }

    this._buffer.set(array, this.offset);

    this.offset += dataTypeToLength(dataType);
  }

  public setIdentifier(key: string, type: string): void {
    if (type === "Vector") {
      this.offset += 0x10;
      return;
    }

    const identifier = this.types[`${key}$ID`];

    if (!identifier) {
      throw new Error("Identifier not found");
    }

    for (let i = 0x0; i < 0x10; i += 0x1) {
      this.setInt(parseInt(identifier.slice(i * 2, i * 2 + 2), 16), "uint8");
    }
  }

  public setString(string: string): void {
    let length = string.length + 0x1;
    let dataType: "uint8" | "uint16" = "uint8";
    let shift = length;

    if (string.match(/è|é|’/)) {
      length *= -1;
      dataType = "uint16";
      shift *= 0x2;
    }

    this.setInt(length, "uint32");

    this._buffer.set(stringToArray(string, 0x0, dataType), this.offset);

    this.offset += shift;
  }

  private writeProperty(key: string, value: any, parentKey = ""): void {
    const typeKey = `${parentKey ? `${parentKey}.` : ""}${key}`;

    if (this.types[typeKey] === undefined) {
      debug.warn(`Unknown "${typeKey}" type.`);
      return;
    }

    this.setString(key);

    const [mainPropertyType, subPropertyType] =
      this.types[typeKey].split(/:(.*)/);

    this.setString(mainPropertyType);

    switch (mainPropertyType) {
      case PropertyType.Array:
        this.writeArray(typeKey, key, subPropertyType, value);
        break;
      case PropertyType.Bool:
        this.writeBool(value);
        break;
      case PropertyType.Byte:
        this.writeByte(value);
        break;
      case PropertyType.Enum:
        this.writeEnum(subPropertyType, value);
        break;
      case PropertyType.Float:
        this.writeFloat(value);
        break;
      case PropertyType.Int:
        this.writeInt(value);
        break;
      case PropertyType.Map:
        this.writeMap(subPropertyType, value);
        break;
      case PropertyType.Name:
        this.writeName(value);
        break;
      case PropertyType.Str:
        this.writeStr(value);
        break;
      case PropertyType.Struct:
        this.writeStruct(typeKey, subPropertyType, value);
        break;
    }
  }

  private writeArray(
    parentKey: string,
    arrayName: string,
    arrayType: string,
    array: ArrayProperty,
  ): void {
    const blockLengthOffset = this.offset;

    let structType = "";

    [arrayType, structType] = arrayType.split(":");

    this.offset += 0x8;
    this.setString(arrayType);
    this.offset += 0x1;

    const blockStartOffset = this.offset;

    let structBlockLengthOffset = 0x0;
    let structBlockStartOffset = 0x0;

    this.setInt(array.length, "uint32");

    if (arrayType === PropertyType.Struct) {
      this.setString(arrayName);
      this.setString(arrayType);
      structBlockLengthOffset = this.offset;
      this.offset += 0x8;
      this.setString(structType);
      this.setIdentifier(parentKey, structType);
      this.offset += 0x1;
      structBlockStartOffset = this.offset;
    }

    array.forEach((value: any) => {
      switch (arrayType) {
        case PropertyType.Bool:
          this.setInt(value ? 0x1 : 0x0, "uint8");
          break;
        case PropertyType.Byte:
          this.writeByte(value, true);
          break;
        case PropertyType.Float:
          this.writeFloat(value, true);
          break;
        case PropertyType.Int:
          this.writeInt(value, true);
          break;
        case PropertyType.Name:
          this.setString(value);
          break;
        case PropertyType.Struct:
          this.writeStruct(parentKey, structType, value, true);
          break;
        case PropertyType.UInt64:
          this.writeUInt64(value, true);
          break;
      }
    });

    this.setInt(this.offset - blockStartOffset, "uint32", blockLengthOffset);

    if (arrayType === PropertyType.Struct) {
      this.setInt(
        this.offset - structBlockStartOffset,
        "uint32",
        structBlockLengthOffset,
      );
    }
  }

  private writeBool(bool: boolean, isArray = false): void {
    if (!isArray) {
      this.offset += 0x8;
    }

    this.setInt(bool ? 0x1 : 0x0, "uint8");
    this.offset += !isArray ? 0x1 : 0x0;
  }

  private writeByte(byte: number | string, isArray = false): void {
    if (!isArray) {
      if (typeof byte === "number") {
        this.setInt(0x1, "uint32");
      } else {
        this.setInt(byte.length + 0x5, "uint32");
      }

      this.offset += 0x4;

      if (typeof byte === "number") {
        this.setString("None");
      } else {
        // We shouldn't have to do that, find another way to resolve this via parser
        this.setString(byte.split("::")[0]);
      }

      this.offset += 0x1;
    }

    if (typeof byte === "number") {
      this.setInt(byte, "uint8");
    } else {
      this.setString(byte);
    }
  }

  private writeEnum(enumType: string, enums: string): void {
    this.setInt(enums.length + 0x5, "uint32");
    this.offset += 0x4;
    this.setString(enumType);
    this.offset += 0x1;
    this.setString(enums);
  }

  private writeFloat(int: number, isArray = false): void {
    if (!isArray) {
      this.setInt(0x4, "int32");
      this.offset += 0x5;
    }

    this.setInt(int, "float32");
  }

  private writeInt(int: number, isArray = false): void {
    if (!isArray) {
      this.setInt(0x4, "int32");
      this.offset += 0x5;
    }

    this.setInt(int, "int32");
  }

  private writeInt8(int: number, isArray = false): void {
    if (!isArray) {
      // TODO:
    }

    this.setInt(int, "int8");
  }

  private writeMap(mapType: string, map: MapProperty): void {
    const blockLengthOffset = this.offset;

    const [keyType, valueType] = mapType.split("-");

    const [valueMainType, valueSubType] = valueType.split(":");

    this.offset += 0x8;

    this.setString(keyType);
    this.setString(valueMainType);

    this.offset += 0x1;
    const blockStartOffset = this.offset;
    this.offset += 0x4;

    this.setInt(map.size, "uint32");

    map.entries().forEach(([key, value]) => {
      switch (keyType) {
        case PropertyType.Byte:
          this.writeByte(key, true);
          break;
        case PropertyType.Enum:
          this.setString(key);
          break;
        case PropertyType.Int:
          this.setInt(parseInt(key), "uint32");
          break;
        case PropertyType.Name:
          this.setString(key);
          break;
      }

      switch (valueMainType) {
        case PropertyType.Bool:
          this.writeBool(value as boolean, true);
          break;
        case PropertyType.Float:
          this.writeFloat(value as number, true);
          break;
        case PropertyType.Int:
          this.writeInt(value as number, true);
          break;
        case PropertyType.Int8:
          this.writeInt8(value as number, true);
          break;
        case PropertyType.Struct:
          this.writeStruct(
            valueSubType,
            mapType,
            value as StructProperty,
            true,
          );
          break;
      }
    });

    this.setInt(this.offset - blockStartOffset, "uint32", blockLengthOffset);
  }

  private writeName(name: string): void {
    this.setInt(name.length + 0x5, "uint32");
    this.offset += 0x5;
    this.setString(name);
  }

  private writeStr(name: string): void {
    this.setInt(name.length + 0x5, "uint32");
    this.offset += 0x5;
    this.setString(name);
  }

  private writeStruct(
    parentKey: string,
    structType: string,
    struct: StructProperty,
    isArray = false,
  ): void {
    const blockLengthOffset = this.offset;

    if (!isArray) {
      this.offset += 0x8;
      this.setString(structType);
      this.setIdentifier(parentKey, structType);
      this.offset += 0x1;
    }

    const blockStartOffset = this.offset;

    Object.entries(struct).forEach(([childKey, value]) => {
      if (structType === "Vector") {
        this.setInt(float32ToInt(value as number), "uint32");
      } else {
        this.writeProperty(childKey, value, parentKey);
      }
    });

    if (structType !== "Vector") {
      this.setString("None");
    }

    if (!isArray) {
      this.setInt(this.offset - blockStartOffset, "uint32", blockLengthOffset);
    }
  }

  private writeUInt64(int: bigint, isArray = false): void {
    if (!isArray) {
      // TODO:
    }

    this.setBigInt(int, "uint64");
  }
}
