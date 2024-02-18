import { getBitflag, getInt, setBitflag, setInt } from "$lib/utils/bytes";
import { getHeaderShift } from "$lib/utils/common/gameBoyAdvance";

import type { Item, ItemBitflag, ItemBitflags, ItemInt } from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView);
}

export function overrideGetInt(
  item: Item,
): [boolean, number | (ItemBitflag & { checked: boolean })[] | undefined] {
  if ("id" in item && item.id === "unlockedModes") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked: getBitflag(flag.offset, flag.bit),
        });

        return flags;
      },
      [],
    );

    if (flags[1].checked) {
      flags[0].checked = true;
    }

    return [true, flags];
  } else if ("id" in item && item.id === "unlockedDifficulties") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: (ItemBitflag & { checked: boolean })[], flag) => {
        flags.push({
          ...flag,
          checked: getBitflag(flag.offset, flag.bit),
        });
        return flags;
      },
      [],
    );

    if (flags[0].checked && !flags[1].checked) {
      flags[0].checked = false;
      flags[1].checked = false;
    } else if (!flags[0].checked && flags[1].checked) {
      flags[0].checked = true;
      flags[1].checked = false;
    }

    return [true, flags];
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint16") & 0x3fff;

    return [true, int];
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8");

    return [true, int !== 0xff ? 0x0 : 0x1];
  } else if ("id" in item && item.id === "book") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0x7f;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "unlockedModes") {
    if (flag.bit === 0 && !value) {
      setBitflag(flag.offset, 0, false);
      setBitflag(flag.offset, 1, false);
    } else if (flag.bit === 0 && value) {
      setBitflag(flag.offset, 0, true);
      setBitflag(flag.offset, 1, false);
    } else if (flag.bit === 1 && !value) {
      setBitflag(flag.offset, 0, true);
      setBitflag(flag.offset, 1, false);
    } else if (flag.bit === 1 && value) {
      setBitflag(flag.offset, 0, false);
      setBitflag(flag.offset, 1, true);
    }

    return true;
  } else if ("id" in item && item.id === "unlockedDifficulties") {
    if (flag.bit === 6 && !value) {
      setBitflag(flag.offset, 6, false);
      setBitflag(flag.offset, 7, false);
    } else if (flag.bit === 6 && value) {
      setBitflag(flag.offset, 6, false);
      setBitflag(flag.offset, 7, true);
    } else if (flag.bit === 7 && !value) {
      setBitflag(flag.offset, 6, false);
      setBitflag(flag.offset, 7, true);
    } else if (flag.bit === 7 && value) {
      setBitflag(flag.offset, 6, true);
      setBitflag(flag.offset, 7, true);
    }

    return true;
  } else if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value) + (getInt(itemInt.offset, "uint16") & 0xc000);

    setInt(itemInt.offset, "uint16", int);

    let intPreview = 0x0;

    switch (int) {
      case 0x110c:
      case 0x110d:
      case 0x1c16:
      case 0x1c17:
        intPreview = 0x0;
        break;
      case 0x1022:
      case 0x1023:
        intPreview = 0x1;
        break;
      case 0x1728:
      case 0x1729:
        intPreview = 0x2;
        break;
      case 0x0838:
      case 0x0839:
      case 0x0e3e:
      case 0x0e3f:
        intPreview = 0x3;
        break;
      case 0x2120:
      case 0x2121:
        intPreview = 0x4;
        break;
      case 0x1d58:
      case 0x1d59:
        intPreview = 0x5;
        break;
      case 0x1656:
      case 0x1657:
        intPreview = 0x6;
        break;
      case 0x115a:
      case 0x115b:
        intPreview = 0x7;
        break;
      case 0x0f6e:
      case 0x0f6f:
      case 0x1872:
      case 0x1873:
        intPreview = 0x8;
        break;
      case 0x153c:
      case 0x153d:
      case 0x1c22:
      case 0x1c23:
        intPreview = 0x9;
        break;
    }

    setInt(itemInt.offset - 0x28c, "uint8", intPreview);

    return true;
  } else if ("id" in item && item.id === "character") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset - 0x111, "uint8");

    if (value === "0") {
      setInt(itemInt.offset, "uint8", level);
      setInt(itemInt.offset + 0x2a2, "uint8", 0x0);
    } else if (value === "1") {
      setInt(itemInt.offset, "uint8", 0xff);
      setInt(itemInt.offset + 0x2a2, "uint8", 0xff);
    }

    return true;
  } else if ("id" in item && item.id === "book") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    int += getBitflag(itemInt.offset, 7) ? 0x80 : 0x0;

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset + 0xf4, "uint32", value);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const isJuste = getInt(itemInt.offset + 0x111, "uint8") !== 0xff;

    if (isJuste) {
      const value = getInt(itemInt.offset, "uint8");

      setInt(itemInt.offset + 0x111, "uint8", value);
    }
  }
}
