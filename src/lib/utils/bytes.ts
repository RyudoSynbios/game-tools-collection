import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  isDebug,
  isDirty,
} from "$lib/stores";
import debug from "$lib/utils/debug";
import {
  getObjKey,
  getPartialValue,
  isPartial,
  makeOperations,
  utilsExists,
} from "$lib/utils/format";

import type {
  Binary,
  DataType,
  DataTypeInt,
  IntOperation,
  StringEncoding,
} from "$lib/types";

import { decodeChar, encodeChar } from "./encoding";
import { getResource } from "./parser";

export function getDataView(dataViewTmp?: DataView): DataView {
  return dataViewTmp && dataViewTmp.byteLength > 0
    ? dataViewTmp
    : get(dataView);
}

export function isDataViewAltExists(key: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  const exists = Boolean(key && $dataViewAlt[key]);

  if (key && !exists) {
    debug.error(`dataViewAlt ${key} is not initialized`);
  }

  return exists;
}

export function byteswap(
  dataView?: DataView,
  start = 0x0,
  end?: number,
  length = 0x4,
): DataView {
  const $dataView = getDataView(dataView);

  if (!end) {
    end = $dataView.byteLength;
  }

  const array = [];

  if (start > 0x0) {
    for (let i = 0x0; i < start; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  for (let i = start; i < end; i += length) {
    array.push(
      ...[...Array(length).keys()].map((index) =>
        getInt(i + length - index - 1, "uint8", {}, $dataView),
      ),
    );
  }

  if (end < $dataView.byteLength) {
    for (let i = end; i < $dataView.byteLength; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function byteswap16(number: number): number {
  return ((number & 0xff) << 0x8) | (number >> 0x8);
}

export function byteswap32(number: number): number {
  return (
    ((number & 0xff) << 0x18) |
    ((number & 0xff00) << 0x8) |
    ((number >> 0x8) & 0xff00) |
    (number >> 0x18)
  );
}

export function addPadding(
  dataView?: DataView,
  value = 0x0,
  type: "even" | "odd" = "even",
  start = 0x0,
  end?: number,
): DataView {
  const $dataView = getDataView(dataView);

  if (!end) {
    end = $dataView.byteLength;
  }

  const array = [];

  if (start > 0x0) {
    for (let i = 0x0; i < start; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  let j = 0x0;

  for (let i = 0x0; i < end; i += 0x1) {
    if (
      (type === "even" && j % 0x2 === 0) ||
      (type === "odd" && j % 0x2 !== 0)
    ) {
      array.push(value);

      j += 0x1;
    }

    array.push(getInt(i, "uint8", {}, $dataView));

    j += 0x1;
  }

  if (end < $dataView.byteLength) {
    for (let i = end; i < $dataView.byteLength; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function removePadding(
  dataView?: DataView,
  type: "even" | "odd" = "even",
  start = 0x0,
  end?: number,
): DataView {
  const $dataView = getDataView(dataView);

  if (!end) {
    end = $dataView.byteLength;
  }

  const array = [];

  if (start > 0x0) {
    for (let i = 0x0; i < start; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  for (let i = start; i < end; i += 0x1) {
    if (
      (type === "even" && i % 0x2 !== 0) ||
      (type === "odd" && i % 0x2 === 0)
    ) {
      array.push(getInt(i, "uint8", {}, dataView));
    }
  }

  if (end < $dataView.byteLength) {
    for (let i = end; i < $dataView.byteLength; i += 0x1) {
      array.push(getInt(i, "uint8", {}, $dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function copyInt(
  offsetSrc: number,
  offsetDst: number,
  length = 0x1,
): void {
  for (let i = 0x0; i < length; i += 0x1) {
    setInt(offsetDst + i, "uint8", getInt(offsetSrc + i, "uint8"));
  }
}

export function dataTypeToLength(
  dataType: Exclude<DataType, "string">,
): number {
  switch (dataType) {
    case "boolean":
    case "bit":
    case "lower4":
    case "upper4":
    case "int8":
    case "uint8":
      return 1;
    case "int16":
    case "uint16":
      return 2;
    case "int24":
    case "uint24":
      return 3;
    case "int32":
    case "uint32":
    case "float32":
      return 4;
    case "int64":
    case "uint64":
      return 8;
  }
}

export function dataTypeToValue(dataType: Exclude<DataType, "string">): number {
  switch (dataType) {
    case "lower4":
    case "upper4":
      return 0xf;
    case "int8":
    case "uint8":
      return 0xff;
    case "int16":
    case "uint16":
      return 0xffff;
    case "int24":
    case "uint24":
      return 0xffffff;
    case "int32":
    case "uint32":
    case "float32":
      return 0xffffffff;
    case "int64":
    case "uint64":
      return 0xfffffffffffff;
    default:
      return 0x0;
  }
}

export function cloneDataView(dataView: DataView): DataView {
  const arrayBuffer = new ArrayBuffer(dataView.byteLength);

  new Uint8Array(arrayBuffer).set(new Uint8Array(dataView.buffer));

  return new DataView(arrayBuffer);
}

export function extractBit(number: number, bit: number): boolean {
  return (number & (0x1 << bit)) !== 0x0;
}

export function extractBinary(
  number: number,
  bitStart: number,
  bitLength: number,
): number {
  const dataLength = Math.ceil((bitStart + bitLength) / 0x8);

  const mask =
    (Math.pow(0x100, dataLength) - 0x1) >>
    (dataLength * 0x8 - (bitStart + bitLength));

  return (number & mask) >> bitStart;
}

interface BooleanOptions {
  on?: number;
  off?: number;
  resource?: string;
}

export function getBoolean(
  offset: number,
  options: BooleanOptions = {},
  dataView?: DataView,
): boolean {
  const $dataView = getDataView(dataView);

  const int = getInt(offset, "uint8", {}, $dataView);

  const resource = getResource(options.resource);
  const resource0 = resource?.[0] as number | undefined;
  const resource1 = resource?.[1] as number | undefined;

  if (options.resource && resource0 !== undefined && resource1 !== undefined) {
    if (resource0 === int) {
      return false;
    } else if (resource1 === int) {
      return true;
    }
  }

  if (options.on !== undefined && options.on === int) {
    return true;
  } else if (options.off !== undefined && options.off === int) {
    return false;
  }

  return Boolean(int);
}

export function setBoolean(
  offset: number,
  value: boolean,
  options: BooleanOptions = {},
  dataViewAltKey = "",
): void {
  const resource = getResource(options.resource);
  const resource0 = resource?.[0] as number | undefined;
  const resource1 = resource?.[1] as number | undefined;

  if (options.resource && resource0 !== undefined && resource1 !== undefined) {
    setInt(
      offset,
      "uint8",
      value === true ? resource1 : resource0,
      {},
      dataViewAltKey,
    );
  } else if (options.on !== undefined && value) {
    setInt(offset, "uint8", options.on, {}, dataViewAltKey);
  } else if (options.off !== undefined && !value) {
    setInt(offset, "uint8", options.off, {}, dataViewAltKey);
  } else {
    setInt(offset, "uint8", value === false ? 0 : 1, {}, dataViewAltKey);
  }
}

interface BitflagOptions {
  reversed?: boolean;
}

export function getBitflags(
  offset: number,
  options: BitflagOptions = {},
  dataView?: DataView,
): boolean[] {
  const $dataView = getDataView(dataView);

  const trueString = options.reversed ? "0" : "1";

  const bitflags = (getInt(offset, "uint8", {}, $dataView) >>> 0x0)
    .toBinary()
    .split("")
    .map((bit) => bit === trueString)
    .reverse();

  return bitflags;
}

export function getBitflag(
  offset: number,
  flag: number,
  options: BitflagOptions = {},
  dataView?: DataView,
): boolean {
  const bitflags = getBitflags(offset, options, dataView);

  return bitflags[flag];
}

export function setBitflag(
  offset: number,
  bit: number,
  value: boolean,
  options: BitflagOptions = {},
  dataViewAltKey = "",
): void {
  let $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  if (isDataViewAltExists(dataViewAltKey)) {
    $dataView = $dataViewAlt[dataViewAltKey];
  }

  const bitflag = getBitflags(
    offset,
    { reversed: options.reversed },
    $dataView,
  );

  bitflag[bit] = Boolean(value);

  const falseString = options.reversed ? "1" : "0";
  const trueString = options.reversed ? "0" : "1";

  const binary = parseInt(
    bitflag
      .map((t: boolean) => (t ? trueString : falseString))
      .reverse()
      .join(""),
    2,
  );

  setInt(offset, "uint8", binary, {}, dataViewAltKey);
}

interface IntOptions {
  bigEndian?: boolean;
  binary?: Binary;
  binaryCodedDecimal?: boolean;
  bit?: number;
  operations?: IntOperation[];
}

export function getInt(
  offset: number,
  dataType: Exclude<DataType, "boolean" | "int64" | "uint64" | "string">,
  options: IntOptions = {},
  dataView?: DataView,
): number {
  const $dataView = getDataView(dataView);

  if (offset < 0x0) {
    debug.error("Tried to read a negative offset");

    return 0x0;
  } else if (
    $dataView.byteLength === 0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    debug.error(
      `Tried to read bytes past the end of a buffer at offset 0x${offset.toHex()} of 0x${$dataView.byteLength.toHex()}`,
    );

    return 0x0;
  }

  let int = 0;

  switch (dataType) {
    case "bit":
      int = $dataView.getBit(offset, options.bit || 0);
      break;
    case "lower4":
      int = $dataView.getLower4(offset);
      break;
    case "upper4":
      int = $dataView.getUpper4(offset);
      break;
    case "int8":
      int = $dataView.getInt8(offset);
      break;
    case "uint8":
      int = $dataView.getUint8(offset);
      break;
    case "int16":
      int = $dataView.getInt16(offset, !options.bigEndian);
      break;
    case "uint16":
      int = $dataView.getUint16(offset, !options.bigEndian);
      break;
    case "int24":
      int = $dataView.getInt24(offset, !options.bigEndian);
      break;
    case "uint24":
      int = $dataView.getUint24(offset, !options.bigEndian);
      break;
    case "int32":
      int = $dataView.getInt32(offset, !options.bigEndian);
      break;
    case "uint32":
      int = $dataView.getUint32(offset, !options.bigEndian);
      break;
    case "float32":
      int = $dataView.getFloat32(offset, !options.bigEndian);
      break;
  }

  if (options.binary) {
    int = extractBinary(int, options.binary.bitStart, options.binary.bitLength);
  }

  if (options.binaryCodedDecimal) {
    const hex = int.toHex(dataTypeToLength(dataType) * 2);

    int = parseInt(hex);
  }

  int = makeOperations(int, options.operations);

  return int;
}

export function setInt(
  offset: number,
  dataType: Exclude<DataType, "boolean" | "int64" | "uint64" | "string">,
  value: number | string,
  options: IntOptions = {},
  dataViewAltKey = "",
): void {
  let $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);
  const $isDebug = get(isDebug);

  if (isDataViewAltExists(dataViewAltKey)) {
    $dataView = $dataViewAlt[dataViewAltKey];
  }

  if (offset < 0x0) {
    debug.error("Tried to write to a negative offset");

    return;
  } else if (
    $dataView.byteLength === 0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    debug.error(
      `Tried to write bytes past the end of a buffer at offset 0x${offset.toHex()} of 0x${$dataView.byteLength.toHex()}`,
    );

    return;
  }

  if (typeof value === "string") {
    value = parseFloat(value) || 0;
  }

  value = makeOperations(value, options.operations, true);

  // prettier-ignore
  if (isPartial(options.operations)) {
    const oldValue = getInt(offset, dataType, {
      bigEndian: options.bigEndian,
      binary: options.binary,
      binaryCodedDecimal: options.binaryCodedDecimal,
    }, $dataView);

    value = getPartialValue(oldValue, value, options.operations!);
  }

  if (options.binary) {
    const { bitStart, bitLength } = options.binary;

    const dataTypeLength = dataTypeToLength(dataType);
    const dataTypeValue = dataTypeToValue(dataType);

    const mask =
      dataTypeValue ^
      ((dataTypeValue >> (dataTypeLength * 8 - bitLength)) << bitStart);

    // prettier-ignore
    const int = getInt(offset, dataType, {
      bigEndian: options.bigEndian,
    }, $dataView);

    value = (value << bitStart) | (int & mask);
  }

  if (options.binaryCodedDecimal) {
    const hex = value.toString().padStart(dataTypeToLength(dataType) * 2, "0");

    value = parseInt(hex, 16);
  }

  switch (dataType) {
    case "bit":
      $dataView.setBit(offset, options.bit || 0, value);
      break;
    case "lower4":
      $dataView.setLower4(offset, value);
      break;
    case "upper4":
      $dataView.setUpper4(offset, value);
      break;
    case "int8":
      $dataView.setInt8(offset, value);
      break;
    case "uint8":
      $dataView.setUint8(offset, value);
      break;
    case "int16":
      $dataView.setInt16(offset, value, !options.bigEndian);
      break;
    case "uint16":
      $dataView.setUint16(offset, value, !options.bigEndian);
      break;
    case "int24":
      $dataView.setInt24(offset, value, !options.bigEndian);
      break;
    case "uint24":
      $dataView.setUint24(offset, value, !options.bigEndian);
      break;
    case "int32":
      $dataView.setInt32(offset, value, !options.bigEndian);
      break;
    case "uint32":
      $dataView.setUint32(offset, value, !options.bigEndian);
      break;
    case "float32":
      $dataView.setFloat32(offset, value, !options.bigEndian);
      break;
  }

  if (isDataViewAltExists(dataViewAltKey)) {
    dataViewAlt.set({
      ...$dataViewAlt,
      [dataViewAltKey]: $dataView,
    });

    if (!$dataViewAltMetas[dataViewAltKey]) {
      $dataViewAltMetas[dataViewAltKey] = {};
    }

    if (utilsExists("generatePatch")) {
      if (!$dataViewAltMetas[dataViewAltKey].patch) {
        $dataViewAltMetas[dataViewAltKey].patch = {};
      }

      const dataTypeLength = dataTypeToLength(dataType);

      [...Array(dataTypeLength).keys()].forEach((index) => {
        const mutliplier = options.bigEndian
          ? dataTypeLength - 1 - index
          : index;
        const int = (value >>> (mutliplier * 0x8)) & 0xff;

        $dataViewAltMetas[dataViewAltKey]!.patch![offset + index] = int;
      });
    }

    $dataViewAltMetas[dataViewAltKey].isDirty = true;
  } else {
    dataView.set($dataView);
  }

  if (!$isDebug) {
    isDirty.set(true);
  }
}

interface BigIntOptions {
  bigEndian?: boolean;
}

export function getBigInt(
  offset: number,
  dataType: "int64" | "uint64",
  options: BigIntOptions = {},
  dataView?: DataView,
): bigint {
  const $dataView = getDataView(dataView);

  if (offset < 0x0) {
    debug.error("Tried to read a negative offset");

    return BigInt(0x0);
  } else if (
    $dataView.byteLength === 0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    debug.error(
      `Tried to read bytes past the end of a buffer at offset 0x${offset.toHex()} of 0x${$dataView.byteLength.toHex()}`,
    );

    return BigInt(0x0);
  }

  let int = BigInt(0x0);

  switch (dataType) {
    case "int64":
      int = $dataView.getBigInt64(offset, !options.bigEndian);
      break;
    case "uint64":
      int = $dataView.getBigUint64(offset, !options.bigEndian);
      break;
  }

  return int;
}

export function setBigInt(
  offset: number,
  dataType: "int64" | "uint64",
  value: bigint | string,
  options: BigIntOptions = {},
  dataViewAltKey = "",
): void {
  let $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);
  const $isDebug = get(isDebug);

  if (isDataViewAltExists(dataViewAltKey)) {
    $dataView = $dataViewAlt[dataViewAltKey];
  }

  if (offset < 0x0) {
    debug.error("Tried to write to a negative offset");

    return;
  } else if (
    $dataView.byteLength === 0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    debug.error(
      `Tried to write bytes past the end of a buffer at offset 0x${offset.toHex()} of 0x${$dataView.byteLength.toHex()}`,
    );

    return;
  }

  if (typeof value === "string") {
    value = BigInt(value || 0);
  }

  switch (dataType) {
    case "int64":
      $dataView.setBigInt64(offset, value, !options.bigEndian);
      break;
    case "uint64":
      $dataView.setBigUint64(offset, value, !options.bigEndian);
      break;
  }

  if (isDataViewAltExists(dataViewAltKey)) {
    dataViewAlt.set({
      ...$dataViewAlt,
      [dataViewAltKey]: $dataView,
    });

    if (!$dataViewAltMetas[dataViewAltKey]) {
      $dataViewAltMetas[dataViewAltKey] = {};
    }

    $dataViewAltMetas[dataViewAltKey].isDirty = true;
  } else {
    dataView.set($dataView);
  }

  if (!$isDebug) {
    isDirty.set(true);
  }
}

interface StringOptions {
  bigEndian?: boolean;
  letterBigEndian?: boolean;
  encoding?: StringEncoding;
  endCode?: number;
  regex?: string;
  resource?: string;
}

export function getString(
  offset: number,
  length: number,
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32",
  options: StringOptions = {},
  dataView?: DataView,
): string {
  const $dataView = getDataView(dataView);

  const increment = dataTypeToLength(letterDataType);

  let string = "";

  for (let i = offset; i < offset + length; i += increment) {
    const int = getInt(i, letterDataType, { bigEndian: options.letterBigEndian }, $dataView); // prettier-ignore
    const nextInt = getInt(i + 0x1, "uint8", {}, $dataView);

    if (options.endCode !== undefined && options.endCode === int) {
      break;
    }

    const resource = getResource(options.resource);

    if (resource) {
      const char = resource[int];

      string += char !== undefined ? char : " ";
    } else if (int === 0x0) {
      string += " ";
    } else if (
      options.encoding === "shiftJis" &&
      [0xde, 0xdf].includes(nextInt)
    ) {
      string += decodeChar((nextInt << 0x8) + int, "shiftJis");
      i += 0x1;
      length += 0x1;
    } else if (options.encoding) {
      string += decodeChar(int, options.encoding);
    } else {
      string += String.fromCharCode(int);
    }
  }

  if (options.bigEndian) {
    string = string.reverse();
  }

  return string;
}

export function setString(
  offset: number,
  length: number,
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32",
  value: string,
  fallback = 0x0,
  options: StringOptions = {},
  dataViewAltKey = "",
): void {
  const increment = dataTypeToLength(letterDataType);

  if (options.bigEndian) {
    value = value.reverse();
  }

  let skip = 0x0;

  for (let i = offset; i < offset + length; i += increment) {
    const char = value[(i - offset) / increment];

    if (char === undefined && options.endCode !== undefined) {
      // prettier-ignore
      setInt(i - skip, letterDataType, options.endCode, {
        bigEndian: options.letterBigEndian,
      }, dataViewAltKey);

      break;
    }

    const resource = getResource(options.resource);

    let int = fallback;

    if (char !== undefined) {
      const charCase = char === char.toLowerCase() ? "lower" : "upper";

      let charAltCase =
        charCase === "lower" ? char.toUpperCase() : char.toLowerCase();

      if (char.match(/[0-9]/)) {
        charAltCase = String.fromCharCode(char.charCodeAt(0) + 0xfee0);
      } else if (char.match(/[\uff10-\uff19]/)) {
        charAltCase = String.fromCharCode(char.charCodeAt(0) - 0xfee0);
      }

      const chars = [char, charAltCase];

      chars.some((char) => {
        if (resource) {
          const characters = Object.values(resource);

          const index = characters.findIndex((character) => character === char);

          if (index !== -1) {
            int = parseInt(getObjKey(resource, index));
          }
        } else if (!options.regex || char.match(new RegExp(options.regex))) {
          if (options.encoding) {
            int = encodeChar(char, options.encoding);
          } else {
            int = char.charCodeAt(0);
          }
        }

        if (int !== fallback) {
          return true;
        }
      });
    }

    // prettier-ignore
    if (options.endCode !== undefined && options.endCode === int) {
      skip += 0x1;
    } else if (options.encoding === "shiftJis" && int > 0xff) {
      setInt(i - skip, 'uint16', int, {
        bigEndian: options.letterBigEndian,
      }, dataViewAltKey);

      length += 0x1;
      skip -= 0x1;
    } else {
      setInt(i - skip, letterDataType, int, {
        bigEndian: options.letterBigEndian,
      }, dataViewAltKey);
    }
  }
}

export function getIntFromArray(
  array: number[] | Uint8Array,
  offset: number,
  dataType: Exclude<DataTypeInt, "int64" | "uint64" | "float32">,
  bigEndian = false,
): number {
  const littleEndian16 = [0, 1];
  const bigEndian16 = [1, 0];

  const littleEndian24 = [0, 1, 2];
  const bigEndian24 = [2, 1, 0];

  const littleEndian32 = [0, 1, 2, 3];
  const bigEndian32 = [3, 2, 1, 0];

  let order = [];

  let int = array[offset];

  if (dataType === "int8") {
    int = int & 0x80 ? int ^ -0x100 : int;
  } else if (["int16", "uint16"].includes(dataType)) {
    order = bigEndian ? bigEndian16 : littleEndian16;

    const b0 = array[offset + order[0]];
    const b1 = array[offset + order[1]] << 0x8;

    int = b0 | b1;

    if (dataType === "int16") {
      int = int & 0x8000 ? int ^ -0x10000 : int;
    }
  } else if (["int24", "uint24"].includes(dataType)) {
    order = bigEndian ? bigEndian24 : littleEndian24;

    const b0 = array[offset + order[0]];
    const b1 = array[offset + order[1]] << 0x8;
    const b2 = array[offset + order[2]] << 0x10;

    int = b0 | b1 | b2;

    if (dataType === "int24") {
      int = int & 0x800000 ? int ^ -0x1000000 : int;
    }
  } else if (["int32", "uint32"].includes(dataType)) {
    order = bigEndian ? bigEndian32 : littleEndian32;

    const b0 = array[offset + order[0]];
    const b1 = array[offset + order[1]] << 0x8;
    const b2 = array[offset + order[2]] << 0x10;
    const b3 = array[offset + order[3]] << 0x18;

    int = b0 | b1 | b2 | b3;

    if (dataType === "int32") {
      int = int & 0x80000000 ? int ^ -0x100000000 : int;
    }
  }

  return int;
}

export function intToArray(
  int: number,
  dataType: Exclude<
    DataTypeInt,
    "int8" | "uint8" | "int64" | "uint64" | "float32"
  >,
  bigEndian = false,
): number[] {
  const littleEndian16 = [0x0, 0x8];
  const bigEndian16 = [0x8, 0x0];

  const littleEndian24 = [0x0, 0x8, 0x10];
  const bigEndian24 = [0x10, 0x8, 0x0];

  const littleEndian32 = [0x0, 0x8, 0x10, 0x18];
  const bigEndian32 = [0x18, 0x10, 0x8, 0x0];

  let order = [];

  const array = [];

  if (["int16", "uint16"].includes(dataType)) {
    order = bigEndian ? bigEndian16 : littleEndian16;

    const b0 = (int >> order[0]) & 0xff;
    const b1 = (int >> order[1]) & 0xff;

    array.push(b0, b1);
  } else if (["int24", "uint24"].includes(dataType)) {
    order = bigEndian ? bigEndian24 : littleEndian24;

    const b0 = (int >> order[0]) & 0xff;
    const b1 = (int >> order[1]) & 0xff;
    const b2 = (int >> order[2]) & 0xff;

    array.push(b0, b1, b2);
  } else if (["int32", "uint32"].includes(dataType)) {
    order = bigEndian ? bigEndian32 : littleEndian32;

    const b0 = (int >> order[0]) & 0xff;
    const b1 = (int >> order[1]) & 0xff;
    const b2 = (int >> order[2]) & 0xff;
    const b3 = (int >> order[3]) & 0xff;

    array.push(b0, b1, b2, b3);
  }

  return array;
}
