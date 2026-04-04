import { copyInt, getBitflag, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { getShift } from "$lib/utils/parser";

import type {
  DataTypeUInt,
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
} from "$lib/types";

import { badges, locationList } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "fla");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("fla", dataView);
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "baseStats") {
    const itemInt = item as ItemInt;

    const calculate = getInt(itemInt.offset, "uint8");
    const base = getInt(itemInt.offset + 0x1, "uint8");

    itemInt.min = Math.max(1, calculate - base);

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
    const shift = getShift(shifts);

    let offset = -1;
    let bestSaveCount = 0;

    for (let i = 0x0; i < item.length * 0x8; i += item.length) {
      const saveIndex = getInt(shift + i + 0x38, "uint32", { bigEndian: true });
      const saveCount = getInt(shift + i + 0x3c, "uint32", { bigEndian: true });
      const check = getInt(shift + i + 0x80, "int32", { bigEndian: true });

      if (saveIndex === index && saveCount > bestSaveCount && check !== -1) {
        offset = i;
        bestSaveCount = saveCount;
      }
    }

    if (offset !== -1) {
      return [true, [...shifts, offset]];
    }

    return [true, [-1]];
  } else if (item.id === "party") {
    if (index >= 4) {
      return [true, [...shifts, (index + 1) * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/liLShoink-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const quantity = getInt(itemInt.offset - index - 0x1, "uint8");

    itemInt.disabled = index >= quantity;
    itemInt.resource = index < quantity ? "liLShoinks" : "empty";

    return itemInt;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id === "spirits") {
    const itemBitflags = item as ItemBitflags;

    const int = getInt(itemBitflags.flags[0].offset, "uint8");

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        flags.push({
          ...flag,
          checked: int > index,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/badges-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    let offset = itemBitflags.flags[0].offset;

    if (type === "equipped") {
      offset -= 0x154;
    }

    const inventory = getBadges(offset, type);

    const flags = badges.reduce((flags: ItemBitflagChecked[], badge) => {
      const checked = inventory.includes(badge.index);

      flags.push({
        offset,
        bit: badge.index,
        label: badge.name,
        checked,
        disabled: type === "equipped" && !checked && inventory.length >= 0x20,
      });

      return flags;
    }, []);

    return [true, flags];
  } else if ("id" in item && item.id?.match(/liLShoink-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "relatedStarPieces") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag) => {
        let checked = getBitflag(flag.offset, flag.bit);

        if (flag.label.match(/(Koopa Koot|Quizzes|Rip Cheato):/)) {
          checked = getInt(flag.offset, "uint8") >= flag.bit;
        }

        flags.push({
          ...flag,
          checked,
        });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id === "totalBadges") {
    const itemInt = item as ItemInt;

    const badges = getBadges(itemInt.offset, "obtained");

    return [true, badges.length];
  } else if ("id" in item && item.id === "totalRecipes") {
    const itemInt = item as ItemInt;

    let count = (getInt(itemInt.offset, "uint16") & 0xc0ff).toBitCount();
    count += (getInt(itemInt.offset + 0x4, "uint24") & 0xfeffff).toBitCount();
    count += getInt(itemInt.offset + 0x7, "uint8").toBitCount();
    count += (getInt(itemInt.offset + 0xa, "uint16") & 0xef03).toBitCount();

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const index = parseInt(value);

    const location = locationList[index];

    setInt(itemInt.offset, "uint32", index, { bigEndian: true });

    setInt(itemInt.offset + 0xe7e, "int16", location.coordinates[0], {
      bigEndian: true,
    });
    setInt(itemInt.offset + 0xe80, "int16", location.coordinates[1], {
      bigEndian: true,
    });
    setInt(itemInt.offset + 0xe82, "int16", location.coordinates[2], {
      bigEndian: true,
    });

    return true;
  } else if ("id" in item && item.id === "spirits") {
    const itemBitflags = item as ItemBitflags;

    let int = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    if (value) {
      int += 1;
    }

    setInt(flag.offset, "uint8", int);
    setInt(flag.offset + 0x1022, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "baseStats") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const calculate = getInt(itemInt.offset, "uint8");
    const base = getInt(itemInt.offset + 0x1, "uint8");

    const diff = int - calculate;

    setInt(itemInt.offset, "uint8", value);
    setInt(itemInt.offset + 0x1, "uint8", base + diff);

    return true;
  } else if ("id" in item && item.id?.match(/badges-/)) {
    const itemBitflags = item as ItemBitflags;

    const [, type] = item.id.split("-");

    let offset = itemBitflags.flags[0].offset;

    if (type === "equipped") {
      offset -= 0x154;
    }

    if (type === "obtained") {
      if (value) {
        updateBadge(offset, flag.bit, "add");
      } else {
        updateBadge(offset, flag.bit, "remove");
      }
    } else {
      if (value) {
        updateBadge(offset, flag.bit, "equip");
      } else {
        updateBadge(offset, flag.bit, "unequip");
      }
    }

    return true;
  } else if ("id" in item && item.id === "relatedStarPieces") {
    // Fake update to force checkboxes to keep their initial state
    copyInt(0x0, 0x0);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/savePreview-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const dataType = itemInt.dataType as DataTypeUInt;

    const int = getInt(itemInt.offset, dataType, { bigEndian: true });

    setInt(itemInt.offset + shift, dataType, int, { bigEndian: true });
  } else if ("id" in item && item.id === "koopaKoots") {
    const itemBitflags = item as ItemBitflags;

    let count = 0;

    itemBitflags.flags.forEach((flag) => {
      count += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    setInt(itemBitflags.flags[0].offset + 0x185, "uint8", count);
  } else if ("id" in item && item.id === "quizzes") {
    const itemInt = item as ItemInt;

    const quizzes = getInt(itemInt.offset, "uint16", { bigEndian: true });

    setInt(itemInt.offset + 0xf0e, "uint8", quizzes);
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x4) {
    if (
      (item.id === "checksum1" && i !== item.offset + 0x4) ||
      (item.id === "checksum2" && i !== item.offset - 0x4)
    ) {
      checksum += getInt(i, "uint32", { bigEndian: true });
    }
  }

  if (item.id === "checksum2") {
    checksum = ~checksum;
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("fla").buffer;
}

function getBadges(offset: number, type: string): number[] {
  const badges: number[] = [];

  let count = 0x80;

  if (type === "equipped") {
    offset += 0x154;
    count = 0x20;
  }

  for (let i = 0x0; i < count; i += 0x1) {
    const badgeIndex = getInt(offset + i * 0x2, "uint16", { bigEndian: true });

    if (badgeIndex !== 0x0) {
      badges.push(badgeIndex);
    }
  }

  return badges;
}

function updateBadge(
  offset: number,
  index: number,
  action: "add" | "remove" | "equip" | "unequip",
): void {
  const obtainedBadges = getBadges(offset, "obtained");
  const equippedBadges = getBadges(offset, "equipped");

  let count = 0x80;

  if (action.match(/equip/)) {
    offset += 0x154;
    count = 0x20;
  }

  for (let i = 0x0; i < count; i += 0x1) {
    const badgeIndex = getInt(offset + i * 0x2, "uint16", { bigEndian: true });

    if (action === "add" && badgeIndex === 0x0) {
      setInt(offset + i * 0x2, "uint16", index, { bigEndian: true });
      break;
    } else if (action === "remove" && badgeIndex === index) {
      setInt(offset + i * 0x2, "uint16", 0x0, { bigEndian: true });
      break;
    } else if (action === "equip" && badgeIndex === 0x0) {
      setInt(offset + i * 0x2, "uint16", index, { bigEndian: true });
      break;
    } else if (action === "unequip" && badgeIndex === index) {
      setInt(offset + i * 0x2, "uint16", 0x0, { bigEndian: true });
      break;
    }
  }

  if (action === "remove" && equippedBadges.includes(index)) {
    updateBadge(offset, index, "unequip");
  } else if (action === "equip" && !obtainedBadges.includes(index)) {
    updateBadge(offset - 0x154, index, "add");
  }
}
