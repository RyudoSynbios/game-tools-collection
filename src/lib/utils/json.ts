import { get } from "svelte/store";

import { dataJson, isDebug, isDirty } from "$lib/stores";

import { DataType, IntOperation } from "$lib/types";

import { extractBit, injectBit } from "./bytes";
import debug from "./debug";
import {
  getPartialValue,
  isObjIsEmpty,
  isPartial,
  makeOperations,
} from "./format";

interface JsonBitflagOptions {
  reversed?: boolean;
}

export function getJsonBitflag(
  path: string,
  type: "boolean" | "boolean[]" | "number" | "number[]" = "number",
  index: number,
  bit: number,
  options: JsonBitflagOptions = {},
): boolean {
  let boolean = false;

  switch (type) {
    case "boolean":
      boolean = getJsonBoolean(path);
      break;
    case "boolean[]":
      boolean = getJsonBoolean(`${path}[${index}]`);
      break;
    case "number":
      boolean = extractBit(getJsonInt(path), bit);
      break;
    case "number[]":
      boolean = extractBit(getJsonInt(`${path}[${index}]`), bit);
      break;
  }

  if (options.reversed) {
    boolean = !boolean;
  }

  return boolean;
}

export function setJsonBitflag(
  path: string,
  type: "boolean" | "boolean[]" | "number" | "number[]" = "number",
  index: number,
  bit: number,
  value: boolean,
  options: JsonBitflagOptions = {},
): void {
  if (options.reversed) {
    value = !value;
  }

  switch (type) {
    case "boolean":
      setJsonBoolean(path, value);
      break;
    case "boolean[]":
      setJsonBoolean(`${path}[${index}]`, value);
      break;
    case "number":
      setJsonValue(path, injectBit(getJsonInt(path), bit, value));
      break;
    case "number[]":
      setJsonValue(
        `${path}[${index}]`,
        injectBit(getJsonInt(`${path}[${index}]`), bit, value),
      );
      break;
  }
}

export function getJsonBoolean(path: string): boolean {
  return getJsonValue<boolean>(path, false);
}

export function setJsonBoolean(path: string, value: boolean): void {
  setJsonValue(path, value);
}

interface JsonIntOptions {
  operations?: IntOperation[];
}

export function getJsonInt(path: string, options: JsonIntOptions = {}): number {
  let int = getJsonValue<number>(path, 0x0);

  if (options.operations) {
    int = makeOperations(int, options.operations);
  }

  return int;
}

export function setJsonInt(
  path: string,
  dataType: Exclude<DataType, "boolean" | "string">,
  value: number | string,
  options: JsonIntOptions = {},
): void {
  const $isDebug = get(isDebug);

  if (typeof value === "string") {
    value = parseFloat(value) || 0;
  }

  switch (dataType) {
    case "int8":
      value &= 0xff;
      value = value & 0x80 ? value ^ -0x100 : value;
      break;
    case "int16":
      value &= 0xffff;
      value = value & 0x8000 ? value ^ -0x10000 : value;
      break;
    case "int24":
      value &= 0xffffff;
      value = value & 0x800000 ? value ^ -0x1000000 : value;
      break;
    case "int32":
      value &= 0xffffffff;
      value = value & 0x80000000 ? value ^ -0x100000000 : value;
      break;
    case "uint8":
      value &= 0xff;
      break;
    case "uint16":
      value &= 0xffff;
      break;
    case "uint24":
      value &= 0xffffff;
      break;
    case "uint32":
      value &= 0xffffffff;
      break;
  }

  if (options.operations) {
    value = makeOperations(value, options.operations, true);
  }

  // prettier-ignore
  if (isPartial(options.operations)) {
    const oldValue = getJsonInt(path);

    value = getPartialValue(oldValue, value, options.operations!);
  }

  setJsonValue<number>(path, value);

  if (!$isDebug) {
    isDirty.set(true);
  }
}

interface JsonStringOptions {
  regex?: string;
}

export function getJsonString(path: string): string {
  const $dataJson = get(dataJson);

  if (!$dataJson) {
    return "";
  }

  const string = getJsonValue<string>(path, "");

  return string;
}

export function setJsonString(
  path: string,
  length: number,
  value: string,
  options: JsonStringOptions = {},
): void {
  value = value.slice(0, length);

  setJsonValue<string>(path, value);
}

export function getJsonValue<T>(
  pathname: string,
  defaultValue: any = undefined,
  obj: { [key: string]: any } = {},
): T {
  const $dataJson = get(dataJson);

  if (isObjIsEmpty(obj) && !isObjIsEmpty($dataJson)) {
    obj = $dataJson;
  } else {
    debug.error(`JSON is empty.`);
    return defaultValue;
  }

  const path = pathname.split(".");

  for (let i = 0; i < path.length; i += 1) {
    const [key] = path[i].split("[");

    if (obj[key] === undefined) {
      debug.error(`Key "${key}" on path "${pathname}" not found.`);
      return defaultValue;
    }

    obj = obj[key];

    path[i].matchAll(/\[(\d+)\]/g).forEach((match) => {
      if (obj[match[1]] === undefined) {
        debug.error(
          `Array index "${match[1]}" of key "${key} on path "${pathname}" not found.`,
        );
        return defaultValue;
      }

      obj = obj[match[1]];
    });
  }

  if (
    typeof obj === "boolean" ||
    typeof obj === "number" ||
    typeof obj === "string"
  ) {
    return obj;
  } else {
    debug.error(`Value "${pathname}" must be a boolean, a number or a string.`);
  }

  return defaultValue;
}

export function setJsonValue<T>(
  pathname: string,
  value?: T,
  obj: { [key: string]: any } = {},
): void {
  const $dataJson = get(dataJson);

  let updateDataJson = false;

  if (isObjIsEmpty(obj) && !isObjIsEmpty($dataJson)) {
    obj = $dataJson;
    updateDataJson = true;
  } else {
    debug.error(`JSON is empty.`);
    return;
  }

  const path = pathname.split(".");

  const keys = [];

  let pObj = obj;

  for (let i = 0; i < path.length; i += 1) {
    const [key] = path[i].split("[");

    keys.push(key);

    if (obj[key] === undefined) {
      debug.error(`Key "${key}" on path "${pathname}" not found.`);
      return;
    }

    pObj = obj;
    obj = obj[key];

    [...path[i].matchAll(/\[(\d+)\]/g)].forEach((match) => {
      if (obj[match[1]] === undefined) {
        debug.error(
          `Array index "${match[1]}" of key "${key} on path "${pathname}" not found.`,
        );
        return;
      }

      keys.push(match[1]);

      pObj = obj;
      obj = obj[match[1]];
    });
  }

  const lastKey = keys.at(-1)!;

  if (pObj[lastKey] === undefined) {
    debug.error(`Key "${lastKey}" on path "${pathname}" not found.`);
    return;
  } else if (typeof pObj[lastKey] !== typeof value) {
    debug.error(`Type is incorrect on path "${pathname}".`);
    return;
  }

  pObj[lastKey] = value;

  if (updateDataJson) {
    dataJson.set($dataJson);
  }
}
