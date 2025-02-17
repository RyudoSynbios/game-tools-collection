import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { extractBit, getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";
import { Item } from "./item";

export function randomizeParty(
  prng: Prng,
  options: Options,
  inventory: Item[],
): void {
  const $dataViewAlt = get(dataViewAlt);

  if (
    options.party.stats === 0x0 &&
    options.party.magic === 0x0 &&
    options.party.equipment === 0x0 &&
    options.party.moonStone === 0x0 &&
    options.qualityOfLife.magicUnlocked === 0x0
  ) {
    return;
  }

  for (let i = 0x0; i < mainDolModels.party.count; i += 0x1) {
    const offset = i * mainDolModels.party.length;

    // Stats

    // prettier-ignore
    if (options.party.stats !== 0x0) {
      let mp = getInt(offset + 0xf, "uint8", {}, $dataViewAlt.party);
      let hp = getInt(offset + 0x1c, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let power = getInt(offset + 0x60, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let will = getInt(offset + 0x62, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let vigor = getInt(offset + 0x64, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let agile = getInt(offset + 0x66, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let quick = getInt(offset + 0x68, "uint16", { bigEndian: true }, $dataViewAlt.party);
      let growthHp = getInt(offset + 0x1e, "int16", { bigEndian: true }, $dataViewAlt.party);
      let growthMp = getInt(offset + 0x2c, "float32", { bigEndian: true }, $dataViewAlt.party);
      let growthPower = getInt(offset + 0x6c, "float32", { bigEndian: true }, $dataViewAlt.party);
      let growthWill = getInt(offset + 0x70, "float32", { bigEndian: true }, $dataViewAlt.party);
      let growthVigor = getInt(offset + 0x74, "float32", { bigEndian: true }, $dataViewAlt.party);
      let growthAgile = getInt(offset + 0x78, "float32", { bigEndian: true }, $dataViewAlt.party);
      let growthQuick = getInt(offset + 0x7c, "float32", { bigEndian: true }, $dataViewAlt.party);

      if (options.party.stats === 0x1) {
        mp *= prng.getFloat(0.5, 1.5, `party_stats_mp_1_${i}`);
        hp *= prng.getFloat(0.5, 1.5, `party_stats_hp_1_${i}`);
        power *= prng.getFloat(0.5, 1.5, `party_stats_power_1_${i}`);
        will *= prng.getFloat(0.5, 1.5, `party_stats_will_1_${i}`);
        vigor *= prng.getFloat(0.5, 1.5, `party_stats_vigor_1_${i}`);
        agile *= prng.getFloat(0.5, 1.5, `party_stats_agile_1_${i}`);
        quick *= prng.getFloat(0.5, 1.5, `party_stats_quick_1_${i}`);
        growthHp *= prng.getFloat(0.5, 1.5, `party_stats_growthHp_1_${i}`);
        growthMp *= prng.getFloat(0.5, 1.5, `party_stats_growthMp_1_${i}`);
        growthPower *= prng.getFloat(0.5, 1.5, `party_stats_growthPower_1_${i}`);
        growthWill *= prng.getFloat(0.5, 1.5, `party_stats_growthWill_1_${i}`);
        growthVigor *= prng.getFloat(0.5, 1.5, `party_stats_growthVigor_1_${i}`);
        growthAgile *= prng.getFloat(0.5, 1.5, `party_stats_growthAgile_1_${i}`);
        growthQuick *= prng.getFloat(0.5, 1.5, `party_stats_growthQuick_1_${i}`);
      } else if (options.party.stats === 0x2) {
        mp *= prng.getFloat(0.1, 4, `party_mp_2_${i}`);
        hp *= prng.getFloat(0.1, 4, `party_hp_2_${i}`);
        power *= prng.getFloat(0.1, 4, `party_power_2_${i}`);
        will *= prng.getFloat(0.1, 4, `party_will_2_${i}`);
        vigor *= prng.getFloat(0.1, 4, `party_vigor_2_${i}`);
        agile *= prng.getFloat(0.1, 4, `party_agile_2_${i}`);
        quick *= prng.getFloat(0.1, 4, `party_quick_2_${i}`);
        growthHp *= prng.getFloat(0.1, 4, `party_stats_growthHp_2_${i}`);
        growthMp *= prng.getFloat(0.1, 4, `party_stats_growthMp_2_${i}`);
        growthPower *= prng.getFloat(0.1, 4, `party_stats_growthPower_2_${i}`);
        growthWill *= prng.getFloat(0.1, 4, `party_stats_growthWill_2_${i}`);
        growthVigor *= prng.getFloat(0.1, 4, `party_stats_growthVigor_2_${i}`);
        growthAgile *= prng.getFloat(0.1, 4, `party_stats_growthAgile_2_${i}`);
        growthQuick *= prng.getFloat(0.1, 4, `party_stats_growthQuick_2_${i}`);
      }

      setInt(offset + 0xf, "uint8", mp, {}, "party");
      setInt(offset + 0x1a, "uint16", hp, { bigEndian: true }, "party");
      setInt(offset + 0x1c, "uint16", hp, { bigEndian: true }, "party");
      setInt(offset + 0x60, "uint16", power, { bigEndian: true }, "party");
      setInt(offset + 0x62, "uint16", will, { bigEndian: true }, "party");
      setInt(offset + 0x64, "uint16", vigor, { bigEndian: true }, "party");
      setInt(offset + 0x66, "uint16", agile, { bigEndian: true }, "party");
      setInt(offset + 0x68, "uint16", quick, { bigEndian: true }, "party");
      setInt(offset + 0x1e, "int16", growthHp, { bigEndian: true }, "party");
      setInt(offset + 0x2c, "float32", growthMp, { bigEndian: true }, "party");
      setInt(offset + 0x6c, "float32", growthPower, { bigEndian: true }, "party");
      setInt(offset + 0x70, "float32", growthWill, { bigEndian: true }, "party");
      setInt(offset + 0x74, "float32", growthVigor, { bigEndian: true }, "party");
      setInt(offset + 0x78, "float32", growthAgile, { bigEndian: true }, "party");
      setInt(offset + 0x7c, "float32", growthQuick, { bigEndian: true }, "party");
    }

    // Initial Magic Ranks

    if (options.party.magic === 0x1 || options.qualityOfLife.magicUnlocked) {
      const experiences = [];

      for (let j = 0x0; j < 0x24; j += 0x1) {
        const offset = 0x948 + i * 0x48 + j * 0x2;

        if (j % 0x6 === 0x0) {
          experiences.push(0);
        }

        // prettier-ignore
        experiences.push(
          getInt(offset, "uint16", { bigEndian: true }, $dataViewAlt.experienceCurves),
        );
      }

      let greenRank = 0;
      let redRank = 0;
      let purpleRank = 0;
      let blueRank = 0;
      let yellowRank = 0;
      let silverRank = 0;

      if (options.qualityOfLife.magicUnlocked) {
        greenRank = 6;
        redRank = 6;
        purpleRank = 6;
        blueRank = 6;
        yellowRank = 6;
        silverRank = 6;
      } else if (options.party.magic === 0x1) {
        greenRank = prng.getInt(0, 6, `party_magic_green_${i}`);
        redRank = prng.getInt(0, 6, `party_magic_red_${i}`);
        purpleRank = prng.getInt(0, 6, `party_magic_purple_${i}`);
        blueRank = prng.getInt(0, 6, `party_magic_blue_${i}`);
        yellowRank = prng.getInt(0, 6, `party_magic_yellow_${i}`);
        silverRank = prng.getInt(0, 6, `party_magic_silver_${i}`);
      }

      const green = experiences[greenRank];
      const red = experiences[redRank + 7];
      const purple = experiences[purpleRank + 14];
      const blue = experiences[blueRank + 21];
      const yellow = experiences[yellowRank + 28];
      const silver = experiences[silverRank + 35];

      setInt(offset + 0x80, "uint32", green, { bigEndian: true }, "party");
      setInt(offset + 0x84, "uint32", red, { bigEndian: true }, "party");
      setInt(offset + 0x88, "uint32", purple, { bigEndian: true }, "party");
      setInt(offset + 0x8c, "uint32", blue, { bigEndian: true }, "party");
      setInt(offset + 0x90, "uint32", yellow, { bigEndian: true }, "party");
      setInt(offset + 0x94, "uint32", silver, { bigEndian: true }, "party");
    }

    // Initial Equipment

    // prettier-ignore
    if (options.party.equipment === 0x1) {
      const bit = 5 - i;

      const weapons = inventory.filter(
        (item) => item.type === "weapon" && item.characters === i,
      );
      const armors = inventory.filter(
        (item) => item.type === "armor" && extractBit(item.characters, bit),
      );
      const accessories = inventory.filter(
        (item) => item.type === "accessory" && extractBit(item.characters, bit),
      );

      const weaponIndex = prng.getInt(0, weapons.length - 1, `party_weapon_${i}`);
      const armorIndex = prng.getInt(0, armors.length - 1, `party_armor_${i}`);
      const accessoryIndex = prng.getInt(0, accessories.length - 1, `party_accessory_${i}`);

      const weapon = weapons[weaponIndex].index;
      const armor = armors[armorIndex].index;
      const accessory = accessories[accessoryIndex].index;

      setInt(offset + 0x12, "uint16", weapon, { bigEndian: true }, "party");
      setInt(offset + 0x14, "uint16", armor, { bigEndian: true }, "party");
      setInt(offset + 0x16, "uint16", accessory, { bigEndian: true }, "party");
    }
  }
}
