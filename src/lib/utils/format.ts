import moment from "moment";
import { get } from "svelte/store";

import { gameRegion, gameUtils } from "$lib/stores";
import { dataTypeToValue } from "$lib/utils/bytes";

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
    return 0xff >> (8 - item.binary.bitLength);
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
        if (param.match(/[0-9]+/)) {
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
