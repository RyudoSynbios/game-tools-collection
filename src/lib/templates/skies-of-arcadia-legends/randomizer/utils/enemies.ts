import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";
import { Item } from "./item";

// prettier-ignore
export function randomizeEnemies(
  prng: Prng,
  options: Options,
  inventory: Item[],
): void {
  const $dataViewAlt = get(dataViewAlt);

  if (
    options.enemies.stats === 0x0 &&
    options.enemies.experienceGold === 0x0 &&
    options.enemies.drops === 0x0 &&
    options.qualityOfLife.experienceScale === 0x64 &&
    options.qualityOfLife.goldScale === 0x64
  ) {
    return;
  }

  const items = inventory.filter((item) => !item.type.match(/^ship/));
  const shipItems = inventory.filter((item) => item.type.match(/^ship/));

  const itemRates = [
    { min: 1, max: 1 },
    { min: 2, max: 10 },
    { min: 20, max: 50 },
    { min: 50, max: 100 },
  ];
  const itemRateRanges = [0, 0, 0, 0, 1, 1, 1, 2, 2, 3, 3];
  const shipIemRates = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 4, 7, 7, 8, 8,
  ];
  const itemCountRates = [1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4];
  const shipItemCountRates = [1, 1, 1, 1, 2, 2, 2, 3];

  // Enemies

  for (let i = 0x0; i < 0xff; i += 0x1) {
    const offset = i * 0x20c;

    // Stats

    if (options.enemies.stats !== 0x0) {
      let magicAttribute = getInt(offset + 0x17, "uint8", {}, $dataViewAlt.enemies);
      let hp = getInt(offset + 0x24, "uint32", { bigEndian: true }, $dataViewAlt.enemies);
      let will = getInt(offset + 0x5e, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let vigor = getInt(offset + 0x60, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let agile = getInt(offset + 0x62, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let quick = getInt(offset + 0x64, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let attack = getInt(offset + 0x66, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let defense = getInt(offset + 0x68, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let magicDefense = getInt(offset + 0x6a, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let hit = getInt(offset + 0x6c, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      let dodge = getInt(offset + 0x6e, "uint16", { bigEndian: true }, $dataViewAlt.enemies);

      if (options.enemies.stats === 0x1) {
        magicAttribute *= prng.getFloat(0.5, 1.5, `enemies_enemy_magicAttribute_1_${i}`);
        hp *= prng.getFloat(0.5, 1.5, `enemies_enemy_hp_1_${i}`);
        will *= prng.getFloat(0.5, 1.5, `enemies_enemy_will_1_${i}`);
        vigor *= prng.getFloat(0.5, 1.5, `enemies_enemy_vigor_1_${i}`);
        agile *= prng.getFloat(0.5, 1.5, `enemies_enemy_agile_1_${i}`);
        quick *= prng.getFloat(0.5, 1.5, `enemies_enemy_quick_1_${i}`);
        attack *= prng.getFloat(0.5, 1.5, `enemies_enemy_attack_1_${i}`);
        defense *= prng.getFloat(0.5, 1.5, `enemies_enemy_defense_1_${i}`);
        magicDefense *= prng.getFloat(0.5, 1.5, `enemies_enemy_magicDefense_1_${i}`);
        hit *= prng.getFloat(0.9, 1.1, `enemies_enemy_hit_1_${i}`);
        dodge *= prng.getFloat(0.9, 1.1, `enemies_enemy_dodge_1_${i}`);
      } else if (options.enemies.stats === 0x2) {
        hp *= prng.getFloat(0.1, 4, `enemies_enemy_hp_2_${i}`);
        will *= prng.getFloat(0.1, 4, `enemies_enemy_will_2_${i}`);
        vigor *= prng.getFloat(0.1, 4, `enemies_enemy_vigor_2_${i}`);
        agile *= prng.getFloat(0.1, 4, `enemies_enemy_agile_2_${i}`);
        quick *= prng.getFloat(0.1, 4, `enemies_enemy_quick_2_${i}`);
        attack *= prng.getFloat(0.1, 4, `enemies_enemy_attack_2_${i}`);
        defense *= prng.getFloat(0.1, 4, `enemies_enemy_defense_2_${i}`);
        magicDefense *= prng.getFloat(0.1, 4, `enemies_enemy_magicDefense_2_${i}`);
        hit *= prng.getFloat(0.5, 1.5, `enemies_enemy_hit_2_${i}`);
        dodge *= prng.getFloat(0.5, 1.5, `enemies_enemy_dodge_2_${i}`);
      }

      setInt(offset + 0x17, "uint8", magicAttribute, {}, "enemies");
      setInt(offset + 0x24, "uint32", hp, { bigEndian: true }, "enemies");
      setInt(offset + 0x5e, "uint16", will, { bigEndian: true }, "enemies");
      setInt(offset + 0x60, "uint16", vigor, { bigEndian: true }, "enemies");
      setInt(offset + 0x62, "uint16", agile, { bigEndian: true }, "enemies");
      setInt(offset + 0x64, "uint16", quick, { bigEndian: true }, "enemies");
      setInt(offset + 0x66, "uint16", attack, { bigEndian: true }, "enemies");
      setInt(offset + 0x68, "uint16", defense, { bigEndian: true }, "enemies");
      setInt(offset + 0x6a, "uint16", magicDefense, { bigEndian: true }, "enemies");
      setInt(offset + 0x6c, "uint16", hit, { bigEndian: true }, "enemies");
      setInt(offset + 0x6e, "uint16", dodge, { bigEndian: true }, "enemies");
    }

    // Experience / Gold

    let experience = getInt(offset + 0x1e, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
    let gold = getInt(offset + 0x20, "uint16", { bigEndian: true }, $dataViewAlt.enemies);

    if (options.enemies.experienceGold === 0x0) {
      experience *= options.qualityOfLife.experienceScale / 100;
      gold *= options.qualityOfLife.goldScale / 100;
    } else if (options.enemies.experienceGold === 0x1) {
      experience *= prng.getFloat(0.5, 1.5, `enemies_enemy_experience_1_${i}`);
      gold *= prng.getFloat(0.5, 1.5, `enemies_enemy_gold_1_${i}`);
    } else if (options.enemies.experienceGold === 0x2) {
      experience *= prng.getInt(0.1, 4, `enemies_enemy_experience_2_${i}`);
      gold *= prng.getInt(0.1, 4, `enemies_enemy_gold_2_${i}`);
    }

    setInt(offset + 0x1e, "uint16", experience, { bigEndian: true }, "enemies");
    setInt(offset + 0x20, "uint16", gold, { bigEndian: true }, "enemies");

    // Drops

    if (options.enemies.drops === 0x1) {
      const countRate = prng.getInt(0, itemCountRates.length - 1, `enemies_enemy_countRate_${i}`);
      const count = itemCountRates[countRate];

      // Check if first drop is a key item
      const rate = getInt(offset + 0x72, "uint16", { bigEndian: true }, $dataViewAlt.enemies);
      const itemIndex = getInt(offset + 0x76, "uint16", { bigEndian: true }, $dataViewAlt.enemies);

      const item = inventory.find((item) => item.index === itemIndex);

      if (rate !== 100 || item) {
        for (let j = 0x0; j < 0x4; j += 0x1) {
          let item = -1;
          let quantity = -1;
          let rate = -1;

          if (j < count) {
            const itemIndex = prng.getInt(0, items.length - 1, `enemies_enemy_dropItem_${j}_${i}`);
            const rateRangeIndex = prng.getInt(0, itemRateRanges.length - 1, `enemies_enemy_rateRange_${j}_${i}`);

            const { min, max } = itemRates[itemRateRanges[rateRangeIndex]];

            item = items[itemIndex].index;
            quantity = 1;
            rate = prng.getInt(min, max, `enemies_enemy_rate_${j}_${i}`);
          }

          setInt(offset + j * 0x6 + 0x76, "uint16", item, { bigEndian: true }, "enemies");
          setInt(offset + j * 0x6 + 0x74, "uint16", quantity, { bigEndian: true }, "enemies");
          setInt(offset + j * 0x6 + 0x72, "uint16", rate, { bigEndian: true }, "enemies");
        }
      }
    }
  }

  // Ships

  for (let i = 0x0; i < mainDolModels.enemyShips.count; i += 0x1) {
    const offset = i * mainDolModels.enemyShips.length;

    // Stats

    if (options.enemies.stats !== 0x0) {
      let hp = getInt(offset + 0x14, "uint32", { bigEndian: true }, $dataViewAlt.enemyShips);
      let will = getInt(offset + 0x18, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);
      let defense = getInt(offset + 0x1a, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);
      let magicDefense = getInt(offset + 0x1c, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);
      let quick = getInt(offset + 0x1e, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);
      let agile = getInt(offset + 0x20, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);
      let dodge = getInt(offset + 0x22, "uint16", { bigEndian: true }, $dataViewAlt.enemyShips);

      if (options.enemies.stats === 0x1) {
        hp *= prng.getFloat(0.5, 1.5, `enemies_ship_hp_1_${i}`);
        will *= prng.getFloat(0.5, 1.5, `enemies_ship_will_1_${i}`);
        defense *= prng.getFloat(0.5, 1.5, `enemies_ship_defense_1_${i}`);
        magicDefense *= prng.getFloat(0.5, 1.5, `enemies_ship_magicDefense_1_${i}`);
        quick *= prng.getFloat(0.5, 1.5, `enemies_ship_quick_1_${i}`);
        agile *= prng.getFloat(0.5, 1.5, `enemies_ship_agile_1_${i}`);
        dodge *= prng.getFloat(0.9, 1.1, `enemies_ship_dodge_1_${i}`);
      } else if (options.enemies.stats === 0x2) {
        hp *= prng.getFloat(0.1, 4, `enemies_ship_hp_2_${i}`);
        will *= prng.getFloat(0.1, 4, `enemies_ship_will_2_${i}`);
        defense *= prng.getFloat(0.1, 4, `enemies_ship_defense_2_${i}`);
        magicDefense *= prng.getFloat(0.1, 4, `enemies_ship_magicDefense_2_${i}`);
        quick *= prng.getFloat(0.1, 4, `enemies_ship_quick_2_${i}`);
        agile *= prng.getFloat(0.1, 4, `enemies_ship_agile_2_${i}`);
        dodge *= prng.getFloat(0.5, 1.5, `enemies_ship_dodge_2_${i}`);
      }

      setInt(offset + 0x14, "uint32", hp, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x18, "uint16", will, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x1a, "uint16", defense, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x1c, "uint16", magicDefense, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x1e, "uint16", quick, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x20, "uint16", agile, { bigEndian: true }, "enemyShips");
      setInt(offset + 0x22, "uint16", dodge, { bigEndian: true }, "enemyShips");
    }

    // Experience / Gold

    let experience = getInt(offset + 0x64, "int32", { bigEndian: true }, $dataViewAlt.enemyShips);
    let gold = getInt(offset + 0x68, "int32", { bigEndian: true }, $dataViewAlt.enemyShips);

    if (options.enemies.experienceGold === 0x0) {
      experience *= options.qualityOfLife.experienceScale / 100;
      gold *= options.qualityOfLife.goldScale / 100;
    } else if (options.enemies.experienceGold === 0x1) {
      experience *= prng.getFloat(0.5, 1.5, `enemies_ship_experience_1_${i}`);
      gold *= prng.getFloat(0.5, 1.5, `enemies_ship_gold_1_${i}`);
    } else if (options.enemies.experienceGold === 0x2) {
      experience *= prng.getFloat(0.1, 4, `enemies_ship_experience_2_${i}`);
      gold *= prng.getFloat(0.1, 4, `enemies_ship_gold_2_${i}`);
    }

    setInt(offset + 0x64, "uint32", experience, { bigEndian: true }, "enemyShips");
    setInt(offset + 0x68, "uint32", gold, { bigEndian: true }, "enemyShips");

    // Drops

    if (options.enemies.drops === 0x1) {
      const countRate = prng.getInt(0, shipItemCountRates.length - 1, `enemies_ship_countRate_${i}`);
      const count = shipItemCountRates[countRate];

      for (let j = 0x0; j < 0x3; j += 0x1) {
        let item = -1;
        let rate = -1;

        if (j < count) {
          const itemIndex = prng.getInt(0, shipItems.length - 1, `enemies_ship_dropItem_${j}_${i}`);
          const rateIndex = prng.getInt(0, shipIemRates.length - 1, `enemies_ship_rateRange_${j}_${i}`);

          item = shipItems[itemIndex].index;
          rate = shipIemRates[rateIndex];
        }

        setInt(offset + j * 0x4 + 0x6e, "uint16", item, { bigEndian: true }, "enemyShips");
        setInt(offset + j * 0x4 + 0x6c, "uint16", rate, { bigEndian: true }, "enemyShips");
      }
    }
  }
}
