import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getObjKey } from "$lib/utils/format";

import type { RegionValidator } from "$lib/types";

export function checkConditions(conditions: any, callback: any): boolean {
  if (conditions.$and || conditions.$or) {
    if (conditions.$and) {
      return conditions.$and.every((array: any) =>
        checkConditions(array, callback),
      );
    } else if (conditions.$or) {
      return conditions.$or.some((array: any) =>
        checkConditions(array, callback),
      );
    }
  }

  return callback(conditions);
}

export function reduceConditions(conditions: any, callback: any): any {
  if (conditions.$and || conditions.$or) {
    const key = getObjKey(conditions, 0) as "$and" | "$or";

    const test = conditions[key]!.reduce((results: any, condition: any) => {
      results.push(reduceConditions(condition, callback));

      return results;
    }, []);

    return { [key]: test };
  }

  return callback(conditions);
}

export function checkValidator(
  validator: number[],
  offset: number,
  dataView?: DataView,
): boolean {
  return validator.every((int, index) => {
    if (getInt(offset + index, "uint8", {}, dataView) === int) {
      return true;
    }
  });
}

export function getRegionIndex(region: string): number {
  const $gameTemplate = get(gameTemplate);

  const regionIndex = Object.keys($gameTemplate.validator.regions).findIndex(
    (item) => item === region,
  );

  return regionIndex;
}

export function getRegions(
  dataView: DataView,
  shift = 0x0,
  overridedRegions?: { [key: string]: RegionValidator },
): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions = Object.entries(
    overridedRegions || $gameTemplate.validator.regions,
  ).reduce((regions: string[], [region, conditions]) => {
    if (
      checkConditions(conditions, (condition: any) => {
        const offset = parseInt(getObjKey(condition, 0));
        const array = condition[offset];

        if (isNaN(offset) || !array) {
          return false;
        }

        const length = array.length;

        for (let i = offset; i < offset + length; i += 0x1) {
          if (i >= dataView.byteLength) {
            return false;
          }

          if (getInt(i + shift, "uint8", {}, dataView) !== array[i - offset]) {
            return false;
          }
        }

        return true;
      })
    ) {
      regions.push(region);
    }

    return regions;
  }, []);

  return regions;
}
