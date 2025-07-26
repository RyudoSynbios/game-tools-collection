import moment from "moment";
import { get } from "svelte/store";

import { gameRegion, gameUtils } from "$lib/stores";
import { dataTypeToLength, dataTypeToValue } from "$lib/utils/bytes";

import type {
  IntOperation,
  IntOperationConvert,
  ItemInt,
  ObjectKeyValue,
  TimeUnit,
} from "$lib/types";

export function capitalize(string: string): string {
  if (string.length <= 3) {
    return string.toUpperCase();
  }

  return string[0].toUpperCase() + string.slice(1);
}

export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function generateIdFromArray(array: any[], key: string): string {
  let id = "";

  array.forEach((item) => {
    id += `${item[key].length}${item[key][0]}${
      item[key][item[key].length - 1]
    }`;
  });

  return id;
}

export function getIntMin(item: ItemInt): number {
  if (item.min !== undefined) {
    return item.min;
  } else if (
    item.dataType === "int8" ||
    item.dataType === "int16" ||
    item.dataType === "int24" ||
    item.dataType === "int32" ||
    item.dataType === "int64"
  ) {
    return -Math.ceil(dataTypeToValue(item.dataType) / 2);
  }

  return 0;
}

export function getIntMax(item: ItemInt): number {
  if (item.max !== undefined) {
    return item.max;
  } else if (item.binaryCodedDecimal) {
    if (item.dataType === "uint8") {
      return 99;
    } else if (item.dataType === "uint16") {
      return 9999;
    } else if (item.dataType === "uint24") {
      return 999999;
    } else if (item.dataType === "uint32") {
      return 99999999;
    }
  } else if (item.binary) {
    const dataTypeLength = dataTypeToLength(item.dataType);
    const dataTypeValue = dataTypeToValue(item.dataType);

    return dataTypeValue >> (dataTypeLength * 8 - item.binary.bitLength);
  } else if (
    item.dataType === "int8" ||
    item.dataType === "int16" ||
    item.dataType === "int24" ||
    item.dataType === "int32" ||
    item.dataType === "int64"
  ) {
    return Math.floor(dataTypeToValue(item.dataType) / 2);
  } else if (
    item.dataType === "lower4" ||
    item.dataType === "upper4" ||
    item.dataType === "uint8" ||
    item.dataType === "uint16" ||
    item.dataType === "uint24" ||
    item.dataType === "uint32" ||
    item.dataType === "uint64"
  ) {
    return dataTypeToValue(item.dataType);
  }

  return 1;
}

export function getOrdinalSuffix(number: number): string {
  const base10 = number % 10;
  const base100 = number % 100;

  if (base10 === 1 && base100 !== 11) {
    return `${number}st`;
  } else if (base10 === 2 && base100 !== 12) {
    return `${number}nd`;
  } else if (base10 === 3 && base100 !== 13) {
    return `${number}rd`;
  }

  return `${number}th`;
}

export function getRandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getRegionArray<T>(array: T[]): T {
  const $gameRegion = get(gameRegion);

  return array[$gameRegion];
}

export function isPartial(operations: IntOperation[] = []): boolean {
  return operations.some((operation) =>
    ["convert", "date"].includes(getObjKey(operation, 0)),
  );
}

export function makeOperations(
  value: number,
  operations: IntOperation[] = [],
  reversed = false,
): number {
  if (Array.isArray(operations)) {
    operations.forEach((operation) => {
      const operationSymbol = getObjKey(operation, 0);

      switch (operationSymbol) {
        case "+":
          if (!reversed) {
            value += operation[operationSymbol] as number;
          } else {
            value -= operation[operationSymbol] as number;
          }
          break;
        case "-":
          if (!reversed) {
            value -= operation[operationSymbol] as number;
          } else {
            value += operation[operationSymbol] as number;
          }
          break;
        case "*":
          if (!reversed) {
            value *= operation[operationSymbol] as number;
          } else {
            value /= operation[operationSymbol] as number;
          }
          break;
        case "/":
          if (!reversed) {
            value /= operation[operationSymbol] as number;
          } else {
            value *= operation[operationSymbol] as number;
          }
          break;
        case "convert":
        case "date":
          if (!reversed) {
            value = timestampToUnitValue(
              value,
              (operation[operationSymbol] as IntOperationConvert).from,
              (operation[operationSymbol] as IntOperationConvert).to,
              operationSymbol === "date",
            );
          } else {
            value = unitValueToTimestamp(
              value,
              (operation[operationSymbol] as IntOperationConvert).to,
              (operation[operationSymbol] as IntOperationConvert).from,
            );
          }
          break;
        case "round":
          value = round(value, operation.round as number);
          break;
        case "roundCeil":
          value = Math.ceil(value);
          break;
        case "roundFloor":
          value = Math.floor(value);
          break;
      }
    });
  }

  return value;
}

export function getLocalStorage(key: string): string {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    return localStorage[key];
  }

  return "";
}

export function setLocalStorage(key: string, value: number | string): void {
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    localStorage[key] = value;
  }
}

export function mergeUint8Arrays(...uint8Arrays: Uint8Array[]): Uint8Array {
  const length = uint8Arrays.reduce(
    (length, uint8Array) => (length += uint8Array.byteLength),
    0,
  );

  const uint8Array = new Uint8Array(length);

  let offset = 0x0;

  uint8Arrays.forEach((array) => {
    uint8Array.set(array, offset);

    offset += array.byteLength;
  });

  return uint8Array;
}

export function numberArrayToString(array: number[]): string {
  if (!Array.isArray(array)) {
    return "";
  }

  return array.map((char) => String.fromCharCode(char)).join("");
}

export function getObjKey(obj: Object, index: number): string {
  const keys = Object.keys(obj);

  if (keys.length >= index) {
    return keys[index];
  }

  return "";
}

export function objToArrayKeyValue<T>(
  obj: Object,
  order?: number[],
): ObjectKeyValue<T>[] {
  const array = Object.entries(obj).reduce(
    (results: ObjectKeyValue<T>[], [key, value]) => {
      results.push({ key, value });

      return results;
    },
    [],
  );

  if (order) {
    array.sort((a, b) => {
      const indexA = order.indexOf(parseInt(a.key)) || -2;
      const indexB = order.indexOf(parseInt(b.key)) || -2;

      return indexA - indexB;
    });
  }

  return array;
}

export function round(value: number, decimals = 2): number {
  return (
    Math.round((value + Number.EPSILON) * Math.pow(10, decimals)) /
    Math.pow(10, decimals)
  );
}

const units = [
  "milliseconds",
  "seconds",
  "minutes",
  "hours",
  "day",
  "month",
  "year",
];

export function timestampToUnitValue(
  timestamp: number,
  entry: TimeUnit,
  output: TimeUnit,
  isDate = false,
): number {
  if (units.includes(entry) && units.includes(output)) {
    if (isDate) {
      const object = moment.unix(timestamp).toObject();

      switch (output) {
        case "day":
          return object.date;
        case "month":
          return object.months + 1;
        case "year":
          return object.years;
      }

      return moment.duration(timestamp, entry).get(output);
    }

    if (output === "hours") {
      return Math.floor(moment.duration(timestamp, entry).asHours());
    }

    return moment.duration(timestamp, entry).get(output);
  }

  return timestamp;
}

export function unitValueToTimestamp(
  value: number,
  entry: TimeUnit,
  output: TimeUnit,
): number {
  if (units.includes(entry) && units.includes(output)) {
    return moment.duration(value, entry).as(output);
  }

  return value;
}

export function getUtils(value = "", ...params: any[]): any {
  const $gameUtils = get(gameUtils) as any;

  let method: string = value;

  const regex = /\((.*?)\)$/;

  if (method && method.match(regex)) {
    regex
      .exec(method)![1]
      .split(",")
      .forEach((param) => {
        if (param.match(/^[0-9]+$/)) {
          params.push(parseInt(param));
        } else {
          params.push(param.replaceAll("'", ""));
        }
      });

    method = method.replace(regex, "");

    if (utilsExists(method)) {
      value = $gameUtils[method](...params);
    }
  }

  return value;
}

export function utilsExists(name: string): boolean {
  const $gameUtils = get(gameUtils) as any;

  return typeof $gameUtils[name] === "function";
}

// From ThreeJS

// prettier-ignore
const _lut = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];

// prettier-ignore
export function generateUUID(): string {
  const d0 = Math.random() * 4294967295 | 0;
  const d1 = Math.random() * 4294967295 | 0;
  const d2 = Math.random() * 4294967295 | 0;
  const d3 = Math.random() * 4294967295 | 0;
  
  const uuid = _lut[d0 & 255] + _lut[d0 >> 8 & 255] + _lut[d0 >> 16 & 255] + _lut[d0 >> 24 & 255] + "-" + _lut[d1 & 255] + _lut[d1 >> 8 & 255] + "-" + _lut[d1 >> 16 & 15 | 64] + _lut[d1 >> 24 & 255] + "-" + _lut[d2 & 63 | 128] + _lut[d2 >> 8 & 255] + "-" + _lut[d2 >> 16 & 255] + _lut[d2 >> 24 & 255] + _lut[d3 & 255] + _lut[d3 >> 8 & 255] + _lut[d3 >> 16 & 255] + _lut[d3 >> 24 & 255];
  
  return uuid.toLowerCase();
}
