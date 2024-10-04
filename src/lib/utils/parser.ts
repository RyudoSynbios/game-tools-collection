import { get } from "svelte/store";

import {
  fileHeaderShift,
  gameJson,
  gameRegion,
  gameTemplate,
  gameUtils,
  isDebug,
} from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import {
  clone,
  getObjKey,
  getRegionArray,
  getUtils,
  utilsExists,
} from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemComponent,
  ItemContainer,
  ItemIntCondition,
  LogicalOperator,
  Resource,
} from "$lib/types";

let checksums: ItemChecksum[];

export function enrichGameJson(): void {
  const $fileHeaderShift = get(fileHeaderShift);
  const $gameTemplate = get(gameTemplate);
  const $gameUtils = get(gameUtils) as any;

  checksums = [];

  let shifts: number[] = [];

  if ($fileHeaderShift > 0x0) {
    shifts.push($fileHeaderShift);
  }

  if (utilsExists("initShifts")) {
    shifts = $gameUtils.initShifts(shifts);
  }

  if (utilsExists("beforeItemsParsing")) {
    $gameUtils.beforeItemsParsing();
  }

  const items = $gameTemplate.items.reduce((items: Item[], item) => {
    items.push(parseItem(item, shifts));

    return items;
  }, []);

  const json = {
    validator: $gameTemplate.validator,
    items,
    checksums,
    resources: $gameTemplate.resources,
    resourcesOrder: $gameTemplate.resourcesOrder,
  };

  gameJson.set(json);

  // TODO: Find a way to not dissociate in 2 gameJson.set (useful for utils that required $gameJson)

  updateResources();

  if (utilsExists("onReady")) {
    $gameUtils.onReady();
  }
}

export function getShift(shifts: number[]): number {
  return shifts.reduce((total, shift) => total + shift, 0);
}

function getOverridedShift(
  shifts: number[],
  parent: number,
  shift: number,
  shiftIndex: number,
): number {
  const parentIndex = shifts.length - parent;

  return shifts.reduce((total, value, index) => {
    let newTotal = total;

    if (index < parentIndex) {
      newTotal += value;
    } else if (index === parentIndex) {
      newTotal += shiftIndex * shift;
    }

    return newTotal;
  }, 0);
}

interface ParseItemOptions {
  checksumsDisabled?: boolean;
}

export function parseItem(
  item: Item,
  shifts: number[],
  instanceId = "",
  instanceIndex = 0,
  options: ParseItemOptions = {},
): Item {
  const $gameUtils = get(gameUtils) as any;
  const $isDebug = get(isDebug);

  if ($isDebug) {
    checkMissingFields(item);
  }

  let newItem = clone(item) as any;

  if (utilsExists("overrideItem")) {
    newItem = $gameUtils.overrideItem(newItem, instanceIndex);
  }

  if (newItem.id !== undefined) {
    newItem.id = newItem.id.replace("%index%", instanceIndex);
  }

  if (newItem.name !== undefined) {
    newItem.name = newItem.name.replace("%d", instanceIndex + 1);
  }

  if (utilsExists("overrideShift")) {
    shifts = $gameUtils.overrideShift(item, shifts);
  }

  if (newItem.offset !== undefined) {
    if (newItem.overrideShift) {
      const { parent, shift } = newItem.overrideShift;

      newItem.offset += getOverridedShift(shifts, parent, shift, instanceIndex);
    } else {
      newItem.offset += getShift(shifts);
    }
  }

  if (Array.isArray(newItem.planned)) {
    newItem.planned = getRegionArray(newItem.planned);
  }

  if (Array.isArray(newItem.hidden)) {
    newItem.hidden = getRegionArray(newItem.hidden);
  }

  if (newItem.type === "bitflags") {
    return parseBitflags(newItem, shifts);
  } else if (newItem.type === "checksum") {
    if (newItem.control !== undefined) {
      newItem.control.offsetStart =
        getShift(shifts) + newItem.control.offsetStart;
      newItem.control.offsetEnd = getShift(shifts) + newItem.control.offsetEnd;
    }

    if (options.checksumsDisabled) {
      newItem.disabled = true;
    }

    checksums.push(newItem as ItemChecksum);
  } else if (newItem.type === "component") {
    return parseComponent(newItem, shifts, instanceId, instanceIndex);
  } else if (newItem.type === "container") {
    return parseContainer(newItem, shifts, instanceId, instanceIndex, options);
  }

  if (newItem.disableTabIf) {
    newItem.disableTabIf = parseTabConditions(
      newItem.disableTabIf,
      shifts,
      instanceId,
      instanceIndex,
    );
  }

  if (newItem.items) {
    newItem.items = newItem.items.reduce((results: Item[], subitem: Item) => {
      const parsedItem = parseItem(
        subitem,
        shifts,
        instanceId,
        instanceIndex,
        options,
      );

      results.push(parsedItem);

      return results;
    }, []);
  }

  return newItem;
}

export function parseBitflags(item: ItemBitflags, shifts: number[]): any {
  const flags = item.flags.reduce((flags: ItemBitflag[], flag) => {
    flag.offset += getShift(shifts);

    if (Array.isArray(flag.hidden)) {
      flag.hidden = getRegionArray(flag.hidden);
    }

    flags.push(flag);

    return flags;
  }, []);

  const parsedItem: ItemBitflags = {
    ...item,
    flags,
  };

  return parsedItem;
}

export function parseComponent(
  item: ItemComponent,
  shifts: number[],
  instanceId: string,
  instanceIndex: number,
): any {
  let props = item.props || {};

  props = Object.entries(props).reduce(
    (results: { [key: string]: any }, [key, value]) => {
      results[key] = value === instanceId ? instanceIndex : value;

      return results;
    },
    {},
  );

  const parsedItem: ItemComponent = {
    ...item,
    props,
  };

  return parsedItem;
}

export function parseContainer(
  item: ItemContainer,
  shifts: number[],
  instanceId: string,
  instanceIndex: number,
  options: ParseItemOptions,
): any {
  const $gameTemplate = get(gameTemplate);
  const $gameUtils = get(gameUtils) as any;

  if (!instanceId && item.instanceId) {
    instanceId = item.instanceId;
  }

  const parsedItem: any = {
    id: item.id,
    type: item.instanceType,
    enumeration: item.enumeration,
    resource: item.resource,
    resourceOrder: item.resourceOrder,
    vertical: item.vertical,
    items: [],
  };

  if (item.pointer !== undefined) {
    let pointer = item.pointer;

    if (Array.isArray(item.pointer)) {
      pointer = getRegionArray(item.pointer);
    }

    if (utilsExists("pointerToOffset")) {
      shifts = [$gameUtils.pointerToOffset(pointer)];
    } else {
      shifts = [getInt(pointer as number, (item as any).pointerDataType)];
    }
  }

  if (item.instanceType === "tabs" && item.prependSubinstance) {
    item.prependSubinstance.forEach((subitem: any) => {
      parsedItem.items.push({
        name: subitem.name,
        vertical: subitem.vertical,
        items: subitem.items
          ? subitem.items.reduce((results: any, subitem: any) => {
              const parsedItem = parseItem(
                subitem,
                shifts,
                instanceId,
                instanceIndex,
                options,
              );

              results.push(parsedItem);

              return results;
            }, [])
          : [],
      });
    });
  }

  [...Array(item.instances).keys()].forEach((index: any) => {
    let instanceShifts: number[] = [];

    let isOverrided = false;

    if (utilsExists("overrideParseContainerItemsShifts")) {
      [isOverrided, instanceShifts] =
        $gameUtils.overrideParseContainerItemsShifts(item, shifts, index);
    }

    if (!isOverrided) {
      instanceShifts = [...shifts, item.length * index];
    }

    const disabled = getShift(instanceShifts) === -1;

    const parsedSubitem: any = {
      flex: item.flex,
      noMargin: item.noMargin,
      disabled,
      items: item.items
        ? item.items.reduce((results: any, subitem: any) => {
            const parsedItem = parseItem(
              subitem,
              instanceShifts,
              instanceId,
              index,
              { checksumsDisabled: disabled },
            );

            results.push(parsedItem);

            return results;
          }, [])
        : [],
    };

    if (item.instanceType === "section") {
      if (item.enumeration) {
        parsedSubitem.name = item.enumeration.replace("%d", index + 1);
      } else if (
        item.resource &&
        $gameTemplate.resources &&
        $gameTemplate.resources[item.resource]
      ) {
        parsedSubitem.name = $gameTemplate.resources[item.resource][index];
      }

      parsedSubitem.type = "section";
    }

    if (item.instanceType === "tabs") {
      if (item.disableSubinstanceIf) {
        parsedSubitem.disableTabIf = parseTabConditions(
          item.disableSubinstanceIf,
          instanceShifts,
          instanceId,
          instanceIndex,
        );
      }
    }

    parsedItem.items.push(parsedSubitem);
  });

  if (item.instanceType === "tabs" && item.appendSubinstance) {
    item.appendSubinstance.forEach((subitem: any) => {
      parsedItem.items.push({
        name: subitem.name,
        vertical: subitem.vertical,
        items: subitem.items
          ? subitem.items.reduce((results: any, subitem: any) => {
              const parsedItem = parseItem(
                subitem,
                shifts,
                instanceId,
                instanceIndex,
                options,
              );

              results.push(parsedItem);

              return results;
            }, [])
          : [],
      });
    });
  }

  return parsedItem;
}

function parseTabConditions(
  condition: ItemIntCondition | LogicalOperator<ItemIntCondition> | string,
  shifts: number[],
  instanceId: string,
  instanceIndex: number,
): string | Item | { [x: string]: Item[] } {
  let parsedCondition;

  if (typeof condition === "string") {
    parsedCondition = condition;
  } else if ("$and" in condition || "$or" in condition) {
    const operand = getObjKey(condition, 0) as "$and" | "$or";

    const parsedItems = condition[operand]!.map((subitem) =>
      parseItem(subitem as Item, shifts, instanceId, instanceIndex),
    );

    parsedCondition = { [operand]: parsedItems };
  } else {
    parsedCondition = parseItem(
      condition as ItemIntCondition,
      shifts,
      instanceId,
      instanceIndex,
    );
  }

  return parsedCondition;
}

export function checkMissingFields(item: Item): void {
  const $isDebug = get(isDebug);

  const errors = [];

  if (
    item.type &&
    ![
      "bitflags",
      "component",
      "container",
      "group",
      "section",
      "tabs",
    ].includes(item.type) &&
    (item as any).offset === undefined
  ) {
    errors.push("offset");
  }

  if (
    ["container", "group", "section", "tabs"].includes(item.type) &&
    (item as any).items === undefined
  ) {
    errors.push("items");
  }

  if (item.type === "bitflags" && item.flags === undefined) {
    errors.push("flags");
  }

  if (item.type === "checksum" && item.control.offsetStart === undefined) {
    errors.push("control.offsetStart");
  }

  if (item.type === "checksum" && item.control.offsetEnd === undefined) {
    errors.push("control.offsetEnd");
  }

  if (
    ["checksum", "variable"].includes(item.type) &&
    (item as any).dataType === undefined
  ) {
    errors.push("dataType");
  }

  if (item.type === "component" && item.component === undefined) {
    errors.push("component");
  }

  if (item.type === "container" && item.length === undefined) {
    errors.push("length");
  }

  if (item.type === "container" && item.instances === undefined) {
    errors.push("instances");
  }

  if (item.type === "container" && item.instanceType === undefined) {
    errors.push("instanceType");
  }

  if (
    item.type === "variable" &&
    item.dataType === "string" &&
    item.length === undefined
  ) {
    errors.push("length");
  }

  if (
    item.type === "variable" &&
    item.dataType === "string" &&
    item.letterDataType === undefined
  ) {
    errors.push("letterDataType");
  }

  if ($isDebug) {
    errors.forEach((error) => {
      console.warn(
        `${(item as any).name || item.type} is '${
          item.type
        }' type but missing the '${error}' field`,
      );
    });
  }
}

export function getItem(
  id: string,
  items: Item[] | undefined = undefined,
): Item | undefined {
  const $gameJson = get(gameJson);
  const $gameTemplate = get(gameTemplate);

  if (items) {
    return items.reduce((result: Item | undefined, item: Item) => {
      if ("id" in item && item.id === id) {
        return item;
      } else if ("items" in item) {
        const found = getItem(id, item.items as Item[]);

        if (found) {
          return found;
        }
      }

      return result;
    }, undefined);
  } else {
    return getItem(id, $gameJson.items || $gameTemplate.items);
  }
}

export function getResource(
  key = "",
  filterRegion = false,
): Resource | undefined {
  const $gameJson = get(gameJson);
  const $gameRegion = get(gameRegion);

  let resource = key ? $gameJson.resources?.[key] : undefined;

  if (resource) {
    if (filterRegion && Array.isArray(resource)) {
      resource = resource[$gameRegion];
    }

    return resource as Resource;
  }
}

export function updateResources(resource = ""): void {
  const $gameJson = get(gameJson);
  const $gameTemplate = get(gameTemplate);

  let resources = { ...$gameTemplate.resources };

  if (resource && $gameTemplate.resources?.[resource]) {
    if (typeof resources[resource] === "string") {
      const value = getUtils(resources[resource] as string);

      resources = {
        ...$gameJson.resources,
        [resource]: value,
      };
    }
  } else {
    resources = Object.entries(resources).reduce(
      (results: any, [key, value]) => {
        if (typeof value === "string") {
          value = getUtils(value as string);
        }

        results[key] = value;

        return results;
      },
      {},
    );
  }

  gameJson.set({ ...$gameJson, resources });
}
