import { get } from "svelte/store";

import { fileName, gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { getItem } from "$lib/utils/parser";

import { Item, ItemInt, ItemString, ItemTab } from "$lib/types";

import { itemQuantites, swords, SwordType } from "./utils/resource";

export function initShifts(shifts: number[]): number[] {
  const $fileName = get(fileName);

  if ($fileName === "DATA.SAV") {
    const nameLength = getInt(0x0, "uint32", { bigEndian: true });
    const modelLength = getInt(nameLength + 0x10, "uint32", {
      bigEndian: true,
    });

    shifts = [...shifts, nameLength, modelLength];
  }

  return shifts;
}

export function overrideShift(item: Item, shifts: number[]): number[] {
  if ("id" in item && item.id === "name") {
    return shifts.slice(0, -2);
  } else if ("id" in item && item.id?.match(/beforeModelName/)) {
    return shifts.slice(0, -1);
  }

  return shifts;
}

export function overrideParseItem(item: Item): Item | ItemTab {
  const $fileName = get(fileName);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "system") {
    const itemTab = item as ItemTab;

    if ($fileName !== "SYS.DAT") {
      itemTab.disabled = true;
    }

    return itemTab;
  } else if ("id" in item && item.id?.match(/main/)) {
    const itemTab = item as ItemTab;

    if ($fileName !== "DATA.SAV") {
      itemTab.disabled = true;
    }
  }

  if ("id" in item && item.id?.match(/japanExclude/)) {
    const itemInt = item as ItemInt;

    itemInt.disabled = itemInt.disabled || $gameRegion === 1;
    itemInt.hidden = $gameRegion === 1;

    return itemInt;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "name") {
    const itemString = item as ItemString;

    itemString.length = getInt(0x0, "uint32", { bigEndian: true });

    return itemString;
  } else if ("id" in item && item.id === "life") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x5f);

    const maxLife = getInt(itemInt.offset - 0x1, "uint8", {
      operations: itemInt.operations,
    });

    itemInt.max = maxLife + classStats[0];
  } else if ("id" in item && item.id === "maxLife") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x5e);

    itemInt.min = 1 + classStats[0];
    itemInt.max = 16 + classStats[0];
  } else if ("id" in item && item.id === "magic") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x61);

    const maxMagic = getInt(itemInt.offset - 0x1, "uint8");

    itemInt.max = maxMagic + classStats[1];
  } else if ("id" in item && item.id === "maxMagic") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x60);

    itemInt.min = 0 + classStats[1];
    itemInt.max = 16 + classStats[1];
  } else if ("id" in item && item.id?.match(/value-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, valuesMax } = itemQuantites[type];

    const upgrade = getInt(itemInt.offset + shift, "uint8");

    itemInt.max = valuesMax[upgrade];
  } else if ("id" in item && item.id?.match(/bottle-/)) {
    const itemInt = item as ItemInt;

    const [shift] = item.id.splitInt();

    const offset = itemInt.offset - shift;

    const currentBottle = getInt(itemInt.offset, "uint8");

    const redPotion = getInt(offset, "uint8");
    const bluePotion = getInt(offset + 0x2, "uint8");
    const emptyBottle = getInt(offset + 0x29, "uint8");
    const elixir = getInt(offset + 0x3c, "uint8");

    const total = redPotion + bluePotion + emptyBottle + elixir;

    itemInt.max = currentBottle + (4 - total);
  } else if ("id" in item && item.id?.match(/sword-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-") as [string, SwordType];
    const [index] = item.id.splitInt();

    const isObtained = isSwordObtained(itemInt.offset, type);

    itemInt.disabled = !isObtained;

    if (!isObtained) {
      return itemInt;
    }

    const sword = swords.find((sword) => sword.index === index);

    if (sword) {
      if (type === "potential") {
        itemInt.max = sword.potential;
      } else {
        itemInt.min = sword[type][0];
        itemInt.max = sword[type][1];
        itemInt.disabled = sword[type].length === 0;
      }
    }

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id === "beforeModelName-class") {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, "uint32", {
      bigEndian: itemInt.bigEndian,
    });

    int = Math.floor(int / 0x2);

    return [true, int];
  } else if ("id" in item && item.id === "maxLife") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x5e);

    let int = getInt(itemInt.offset, "uint8", {
      operations: itemInt.operations,
    });

    int += classStats[0];

    return [true, int];
  } else if ("id" in item && item.id === "maxMagic") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x60);

    let int = getInt(itemInt.offset, "uint8");

    int += classStats[1];

    return [true, int];
  } else if ("id" in item && item.id?.match(/sword-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-") as [string, SwordType];

    const isObtained = isSwordObtained(itemInt.offset, type);

    if (!isObtained) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id === "beforeModelName-class") {
    const itemInt = item as ItemInt;

    const gender = getInt(itemInt.offset - 0x4, "uint32", { bigEndian: true });

    const int = parseInt(value) * 2 + gender;

    setInt(itemInt.offset, "uint32", int, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id === "maxLife") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x5e);

    let int = parseInt(value);

    int -= classStats[0];

    setInt(itemInt.offset, "uint8", int, { operations: itemInt.operations });

    return true;
  } else if ("id" in item && item.id === "maxMagic") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x60);

    let int = parseInt(value);

    int -= classStats[1];

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "beforeModelName-gender") {
    const itemInt = item as ItemInt;

    const gender = getInt(itemInt.offset, "uint32", { bigEndian: true });
    const cClass = getInt(itemInt.offset + 0x4, "uint32", { bigEndian: true });

    const int = Math.floor(cClass / 2) * 2 + gender;

    setInt(itemInt.offset + 0x4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id === "maxLife") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x5e);

    let life = getInt(itemInt.offset + 0x1, "uint8", {
      operations: itemInt.operations,
    });
    let maxLife = getInt(itemInt.offset, "uint8", {
      operations: itemInt.operations,
    });

    maxLife += classStats[0];

    life = Math.min(life, maxLife);

    setInt(itemInt.offset + 0x1, "uint8", life, {
      operations: itemInt.operations,
    });
  } else if ("id" in item && item.id === "maxMagic") {
    const itemInt = item as ItemInt;

    const classStats = getClassStats(itemInt.offset - 0x60);

    let magic = getInt(itemInt.offset + 0x1, "uint8");
    let maxMagic = getInt(itemInt.offset, "uint8");

    maxMagic += classStats[1];

    magic = Math.min(magic, maxMagic);

    setInt(itemInt.offset + 0x1, "uint8", magic);
  } else if ("id" in item && item.id === "shield") {
    const itemInt = item as ItemInt;

    const shield = getInt(itemInt.offset, "uint8");

    for (let i = 0x0; i < 0x6; i += 0x1) {
      setInt(itemInt.offset + 0x5e + i, "uint8", i <= shield ? 1 : 0);
    }
  } else if ("id" in item && item.id?.match(/max-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");

    const { shift, valuesMax } = itemQuantites[type];

    let value = getInt(itemInt.offset - shift, "uint8");
    const upgrade = getInt(itemInt.offset, "uint8");

    value = Math.min(value, valuesMax[upgrade]);

    setInt(itemInt.offset - shift, "uint8", value);
  } else if ("id" in item && item.id?.match(/swordStatus-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-") as [string, SwordType];
    const [index] = item.id.splitInt();

    const isObtained = isSwordObtained(itemInt.offset, type);

    if (!isObtained) {
      return;
    }

    let hasData = false;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      if (
        getInt(itemInt.offset + (i + 1) * 0x2, "uint16", { bigEndian: true })
      ) {
        hasData = true;
      }
    }

    const sword = swords.find((sword) => sword.index === index);

    if (sword && !hasData) {
      setInt(itemInt.offset + 0x3, "uint16", sword.potential, {
        bigEndian: true,
      });

      setInt(itemInt.offset + 0x5, "uint8", sword.length[0]);
      setInt(itemInt.offset + 0x6, "uint8", sword.width[0]);
      setInt(itemInt.offset + 0x9, "uint8", sword.strength[0]);
      setInt(itemInt.offset + 0x7, "uint8", sword.spin[0]);
      setInt(itemInt.offset + 0x8, "uint8", sword.beam[0]);
      setInt(itemInt.offset + 0xa, "uint8", sword.pierce[0]);
      setInt(itemInt.offset + 0xb, "uint8", sword.special[0]);
    }
  }
}

function getClassStats(offset: number): [number, number] {
  const genderItem = getItem("beforeModelName-class") as ItemInt;

  let cClass = getInt(genderItem.offset, "uint32", {
    bigEndian: true,
  });

  cClass = Math.floor(cClass / 2);

  const mode = getInt(offset + 0x38, "uint32", { bigEndian: true });

  if (mode !== 2) {
    switch (cClass) {
      case 0:
        return [2, 0];
      case 1:
        return [1, 1];
      case 2:
        return [0, 2];
    }
  }

  return [0, 0];
}

function isSwordObtained(offset: number, type: SwordType): boolean {
  switch (type) {
    case "potential":
      offset -= 0x3;
      break;
    case "length":
      offset -= 0x5;
      break;
    case "width":
      offset -= 0x6;
      break;
    case "strength":
      offset -= 0x9;
      break;
    case "spin":
      offset -= 0x7;
      break;
    case "beam":
      offset -= 0x8;
      break;
    case "pierce":
      offset -= 0xa;
      break;
    case "special":
      offset -= 0xb;
      break;
  }

  const isObtained = Boolean(getInt(offset, "uint8"));

  return isObtained;
}
