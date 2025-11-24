import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getObjKey } from "$lib/utils/format";
import { getItem, getResource } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

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

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    return getSlotShifts("memory", shifts, index);
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/name/) && $gameRegion === 2) {
    const itemString = item as ItemString;

    let name = "";

    for (let i = 0x0; i < itemString.length * 0x2; i += 0x1) {
      const int = getInt(itemString.offset + i, "uint8");

      if (int === 0x0) {
        break;
      }

      if ([0x1, 0x2].includes(int)) {
        name += getString(itemString.offset + i, 0x1, "uint16", {
          letterBigEndian: true,
          resource: itemString.resource,
        });

        i += 0x1;
      } else {
        name += getString(
          itemString.offset + i,
          0x1,
          itemString.letterDataType,
          { resource: itemString.resource },
        );
      }
    }

    return [true, name];
  } else if ("id" in item && item.id?.match(/stats-/)) {
    const type = item.id.split("-")[1];

    const nameItem = getItem(
      item.id.replace(`stats-${type}`, "name"),
    ) as ItemInt;

    const offset = nameItem.offset - 0x18;

    const trophies = (getInt(offset, "uint24") & 0x3fffc0).toBitCount();
    const sRelics = (getInt(offset + 0x2, "uint24") & 0xffffc0).toBitCount();
    const gRelics = (getInt(offset + 0x5, "uint24") & 0x3ffff).toBitCount();
    const ctrTokens = (getInt(offset + 0x9, "uint24") & 0xffff0).toBitCount();
    const bossKeys = (getInt(offset + 0xb, "uint16") & 0x3c0).toBitCount();
    const oxide = (getInt(offset + 0xc, "uint16") & 0x4).toBitCount();
    const oxideFinal = (getInt(offset + 0xc, "uint16") & 0x8).toBitCount();
    const gems = (getInt(offset + 0xd, "uint8") & 0x7c).toBitCount();
    const bonus = (getInt(offset + 0xd, "uint16") & 0x780).toBitCount();

    let value = 0;

    switch (type) {
      case "completion":
        value += trophies * 2;
        value += sRelics * 2;
        value += gRelics === 18 ? 1 : 0;
        value += ctrTokens;
        value += bossKeys;
        value += oxide ? 2 : 0;
        value += oxideFinal ? 1 : 0;
        value += gems;
        value += bonus;
        break;
      case "trophies":
        value = trophies;
        break;
      case "bossKeys":
        value = bossKeys;
        break;
      case "relics":
        value = sRelics;
        break;
    }

    return [true, value];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/name/) && $gameRegion === 2) {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    let count = 0x0;

    for (let i = 0x0; i < itemString.length * 2; i += 0x1, count += 0x1) {
      const offset = itemString.offset + i;

      const index = Object.values(letters).findIndex(
        (letter) => letter === value[count],
      );

      let int = itemString.fallback as number;
      let letterDataType: "uint8" | "uint16" = "uint8";

      if (index !== -1) {
        int = parseInt(getObjKey(letters, index));

        if (int > 0xff) {
          letterDataType = "uint16";

          i += 0x1;
        }
      }

      setInt(offset, letterDataType, int, { bigEndian: true });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "adventureEvents") {
    const itemBitflags = item as ItemBitflags;

    const checked = getInt(flag.offset, "bit", { bit: flag.bit });

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const flagM2 = itemBitflags.flags[index - 2];
    const flagM1 = itemBitflags.flags[index - 1];
    const flagP1 = itemBitflags.flags[index + 1];
    const flagP2 = itemBitflags.flags[index + 2];
    const flagP3 = itemBitflags.flags[index + 3];

    if (checked) {
      switch (flag.label) {
        case "Gold Relic":
          setInt(flagM1.offset, "bit", checked, { bit: flagM1.bit });
          break;
        case "Platinum Relic":
          setInt(flagM2.offset, "bit", checked, { bit: flagM2.bit });
          setInt(flagM1.offset, "bit", checked, { bit: flagM1.bit });
          break;
        case "N. Oxide's Challenge":
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          break;
        case "N. Oxide's Final Challenge":
          setInt(flagM1.offset, "bit", checked, { bit: flagM1.bit });
          setInt(flagM2.offset, "bit", checked, { bit: flagM2.bit });
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          break;
      }
    } else {
      switch (flag.label) {
        case "Sapphire Relic":
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          setInt(flagP2.offset, "bit", checked, { bit: flagP2.bit });
          break;
        case "Gold Relic":
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          break;
        case "N. Oxide's Challenge":
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          setInt(flagP2.offset, "bit", checked, { bit: flagP2.bit });
          setInt(flagP3.offset, "bit", checked, { bit: flagP3.bit });
          break;
        case "N. Oxide's Final Challenge":
          setInt(flagP1.offset, "bit", checked, { bit: flagP1.bit });
          break;
      }
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8");

    for (let j = 0x7; j >= 0x0; j -= 0x1) {
      checksum <<= 0x1;

      const mustXor = (checksum & 0x10000) !== 0;

      checksum = checksum | ((int >> j) & 0x1);

      if (mustXor) {
        checksum ^= 0x11021;
      }
    }
  }

  checksum = ((checksum & 0xff) << 0x8) | (checksum >> 0x8);

  return formatChecksum(checksum, item.dataType);
}
