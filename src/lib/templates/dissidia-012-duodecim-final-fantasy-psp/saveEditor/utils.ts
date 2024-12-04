import moment from "moment";
import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import { getInt, getString, setInt, setString } from "$lib/utils/bytes";
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
  artifactBonuses,
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
  { offset: 0x3d9bc, shift: -0x4 },
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
  } else if ("id" in item && item.id?.match(/artifactBonusValue-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift, "uint16");

    const bonus = artifactBonuses.find((bonus) => bonus.index === int);

    itemInt.disabled = !bonus?.name.match(/\+x|-x/);

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
  } else if ("id" in item && item.id?.match(/artifactBonus-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16");

    if (int === 0xffff) {
      return [true, 0x3];
    }
  } else if ("id" in item && item.id?.match(/artifactBonusValue-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "int16");

    if (itemInt.disabled) {
      return [true, 0x0];
    } else if (int < 0) {
      return [true, -int];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/artifactBonusValue-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift, "uint16");

    const bonus = artifactBonuses.find((bonus) => bonus.index === int);

    if (bonus?.name.match(/-x/)) {
      value = `-${value}`;
    }

    setInt(itemInt.offset, "uint16", value);

    return true;
  }

  return false;
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
  } else if ("id" in item && item.id?.match(/partySettingsName-/)) {
    updateResources("partySettings");
  } else if ("id" in item && item.id?.match(/partySettingsCharacter-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x8;

    let enabled = 0;
    let count = 0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      if (getInt(offset + i * 0x8, "uint16")) {
        enabled = 1;
        count += 1;
      }
    }

    setInt(offset - 0x20, "uint16", enabled);
    setInt(offset - 0x1e, "uint16", count);
  } else if ("id" in item && item.id?.match(/friendCardName-/)) {
    updateResources("friendCards");
  } else if ("id" in item && item.id?.match(/artifactItem-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint16");
    let count = getInt(artifaceCountOffset, "uint32");

    let id = index;

    if (int === 0xffff) {
      id = 0xffff;
    }

    if (int === 0xffff && index + 1 === count) {
      count -= 1;
    } else if (int !== 0xffff && index === count) {
      count += 1;
    }

    setInt(itemInt.offset - 0x2, "uint16", id);
    setInt(artifaceCountOffset, "uint32", count);
  } else if (
    "id" in item &&
    (item.id?.match(/artifactHeritorName-/) || item.id?.match(/artifactName-/))
  ) {
    const itemString = item as ItemString;

    const [, index] = item.id.splitInt();

    const offset = itemString.offset - index * 0x3c;
    const length = item.id?.match(/artifactName-/) ? 0x14 : 0x18;

    const referenceName = getString(itemString.offset, length, "uint16", {
      zeroTerminated: true,
    });

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const name = getString(offset + i * 0x3c, length, "uint16", {
        zeroTerminated: true,
      });

      if (name === "") {
        setString(offset + i * 0x3c, length, "uint16", referenceName, 0x0, {
          zeroTerminated: true,
        });
      }
    }

    updateResources("artifacts");
  } else if ("id" in item && item.id?.match(/artifactBonus-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint16");

    const bonus = artifactBonuses.find((bonus) => bonus.index === int);

    const offset = itemInt.offset + 0x4 + (index === 1 ? 0x2 : 0x0);

    let value = 0x7fff;

    if (bonus?.name.match(/\+x|-x/)) {
      value = 0x0;
    }

    setInt(offset, "uint16", bonus?.action || 0xffff);
    setInt(offset + 0x2, "uint16", value);
  } else if ("id" in item && item.id?.match(/ruleName-/)) {
    const itemString = item as ItemString;

    const name = getString(itemString.offset, 0x18, "uint16", {
      zeroTerminated: true,
    });

    let timestamp = 0x0;

    if (name !== "") {
      const year = moment().year();
      const month = moment().month() + 1;
      const day = moment().date();

      timestamp = (year << 0x14) | (month << 0x10) | (day * 0x800);
    }

    setInt(itemString.offset + 0x150, "uint32", timestamp);

    updateResources("rules");
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gameRegion = get(gameRegion);

  const offset = 0x1d080 + ($gameRegion === 1 ? 0x33c4 : 0x0);

  setInt(offset, "bit", 1, { bit: 2 });

  return $dataView.buffer;
}

export function onReset(): void {
  artifaceCountOffset = -1;
}

export function onCharacterChange(character: number): void {
  character += character >= 22 ? 2 : 1;

  const braveryAttackValues = getFilteredAbilityNames(character, 0);
  const hpAttackValues = getFilteredAbilityNames(character, 1);

  updateResources("braveryAttacks", braveryAttackValues);
  updateResources("hpAttacks", hpAttackValues);
}

export function getAbilityNames(): {
  [value: number]: string;
} {
  const names: { [value: number]: string } = {};

  abilities.forEach((ability) => {
    names[ability.index] = ability.name;
  });

  names[0xffff] = "-";

  return names;
}

export function getFilteredAbilityNames(
  character: number,
  type: number,
): {
  [value: number]: string;
} {
  const names: { [value: number]: string } = {};

  abilities.forEach((ability) => {
    if (ability.index >> 0x8 === character && ability.type === type) {
      names[ability.index & 0xff] = ability.name;
    }
  });

  names[0xff] = "-";

  return names;
}

export function getBraveryAttackNames(): { [value: number]: string } {
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

export function getArtifactNames(): Resource {
  const nameItem = getItem("artifactName-0-1") as ItemString;

  const names: Resource = {};

  if (nameItem) {
    for (let i = 0x0; i < 0x14; i += 0x1) {
      const offset = nameItem.offset + i * 0x138;

      names[i] = getString(offset, 0x18, "uint16", {
        zeroTerminated: true,
      });
    }
  }

  return names;
}

export function getArtifactBonusesNames(): { [value: number]: string } {
  const names: { [value: number]: string } = {};

  artifactBonuses.forEach((artifact) => {
    names[artifact.index] = artifact.name;
  });

  return names;
}

export function getItemNames(): { [value: number]: string } {
  const names: { [value: number]: string } = {};

  items.forEach((item) => {
    names[item.index] = item.name;
  });

  names[0xffff] = "-";

  return names;
}

export function getRuleNames(): Resource {
  const nameItem = getItem("ruleName-0") as ItemString;

  const names: Resource = {};

  if (nameItem) {
    for (let i = 0x0; i < 0x5; i += 0x1) {
      const offset = nameItem.offset + i * 0x154;

      names[i] = getString(offset, 0x18, "uint16", {
        zeroTerminated: true,
      });
    }
  }

  return names;
}

export function getItemResourceGroups(type: number | string): ResourceGroups {
  if (typeof type === "string") {
    return Object.entries(itemTypes).reduce(
      (groups: ResourceGroups, _, index) => {
        groups.push(...getItemResourceGroups(index));

        return groups;
      },
      [],
    );
  }

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

  const nameItem = getItem("friendCardName-0") as ItemString;

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

export function getPartySettingsNames(): Resource {
  const nameItem = getItem("partySettingsName-0") as ItemString;

  const names: Resource = {};

  if (nameItem) {
    for (let i = 0x0; i < 0x5; i += 0x1) {
      const offset = nameItem.offset + i * 0x48;

      names[i] = getString(offset, 0x18, "uint16", {
        zeroTerminated: true,
      });
    }
  }

  return names;
}

let artifaceCountOffset = -1;

export function isArtifactDisabled(index: number): boolean {
  // getItem function is resource hungry so we save the offset in a variable
  if (artifaceCountOffset === -1) {
    const artifactsCountItem = getItem("artifactsCount") as ItemInt;

    artifaceCountOffset = artifactsCountItem.offset;
  }

  const count = getInt(artifaceCountOffset, "uint32");

  if (index > count) {
    return true;
  }

  return false;
}
