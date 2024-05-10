import { get } from "svelte/store";

import {
  dataView,
  fileHeaderShift,
  fileName,
  gameJson,
  gameRegion,
  gameUtils,
  isDebug,
  isDirty,
} from "$lib/stores";
import {
  getObjKey,
  getRegionArray,
  isPartial,
  makeOperations,
  utilsExists,
} from "$lib/utils/format";

import type { Binary, Bit, DataType, GameJson, IntOperation } from "$lib/types";

export function resetState(): void {
  const $gameUtils = get(gameUtils) as any;

  if (utilsExists("onReset")) {
    $gameUtils.onReset();
  }

  dataView.set(new DataView(new ArrayBuffer(0)));
  fileName.set("");
  fileHeaderShift.set(0x0);
  gameJson.set({} as GameJson);
  gameRegion.set(-1);
  isDirty.set(false);
}

export function byteswap(
  dataViewTmp?: DataView,
  start = 0x0,
  end?: number,
  length = 0x4,
): DataView {
  const $dataView =
    dataViewTmp && dataViewTmp.byteLength > 0 ? dataViewTmp : get(dataView);

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
      return 4;
    case "int64":
    case "uint64":
      return 8;
  }
}

export function dataTypeToValue(
  dataType: Exclude<DataType, "bit" | "boolean" | "string">,
): number {
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
      return 0xffffffff;
    case "int64":
    case "uint64":
      return 0xfffffffffffff;
    default:
      return 0x0;
  }
}

export function extractBit(number: number, bit: Bit): boolean {
  return (number & (0x1 << bit)) !== 0x0;
}

export function extractBinary(
  number: number,
  bitStart: Bit,
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
): boolean {
  const $gameJson = get(gameJson);

  if (
    options.resource &&
    $gameJson.resources &&
    $gameJson.resources[options.resource] &&
    $gameJson.resources[options.resource][0] !== undefined &&
    $gameJson.resources[options.resource][1] !== undefined
  ) {
    if ($gameJson.resources[options.resource][0] === getInt(offset, "uint8")) {
      return false;
    } else if (
      $gameJson.resources[options.resource][1] === getInt(offset, "uint8")
    ) {
      return true;
    }
  }

  if (options.on !== undefined && options.on === getInt(offset, "uint8")) {
    return true;
  } else if (
    options.off !== undefined &&
    options.off === getInt(offset, "uint8")
  ) {
    return false;
  }

  return Boolean(getInt(offset, "uint8"));
}

export function setBoolean(
  offset: number,
  value: boolean,
  options: BooleanOptions = {},
): void {
  const $dataView = get(dataView);
  const $gameJson = get(gameJson);

  if (
    options.resource &&
    $gameJson.resources &&
    $gameJson.resources[options.resource] &&
    $gameJson.resources[options.resource][0] !== undefined &&
    $gameJson.resources[options.resource][1] !== undefined
  ) {
    setInt(
      offset,
      "uint8",
      $gameJson.resources[options.resource][value === true ? 1 : 0] as number,
    );
  } else if (options.on !== undefined && value) {
    setInt(offset, "uint8", options.on);
  } else if (options.off !== undefined && !value) {
    setInt(offset, "uint8", options.off);
  } else {
    setInt(offset, "uint8", value === false ? 0 : 1);
  }

  dataView.set($dataView);
}

interface BitflagOptions {
  reversed?: boolean;
}

export function getBitflags(
  offset: number,
  options: BitflagOptions = {},
): boolean[] {
  const trueString = options.reversed ? "0" : "1";

  const bitflags = (getInt(offset, "uint8") >>> 0)
    .toBinary()
    .split("")
    .map((bit) => bit === trueString)
    .reverse();

  return bitflags;
}

export function getBitflag(
  offset: number,
  flag: Bit,
  options: BitflagOptions = {},
): boolean {
  const bitflags = getBitflags(offset, options);

  return bitflags[flag];
}

export function setBitflag(
  offset: number,
  bit: number,
  value: boolean,
  options: BitflagOptions = {},
): void {
  const $dataView = get(dataView);

  const bitflag = getBitflags(offset, { reversed: options.reversed });

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

  setInt(offset, "uint8", binary);

  dataView.set($dataView);
}

interface IntOptions {
  bigEndian?: boolean;
  binary?: Binary;
  binaryCodedDecimal?: boolean;
  bit?: Bit;
  operations?: IntOperation[];
}

export function getInt(
  offset: number,
  dataType: Exclude<DataType, "boolean" | "int64" | "uint64" | "string">,
  options: IntOptions = {},
  dataViewTmp?: DataView,
): number {
  const $dataView =
    dataViewTmp && dataViewTmp.byteLength > 0 ? dataViewTmp : get(dataView);

  if (
    $dataView.byteLength === 0x0 ||
    offset < 0x0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    console.error(
      `Tried to read bytes past the end of a buffer at index ${offset} of ${$dataView.byteLength}`,
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
  }

  if (options.binary) {
    int = extractBinary(int, options.binary.bitStart, options.binary.bitLength);
  }

  if (options.binaryCodedDecimal) {
    let hex = int.toHex(dataTypeToLength(dataType) * 2);

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
): void {
  const $dataView = get(dataView);
  const $isDebug = get(isDebug);

  if (
    $dataView.byteLength === 0x0 ||
    offset < 0x0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    console.error(
      `Tried to write bytes past the end of a buffer at index ${offset} of ${$dataView.byteLength}`,
    );

    return;
  }

  if (typeof value === "string") {
    value = parseFloat(value) || 0;
  }

  if (
    options.binary &&
    (dataType === "int8" ||
      dataType === "int16" ||
      dataType === "uint8" ||
      dataType === "uint16")
  ) {
    const { bitStart, bitLength } = options.binary;

    const dataTypeLength = dataTypeToLength(dataType);
    const dataTypeValue = dataTypeToValue(dataType);

    const mask =
      dataTypeValue ^
      ((dataTypeValue >> (dataTypeLength * 8 - bitLength)) << bitStart);

    const int = getInt(offset, dataType, {
      bigEndian: options.bigEndian,
    });

    value = (value << bitStart) + (int & mask);
  }

  if (options.binaryCodedDecimal) {
    let hex = value.toString().padStart(dataTypeToLength(dataType) * 2, "0");

    value = parseInt(hex, 16);
  }

  value = makeOperations(value, options.operations, true);

  if (isPartial(options.operations)) {
    const oldInt = getInt(offset, dataType, {
      bigEndian: options.bigEndian,
      binaryCodedDecimal: options.binaryCodedDecimal,
    });

    let oldValue = getInt(offset, dataType, {
      bigEndian: options.bigEndian,
      binaryCodedDecimal: options.binaryCodedDecimal,
      bit: options.bit,
      operations: options.operations,
    });

    oldValue = makeOperations(oldValue, options.operations, true);

    value = oldInt - oldValue + value;
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
  }

  dataView.set($dataView);

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
  dataViewTmp?: DataView,
): bigint {
  const $dataView =
    dataViewTmp && dataViewTmp.byteLength > 0 ? dataViewTmp : get(dataView);

  if (
    $dataView.byteLength === 0x0 ||
    offset < 0x0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    console.error(
      `Tried to write bytes past the end of a buffer at index ${offset} of ${$dataView.byteLength}`,
    );

    return BigInt(0);
  }

  let int = BigInt(0);

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
): void {
  const $dataView = get(dataView);
  const $isDebug = get(isDebug);

  if (
    $dataView.byteLength === 0x0 ||
    offset < 0x0 ||
    offset + dataTypeToLength(dataType) - 1 > $dataView.byteLength - 1
  ) {
    console.error(
      `Tried to read bytes past the end of a buffer at index ${offset} of ${$dataView.byteLength}`,
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

  dataView.set($dataView);

  if (!$isDebug) {
    isDirty.set(true);
  }
}

interface StringOptions {
  bigEndian?: boolean;
  letterBigEndian?: boolean;
  resource?: string;
}

export function getString(
  offset: number,
  length: number,
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32",
  options: StringOptions = {},
): string {
  const $gameJson = get(gameJson);

  const increment = dataTypeToLength(letterDataType);

  let string = "";

  for (let i = offset; i < offset + length; i += increment) {
    const int = getInt(i, letterDataType, {
      bigEndian: options.letterBigEndian,
    });

    let resource: any;

    if (
      options.resource &&
      $gameJson.resources &&
      $gameJson.resources[options.resource]
    ) {
      if (Array.isArray($gameJson.resources[options.resource])) {
        resource = getRegionArray(
          $gameJson.resources[options.resource] as {
            [key: number]: number | string;
          }[],
        );
      } else {
        resource = $gameJson.resources[options.resource];
      }
    }

    if (resource) {
      const char = resource[int];

      string += char !== undefined ? char : " ";
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
): void {
  const $gameJson = get(gameJson);

  const increment = dataTypeToLength(letterDataType);

  if (options.bigEndian) {
    value = value.reverse();
  }

  for (let i = offset; i < offset + length; i += increment) {
    const char = value[(i - offset) / increment];

    let resource;

    if (
      options.resource &&
      $gameJson.resources &&
      $gameJson.resources[options.resource]
    ) {
      if (Array.isArray($gameJson.resources[options.resource])) {
        resource = getRegionArray(
          $gameJson.resources[options.resource] as {
            [key: number]: number | string;
          }[],
        );
      } else {
        resource = $gameJson.resources[options.resource];
      }
    }

    if (resource) {
      let index = Object.values(resource).findIndex(
        (letter) => letter === char,
      );

      let int = fallback;

      if (index !== -1) {
        int = parseInt(getObjKey(resource, index));
      }

      setInt(i, letterDataType, int, { bigEndian: options.letterBigEndian });
    } else {
      setInt(i, letterDataType, (char || "").charCodeAt(0), {
        bigEndian: options.letterBigEndian,
      });
    }
  }
}
