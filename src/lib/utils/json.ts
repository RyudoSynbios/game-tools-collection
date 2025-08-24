import { get } from "svelte/store";

import { dataJson } from "$lib/stores";

import debug from "./debug";

export function getObjValue<T>(
  pathname: string,
  defaultValue: any = undefined,
  obj: { [key: string]: any } = {},
): T {
  const $dataJson = get(dataJson);

  if (Object.keys(obj).length === 0) {
    obj = $dataJson;
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

export function setObjValue<T>(
  pathname: string,
  value: T | undefined = undefined,
  obj: { [key: string]: any } = {},
): void {
  const $dataJson = get(dataJson);

  let updateDataJson = false;

  if (Object.keys(obj).length === 0) {
    obj = $dataJson;
    updateDataJson = true;
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
