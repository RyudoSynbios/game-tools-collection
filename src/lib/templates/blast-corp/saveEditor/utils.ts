import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import {
  cloneDataView,
  getInt,
  getIntFromArray,
  setInt,
} from "$lib/utils/bytes";
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
import { mergeUint8Arrays } from "$lib/utils/format";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
} from "$lib/types";

const SAVE_FORMAT = "eep";

let hasEep = false;

export function initHeaderShift(dataView: DataView): number {
  const format = isSrmMpk(dataView) ? "mpk" : SAVE_FORMAT;

  return getHeaderShift(dataView, format);
}

export function beforeInitDataView(
  dataView: DataView,
  shift: number,
): DataView {
  const uint8Arrays = [];

  hasEep = isEep(dataView);

  if (hasEep) {
    const eepData = new Uint8Array(
      byteswapDataView(SAVE_FORMAT, dataView).buffer,
    ).slice(0x0, 0x200);

    uint8Arrays.push(eepData);
    hasEep = true;
  }

  if (isMpk(dataView, shift)) {
    const mpkData = unpackMpk(dataView, shift).buffer;

    uint8Arrays.push(new Uint8Array(mpkData));
  }

  if (uint8Arrays.length > 0) {
    return new DataView(mergeUint8Arrays(...uint8Arrays).buffer);
  }

  return dataView;
}

export function overrideGetRegions(): string[] {
  if (isUnpackedMpk()) {
    return getRegionsFromMpk();
  } else if (hasEep) {
    return ["europe_usa"];
  }

  return [];
}

export function onInitFailed(): void {
  resetMpk();
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    if (isUnpackedMpk()) {
      itemContainer.instanceType = "tabs";
      itemContainer.instances = hasEep ? 5 : 4;
      itemContainer.enumeration = !hasEep ? "Slot %d" : "";
      itemContainer.resource = hasEep ? "slots" : "";
    }

    return itemContainer;
  } else if ("id" in item && item.id?.match(/checksum-/)) {
    const itemChecksum = item as ItemChecksum;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    if (
      (type === "eep" && hasEep && slotIndex === 0) ||
      (type === "mpk" &&
        ((hasEep && slotIndex > 0) || (!hasEep && slotIndex >= 0)))
    ) {
      itemChecksum.disabled = false;
    }

    return itemChecksum;
  } else if ("id" in item && item.id?.match(/section-/)) {
    const itemSection = item as ItemSection;

    const [, type] = item.id.split("-");
    const [slotIndex] = item.id.splitInt();

    if (
      (type === "eep" && hasEep && slotIndex === 0) ||
      (type === "mpk" &&
        ((hasEep && slotIndex > 0) || (!hasEep && slotIndex >= 0)))
    ) {
      itemSection.hidden = false;
    }

    return itemSection;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    if (isUnpackedMpk()) {
      const mpkShifts = getMpkNoteShift();

      if (hasEep && index === 0) {
        return [true, [0x0]];
      } else if (hasEep) {
        return [true, [0x200, ...mpkShifts, (index - 1) * item.length]];
      }

      return [true, [...mpkShifts, index * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "progression") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x0) {
      return [true, 0x1];
    }
  } else if ("id" in item && item.id === "levelProgression") {
    const itemInt = item as ItemInt;

    const progression = getInt(itemInt.offset, "uint8");

    if (progression === 0x8) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "clearTimeEep") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "uint16", { bigEndian: true });

    const checksum = time ^ 0x55aa;

    setInt(itemInt.offset + 0x2, "uint16", checksum, { bigEndian: true });
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksums = [0x0, 0x0, 0x0, 0x0];

  if (dataView) {
    dataView = cloneDataView(dataView);
    dataView.setUint32(item.control.offsetEnd - 0x4, 0x0);
  }

  let offset = item.control.offsetStart;
  const length = item.control.offsetEnd - item.control.offsetStart;

  for (let i = 0x0; i < length; i += 0x80) {
    for (let j = 0x0; j < 0x4; j += 0x1) {
      if (offset < item.control.offsetEnd) {
        let int = 0x0;

        for (let k = 0x0; k < 0x21; k += 0x1) {
          for (let bit = 0x7; bit >= 0x0; bit -= 0x1) {
            const xor = (int & 0x80) !== 0x0 ? 0x85 : 0x0;

            int <<= 0x1;

            if (k !== 0x20) {
              int |= getInt(offset, "bit", { bit }, dataView);
            }

            int = (int ^ xor) & 0xff;
          }

          if (k !== 0x20) {
            offset += 0x1;
          }
        }

        checksums[j] = (checksums[j] + int) & 0xff;
      }
    }
  }

  const checksum = getIntFromArray(checksums, 0x0, "uint32", true);

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (isUnpackedMpk()) {
    if (!hasEep) {
      return repackMpk();
    }

    const dvBuffer = new Uint8Array($dataView.buffer);

    const eepData = dvBuffer.slice(0x0, 0x200);
    const mpkData = dvBuffer.slice(0x200);

    const repackedMpk = repackMpk(new DataView(mpkData.buffer));

    const uint8Array = new Uint8Array(repackedMpk);

    uint8Array.set(eepData);

    return uint8Array.buffer;
  }

  return byteswapDataView(SAVE_FORMAT).buffer;
}

export function onReset(): void {
  resetMpk();
}

function isEep(dataView: DataView): boolean {
  const $gameTemplate = get(gameTemplate);

  const itemContainer = $gameTemplate.items[0] as ItemContainer;
  const itemChecksum = itemContainer.items[0] as ItemChecksum;

  if (dataView.byteLength < itemChecksum.control.offsetEnd) {
    return false;
  }

  const checksum = generateChecksum(itemChecksum, dataView);

  if (
    checksum ===
    getInt(itemChecksum.offset, "uint32", { bigEndian: true }, dataView)
  ) {
    return true;
  }

  return false;
}
