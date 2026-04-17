import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";
import { Item } from "./item";

interface Treasure {
  index: number;
  itemIndex: number;
  type: string;
  quantity: number;
}

// prettier-ignore
export function randomizeTreasures(
  prng: Prng,
  options: Options,
  inventory: Item[],
): void {
  const $dataViewAlt = get(dataViewAlt);

  if (options.treasures.contents === 0x0) {
    return;
  }

  // Add Gold indexes
  for (let i = 0x200; i < 0x20e; i += 0x1) {
    inventory.push({
      index: i,
      type: "gold",
      characters: 0xff,
    });
  }

  if (options.treasures.contents === 0x1) {
    const treasures: Treasure[] = [];

    for (let i = 0x0; i < mainDolModels.treasures.count; i += 0x1) {
      const offset = i * mainDolModels.treasures.length;

      const itemIndex = getInt(offset, "uint32", { bigEndian: true }, $dataViewAlt.treasures);
      const quantity = getInt(offset + 0x4, "uint32", { bigEndian: true }, $dataViewAlt.treasures);

      const item = inventory.find((item) => item.index === itemIndex);

      if (item) {
        treasures.push({
          index: i,
          itemIndex: item.index,
          type: item.type,
          quantity,
        });
      }
    }

    treasures.sort((a, b) => {
      const ar = prng.getInt(0, 100, `treasures_contents_1_${a.index}`);
      const br = prng.getInt(0, 100, `treasures_contents_1_${b.index}`);

      return ar - br;
    });

    for (let i = 0x0; i < mainDolModels.treasures.count; i += 0x1) {
      const offset = i * mainDolModels.treasures.length;

      setInt(offset, "uint32", treasures[i].itemIndex, { bigEndian: true }, "treasures");
      setInt(offset + 0x4, "uint32", treasures[i].quantity, { bigEndian: true }, "treasures");
    }
  } else if (options.treasures.contents === 0x2) {
    for (let i = 0x0; i < mainDolModels.treasures.count; i += 0x1) {
      const offset = i * mainDolModels.treasures.length;

      const itemIndex = prng.getInt(0, inventory.length - 1, `treasures_contents_2_${i}`);

      const item = inventory[itemIndex];

      let max = 1;

      switch (item.type) {
        case "weapon":
        case "shipWeapon":
          max = 2;
          break;
        case "armor":
        case "accessory":
        case "shipAccessory":
        case "shipItem":
          max = 3;
          break;
        case "item":
          max = 50;
          break;
        case "gold":
          max = 10000;
          break;
      }

      const quantity = prng.getInt(1, max, `treasures_quantity_2_${i}`);

      setInt(offset, "uint32", item.index, { bigEndian: true }, "treasures");
      setInt(offset + 0x4, "uint32", quantity, { bigEndian: true }, "treasures");
    }
  }
}
