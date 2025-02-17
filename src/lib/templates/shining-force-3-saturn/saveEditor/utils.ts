import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSaves,
  getSlotShifts,
  isUnpackedMemorySystem,
  repackMemorySystem,
  resetMemorySystem,
  unpackMemorySystem,
} from "$lib/utils/common/saturn";
import { clone, getRegionArray } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemTab,
  ItemTabs,
  Resource,
  ResourceGroups,
} from "$lib/types";

import {
  itemsDetails as itemsDetailsS1,
  itemTypes as itemTypesS1,
} from "./utils/scenario1/resource";
import {
  itemsDetails as itemsDetailsS2,
  itemTypes as itemTypesS2,
} from "./utils/scenario2/resource";
import {
  itemsDetails as itemsDetailsS3,
  itemTypes as itemTypesS3,
} from "./utils/scenario3/resource";

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackMemorySystem(dataView);
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions = customGetRegions();

  if (regions.length > 0) {
    return regions;
  }

  // Check if save is a hook file
  for (let i = 0x0; i < 0x3; i += 0x1) {
    const itemChecksum = clone(
      ($gameTemplate.items[0] as ItemSection).items[0],
    ) as ItemChecksum;

    itemChecksum.offset -= 0x10;
    itemChecksum.control.offsetStart -= 0x10;
    itemChecksum.control.offsetEnd = [0x3288, 0x3f98, 0x5f38][i] - 0x10;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
    ) {
      switch (i) {
        case 0x0:
          return ["scenario1"];
        case 0x1:
          return ["scenario2"];
        case 0x2:
          return ["scenario3"];
      }
    }
  }

  return [];
}

export function onInitFailed(): void {
  resetMemorySystem();
}

export function overrideParseItem(
  item: Item & ItemTab,
  instanceIndex: number,
): Item | ItemTab {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  if ("id" in item && item.id === "slots" && isUnpackedMemorySystem()) {
    const itemContainer = item as ItemContainer;

    const saves = getSaves();

    itemContainer.instances = saves.length;
  } else if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    if ($gameRegion === 1) {
      itemChecksum.control.offsetEnd = 0x3f98;
    } else if ($gameRegion === 2) {
      itemChecksum.control.offsetEnd = 0x5f38;
    }

    return itemChecksum;
  } else if ("id" in item && item.id === "party") {
    const itemContainer = item as ItemContainer;

    if ($gameRegion === 1) {
      itemContainer.instances = 40;
    } else if ($gameRegion === 2) {
      itemContainer.instances = 59;
    }

    return itemContainer;
  } else if ("id" in item && item.id?.match(/friendship-/)) {
    const itemTab = item as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;

    itemTab.items = [];

    let offset =
      itemInt.offset + instanceIndex * (Math.max(0, instanceIndex - 1) / 2);

    const characters = getRegionArray(
      $gameTemplate.resources!.characters as Resource[],
    );

    for (let i = 0; i < Object.keys(characters).length - 1; i += 1) {
      const characterIndexReached = i >= instanceIndex;
      const characterIndex = i + (characterIndexReached ? 1 : 0);
      const newItemInt = clone(itemInt);

      if (i > 0 && (!characterIndexReached || i === instanceIndex)) {
        offset += 1;
      }

      if (characterIndexReached) {
        offset += characterIndex - 1;
      }

      newItemInt.name = characters[characterIndex] as string;
      newItemInt.offset = offset;

      itemTab.items.push(newItemInt);
    }

    return itemTab;
  } else if ("id" in item && item.id === "formation") {
    const itemTab = item as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;

    itemTab.items = [];

    const characters = getRegionArray(
      $gameTemplate.resources!.characters as Resource[],
    );

    let section = [];

    for (let i = 0; i < Object.keys(characters).length; i += 1) {
      const newItemInt = clone(itemInt);

      newItemInt.name = characters[i] as string;
      newItemInt.offset = itemInt.offset + i / 2;
      newItemInt.dataType = i % 2 === 0 ? "lower4" : "upper4";

      section.push(newItemInt);

      if (section.length % 20 === 0) {
        itemTab.items.push({
          type: "section",
          flex: true,
          items: section,
        });

        section = [];
      }
    }

    if (section.length > 0) {
      itemTab.items.push({
        type: "section",
        flex: true,
        items: section,
      });
    }

    return itemTab;
  } else if ("id" in item && item.id === "headquartersInventory") {
    const itemTab = item as ItemTab;
    const itemInt = itemTab.items[0] as ItemInt;

    const itemTabs = { type: "tabs", vertical: true, items: [] } as ItemTabs;

    const groups = getItemGroups();

    groups.forEach((group) => {
      itemTabs.items.push({
        name: group.name,
        flex: true,
        items: group.items.reduce((items: ItemInt[], item) => {
          const newItemInt = clone(itemInt);

          newItemInt.name = item.name;

          if ($gameRegion === 2) {
            if (item.index >= 0x54 && item.index <= 0x67) {
              newItemInt.offset += item.index + 0x42;
            } else if (item.index === 0xf3) {
              newItemInt.offset += 0xaa;
            } else if (item.index === 0x11e) {
              newItemInt.offset += 0xab;
            } else {
              newItemInt.offset += Math.ceil((item.index + 0x1) / 0x2) - 0x1;
              newItemInt.dataType = item.index % 2 === 0 ? "upper4" : "lower4";
              newItemInt.max = 9;
            }
          } else {
            newItemInt.offset += item.index;
          }

          items.push(newItemInt);

          return items;
        }, []),
      });
    });

    itemTab.items = [itemTabs];

    return itemTab;
  } else if ("id" in item && item.id === "scenario-1") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "slots") {
    if (isUnpackedMemorySystem()) {
      return getSlotShifts(index);
    }

    return [true, [-0x10]];
  } else if (item.id === "party" && $gameRegion === 2) {
    return [true, [...shifts, index * item.length + 0x11e0]];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x4, "uint8", value);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackMemorySystem();
}

export function onReset(): void {
  resetMemorySystem();
}

interface ItemGroup {
  name: string;
  items: {
    index: number;
    name: string;
    type: number;
  }[];
}

function getItemGroups(): ItemGroup[] {
  const $gameRegion = get(gameRegion);

  let itemsDetails;
  let itemTypes;

  switch ($gameRegion) {
    case 0:
      itemsDetails = itemsDetailsS1;
      itemTypes = itemTypesS1;
      break;
    case 1:
      itemsDetails = itemsDetailsS2;
      itemTypes = itemTypesS2;
      break;
    case 2:
      itemsDetails = itemsDetailsS3;
      itemTypes = itemTypesS3;
      break;
  }

  return Object.entries(itemTypes as { [key: string]: string }).reduce(
    (tabs: ItemGroup[], [key, value]) => {
      const offset = parseInt(key);
      const items = itemsDetails!.filter((item) => item.type === offset);

      tabs.push({ name: value, items });

      return tabs;
    },
    [],
  );
}

export function getItemResourceGroups(): ResourceGroups {
  const groups = getItemGroups();

  return groups.reduce((groups: ResourceGroups, group) => {
    groups.push({
      name: group.name,
      options: group.items.map((item) => item.index),
    });

    return groups;
  }, []);
}

export function setFriendship(index: number, value: number): void {
  const friendshipSection = getItem(`friendship-${index}`) as ItemSection;

  (friendshipSection.items as ItemInt[]).forEach((item) => {
    setInt(item.offset, "uint8", value);
  });
}
