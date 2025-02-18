import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { getRegionArray } from "$lib/utils/format";

import { offsetToRandomEncounterRate } from "../../romEditor/template";
import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";

export function applyQualityOfLife(options: Options): void {
  const $dataViewAlt = get(dataViewAlt);

  if (
    options.qualityOfLife.magicUnlocked === 0x0 &&
    options.qualityOfLife.reduceRandomEncouterRate === 0x0
  ) {
    return;
  }

  // Magic

  if (options.qualityOfLife.magicUnlocked) {
    for (let i = 0x0; i < mainDolModels.party.count; i += 0x1) {
      const offset = i * mainDolModels.party.length;

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

      const green = experiences[6];
      const red = experiences[13];
      const purple = experiences[20];
      const blue = experiences[27];
      const yellow = experiences[34];
      const silver = experiences[41];

      setInt(offset + 0x80, "uint32", green, { bigEndian: true }, "party");
      setInt(offset + 0x84, "uint32", red, { bigEndian: true }, "party");
      setInt(offset + 0x88, "uint32", purple, { bigEndian: true }, "party");
      setInt(offset + 0x8c, "uint32", blue, { bigEndian: true }, "party");
      setInt(offset + 0x90, "uint32", yellow, { bigEndian: true }, "party");
      setInt(offset + 0x94, "uint32", silver, { bigEndian: true }, "party");
    }
  }

  // Random Encounter Rate

  if (options.qualityOfLife.reduceRandomEncouterRate === 0x1) {
    const randomEncounterRateOffset = getRegionArray(
      offsetToRandomEncounterRate,
    );

    setInt(randomEncounterRateOffset, "float32", 0.01, { bigEndian: true }, "main.dol"); // prettier-ignore
  }
}
