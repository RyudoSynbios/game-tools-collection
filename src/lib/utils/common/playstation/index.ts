import { get } from "svelte/store";

import { dataView, gameTemplate } from "$lib/stores";
import { numberArrayToString } from "$lib/utils/format";
import { getRegionValidator } from "$lib/utils/validator";

import MemoryCard, { isMemoryCardFile } from "./memoryCard";
import PSV, { isPSVFile } from "./psv";

export interface File {
  size: number;
  countryCode: string;
  productCode: string;
  identifier: string;
  blocks: number[];
}

export interface Save {
  file: File;
  offset: number;
}

let memoryCard: MemoryCard;
let psv: PSV;

export let saves: Save[] = [];

export function unpackFile(dataView: DataView): DataView {
  if (isMemoryCardFile(dataView)) {
    memoryCard = new MemoryCard(dataView);

    return memoryCard.unpack();
  } else if (isPSVFile(dataView)) {
    psv = new PSV(dataView);

    return psv.unpack();
  }

  return dataView;
}

export function repackFile(): ArrayBufferLike {
  const $dataView = get(dataView);

  if (memoryCard?.isInitialized()) {
    return memoryCard.repack();
  } else if (psv?.isInitialized()) {
    return psv.repack();
  }

  return $dataView.buffer;
}

export function customGetRegions(): string[] {
  const $gameTemplate = get(gameTemplate);

  const regions: string[] = [];

  let saves: Save[] = [];

  if (memoryCard?.isInitialized()) {
    saves = memoryCard.saves;
  } else if (psv?.isInitialized()) {
    saves = psv.saves;
  }

  Object.entries($gameTemplate.validator.regions).forEach(
    ([region, condition]) => {
      const validator: number[] = Object.values(condition)[0];

      const validatorStringified = numberArrayToString(validator);

      if (
        saves.some((save) =>
          save.file.productCode.includes(validatorStringified),
        )
      ) {
        regions.push(region);
      }
    },
  );

  return regions;
}

export function getRegionSaves(): Save[] {
  const validator = getRegionValidator(0x0);
  const validatorStringified = numberArrayToString(validator);

  let saves: Save[] = [];

  if (memoryCard?.isInitialized()) {
    saves = memoryCard.saves;
  } else if (psv?.isInitialized()) {
    saves = psv.saves;
  }

  return saves
    .filter((save) => save.file.productCode.includes(validatorStringified))
    .sort((a, b) =>
      a.file.identifier.localeCompare(b.file.identifier, "en", {
        numeric: true,
      }),
    );
}

export function getSlotShifts(index: number): [boolean, number[]] {
  const saves = getRegionSaves();

  if (saves[index]) {
    return [true, [saves[index].offset]];
  }

  return [true, [-1]];
}

export function getSlotShiftsByIdentifier(
  identifier: string,
): [boolean, number[]] {
  const saves = getRegionSaves();

  const save = saves.find((save) => save.file.identifier === identifier);

  if (save) {
    return [true, [save.offset]];
  }

  return [true, [-1]];
}

export function resetState(): void {
  saves = [];

  if (memoryCard?.isInitialized()) {
    memoryCard.destroy();
  } else if (psv?.isInitialized()) {
    psv.destroy();
  }
}
