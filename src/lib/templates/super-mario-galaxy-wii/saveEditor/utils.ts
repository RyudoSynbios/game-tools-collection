import { copyInt, getInt, getString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { capitalize } from "$lib/utils/format";

import { Item, ItemBitflag, ItemChecksum, ItemContainer } from "$lib/types";

let saveBlocks: { [blockName: string]: { [sectionName: string]: number } } = {};

export function beforeItemsParsing(): void {
  generateSaveBlocks();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id?.match(/characterSection-/)) {
    const [, , , type] = item.id.split("-");
    const [slotIndex, characterIndex] = item.id.splitInt();

    let character = "mario";

    if (characterIndex === 1) {
      character = "luigi";
    }

    const block = `${character}${slotIndex + 1}`;

    if (item.type === "bitflags") {
      item.flags.forEach((flag) => {
        flag.offset += saveBlocks[block][type];
        flag.label = flag.label.replace("{character}", capitalize(character));
      });
    } else if ("offset" in item) {
      if (item.name) {
        item.name = item.name.replace("{character}", capitalize(character));
      }
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

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/powerStars/)) {
    copyInt(flag.offset, flag.offset + 0x1, 0x1);
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

  for (let i = 0x0; i < 0x13; i += 0x1) {
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
