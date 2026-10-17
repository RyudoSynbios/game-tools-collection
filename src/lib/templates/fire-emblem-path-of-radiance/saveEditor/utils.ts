import { get } from "svelte/store";

import { dataView, dataViewAlt, gameMetas, gameRegion } from "$lib/stores";
import { copyInt, getInt, setInt, stringToArray } from "$lib/utils/bytes";
import { formatChecksum, generateCrcCcitt } from "$lib/utils/checksum";
import { getTime, setTime } from "$lib/utils/common/gamecube";
import { getPartialValue, makeOperations } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemMessage,
  Resource,
} from "$lib/types";

import {
  CHARACTER_SIZE,
  CONVOY_SIZE,
  FORGE_SIZE,
  PARTY_COUNT,
  PARTY_SIZE,
  UNKNOWN_SIZE,
} from "./utils/constants";
import { characterList, itemList, supportList } from "./utils/resource";

export function beforeItemsParsing(): void {
  gameMetas.set({ slots: [] });
}

export function overrideParseItem(item: Item): Item {
  const $gameMetas = get(gameMetas);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "checksumSystem") {
    const itemChecksum = item as ItemChecksum;

    if ($gameMetas.isSuspendedSlot) {
      itemChecksum.control.offsetEnd += 0x2000;
    }

    return itemChecksum;
  } else if ("id" in item && item.id === "message") {
    const itemMessage = item as ItemMessage;

    itemMessage.hidden = !$gameMetas.isSuspendedEnable;

    return itemMessage;
  } else if ("id" in item && item.id === "gbaLink" && $gameRegion === 2) {
    const ItemBitflags = item as ItemBitflags;

    ItemBitflags.flags = ItemBitflags.flags.map((flag) => ({
      ...flag,
      hidden: false,
    }));

    return ItemBitflags;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameMetas = get(gameMetas);

  if (item.id === "slots") {
    let offset = -1;
    let bestSaveCount = 0;

    for (let i = 0x0; i < 0x6 * item.length; i += item.length) {
      const saveIndex = getInt(0x20a2 + i, "uint8");
      const saveCount = getInt(0x208b + i, "uint8");
      const check = getInt(0x2080 + i, "uint32", { bigEndian: true });

      if (saveIndex === index && saveCount > bestSaveCount && check !== 0x0) {
        offset = i;
        bestSaveCount = saveCount;
      }
    }

    if (offset !== -1) {
      const saveStatus = getInt(offset + 0x20a0, "uint8");

      if (saveStatus !== 0x1) {
        $gameMetas.slots[index] = offset;

        return [true, [...shifts, offset]];
      }
    }

    return [true, [-1]];
  } else if (item.id === "system") {
    let offset = -1;
    let bestSaveCount = 0;

    for (let i = 0x0; i < 0x8 * item.length; i += item.length) {
      const saveCount = getInt(0x208b + i, "uint8");

      if (saveCount > bestSaveCount) {
        offset = i;
        bestSaveCount = saveCount;
      }

      if (i === 0x18000) {
        i += 0x2000;
      }
    }

    if (offset !== -1) {
      const saveStatus = getInt(offset + 0x20a0, "uint8");

      $gameMetas.isSuspendedSlot = offset / item.length >= 0x6;
      $gameMetas.isSuspendedEnable = saveStatus === 0x3;

      return [true, [...shifts, offset]];
    }

    return [true, [-1]];
  } else if (item.id?.match(/party-/)) {
    const [slotIndex] = item.id.splitInt();

    return [true, [slotIndex * PARTY_SIZE, index * item.length]];
  } else if (item.id?.match(/convoy-/)) {
    const [slotIndex] = item.id.splitInt();

    return [true, [slotIndex * CONVOY_SIZE, index * item.length]];
  } else if (item.id?.match(/forge-/)) {
    const [slotIndex] = item.id.splitInt();

    return [true, [slotIndex * FORGE_SIZE, index * item.length]];
  }

  return [false, undefined];
}

export function onReady(): void {
  initDataViewAlt();
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset - 0x1, "uint8", {}, $dataViewAlt.party);

    itemInt.disabled = level === 20;

    return itemInt;
  } else if ("id" in item && item.id === "durability") {
    const itemInt = item as ItemInt;

    // prettier-ignore
    const itemIndex = getInt(itemInt.offset - 0x2, "uint16", {
      bigEndian: true
    }, $dataViewAlt.convoy);

    const itemType = itemList.find((item) => item.index === itemIndex)?.type;

    itemInt.name = itemType && itemType >= 0xa ? "Quantity" : "Durability";

    return itemInt;
  } else if ("id" in item && item.id === "forgedId") {
    const itemInt = item as ItemInt;

    // prettier-ignore
    const forgedIndex = getInt(itemInt.offset, "uint8", {
      binary: itemInt.binary
    }, $dataViewAlt[itemInt.dataViewAltKey!]);

    itemInt.hidden = forgedIndex === 0x0;
  } else if ("id" in item && item.id?.match(/support-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    // prettier-ignore
    const characterIndex = getInt(itemInt.offset - 0x70 - index, "uint16", {
      bigEndian: true,
    }, $dataViewAlt.party);

    itemInt.hidden = true;

    const characterSupport = supportList.find(
      (support) => support.character === characterIndex,
    );

    if (!characterSupport) {
      return itemInt;
    }

    const characterSupportIndex = characterSupport.supports[index];

    if (characterSupportIndex !== undefined) {
      const character = characterList.find(
        (character) => character.index === characterSupportIndex,
      );

      itemInt.name = character!.name;
      itemInt.hidden = false;
    }

    return itemInt;
  } else if ("id" in item && item.id === "statsTurns") {
    const itemInt = item as ItemInt;

    const chapter = getInt(itemInt.offset - 0x2, "uint8");

    itemInt.disabled = chapter === 0x0;

    return itemInt;
  } else if ("id" in item && item.id?.match(/statsChapterTime-/)) {
    const itemInt = item as ItemInt;

    const chapter = getInt(itemInt.offset - 0x4, "uint8");

    itemInt.disabled = chapter === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "clearCounts") {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x1e; i += 0x1) {
      if (getInt(itemInt.offset + i, "uint8") === 0x0) {
        break;
      }

      count += 0x1;
    }

    return [true, count];
  } else if ("id" in item && item.id?.match(/playtime/)) {
    const itemInt = item as ItemInt;

    const playtime = getTime(itemInt.offset);

    const int = makeOperations(playtime, itemInt.operations);

    return [true, int];
  } else if ("id" in item && item.id === "experience") {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/statsChapterTime-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const chapter = getInt(itemInt.offset - 0x4, "uint8");

    if (chapter === 0) {
      return [true, 0];
    }

    let time = getChapterTime(index, itemInt.offset);
    time = makeOperations(time, itemInt.operations);

    return [true, time];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "clearCounts") {
    const itemInt = item as ItemInt;

    const count = parseInt(value);

    for (let i = 0x0; i < 0x1e; i += 0x1) {
      setInt(itemInt.offset + i, "uint8", count > i ? i + 0x1 : 0x0);
    }

    return true;
  } else if ("id" in item && item.id?.match(/playtime/)) {
    const itemInt = item as ItemInt;

    const oldInt = getTime(itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    setTime(itemInt.offset, int);

    return true;
  } else if ("id" in item && item.id === "statsChapter") {
    const itemInt = item as ItemInt;

    const chapter = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    if (previous === 0x0 && chapter !== 0x0) {
      copyInt(itemInt.offset - 0x4, itemInt.offset + 0x4, 0x4);
    } else if (previous !== 0x0 && chapter === 0x0) {
      setInt(itemInt.offset, "uint32", 0x0);
      setInt(itemInt.offset + 0x4, "uint32", 0x0);
    }
  } else if ("id" in item && item.id?.match(/statsChapterTime-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const oldInt = getChapterTime(index, itemInt.offset);

    let int = makeOperations(parseInt(value), itemInt.operations, true);
    int = getPartialValue(oldInt, int, itemInt.operations!);

    const diff = int - oldInt;

    const offset = itemInt.offset - index * 0x8;

    for (let i = index; i < 0x28; i += 0x1) {
      const previous = getInt(offset + i * 0x8, "uint32", { bigEndian: true });

      setInt(offset + i * 0x8, "uint32", previous + diff, { bigEndian: true });
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "chapter") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset - 0x68);

    setInt(itemInt.offset - 0x67, "uint8", 0x4);
  } else if ("id" in item && item.id === "savePreview-playtime") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset - 0xbc, 0x8);
  } else if ("id" in item && item.id?.match(/-character/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    // prettier-ignore
    const characterIndex = getInt(itemInt.offset, "uint16", {
      bigEndian: true,
    }, $dataViewAlt.party);

    const character = characterList.find(
      (character) => character.index === characterIndex,
    );

    // prettier-ignore
    setInt(itemInt.offset + 0x2, "uint16", character?.class || 0x0, {
      bigEndian: true,
    }, "party");

    const level = getInt(itemInt.offset + 0x9, "uint8", {}, $dataViewAlt.party);

    if (level === 0) {
      setInt(itemInt.offset + 0x9, "uint8", 1, {}, "party");
      setInt(itemInt.offset + 0x17, "uint8", 1, {}, "party");
    }

    updateCharacterNames(slotIndex);
  } else if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const level = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.party);

    let experience = 0x0;

    if (level === 20) {
      experience = 0xff;
    }

    setInt(itemInt.offset + 0x1, "uint8", experience, {}, "party");
  }
}

export function beforeChecksum(): void {
  exportDataViewAlt();
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  const checksum = generateCrcCcitt(item, dataView) ^ 0xffffffff;

  return formatChecksum(checksum, item.dataType);
}

export function getCharacterNames(slotIndex: number): Resource {
  const $dataViewAlt = get(dataViewAlt);

  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemInt = getItem(`slot-${slotIndex}-character`) as ItemInt;

  // prettier-ignore
  for (let i = 0x0; i < PARTY_COUNT; i += 0x1) {
    const characterIndex = getInt(itemInt.offset + i * CHARACTER_SIZE, "uint16", {
      bigEndian: true,
    }, $dataViewAlt.party);

    const character = characterList.find(
      (character) => character.index === characterIndex,
    );

    if (character) {
      names[i] = character.name;
    }
  }

  return names;
}

function getChapterTime(index: number, offset: number): number {
  let time = getInt(offset, "uint32", { bigEndian: true });

  if (index > 0) {
    time -= getInt(offset - 0x8, "uint32", { bigEndian: true });
  }

  return time;
}

export function onSlotChange(slotIndex: number): void {
  if (slotIndex === 0) {
    return;
  }

  slotIndex -= 1;

  updateCharacterNames(slotIndex);
}

export function updateCharacterNames(slotIndex: number): void {
  const values = getCharacterNames(slotIndex);

  updateResources("characterNames", values);
}

// TODO:
// function getForgedWeapons(slotIndex: number) {
//   const $dataViewAlt = get(dataViewAlt);

//   const weapons = [];

//   // Party

//   // prettier-ignore
//   for (let i = 0x0; i < PARTY_COUNT; i += 0x1) {
//     for (let j = 0x0; j < 0x4; j += 0x1) {
//       const offset = i * CHARACTER_SIZE + 0x3a + j * 0x4;

//       const weaponIndex = getInt(offset, "uint16", { bigEndian: true }, $dataViewAlt.party);
//       const forgedIndex = getInt(offset + 0x3, "uint8", {
//         binary: { bitStart: 0, bitLength: 6 },
//       }, $dataViewAlt.party);

//       if (forgedIndex) {
//         weapons.push({
//           characterIndex: i,
//           itemSlot: j,
//           weaponIndex,
//           forgedIndex,
//         });
//       }
//     }
//   }

//   // Convoy

//   // prettier-ignore
//   for (let i = 0x0; i < 0xc8; i += 0x1) {
//     const offset = i * 0x4;

//     const weaponIndex = getInt(offset, "uint16", { bigEndian: true }, $dataViewAlt.convoy);
//     const forgedIndex = getInt(offset + 0x3, "uint8", {
//       binary: { bitStart: 0, bitLength: 6 },
//     }, $dataViewAlt.convoy);

//     if (forgedIndex) {
//       weapons.push({
//         characterIndex: 0xff,
//         itemSlot: i,
//         weaponIndex,
//         forgedIndex,
//       });
//     }
//   }

//   return weapons;
// }

function initDataViewAlt(): void {
  const $dataView = get(dataView);
  const $gameMetas = get(gameMetas);

  const dataSrc = new Uint8Array($dataView.buffer);

  const party = new Uint8Array(0x5 * PARTY_SIZE);
  const convoy = new Uint8Array(0x5 * CONVOY_SIZE);
  const forge = new Uint8Array(0x5 * FORGE_SIZE);
  const unknown = new Uint8Array(0x5 * UNKNOWN_SIZE);

  for (let i = 0x0; i < 0x5; i += 0x1) {
    if ($gameMetas.slots[i] === undefined) {
      continue;
    }

    let offsetSrc = $gameMetas.slots[i] + 0x2338;
    let offsetDst = i * PARTY_SIZE;

    const charactersData: (Uint8Array | null)[] = [];

    for (let j = 0x0; j < 0x9f; j += 0x1) {
      const character = getInt(offsetSrc, "uint16", { bigEndian: true });

      if (character) {
        charactersData[j] = dataSrc.slice(
          offsetSrc,
          offsetSrc + CHARACTER_SIZE,
        );
      }

      offsetSrc += character ? CHARACTER_SIZE : 0x2;
    }

    let index = 0x0;

    // We add characters ordered by position
    if (charactersData[index]) {
      while (index !== -1) {
        let characterData = charactersData[index]!;

        party.set(characterData, offsetDst);

        charactersData[index] = null;

        index = characterData[0x6] - 1; // Next Unit

        offsetDst += CHARACTER_SIZE;
      }
    }

    // We add defeated / remainings characters at the end of the table
    charactersData.forEach((characterData) => {
      if (!characterData) {
        return;
      }

      party.set(characterData, offsetDst);

      offsetDst += CHARACTER_SIZE;
    });

    offsetSrc += 0x4;
    offsetDst = i * CONVOY_SIZE;

    convoy.set(dataSrc.slice(offsetSrc, offsetSrc + CONVOY_SIZE), offsetDst);

    offsetSrc += CONVOY_SIZE + 0x4;
    offsetDst = i * FORGE_SIZE;

    forge.set(dataSrc.slice(offsetSrc, offsetSrc + FORGE_SIZE), offsetDst);

    offsetSrc += FORGE_SIZE + 0x4;
    offsetDst = i * UNKNOWN_SIZE;

    unknown.set(dataSrc.slice(offsetSrc, offsetSrc + UNKNOWN_SIZE), offsetDst);
  }

  dataViewAlt.set({
    party: new DataView(party.buffer),
    convoy: new DataView(convoy.buffer),
    forge: new DataView(forge.buffer),
    unknown: new DataView(unknown.buffer),
  });
}

function exportDataViewAlt(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $gameMetas = get(gameMetas);

  const dataDst = new Uint8Array($dataView.buffer);

  const party = new Uint8Array($dataViewAlt.party.buffer);
  const convoy = new Uint8Array($dataViewAlt.convoy.buffer);
  const forge = new Uint8Array($dataViewAlt.forge.buffer);
  const unknown = new Uint8Array($dataViewAlt.unknown.buffer);

  for (let i = 0x0; i < 0x5; i += 0x1) {
    if ($gameMetas.slots[i] === undefined) {
      continue;
    }

    const partyOffset = $gameMetas.slots[i] + 0x2338;

    let offsetSrc = i * PARTY_SIZE;
    let offsetDst = partyOffset;

    dataDst.set(new Uint8Array(0x3d08), offsetDst);

    const availableCharacters: number[] = [];

    let count = 0;

    for (let j = 0x0; j < PARTY_COUNT; j += 0x1) {
      // prettier-ignore
      const character = getInt(offsetSrc, "uint16", {
        bigEndian: true
      }, $dataViewAlt.party);
      const hp = getInt(offsetSrc + 0x17, "uint8", {}, $dataViewAlt.party);

      // We clear unit position
      setInt(offsetSrc + 0x5, "uint8", 0x0, {}, "party");
      setInt(offsetSrc + 0x6, "uint8", 0x0, {}, "party");

      if (character) {
        dataDst.set(
          party.slice(offsetSrc, offsetSrc + CHARACTER_SIZE),
          offsetDst,
        );

        if (hp > 0) {
          availableCharacters.push(count);
        }

        count += 1;
      }

      offsetSrc += CHARACTER_SIZE;
      offsetDst += character ? CHARACTER_SIZE : 0x0;
    }

    // We set units new position
    availableCharacters.forEach((characterIndex, index) => {
      const offset = partyOffset + characterIndex * CHARACTER_SIZE;

      // Previous Unit
      if (index > 0) {
        dataDst[offset + 0x5] = availableCharacters[index - 1] + 1;
      }

      // Next Unit
      if (index < availableCharacters.length) {
        dataDst[offset + 0x6] = availableCharacters[index + 1] + 1;
      }
    });

    offsetDst += (0x9f - count) * 0x2;

    dataDst.set(stringToArray("SOKO"), offsetDst);

    offsetSrc = i * CONVOY_SIZE;
    offsetDst += 0x4;

    dataDst.set(convoy.slice(offsetSrc, offsetSrc + CONVOY_SIZE), offsetDst);

    offsetSrc = i * FORGE_SIZE;
    offsetDst += CONVOY_SIZE;

    dataDst.set(stringToArray("FWEP"), offsetDst);

    offsetDst += 0x4;

    dataDst.set(forge.slice(offsetSrc, offsetSrc + FORGE_SIZE), offsetDst);

    offsetSrc = i * UNKNOWN_SIZE;
    offsetDst += FORGE_SIZE;

    dataDst.set(stringToArray("T  T"), offsetDst);

    offsetDst += 0x4;

    dataDst.set(unknown.slice(offsetSrc, offsetSrc + UNKNOWN_SIZE), offsetDst);
  }

  dataView.set(new DataView(dataDst.buffer));
}
