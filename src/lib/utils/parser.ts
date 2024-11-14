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

interface ItemParent {
  id: string;
  index: number;
}

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
  parents: ItemParent[] = [],
  options: ParseItemOptions = {},
): Item {
  const $gameUtils = get(gameUtils) as any;
  const $isDebug = get(isDebug);

  if ($isDebug) {
    checkMissingFields(item);
  }

  let newItem = clone(item) as any;

  let instanceIndex = 0;

  if (parents.length > 0) {
    instanceIndex = parents[parents.length - 1].index;
  }

  if (utilsExists("overrideParseItem")) {
    newItem = $gameUtils.overrideParseItem(newItem, instanceIndex);
  }

  if (newItem.id !== undefined) {
    let parentIndex = 0;

    if (newItem.id.match(/%parent%/)) {
      if (parents.length > 0) {
        parentIndex = parents[parents.length - 2].index;
      }
    }

    newItem.id = newItem.id
      .replace("%parent%", parentIndex)
      .replace("%index%", instanceIndex);
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
      newItem.control.offsetStart += getShift(shifts);
      newItem.control.offsetEnd += getShift(shifts);
    }

    if (options.checksumsDisabled) {
      newItem.disabled = true;
    }

    checksums.push(newItem as ItemChecksum);
  } else if (newItem.type === "component") {
    return parseComponent(newItem, shifts, parents);
  } else if (newItem.type === "container") {
    return parseContainer(newItem, shifts, parents, options);
  }

  if (newItem.disableTabIf) {
    newItem.disableTabIf = parseConditions(
      newItem.disableTabIf,
      shifts,
      parents,
    );
  }

  if (newItem.items) {
    newItem.items = newItem.items.reduce((results: Item[], subitem: Item) => {
      const parsedItem = parseItem(subitem, shifts, parents, options);

      results.push(parsedItem);

      return results;
    }, []);
  }

  return newItem;
}

export function parseBitflags(
  item: ItemBitflags,
  shifts: number[],
): ItemBitflags {
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
  parents: ItemParent[],
): any {
  let props = item.props || {};

  props = Object.entries(props).reduce(
    (results: { [key: string]: any }, [key, value]) => {
      const instance = parents.find((parent) => parent.id === value);

      results[key] = instance !== undefined ? instance.index : value;

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

function parseConditions(
  condition: ItemIntCondition | LogicalOperator<ItemIntCondition> | string,
  shifts: number[],
  parents: ItemParent[],
): string | Item | { [x: string]: Item[] } {
  let parsedCondition;

  if (typeof condition === "string") {
    parsedCondition = condition;
  } else if ("$and" in condition || "$or" in condition) {
    const operand = getObjKey(condition, 0) as "$and" | "$or";

    const parsedItems = condition[operand]!.map((subitem) =>
      parseItem(subitem as Item, shifts, parents),
    );

    parsedCondition = { [operand]: parsedItems };
  } else {
    parsedCondition = parseItem(condition as ItemIntCondition, shifts, parents);
  }

  return parsedCondition;
}

export function parseContainer(
  item: ItemContainer,
  shifts: number[],
  parents: ItemParent[],
  options: ParseItemOptions,
): any {
  const $gameTemplate = get(gameTemplate);
  const $gameUtils = get(gameUtils) as any;

  const parsedItem: any = {
    id: item.id,
    type: item.instanceType,
    enumeration: item.enumeration,
    resource: item.resource,
    resourceOrder: item.resourceOrder,
    indexes: item.indexes,
    vertical: item.vertical,
    onTabChange: item.onTabChange,
    hidden: item.hidden,
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
        items: subitem.items
          ? subitem.items.reduce((results: any, subitem: any) => {
              const parsedItem = parseItem(subitem, shifts, parents, options);

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
            const itemParents = [
              ...parents,
              { id: item.instanceId || "", index: index },
            ];

            const parsedItem = parseItem(subitem, instanceShifts, itemParents, {
              checksumsDisabled: disabled,
            });

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
        parsedSubitem.disableTabIf = parseConditions(
          item.disableSubinstanceIf,
          instanceShifts,
          parents,
        );
      }
    }

    parsedItem.items.push(parsedSubitem);
  });

  if (item.instanceType === "tabs" && item.appendSubinstance) {
    item.appendSubinstance.forEach((subitem: any) => {
      parsedItem.items.push({
        name: subitem.name,
        items: subitem.items
          ? subitem.items.reduce((results: any, subitem: any) => {
              const parsedItem = parseItem(subitem, shifts, parents, options);

              results.push(parsedItem);

              return results;
            }, [])
          : [],
      });
    });
  }

  return parsedItem;
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
      if (result) {
        return result;
      }

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

export function updateResources(
  resource = "",
  overrideValues?: {
    [value: number]: string;
  },
): void {
  const $gameJson = get(gameJson);
  const $gameTemplate = get(gameTemplate);

  let resources = { ...$gameTemplate.resources };

  if (resource && $gameTemplate.resources?.[resource]) {
    if (overrideValues) {
      resources = {
        ...$gameJson.resources,
        [resource]: overrideValues,
      };
    } else if (typeof resources[resource] === "string") {
      const values = getUtils(resources[resource] as string);

      resources = {
        ...$gameJson.resources,
        [resource]: values,
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
