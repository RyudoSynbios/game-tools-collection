import moment from "moment";
import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  bitToOffset,
  getInt,
  getIntFromArray,
  getString,
  setInt,
} from "$lib/utils/bytes";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

import Abilities from "./components/Abilities.svelte";
import { unitTypeList } from "./utils/jobs";
import { inventoryList, propositionList } from "./utils/resource";

const BASE_TIME = "1970-01-01 00:00:00";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  return customGetRegions(dataView, shift);
}

export function initShifts(shifts: number[]): number[] {
  if (isPsvHeader()) {
    shifts = [...shifts, getPsvHeaderShift()];
  }

  return shifts;
}

export function getComponent(component: string): typeof Abilities | undefined {
  if (component === "Abilities") {
    return Abilities;
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/name|Name/) && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.length = 0x8;

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
    return getSlotShifts("correspondance", shifts, index, {
      overrideIndex: [0x41 + index],
    });
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/unitJob-/)) {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0x2, "uint8");

    itemInt.name = type !== 0x82 ? "Job" : "Monster";
    itemInt.resource = type !== 0x82 ? "jobs" : "monsters";

    return itemInt;
  } else if ("id" in item && item.id?.match(/propositionsTabs-/)) {
    const itemTabs = item as ItemTabs;

    const slotsItem = getItem(item.id.replace("Tabs", "Slots")) as ItemInt;

    const slots = getInt(slotsItem.offset, "uint8");

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if ("id" in item && item.id?.match(/propositionUnit-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const units = getInt(itemInt.offset - index, "uint8");

    const isDisabled = index > units;

    itemInt.resource = isDisabled ? "empty" : "unitNames";
    itemInt.disabled = index > units;
  } else if ("id" in item && item.id?.match(/^start-/)) {
    const itemInt = item as ItemInt;

    const [, type, , unit] = item.id.split("-");
    const [index] = item.id.splitInt();

    const offset =
      itemInt.offset -
      getDateOffset(index, unit as "days" | "months") +
      getBraveStoryOffset(index, type);

    let bit = 0x0;

    switch (type) {
      case "job":
        bit = index % 2 === 0 ? 2 : 6;
        break;
      case "land":
        bit = index % 8;
        break;
      case "treasure":
        bit = (index + 1) % 8;
        break;
    }

    const isDisabled = !getInt(offset, "bit", { bit });

    if (unit === "months") {
      itemInt.resource = isDisabled ? "empty" : "months";
    }

    itemInt.disabled = isDisabled;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/birthday-/)) {
    const itemInt = item as ItemInt;

    const [, unit] = item.id.split("-");

    const days = getInt(itemInt.offset, "uint16", { binary: itemInt.binary });

    const time = moment(BASE_TIME)
      .add(days, "days")
      .format(unit === "months" ? "MM" : "DD");

    return [true, parseInt(time)];
  } else if ("id" in item && item.id === "hand") {
    const itemInt = item as ItemInt;

    const int1 = getInt(itemInt.offset, "uint8");
    const int2 = getInt(itemInt.offset + 0x1, "uint8");

    const int = int1 !== 0xff ? int1 : int2;

    return [true, int];
  } else if ("id" in item && item.id?.match(/propositionUnit-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/^start-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/birthday-/)) {
    const itemInt = item as ItemInt;

    const [, unit] = item.id.split("-");

    const days = dateToDays(itemInt, unit as "days" | "months", value);

    setInt(itemInt.offset, "uint16", days, { binary: itemInt.binary });

    return true;
  } else if ("id" in item && item.id === "hand") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const hand = inventoryList[0].items.find(
      (item) => item.index === int + 0x1,
    );

    setInt(itemInt.offset, "uint8", hand?.subtype !== 0x14 ? int : 0xff);
    setInt(itemInt.offset + 0x1, "uint8", hand?.subtype === 0x14 ? int : 0xff);

    return true;
  } else if ("id" in item && item.id?.match(/propositionsSlots-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset, "uint8", int);

    // Clear the previous propositions
    for (let i = previous; i < int; i += 0x1) {
      setInt(itemInt.offset + i * 0x9 + 0x1, "uint8", 0x0);
      setInt(itemInt.offset + i * 0x9 + 0x2, "uint32", 0x0);
      setInt(itemInt.offset + i * 0x9 + 0x6, "uint32", 0x0);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/currentDate-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const date = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0x1828 - shift, "uint8", date);
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x1832, "uint8", location);
  } else if ("id" in item && item.id?.match(/unitName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateUnitNames(slotIndex);
  } else if ("id" in item && item.id?.match(/unitType-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, index] = item.id.splitInt();

    const type = getInt(itemInt.offset, "uint8");

    const unitType = unitTypeList.find((unitType) => unitType.index === type);

    let job = getInt(itemInt.offset + 0x2, "uint8");

    if (unitType) {
      if (type < 0x50) {
        job = unitType?.index;
      } else if ([0x80, 0x81].includes(type) && (job < 0x4a || job > 0x5d)) {
        job = 0x4a;
      } else if (type === 0x82) {
        job = 0x5e;
      }

      setInt(itemInt.offset + 0x4, "uint8", 1 << unitType.gender, {
        binary: { bitStart: 5, bitLength: 3 },
      });
    } else {
      job = 0x0;
    }

    setInt(itemInt.offset + 0x1, "uint8", type !== 0x0 ? index : 0xff);
    setInt(itemInt.offset + 0x2, "uint8", job);

    updateUnitNames(slotIndex);
  } else if ("id" in item && item.id?.match(/unitJob-/)) {
    const itemInt = item as ItemInt;

    const [unitIndex] = item.id.splitInt();

    if (unitIndex === 0) {
      const job = getInt(itemInt.offset, "uint8");

      setInt(itemInt.offset - 0x374, "uint8", job);
    }
  } else if ("id" in item && item.id?.match(/unitLevel-/)) {
    const itemInt = item as ItemInt;

    const [unitIndex] = item.id.splitInt();

    if (unitIndex === 0) {
      const level = getInt(itemInt.offset, "uint8");

      setInt(itemInt.offset - 0x387, "uint8", level);
    }
  } else if ("id" in item && item.id?.match(/propositionsSlots|proposition-/)) {
    const [slotIndex] = item.id.splitInt();

    updatePropositionNames(slotIndex);
  } else if ("id" in item && item.id?.match(/braveStory-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const offset =
      itemInt.offset +
      getDateOffset(index, "days") -
      getBraveStoryOffset(index, type);

    setInt(offset, "uint16", 0x21, {
      binary: { bitStart: (index * 9) % 8, bitLength: 9 },
    });
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  const buffer = new Uint8Array([
    0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
  ]);
  let buffer_index = 0x0;

  let offset = item.control.offsetStart;

  for (let i = 0x0; i < 0x3c; i += 0x1) {
    let var1 = 0x0;

    for (let j = 0x0; j < 0x400; j += 0x1) {
      const int = getInt(offset, "uint8") >> (0x7 - (j % 0x8));

      if ((int & 0x1) !== 0x0) {
        var1 += 0x1;
      }

      if ((j + 0x1) % 0x8 === 0x0) {
        offset += 0x1;
      }
    }

    const var2 = 0x1 << (0x7 - (i % 0x8));

    buffer[buffer_index] &= ~var2;

    if ((var1 & 0x1) !== 0x0) {
      buffer[buffer_index] |= var2;
    }

    if ((i + 0x1) % 0x8 === 0x0) {
      buffer_index += 0x1;
    }
  }

  const low = getIntFromArray(buffer, 0x0, "uint32") >>> 0x0;
  const high = getIntFromArray(buffer, 0x4, "uint32") >>> 0x0;

  return BigInt(`0x${high.toHex(8)}${low.toHex(8)}`);
}

function dateToDays(
  item: ItemInt,
  unit: "days" | "months",
  value: string,
): number {
  const otherUnit = unit === "months" ? "days" : "months";

  let time = parseInt(value);

  const previousDays = getInt(item.offset, "uint16", {
    binary: item.binary,
  });

  let otherTime = parseInt(
    moment(BASE_TIME)
      .add(previousDays, "days")
      .format(otherUnit === "months" ? "MM" : "DD"),
  );

  if (unit === "months") {
    time -= 1;
  } else {
    otherTime -= 1;
  }

  return (
    moment(BASE_TIME)
      .add(time, unit)
      .add(otherTime, otherUnit)
      .diff(moment(BASE_TIME), "days") - 1
  );
}

export function getDateOffset(index: number, type: "days" | "months"): number {
  if (type === "months") {
    return bitToOffset(5 + index * 0x9);
  }

  return bitToOffset(index * 0x9);
}

export function getBraveStoryOffset(index: number, type: string): number {
  switch (type) {
    case "job":
      return 0x1975 + Math.floor(index / 0x2);
    case "land":
      return 0x1985 + bitToOffset(index);
    case "treasure":
      return 0x19b4 + bitToOffset(1 + index);
  }

  return 0x0;
}

export function getPropositionNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const propositionItem = getItem(`slot-${slotIndex}-proposition-0`) as ItemInt;

  const slots = getInt(propositionItem.offset - 0x2, "uint8");

  for (let i = 0x0; i < 0x8; i += 0x1) {
    const index = getInt(propositionItem.offset + i * 0x9, "uint8");

    const proposition = propositionList.find(
      (proposition) => proposition.index === index,
    );

    if (i < slots && proposition) {
      names[i] = proposition.name;
    }
  }

  return names;
}

export function getUnitNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-unitName-0`) as ItemString;

  for (let i = 0x0; i < 0x14; i += 0x1) {
    const offset = itemString.offset + i * 0xe0;

    // prettier-ignore
    if (getInt(offset - 0xbd, "uint8") !== 0xff) {
      names[i] = getString(offset, itemString.length, itemString.letterDataType, {
        letterIsAdaptive: itemString.letterIsAdaptive,
        endCode: itemString.endCode,
        resource: "letters",
      }).trim();

      if (i >= 0x10) {
        names[i] += " (Guest)";
      }
    }
  }

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updatePropositionNames(slotIndex);
  updateUnitNames(slotIndex);
}

export function onUnitChange(tabIndex: number, itemId: string): void {
  const [slotIndex] = itemId.splitInt();

  const nameItem = getItem(`slot-${slotIndex}-unitName-${tabIndex}`) as ItemInt;

  const registeredNumber = getInt(nameItem.offset - 0xbd, "uint8");

  if (registeredNumber === 0xff) {
    setInt(nameItem.offset - 0xbe, "uint8", 0x0);
  }
}

export function updatePropositionNames(slotIndex: number): void {
  const values = getPropositionNames(slotIndex);

  updateResources("propositionNames", values);
}

export function updateUnitNames(slotIndex: number): void {
  const values = getUnitNames(slotIndex);

  updateResources("unitNames", values);
}
