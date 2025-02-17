import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { abilityTypes, mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";

// prettier-ignore
export function randomizeAbilities(prng: Prng, options: Options): void {
  const $dataViewAlt = get(dataViewAlt);

  if (
    options.abilities.magicEffectsValue === 0x0 &&
    options.abilities.magicRequiredRanks === 0x0 &&
    options.abilities.superMoveEffectsValue === 0x0 &&
    options.abilities.superMoveRequiredMoonberries === 0x0 &&
    options.qualityOfLife.superMovesUnlocked === 0x0 &&
    options.qualityOfLife.magicNoCost === 0x0 &&
    options.qualityOfLife.superMovesNoCost === 0x0
  ) {
    return;
  }

  const superMoveIndex = abilityTypes[0].count;
  const crewSuperMoveIndex = abilityTypes[0].count + abilityTypes[1].count;

  for (let i = 0x0; i < mainDolModels.abilities.count; i += 0x1) {
    const offset = i * mainDolModels.abilities.length;

    const isMagic = i < superMoveIndex;
    const isSuperMove = i >= superMoveIndex && i < crewSuperMoveIndex;

    // Effect Value

    if (
      options.abilities.magicEffectsValue !== 0x0 ||
      options.abilities.superMoveEffectsValue !== 0x0
    ) {
      let effectValue = getInt(offset + 0x1c, "int16", { bigEndian: true }, $dataViewAlt.abilities);
      let shipEffectValue = getInt(offset + 0x2a, "int16", { bigEndian: true }, $dataViewAlt.abilities);

      if (
        (isMagic && options.abilities.magicEffectsValue === 0x1) ||
        (isSuperMove && options.abilities.superMoveEffectsValue === 0x1)
      ) {
        if (effectValue > 0) {
          effectValue *= prng.getFloat(0.5, 1.5, `abilities_effectValue_1_${i}`);
        }

        if (shipEffectValue > 0) {
          shipEffectValue *= prng.getFloat(0.5, 1.5, `abilities_shipEffectValue_1_${i}`);
        }
      } else if (
        (isMagic && options.abilities.magicEffectsValue === 0x2) ||
        (isSuperMove && options.abilities.superMoveEffectsValue === 0x2)
      ) {
        if (effectValue > 0) {
          effectValue *= prng.getFloat(0.1, 4, `abilities_effectValue_2_${i}`);
        }

        if (shipEffectValue > 0) {
          shipEffectValue *= prng.getFloat(0.1, 4, `abilities_shipEffectValue_2_${i}`);
        }
      }

      setInt(offset + 0x1c, "int16", effectValue, { bigEndian: true }, "abilities");
      setInt(offset + 0x2a, "int16", shipEffectValue, { bigEndian: true }, "abilities");
    }

    // Quality of Life

    if (
      (isMagic && options.qualityOfLife.magicNoCost) ||
      (isSuperMove && options.qualityOfLife.superMovesNoCost)
    ) {
      setInt(offset + 0x19, "uint8", 0x0, {}, "abilities");
      setInt(offset + 0x28, "uint8", 0x0, {}, "abilities");
    }
  }

  // Required Magic Ranks

  if (options.abilities.magicRequiredRanks === 0x1) {
    const ranks: number[][] = [];

    for (let i = 0; i < 6; i += 1) {
      ranks[i] = [...new Array(6).keys()]
        .map((index) => index + 1)
        .sort((a, b) => {
          const ar = prng.getInt(0, 100, `abilities_magicRanks_1_${a}_${i}`);
          const br = prng.getInt(0, 100, `abilities_magicRanks_1_${b}_${i}`);

          return ar - br;
        });
    }

    for (let i = 0x0; i < abilityTypes[0].count; i += 0x1) {
      const offset = 0xaf8 + i * 0x2;

      const magic = getInt(offset, "uint8", {}, $dataViewAlt.experienceCurves);
      const rank =
        getInt(offset + 0x1, "uint8", {}, $dataViewAlt.experienceCurves) - 0x1;

      setInt(offset + 0x1, "uint8", ranks[magic][rank], {}, "experienceCurves");
    }
  } else if (options.abilities.magicRequiredRanks === 0x2) {
    const ranks = [];

    for (let i = 0x0; i < abilityTypes[0].count; i += 0x1) {
      ranks.push(
        getInt(0xaf8 + i * 0x2, "uint16", { bigEndian: true }, $dataViewAlt.experienceCurves),
      );
    }

    ranks.sort((a, b) => {
      const ar = prng.getInt(0, 100, `abilities_magicRanks_2_${a}`);
      const br = prng.getInt(0, 100, `abilities_magicRanks_2_${b}`);

      return ar - br;
    });

    for (let i = 0x0; i < abilityTypes[0].count; i += 0x1) {
      setInt(0xaf8 + i * 0x2, "uint16", ranks[i], { bigEndian: true }, "experienceCurves");
    }
  }

  // Required Super Move Moonberries

  if (options.abilities.superMoveRequiredMoonberries !== 0x0) {
    const characters: number[][] = [];

    for (let i = 0x0; i < abilityTypes[1].count; i += 0x1) {
      const offset = 0xb40 + i * 0x2;

      const character = getInt(offset, "uint8", {}, $dataViewAlt.experienceCurves);
      const moonberries = getInt(offset + 0x1, "uint8", {}, $dataViewAlt.experienceCurves);

      if (characters[character] === undefined) {
        characters[character] = [];
      }

      characters[character].push(moonberries);
    }

    characters.forEach((character, index) => {
      character.sort((a, b) => {
        const ar = prng.getInt(0, 100, `abilities_moonberries_${a}_${index}`);
        const br = prng.getInt(0, 100, `abilities_moonberries_${b}_${index}`);

        return ar - br;
      });
    });

    if (options.abilities.superMoveRequiredMoonberries === 0x2) {
      characters.forEach((character, index) => {
        character.map((moonstones) =>
          Math.round(
            moonstones *
              prng.getFloat(0.1, 4, `abilities_moonberries_2_${moonstones}_${index}`),
          ),
        );
      });
    }

    for (let i = 0x0; i < abilityTypes[1].count; i += 0x1) {
      const offset = 0xb40 + i * 0x2;

      const character = getInt(offset, "uint8", {}, $dataViewAlt.experienceCurves);
      const moonberries = characters[character].shift() as number;

      setInt(offset + 0x1, "uint8", moonberries, {}, "experienceCurves");
    }
  }

  // Quality of Life

  if (options.qualityOfLife.superMovesUnlocked) {
    for (let i = 0x0; i < abilityTypes[1].count; i += 0x1) {
      setInt(0xb41 + i * 0x2, "uint8", 0x0, {}, "experienceCurves");
    }
  }
}
