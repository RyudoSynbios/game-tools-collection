import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getPartialValue, makeOperations } from "$lib/utils/format";

import type {
  Item,
  ItemBitflag,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

let saveBlocks: { [blockName: string]: { [sectionName: string]: number } } = {};

export function beforeItemsParsing(): void {
  generateSaveBlocks();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/characterSection-/)) {
    const [, , type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    const block = `user${slotIndex + 1}`;

    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        flag.offset += saveBlocks[block][type];
      });
    } else if ("offset" in item) {
      item.offset += saveBlocks[block][type];
    }

    return item;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const offset = saveBlocks[`config${index + 1}`].CONF + 0xc;

    if (getInt(offset, "uint8") === 0x0) {
      return [true, [-1]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/record/)) {
    const itemInt = item as ItemInt;

    let int = getRecordValue(itemInt.offset, itemInt.operations !== undefined);

    if (itemInt.operations) {
      int = makeOperations(int, itemInt.operations);
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/record/)) {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    let int1 = 0x0;
    let int2 = 0x0;

    if (itemInt.operations) {
      const oldInt = getRecordValue(itemInt.offset, true);

      int = makeOperations(int, itemInt.operations, true);
      int = getPartialValue(oldInt, int, itemInt.operations!);

      int1 = int >> 0x10;
      int2 = int & 0xffff;
    } else {
      int1 = int & 0xffff;
      int2 = int >> 0x10;
    }

    setInt(itemInt.offset, "uint16", int1, { bigEndian: true });
    setInt(itemInt.offset + 0x4, "uint16", int2, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/worldMap/)) {
    const [slotIndex] = item.id.splitInt();

    const offset = saveBlocks[`user${slotIndex + 1}`].FLG1 + 0x2c;

    setInt(offset, "bit", 1, { bit: 7 });
  } else if ("id" in item && item.id?.match(/events/)) {
    const [slotIndex, galaOffset] = item.id.splitInt();

    if (galaOffset === 0x195 && flag.bit === 1) {
      const offset = saveBlocks[`user${slotIndex + 1}`].FLG1 + 0x72;

      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      setInt(offset, "bit", checked, { bit: 7 });
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum1 = 0x0;
  let checksum2 = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum1 += getInt(i, "uint16", { bigEndian: true });
    checksum2 += ~getInt(i, "uint16", { bigEndian: true });
  }

  const checksum = (checksum1 << 0x10) | (checksum2 & 0xffff);

  return formatChecksum(checksum, item.dataType);
}

export function onReset(): void {
  saveBlocks = {};
}

function generateSaveBlocks(): void {
  let sectionOffset = 0x10;

  for (let i = 0x0; i < 0x7; i += 0x1) {
    const blockName = getString(sectionOffset, 0xc, "uint8", {
      endCode: 0x0,
    });

    let offset = getInt(sectionOffset + 0xc, "uint32", { bigEndian: true });

    saveBlocks[blockName] = {};

    const typeCount = getInt(offset + 0x1, "uint8");

    offset += 0x4;

    for (let j = 0x0; j < typeCount; j += 0x1) {
      const sectionName = getString(offset, 0x4, "uint8");

      saveBlocks[blockName][sectionName] = offset;

      offset += getInt(offset + 0x8, "uint32", { bigEndian: true });
    }

    sectionOffset += 0x10;
  }
}

function getRecordValue(offset: number, isTime = false): number {
  const int1 = getInt(offset, "uint16", { bigEndian: true });
  const int2 = getInt(offset + 0x4, "uint16", { bigEndian: true });

  let int = (int2 << 0x10) | int1;

  if (isTime) {
    int = (int1 << 0x10) | int2;
  }

  return int;
}
