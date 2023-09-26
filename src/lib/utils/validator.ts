import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { objGetKey } from "$lib/utils/format";

export function checkConditions(conditions: any, callback: any): boolean {
  if (!Array.isArray(conditions)) {
    return callback(conditions);
  } else if (conditions.length === 1) {
    const condition = conditions[0];
    const operand = objGetKey(condition, 0);

    if (operand === "$and" || operand === "$or") {
      if (operand === "$and") {
        return condition.$and.every((array: any) => {
          return checkConditions(array, callback);
        });
      } else if (operand === "$or") {
        return condition.$or.some((array: any) => {
          return checkConditions(array, callback);
        });
      }
    }
  }

  return false;
}

export function checkPlaystationSlots(
  index: number,
  validators: number[][],
): boolean {
  const offset = (index + 1) * 0x80 + 0xa;
  const length = validators[0].length;

  for (let i = offset; i < offset + length; i += 0x1) {
    if (
      validators.every(
        (validator) => getInt(i, "uint8") !== validator[i - offset],
      )
    ) {
      return false;
    }
  }

  if (getInt(offset - 0xa, "uint8") !== 0x51) {
    return false;
  }

  return true;
}

export function getRegionIndex(region: string): number {
  const $gameTemplate = get(gameTemplate);

  const regionIndex = Object.keys($gameTemplate.validator.regions).findIndex(
    (item) => item === region,
  );

  return regionIndex;
}

export function getRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions = Object.entries($gameTemplate.validator.regions).reduce(
    (regions: string[], [region, conditions]) => {
      if (
        checkConditions(conditions, (condition: any) => {
          const offset = parseInt(objGetKey(condition, 0));
          const array = condition[offset];
          const length = array.length;

          let isValid = true;

          for (let i = offset; i < offset + length; i += 0x1) {
            if (i >= dataView.byteLength) {
              isValid = false;

              return;
            }

            if (dataView.getUint8(i) !== array[i - offset]) {
              isValid = false;
            }
          }
          return isValid;
        })
      ) {
        regions.push(region);
      }

      return regions;
    },
    [],
  );

  return regions;
}
