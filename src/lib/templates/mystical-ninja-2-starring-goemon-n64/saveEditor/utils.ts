import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { getInt, setBitflag, setBoolean, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  getMpkNoteShift,
  getRegionsFromMpk,
  isMpk,
  isUnpackedMpk,
  repackMpk,
  resetMpk,
  unpackMpk,
} from "$lib/utils/common/nintendo64/mpk";
import { isSrmMpk } from "$lib/utils/common/nintendo64/srm";
import { clone } from "$lib/utils/format";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  const format = isSrmMpk(dataView) ? "mpk" : "sra";

  return getHeaderShift(dataView, format);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  if (isMpk(dataView, shift)) {
    return unpackMpk(dataView, shift);
  } else {
    return byteswapDataView("sra", dataView);
  }
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  if (isUnpackedMpk()) {
    return getRegionsFromMpk();
  } else {
    const itemContainer = $gameTemplate.items[0] as ItemContainer;
    const itemTab = (itemContainer.appendSubinstance as ItemTab[])[0];
    const itemChecksum = clone(itemTab.items[0] as ItemChecksum);

    itemChecksum.offset += shift;
    itemChecksum.control.offsetStart += shift;
    itemChecksum.control.offsetEnd += shift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
    ) {
      return ["japan"];
    }

    return [];
  }
}

export function onInitFailed(): void {
  resetMpk();
}

export function initShifts(shifts: number[]): number[] {
  if (isUnpackedMpk()) {
    return getMpkNoteShift();
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "language") {
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

  if (item.id === "slots" && $gameRegion === 2) {
    return [true, [...shifts, -0xf0, index * 0x130]];
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/entryPassCount-total-/)) {
    const itemInt = item as ItemInt;

    let int = 0;

    for (let i = 0x0; i < 0x7; i += 0x1) {
      int += getInt(itemInt.offset + i, "uint8");
    }

    return [true, int];
  }

  return [false, undefined];
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "characters") {
    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    let int = 0x0;
    let offset = flag.offset - 0x106;

    if (flag.label === "Sasuke") {
      if (isChecked) {
        int = 0x3;
      } else {
        int = 0x2;

        setBitflag(flag.offset + 0x3, flag.bit, false);
      }
    } else if (flag.label === "Yae") {
      offset -= 0x3;

      if (isChecked) {
        int = 0x4;

        setBitflag(flag.offset - 0x3, flag.bit, true);
      } else {
        int = 0x3;
      }
    }

    setInt(offset, "uint8", int);
  } else if ("id" in item && item.id?.match(/costumes-/)) {
    const itemBitflags = item as ItemBitflags;

    const index = itemBitflags.flags.findIndex((f) => f.offset === flag.offset);

    if (index > 0) {
      const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

      const costumesBought = getItem(
        item.id.replace("costumes", "costumesBought"),
      ) as ItemBitflags;

      const costumesBoughtFlag = costumesBought.flags[index - 1];

      setBitflag(costumesBoughtFlag.offset, costumesBoughtFlag.bit, isChecked);
    }
  } else if (
    "id" in item &&
    item.id?.match(/entryPass-/) &&
    flag.label.match(/Entry Pass/)
  ) {
    const [, region, index] = item.id.split("-");

    let [, clearedOffset] = item.id.splitInt();

    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    if (item.id.match(/entryPass-ryugu-.-157/) && flag.bit === 1) {
      clearedOffset -= 0x1;
    }

    if (item.id.match(/entryPass-ryugu-.-157/) && flag.bit === 4) {
      setBitflag(flag.offset - 0x12, 7, isChecked);
    }

    if (item.id.match(/entryPass-ryugu-.-159/) && flag.bit === 5) {
      setBitflag(flag.offset - 0x11, 0, isChecked);
    }

    if (
      item.id.match(/entryPass-mafuIsland-.-175/) &&
      flag.label.match(/Checkpoint/)
    ) {
      clearedOffset -= 0x4;
    }

    if (
      item.id.match(/entryPass-underworld-.-188/) &&
      flag.label.match(/Checkpoint/)
    ) {
      clearedOffset -= 0x3;
    }

    if (flag.label.match(/Entry Pass: Stage Clear/) && clearedOffset) {
      setBoolean(flag.offset + clearedOffset, isChecked);
    }

    const entryPassCount = getItem(
      `entryPassCount-${region}-${index}`,
    ) as ItemInt;

    let int = getInt(entryPassCount.offset, "uint8");

    if (isChecked) {
      int += 1;
    } else {
      int -= 1;
    }

    setInt(entryPassCount.offset, "uint8", int);
  } else if ("id" in item && item.id?.match(/castleCleared-/)) {
    const [clearedOffset] = item.id.splitInt();

    const isChecked = getInt(flag.offset, "bit", { bit: flag.bit });

    setBoolean(flag.offset + clearedOffset, Boolean(isChecked));
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  const bitMask = 0x4c11db7;

  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    let int = getInt(i, "uint8", {}, dataView);

    if (dataView && i < item.control.offsetStart + 0x8) {
      int = 0x0;
    }

    checksum ^= int << 0x18;

    for (let j = 0; j < 8; j += 1) {
      if ((checksum & 0x80000000) === 0) {
        checksum = checksum << 0x1;
      } else {
        checksum = (checksum << 0x1) ^ bitMask;
      }
    }
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  if (isUnpackedMpk()) {
    return repackMpk();
  }

  return byteswapDataView("sra").buffer;
}

export function onReset(): void {
  resetMpk();
}
