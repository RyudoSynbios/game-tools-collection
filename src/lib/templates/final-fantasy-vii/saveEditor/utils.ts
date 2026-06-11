import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import {
  checkNextHiddenFlags,
  copyInt,
  extractBit,
  getInt,
  getString,
  setInt,
  setString,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSlotShiftsByIdentifier,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { getObjKey, isInRange } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";
import { checkValidator, getPlatformRegions } from "$lib/utils/validator";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTabs,
  Resource,
  Validator,
} from "$lib/types";

import EnemySkill from "./components/EnemySkill.svelte";
import { limitBreakList, locationList, materiaList } from "./utils/resource";

export function getComponent(component: string): typeof EnemySkill | undefined {
  switch (component) {
    case "EnemySkill":
      return EnemySkill;
  }
}

export function setGamePlatform(dataView: DataView): void {
  const regionValidator = getPlatformRegions("steam").europe_usa as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

  if (checkValidator(validator, key, dataView)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return ["europe_usa", "japan"];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function beforeItemsParsing(): void {
  const $gameRegion = get(gameRegion);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1 && $gameRegion === 1) {
    gameRegion.set(3);
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);
  const $gamePlatform = get(gamePlatform);

  if ("id" in item && item.id === "slots" && $gamePlatform === 1) {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x10f4;
  } else if (
    "id" in item &&
    item.id?.match(/name-/) &&
    [2, 3].includes($gameRegion)
  ) {
    const itemString = item as ItemString;

    itemString.length = 0x6;

    return itemString;
  } else if ("id" in item && item.id?.match(/limitBreaks-/)) {
    const itemSection = item as ItemSection;

    const [characterIndex] = item.id.splitInt();

    const levels = limitBreakList[characterIndex];

    itemSection.items.forEach((item, levelIndex) => {
      const itemSection = item as ItemSection;
      const itemBitflags = itemSection.items[0] as ItemBitflags;

      const level = levels[levelIndex];

      if (!level) {
        itemSection.hidden = true;
        return;
      }

      itemBitflags.flags.forEach((flag, index) => {
        if (level[index]) {
          flag.label = level[index];
        } else {
          flag.hidden = true;
        }
      });
    });
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gamePlatform = get(gamePlatform);

  if (item.id === "slots") {
    if ($gamePlatform === 1) {
      const checksum = getInt(index * item.length + 0x9, "uint16");

      if (checksum !== 0x0) {
        return [true, [-0x1f7, index * item.length]];
      }

      return [true, [-1]];
    }

    return getSlotShiftsByIdentifier(`FF7-S${(index + 1).leading0()}`);
  } else if (item.id?.match(/chocobosTabs-/) && index >= 4) {
    return [true, [...shifts, 0x280 + index * item.length]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0x1, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.length : 1;
    itemInt.disabled = !materia;
    itemInt.hidden = index === 0x2c; // Enemy Skill
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    const index = getInt(itemInt.offset - 0x1, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    itemInt.max = materia ? materia.ap.at(-1) : 0;
    itemInt.disabled = !materia;
    itemInt.hidden = index === 0x2c; // Enemy Skill
  } else if ("id" in item && item.id?.match(/chocobosTabs-/)) {
    const itemTabs = item as ItemTabs;

    const slotsItem = getItem(item.id.replace("Tabs", "Slots")) as ItemInt;

    const slots = getInt(slotsItem.offset, "uint8");

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/chocoboName-/)) {
    const itemString = item as ItemString;

    const [, index] = item.id.splitInt();

    itemString.disabled = isChocoboStableEmpty(
      itemString.offset,
      index,
      "name",
    );

    return itemString;
  } else if ("id" in item && item.id?.match(/chocoboStats-/)) {
    const itemInt = item as ItemInt;

    let [index, shift] = item.id.splitInt();

    let type = "stats";

    if (shift === 0x6b) {
      type = "rating";
      shift = 0x0;
    } else if (shift === 0x115) {
      type = "stamina";
      shift = 0x0;
    }

    itemInt.disabled = isChocoboStableEmpty(
      itemInt.offset + shift,
      index,
      type,
    );

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationType = getInt(itemInt.offset - 0x2, "uint16");
    const location = getInt(itemInt.offset, "uint16");

    if (locationType === 0x3) {
      return [true, 0x1]; // World Map
    } else if (isInRange(location, 0x2ec, 0x2fa)) {
      return [true, 0x2eb]; // Nothern Cave
    }
  } else if ("id" in item && item.id?.match(/transportation-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const entity = getInt(itemInt.offset, "uint32", { binary: itemInt.binary });
    const vehicles = getInt(itemInt.offset - shift, "uint16");
    const chocobo = getInt(itemInt.offset - shift, "uint16", {
      binary: { bitStart: 2, bitLength: 5 },
    });
    const submarine = getInt(itemInt.offset - shift + 0x2d2, "bit", { bit: 3 });

    if (
      (entity === 0x3 && !extractBit(vehicles, 12)) || // Highwind
      (entity === 0x5 && !extractBit(vehicles, 10)) || // Tiny Bronco
      (entity === 0x6 && !extractBit(vehicles, 8)) || // Buggy
      (entity === 0xd && !submarine) || // Submarine
      (entity === 0x13 && !chocobo) // Chocobo
    ) {
      return [true, 0x0];
    }

    if (entity === 0x13) {
      const chocoboIndex = (chocobo >> 0x1) << 0x8;

      return [true, chocoboIndex | entity];
    }
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }

    const index = getInt(itemInt.offset - 0x1, "uint8");
    const ap = getInt(itemInt.offset, "uint24");

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

    return [true, level];
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }

    const index = getInt(itemInt.offset - 0x1, "uint8");
    let ap = getInt(itemInt.offset, "uint24");

    const materia = materiaList.find((materia) => materia.index === index);

    if (materia) {
      ap = Math.min(ap, materia.ap.at(-1) || 0);
    }

    return [true, ap];
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset);

    const index = inventory.findIndex((index) => index === itemIndex);

    let quantity = 0;

    if (index !== -1) {
      quantity = getInt(itemInt.offset + index * 0x2, "uint16", {
        binary: itemInt.binary,
      });
    }

    return [true, quantity];
  } else if ("id" in item && item.id?.match(/chocoboType-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    if (isChocoboStableEmpty(itemInt.offset, index, "stats")) {
      return [true, 0xff];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let locationType = 0x1;

    if (int === 0x1) {
      locationType = 0x3;
    }

    setInt(itemInt.offset - 0x2, "uint16", locationType);
    setInt(itemInt.offset, "uint16", int);

    const location = locationList[int];

    if (location) {
      if (locationType === 0x1) {
        setInt(itemInt.offset + 0x4, "int16", location.coordinates[0]);
        setInt(itemInt.offset + 0x8, "int16", location.coordinates[1]);
        setInt(itemInt.offset + 0x6, "int16", location.coordinates[2]);
      } else if (locationType === 0x3) {
        setInt(itemInt.offset + 0x3c6, "uint32", location.coordinates[0], {
          binary: { bitStart: 0, bitLength: 19 },
        });
        setInt(itemInt.offset + 0x3ca, "uint32", location.coordinates[1], {
          binary: { bitStart: 18, bitLength: 14 },
        });
        setInt(itemInt.offset + 0x3ca, "uint32", location.coordinates[2], {
          binary: { bitStart: 0, bitLength: 18 },
        });
      }

      let locationName = location.name;

      const match = location.name.match(/ \(/);

      if (match) {
        locationName = locationName.substring(0, match.index);
      }

      setString(itemInt.offset - 0xb6e, 0x14, "uint8", locationName, 0xff, {
        endCode: 0xff,
        resource: "letters",
      });
    }
  } else if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    const characterIndex = parseInt(value);

    if (index === undefined) {
      return false;
    }

    setInt(itemInt.offset, "uint8", characterIndex);

    updateFormation(itemInt.offset - index, index);

    return true;
  } else if ("id" in item && item.id?.match(/transportation-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const entity = parseInt(value);

    const offset = itemInt.offset - shift;

    const previousEntity = getInt(itemInt.offset, "uint32", {
      binary: itemInt.binary,
    });

    setInt(itemInt.offset, "uint32", entity & 0xff, { binary: itemInt.binary });

    if (entity === 0x0 && previousEntity !== 0x0) {
      switch (previousEntity) {
        case 0x3: // Highwind
          setInt(offset + 0x1, "bit", 0, { bit: 4 });
          break;
        case 0x5: // Tiny Bronco
          setInt(offset + 0x1, "bit", 0, { bit: 2 });
          break;
        case 0x6: // Buggy
          setInt(offset + 0x1, "bit", 0, { bit: 0 });
          break;
        case 0xd: // Submarine
          setInt(offset + 0x2d2, "bit", 0, { bit: 3 });
          break;
        case 0x13: // Chocobo
          setInt(offset, "uint8", 0, { binary: { bitStart: 2, bitLength: 5 } });
          break;
      }

      return true;
    }

    switch (entity & 0xff) {
      case 0x3: // Highwind
        setInt(offset + 0x1, "bit", 0, { bit: 0 });
        setInt(offset + 0x1, "bit", 1, { bit: 4 });
        break;
      case 0x5: // Tiny Bronco
        setInt(offset, "uint8", 0, { binary: { bitStart: 2, bitLength: 5 } });
        setInt(offset + 0x1, "bit", 1, { bit: 2 });
        break;
      case 0x6: // Buggy
        setInt(offset + 0x1, "bit", 1, { bit: 0 });
        setInt(offset + 0x1, "bit", 0, { bit: 4 });
        break;
      case 0xd: // Submarine
        setInt(offset + 0x2d2, "bit", 1, { bit: 3 });
        break;
      case 0x13: // Chocobo
        const chocobo = entity >> 0x7 || 0x1;
        setInt(offset, "uint8", chocobo, {
          binary: { bitStart: 2, bitLength: 5 },
        });
        setInt(offset + 0x1, "bit", 0, { bit: 2 });
        break;
    }

    return true;
  } else if ("id" in item && item.id === "materiaLevel") {
    const itemInt = item as ItemInt;

    const level = parseInt(value);

    const index = getInt(itemInt.offset - 0x1, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    let ap = 0;

    if (materia) {
      if (materia.ap.length === level) {
        ap = -1;
      } else {
        ap = materia.ap[level - 1];
      }
    }

    setInt(itemInt.offset, "uint24", ap);

    return true;
  } else if ("id" in item && item.id === "materiaAp") {
    const itemInt = item as ItemInt;

    const ap = parseInt(value);

    const index = getInt(itemInt.offset - 0x1, "uint8");

    const materia = materiaList.find((materia) => materia.index === index);

    if (materia && ap >= materia.ap.at(-1)!) {
      setInt(itemInt.offset, "uint24", -1);

      return true;
    }
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const quantity = parseInt(value);

    updateInventory(itemInt.offset, itemIndex, quantity);

    return true;
  } else if ("id" in item && item.id?.match(/chocoboType-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, index] = item.id.splitInt();

    let type = parseInt(value);

    const offset = itemInt.offset - index * 0x10 - (index >= 0x4 ? 0x280 : 0x0);

    if (type === 0xff) {
      // We clear the stats of the Chocobo
      setInt(itemInt.offset - 0xf, "uint32", 0x0); // Stats
      setInt(itemInt.offset - 0xb, "uint32", 0x0); // Stats
      setInt(itemInt.offset - 0x7, "uint32", 0x0); // Stats
      setInt(itemInt.offset - 0x3, "uint32", 0x0); // Stats
      setInt(offset + 0x6b + index, "uint8", 0x0); // Rating
      setInt(offset + 0x115 + index * 0x2, "uint16", 0x0); // Stamina

      setString(offset + 0xf1 + index * 0x6, 0x6, "uint8", "", 0xff, {
        endCode: 0xff,
        resource: "letters",
      });

      updateChocoboNames(slotIndex);
    } else {
      setInt(itemInt.offset, "uint8", type);
    }

    setInt(offset - 0xd4, "bit", type !== 0xff ? 1 : 0, { bit: index }); // Occupied Flags

    const count = getInt(offset - 0xd4, "uint8").toBitCount();

    setInt(offset - 0xd6, "uint8", count); // Occupied Count

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "disc") {
    const itemInt = item as ItemInt;

    const disc = getInt(itemInt.offset, "uint8");
    const location = getInt(itemInt.offset - 0x30e, "uint16");
    let progression = getInt(itemInt.offset - 0x300, "uint16");

    if (disc === 0x1 && progression > 0x298) {
      progression = 0x298;
    } else if (disc === 0x2 && progression < 0x2a5) {
      progression = 0x2a5;
    } else if (disc === 0x2 && progression > 0x643) {
      progression = 0x643;
    } else if (disc === 0x3 && progression < 0x654) {
      progression = 0x654;
    } else if (disc === 0x3 && progression > 0x7ce) {
      progression = 0x7ce;
    }

    setInt(itemInt.offset - 0x300, "uint16", progression);

    if (location === 0x67) {
      setInt(itemInt.offset - 0x17a, "bit", disc === 2 ? 1 : 0, { bit: 2 });
      setInt(itemInt.offset - 0x178, "bit", disc === 3 ? 1 : 0, { bit: 5 });
    }
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const disc = getInt(itemInt.offset + 0x30e, "uint8");
    const location = getInt(itemInt.offset, "uint16");

    const isDisc2Start = disc === 2 && location === 0x67 ? 1 : 0;
    const isDisc3Start = disc === 3 && location === 0x67 ? 1 : 0;

    setInt(itemInt.offset + 0x194, "bit", isDisc2Start, { bit: 2 });
    setInt(itemInt.offset + 0x196, "bit", isDisc3Start, { bit: 5 });
  } else if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const length = itemInt.dataType === "uint32" ? 4 : 1;

    copyInt(itemInt.offset, itemInt.offset - shift, length);
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "materia") {
    const itemInt = item as ItemInt;

    setInt(itemInt.offset + 0x1, "uint24", 0x0);
  } else if ("id" in item && item.id?.match(/chocoboName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateChocoboNames(slotIndex);
  } else if ("id" in item && item.id === "hiddenFlags") {
    const itemBitflags = item as ItemBitflags;

    checkNextHiddenFlags(flag, itemBitflags);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum ^= getInt(i, "uint8") << 0x8;

    for (let j = 0; j < 8; j += 1) {
      if (checksum & 0x8000) {
        checksum = (checksum << 0x1) ^ 0x1021;
      } else {
        checksum = checksum << 0x1;
      }
    }

    checksum &= 0xffff;
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

function getInventory(offset: number): number[] {
  const inventory: number[] = [];

  for (let i = 0x0; i < 0x280; i += 0x2) {
    const itemIndex = getInt(offset + i, "uint16", {
      binary: { bitStart: 0, bitLength: 9 },
    });

    inventory.push(itemIndex);
  }

  return inventory;
}

function updateInventory(
  offset: number,
  itemIndex: number,
  value: number,
): void {
  const inventory = getInventory(offset);

  const int = (value << 0x9) | itemIndex;

  const index = inventory.findIndex((index) => index === itemIndex);

  if (value && index !== -1) {
    setInt(offset + index * 0x2, "uint16", int);
  } else if (value) {
    const index = inventory.findIndex((index) => index === 0x1ff);

    if (index !== -1) {
      setInt(offset + index * 0x2, "uint16", int);
    }
  } else if (index !== -1) {
    setInt(offset + index * 0x2, "uint16", 0xffff);
  }
}

function isChocoboStableEmpty(
  offset: number,
  index: number,
  type: string,
): boolean {
  switch (type) {
    case "stats":
      offset -= index * 0x10 + 0xd4 + (index >= 0x4 ? 0x280 : 0x0);
      break;
    case "name":
      offset -= index * 0x6 + 0x1c5;
      break;
    case "rating":
      offset -= index * 0x1 + 0x13f;
      break;
    case "stamina":
      offset -= index * 0x2 + 0x1e9;
      break;
  }

  return !getInt(offset, "bit", { bit: index });
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x9; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x84,
      itemString.length,
      "uint8",
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    );
  }

  return names;
}

export function getChocoboNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`chocoboName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x6; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x6,
      itemString.length,
      "uint8",
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    ).trim();
  }

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
  updateChocoboNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

export function updateChocoboNames(slotIndex: number): void {
  const values = getChocoboNames(slotIndex);

  updateResources("chocoboNames", values);
}

function updateFormation(offset: number, index: number): void {
  const formation = [];

  let caitSith = false;
  let vincent = false;
  let youngCloud = false;
  let sephiroth = false;

  for (let i = 0x0; i < 0x3; i += 0x1) {
    let character = getInt(offset + i, "uint8");

    caitSith = character === 0x6 ? true : caitSith;
    vincent = character === 0x7 ? true : vincent;
    youngCloud = character === 0x9 ? true : youngCloud;
    sephiroth = character === 0xa ? true : sephiroth;

    formation.push(character);
  }

  for (let i = 0x0; i < 0x3; i += 0x1) {
    if (
      i !== index &&
      ((formation[i] === 0x6 && youngCloud) ||
        (formation[i] === 0x7 && sephiroth) ||
        (formation[i] === 0x9 && caitSith) ||
        (formation[i] === 0xa && vincent))
    ) {
      formation[i] = 0xff;
    }

    setInt(offset + i, "uint8", formation[i]);
  }

  const character6 = getInt(offset - 0x18c, "uint8");
  const character7 = getInt(offset - 0x108, "uint8");

  if (caitSith && character6 === 0x9) {
    setInt(offset - 0x18c, "uint8", 0x6);
  } else if (vincent && character7 === 0xa) {
    setInt(offset - 0x108, "uint8", 0x7);
  } else if (youngCloud && character6 === 0x6) {
    setInt(offset - 0x18c, "uint8", 0x9);
  } else if (sephiroth && character7 === 0x7) {
    setInt(offset - 0x108, "uint8", 0xa);
  }
}
