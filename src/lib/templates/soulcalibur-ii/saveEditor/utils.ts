import Long from "long";
import { get } from "svelte/store";

import { dataView, dataViewAlt, gamePlatform, gameRegion } from "$lib/stores";
import { getInt, getIntFromArray, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getFileOffset,
  isPlaystation2SaveFile,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";
import { cloneArrayBuffer } from "$lib/utils/format";
import { getClosestItem, getResource } from "$lib/utils/parser";
import { getRegions } from "$lib/utils/validator";

import {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemString,
  ItemTab,
  Resource,
} from "$lib/types";

import { characters, classList, missions } from "./utils/resource";

export function setGamePlatform(dataView: DataView): void {
  if (isPlaystation2SaveFile(dataView)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    return customGetRegions();
  }

  return getRegions(dataView);
}

export function onInitFailed(): void {
  resetState();
}

export function initShifts(shifts: number[]): number[] {
  const $gameRegion = get(gameRegion);

  switch ($gameRegion) {
    case 1:
    case 3:
      return [...shifts, -0x1];
    case 2:
      return [...shifts, -0x3];
  }

  return shifts;
}

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);

  const data = new Uint8Array($dataView.buffer);

  let offset = getDataOffset();

  const deobfuscatedData = obfuscateData(data.slice(offset, offset + 0x2000));

  dataViewAlt.set({ save: new DataView(deobfuscatedData.buffer) });
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    if ("id" in item && item.id === "checksum-key") {
      return item;
    }

    if (
      "dataType" in item &&
      ["uint16", "uint24", "uint32"].includes(item.dataType)
    ) {
      const itemInt = item as ItemInt;

      itemInt.bigEndian = true;

      return itemInt;
    }
  }

  if ("id" in item && item.id === "japanExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 2;

    return itemInt;
  } else if ("id" in item && item.id === "gamecubeOnly") {
    const itemType = item as ItemInt | ItemTab;

    itemType.hidden = $gamePlatform !== 0;

    return itemType;
  } else if ("id" in item && item.id === "ps2Only") {
    const itemType = item as ItemInt | ItemTab;

    itemType.hidden = $gamePlatform !== 1;

    return itemType;
  } else if (
    "id" in item &&
    item.id === "missionBitflags" &&
    $gamePlatform === 1
  ) {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag) => ({
      ...flag,
      offset: flag.offset + 0x3,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id === "charactersFlags") {
    const itemBitflags = item as ItemBitflags;

    const character = getExclusiveCharacter();

    itemBitflags.flags = itemBitflags.flags.map((flag) => ({
      ...flag,
      label: flag.label.replace("%character%", character),
      hidden: $gamePlatform === 0 ? false : flag.hidden,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id === "weaponMaster") {
    const itemTab = item as ItemTab;

    itemTab.disabled = getInt(0x8c, "uint32", {}, $dataViewAlt.save) === 0x0;

    return itemTab;
  } else if ("id" in item && item.id === "autoSaveData" && $gameRegion === 2) {
    const itemInt = item as ItemInt;

    itemInt.offset -= 0x1;

    return itemInt;
  }

  return item;
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("id" in item && item.id?.match(/checksum-/)) {
    return [0x0];
  }

  return shifts;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "characterData") {
    if (index >= 0x14) {
      return [true, [(index + 1) * item.length]];
    }
  }

  return [false, undefined];
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "class") {
    const itemInt = item as ItemInt;

    // prettier-ignore
    const experience = getInt(itemInt.offset, "uint32", {
      bigEndian: itemInt.bigEndian
    }, $dataViewAlt.save);

    let classIndex = 0;

    for (let i = 0; i < classList.length; i += 1) {
      if (
        experience >= classList[i].experience &&
        (!classList[i + 1] || experience < classList[i + 1].experience)
      ) {
        classIndex += i;
      }
    }

    return [true, classIndex];
  } else if ("id" in item && item.id === "playerName") {
    const itemString = item as ItemString;

    const endCode = getInt(itemString.offset, "uint8", {}, $dataViewAlt.save);

    const characters = getResource("characters") as Resource;

    if (endCode === 0x0) {
      const characterItem = getClosestItem("character", item) as ItemInt;

      // prettier-ignore
      const characterIndex = getInt(characterItem.offset, "uint8", {}, $dataViewAlt.save);

      const character = characters[characterIndex];

      if (character) {
        return [true, character.toUpperCase()];
      }
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "class") {
    const itemInt = item as ItemInt;

    const classIndex = parseInt(value);

    const experience = classList[classIndex].experience;

    // prettier-ignore
    setInt(itemInt.offset, "uint32", experience, {
      bigEndian: itemInt.bigEndian,
    }, "save");

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/mission-/)) {
    const itemInt = item as ItemInt;

    const [type, index] = item.id.splitInt();

    const offset = itemInt.offset - type * 0xe8 - index * 0x4;

    updateLinkedMissions(offset, type, index);
  }
}

export function generateChecksum(item: ItemChecksum): number | bigint {
  const $dataViewAlt = get(dataViewAlt);

  if (item.id === "checksum-key") {
    let checksum = 0xa2f1;

    for (
      let i = item.control.offsetStart;
      i < item.control.offsetEnd;
      i += 0x2
    ) {
      const int1 = getInt(i, "uint8", {}, $dataViewAlt.save);
      const int2 = getInt(i + 0x1, "uint8", {}, $dataViewAlt.save);

      checksum = (checksum + int1 * 0x7 + int2 * 0x7) & 0xffff;
    }

    checksum ^= 0xeb7d;
    checksum = (checksum << 3) | (checksum >> 0xd);

    return formatChecksum(checksum, item.dataType);
  }

  let high = 0x0;
  let low = 0x0;

  const string = "BESTGAME";

  let xor = getInt(item.control.offsetStart, "uint16", {}, $dataViewAlt.save);

  for (let i = 0x0; i < string.length; i += 0x1) {
    const int = (string.charCodeAt(i) ^ xor) & 0xff;

    xor = (((xor >> 0x5) | ((xor & 0x1f) << 0xb)) * 0x5 + 0x1) & 0xffff;

    if (i <= 3) {
      high |= int << (i << 0x3);
    } else {
      low |= int << ((i - 4) << 0x3);
    }
  }

  return new Long(high, low).toUnsigned().toBigInt();
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $gamePlatform = get(gamePlatform);

  const data = new Uint8Array($dataView.buffer);
  const deobfuscatedData = cloneArrayBuffer($dataViewAlt.save.buffer);

  const obfuscatedData = obfuscateData(deobfuscatedData);

  const offset = getDataOffset();

  data.set(obfuscatedData, offset);

  dataView.set(new DataView(data.buffer));

  if ($gamePlatform === 1) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

export function getCharacterNames(type: string): Resource {
  const names: Resource = {};

  const exclusiveCharacter = getExclusiveCharacter();

  let index = 0;

  characters.forEach((character) => {
    if (character.index === 0x14 && type !== "weaponMaster") {
      return;
    }

    if (type === "weaponMaster") {
      index = character.wmIndex;
    } else if (type !== "enums") {
      index = character.index;
    }

    names[index] = character.name.replace("%character%", exclusiveCharacter);

    index += 0x1;
  });

  if (type === "team") {
    names[0xff] = "-";
  }

  return names;
}

function getDataOffset(): number {
  const $gamePlatform = get(gamePlatform);

  switch ($gamePlatform) {
    case 0:
      return 0x4040;
    case 1:
      return getFileOffset(0);
  }

  return 0x0;
}

function getExclusiveCharacter(): string {
  const $gamePlatform = get(gamePlatform);

  switch ($gamePlatform) {
    case 0:
      return "Link";
    case 1:
      return "Heihachi";
    default:
      return "";
  }
}

function obfuscateData(data: Uint8Array): Uint8Array {
  const int = getIntFromArray(data, 0x1ff6, "uint16");

  let xor = ((int >> 0x3) | ((int & 0x7) << 0xd)) ^ 0xeb7d;

  for (let i = 0x0; i < data.length - 0xa; i += 0x1) {
    data[i] = data[i] ^ xor;

    xor = (((xor >> 0x1) | ((xor & 0x1) << 0xf)) * 0x5 + 0x1) & 0xffff;
  }

  return data;
}

function updateLinkedMissions(
  offset: number,
  type: number,
  index: number,
): void {
  const $dataViewAlt = get(dataViewAlt);
  const $gamePlatform = get(gamePlatform);

  const bOffset = offset + ($gamePlatform === 1 ? 0x3 : 0x0);

  const clearedOffset = bOffset + type * 0xe8 + index * 0x4;

  const cleared = getInt(clearedOffset, "bit", { bit: 3 }, $dataViewAlt.save);

  const mission = missions.find((mission) => mission.index === index)!;
  const isEndChapter =
    missions.filter((m) => m.chapter === mission.chapter).at(-1)!.index ===
    mission.index;

  // prettier-ignore
  if (type === 0 && ((isEndChapter && index !== 0x23) || index === 0x22)) {
    setInt(offset - 0x10 + mission.chapter, "uint8", cleared ? 4 : 3, {}, "save");
  }

  mission.linkedMissions.forEach((lIndex) => {
    const isExtraMission = lIndex >> 0x8 === 0x1;

    if ((type === 0 && isExtraMission) || (type === 1 && !isExtraMission)) {
      return;
    }

    const lMission = missions.find(
      (lMission) => lMission.index === (lIndex & 0xff),
    )!;

    // prettier-ignore
    if (mission.chapter !== lMission.chapter) {
      setInt(offset - 0x10 + lMission.chapter, "uint8", cleared ? 2 : 0, {}, "save");
    }

    lMission.adjMissions.forEach((missionIndex, bit) => {
      if (
        missionIndex === undefined ||
        (missionIndex > lMission.index && mission.index !== 0x1e)
      ) {
        return;
      }

      const missionOffset = bOffset + lMission.index * 0x4;
      const adjMissionOffset = bOffset + missionIndex * 0x4;

      const adjMission = missions.find(
        (mission) => mission.index === missionIndex,
      )!;
      const adjBit = adjMission.adjMissions.findIndex(
        (index) => index === lMission.index,
      );

      setInt(missionOffset, "bit", cleared, { bit: 2 }, "save"); // Congratulations message seen
      setInt(missionOffset, "bit", cleared, { bit: 4 + bit }, "save"); // Linked Mission Route
      setInt(adjMissionOffset, "bit", cleared, { bit: 4 + adjBit }, "save"); // Adjacent Mission Route
    });
  });
}
