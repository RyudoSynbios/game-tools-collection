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

export function generateIdFromArray(array: any[], key: string) {
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
  return operations.some((operation) => getObjKey(operation, 0) === "convert");
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
          if (!reversed) {
            value = timestampToUnitValue(
              value,
              (operation[operationSymbol] as IntOperationConvert).from,
              (operation[operationSymbol] as IntOperationConvert).to,
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
      }
    });
  }

  return value;
}

export function mergeUint8Arrays(uint8Arrays: Uint8Array[]): Uint8Array {
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

export function timestampToUnitValue(
  timestamp: number,
  entry: TimeUnit,
  output: TimeUnit,
): number {
  if (
    ["milliseconds", "seconds", "minutes", "hours"].includes(entry) &&
    ["milliseconds", "seconds", "minutes", "hours"].includes(output)
  ) {
    switch (output) {
      case "milliseconds":
        return moment.duration(timestamp, entry).milliseconds();
      case "seconds":
        return moment.duration(timestamp, entry).seconds();
      case "minutes":
        return moment.duration(timestamp, entry).minutes();
      case "hours":
        let hours = moment.duration(timestamp, entry).hours();
        hours += moment.duration(timestamp, entry).days() * 24;
        hours += moment.duration(timestamp, entry).months() * 24 * 31;
        hours += moment.duration(timestamp, entry).years() * 24 * 31 * 12;

        return hours;
    }
  }

  return timestamp;
}

export function unitValueToTimestamp(
  value: number,
  entry: TimeUnit,
  output: TimeUnit,
): number {
  if (
    ["milliseconds", "seconds", "minutes", "hours"].includes(entry) &&
    ["milliseconds", "seconds", "minutes", "hours"].includes(output)
  ) {
    switch (output) {
      case "milliseconds":
        return moment.duration(value, entry).asMilliseconds();
      case "seconds":
        return moment.duration(value, entry).asSeconds();
      case "minutes":
        return moment.duration(value, entry).asMinutes();
      case "hours":
        return moment.duration(value, entry).asHours();
    }
  }

  return value;
}

export function getUtils(value = "", params = {}): any {
  const $gameUtils = get(gameUtils) as any;

  let method: string = value;

  if (method && method.match(/\(\)$/)) {
    method = method.replace(/\(\)$/, "");

    if (utilsExists(method)) {
      value = $gameUtils[method](params);
    }
  }

  return value;
}

export function utilsExists(name: string): boolean {
  const $gameUtils = get(gameUtils) as any;

  return typeof $gameUtils[name] === "function";
}
