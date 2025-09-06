import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { extractBit, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getFileOffset,
  getSaves,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

import {
  attributes,
  characterLevels,
  inventory,
  levelAbilities,
  monsters,
} from "./utils/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id?.match(/name/) && $gameRegion === 2) {
    const itemString = item as ItemString;

    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;
    itemString.encoding = "windows31J";
    itemString.regex =
      "[ !.?\u2026\u3041-\u308d\u308f\u3092-\u3094\u30a1-\u30ed\u30ef\u30f2-\u30f4\u30f7\u30fa\u30fc]";

    return itemString;
  } else if ("id" in item && item.id === "time" && $gameRegion !== 0) {
    const itemInt = item as ItemInt;

    itemInt.operations![0] = { "/": 60 };

    return itemInt;
  } else if ("id" in item && item.id?.match(/attribute-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex, attributeIndex] = item.id.splitInt();

    itemInt.name = attributes[characterIndex][attributeIndex];

    return itemInt;
  } else if ("id" in item && item.id?.match(/abilityType-/)) {
    const itemBitflags = item as ItemBitflags;

    const [characterIndex, typeIndex] = item.id.splitInt();

    const type = levelAbilities[characterIndex][typeIndex];

    if (type) {
      type.forEach((ability) => {
        itemBitflags.flags.push({
          offset: 0xa98 + Math.floor(ability.index / 0x8),
          bit: ability.index % 8,
          label: ability.name,
        });
      });

      itemBitflags.hidden = false;
    }
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return [true, [getFileOffset(index)]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/itemStatus-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex, index] = item.id.splitInt();

    itemInt.disabled = !getEquipment(itemInt.offset, characterIndex, index);

    return itemInt;
  } else if ("id" in item && item.id === "bagQuantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x2, "uint16");

    itemInt.disabled = itemIndex === 0x0;

    return itemInt;
  } else if ("id" in item && item.id?.match(/monster-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    const { reserves, teams } = getMonsterTeam(itemInt.offset - index * 0x8);

    itemInt.disabled = teams
      .filter((monster) => monster !== 0)
      .includes(reserves[index]);

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const characterIndex = getFormation(itemInt.offset - index * 0x2, index);

    return [true, characterIndex];
  } else if ("id" in item && item.id?.match(/itemStatus-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    let status = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      if (getInt(itemInt.offset + i * 0x2, "uint16") === index) {
        status = 1;
      }
    }

    return [true, status];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    updateFormation(itemInt.offset - index * 0x2, index, parseInt(value));

    return true;
  } else if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex, index] = item.id.splitInt();

    const itemIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint16");

    const previousEquipment = inventory.find(
      (item) => item.index === previous && item.type <= 0xe,
    );

    const equipment = inventory.find(
      (item) => item.index === itemIndex && item.type <= 0xe,
    );

    // If the previous equipment type and the new equipment type are different, we clear the equipped status
    if (previousEquipment && previousEquipment.type !== equipment?.type) {
      const offset = getEquipmentOffset(
        itemInt.offset + 0x840 - characterIndex * 0x26 - index * 0x4,
        previousEquipment.type,
      );

      if (getInt(offset, "uint16") === index) {
        setInt(offset, "uint16", 0xffff);
      }
    }

    setInt(itemInt.offset, "uint16", value);
  } else if ("id" in item && item.id?.match(/itemStatus-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex, index] = item.id.splitInt();

    const int = parseInt(value);

    const equipment = getEquipment(itemInt.offset, characterIndex, index);

    if (equipment) {
      const offset = getEquipmentOffset(itemInt.offset, equipment.type);

      setInt(offset, "uint16", int ? index : 0xffff);
    }

    return true;
  } else if ("id" in item && item.id?.match(/monsterTeam-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = parseInt(value);

    const offset = itemInt.offset - 0x60 - index * 0x2;

    const { reserves, teams } = getMonsterTeam(offset);

    const previousReserveIndex = reserves.findIndex(
      (monster) => monster === teams[index],
    );

    const reserveIndex = reserves.findIndex((monster) => monster === int);

    // If new monster is already in a team slot, we cleared the previous slot
    if (reserveIndex !== -1) {
      const teamIndex = teams.findIndex((monster) => monster === int);

      if (teamIndex !== -1) {
        setInt(offset + 0x60 + teamIndex * 0x2, "uint16", 0x0);
      }
    } else if (int !== 0 && previousReserveIndex !== -1) {
      // If monster is set, we add to / update reserves
      setInt(offset + previousReserveIndex * 0x8, "uint16", value);
    }

    setInt(itemInt.offset, "uint16", value);

    return true;
  } else if ("id" in item && item.id?.match(/monster-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    const int = parseInt(value);

    const offset = itemInt.offset - index * 0x8;

    const { reserves } = getMonsterTeam(offset);

    const reserveIndex = reserves.findIndex((monster) => monster === int);

    // If new monster is already in reserves, we cleared the previous slot
    if (reserveIndex !== -1) {
      setInt(offset + reserveIndex * 0x8, "uint16", 0x0);
    }

    setInt(itemInt.offset, "uint16", value);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/-name/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x727, "bit", int, { bit: 2 });
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    const characterCurve = characterLevels[characterIndex];

    const level = getInt(itemInt.offset, "uint16");
    const experience = characterCurve[level - 1] || 0;

    setInt(itemInt.offset + 0x8, "uint32", experience);
  } else if ("id" in item && item.id?.match(/experience-/)) {
    const itemInt = item as ItemInt;

    const [characterIndex] = item.id.splitInt();

    const characterCurve = characterLevels[characterIndex];

    const experience = getInt(itemInt.offset, "uint32");

    let level = 0;

    for (let i = 0; i < characterCurve.length; i += 1) {
      if (
        experience >= characterCurve[i] &&
        (!characterCurve[i + 1] || experience < characterCurve[i + 1])
      ) {
        level += i + 1;
      }
    }

    setInt(itemInt.offset - 0x8, "uint16", level);
  } else if ("id" in item && item.id === "bagItem") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint16");
    const quantity = getInt(itemInt.offset + 0x2, "uint16");

    if (itemIndex === 0x0) {
      setInt(itemInt.offset + 0x2, "uint16", 0);
    } else if (quantity === 0) {
      setInt(itemInt.offset + 0x2, "uint16", 1);
    }
  } else if ("id" in item && item.id?.match(/monsterTeam-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - 0x60 - index * 0x2;

    updateMonsterTeamNames(offset);
  } else if ("id" in item && item.id?.match(/monster-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    updateMonsterTeamNames(itemInt.offset - index * 0x8);
  }
}

// prettier-ignore
export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x40) {
    checksum += getInt(i, "uint8") % 0xff;
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-name`) as ItemString;

  const name = getString(
    itemString.offset,
    itemString.length,
    itemString.letterDataType,
    {
      letterBigEndian: itemString.letterBigEndian,
      encoding: itemString.encoding,
      endCode: itemString.endCode,
    },
  );

  names[0x0] = name;
  names[0x1] = "Yangus";
  names[0x2] = "Jessica";
  names[0x3] = "Angelo";
  names[0xffff] = "-";

  return names;
}

function getEquipment(
  offset: number,
  characterIndex: number,
  index: number,
): { index: number; name: string; type: number } | undefined {
  offset = offset - 0x840 + characterIndex * 0x26 + index * 0x4;

  const itemIndex = getInt(offset, "uint16");

  return inventory.find((item) => item.index === itemIndex && item.type <= 0xe);
}

function getEquipmentOffset(offset: number, type: number): number {
  switch (type) {
    case 0xb: // Armour
      offset += 0x2;
      break;
    case 0xc: // Shield
      offset += 0x4;
      break;
    case 0xd: // Helmet
      offset += 0x6;
      break;
    case 0xe: // Accessory
      offset += 0x8;
      break;
  }

  return offset;
}

function getFormation(offset: number, index: number): number {
  const characters = getInt(offset - 0x4, "uint8");

  let characterIndex = getInt(offset + index * 0x2, "uint16");

  if (!extractBit(characters, characterIndex)) {
    characterIndex = 0xffff;
  }

  return characterIndex;
}

function getMonsterTeam(offset: number): {
  reserves: number[];
  teams: number[];
} {
  const reserves = [];
  const teams = [];

  for (let i = 0x0; i < 0xc; i += 0x1) {
    reserves.push(getInt(offset + i * 0x8, "uint16"));
  }

  for (let i = 0x0; i < 0x6; i += 0x1) {
    teams.push(getInt(offset + 0x60 + i * 0x2, "uint16"));
  }

  return { reserves, teams };
}

export function getSlotNames(): Resource {
  const saves = getSaves();

  const names = saves.reduce((names: Resource, save, index) => {
    const [, slotIndex] = save.directory.name.split("_");

    names[index] = `Slot ${parseInt(slotIndex) + 1}`;

    return names;
  }, {});

  return names;
}

export function onSlotChange(slotIndex: number): void {
  const monsterItem = getItem(`slot-${slotIndex}-monster-0`) as ItemInt;

  updateCharacterNames(slotIndex);
  updateMonsterTeamNames(monsterItem.offset);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

export function updateMonsterTeamNames(offset: number): void {
  const { reserves, teams } = getMonsterTeam(offset);

  const baseValues = { 0x0: "-", ...monsters };

  for (let i = 0x0; i < 0x6; i += 0x1) {
    const values: Resource = {};

    if (
      teams[i] === 0x0 &&
      reserves.filter((monster) => monster === 0x0).length === 0
    ) {
      reserves.forEach((monster) => {
        if (!teams.includes(monster)) {
          values[monster] = monsters[monster];
        }
      });
    }

    updateResources(
      `teamMonsters${i}`,
      Object.values(values).length > 0 ? { 0x0: "-", ...values } : baseValues,
    );
  }
}

function updateFormation(offset: number, index: number, value: number): void {
  const formation: number[] = [];
  const missings = [0, 1, 2, 3];

  for (let i = 0; i < 4; i += 1) {
    let characterIndex = value;

    if (i !== index) {
      characterIndex = getFormation(offset, i);
    }

    if (characterIndex !== 0xffff && !formation.includes(characterIndex)) {
      formation.push(characterIndex);
      missings.splice(
        missings.findIndex((index) => index === characterIndex),
        1,
      );
    }
  }

  for (let i = 0; i < 4; i += 1) {
    const checked = formation[i] !== undefined;
    const position = checked ? formation[i] : missings.pop()!;

    setInt(offset - 0x4, "bit", checked ? 1 : 0, { bit: position });
    setInt(offset + i * 0x2, "uint16", position);
  }
}
