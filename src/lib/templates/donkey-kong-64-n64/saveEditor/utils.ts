import { get } from "svelte/store";

import { fileHeaderShift, gameRegion, gameTemplate } from "$lib/stores";
import {
  bitToOffset,
  dataTypeToLength,
  extractBinary,
  getInt,
  injectBinary,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import {
  clone,
  getObjKey,
  getPartialValue,
  makeOperations,
} from "$lib/utils/format";
import { getItem, getResource } from "$lib/utils/parser";

import type {
  DataViewABL,
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  Resource,
} from "$lib/types";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/japanShift/) && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    if (itemInt.binary) {
      itemInt.binary.bitStart += 1;
    } else if (itemInt.bit) {
      itemInt.bit += 1;
    }
  }

  if ("id" in item && item.id === "japanShift-language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 0;

    return itemInt;
  }

  return item;
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemChecksum = clone($gameTemplate.items[0] as ItemChecksum);

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
    return ["europe", "usa", "japan"];
  }

  return [];
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $fileHeaderShift = get(fileHeaderShift);

  if (item.id === "slots") {
    for (let i = 0; i < item.instances + 1; i += 1) {
      const saveIndex = getInt(
        $fileHeaderShift + i * item.length + 0x1a0,
        "uint8",
        { binary: { bitStart: 2, bitLength: 2 } },
      );

      if (saveIndex === index) {
        return [true, [...shifts, i * item.length]];
      }
    }
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | ItemBitflagChecked[] | undefined] {
  if ("binary" in item && item.dataType !== "uint8") {
    const itemInt = item as ItemInt;

    const dataType = itemInt.dataType as "uint16" | "uint24" | "uint32";

    let int = getMergedInt(
      itemInt.offset,
      dataType,
      itemInt.binary?.bitStart,
      itemInt.binary?.bitLength,
    );

    if (itemInt.operations) {
      int = makeOperations(int, itemInt.operations);
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/completionRate-/)) {
    const [slotIndex] = item.id.splitInt();

    let items = 0;
    let bananaFairies = 0;
    let battleCrowns = 0;
    let bossKeys = 0;
    let bananaMedals = 0;
    let goldenBananas = 0;

    let rarewareGoldenBanana = false;

    // Items

    const ItemsItem = getItem(`items-${slotIndex}`) as ItemBitflags;

    ItemsItem.flags.forEach((flag, index) => {
      if (index !== 2) {
        items += getInt(flag.offset, "bit", { bit: flag.bit });
      }
    });

    // Banana Fairies

    const bananaFairiesItem = getItem(
      `bananaFairies-${slotIndex}`,
    ) as ItemBitflags;

    bananaFairiesItem.flags.forEach((flag) => {
      bananaFairies += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    // Battle Crowns

    const battleCrownsItem = getItem(
      `battleCrowns-${slotIndex}`,
    ) as ItemBitflags;

    battleCrownsItem.flags.forEach((flag) => {
      battleCrowns += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    // Boss Keys

    const bossKeysItem = getItem(`bossKeys-${slotIndex}`) as ItemBitflags;

    bossKeysItem.flags.forEach((flag) => {
      bossKeys += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    // Banana Medals

    for (let level = 0; level < 8; level += 1) {
      const bananaMedalsItem = getItem(
        `bananaMedals-${slotIndex}-${level}`,
      ) as ItemBitflags;

      bananaMedalsItem.flags.forEach((flag) => {
        bananaMedals += getInt(flag.offset, "bit", { bit: flag.bit });
      });
    }

    //  Golden Bananas

    for (let level = 0; level < 8; level += 1) {
      for (let character = 0; character < 5; character += 1) {
        const goldenBananasItem = getItem(
          `goldenBananas-${slotIndex}-${level}-${character}`,
        ) as ItemBitflags;

        goldenBananasItem.flags.forEach((flag, index) => {
          const int = getInt(flag.offset, "bit", { bit: flag.bit });

          goldenBananas += int;

          if (index === 5) {
            rarewareGoldenBanana = Boolean(int);
          }
        });
      }
    }

    let percent = 0;

    percent += items * 0.5;
    percent += bananaFairies * 0.2;
    percent += battleCrowns * 0.5;
    percent += bossKeys * 0.25;
    percent += bananaMedals * 0.2;
    percent += goldenBananas * 0.4;

    if (goldenBananas === 201) {
      percent -= 0.4;
    }

    // If completion is strictly equal to 100 and the Rareware Golden Banana has been obtained
    if (percent === 100 && rarewareGoldenBanana) {
      percent = 101;
    }

    percent = Math.floor(percent);

    return [true, percent];
  } else if ("id" in item && item.id === "specialMoves") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        let checked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

        if ([0, 1, 2, 3, 4, 5, 9, 10].includes(index)) {
          const int = getMergedInt(flag.offset, "uint16", flag.bit, 2);

          if (index >= 9) {
            index -= 9;
          } else if (index >= 3) {
            index -= 3;
          }

          checked = index < int;
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
  } else if ("id" in item && item.id === "miscHideoutHelm") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, index) => {
        let checked = getInt(flag.offset, "bit", { bit: flag.bit }) === 1;

        if (index === 0) {
          checked =
            checked && getInt(flag.offset, "bit", { bit: flag.bit + 1 }) === 1;
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
  } else if ("id" in item && item.id?.match(/name-/)) {
    const $gameRegion = get(gameRegion);

    const itemString = item as ItemString;

    let [bitStart] = item.id.splitInt();

    if ($gameRegion === 2) {
      bitStart += 1;
    }

    const letters = getResource("letters") as Resource;

    let name = "";

    for (let i = 0x0; i < itemString.length; i += 0x1) {
      const offset = shiftOffset(
        itemString.offset,
        bitToOffset(bitStart + i * 25),
      );
      const bit = (bitStart + i * 25) % 8;

      const letter = getMergedInt(offset, "uint16", bit, 5);

      name += letters[letter];
    }

    return [true, name];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  const $gameRegion = get(gameRegion);

  if ("binary" in item && item.dataType !== "uint8") {
    const itemInt = item as ItemInt;

    const dataType = itemInt.dataType as "uint16" | "uint24" | "uint32";

    let int = parseInt(value);

    if (itemInt.operations) {
      int = makeOperations(int, itemInt.operations, true);

      int = getPartialValue(
        getMergedInt(
          itemInt.offset,
          dataType,
          itemInt.binary?.bitStart,
          itemInt.binary?.bitLength,
        ),
        int,
        itemInt.operations,
      );
    }

    setMergedInt(
      itemInt.offset,
      dataType,
      int,
      itemInt.binary?.bitStart,
      itemInt.binary?.bitLength,
    );

    return true;
  } else if ("id" in item && item.id === "specialMoves") {
    const itemBitflags = item as ItemBitflags;

    let index = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    if (![0, 1, 2, 3, 4, 5, 9, 10, 12, 13, 14].includes(index)) {
      return false;
    }

    let int = index;

    if (index >= 12) {
      int -= 12;
    } else if (index >= 9) {
      int -= 9;
    } else if (index >= 3) {
      int -= 3;
    }

    int += value ? 1 : 0;

    if ([12, 13, 14].includes(index)) {
      // Candy's Moves
      for (let i = 0; i < 3; i += 1) {
        const f = itemBitflags.flags[12 + i];

        setInt(f.offset, "bit", i < int ? 1 : 0, { bit: f.bit });
      }
    } else {
      // Cranky's Moves
      setMergedInt(flag.offset, "uint16", int, flag.bit, 2);
    }

    return true;
  } else if ("id" in item && item.id?.match(/name-/)) {
    const itemString = item as ItemString;

    let [bitStart] = item.id.splitInt();

    if ($gameRegion === 2) {
      bitStart += 1;
    }

    const letters = getResource("letters") as Resource;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const index = Object.values(letters).findIndex(
        (letter) => letter === value[i],
      );

      let letter = itemString.fallback as number;

      if (index !== -1) {
        letter = parseInt(getObjKey(letters, index));
      }

      const offset = shiftOffset(
        itemString.offset,
        bitToOffset(bitStart + i * 25),
      );
      const bit = (bitStart + i * 25) % 8;

      setMergedInt(offset, "uint16", letter, bit, 5);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/goldenBananas-/)) {
    const itemBitflags = item as ItemBitflags;

    const [slotIndex, level, character] = item.id.splitInt();

    let count = 0;

    itemBitflags.flags.forEach((flag) => {
      count += getInt(flag.offset, "bit", { bit: flag.bit });
    });

    const gbItem = getItem(
      `count-goldenBananas-${slotIndex}-${level}-${character}`,
    ) as ItemInt;

    setMergedInt(
      gbItem.offset,
      "uint16",
      count,
      gbItem.binary!.bitStart,
      gbItem.binary!.bitLength,
    );
  } else if ("id" in item && item.id === "miscHideoutHelm") {
    if (flag.bit === 1) {
      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      setInt(flag.offset, "bit", checked, { bit: 2 });
    }
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView: DataViewABL = new DataView(new ArrayBuffer(0)),
): number {
  const checksum = generateCrcCcitt(item, dataView) ^ 0xffffffff;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}

export function shiftOffset(offset: number, shift: number): number {
  const block = Math.floor((0x3 - (offset % 0x4) + shift) / 0x4);

  return offset - shift + block * 0x8;
}

function getMergeOrder(offset: number, length: number): number[] {
  let order = [];

  let index = 0;

  for (let i = 0x0; i < length; i += 0x1) {
    order.push(index);

    if ((offset + i + 1) % 0x4 === 0x0) {
      index = -7 + 3 - (offset % 0x4);
    } else {
      index += 1;
    }
  }

  order.reverse();

  return order;
}

function getMergedInt(
  offset: number,
  dataType: "uint16" | "uint24" | "uint32",
  bitStart?: number,
  bitLength?: number,
): number {
  const dataTypeLength = dataTypeToLength(dataType);

  let int = 0x0;

  getMergeOrder(offset, dataTypeLength).forEach((shift, index) => {
    int |= getInt(offset + shift, "uint8") << (index * 0x8);
  });

  if (bitStart !== undefined && bitLength !== undefined) {
    int = extractBinary(int, bitStart, bitLength);
  }

  return int;
}

function setMergedInt(
  offset: number,
  dataType: "uint16" | "uint24" | "uint32",
  value: number,
  bitStart?: number,
  bitLength?: number,
): void {
  const dataTypeLength = dataTypeToLength(dataType);

  if (bitStart !== undefined && bitLength !== undefined) {
    const oldInt = getMergedInt(offset, dataType);

    value = injectBinary(oldInt, value, dataType, bitStart, bitLength);
  }

  getMergeOrder(offset, dataTypeLength).forEach((shift, index) => {
    const int = (value >> (index * 0x8)) & 0xff;

    setInt(offset + shift, "uint8", int);
  });
}
