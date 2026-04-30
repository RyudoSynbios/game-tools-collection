import { get } from "svelte/store";

import { gameTemplate } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
  Resource,
} from "$lib/types";

import { locationList } from "./utils/resource";

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;

  for (let i = 0x0; i < itemContainer.instances; i += 0x1) {
    const itemChecksum = clone(itemContainer.items[0]) as ItemChecksum;

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
      return ["usa_france_uk_australia", "japan", "germany"];
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id?.match(/manaSpiritTab-/)) {
    const itemTab = item as ItemTab;

    const [characterIndex] = item.id.splitInt();

    itemTab.disabled = characterIndex === 0;

    itemTab.items.forEach((item, index) => {
      const itemSection = item as ItemSection;

      itemSection.hidden =
        (characterIndex === 1 && index === 6) ||
        (characterIndex === 2 && index === 7);

      const itemBitflags = itemSection.items[2] as ItemBitflags;

      if (characterIndex === 1) {
        itemBitflags.flags[0].hidden = true;
        itemBitflags.flags[1].hidden = true;
        itemBitflags.flags[2].hidden = true;
      } else if (characterIndex === 2) {
        itemBitflags.flags[3].hidden = true;
        itemBitflags.flags[4].hidden = true;
        itemBitflags.flags[5].hidden = true;
      }
    });

    return itemTab;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8", {
      binary: { bitStart: 0, bitLength: 5 },
    });

    itemInt.disabled = itemIndex === 0x1f;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const spawn = getInt(itemInt.offset, "uint16");

    const location = locationList.find((location) =>
      location.spawns.includes(spawn),
    );

    return [true, location?.index || 0x0];
  } else if ("id" in item && item.id?.match(/equipped-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [, characterIndex] = item.id.splitInt();

    let index = 0xff;

    for (let i = 0x0; i < (type === "weapons" ? 0x8 : 0xb); i += 0x1) {
      const itemIndex = getInt(itemInt.offset + i, "uint8");
      const character = getInt(itemInt.offset + i, "uint8") >> 0x6;

      if (itemIndex !== 0xff && character === characterIndex + 0x1) {
        index = i;
        break;
      }
    }

    return [true, index];
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const index = parseInt(value);

    const location = locationList.find((location) => location.index === index);

    if (location) {
      setInt(itemInt.offset, "uint16", location.spawns[0]);
      setInt(itemInt.offset - 0x1a9, "uint16", location.preview, {
        bigEndian: true,
        binary: { bitStart: 4, bitLength: 8 },
      });
    }

    return true;
  } else if ("id" in item && item.id?.match(/equipped-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [, characterIndex] = item.id.splitInt();

    const int = parseInt(value);

    for (let i = 0x0; i < (type === "weapons" ? 0x8 : 0xb); i += 0x1) {
      const itemIndex = getInt(itemInt.offset + i, "uint8");
      const character = getInt(itemInt.offset + i, "uint8") >> 0x6;

      if (itemIndex !== 0xff && character === characterIndex + 0x1) {
        setInt(itemInt.offset + i, "uint8", 0x0, {
          binary: { bitStart: 6, bitLength: 2 },
        });
      }
    }

    setInt(itemInt.offset + int, "uint8", characterIndex + 0x1, {
      binary: { bitStart: 6, bitLength: 2 },
    });

    return true;
  } else if ("id" in item && item.id?.match(/equipment-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const itemIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    if (itemIndex !== 0x3f && previous === 0x3f) {
      setInt(itemInt.offset, "uint8", 0x0, {
        binary: { bitStart: 6, bitLength: 2 },
      });
    } else if (itemIndex === 0x3f) {
      setInt(itemInt.offset, "uint8", 0x3, {
        binary: { bitStart: 6, bitLength: 2 },
      });
    }
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const itemIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary,
    });

    if (itemIndex !== 0x1f && previous === 0x1f) {
      setInt(itemInt.offset, "uint8", 0x1, {
        binary: { bitStart: 5, bitLength: 3 },
      });
    } else if (itemIndex === 0x1f) {
      setInt(itemInt.offset, "uint8", 0x7, {
        binary: { bitStart: 5, bitLength: 3 },
      });
    }
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/characterName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id?.match(/equipment-/)) {
    const [slotIndex] = item.id.splitInt();

    updateInventoryNames(slotIndex);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`characterName-${slotIndex}-0`) as ItemString;

  for (let i = 0x0; i < 0x3; i += 0x1) {
    names[i] = getString(
      itemString.offset + i * 0xc,
      itemString.length,
      itemString.letterDataType,
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    ).trim();
  }

  names[0x80] = "-";

  return names;
}

export function getInventoryNames(slotIndex: number, type: string): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemItem = getItem(`equipped-${type}-${slotIndex}-0`) as ItemInt;

  if (type === "weapons") {
    const weaponTypes = [
      "gloves",
      "swords",
      "axes",
      "spears",
      "whips",
      "bows",
      "boomerangs",
      "javelins",
    ];

    for (let i = 0x0; i < 0x8; i += 0x1) {
      const resource = getResource(weaponTypes[i]) as Resource;

      const index = getInt(itemItem.offset + i, "uint8", {
        binary: { bitStart: 0, bitLength: 6 },
      });

      if (index !== 0x3f) {
        names[i] = resource[index];
      }
    }

    names[0xff] = "-";

    return names;
  }

  const resource = getResource(type) as Resource;

  for (let i = 0x0; i < 0xb; i += 0x1) {
    const index = getInt(itemItem.offset + i, "uint8", {
      binary: { bitStart: 0, bitLength: 6 },
    });

    if (index !== 0x3f) {
      names[i] = resource[index];
    }
  }

  names[0xff] = "-";

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
  updateInventoryNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

export function updateInventoryNames(slotIndex: number): void {
  const values1 = getInventoryNames(slotIndex, "accessories");
  const values2 = getInventoryNames(slotIndex, "armors");
  const values3 = getInventoryNames(slotIndex, "helmets");
  const values4 = getInventoryNames(slotIndex, "weapons");

  updateResources("inventoryAccessoryNames", values1);
  updateResources("inventoryArmorNames", values2);
  updateResources("inventoryHelmetNames", values3);
  updateResources("inventoryWeaponNames", values4);
}
