import { get } from "svelte/store";

import {
  dataViewAlt,
  gamePlatform,
  gameRegion,
  gameTemplate,
} from "$lib/stores";
import { getBigInt, getInt, isDataViewAltExists } from "$lib/utils/bytes";
import { getObjKey } from "$lib/utils/format";

import type {
  GameRegion,
  ItemIntCondition,
  LogicalOperator,
  RegionValidator,
  Validator,
} from "$lib/types";

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

export function checkIntConditions(
  conditions: ItemIntCondition | LogicalOperator<ItemIntCondition>,
): boolean {
  const $dataViewAlt = get(dataViewAlt);

  return checkConditions(conditions, (condition: ItemIntCondition) => {
    let dataViewAlt;

    if (isDataViewAltExists(condition.dataViewAltKey || "")) {
      dataViewAlt = $dataViewAlt[condition.dataViewAltKey as string];
    }

    let int;

    // prettier-ignore
    if (condition.dataType !== "int64" && condition.dataType !== "uint64") {
      int = getInt(condition.offset, condition.dataType, {
        bigEndian: condition.bigEndian,
        binary: condition.binary,
        bit: condition.bit,
      }, dataViewAlt);
    } else {
      int = getBigInt(condition.offset, condition.dataType, {
        bigEndian: condition.bigEndian,
      }, dataViewAlt);
    }

    switch (condition.operator) {
      case "=":
        return int === condition.value;
      case "!=":
        return int !== condition.value;
      case ">":
        return int > condition.value;
      case ">=":
        return int >= condition.value;
      case "<":
        return int < condition.value;
      case "<=":
        return int <= condition.value;
    }
  });
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

export function getPlatformName(): string {
  const $gamePlatform = get(gamePlatform);
  const $gameTemplate = get(gameTemplate);

  return getObjKey($gameTemplate.validator.platforms, $gamePlatform);
}

export function getPlatformRegions(): GameRegion {
  const $gamePlatform = get(gamePlatform);
  const $gameTemplate = get(gameTemplate);

  const platforms = $gameTemplate.validator.platforms;

  const platform = getObjKey(platforms, $gamePlatform);

  if (!platform || !platforms[platform]) {
    return {};
  }

  return platforms[platform];
}

export function getRegionIndex(region: string): number {
  const platformRegions = getPlatformRegions();

  const regionIndex = Object.keys(platformRegions).findIndex(
    (item) => item === region,
  );

  return regionIndex;
}

export function getRegionName(regionIndex?: number): string {
  const $gameRegion = get(gameRegion);

  const platformRegions = getPlatformRegions();

  if (regionIndex === undefined) {
    regionIndex = $gameRegion;
  }

  return getObjKey(platformRegions, regionIndex);
}

export function getRegionValidator(
  offset: number,
  regionIndex?: number,
): number[] {
  const platformRegions = getPlatformRegions();
  const region = getRegionName(regionIndex);

  const validator = platformRegions[region] as Validator;

  return validator[offset];
}

export function getRegions(
  dataView: DataView,
  shift = 0x0,
  overridedRegions?: { [key: string]: RegionValidator },
): string[] {
  const platformRegions = getPlatformRegions();

  return Object.entries(overridedRegions || platformRegions).reduce(
    (regions: string[], [region, conditions]) => {
      if (
        checkConditions(conditions, (condition: any) => {
          if (condition === true) {
            return true;
          }

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

            if (
              getInt(i + shift, "uint8", {}, dataView) !== array[i - offset]
            ) {
              return false;
            }
          }

          return true;
        })
      ) {
        regions.push(region);
      }

      return regions;
    },
    [],
  );
}
