import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { getItem } from "$lib/utils/parser";

import { Item, ItemInt, ItemString } from "$lib/types";

import { authorizedEquipment, questPaths } from "./utils/resource";

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 1) {
    const itemString = item as ItemString;

    itemString.length = 0xc;
    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;
    itemString.regex = undefined;
    itemString.resource = "letters";

    return itemString;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "name" && $gameRegion === 1) {
    const itemString = item as ItemString;

    let string = getString(
      itemString.offset,
      itemString.length,
      itemString.letterDataType,
      {
        letterBigEndian: itemString.letterBigEndian,
        resource: itemString.resource,
      },
    );

    for (let i = 0x0; i < itemString.length; i += 0x2) {
      if (getInt(itemString.offset + i, "uint8") === 0x0) {
        string = string.substring(0, i / 2);
        break;
      }
    }

    return [true, string];
  } else if ("id" in item && item.id?.match(/hero30Progression-/)) {
    const itemInt = item as ItemInt;

    const [, index] = item.id.splitInt();

    let int = 0x0;

    const unlocked = getInt(itemInt.offset - (0x8 + index * 0x2), "uint32");
    const cleared = getInt(itemInt.offset, "uint16");

    if (cleared === 0xffff) {
      int = 0x2;
    } else if (unlocked === 0xffffffff) {
      int = 0x1;
    }

    return [true, int];
  } else if (
    "id" in item &&
    (item.id?.match(/princess30Time-/) || item.id?.match(/princess30MedFees-/))
  ) {
    const itemInt = item as ItemInt;

    let int = getInt(itemInt.offset, itemInt.dataType as "int8" | "int32", {
      operations: itemInt.operations,
    });

    const progressionItem = getItem(
      item.id.replace(`${item.id.split("-")[0]}-`, "princess30Progression-"),
    ) as ItemInt;

    const progression = getInt(progressionItem.offset, "bit", {
      bit: progressionItem.bit,
    });

    if (progression === 0x0) {
      int = 0;
    }

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/hero30Progression-/)) {
    const itemInt = item as ItemInt;

    const [questIndex, index] = item.id.splitInt();

    let resultAvailable = 0x0;
    let cleared = 0x0;
    let unlocked = 0x0;

    switch (value) {
      case "0":
        resultAvailable = 0x0;
        cleared = 0x0;
        unlocked = 0x0;
        break;
      case "1":
        resultAvailable = 0x0;
        cleared = 0x0;
        unlocked = 0xffffffff;
        break;
      case "2":
        resultAvailable = 0x1;
        cleared = 0xffff;
        unlocked = 0xffffffff;
        break;
    }

    // prettier-ignore
    setInt(itemInt.offset - questIndex * 0x7c - (index === 0 ? 0x830 : 0x432), "uint8", resultAvailable);
    setInt(itemInt.offset, "uint16", cleared);
    setInt(itemInt.offset - (0x8 + index * 0x2), "uint32", unlocked);

    if (unlocked === 0x0) {
      setInt(itemInt.offset - (index === 0 ? 0x430 : 0x832), "uint8", 0x0);
      setInt(itemInt.offset + (index === 0 ? 0x2 : -0x2), "uint16", 0x0);
    }

    const pathOffset =
      itemInt.offset - (index === 0 ? 0x4 : 0x6) - questIndex * 0x8c;

    updatePaths(pathOffset, questIndex);

    const authorizedEquipmentOffset =
      itemInt.offset + (index === 0 ? 0x45 : 0x43) - questIndex * 0x8c;

    for (let i = 0x0; i < 0x32; i += 0x1) {
      const offset = authorizedEquipmentOffset + i * 0x8c;

      authorizedEquipment[i].forEach((int, index) => {
        setInt(offset + index, "uint8", int);
      });
    }

    return true;
  } else if (
    "id" in item &&
    (item.id?.match(/princess30Time-/) ||
      item.id?.match(/princess30Rank-/) ||
      item.id?.match(/princess30MedFees-/))
  ) {
    const itemInt = item as ItemInt;

    const progressionItem = getItem(
      item.id.replace(`${item.id.split("-")[0]}-`, "princess30Progression-"),
    ) as ItemInt;

    const progression = getInt(progressionItem.offset, "bit", {
      bit: progressionItem.bit,
    });

    let dataType = "uint8";
    let defaultValue = 0xff;
    let min = 0x0;
    let options = {};

    if (item.id?.match(/princess30Time-/)) {
      dataType = "int32";
      defaultValue = 0xffffffff;

      if (progression === 0x1) {
        options = {
          operations: itemInt.operations,
        };
      }
    } else if (item.id?.match(/princess30Rank-/)) {
      defaultValue = 0x0;
      min = 0x1;
    } else if (item.id?.match(/princess30MedFees-/)) {
      dataType = "int8";
    }

    setInt(
      itemInt.offset,
      dataType as "int8" | "uint8" | "int32",
      progression === 0x0 ? defaultValue : parseInt(value) || min,
      options,
    );

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/princess30Progression-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "bit", {
      bit: itemInt.bit,
    });

    const items: {
      name: string;
      dataType: "uint8" | "uint32";
      checkValue: number;
      trueValue: number;
      falseValue: number;
    }[] = [
      {
        name: "Time",
        dataType: "uint32",
        checkValue: 0xffffffff,
        trueValue: 0x0,
        falseValue: 0xffffffff,
      },
      {
        name: "Rank",
        dataType: "uint8",
        checkValue: 0x0,
        trueValue: 0x1,
        falseValue: 0x0,
      },
      {
        name: "MedFees",
        dataType: "uint8",
        checkValue: 0xff,
        trueValue: 0x0,
        falseValue: 0xff,
      },
    ];

    items.forEach((ref) => {
      const refItem = getItem(
        item.id!.replace("princess30Progression-", `princess30${ref.name}-`),
      ) as ItemInt;

      const time = getInt(refItem.offset, ref.dataType);

      if (int === 0x1 && time === ref.checkValue) {
        setInt(refItem.offset, ref.dataType, ref.trueValue);
      } else if (int === 0x0) {
        setInt(refItem.offset, ref.dataType, ref.falseValue);
      }
    });
  } else if ("id" in item && item.id?.match(/hero30Title-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const int = getInt(itemInt.offset, "uint16");

    setInt(itemInt.offset + (index === 0 ? 0x2 : -0x2), "uint16", int);
  } else if ("id" in item && item.id?.match(/hero300Progression-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x400;

    let value = 0x0;

    for (let i = 0x0; i < 0x2; i += 0x1) {
      if (getInt(offset + i * 0x400, "uint8")) {
        value = 0x1;
      }
    }

    setInt(offset - 0x3b8, "uint8", value);
  } else if ("id" in item && item.id === "hero3Progression") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset - 0x3a7, "uint8", value);
  } else if ("id" in item && item.id?.match(/knight30Item-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const offset = itemInt.offset - index * 0x4;

    let dexterity = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      dexterity += getInt(offset + i * 0x4, "uint32");
    }

    setInt(offset - 0xc, "uint32", dexterity - 1);
  }
}

interface Quest {
  index: number;
  bit: number;
}

function updatePaths(offset: number, questIndex: number): void {
  const previousQuests = questPaths.reduce((quests: Quest[], quest) => {
    const index = quest.nextQuests.findIndex((index) => index === questIndex);

    if (index !== -1) {
      quests.push({ index: quest.index, bit: index });
    }

    return quests;
  }, []);

  const nextQuests = questPaths.reduce((quests: Quest[], quest) => {
    if (quest.index === questIndex) {
      quest.nextQuests.forEach((questIndex, index) => {
        if (questIndex !== undefined) {
          quests.push({ index: questIndex, bit: index });
        }
      });
    }

    return quests;
  }, []);

  const currentUnlocked = getInt(offset + questIndex * 0x8c - 0x4, "uint32");
  const currentCleared =
    getInt(offset + questIndex * 0x8c + 0x4, "uint16") +
    getInt(offset + questIndex * 0x8c + 0x6, "uint16");

  previousQuests.forEach((quest) => {
    const cleared =
      getInt(offset + quest.index * 0x8c + 0x4, "uint16") +
      getInt(offset + quest.index * 0x8c + 0x6, "uint16");

    if (!currentUnlocked) {
      setInt(offset + quest.index * 0x8c, "bit", 0x0, { bit: quest.bit });
    } else if (cleared) {
      setInt(offset + quest.index * 0x8c, "bit", 0x1, { bit: quest.bit });
    }
  });

  if (!currentCleared) {
    setInt(offset + questIndex * 0x8c, "uint8", 0x0);
    return;
  } else if (questIndex === 0x1d) {
    // If Quest 30 is cleared
    setInt(offset + questIndex * 0x8c, "uint8", 0x1);
    return;
  }

  nextQuests.forEach((quest) => {
    const unlocked = getInt(offset + quest.index * 0x8c - 0x4, "uint32");

    if (currentCleared && unlocked) {
      setInt(offset + questIndex * 0x8c, "bit", 0x1, { bit: quest.bit });
    }
  });
}
