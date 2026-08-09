import { bitToOffset } from "$lib/utils/bytes";

import type {
  Item,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
} from "$lib/types";

import { materials, synthesisRecipes, treasures } from "./resource";

export function finalMixParseItemAdaptater(item: Item): Item {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      flag.offset = getShift(flag.offset);
    });
  } else if ("offset" in item) {
    item.offset = getShift(item.offset);
  }

  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    itemChecksum.control.offsetEnd += 0x5ae0;

    return itemChecksum;
  } else if ("id" in item && item.id === "difficuty") {
    const itemInt = item as ItemInt;

    itemInt.resource = "finalMixDifficulties";

    return itemInt;
  } else if ("id" in item && item.id === "formation") {
    const itemInt = item as ItemInt;

    itemInt.resource = "finalMixFormations";

    return itemInt;
  } else if ("id" in item && item.id === "party") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x114;

    return itemContainer;
  } else if ("id" in item && item.id === "driveForms") {
    const itemContainer = item as ItemContainer;

    itemContainer.length = 0x38;
    itemContainer.instances = 10;
    itemContainer.resource = "finalMixDriveForms";

    return itemContainer;
  } else if ("id" in item && item.id?.match(/treasures-/)) {
    const itemBitflags = item as ItemBitflags;

    const [worldIndex] = item.id.splitInt();

    const world = treasures[worldIndex];

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => ({
      ...flag,
      label: `${(index + 1).leading0()} ${world.treasures[index].fmItem}`,
      hidden: false,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id === "obtainedMaterials") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => ({
      ...flag,
      label: materials[index].fmItem!,
      hidden: false,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id === "collectionLists") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => {
      let shift = 0x0;

      if (index >= 12) {
        shift += 0x2;
      }

      if (index >= 23) {
        shift += 0x2;
      }

      return {
        ...flag,
        offset: flag.offset + bitToOffset(flag.bit + shift),
        bit: (flag.bit + shift) % 8,
        hidden: false,
      };
    });

    return itemBitflags;
  } else if ("id" in item && item.id === "moogleLevel") {
    const itemInt = item as ItemInt;

    itemInt.offset += 0x70;

    return itemInt;
  } else if ("id" in item && item.id === "recipes") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag, index) => ({
      ...flag,
      label: synthesisRecipes[index].fmItem!,
      hidden: false,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/material/)) {
    const itemSection = item as ItemSection;

    const isLogs = item.id === "materialLogs";

    itemSection.items = itemSection.items.map((item, index) => ({
      ...item,
      offset: (item as ItemInt).offset + (isLogs ? 0x38 : 0x0),
      name: materials[index].fmItem!,
      hidden: false,
    }));

    return itemSection;
  } else if ("id" in item && item.id === "finalMixFlags") {
    const itemBitflags = item as ItemBitflags;

    itemBitflags.flags = itemBitflags.flags.map((flag) => ({
      ...flag,
      hidden: false,
    }));

    return itemBitflags;
  } else if ("id" in item && item.id?.match(/finalMixShift-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    itemInt.offset += shift;

    return itemInt;
  }

  return item;
}

const shifts = [
  { offset: 0xe50, shift: 0xe40 },
  { offset: 0x1660, shift: 0x50 },
  { offset: 0x22c4, shift: 0x1a0 },
  { offset: 0x242c, shift: 0xc8 },
  { offset: 0x2c7a, shift: -0x104 },
  { offset: 0x3724, shift: 0x2d8 },
  { offset: 0x3740, shift: 0x4 },
  { offset: 0x3748, shift: 0x4 },
  { offset: 0x3750, shift: 0x4 },
  { offset: 0x394c, shift: 0x70 },
  { offset: 0x3b80, shift: 0x838 },
  { offset: 0x9040, shift: 0x2a60 },
  { offset: 0xacc0, shift: 0xe40 },
  { offset: 0xb383, shift: 0x6c0 },
];

function getShift(baseOffset: number): number {
  let offset = baseOffset;

  shifts.forEach((step) => {
    if (baseOffset >= step.offset) {
      offset += step.shift;
    }
  });

  return offset;
}
