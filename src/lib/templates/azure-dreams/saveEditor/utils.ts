import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { copyInt, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone, isInRange } from "$lib/utils/format";
import { getItem, getShift, updateResources } from "$lib/utils/parser";

import type {
  DataTypeUInt,
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/^name/) && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.regex = undefined;
    itemString.resource = "letters";

    return itemString;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const itemChecksum = clone(item.items[0]) as ItemChecksum;

    const shift = getShift(shifts) + index * item.length;

    itemChecksum.offset += shift;

    const checksum = getInt(itemChecksum.offset, "uint16");

    if (checksum === 0xffff) {
      return [true, [-1]];
    }
  } else if (item.id?.match(/monstersTabs-/)) {
    const [slotIndex] = item.id.splitInt();

    const offset = getShift(shifts) + 0xb1;

    let count = 0;

    for (let i = 0x0; i < 0x14; i += 0x1) {
      const status = getInt(offset + i * 0x40, "uint8");

      if (status && count === index) {
        return [true, [...shifts, i * item.length]];
      } else if (status) {
        count += 0x1;
      }
    }

    return [true, [-1]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const itemIndex = getInt(itemInt.offset, "uint8");

    let offset = itemInt.offset - index * 0x4;

    if (type === "items") {
      offset -= 0x50f;
    } else if (type === "safe") {
      offset -= 0x55e;
    }

    const count = getInt(offset, "uint8");

    itemInt.resource = itemIndex === 0x60 ? "itemFamiliar" : "items";
    itemInt.disabled = index >= count || itemIndex === 0x60;

    return itemInt;
  } else if ("id" in item && item.id === "itemSpecies") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x1, "uint8");

    itemInt.disabled = itemIndex === 0x60;
    itemInt.hidden = !isFamiliar(itemIndex);

    return itemInt;
  } else if ("id" in item && item.id === "itemValue") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x2, "uint8");

    itemInt.name = "Value";
    itemInt.dataType = "uint8";
    itemInt.min = 0;
    itemInt.max = 255;
    itemInt.hidden = !isInRange(itemIndex, 0x52, 0x55);

    if (isEquipment(itemIndex)) {
      if (itemIndex === 0x53) {
        itemInt.name = "Defense";
      } else if ([0x54, 0x55].includes(itemIndex)) {
        itemInt.name = "Attack";
      }

      itemInt.dataType = "int8";
      itemInt.min = -99;
      itemInt.max = 99;
    }

    return itemInt;
  } else if ("id" in item && item.id === "itemEquipment") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x3, "uint8");

    itemInt.hidden = !isEquipment(itemIndex);

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    if (isFamiliar(itemIndex)) {
      return [true, itemIndex];
    }
  } else if ("id" in item && item.id === "itemValue") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x2, "uint8");
    let int = getInt(itemInt.offset, "uint8");

    if (isEquipment(itemIndex)) {
      if (int >= 0x80) {
        int -= 0x80;
      } else {
        int = int - 0x80;
      }
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "itemValue") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    const itemIndex = getInt(itemInt.offset - 0x2, "uint8");

    if (isEquipment(itemIndex)) {
      if (int >= 0x0) {
        int += 0x80;
      } else {
        int = int - 0x80;
      }
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    let count = 0;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      if (getInt(itemString.offset + i, "uint8") !== 0x0) {
        count += 1;
      } else {
        break;
      }
    }

    setInt(itemString.offset - 0x1, "uint8", count);

    if (type) {
      if (type === "kou") {
        copyInt(itemString.offset - 0x1, itemString.offset - 0x21, 0x9);
      }

      updateFamiliarNames(slotIndex);
    }
  } else if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const dataType = itemInt.dataType as DataTypeUInt;

    const int = getInt(itemInt.offset, dataType);

    setInt(itemInt.offset - shift, dataType, int);
  } else if ("id" in item && item.id?.match(/itemSlots-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    let offset = itemInt.offset;

    if (type === "items") {
      offset += 0x50f;
    } else if (type === "safe") {
      offset += 0x55e;
    }

    const count = getInt(itemInt.offset, "uint8");

    for (let i = count; i < 0x14; i += 0x1) {
      setInt(offset + i * 0x4, "uint16", 0x0);
    }
  } else if ("id" in item && item.id === "highestFloor") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset + 0x5fe);
  } else if ("id" in item && item.id === "houseSize") {
    const itemInt = item as ItemInt;

    const size = getInt(itemInt.offset, "uint8", { binary: itemInt.binary });

    let beds = 4;

    if (size === 0x1) {
      beds = 12;
    } else if (size === 0x2) {
      beds = 20;
    }

    setInt(itemInt.offset - 0x5f5, "uint8", beds);
  }
}

export function beforeChecksum(): void {
  updateParty();
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

export function getFamiliarNames(type: string, slotIndex: number): Resource {
  if (slotIndex === undefined) {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`name-${type}-${slotIndex}-0`) as ItemString;

  let count = 0x5;
  let length = 0x60;

  if (type === "stable") {
    count = 0x14;
    length = 0x40;
  }

  let offset = itemString.offset - 0x2;
  let index = 0x0;

  for (let i = 0x0; i < count; i += 0x1) {
    const status = getInt(offset + i * length, "uint8");

    if (type === "party" || status) {
      names[index] = getString(
        itemString.offset + i * length,
        itemString.length,
        itemString.letterDataType,
        {
          endCode: itemString.endCode,
          resource: itemString.resource,
        },
      );

      index += 0x1;
    }
  }

  return names;
}

export function getFloorNames(): Resource {
  const names: Resource = {};

  names[0x0] = "Monsbaiya";

  for (let i = 0x1; i < 0x1f; i += 0x1) {
    names[i] = `${i}F`;
  }

  names[0x1f] = "The floor of the Sky";

  for (let i = 0x81; i < 0xe4; i += 0x1) {
    names[i] = `B${i - 0x80}`;
  }

  return names;
}

function isEquipment(itemIndex: number): boolean {
  return isInRange(itemIndex, 0x53, 0x55);
}

function isFamiliar(itemIndex: number): boolean {
  return isInRange(itemIndex, 0x20, 0x3f) || itemIndex === 0x60;
}

export function onSlotChange(slotIndex: number): void {
  updateFamiliarNames(slotIndex);
}

function updateFamiliarNames(slotIndex: number): void {
  const values1 = getFamiliarNames("party", slotIndex);
  const values2 = getFamiliarNames("stable", slotIndex);

  updateResources("partyFamiliars", values1);
  updateResources("stableFamiliars", values2);
}

function updateParty(): void {
  for (let i = 0; i < 2; i += 1) {
    const slotsItem = getItem(`monstersSlots-${i}`) as ItemInt;

    const slots = getInt(slotsItem.offset - 0x1, "uint8");

    const stableOffset = slotsItem.offset + 0x11;
    const partyOffset = slotsItem.offset + 0x622;

    if (!isInRange(slots, 1, 5)) {
      return;
    }

    let count = 0;

    for (let j = 0x0; j < 0x14; j += 0x1) {
      const offsetSrc = stableOffset + j * 0x40;

      const stableIndex = getInt(offsetSrc + 0x1d, "uint8");
      const status = getInt(offsetSrc - 0x1, "uint8");

      if (status === 0x2) {
        let offsetDst = partyOffset;

        for (let k = 0x0; k < 0x5; k += 0x1) {
          const partyIndex = getInt(offsetDst + 0x1d, "uint8");

          if (partyIndex === stableIndex) {
            break;
          }

          offsetDst += 0x60;
        }

        copyInt(offsetSrc, offsetDst, 0x3f);

        count += 1;
      }

      if (count === slots) {
        break;
      }
    }
  }
}
