import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  gameRegion,
} from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { clone } from "$lib/utils/format";
import { getItem, getShift, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
  Resource,
} from "$lib/types";

import { getCompressedData } from "./utils/compression/compress";
import { getDecompressedData } from "./utils/compression/decompress";
import { characterElements, progressionList } from "./utils/resource";

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

export function overrideParseItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id?.match(/cElements-/)) {
    const itemTab = item as ItemTab;
    const itemSection = itemTab.items[0] as ItemSection;

    const [characterIndex, level] = item.id.splitInt();

    itemTab.items = [];

    const baseElements = characterElements[characterIndex];
    const levelElements = characterElements[characterIndex][level];

    const baseCount = baseElements.reduce((count, elements, index) => {
      if (index < level) {
        count += elements.toBitCount();
      }

      return count;
    }, 0);

    const count = levelElements.toBitCount();
    const bitStart = levelElements
      .toBinary(16)
      .split("")
      .reverse()
      .findIndex((bit) => bit === "1");

    for (let i = 0x0; i < count; i += 0x1) {
      const newItemSection = clone(itemSection);

      const newStatusItem = newItemSection.items[0] as ItemInt;

      newStatusItem.offset += level * 0x2 + Math.floor((bitStart + i) / 0x8);
      newStatusItem.bit! = (bitStart + i) % 8;

      const newElementItem = newItemSection.items[1] as ItemInt;

      newElementItem.name = `Element ${i + 1}`;
      newElementItem.offset += (baseCount + i) * 0x2;

      const newQuantityItem = newItemSection.items[2] as ItemInt;

      newQuantityItem.offset += Math.floor((baseCount + i) / 0x2);
      newQuantityItem.dataType = i % 2 === 0 ? "lower4" : "upper4";

      itemTab.items.push(newItemSection);
    }

    return itemTab;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);

  if (item.id === "slots") {
    const slotShifts = getSlotShifts("correspondance", shifts, index, {
      leadingZeros: 1,
    });

    let shift = -1;

    if (isPsvHeader() && index === 0) {
      shift = getPsvHeaderShift();
    } else {
      shift = getShift(slotShifts[1] || []);
    }

    if (shift !== -1) {
      const compressedData = new DataView(
        $dataView.buffer.slice(shift + 0x5ac, shift + 0x1f21),
      );

      dataViewAlt.set({
        ...$dataViewAlt,
        [`slot${index}`]: new DataView(getDecompressedData(compressedData)),
      });

      $dataViewAltMetas[`slot${index}`] = { offset: shift + 0x5ac };
    }

    return slotShifts;
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/characterId-/)) {
    const itemInt = item as ItemInt;

    const [, character] = item.id.split("-");
    const [_, characterIndex] = item.id.splitInt();

    itemInt.hidden =
      (character === "serge" && characterIndex !== 0x0) ||
      (character === "pip" && characterIndex !== 0x2b);

    return itemInt;
  } else if ("id" in item && item.id?.match(/cColor-/)) {
    const itemInt = item as ItemInt;

    const [_, characterIndex] = item.id.splitInt();

    itemInt.hidden = characterIndex !== 0x2b;

    return itemInt;
  } else if ("id" in item && item.id?.match(/quantity-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    let offset = itemInt.offset - index + index * 0x2;

    if (type === "element") {
      offset -= 0x180;
    } else if (type === "item") {
      offset -= 0x300;
    }

    const itemIndex = getInt(offset, "uint16", {}, $dataViewAlt[itemInt.dataViewAltKey!]); // prettier-ignore

    itemInt.disabled = itemIndex === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    let progression = progressionList.findIndex(
      (progression) => progression.value > int,
    );

    if (progression === -1) {
      progression = progressionList.length;
    }

    return [true, progression - 1];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift, formationShift, slotIndex] = item.id.splitInt();

    const dataType = itemInt.dataType as "uint8" | "uint16";

    const int = getInt(itemInt.offset, dataType);

    setInt(itemInt.offset - shift, dataType, int);

    if (formationShift) {
      setInt(itemInt.offset - formationShift, "uint16", int);

      if (![0x0, 0x2b].includes(int)) {
        return;
      }

      // If current Save Preview is Formation, we update the portrait of Serge/Lynx/Pip

      const characterIdItem = getItem(
        `characterId-serge-${slotIndex}-0`,
      ) as ItemInt;

      const offset = characterIdItem.offset + int * 0xcc;

      const characterId = getInt(offset, "uint8", {}, $dataViewAlt[`slot${slotIndex}`]); // prettier-ignore

      setInt(itemInt.offset - shift, "uint8", characterId);
    }
  } else if ("id" in item && item.id?.match(/characterName-/)) {
    const itemString = item as ItemString;

    const [slotIndex, index] = item.id.splitInt();

    updateCharacterNames(slotIndex);

    if (index !== 0 || $gameRegion === 1) {
      return;
    }

    const savePreviewItem = getItem(
      `mainCharacterName-${slotIndex}`,
    ) as ItemString;

    for (let i = 0x0; i < 0xc; i += 0x1) {
      const int = getInt(itemString.offset + i, "uint8", {}, $dataViewAlt[itemString.dataViewAltKey!]); // prettier-ignore

      setInt(savePreviewItem.offset + i, "uint8", int);
    }
  } else if ("id" in item && item.id?.match(/characterId-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex, characterIndex] = item.id.splitInt();

    const characterId = getInt(itemInt.offset, "uint8", {}, $dataViewAlt[itemInt.dataViewAltKey!]); // prettier-ignore

    if (characterIndex === 0x0) {
      const color = characterId === 0x31 ? 0x10 : 0x8;

      setInt(itemInt.offset - 0x2c, "uint8", color, {}, itemInt.dataViewAltKey);
    }

    const formationItem = getItem(`formation-${slotIndex}-0`) as ItemInt;

    if (formationItem) {
      for (let i = 0x0; i < 0x3; i += 0x1) {
        const formation = getInt(formationItem.offset + i, "uint8");

        if (
          (characterIndex === 0x0 && [0x0, 0x31].includes(formation)) ||
          (characterIndex === 0x2b &&
            [0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30].includes(formation))
        ) {
          setInt(formationItem.offset + i, "uint8", characterId);
        }
      }
    }
  } else if ("id" in item && item.id?.match(/stats-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const dataType = itemInt.dataType as "uint8" | "uint16";

    const int = getInt(itemInt.offset, dataType, {}, $dataViewAlt[itemInt.dataViewAltKey!]); // prettier-ignore

    setInt(itemInt.offset + shift, dataType, int, {}, itemInt.dataViewAltKey);
  } else if ("id" in item && item.id?.match(/^(item|element)-/)) {
    const itemInt = item as ItemInt;

    const [type] = item.id.split("-");
    const [index] = item.id.splitInt();

    let offset = itemInt.offset + index - index * 0x2;

    if (type === "element") {
      offset += 0x180;
    } else if (type === "item") {
      offset += 0x300;
    }

    const dataView = $dataViewAlt[itemInt.dataViewAltKey!];

    const itemIndex = getInt(itemInt.offset, "uint16", {}, dataView);
    const quantity = getInt(offset, "uint8", {}, dataView);

    if (itemIndex === 0x0) {
      setInt(offset, "uint8", 0x0, {}, itemInt.dataViewAltKey);
    } else if (quantity === 0x0) {
      setInt(offset, "uint8", 0x1, {}, itemInt.dataViewAltKey);
    }
  }
}

export function beforeChecksum(): void {
  updateSlots();
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  const $dataViewAlt = get(dataViewAlt);

  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-characterName-0`) as ItemString;

  [...Array(44).keys()].forEach((index) => {
    names[index] = getString(
      itemString.offset + index * 0x10,
      itemString.length,
      "uint8",
      {
        letterIsAdaptive: itemString.letterIsAdaptive,
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
      $dataViewAlt[`slot${slotIndex}`],
    );
  });

  names[0xff] = "-";

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

function updateSlots(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);

  const dataViewTmp = new Uint8Array($dataView.buffer);

  Object.keys($dataViewAlt).forEach((key) => {
    if (!key.match(/^slot/)) {
      return;
    }

    const slotIndex = parseInt(key.replace("slot", ""));

    const compressedData = getCompressedData($dataViewAlt[`slot${slotIndex}`]);

    dataViewTmp.set(
      compressedData,
      $dataViewAltMetas[`slot${slotIndex}`]!.offset,
    );
  });

  dataView.set(new DataView(dataViewTmp.buffer));
}
