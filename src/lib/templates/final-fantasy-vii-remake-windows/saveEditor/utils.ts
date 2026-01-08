import { get } from "svelte/store";

import { fileName, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemInt,
  ItemSection,
  ItemTab,
  ItemTabs,
  Resource,
  ResourceGroups,
} from "$lib/types";

import {
  characterLevels,
  itemCategories,
  itemList,
  materiaList,
  materiaTypes,
  weaponList,
} from "./utils/resource";

export function overrideParseItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id === "mainStoryOnly") {
    const itemSection = item as ItemSection | ItemTab;

    if (getMode() === 2) {
      itemSection.hidden = true;
    }

    return itemSection;
  } else if ("id" in item && item.id === "interMissionOnly") {
    const itemSection = item as ItemSection | ItemTab;

    if (getMode() === 1) {
      itemSection.hidden = true;
    }

    return itemSection;
  } else if ("id" in item && item.id?.match(/enemyIntel-/)) {
    const itemTabs = item as ItemTabs;

    const [index] = item.id.splitInt();

    if (index === 1 && getMode() === 1) {
      itemTabs.hidden = true;
    } else if (index !== 1 && getMode() === 2) {
      itemTabs.hidden = true;
    }

    return itemTabs;
  } else if ("id" in item && item.id?.match(/challenge-/)) {
    const itemTab = item as ItemTab;

    const [index] = item.id.splitInt();

    if (index === 2 && getMode() === 1) {
      itemTab.hidden = true;
    } else if (index !== 2 && getMode() === 2) {
      itemTab.hidden = true;
    }

    return itemTab;
  }

  return item;
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("id" in item && item.id?.match(/abilities-/)) {
    return shifts.slice(0, -1);
  }

  return shifts;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "yuffieOutfit") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset + 0x2a5, "bit", { bit: 0 });

    itemInt.disabled = int === 0x0;

    return itemInt;
  } else if ("id" in item && item.id?.match(/abilities-/)) {
    const itemBitflags = item as ItemBitflags;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemBitflags.hidden = targetedCharacter !== characterIndex;

    return itemBitflags;
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset + 0x4, "uint32");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.length : 1;
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0x4, "uint32");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.at(-1) : 0;
  } else if ("id" in item && item.id?.match(/proficiency-/)) {
    const itemInt = item as ItemInt;

    const weaponItem = getItem(
      item.id.replace("proficiency", "weapon"),
    ) as ItemInt;

    const weaponIndex = getInt(weaponItem.offset, "uint32");

    const weapon = weaponList.find((weapon) => weapon.index === weaponIndex);

    itemInt.hidden = weapon?.proficiencyIndex === undefined;
  } else if ("id" in item && item.id === "itemQuantity") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x4, "uint32");

    if (int === 0x14) {
      itemInt.max = undefined;
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "gil") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0x800; i += 0x1) {
      const item = getInt(itemInt.offset + i * 0x18, "uint32");

      if (item === 0x14) {
        int = getInt(itemInt.offset + i * 0x18 + 0x4, "uint32");

        return [true, int];
      }
    }

    return [true, int];
  } else if ("id" in item && item.id === "outfit") {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0; i < 3; i += 1) {
      const offset = itemInt.offset + (itemInt.bit! + i > 7 ? 0x1 : 0x0);
      const bit = (itemInt.bit! + i) % 8;

      if (getInt(offset, "bit", { bit })) {
        int = i + 1;
      }
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/proficiency-/)) {
    const itemInt = item as ItemInt;

    const weaponItem = getItem(
      item.id.replace("proficiency", "weapon"),
    ) as ItemInt;

    const weaponIndex = getInt(weaponItem.offset, "uint32");

    const weapon = weaponList.find((weapon) => weapon.index === weaponIndex);

    let int = 0;

    if (weapon?.proficiencyIndex !== undefined) {
      int = getInt(itemInt.offset + weapon.proficiencyIndex * 0x2, "uint16");
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/characterWeaponMateria-/)) {
    const itemInt = item as ItemInt;

    const equippedWeaponItem = getItem(
      item.id.replace("characterWeaponMateria", "equippedWeapon"),
    ) as ItemInt;

    const equippedWeapon = getInt(equippedWeaponItem.offset, "uint32");

    const int = getInt(itemInt.offset + equippedWeapon * 0x30, "uint32");

    return [true, int];
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    if (int === 0x7fffffff) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "gil") {
    const itemInt = item as ItemInt;

    for (let i = 0x0; i < 0x800; i += 0x1) {
      const item = getInt(itemInt.offset + i * 0x18, "uint32");

      if (item === 0x14) {
        setInt(itemInt.offset + i * 0x18 + 0x4, "uint32", value);

        return true;
      }
    }

    return true;
  } else if ("id" in item && item.id === "outfit") {
    const itemInt = item as ItemInt;

    for (let i = 0; i < 3; i += 1) {
      const offset = itemInt.offset + (itemInt.bit! + i > 7 ? 0x1 : 0x0);
      const bit = (itemInt.bit! + i) % 8;
      const int = i + 1 === parseInt(value) ? 1 : 0;

      setInt(offset, "bit", int, { bit });
    }

    return true;
  } else if ("id" in item && item.id?.match(/characterWeaponMateria-/)) {
    const itemInt = item as ItemInt;

    const equippedWeaponItem = getItem(
      item.id.replace("characterWeaponMateria", "equippedWeapon"),
    ) as ItemInt;

    const equippedWeapon = getInt(equippedWeaponItem.offset, "uint32");

    setInt(itemInt.offset + equippedWeapon * 0x30, "uint32", value);

    return true;
  } else if ("id" in item && item.id?.match(/proficiency-/)) {
    const itemInt = item as ItemInt;

    const weaponItem = getItem(
      item.id.replace("proficiency", "weapon"),
    ) as ItemInt;

    const weaponIndex = getInt(weaponItem.offset, "uint32");

    const weapon = weaponList.find((weapon) => weapon.index === weaponIndex);

    if (weapon?.proficiencyIndex !== undefined) {
      setInt(itemInt.offset + weapon.proficiencyIndex * 0x2, "uint16", value);

      return true;
    }
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    if (int === 0x7fffffff) {
      setInt(itemInt.offset, "uint32", 0x0);
    }
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/characterLevel-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    const characterCurve = characterLevels[characterIndex];

    const level = getInt(itemInt.offset, "uint8");
    const experience = characterCurve[level - 2] || 0;

    setInt(itemInt.offset + 0x20, "uint32", experience);
  } else if ("id" in item && item.id?.match(/characterExperience-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    const characterCurve = characterLevels[characterIndex];

    const experience = getInt(itemInt.offset, "uint32");

    let level = 1;

    for (let i = 0; i < characterCurve.length; i += 1) {
      if (
        experience >= characterCurve[i] &&
        (!characterCurve[i + 1] || experience < characterCurve[i + 1])
      ) {
        level += i + 1;
      }
    }

    setInt(itemInt.offset - 0x20, "uint8", level);
  } else if ("id" in item && item.id?.match(/materia-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const materiaIndex = getInt(itemInt.offset, "uint32");

    let value = index + 1;

    if (!materiaIndex) {
      value = 0;
    }

    setInt(itemInt.offset - 0x4, "uint8", 1);
    setInt(itemInt.offset + 0x4, "uint32", 0);
    setInt(itemInt.offset + 0x14, "uint32", value);

    updateResources("inventoryMateriaNames");
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset + 0x4, "uint32");
    const level = getInt(itemInt.offset, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    let ap = 0;

    if (materia) {
      ap = materia.ap[level - 1];
    }

    setInt(itemInt.offset + 0x8, "uint32", ap);
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0x4, "uint32");
    const ap = getInt(itemInt.offset, "uint32");

    const materia = materiaList.find((materia) => materia.index === index);

    let level = 1;

    if (materia) {
      for (let i = 0; i < materia.ap.length; i += 1) {
        if (
          ap >= materia.ap[i] &&
          (!materia.ap[i + 1] || ap < materia.ap[i + 1])
        ) {
          level = i + 1;
        }
      }
    }

    setInt(itemInt.offset - 0x8, "uint8", level);
  } else if ("id" in item && item.id === "equippedBy") {
    updateResources("inventoryMateriaNames");
  } else if ("id" in item && item.id?.match(/weapon-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const weaponIndex = getInt(itemInt.offset, "uint32") || 0xffffffff;
    const materiaSet = weaponIndex !== 0xffffffff ? index + 8 : 0xffffffff;

    setInt(itemInt.offset + 0x4, "uint32", materiaSet);
    setInt(itemInt.offset + 0x40014 + index * 0x20, "uint32", weaponIndex);

    updateResources("inventoryWeaponNames");
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint32");

    let quantity = getInt(itemInt.offset + 0x4, "uint32");

    if (itemIndex !== 0xffffffff && quantity === 0) {
      quantity = 1;
    } else if (itemIndex === 0xffffffff) {
      quantity = 0;
    }

    const type = itemList.find((item) => item.index === itemIndex)?.type;

    setInt(itemInt.offset + 0x4, "uint32", quantity);
    setInt(itemInt.offset + 0x8, "uint32", type || 0x0);

    updateResources("accessories");
    updateResources("armors");
    updateResources("inventoryItemNames");
  } else if ("id" in item && item.id === "battleIntelCompleted") {
    const itemBitflags = item as ItemBitflags;

    const index = itemBitflags.flags.findIndex(
      (f) => f.offset === flag.offset && f.bit === flag.bit,
    );

    if ([4, 9, 14, 19].includes(index)) {
      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      const vrMissionsItem = getItem("vrMissions") as ItemBitflags;

      const vrFlagIndex = (index + 1) / 5 - 1;
      const vrFlag = vrMissionsItem.flags[vrFlagIndex];

      setInt(vrFlag.offset, "bit", checked, { bit: vrFlag.bit });
    }
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const [recordIndex, index] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint32");

    // Set negative Completion Time if needed

    if (int === 0x0) {
      setInt(itemInt.offset, "uint32", 0x7fffffff);
    }

    // Set Difficulty Progression

    let offset = itemInt.offset;

    if (index !== 4) {
      offset -= 0x4 * (index + 1);
    } else {
      offset -= 0x20;
    }

    setInt(offset, "bit", int > 0 ? 1 : 0, { bit: index + 1 });

    // Set Challenge Progression

    const progressionItem = getItem(
      `challengeProgression-${recordIndex}`,
    ) as ItemInt;

    const challengeCompleted = getInt(offset, "uint8", {
      binary: { bitStart: 1, bitLength: 5 },
    });

    setInt(progressionItem.offset, "bit", challengeCompleted, {
      bit: progressionItem.bit,
    });

    // Set Completed Difficulty

    let completedDifficulty = 0x5;
    let bestTime = 0x7fffffff;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const timeOffset = offset + (i === 0x4 ? 0x20 : 0x4 * (i + 1));
      const time = getInt(timeOffset, "uint32");

      if (time < bestTime) {
        completedDifficulty = i;
        bestTime = time;
      }
    }

    setInt(offset + 0x1, "uint8", completedDifficulty);
  }
}

function getMode(): number {
  const $fileName = get(fileName);
  const $gameTemplate = get(gameTemplate);

  return $fileName.match($gameTemplate.validator.fileNames![0]) ? 1 : 2;
}

export function getItemNames(): Resource {
  const names: Resource = {};

  const mode = getMode();

  itemList
    .filter((item) => item.mode === 0 || item.mode === mode)
    .forEach((item) => {
      names[item.index] = item.name;
    });

  names[0xffffffff] = "-";

  return names;
}

export function getItemResourceGroups(): ResourceGroups {
  return itemCategories.reduce((groups: ResourceGroups, category) => {
    groups.push({
      name: category.name,
      options: itemList
        .filter((item) => item.category === category.index)
        .map((item) => item.index),
    });

    return groups;
  }, []);
}

export function getInventoryNames(itemType: number): Resource {
  const names: Resource = {};

  const itemItem = getItem("item-0") as ItemInt;

  const items = getItemNames() as Resource;

  for (let i = 0x0; i < 0x3e8; i += 0x1) {
    const index = getInt(itemItem.offset + i * 0x18, "uint32");

    const type = itemList.find((item) => item.index === index)?.type;

    if (type === itemType) {
      names[i] = items[index];
    }
  }

  names[0xffffffff] = "-";

  return names;
}

export function getInventoryItemNames(): Resource {
  const names: Resource = {};

  const itemItem = getItem("item-0") as ItemInt;

  const items = getItemNames() as Resource;

  for (let i = 0x0; i < 0x3e8; i += 0x1) {
    const index = getInt(itemItem.offset + i * 0x18, "uint32");

    if (index !== 0xffffffff) {
      names[i] = items[index];
    }
  }

  return names;
}

export function getInventoryMateriaNames(type: string): Resource {
  const names: Resource = {};

  const materiaItem = getItem("materia-0") as ItemInt;

  const materias = getResource("materias") as Resource;
  const characters = getResource("characters") as Resource;

  for (let i = 0x0; i < 0x3e8; i += 0x1) {
    const materia = getInt(materiaItem.offset + i * 0x20, "uint32");
    const character = getInt(materiaItem.offset + i * 0x20 - 0x3, "uint8");
    const isSummon = materia >= 0x36b1 && materia <= 0x36ba;

    if (materia && (!type || (type === "summons" && isSummon))) {
      names[i] =
        `${materias[materia]}${character !== 0x9 ? ` (${characters[character][0]})` : ""}`;
    }
  }

  names[0xffffffff] = "-";

  return names;
}

export function getMateriaResourceGroups(): ResourceGroups {
  return materiaTypes.reduce((groups: ResourceGroups, type) => {
    groups.push({
      name: type.name,
      options: materiaList
        .filter((materia) => materia.type === type.index)
        .map((materia) => materia.index),
    });

    return groups;
  }, []);
}

export function getInventoryWeaponNames(): Resource {
  const names: Resource = {};

  const weaponItem = getItem("weapon-0") as ItemInt;

  const weapons = getResource("weapons") as Resource;

  for (let i = 0x0; i < 0x80; i += 0x1) {
    const index = getInt(weaponItem.offset + i * 0x10, "uint32");

    if (index !== 0x0) {
      names[i] = weapons[index];
    }
  }

  names[0xffffffff] = "-";

  return names;
}
