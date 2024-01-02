import { get } from "svelte/store";

import {
  gameJson,
  gameRegion,
  gameTemplate,
  gameUtils,
  isDebug,
} from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import {
  clone,
  getRegionArray,
  getUtils,
  objGetKey,
  utilsExists,
} from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemComponent,
  ItemContainer,
} from "$lib/types";

let checksums: ItemChecksum[];

export function enrichGameJson(): void {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);
  const $gameUtils = get(gameUtils) as any;

  checksums = [];

  let steps: number[] = [];

  if (utilsExists("initSteps")) {
    steps = $gameUtils.initSteps($gameRegion);
  }

  const items = $gameTemplate.items.reduce((items: Item[], item) => {
    items.push(parseItem(item, steps));

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
}

export function getStep(steps: number[]) {
  return steps.reduce((total, step) => total + step, 0);
}

function getOverridedStep(
  steps: number[],
  parent: number,
  step: number,
  stepIndex: number,
) {
  const parentIndex = steps.length - parent;

  return steps.reduce((total, value, index) => {
    let newTotal = total;

    if (index < parentIndex) {
      newTotal += value;
    } else if (index === parentIndex) {
      newTotal += stepIndex * step;
    }

    return newTotal;
  }, 0);
}

export function parseItem(
  item: Item,
  steps: number[],
  instanceId = "",
  instanceIndex = 0,
): Item {
  const $gameUtils = get(gameUtils) as any;
  const $isDebug = get(isDebug);

  if ($isDebug) {
    checkMissingFields(item);
  }

  let newItem = clone(item);

  if (utilsExists("overrideItem")) {
    newItem = $gameUtils.overrideItem(newItem, instanceIndex);
  }

  if (Array.isArray(newItem)) {
    return newItem.map((obj) => {
      const key = objGetKey(obj, 0);

      const parsedItems = obj[key].map((subitem: Item) =>
        parseItem(subitem, steps, instanceId, instanceIndex),
      );

      return { [key]: parsedItems } as Item;
    });
  }

  if ((newItem as any).id !== undefined) {
    (newItem as any).id = (newItem as any).id.replace("%index%", instanceIndex);
  }

  if (utilsExists("overrideStep")) {
    steps = $gameUtils.overrideStep(item, steps);
  }

  if ((newItem as any).offset !== undefined) {
    if ((newItem as any).overrideStep) {
      const { parent, step } = (newItem as any).overrideStep;

      (newItem as any).offset += getOverridedStep(
        steps,
        parent,
        step,
        instanceIndex,
      );
    } else {
      (newItem as any).offset += getStep(steps);
    }
  }

  if (newItem.type === "bitflags") {
    return parseBitflags(newItem, steps);
  } else if (newItem.type === "checksum") {
    if (newItem.control.offset !== undefined) {
      newItem.control.offset = getStep(steps) + newItem.control.offset;
    }

    checksums.push(newItem as ItemChecksum);
  } else if (newItem.type === "component") {
    return parseComponent(newItem, steps, instanceId, instanceIndex);
  } else if (newItem.type === "container") {
    return parseContainer(newItem, steps, instanceId, instanceIndex);
  }

  if ((newItem as any).items) {
    (newItem as any).items = (newItem as any).items.reduce(
      (results: Item[], subitem: Item) => {
        const parsedItem = parseItem(subitem, steps, instanceId, instanceIndex);

        results.push(parsedItem);

        return results;
      },
      [],
    );
  }

  return newItem;
}

export function parseBitflags(item: ItemBitflags, steps: number[]): any {
  const flags = item.flags.reduce((flags: ItemBitflag[], flag) => {
    flag.offset += getStep(steps);

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
  steps: number[],
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
  steps: number[],
  instanceId: string,
  instanceIndex: number,
): any {
  const $gameUtils = get(gameUtils) as any;

  if (!instanceId && item.instanceId) {
    instanceId = item.instanceId;
  }

  const parsedItem: any = {
    id: item.id,
    type: item.instanceType,
    enumeration: item.enumeration,
    enumerationOrder: item.enumerationOrder,
    resource: item.resource,
    vertical: item.vertical,
    items: [],
  };

  if (item.pointer !== undefined) {
    let pointer = item.pointer;

    if (Array.isArray(item.pointer)) {
      pointer = getRegionArray(item.pointer);
    }

    if (utilsExists("pointerToOffset")) {
      steps = [$gameUtils.pointerToOffset(pointer)];
    } else {
      steps = [getInt(pointer as number, (item as any).pointerDataType)];
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
                steps,
                instanceId,
                instanceIndex,
              );

              results.push(parsedItem);

              return results;
            }, [])
          : [],
      });
    });
  }

  [...Array(item.instances).keys()].forEach((index: any) => {
    let instanceSteps: number[] = [];

    let isOverrided = false;

    if (utilsExists("overrideParseContainerItemsSteps")) {
      [isOverrided, instanceSteps] =
        $gameUtils.overrideParseContainerItemsSteps(item, steps, index);
    }

    if (!isOverrided) {
      instanceSteps = [...steps, item.length * index];
    }

    const parsedSubitem: any = {
      flex: item.flex,
      items: item.items
        ? item.items.reduce((results: any, subitem: any) => {
            const parsedItem = parseItem(
              subitem,
              instanceSteps,
              instanceId,
              index,
            );

            results.push(parsedItem);

            return results;
          }, [])
        : [],
    };

    if (item.instanceType === "section") {
      if (item.enumeration) {
        parsedSubitem.name = item.enumeration.replace("%d", index + 1);
      }

      parsedSubitem.type = "section";
    }

    if (item.disableSubinstanceIf) {
      let disableSubinstanceIf;

      if (typeof item.disableSubinstanceIf === "string") {
        disableSubinstanceIf = item.disableSubinstanceIf;
      } else {
        disableSubinstanceIf = parseItem(
          item.disableSubinstanceIf,
          instanceSteps,
          instanceId,
          instanceIndex,
        );
      }

      if (item.instanceType === "tabs") {
        parsedSubitem.disableTabIf = disableSubinstanceIf;
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
                steps,
                instanceId,
                instanceIndex,
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

  if (item.type === "checksum" && item.control.offset === undefined) {
    errors.push("control.offset");
  }

  if (item.type === "checksum" && item.control.length === undefined) {
    errors.push("control.length");
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
    return getItem(id, $gameJson.items);
  }
}

export function updateResources(resource = ""): void {
  const $gameJson = get(gameJson);
  const $gameTemplate = get(gameTemplate);

  let resources = { ...$gameTemplate.resources };

  if (
    resource &&
    $gameTemplate.resources &&
    $gameTemplate.resources[resource]
  ) {
    if (typeof resources[resource] === "string") {
      const value = getUtils(resources[resource] as string);

      resources[resource] = value;
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
