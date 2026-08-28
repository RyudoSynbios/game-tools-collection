import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { copyInt, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getSlotShiftsByIdentifier,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation";
import { round } from "$lib/utils/format";
import {
  getClosestItem,
  getItem,
  getResource,
  updateResources,
} from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemTabs,
  Resource,
} from "$lib/types";

import { carList, colorList, parts, partSubtypes } from "./utils/resource";

let garageOffset = 0x0;

export function beforeInitDataView(dataView: DataView): DataView {
  return unpackFile(dataView);
}

export function overrideGetRegions(): string[] {
  return customGetRegions("GT");
}

export function onInitFailed(): void {
  resetState();
}

export function onReady(): void {
  const currentCarItem = getItem("currentCar") as ItemInt;

  garageOffset = currentCarItem.offset;

  const slots = getInt(garageOffset + 0x2, "uint16");

  for (let i = slots; i < 0x64; i += 0x1) {
    clearCarData(i);
  }
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "credits" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.operations = [{ "*": 100 }];
    itemInt.max = 200000000000;
    itemInt.step = 100;

    return itemInt;
  } else if ("id" in item && item.id === "price" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.operations = undefined;
    itemInt.step = 100;

    return itemInt;
  } else if ("id" in item && item.id?.match(/license-/)) {
    const itemInt = item as ItemInt;

    const [license, test] = item.id.splitInt();

    itemInt.offset += license * 0x8 + test;

    return itemInt;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShiftsByIdentifier("GT");
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "carTabs") {
    const itemTabs = item as ItemTabs;

    const slotsItem = getItem(
      item.id.replace("carTabs", "carSlots"),
    ) as ItemInt;

    let slots = getInt(slotsItem.offset, "uint16");

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if ("id" in item && item.id === "color") {
    const itemInt = item as ItemInt;

    const colors = getResource("colorNames") as Resource;

    itemInt.disabled = Object.keys(colors).length === 1;

    return itemInt;
  } else if ("id" in item && item.id?.match(/part-/)) {
    const itemInt = item as ItemInt;

    const [partIndex] = item.id.splitInt();

    const sectionItem = getClosestItem("carSection", item) as ItemSection;
    const carItem = sectionItem.items[0] as ItemInt;

    const carIndex = getInt(carItem.offset, "uint8");

    const car = carList.find((car) => car.index === carIndex);

    itemInt.disabled = car?.parts[partIndex] === undefined;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "color") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "dirtiness") {
    const itemInt = item as ItemInt;

    let dirtiness = getInt(itemInt.offset, "uint16");

    dirtiness = round((dirtiness / 4096) * 100);

    return [true, dirtiness];
  } else if ("id" in item && item.id?.match(/part-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "raceCar") {
    const itemInt = item as ItemInt;

    let raceCarIndex = getInt(itemInt.offset, "uint16");

    if (raceCarIndex === 0x0) {
      return [true, 0x0];
    }

    const car = carList
      .sort((a, b) => b.raceIndex - a.raceIndex)
      .find((car) => car.raceIndex <= raceCarIndex);

    return [true, car ? car.raceIndex : 0x0];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/car-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    clearCarData(index);

    setInt(itemInt.offset, "uint8", value);

    return true;
  } else if ("id" in item && item.id === "dirtiness") {
    const itemInt = item as ItemInt;

    let dirtiness = parseInt(value);

    dirtiness = Math.ceil((dirtiness / 100) * 4096);

    setInt(itemInt.offset, "uint16", dirtiness);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/car-/)) {
    const [index] = item.id.splitInt();

    cleanGarageData(index);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0xaaaa;
  let checksum2 = 0x3770;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    let int = getInt(i, "uint8");

    checksum1 = (checksum1 + int) ^ (int << 0x8);

    for (let j = 0x0; j < 0x8; j += 0x1) {
      checksum2 <<= 0x1;

      if ((checksum2 & 0x10000) !== 0x0) {
        checksum2 ^= 0x11021;
      }

      checksum2 |= (int >> 0x7) & 0x1;

      int <<= 0x1;
    }
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return repackFile();
}

export function onReset(): void {
  resetState();
}

function cleanGarageData(index: number): void {
  const offset = garageOffset + 0x194 + index * 0x60;

  // Clean garage data

  let currentCar = getInt(garageOffset, "uint16");
  let carIndex = getInt(offset, "uint8");

  const slots = getInt(garageOffset + 0x2, "uint16");

  // If a car is removed and is not the last one on the list, we shift the data upwards
  if (carIndex === 0x0 && index + 1 < slots) {
    for (let i = index; i < 0x64; i += 0x1) {
      moveCarData(i + 0x1, i);
    }

    clearCarData(0x63);
  }

  // Update current car

  if (carIndex === 0x0 && currentCar >= index) {
    currentCar -= 0x1;
  }

  setInt(garageOffset, "uint16", currentCar);

  // Update count

  let count = 0;

  const countOffset = garageOffset + 0x194;

  for (let i = 0x0; i < 0x64; i += 0x1) {
    count += getInt(countOffset + i * 0x60, "uint8") !== 0x0 ? 0x1 : 0x0;
  }

  setInt(garageOffset + 0x2, "uint16", count);

  // Update names

  carIndex = getInt(offset, "uint8");

  updateResources("carNames");
  updateCarResources(carIndex);
}

function clearCarData(index: number): void {
  const offset = garageOffset + 0x194 + index * 0x60;

  for (let i = 0x0; i < 0x60; i += 0x4) {
    setInt(offset + i, "uint32", 0x0);
  }

  // Price
  setInt(garageOffset + 0x4 + index * 0x4, "uint32", 0x0);
}

export function getCarNames(): Resource {
  const names: Resource = {};

  const slotsItem = getItem("carSlots") as ItemInt;

  const slots = getInt(slotsItem.offset, "uint16");

  for (let i = 0x0; i < slots; i += 0x1) {
    const carIndex = getInt(slotsItem.offset + 0x192 + i * 0x60, "uint8");

    const car = carList.find((car) => car.index === carIndex);

    if (car) {
      names[i] = car.name;
    }
  }

  names[-1] = "-";

  return names;
}

export function getColorNames(carIndex: number): Resource {
  const names: Resource = { 0x0: "-" };

  const car = carList.find((car) => car.index === carIndex);

  car?.colors.forEach((colorIndex, index) => {
    names[index << 0x4] = colorList[colorIndex];
  });

  return names;
}

interface PartResource {
  name: string;
  values: Resource;
}

export function getPartResources(carIndex: number): PartResource[] {
  const car = carList.find((car) => car.index === carIndex);

  if (!car) {
    return [];
  }

  const resources: PartResource[] = parts.map((part) => ({
    name: part.resource,
    values: part.subtypes.reduce((values: Resource, subtype, index) => {
      if (index === 0) {
        values[0x0] = partSubtypes[subtype];
        return values;
      }

      const partIndex = car.parts[part.dataIndex + index - 1];

      if (partIndex !== undefined) {
        values[partIndex + 0x1] = partSubtypes[subtype];
      }

      return values;
    }, {}),
  }));

  return resources;
}

function moveCarData(indexSrc: number, indexDst: number): void {
  const carOffsetSrc = garageOffset + 0x194 + indexSrc * 0x60;
  const carOffsetDst = garageOffset + 0x194 + indexDst * 0x60;

  const priceffsetSrc = garageOffset + 0x4 + indexSrc * 0x4;
  const priceffsetDst = garageOffset + 0x4 + indexDst * 0x4;

  copyInt(carOffsetSrc, carOffsetDst, 0x60); // Car Data
  copyInt(priceffsetSrc, priceffsetDst, 0x4); // Price
}

export function onCarChange(index: number): void {
  const carItem = getItem(`car-${index}`) as ItemInt;

  const carIndex = getInt(carItem.offset, "uint8");

  updateCarResources(carIndex);
}

function updateCarResources(carIndex: number): void {
  const values = getColorNames(carIndex);
  const partResources = getPartResources(carIndex);

  updateResources("colorNames", values);

  if (partResources.length > 0) {
    partResources.forEach((resources) => {
      updateResources(resources.name, resources.values);
    });
  }
}
