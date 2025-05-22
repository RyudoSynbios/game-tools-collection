import { getInt, setInt } from "$lib/utils/bytes";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import {
  Item,
  ItemInt,
  ItemSection,
  Resource,
  ResourceGroups,
} from "$lib/types";

import {
  characterLevels,
  itemList,
  itemTypes,
  materiaList,
  materiaTypes,
  outfits,
} from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/relationship-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.hidden = ![1, 2, 3, 4, 5].includes(index);

    return itemInt;
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
  if ("id" in item && item.id?.match(/abilities-/)) {
    const itemSection = item as ItemSection;

    const [targetedCharacter, characterIndex] = item.id.splitInt();

    itemSection.hidden = targetedCharacter !== characterIndex;

    return itemSection;
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0xc, "uint32");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.length : 1;
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0x4, "uint32");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.at(-1) : 0;
  } else if ("id" in item && item.id === "itemQuantity") {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0xa, "uint8");

    if (type === 0x8) {
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
      const item = getInt(itemInt.offset + i * 0x20, "uint32");

      if (item === 0x1) {
        int = getInt(itemInt.offset + i * 0x20 + 0x4, "uint32");

        return [true, int];
      }
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/outfit-/)) {
    const [, character] = item.id.split("-");

    let int = 0;

    outfits[character].some((outfit) => {
      const flag = getInt(outfit.offset, "bit", { bit: outfit.bit });

      if (flag) {
        int = outfit.index;
        return true;
      }
    });

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
      const item = getInt(itemInt.offset + i * 0x20, "uint32");

      if (item === 0x1) {
        setInt(itemInt.offset + i * 0x20 + 0x4, "uint32", value);

        return true;
      }
    }

    return true;
  } else if ("id" in item && item.id?.match(/outfit-/)) {
    const [, character] = item.id.split("-");

    const outfit = outfits[character].find(
      (outfit) => outfit.index === parseInt(value),
    );

    outfits[character].forEach((outfit) => {
      setInt(outfit.offset, "bit", 0, { bit: outfit.bit });
    });

    if (outfit) {
      setInt(outfit.offset, "bit", 1, { bit: outfit.bit });
    }

    return true;
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    if (int === 0x7fffffff) {
      setInt(itemInt.offset, "uint32", 0x0);
    }
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "characterLevel") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");
    const experience = characterLevels[level - 15] || characterLevels[0];

    setInt(itemInt.offset + 0x20, "uint32", experience);
  } else if ("id" in item && item.id === "characterExperience") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 15;

    for (let i = 0; i < Object.values(characterLevels).length; i += 1) {
      if (
        experience >= characterLevels[i] &&
        (!characterLevels[i + 1] || experience < characterLevels[i + 1])
      ) {
        level += i;
      }
    }

    setInt(itemInt.offset - 0x20, "uint8", level);
  } else if ("id" in item && item.id?.match(/materia-/)) {
    const itemInt = item as ItemInt;

    const materiaIndex = getInt(itemInt.offset, "uint32");

    const detailsOffset = itemInt.offset - 0x5f004;

    let type = 0x6;
    let id = getInt(detailsOffset + 0x4, "uint32");
    let quantity = 1;

    if (materiaIndex === 0xffffffff) {
      type = 0xff;
      id = 0xffffffff;
      quantity = 0;
    }

    setInt(detailsOffset + 0x2, "uint8", type);
    setInt(detailsOffset + 0x8, "uint32", materiaIndex);
    setInt(detailsOffset + 0xc, "uint32", quantity);
    setInt(itemInt.offset - 0x4, "uint32", id);
    setInt(itemInt.offset + 0x4, "uint32", 0);
    setInt(itemInt.offset + 0xc, "uint8", 1);

    updateResources("equippableMateriaNames");
    updateResources("inventoryMateriaNames");
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0xc, "uint32");
    const level = getInt(itemInt.offset, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    let ap = 0;

    if (materia) {
      ap = materia.ap[level - 1];
    }

    setInt(itemInt.offset - 0x8, "uint32", ap);
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

    setInt(itemInt.offset + 0x8, "uint8", level);
  } else if ("id" in item && item.id?.match(/weapon-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const weaponIndex = getInt(itemInt.offset, "uint32");

    const detailsOffset = itemInt.offset - index * 0x40 - 0x54004;

    let type = 0x3;
    let id = getInt(detailsOffset + 0x4, "uint32");
    let quantity = 1;

    if (weaponIndex === 0xffffffff) {
      type = 0xff;
      id = 0xffffffff;
      quantity = 0;
    }

    setInt(detailsOffset + 0x2, "uint8", type);
    setInt(detailsOffset + 0x8, "uint32", weaponIndex);
    setInt(detailsOffset + 0xc, "uint32", quantity);
    setInt(itemInt.offset - 0x4, "uint32", id);

    updateResources("equippedWeaponNames");
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
    setInt(itemInt.offset - 0x6, "uint8", type || 0xff);

    updateResources("accessories");
    updateResources("armors");
    updateResources("inventoryItemNames");
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

    offset -= 0x4 * (index + 1);

    setInt(offset, "bit", int > 0 ? 1 : 0, { bit: index + 2 });

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

    // Quests related challenges are also counted somewhere else

    // Gus's Party
    if ([0x3, 0x2c, 0x39, 0x30, 0x58].includes(recordIndex)) {
      setInt(progressionItem.offset - 0x285, "bit", challengeCompleted, {
        bit: progressionItem.bit,
      });
    }

    // UPA Challenge
    if (recordIndex === 0x5e) {
      setInt(progressionItem.offset - 0x288, "bit", challengeCompleted, {
        bit: 3,
      });
    }

    // Set Completed Difficulty

    let completedDifficulty = 0x5;
    let bestTime = 0x7fffffff;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const timeOffset = offset + 0x4 * (i + 1);
      const time = getInt(timeOffset, "uint32");

      if (time < bestTime) {
        completedDifficulty = i;
        bestTime = time;
      }
    }

    setInt(offset + 0x1, "uint8", completedDifficulty);
  }
}

export function getItemNames(): Resource {
  const names: Resource = {};

  itemList.forEach((item) => {
    names[item.index] = item.name;
  });

  names[0xffffffff] = "-";

  return names;
}

export function getItemResourceGroups(): ResourceGroups {
  return itemTypes.reduce((groups: ResourceGroups, type) => {
    groups.push({
      name: type.name,
      options: itemList
        .filter((item) => item.type === type.index)
        .map((item) => item.index),
    });

    return groups;
  }, []);
}

export function getInventoryNames(itemType: number): Resource {
  const names: Resource = {};

  const itemItem = getItem("item-0") as ItemInt;

  const items = getItemNames() as Resource;

  [...Array(1000).keys()].forEach((index) => {
    const id = getInt(itemItem.offset + index * 0x20 - 0x4, "uint32");
    const itemIndex = getInt(itemItem.offset + index * 0x20, "uint32");

    const type = itemList.find((item) => item.index === itemIndex)?.type;

    if (type === itemType) {
      names[id] = items[itemIndex];
    }
  });

  names[0xffffffff] = "-";

  return names;
}

export function getInventoryItemNames(): Resource {
  const names: Resource = {};

  const itemItem = getItem("item-0") as ItemInt;

  const items = getItemNames() as Resource;

  [...Array(1000).keys()].forEach((index) => {
    const itemIndex = getInt(itemItem.offset + index * 0x20, "uint32");

    if (itemIndex !== 0xffffffff) {
      names[index] = items[itemIndex];
    }
  });

  return names;
}

export function getInventoryMateriaNames(
  idAsKey: boolean,
  type: string,
): Resource {
  const names: Resource = {};

  const materiaItem = getItem("materia-0") as ItemInt;

  const materias = getResource("materias") as Resource;
  const characters = getResource("characters") as Resource;

  [...Array(1000).keys()].forEach((index) => {
    const id = getInt(materiaItem.offset + index * 0x20 - 0x4, "uint32");
    const materia = getInt(materiaItem.offset + index * 0x20, "uint32");
    const character = getInt(materiaItem.offset + index * 0x20 + 0xd, "uint8");
    const isSummon = materia >= 0x36b1 && materia <= 0x36c4;

    if (materia !== 0xffffffff && (!type || (type === "summons" && isSummon))) {
      names[idAsKey ? id : index] =
        `${materias[materia]}${character !== 0x10 ? ` (${characters[character][0]})` : ""}`;
    }
  });

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

export function getInventoryWeaponNames(idAsKey: boolean): Resource {
  const names: Resource = {};

  const weaponItem = getItem("weapon-0") as ItemInt;

  const weapons = getResource("weapons") as Resource;

  [...Array(128).keys()].forEach((index) => {
    const id = getInt(weaponItem.offset + index * 0x60 - 0x4, "uint32");
    const weaponIndex = getInt(weaponItem.offset + index * 0x60, "uint32");

    if (weaponIndex !== 0xffffffff) {
      names[idAsKey ? id : index] = weapons[weaponIndex];
    }
  });

  names[0xffffffff] = "-";

  return names;
}
