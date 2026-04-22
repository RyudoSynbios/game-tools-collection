import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { bitToOffset, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";
import { clone, getRegionArray, isInRange } from "$lib/utils/format";
import {
  getItem,
  getShift,
  updateResourceOrder,
  updateResources,
  updateResourcesGroups,
} from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type {
  Binary,
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
  ItemTabs,
  Resource,
  ResourceGroups,
} from "$lib/types";

import { gbaResources } from "./utils/gba/resource";
import {
  IndexedResource,
  Resources,
  snesResources,
} from "./utils/snes/resource";

let platform = "";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  for (let i = 0x0; i < itemContainer.instances; i += 0x1) {
    const itemSection = clone(itemContainer.items[0]) as ItemSection;
    const itemChecksum = clone(itemSection.items[0]) as ItemChecksum;

    const tmpShift = shift + i * itemContainer.length;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum !== 0x0 &&
      checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)
    ) {
      if (isGBASave(dataView, shift)) {
        platform = "gba";
        return ["europe", "usa", "japan"];
      } else {
        platform = "snes";
        return ["usa", "japan"];
      }
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/checksumGba-/)) {
    const itemChecksum = item as ItemChecksum;

    const [slotIndex] = item.id.splitInt();

    if (platform !== "gba") {
      itemChecksum.offset = 0x0;
      itemChecksum.disabled = true;
    }

    itemChecksum.control.offsetStart -= slotIndex * 0x600;
    itemChecksum.control.offsetEnd -= slotIndex * 0x600;

    return itemChecksum;
  } else if ("id" in item && item.id === "gbaOnly") {
    const itemInt = item as ItemInt;

    if (platform !== "gba") {
      itemInt.offset = 0x0;
      itemInt.hidden = true;
    }

    return itemInt;
  } else if ("id" in item && item.id === "snesOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = platform !== "snes";

    return itemInt;
  } else if ("id" in item && item.id === "europeOnly") {
    const itemInt = item as ItemInt;

    if ($gameRegion !== 0) {
      itemInt.offset = 0x0;
      itemInt.hidden = true;
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/cross-/)) {
    const itemInt = item as ItemInt;

    if (platform !== "gba") {
      return itemInt;
    }

    const [, type] = item.id.split("-");

    switch (type) {
      case "currentGroup":
        itemInt.offset += 0x288;
        break;
      case "experience":
        itemInt.max = 5000000;
        break;
      case "vigor":
        itemInt.name = "Strength";
        break;
      case "magicPower":
        itemInt.name = "Magic";
        break;
      case "skills":
        itemInt.name = "Abilities";
        break;
    }

    itemInt.name;

    return itemInt;
  } else if ("id" in item && item.id === "magic") {
    const itemTab = item as ItemTab;

    const resources = getResources();

    const itemInt = itemTab.items[0] as ItemInt;

    if (platform === "gba") {
      itemInt.offset -= 0x205;
    }

    itemTab.items = [
      {
        type: "tabs",
        items: resources.magic.map((magic) => ({
          name: magic.name,
          flex: true,
          items: magic.spells.map((spell) => ({
            ...itemInt,
            id: `spell-${platform}-%index%-${spell.index}`,
            name: spell.name,
            offset: itemInt.offset + spell.index,
          })),
        })),
      },
    ];

    return itemTab;
  } else if ("id" in item && item.id?.match(/bitflags-/)) {
    const itemTab = item as ItemTab;

    const [, type] = item.id.split("-") as [undefined, keyof Resources];

    const resources = getResources();

    let resource = resources[type] as IndexedResource[];
    let offset = (itemTab.items[0] as ItemBitflags).flags[0].offset;
    let overrideShift: { parent: number; shift: number } | undefined;
    let flagPerItem = 14;

    if (type === "rareItems") {
      flagPerItem = 22;
    } else if (type === "espers" && platform === "gba") {
      offset += 0x1b97;
      overrideShift = { parent: -1, shift: 0x400 };
    } else if (type === "swordTechs" && platform === "gba") {
      itemTab.name = "Bushido";
    } else if (type === "enemies" && platform === "gba") {
      resource = resource.slice(0x0, 0x100);
    }

    itemTab.items = [];

    const count = Math.floor((resource.length - 1) / flagPerItem);

    for (let i = 0; i <= count; i += 1) {
      itemTab.items.push({
        type: "bitflags",
        overrideShift,
        flags: resource
          .slice(i * flagPerItem, i * flagPerItem + flagPerItem)
          .map((item) => ({
            offset: offset + bitToOffset(item.index),
            bit: item.index % 8,
            label: item.name,
          })),
      });
    }

    return itemTab;
  } else if ("id" in item && item.id === "inventory") {
    const itemTabs = item as ItemTabs;

    const resources = getResources();

    const itemTab = itemTabs.items[0] as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;
    const rareItems = itemTabs.items[1] as ItemTab;

    let overrideShift: { parent: number; shift: number } | undefined;
    let binary: Binary | undefined;

    if (platform === "gba") {
      itemInt.offset += 0x1dc7;
      binary = { bitStart: 0, bitLength: 7 };
      overrideShift = { parent: -1, shift: 0x400 };
    }

    itemTabs.items = [
      {
        name: "Weapons",
        items: resources.itemTypes
          .filter((type) => isInRange(type.index, 0x0, 0x9))
          .map((type) => ({
            name: type.name,
            type: "section",
            flex: true,
            items: resources.items
              .filter((item) => item.type === type.index)
              .map((item) => ({
                ...itemInt,
                id: `quantity-${item.index}`,
                name: item.name,
                binary,
                overrideShift,
              })),
          })),
      },
      ...resources.itemTypes
        .filter((type) => type.index >= 0xa)
        .map(
          (type) =>
            ({
              name: type.name,
              flex: true,
              items: resources.items
                .filter((item) => item.type === type.index)
                .map((item) => ({
                  ...itemInt,
                  id: `quantity-${item.index}`,
                  name: item.name,
                  binary,
                  overrideShift,
                })),
            }) as ItemTab,
        ),
    ];

    itemTabs.items.push(rareItems);

    return itemTabs;
  } else if ("id" in item && item.id === "bestiary") {
    const itemTab = item as ItemTab;

    if (platform !== "gba") {
      return itemTab;
    }

    const resources = getResources();

    const enemies = resources.enemies
      .filter((enemy) => enemy.bestiaryIndex !== -1)
      .sort((a, b) => a.bestiaryIndex! - b.bestiaryIndex!);

    const itemInt = itemTab.items[0] as ItemInt;

    const itemTabs = { type: "tabs", vertical: true, items: [] } as ItemTabs;

    const count = Math.floor((enemies.length - 1) / 20);

    for (let i = 0; i <= count; i += 1) {
      const start = i * 20;
      const end = Math.min(start + 20, enemies.length);

      itemTabs.items.push({
        name: `${(start + 1).leading0(2)}-${end.leading0(2)}`,
        flex: true,
        items: enemies.slice(start, end).map((enemy) => ({
          ...itemInt,
          name: `${enemy.bestiaryIndex?.leading0(2)} ${enemy.name}`,
          offset: itemInt.offset + enemy.index * 0x2,
        })),
      });
    }

    itemTab.items = [itemTabs];
    itemTab.hidden = false;

    return itemTab;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const shift = getShift(shifts);

    const level = getInt(shift + index * item.length + 0x8, "uint8");

    if (!isInRange(level, 1, 99)) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function onReady(): void {
  generateResources();
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/position-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    let [shift] = item.id.splitInt();

    if (type === "general") {
      shift *= -1;
    }

    const location = getInt(itemInt.offset + shift, "uint16") & 0x1ff;
    const isWorldmap = [0, 1].includes(location);

    itemInt.hidden =
      (type === "general" && isWorldmap) ||
      (type === "worldMap" && !isWorldmap);

    return itemInt;
  } else if ("id" in item && item.id?.match(/airshipCharacters-/)) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex] = item.id.splitInt();

    const names = getCharacterNames(slotIndex);

    const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      const character = getInt(itemString.offset - 0x2 + index * 0x25, "uint8");

      return {
        ...flag,
        label: names[index],
        disabled: character === 0xff,
      };
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    itemInt.disabled = shift === -1;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    if (shift === -1) {
      return [true, 0];
    }

    let percent = getInt(itemInt.offset + shift, "uint8");

    if (percent === 0xff) {
      percent = 100;
    }

    return [true, percent];
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const inventory = getInventory(itemInt.offset);

    const index = inventory.findIndex((index) => index === itemIndex);

    let quantity = 0;

    if (index !== -1) {
      quantity = getInt(itemInt.offset + index, "uint8", {
        binary: itemInt.binary,
      });
    }

    return [true, quantity];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/spell-/)) {
    const itemInt = item as ItemInt;

    const [partyIndex, spellIndex] = item.id.splitInt();

    let percent = parseInt(value);

    if (percent === 100) {
      percent = 0xff;
    }

    const shift = getSpellShift(itemInt.offset, partyIndex, spellIndex);

    setInt(itemInt.offset + shift, "uint8", percent);

    return true;
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [itemIndex] = item.id.splitInt();

    const quantity = parseInt(value);

    updateInventory(itemInt.offset, itemIndex, quantity);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const resources = getResources();

    const locationIndex = getInt(itemInt.offset, "uint16", {
      binary: itemInt.binary,
    });

    const location = resources.locations.find(
      (location) => location.index === locationIndex,
    );

    if (location) {
      setInt(itemInt.offset + 0x5c, "uint8", location.coordinates[0]);
      setInt(itemInt.offset + 0x5d, "uint8", location.coordinates[1]);
    }
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const resources = getResources();

    const characterIndex = getInt(itemInt.offset, "uint8");

    const character = resources.characters.find(
      (character) => character.index === characterIndex,
    );

    if (character) {
      setInt(itemInt.offset + 0x1, "uint8", character.graphicSet);
    }
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "characterGroup") {
    const itemInt = item as ItemInt;

    const group = getInt(itemInt.offset, "uint8", { binary: itemInt.binary });

    setInt(itemInt.offset, "bit", group !== 0 ? 1 : 0, { bit: 6 });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  if ("id" in item && item.id?.match(/checksumGba-/)) {
    checksum = 0x1;
  }

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function isGBASave(dataView: DataView, shift: number): boolean {
  const validator = [
    0x46, 0x49, 0x4e, 0x41, 0x4c, 0x20, 0x46, 0x41, 0x4e, 0x54, 0x41, 0x53,
    0x59, 0x20, 0x56, 0x49, 0x20, 0x20, 0x20, 0x20, 0x20, 0x41, 0x44, 0x56,
    0x41, 0x4e, 0x43, 0x45, 0x20, 0x20, 0x20, 0x20,
  ]; // "FINAL FANTASY VI     ADVANCE    "

  return checkValidator(validator, shift + 0x1f00, dataView);
}

function getResources(): Resources {
  return platform === "gba" ? gbaResources : snesResources;
}

function generateResources(): void {
  const resources = getResources();

  // Abilities

  updateResources("abilities", resources.abilities);

  // Characters

  const characters = resources.characters.reduce(
    (characters: Resource, character) => {
      characters[character.index] = character.name;

      return characters;
    },
    { 0xff: "-" },
  );

  updateResources("characters", characters);

  // Config

  updateResources("commandSettings", resources.configCommandSettings);
  updateResources("cursorPositions", resources.configCursorPositions);
  updateResources("reequips", resources.configReequips);

  // Espers

  const espers: Resource = { 0xff: "-" };
  const espersOrder: number[] = [0xff];

  resources.espers.forEach((esper) => {
    espers[esper.index] = esper.name;
    espersOrder.push(esper.index);
  });

  updateResources("espers", espers);
  updateResourceOrder("espers", espersOrder);

  // Inventory

  const bodies: Resource = { 0xff: "-" };
  const hands: Resource = { 0xff: "-" };
  const heads: Resource = { 0xff: "-" };
  const relics: Resource = { 0xff: "-" };

  const handsGroups: ResourceGroups = [];

  resources.itemTypes
    .filter((type) => isInRange(type.index, 0x0, 0xa))
    .forEach((type) => {
      handsGroups.push({ name: type.name, options: [] });
    });

  resources.items.forEach((item) => {
    if (isInRange(item.type, 0x0, 0xa)) {
      hands[item.index] = item.name;
      handsGroups[item.type].options.push(item.index);
    } else if (item.type === 0xb) {
      heads[item.index] = item.name;
    } else if (item.type === 0xc) {
      bodies[item.index] = item.name;
    } else if (item.type === 0xf) {
      relics[item.index] = item.name;
    }
  });

  updateResources("bodies", bodies);
  updateResources("hands", hands);
  updateResources("heads", heads);
  updateResources("relics", relics);
  updateResourcesGroups("hands", handsGroups);

  // Letters

  updateResources("letters", getRegionArray(resources.letters));

  // Locations

  const locations: Resource = {};
  const locationsOrder: number[] = [];
  const locationsGroups: ResourceGroups = [];

  resources.areas.forEach((area) => {
    locationsGroups.push({ name: area.name, options: [] });
  });

  resources.locations
    .sort((a, b) => a.order - b.order)
    .forEach((location) => {
      locations[location.index] = location.name;
      locationsGroups[location.area].options.push(location.index);
      locationsOrder.push(location.index);
    });

  updateResources("locations", locations);
  updateResourceOrder("locations", locationsOrder);
  updateResourcesGroups("locations", locationsGroups);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x10; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0x25,
      itemString.length,
      itemString.letterDataType,
      {
        resource: itemString.resource,
      },
    );

    if (!names[i].trim()) {
      names[i] = "???";
    }
  }

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

function getInventoryLength(): number {
  return platform === "gba" ? 0x120 : 0x100;
}

function getInventory(offset: number): number[] {
  const inventory: number[] = [];

  const length = getInventoryLength();

  const itemsOffset = offset - length;

  for (let i = 0x0; i < length; i += 0x1) {
    let itemIndex = getInt(itemsOffset + i, "uint8");

    if (platform === "gba") {
      itemIndex |= getInt(offset + i, "bit", { bit: 7 }) << 0x8;
    }

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
  const length = getInventoryLength();

  const index = inventory.findIndex((index) => index === itemIndex);

  if (platform === "gba") {
    value |= (itemIndex & 0x100) >> 0x1;
    itemIndex &= 0xff;
  }

  if (value && index !== -1) {
    setInt(offset + index, "uint8", value);
  } else if (value) {
    const index = inventory.findIndex((index) => index === 0xff);

    if (index !== -1) {
      setInt(offset - length + index, "uint8", itemIndex);
      setInt(offset + index, "uint8", value);
    }
  } else if (index !== -1) {
    setInt(offset - length + index, "uint8", 0xff);
    setInt(offset + index, "uint8", 0x0);
  }
}

function getSpellShift(
  offset: number,
  partyIndex: number,
  spellIndex: number,
): number {
  if (platform === "gba") {
    if (partyIndex < 0xc) {
      return partyIndex * 0x40;
    }

    return -1;
  }

  offset = offset - 0x46e - spellIndex + partyIndex * 0x25;

  const characterIndex = getInt(offset, "uint8");

  if (characterIndex < 0xc) {
    return characterIndex * 0x36;
  }

  return -1;
}
