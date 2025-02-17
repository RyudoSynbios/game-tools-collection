import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";

export function randomizeShips(prng: Prng, options: Options): void {
  const $dataViewAlt = get(dataViewAlt);

  if (options.ships.stats === 0x0) {
    return;
  }

  for (let i = 0x0; i < mainDolModels.ships.count; i += 0x1) {
    const offset = i * mainDolModels.ships.length;

    // Stats

    // prettier-ignore
    if (options.ships.stats !== 0x0) {
      let hp = getInt(offset + 0x14, "uint32", { bigEndian: true }, $dataViewAlt.ships);
      let defense = getInt(offset + 0x1c, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let magic = getInt(offset + 0x1e, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let quick = getInt(offset + 0x20, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let dodge = getInt(offset + 0x22, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let growthHp = getInt(offset + 0x48, "uint32", { bigEndian: true }, $dataViewAlt.ships);
      let growthSpirit = getInt(offset + 0x4c, "int16", { bigEndian: true }, $dataViewAlt.ships);
      let growthMaxSpirit = getInt(offset + 0x4e, "int16", { bigEndian: true }, $dataViewAlt.ships);
      let growthDefense = getInt(offset + 0x50, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let growthMagicDefense = getInt(offset + 0x52, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let growthQuick = getInt(offset + 0x54, "uint16", { bigEndian: true }, $dataViewAlt.ships);
      let growthDodge = getInt(offset + 0x56, "uint16", { bigEndian: true }, $dataViewAlt.ships);

      if (options.ships.stats === 0x1) {
        hp *= prng.getFloat(0.5, 1.5, `ships_stats_hp_1_${i}`);
        defense *= prng.getFloat(0.5, 1.5, `ships_stats_defense_1_${i}`);
        magic *= prng.getFloat(0.5, 1.5, `ships_stats_magic_1_${i}`);
        quick *= prng.getFloat(0.5, 1.5, `ships_stats_quick_1_${i}`);
        dodge *= prng.getFloat(0.5, 1.5, `ships_stats_dodge_1_${i}`);
        growthHp *= prng.getFloat(0.5, 1.5, `ships_stats_growthHp_1_${i}`);
        growthSpirit *= prng.getFloat(0.5, 1.5, `ships_stats_growthSpirit_1_${i}`);
        growthMaxSpirit *= prng.getFloat(0.5, 1.5, `ships_stats_growthMaxSpirit_1_${i}`);
        growthDefense *= prng.getFloat(0.5, 1.5, `ships_stats_growthDefense_1_${i}`);
        growthMagicDefense *= prng.getFloat(0.5, 1.5, `shipsstats_growthMagicDefense_1_${i}`);
        growthQuick *= prng.getFloat(0.5, 1.5, `ships_stats_growthQuick_1_${i}`);
        growthDodge *= prng.getFloat(0.5, 1.5, `ships_stats_growthDodge_1_${i}`);
      } else if (options.ships.stats === 0x2) {
        hp *= prng.getFloat(0.1, 4, `ships_stats_hp_2_${i}`);
        defense *= prng.getFloat(0.1, 4, `ships_stats_defense_2_${i}`);
        magic *= prng.getFloat(0.1, 4, `ships_stats_magic_2_${i}`);
        quick *= prng.getFloat(0.1, 4, `ships_stats_quick_2_${i}`);
        dodge *= prng.getFloat(0.1, 4, `ships_stats_dodge_2_${i}`);
        growthHp *= prng.getFloat(0.1, 4, `ships_stats_growthHp_2_${i}`);
        growthSpirit *= prng.getFloat(0.1, 4, `ships_stats_growthSpirit_2_${i}`);
        growthMaxSpirit *= prng.getFloat(0.1, 4, `ships_stats_growthMaxSpirit_2_${i}`);
        growthDefense *= prng.getFloat(0.1, 4, `ships_stats_growthDefense_2_${i}`);
        growthMagicDefense *= prng.getFloat(0.1, 4, `ships_stats_growthMagicDefense_2_${i}`);
        growthQuick *= prng.getFloat(0.1, 4, `ships_stats_growthQuick_2_${i}`);
        growthDodge *= prng.getFloat(0.1, 4, `ships_stats_growthDodge_2_${i}`);
      }

      setInt(offset + 0x14, "uint32", hp, { bigEndian: true }, "ships");
      setInt(offset + 0x1c, "uint16", defense, { bigEndian: true }, "ships");
      setInt(offset + 0x1e, "uint16", magic, { bigEndian: true }, "ships");
      setInt(offset + 0x20, "uint16", quick, { bigEndian: true }, "ships");
      setInt(offset + 0x22, "uint16", dodge, { bigEndian: true }, "ships");
      setInt(offset + 0x48, "uint32", growthHp, { bigEndian: true }, "ships");
      setInt(offset + 0x4c, "int16", growthSpirit, { bigEndian: true }, "ships");
      setInt(offset + 0x4e, "int16", growthMaxSpirit, { bigEndian: true }, "ships");
      setInt(offset + 0x50, "uint16", growthDefense, { bigEndian: true }, "ships");
      setInt(offset + 0x52, "uint16", growthMagicDefense, { bigEndian: true }, "ships");
      setInt(offset + 0x54, "uint16", growthQuick, { bigEndian: true }, "ships");
      setInt(offset + 0x56, "uint16", growthDodge, { bigEndian: true }, "ships");
    }
  }
}
