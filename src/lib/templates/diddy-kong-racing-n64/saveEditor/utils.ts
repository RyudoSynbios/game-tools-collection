import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { extractBinary, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { byteswapDataView, getHeaderShift } from "$lib/utils/common/nintendo64";
import { clone, getObjKey } from "$lib/utils/format";
import { getItem, getResource } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTab,
  ItemTabs,
  Resource,
} from "$lib/types";

import { worlds } from "./utils/resource";

export function initHeaderShift(dataView: DataView): number {
  return getHeaderShift(dataView, "eep");
}

export function beforeInitDataView(dataView: DataView): DataView {
  return byteswapDataView("eep", dataView);
}

export function overrideGetRegions(
  dataView: DataView,
  shift: number,
): string[] {
  const $gameTemplate = get(gameTemplate);

  for (let i = 0; i < 3; i += 1) {
    const itemTabs = clone($gameTemplate.items[0] as ItemTabs);
    const itemTab = itemTabs.items[1] as ItemTab;
    const itemContainer = itemTab.items[0] as ItemContainer;
    const itemChecksum = itemContainer.items[0] as ItemChecksum;

    const tmpShift = shift + i * 0x28;

    itemChecksum.offset += tmpShift;
    itemChecksum.control.offsetStart += tmpShift;
    itemChecksum.control.offsetEnd += tmpShift;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (
      checksum ===
      getInt(itemChecksum.offset, "uint16", { bigEndian: true }, dataView)
    ) {
      return ["europe", "usa", "japan"];
    }
  }

  return [];
}

export function overrideParseItem(
  item: Item,
  instanceIndex: number,
): Item | ItemTab {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "checksumAdventure") {
    const itemChecksum = item as ItemChecksum;

    const offset = itemChecksum.offset + instanceIndex * 0x28;

    const checksum = getInt(offset, "uint16", { bigEndian: true });

    itemChecksum.disabled = checksum === 0xffff;

    return itemChecksum;
  } else if ("id" in item && item.id === "records") {
    const itemTab = item as ItemTab;
    const itemSection = itemTab.items[0] as ItemSection;

    const checksum1Item = itemSection.items[0] as ItemChecksum;
    const checksum2Item = itemSection.items[1] as ItemChecksum;

    const checksum1 = getInt(checksum1Item.offset, "uint16");
    const checksum2 = getInt(checksum2Item.offset, "uint16");

    checksum1Item.disabled = checksum1 === 0xffff;
    checksum2Item.disabled = checksum2 === 0xffff;

    itemTab.disabled = checksum1Item.disabled && checksum2Item.disabled;

    return itemTab;
  } else if ("id" in item && item.id === "language") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  }

  return item;
}

export function onReady(): void {
  const checksumItem = getItem("checksumOptions") as ItemChecksum;

  const checksum = getInt(checksumItem.offset, "uint8");

  if (checksum === 0xff) {
    setInt(checksumItem.offset, "uint32", 0x0);
    setInt(checksumItem.offset + 0x4, "uint32", 0x3);
  }
}

export function overrideGetInt(item: Item): [boolean, string | undefined] {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    const int = getInt(itemString.offset, "uint16", {
      bigEndian: itemString.bigEndian,
    });

    const letter1 = extractBinary(int, 10, 5);
    const letter2 = extractBinary(int, 5, 5);
    const letter3 = extractBinary(int, 0, 5);

    const string = `${letters[letter1]}${letters[letter2]}${letters[letter3]}`;

    return [true, string];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    const letters = getResource("letters") as Resource;

    let int = 0x0;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const index = Object.values(letters).findIndex(
        (letter) => letter === value[i],
      );

      let letter = itemString.fallback as number;

      if (index !== -1) {
        letter = parseInt(getObjKey(letters, index));
      }

      int |= letter << ((0x2 - i) * 0x5);
    }

    setInt(itemString.offset, "uint16", int, { bigEndian: true });

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "unlockedCharacters") {
    if (flag.label === "T.T.") {
      const checked = getInt(flag.offset, "bit", { bit: flag.bit });

      const int1 = checked ? 0xffff : 0x0;
      const int2 = checked ? 0xf : 0x0;

      setInt(flag.offset, "uint16", int1, { bigEndian: true });
      setInt(flag.offset + 0x2, "uint8", int2, {
        binary: { bitStart: 4, bitLength: 4 },
      });
    }
  } else if ("id" in item && item.id?.match(/progression-/)) {
    const [shift] = item.id.splitInt();

    let offset = -shift;

    if ("flags" in item) {
      const itemBitflags = item as ItemBitflags;

      offset += itemBitflags.flags[0].offset;
    } else {
      const itemInt = item as ItemInt;

      offset += itemInt.offset;
    }

    updateWorldBalloons(offset);
    updateTTChallenges(offset);
    updateWorldBosses(offset);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView = new DataView(new ArrayBuffer(0)),
): number {
  let checksum = 0x5;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const int = getInt(i, "uint8", {}, dataView);

    if (item.id === "checksumOptions") {
      checksum += (int >> 0x4) + (int & 0xf);
    } else {
      checksum += int;
    }
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  return byteswapDataView("eep").buffer;
}

function updateTTChallenges(offset: number): void {
  let ttAmuletPieces = 0;

  Object.values(worlds).forEach((world) => {
    if (world.tt) {
      const int = getInt(offset + world.tt.offset, "uint8", {
        binary: {
          bitStart: world.tt.bitStart,
          bitLength: 2,
        },
      });

      if (int === 2) {
        ttAmuletPieces += 1;
      }
    }
  });

  setInt(offset + 0x13, "uint8", ttAmuletPieces, {
    binary: { bitStart: 3, bitLength: 3 },
  });
}

function updateWorldBalloons(offset: number): void {
  let balloons = (getInt(offset + 0x14, "uint16") & 0x4c5c).toBitCount();

  Object.values(worlds).forEach((world) => {
    let worldBalloons = 0;

    if (world.races) {
      world.races.forEach((race) => {
        const int = getInt(offset + race.offset, "uint8", {
          bigEndian: true,
          binary: { bitStart: race.bitStart, bitLength: 2 },
        });

        worldBalloons += int >= 2 ? 1 : 0;
        worldBalloons += int === 3 ? 1 : 0;
      });

      setInt(
        offset + world.balloons!.offset,
        world.balloons!.dataType,
        worldBalloons,
        {
          bigEndian: true,
          binary: { bitStart: world.balloons!.bitStart, bitLength: 4 },
        },
      );

      balloons += worldBalloons;
    }
  });

  setInt(offset + 0xe, "uint8", balloons, {
    binary: { bitStart: 1, bitLength: 7 },
  });
}

function updateWorldBosses(offset: number): void {
  let wizpigAmuletPieces = 0;

  Object.entries(worlds).forEach(([key, world]) => {
    if (world.bosses) {
      const level1 = getInt(offset + world.bosses[0].offset, "uint8", {
        binary: {
          bitStart: world.bosses[0].bitStart,
          bitLength: 2,
        },
      });

      const level2 = world.bosses[1]
        ? getInt(offset + world.bosses[1].offset, "uint8", {
            binary: {
              bitStart: world.bosses[1].bitStart,
              bitLength: 2,
            },
          })
        : 0;

      if (level2 === 2) {
        wizpigAmuletPieces += 1;
      }

      switch (key) {
        case "lobby":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 0 });
          break;
        case "dinoDomain":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 1 });
          setInt(offset + 0xd, "bit", level2 === 2 ? 1 : 0, { bit: 7 });
          break;
        case "sherbetIsland":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 2 });
          setInt(offset + 0xc, "bit", level2 === 2 ? 1 : 0, { bit: 0 });
          break;
        case "snowflakeMountain":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 3 });
          setInt(offset + 0xc, "bit", level2 === 2 ? 1 : 0, { bit: 1 });
          break;
        case "dragonForest":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 4 });
          setInt(offset + 0xc, "bit", level2 === 2 ? 1 : 0, { bit: 2 });
          break;
        case "futureFunLand":
          setInt(offset + 0xd, "bit", level1 === 2 ? 1 : 0, { bit: 5 });
          break;
      }
    }
  });

  setInt(offset + 0x13, "uint8", wizpigAmuletPieces, {
    binary: { bitStart: 0, bitLength: 3 },
  });
}
