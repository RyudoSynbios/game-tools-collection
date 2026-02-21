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

export function camelCaseToString(string: string): string {
  return string.replace(/([a-z])([A-Z])/, "$1 $2");
}

export function lowerize(string: string): string {
  return string[0].toLowerCase() + string.slice(1);
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

    return dataTypeValue >>> (dataTypeLength * 8 - item.binary.bitLength);
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

export function isInRange(value: number, min: number, max: number) {
  return value >= min && value <= max;
}

export function isObjIsEmpty(obj: { [key: string]: any }): boolean {
  return !obj || Object.keys(obj).length === 0;
}

export function isPartial(operations: IntOperation[] = []): boolean {
  return operations.some((operation) =>
    ["convert", "date"].includes(getObjKey(operation, 0)),
  );
}

export function getPartialValue(
  oldValue: number,
  newValue: number,
  operations: IntOperation[],
): number {
  const calcValue = makeOperations(
    makeOperations(oldValue, operations),
    operations,
    true,
  );

  return oldValue - calcValue + newValue;
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
    (length, uint8Array) => (length += uint8Array.length),
    0,
  );

  const uint8Array = new Uint8Array(length);

  let offset = 0x0;

  uint8Arrays.forEach((array) => {
    uint8Array.set(array, offset);

    offset += array.length;
  });

  return uint8Array;
}

export function mergeUint32Arrays(...uint32Arrays: Uint32Array[]): Uint32Array {
  const length = uint32Arrays.reduce(
    (length, uint32Array) => (length += uint32Array.length),
    0,
  );

  const uint32Array = new Uint32Array(length);

  let offset = 0x0;

  uint32Arrays.forEach((array) => {
    uint32Array.set(array, offset);

    offset += array.length;
  });

  return uint32Array;
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
      let indexA = order.indexOf(parseInt(a.key));
      let indexB = order.indexOf(parseInt(b.key));

      if (indexA === -1) {
        indexA = 9999;
      }

      if (indexB === -1) {
        indexB = 9999;
      }

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
          params.push(param.trim().replaceAll("'", ""));
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

// Adapted from ThreeJS

// prettier-ignore
export function generateUUID(): string {
  const array = [...Array(0x100).keys()].map((index) => index.toHex(2));

  const d0 = (Math.random() * 0xffffffff) | 0x0;
  const d1 = (Math.random() * 0xffffffff) | 0x0;
  const d2 = (Math.random() * 0xffffffff) | 0x0;
  const d3 = (Math.random() * 0xffffffff) | 0x0;

  let uuid  = array[d0 & 0xff] +        array[d0 >> 0x8 & 0xff] +       array[d0 >> 0x10 & 0xff]       + array[d0 >> 0x18 & 0xff] + "-";
      uuid += array[d1 & 0xff] +        array[d1 >> 0x8 & 0xff] + "-" + array[d1 >> 0x10 & 0xf | 0x40] + array[d1 >> 0x18 & 0xff] + "-";
      uuid += array[d2 & 0x3f | 0x80] + array[d2 >> 0x8 & 0xff] + "-" + array[d2 >> 0x10 & 0xff]       + array[d2 >> 0x18 & 0xff];
      uuid += array[d3 & 0xff] +        array[d3 >> 0x8 & 0xff] +       array[d3 >> 0x10 & 0xff]       + array[d3 >> 0x18 & 0xff];

  return uuid;
}
