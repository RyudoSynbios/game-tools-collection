import { bitToOffset, getInt, setInt } from "$lib/utils/bytes";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemInt,
  ItemSection,
  Resource,
  ResourceGroups,
} from "$lib/types";

import {
  characterLevels,
  chocoboRaces,
  craftmanshipLevels,
  itemList,
  itemTypes,
  materiaList,
  materiaTypes,
  outfits,
  partyLevels,
  pianoPieces,
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
  } else if ("id" in item && item.id?.match(/pianoScore-/)) {
    const itemInt = item as ItemInt;

    const isCompleted = getInt(itemInt.offset - 0x7, "bit", { bit: 7 });

    itemInt.disabled = !isCompleted;

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
  } else if ("id" in item && item.id === "partyLevel") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 1;

    for (let i = 0; i < partyLevels.length; i += 1) {
      if (
        experience >= partyLevels[i] &&
        (!partyLevels[i + 1] || experience < partyLevels[i + 1])
      ) {
        level += i;
      }
    }

    return [true, level];
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
  } else if ("id" in item && item.id === "craftmanshipLevel") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 1;

    for (let i = 0; i < craftmanshipLevels.length; i += 1) {
      if (
        experience >= craftmanshipLevels[i] &&
        (!craftmanshipLevels[i + 1] || experience < craftmanshipLevels[i + 1])
      ) {
        level += i;
      }
    }

    return [true, level];
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    if (int === 0x7fffffff) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/pianoRank-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const scores = pianoPieces[index].scores;

    const isCompleted = getInt(itemInt.offset - 0x7, "bit", { bit: 7 });
    const score = getInt(itemInt.offset, "uint32");

    if (!isCompleted) {
      return [true, 0x0];
    }

    let rank = 1;

    for (let i = 0; i < scores.length; i += 1) {
      if (score >= scores[i] && (!scores[i + 1] || score < scores[i + 1])) {
        rank += i;
      }
    }

    return [true, rank];
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
  } else if ("id" in item && item.id === "partyLevel") {
    const itemInt = item as ItemInt;

    const level = parseInt(value);

    const experience = partyLevels[level - 1] || partyLevels[0];

    setInt(itemInt.offset, "uint32", experience);

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
  } else if ("id" in item && item.id === "craftmanshipLevel") {
    const itemInt = item as ItemInt;

    const level = parseInt(value);

    const experience = craftmanshipLevels[level - 1] || craftmanshipLevels[0];

    setInt(itemInt.offset, "uint32", experience);

    return true;
  } else if ("id" in item && item.id?.match(/completionTime-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32");

    if (int === 0x7fffffff) {
      setInt(itemInt.offset, "uint32", 0x0);
    }
  } else if ("id" in item && item.id?.match(/pianoRank-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const scores = pianoPieces[index].scores;

    const rank = parseInt(value);

    const score = scores[rank - 1] || scores[0];

    setInt(itemInt.offset - 0x7, "bit", rank === 0x0 ? 0 : 1, { bit: 7 });
    setInt(itemInt.offset, "uint32", score);

    checkPianoRank(index, itemInt.offset, score);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "characterLevel") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8");
    const experience = characterLevels[level - 15] || characterLevels[0];

    setInt(itemInt.offset + 0x20, "uint32", experience);
  } else if ("id" in item && item.id === "characterExperience") {
    const itemInt = item as ItemInt;

    const experience = getInt(itemInt.offset, "uint32");

    let level = 15;

    for (let i = 0; i < characterLevels.length; i += 1) {
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
    setInt(itemInt.offset - 0x6, "uint8", type !== undefined ? type : 0xff);

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
  } else if ("id" in item && item.id?.match(/chocoboRace-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    let offset = itemInt.offset - (index ? index * 0x4 : 0x0);
    let bit = 0;
    let value = 0;

    if (type === "gradeiii") {
      const raceIndex = chocoboRaces.gradeIII.findIndex(
        (race) => race.index === index,
      );

      offset = offset - 0x328818 + bitToOffset(5 + raceIndex);
      value = getInt(itemInt.offset, "uint32") > 0 ? 1 : 0;
      bit = (5 + raceIndex) % 8;
    } else if (type === "gradeii") {
      const raceIndex = chocoboRaces.gradeII.findIndex(
        (race) => race.index === index,
      );

      offset = offset - 0x328817 + bitToOffset(6 + raceIndex);
      value = getInt(itemInt.offset, "uint32") > 0 ? 1 : 0;
      bit = (6 + raceIndex) % 8;
    } else if (type === "gradei") {
      offset -= 0x3288a1;
      value = getInt(itemInt.offset, "uint32") === 1 ? 1 : 0;
      bit = 3;
    }

    setInt(offset, "bit", value, { bit });
  } else if ("id" in item && item.id?.match(/gearsAndGambits-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint32");

    let offset = itemInt.offset;

    switch (index) {
      case 0:
        offset -= 0x3a6719;
        break;
      case 1:
        offset -= 0x3a6789;
        break;
      case 2:
        offset -= 0x3a6791;
        break;
      case 3:
        offset -= 0x3a661d;
        break;
    }

    setInt(offset, "bit", int > 0 ? 1 : 0, { bit: index });
  } else if ("id" in item && item.id?.match(/pianoScore-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const score = getInt(itemInt.offset, "uint32");

    checkPianoRank(index, itemInt.offset, score);
  } else if ("id" in item && item.id?.match(/pianoReward-/)) {
    const rewardItem = getItem("pianoReward-0") as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      const offset = rewardItem.offset + bitToOffset(6 + i);
      const bit = (rewardItem.bit! + i) % 8;

      const checked = getInt(offset, "bit", { bit });

      if (checked) {
        count += 1;
      }
    }

    const checked = count === 6;

    setInt(rewardItem.offset - 0x1, "bit", checked ? 1 : 0, { bit: 6 }); // Piano Quest Complete
    setInt(rewardItem.offset + 0x1, "bit", checked ? 1 : 0, { bit: 6 }); // Aerith can play Piano
    setInt(rewardItem.offset + 0x1, "bit", checked ? 1 : 0, { bit: 7 }); // Yuffie can play Piano
  } else if ("id" in item && item.id?.match(/queensBlood-/)) {
    const itemBitflags = item as ItemBitflags;

    const [shift] = item.id.splitInt();

    const offset = itemBitflags.flags[0].offset - shift;

    const count = (getInt(offset, "uint32") & 0x7ffffffe).toBitCount();

    setInt(offset - 0x124ac, "uint32", count);
  } else if ("id" in item && item.id === "hiddenEvents") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const hiddenFlag = itemBitflags.flags[index + 1];

    if (hiddenFlag.hidden) {
      setInt(hiddenFlag.offset, "bit", checked, { bit: hiddenFlag.bit });
    }
  }
}

function checkPianoRank(index: number, offset: number, score: number): void {
  if (index >= 6) {
    return;
  }

  offset = offset - index * 0x10 - 0x9c266 + bitToOffset(7 + index);

  const bit = (7 + index) % 8;

  const checked = score >= pianoPieces[index].scores[2];

  setInt(offset, "bit", checked ? 1 : 0, { bit: bit });
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

  for (let i = 0x0; i < 0x3e8; i += 0x1) {
    const id = getInt(itemItem.offset + i * 0x20 - 0x4, "uint32");
    const index = getInt(itemItem.offset + i * 0x20, "uint32");

    const type = itemList.find((item) => item.index === index)?.type;

    if (type === itemType) {
      names[id] = items[index];
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
    const index = getInt(itemItem.offset + i * 0x20, "uint32");

    if (index !== 0xffffffff) {
      names[i] = items[index];
    }
  }

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

  for (let i = 0x0; i < 0x3e8; i += 0x1) {
    const id = getInt(materiaItem.offset + i * 0x20 - 0x4, "uint32");
    const materia = getInt(materiaItem.offset + i * 0x20, "uint32");
    const character = getInt(materiaItem.offset + i * 0x20 + 0xd, "uint8");
    const isSummon = materia >= 0x36b1 && materia <= 0x36c4;

    if (materia !== 0xffffffff && (!type || (type === "summons" && isSummon))) {
      names[idAsKey ? id : i] =
        `${materias[materia]}${character !== 0x10 ? ` (${characters[character][0]})` : ""}`;
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

export function getInventoryWeaponNames(idAsKey: boolean): Resource {
  const names: Resource = {};

  const weaponItem = getItem("weapon-0") as ItemInt;

  const weapons = getResource("weapons") as Resource;

  for (let i = 0x0; i < 0x80; i += 0x1) {
    const id = getInt(weaponItem.offset + i * 0x60 - 0x4, "uint32");
    const index = getInt(weaponItem.offset + i * 0x60, "uint32");

    if (index !== 0xffffffff) {
      names[idAsKey ? id : i] = weapons[index];
    }
  }

  names[0xffffffff] = "-";

  return names;
}
