import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import {
  bitToOffset,
  copyInt,
  getInt,
  getString,
  setInt,
} from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getHeaderShift,
  getPsvHeaderShift,
  getSlotShifts,
  isPsvHeader,
} from "$lib/utils/common/playstation";
import { getItem, getResource, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  Resource,
} from "$lib/types";

import {
  angeloAbilityList,
  discStartPreviews,
  gfAbilityList,
  learnableAbilities,
  locationList,
} from "./utils/resource";

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

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id?.match(/^time-/) &&
    ($gameRegion === 1 || $gameRegion === 2)
  ) {
    const itemInt = item as ItemInt;

    itemInt.operations!.shift();

    return itemInt;
  } else if (
    "id" in item &&
    item.id?.match(/^name$|-gfName-/) &&
    $gameRegion === 2
  ) {
    const itemString = item as ItemString;

    itemString.length -= 0x1;

    return itemString;
  } else if ("id" in item && item.id?.match(/gfAbilityForgotten-/)) {
    const itemBitflags = item as ItemBitflags;

    const [gfIndex] = item.id.splitInt();

    const abilities = learnableAbilities[gfIndex];

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      const abilityIndex = abilities.findIndex(
        (abilityIndex) => abilityIndex === index + 1,
      );

      const hasAbility = abilityIndex !== -1;

      return {
        ...flag,
        offset: hasAbility
          ? flag.offset + bitToOffset(abilityIndex)
          : flag.offset + 0x2,
        bit: hasAbility ? abilityIndex % 8 : 7,
        disabled: !hasAbility,
      };
    });

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/gfAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [gfIndex, index] = item.id.splitInt();

    const abilities = getGuardianForceAbilities(gfIndex);

    const learnableAbilities = abilities.filter(
      (ability) => ability.lIndex !== -1,
    );

    const ability = learnableAbilities[index];

    if (ability) {
      itemInt.name = ability.name;
      itemInt.offset += ability.lIndex;
      itemInt.max = ability.ap;
    }

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
    return getSlotShifts("correspondance", shifts, index, { leadingZeros: 1 });
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const disc = getInt(itemInt.offset + 0xea, "uint8");

    itemInt.resource = `disc${disc}Locations`;

    return itemInt;
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x1, "uint8");
    const quantity = getInt(itemInt.offset, "uint8");

    itemInt.disabled = itemIndex === 0x0 || quantity === 0x0;

    return itemInt;
  } else if ("id" in item && item.id?.match(/limitBreak-/)) {
    const itemSection = item as ItemSection;

    const [characterIndex, index] = item.id.splitInt();

    itemSection.hidden = index !== characterIndex;

    return itemSection;
  } else if ("id" in item && item.id?.match(/angeloAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const ability = getAngeloAbility(itemInt.offset, index, "progression");

    itemInt.max = ability.points;
    itemInt.disabled = !ability.learnable && !ability.learned;

    return itemInt;
  } else if ("id" in item && item.id?.match(/gfAbilityLearned-/)) {
    const itemBitflags = item as ItemBitflags;

    const offset = itemBitflags.flags[0].offset;

    let count = 0;

    for (let i = 0x0; i < 0x4; i += 0x1) {
      count += getInt(offset + i * 0x4, "uint32").toBitCount();
    }

    itemBitflags.name = `Learned (${count}/22)`;

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/gfAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [gfIndex, index] = item.id.splitInt();

    const ability = getGuardianForceAbility(
      itemInt.offset,
      gfIndex,
      index,
      "progression",
    );

    itemInt.disabled = ability.forgotten;

    return itemInt;
  } else if ("id" in item && item.id?.match(/^gfName-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const guardianForceNames = getResource("guardianForceNames") as Resource;

    itemInt.name = guardianForceNames[index];

    return itemInt;
  } else if ("id" in item && item.id === "commonCardQuantity") {
    const itemInt = item as ItemInt;

    const obtained = getInt(itemInt.offset, "bit", { bit: 7 });

    itemInt.disabled = !obtained;

    return itemInt;
  } else if ("id" in item && item.id?.match(/uniqueCardQuantity-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset + 0x21 + bitToOffset(index) - index;

    const obtained = getInt(offset, "bit", { bit: index % 8 });

    itemInt.disabled = !obtained;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const locationType = getInt(itemInt.offset - 0x2, "uint16");

    if (locationType === 0x2) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const [base] = item.id.splitInt();

    const experience = getInt(itemInt.offset, "uint32");

    const int = Math.floor((experience + base) / base);

    return [true, int];
  } else if ("id" in item && item.id?.match(/angeloAbilityStatus-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const ability = getAngeloAbility(itemInt.offset, index, "learnable");

    let int = 0x0;

    if (ability.learned) {
      int = 0x2;
    } else if (ability.learnable) {
      int = 0x1;
    }

    return [true, int];
  } else if ("id" in item && item.id?.match(/angeloAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const ability = getAngeloAbility(itemInt.offset, index, "progression");

    if (ability.learned) {
      return [true, ability.points];
    }

    const points = ability.points - getInt(itemInt.offset, "uint8");

    return [true, points];
  } else if ("id" in item && item.id?.match(/gfAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [gfIndex, index] = item.id.splitInt();

    const ability = getGuardianForceAbility(
      itemInt.offset,
      gfIndex,
      index,
      "progression",
    );

    if (ability.forgotten) {
      return [true, 0];
    } else if (ability.learned) {
      return [true, ability.ap];
    }
  } else if ("id" in item && item.id === "seedSteps") {
    const itemInt = item as ItemInt;

    const int = 24576 - getInt(itemInt.offset, "uint32");

    return [true, int];
  } else if ("id" in item && item.id === "gfCompatibility") {
    const itemInt = item as ItemInt;

    const int = 1200 - Math.ceil(getInt(itemInt.offset, "uint16") / 5);

    return [true, int];
  } else if ("id" in item && item.id?.match(/uniqueCardQuantity-/)) {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint8");

    let quantity = 0;

    if (location === 0xf0) {
      quantity = 1;
    }

    return [true, quantity];
  } else if ("id" in item && item.id === "brBattles") {
    const itemInt = item as ItemInt;

    const won = getInt(itemInt.offset, "uint32");
    const escaped = getInt(itemInt.offset + 0x6, "uint16");

    const int = won + escaped;

    return [true, int];
  } else if ("id" in item && item.id === "centraRuinsCode") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      int += getInt(itemInt.offset + i, "uint8") * Math.pow(10, 4 - i);
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    let locationType = 0x1;

    if (int === 0x0) {
      locationType = 0x2;
    }

    setInt(itemInt.offset - 0x2, "uint8", locationType);
    setInt(itemInt.offset, "uint16", value);

    updateLocation(itemInt.offset, int);
  } else if ("id" in item && item.id?.match(/level-/)) {
    const itemInt = item as ItemInt;

    const [base] = item.id.splitInt();

    const int = parseInt(value);

    const experience = int * base - base;

    setInt(itemInt.offset, "uint32", experience);

    return true;
  } else if ("id" in item && item.id?.match(/angeloAbilityStatus-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = parseInt(value);

    const ability = getAngeloAbility(itemInt.offset, index, "progression");

    let learnable = 0;
    let learned = 0;
    let progression = 0;

    switch (int) {
      case 0:
        learnable = 0;
        learned = 0;
        progression = ability.points;
        break;
      case 1:
        learnable = 1;
        learned = 0;
        progression = ability.points;
        break;
      case 2:
        learnable = 1;
        learned = 1;
        progression = 0;
        break;
    }

    setInt(itemInt.offset, "bit", learnable, { bit: index });
    setInt(itemInt.offset - 0x1, "bit", learned, { bit: index });
    setInt(itemInt.offset + 0x1 + index, "uint8", progression);

    return true;
  } else if ("id" in item && item.id?.match(/angeloAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = parseInt(value);

    const ability = getAngeloAbility(itemInt.offset, index, "progression");

    const points = ability.points - int;

    setInt(itemInt.offset, "uint8", points);
    setInt(itemInt.offset - 0x1 - index, "bit", 1, { bit: index });
    setInt(itemInt.offset - 0x2 - index, "bit", points === 0 ? 1 : 0, {
      bit: index,
    });

    return true;
  } else if ("id" in item && item.id === "seedSteps") {
    const itemInt = item as ItemInt;

    const int = 24576 - parseInt(value);

    setInt(itemInt.offset, "uint32", int);

    return true;
  } else if ("id" in item && item.id === "gfCompatibility") {
    const itemInt = item as ItemInt;

    const int = (1200 - parseInt(value)) * 5;

    setInt(itemInt.offset, "uint16", int);

    return true;
  } else if ("id" in item && item.id?.match(/uniqueCardQuantity-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    let int = 0xc8 + index;

    if (value === "1") {
      int = 0xf0;
    }

    setInt(itemInt.offset, "uint8", int);

    return true;
  } else if ("id" in item && item.id === "centraRuinsCode") {
    const itemInt = item as ItemInt;

    const int = parseInt(value, 16);

    for (let i = 0x0; i < 0x5; i += 0x1) {
      setInt(itemInt.offset + i, "uint8", (int >> ((0x4 - i) * 0x4)) & 0xf);
    }

    return true;
  }

  return false;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id?.match(/copy-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    copyInt(itemInt.offset, itemInt.offset + shift);
  } else if ("id" in item && item.id === "disc") {
    const itemInt = item as ItemInt;

    const disc = getInt(itemInt.offset, "uint8");
    let progression = getInt(itemInt.offset + 0x34, "uint16");

    setInt(itemInt.offset - 0xde4, "uint8", disc - 0x1);

    if (disc === 0x1 && progression > 0x184) {
      progression = 0x184;
    } else if (disc === 0x2 && progression < 0x18b) {
      progression = 0x18b;
    } else if (disc === 0x2 && progression > 0x37f) {
      progression = 0x37f;
    } else if (disc === 0x3 && progression < 0x385) {
      progression = 0x385;
    } else if (disc === 0x3 && progression > 0xee2) {
      progression = 0xee2;
    } else if (disc === 0x4 && progression < 0xf14) {
      progression = 0xf14;
    }

    setInt(itemInt.offset + 0x34, "uint16", progression);

    updateLocation(itemInt.offset - 0xea);
  } else if ("id" in item && item.id === "time-playtime") {
    const itemInt = item as ItemInt;

    const playtime = getInt(itemInt.offset, "uint32");

    setInt(itemInt.offset - 0xcc0, "uint32", playtime);
  } else if ("id" in item && item.id === "timeline") {
    const itemInt = item as ItemInt;

    const time = getInt(itemInt.offset, "bit", { bit: itemInt.bit });

    const gil = getInt(itemInt.offset - 0x216 + time * 0x4, "uint32");

    setInt(itemInt.offset - 0xd16, "uint32", gil);
  } else if ("id" in item && item.id?.match(/gil-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset + 0x216 - index * 0x4;

    const time = getInt(offset, "bit", { bit: 0 });

    if (index !== time) {
      return;
    }

    const gil = getInt(itemInt.offset, "uint32");

    setInt(offset - 0xd16, "uint32", gil);
  } else if ("id" in item && item.id?.match(/formation-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    let character = -1;

    const partyIndex = getInt(itemInt.offset, "uint8");

    if (partyIndex !== 0xff) {
      const offset = itemInt.offset - index - 0x65c;

      character = getInt(offset + partyIndex * 0x98, "uint8");
    }

    setInt(itemInt.offset - 0xadf, "uint8", character);
  } else if ("id" in item && item.id?.match(/character-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const character = getInt(itemInt.offset, "uint8");

    const offset = itemInt.offset - index * 0x98;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      const partyIndex = getInt(offset + 0x65c + i, "uint8");

      if (partyIndex === index) {
        setInt(offset - 0x483 + i, "uint8", character);
      }
    }
  } else if ("id" in item && item.id?.match(/level-1000-|experience-/)) {
    const itemInt = item as ItemInt;

    let characterIndex = -1;

    if (item.id.match(/level/)) {
      [, characterIndex] = item.id.splitInt();
    } else if (item.id.match(/experience/)) {
      [characterIndex] = item.id.splitInt();
    }

    if (characterIndex !== 0) {
      return;
    }

    const experience = getInt(itemInt.offset, "uint32");

    const int = Math.floor((experience + 1000) / 1000);

    setInt(itemInt.offset - 0x480, "uint8", int);
  } else if ("id" in item && item.id?.match(/^(magic|item)$/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");
    const quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (itemIndex === 0x0) {
      setInt(itemInt.offset + 0x1, "uint8", 0x0);
    } else if (quantity === 0x0) {
      setInt(itemInt.offset + 0x1, "uint8", 0x1);
    }
  } else if ("id" in item && item.id?.match(/gfAbilityLearned-/)) {
    const itemBitflags = item as ItemBitflags;

    const [gfIndex] = item.id.splitInt();

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const offset = itemBitflags.flags[0].offset;

    const ability = getGuardianForceAbility(offset, gfIndex, index, "learned");

    if (ability.lIndex !== -1) {
      const learned = getInt(flag.offset, "bit", { bit: flag.bit });

      if (learned) {
        // If learned, we set the forgotten flag to false and set the max amount of AP
        setInt(offset + 0x10 + ability.lIndex, "uint8", ability.ap);
        setInt(offset + 0x2d + bitToOffset(ability.lIndex), "bit", 0, {
          bit: ability.lIndex % 8,
        });
      } else {
        setInt(offset + 0x10 + ability.lIndex, "uint8", 0);
      }
    }
  } else if ("id" in item && item.id?.match(/gfAbilityForgotten-/)) {
    const itemBitflags = item as ItemBitflags;

    const [gfIndex] = item.id.splitInt();

    const index = itemBitflags.flags.findIndex(
      (item) => item.offset === flag.offset && item.bit === flag.bit,
    );

    const ability = getGuardianForceAbility(
      flag.offset,
      gfIndex,
      index,
      "forgotten",
    );

    // If learned, we set the forgotten flag to false and set 0 AP
    if (ability.lIndex !== -1 && ability.learned) {
      const offset = flag.offset - 0x2d - bitToOffset(ability.lIndex);

      setInt(offset + bitToOffset(ability.index), "bit", 0, {
        bit: ability.index % 8,
      });

      setInt(offset + 0x10 + ability.lIndex, "uint8", 0);
    }
  } else if ("id" in item && item.id?.match(/gfAbilityProgression-/)) {
    const itemInt = item as ItemInt;

    const [gfIndex, index] = item.id.splitInt();

    const ability = getGuardianForceAbility(
      itemInt.offset,
      gfIndex,
      index,
      "progression",
    );

    const offset =
      itemInt.offset - 0x10 - ability.lIndex + bitToOffset(ability.index);

    const ap = getInt(itemInt.offset, "uint8");

    setInt(offset, "bit", ap === ability.ap ? 1 : 0, {
      bit: ability.index % 8,
    });
  } else if ("id" in item && item.id?.match(/-gfName-/)) {
    const [slotIndex] = item.id.splitInt();

    updateGuardianForceNames(slotIndex);
  } else if ("id" in item && item.id?.match(/crEnemiesKilled-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x98;

    // Copy value in duplicate field

    copyInt(offset + index * 0x98, offset + 0x85c + index * 0x2, 0x2);

    // Calculate total killed

    let count = 0;

    for (let i = 0x0; i < 0x8; i += 0x1) {
      count += getInt(offset + i * 0x98, "uint16");
    }

    setInt(offset + 0x884, "uint32", count);
  } else if ("id" in item && item.id === "commonCardObtained") {
    const itemInt = item as ItemInt;

    const obtained = getInt(itemInt.offset, "bit", { bit: 7 });

    setInt(itemInt.offset, "uint8", obtained ? 1 : 0, {
      binary: { bitStart: 0, bitLength: 7 },
    });
  } else if ("id" in item && item.id?.match(/uniqueCardObtained-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    let int = 0xc8 + index;

    const obtained = getInt(itemInt.offset, "bit", { bit: itemInt.bit });

    if (obtained) {
      int = 0xf0;
    }

    const offset = itemInt.offset - 0x21 - bitToOffset(index) + index;

    setInt(offset, "uint8", int);
  }
}

const dataArray = [
  0x0000, 0x1021, 0x2042, 0x3063, 0x4084, 0x50a5, 0x60c6, 0x70e7, 0x8108,
  0x9129, 0xa14a, 0xb16b, 0xc18c, 0xd1ad, 0xe1ce, 0xf1ef, 0x1231, 0x0210,
  0x3273, 0x2252, 0x52b5, 0x4294, 0x72f7, 0x62d6, 0x9339, 0x8318, 0xb37b,
  0xa35a, 0xd3bd, 0xc39c, 0xf3ff, 0xe3de, 0x2462, 0x3443, 0x0420, 0x1401,
  0x64e6, 0x74c7, 0x44a4, 0x5485, 0xa56a, 0xb54b, 0x8528, 0x9509, 0xe5ee,
  0xf5cf, 0xc5ac, 0xd58d, 0x3653, 0x2672, 0x1611, 0x0630, 0x76d7, 0x66f6,
  0x5695, 0x46b4, 0xb75b, 0xa77a, 0x9719, 0x8738, 0xf7df, 0xe7fe, 0xd79d,
  0xc7bc, 0x48c4, 0x58e5, 0x6886, 0x78a7, 0x0840, 0x1861, 0x2802, 0x3823,
  0xc9cc, 0xd9ed, 0xe98e, 0xf9af, 0x8948, 0x9969, 0xa90a, 0xb92b, 0x5af5,
  0x4ad4, 0x7ab7, 0x6a96, 0x1a71, 0x0a50, 0x3a33, 0x2a12, 0xdbfd, 0xcbdc,
  0xfbbf, 0xeb9e, 0x9b79, 0x8b58, 0xbb3b, 0xab1a, 0x6ca6, 0x7c87, 0x4ce4,
  0x5cc5, 0x2c22, 0x3c03, 0x0c60, 0x1c41, 0xedae, 0xfd8f, 0xcdec, 0xddcd,
  0xad2a, 0xbd0b, 0x8d68, 0x9d49, 0x7e97, 0x6eb6, 0x5ed5, 0x4ef4, 0x3e13,
  0x2e32, 0x1e51, 0x0e70, 0xff9f, 0xefbe, 0xdfdd, 0xcffc, 0xbf1b, 0xaf3a,
  0x9f59, 0x8f78, 0x9188, 0x81a9, 0xb1ca, 0xa1eb, 0xd10c, 0xc12d, 0xf14e,
  0xe16f, 0x1080, 0x00a1, 0x30c2, 0x20e3, 0x5004, 0x4025, 0x7046, 0x6067,
  0x83b9, 0x9398, 0xa3fb, 0xb3da, 0xc33d, 0xd31c, 0xe37f, 0xf35e, 0x02b1,
  0x1290, 0x22f3, 0x32d2, 0x4235, 0x5214, 0x6277, 0x7256, 0xb5ea, 0xa5cb,
  0x95a8, 0x8589, 0xf56e, 0xe54f, 0xd52c, 0xc50d, 0x34e2, 0x24c3, 0x14a0,
  0x0481, 0x7466, 0x6447, 0x5424, 0x4405, 0xa7db, 0xb7fa, 0x8799, 0x97b8,
  0xe75f, 0xf77e, 0xc71d, 0xd73c, 0x26d3, 0x36f2, 0x0691, 0x16b0, 0x6657,
  0x7676, 0x4615, 0x5634, 0xd94c, 0xc96d, 0xf90e, 0xe92f, 0x99c8, 0x89e9,
  0xb98a, 0xa9ab, 0x5844, 0x4865, 0x7806, 0x6827, 0x18c0, 0x08e1, 0x3882,
  0x28a3, 0xcb7d, 0xdb5c, 0xeb3f, 0xfb1e, 0x8bf9, 0x9bd8, 0xabbb, 0xbb9a,
  0x4a75, 0x5a54, 0x6a37, 0x7a16, 0x0af1, 0x1ad0, 0x2ab3, 0x3a92, 0xfd2e,
  0xed0f, 0xdd6c, 0xcd4d, 0xbdaa, 0xad8b, 0x9de8, 0x8dc9, 0x7c26, 0x6c07,
  0x5c64, 0x4c45, 0x3ca2, 0x2c83, 0x1ce0, 0x0cc1, 0xef1f, 0xff3e, 0xcf5d,
  0xdf7c, 0xaf9b, 0xbfba, 0x8fd9, 0x9ff8, 0x6e17, 0x7e36, 0x4e55, 0x5e74,
  0x2e93, 0x3eb2, 0x0ed1, 0x0000,
];

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const index = getInt(i, "uint8") ^ ((checksum >>> 0x8) & 0xff);

    checksum = dataArray[index] ^ (checksum << 0x8);
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

interface AngeloAbility {
  learnable: boolean;
  learned: boolean;
  points: number;
}

function getAngeloAbility(
  offset: number,
  index: number,
  type: "learnable" | "progression",
): AngeloAbility {
  const ability = angeloAbilityList.find((ability) => ability.index === index);

  switch (type) {
    case "learnable":
      offset -= 0x1;
      break;
    case "progression":
      offset -= index + 0x2;
      break;
  }

  return {
    learnable: getInt(offset + 0x1, "bit", { bit: index }) === 1,
    learned: getInt(offset, "bit", { bit: index }) === 1,
    points: ability?.points || 0,
  };
}

interface GFAbility {
  index: number;
  name: string;
  lIndex: number;
  ap: number;
}

function getGuardianForceAbilities(index: number): GFAbility[] {
  const learnedAbilities = learnableAbilities[index];

  return gfAbilityList.reduce((abilities: GFAbility[], ability) => {
    const learnedAbilityIndex = learnedAbilities.findIndex(
      (abilityIndex) => abilityIndex === ability.index,
    );

    abilities.push({
      index: ability.index,
      name: ability.name,
      lIndex: learnedAbilityIndex,
      ap: ability.ap,
    });

    return abilities;
  }, []);
}

function getGuardianForceAbility(
  offset: number,
  gfIndex: number,
  index: number,
  type: "learned" | "forgotten" | "progression",
): GFAbility & { learned?: boolean; forgotten?: boolean } {
  const abilities = getGuardianForceAbilities(gfIndex);

  let ability: GFAbility;

  switch (type) {
    case "learned":
      ability = abilities[index];
      break;
    case "forgotten":
      ability = abilities[index];
      offset -= 0x2d + bitToOffset(ability.lIndex);
      break;
    case "progression":
      const learnableAbilities = abilities.filter(
        (ability) => ability.lIndex !== -1,
      );
      ability = learnableAbilities[index];
      offset -= 0x10 + ability.lIndex;
      break;
  }

  if (ability!.lIndex === -1) {
    return ability;
  }

  const learned = getInt(offset + bitToOffset(ability.index), "bit", {
    bit: ability.index % 8,
  });

  const forgotten = getInt(offset + 0x2d + bitToOffset(ability.lIndex), "bit", {
    bit: ability.lIndex % 8,
  });

  return {
    ...ability,
    learned: learned === 1,
    forgotten: forgotten === 1,
  };
}

export function getGuardianForcesNames(slotIndex: number): Resource {
  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const itemString = getItem(`slot-${slotIndex}-gfName-0`) as ItemString;

  [...Array(16).keys()].forEach((index) => {
    const name = getString(
      itemString.offset + index * 0x44,
      itemString.length,
      itemString.letterDataType,
      {
        endCode: itemString.endCode,
        resource: itemString.resource,
      },
    );

    names[index] = name;
  });

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateGuardianForceNames(slotIndex);
}

export function updateGuardianForceNames(slotIndex: number): void {
  const values = getGuardianForcesNames(slotIndex);

  updateResources("guardianForceNames", values);
}

function updateLocation(offset: number, value = 0x0): void {
  let locationType = 0x1;

  // If location is World Map, we force the Location Type
  if (value === 0x0) {
    locationType = 0x2;
  }

  setInt(offset - 0x2, "uint16", locationType);

  const location = locationList[value];

  if (location) {
    let preview = location.preview;

    if (value === 0x0) {
      setInt(offset - 0xd3e, "uint16", 0x1);
      setInt(offset + 0x51e, "uint32", location.coordinates[0]);
      setInt(offset + 0x522, "uint32", location.coordinates[1]);
      setInt(offset + 0x526, "uint32", location.coordinates[2]);
      return;
    }

    if (value === 0x5f) {
      const disc = getInt(offset + 0xea, "uint8");
      preview = discStartPreviews[disc - 1].preview;
    }

    setInt(offset - 0xd3e, "uint16", preview);
    setInt(offset + 0x4, "uint16", location.coordinates[0]);
    setInt(offset + 0xa, "uint16", location.coordinates[1]);
    setInt(offset + 0x10, "uint16", location.coordinates[2]);
  }
}
