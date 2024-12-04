import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { getItem, updateResources } from "$lib/utils/parser";

import {
  Item,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
  ResourceGroups,
} from "$lib/types";

import {
  abilities,
  abilityTypes,
  accessories,
  accessoryTypes,
  items,
  itemTypes,
} from "./utils/resource";

const shifts = [
  { offset: 0x50, shift: 0x76c },
  { offset: 0xe7d8, shift: 0x1668 },
  { offset: 0x1cef0, shift: 0x15f0 },
  { offset: 0x1efb4, shift: -0x48 },
  { offset: 0x1f0a8, shift: -0x48 },
  { offset: 0x38164, shift: -0x6c0 },
];

function getShift(offset: number): number {
  return shifts.reduce((shift, item) => {
    if (offset >= item.offset) {
      shift += item.shift;
    }

    return shift;
  }, 0x0);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ($gameRegion === 1) {
    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        flag.offset += getShift(flag.offset);
      });
    } else if ("offset" in item && item.offset) {
      item.offset += getShift(item.offset);
    }
  }

  if ("id" in item && item.id === "friendCards") {
    const itemContainer = item as ItemContainer;

    const friendCardsCountItem = getItem("friendCardsCount") as ItemInt;

    const offset =
      friendCardsCountItem.offset + ($gameRegion === 1 ? 0x2c74 : 0x0);

    const instances = getInt(offset, "uint32");

    itemContainer.instances = instances;
  } else if (
    "id" in item &&
    item.id === "friendCardMessage" &&
    $gameRegion === 1
  ) {
    const itemString = item as ItemString;

    itemString.length = 0x50;

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "party" && $gameRegion === 1) {
    if (index > 21) {
      index += 1;
    }

    return [true, [...shifts, index * 0x778]];
  } else if ("id" in item && item.id === "friendCards" && $gameRegion === 1) {
    return [true, [...shifts, index * 0x1060]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "abilityAp") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16");

    itemInt.max = abilities[int].ap;

    return itemInt;
  } else if ("id" in item && item.id?.match(/accessory-/)) {
    const itemInt = item as ItemInt;

    const [set, index] = item.id.splitInt();

    const int = getInt(
      itemInt.offset + 0x6c3 - set * 0xc6 - index * 0x2,
      "uint8",
    );

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset - (index + 0x1) * 0x4, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/accessory-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0xffff];
    }
  } else if ("id" in item && item.id?.match(/skill-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0xffffffff];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "ability") {
    const itemInt = item as ItemInt;

    setInt(itemInt.offset + 0x2, "uint16", 0x0);
  } else if ("id" in item && item.id === "assist") {
    const itemInt = item as ItemInt;

    let int = 0;

    const value = getInt(itemInt.offset, "uint8");

    if (value !== 0xff) {
      int = 1;
    }

    setInt(itemInt.offset + 0x1, "uint8", int);
  } else if ("id" in item && item.id?.match(/reserve-/)) {
    const itemInt = item as ItemInt;

    let [order] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint8");

    if (int === 0xff) {
      order = 0;
    }

    setInt(itemInt.offset + 0x1, "uint8", order);
  } else if ("id" in item && item.id?.match(/friendCardName-/)) {
    updateResources("friendCardNames");
  }
}

export function getAbilityNames(): { [value: number]: string } {
  const names: { [value: number]: string } = {};

  abilities.forEach((ability) => {
    names[ability.index] = ability.name;
  });

  names[0xffff] = "-";

  return names;
}

export function getAccessoryNames(): { [value: number]: string } {
  const names: { [value: number]: string } = {};

  accessories.forEach((accessory) => {
    names[accessory.index] = accessory.name;
  });

  names[0xffff] = "-";

  return names;
}

function getItemResourceGroups(type: number): ResourceGroups {
  return itemTypes[type].subtypes.reduce((groups: ResourceGroups, subtype) => {
    groups.push({
      name: subtype.name,
      options: items
        .filter((item) => item.type === subtype.index)
        .map((item) => item.index),
    });

    return groups;
  }, []);
}

export function getAbilityResourceGroups(): ResourceGroups {
  return abilityTypes.reduce((groups: ResourceGroups, type) => {
    groups.push({
      name: type.name,
      options: abilities
        .filter((ability) => ability.type === type.index)
        .map((ability) => ability.index),
    });

    return groups;
  }, []);
}

export function getAccessoryResourceGroups(): ResourceGroups {
  return accessoryTypes.reduce((groups: ResourceGroups, type) => {
    groups.push({
      name: type.name,
      options: accessories
        .filter((accessory) => accessory.type === type.index)
        .map((accessory) => accessory.index),
    });

    return groups;
  }, []);
}

export function getArmgearResourceGroups(): ResourceGroups {
  return getItemResourceGroups(1);
}

export function getBodywearResourceGroups(): ResourceGroups {
  return getItemResourceGroups(3);
}

export function getHeadgearResourceGroups(): ResourceGroups {
  return getItemResourceGroups(2);
}

export function getWeaponResourceGroups(): ResourceGroups {
  return getItemResourceGroups(0);
}

export function getFriendCardNames(): Resource {
  const $gameRegion = get(gameRegion);

  const nameItem = getItem("friendCardName-0") as ItemInt;

  const names: Resource = {};

  if (nameItem) {
    for (let i = 0x0; i < 0x19; i += 0x1) {
      const offset =
        nameItem.offset + i * ($gameRegion === 1 ? 0x1060 : 0x10a8);

      names[i] = getString(offset, 0x18, "uint16", {
        zeroTerminated: true,
      });
    }
  }

  return names;
}
