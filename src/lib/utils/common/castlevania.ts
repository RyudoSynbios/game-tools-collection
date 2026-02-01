import pako from "pako";
import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion, gameTemplate } from "$lib/stores";

import { Validator } from "$lib/types";

import { getInt, setInt } from "../bytes";
import { getObjKey, mergeUint8Arrays } from "../format";
import { checkValidator, getRegions } from "../validator";

const magic = [0x53, 0x54, 0x41, 0x54, 0x52, 0x41, 0x4d, 0x30]; // "STATRAM0"

const gameOffsets: { [key: string]: number[] } = {
  cotm: [0x58e08, 0x50d08, 0x48c08], // Circle of the Moon
  hod: [0x9d808, 0x95708, 0x8d608], // Harmony of Dissonance
  aos: [0xe2208, 0xda108, 0xd2008], // Aria of Sorrow
  dos: [0x68688, 0x58588, 0x48488], // Dawn of Sorrow
  por: [0xacac8, 0x9c9c8, 0x8c8c8], // Portrait of Ruin
  ooe: [0xf0f08, 0xe0e08, 0xd0d08, 0x101008], // Order of Ecclesia
};

let regions: string[] = [];
let saveOffsets: number[] = [];
let saveLengths: number[] = [];

type Game = "aos" | "cotm" | "dos" | "hod" | "ooe" | "por";

export function isCastlevaniaCollectionSave(
  game: Game,
  dataView?: DataView,
): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if (dataView !== undefined) {
    return dataView.byteLength > gameOffsets[game][0];
  } else {
    return $dataViewAlt.collection !== undefined;
  }
}

export function extractCastlevaniaCollectionSaves(
  game: Game,
  dataView: DataView,
): DataView {
  const $dataViewAlt = get(dataViewAlt);
  const $gameTemplate = get(gameTemplate);

  const offsets = gameOffsets[game];

  const uint8Arrays: Uint8Array[] = [];

  let saveOffset = 0x0;

  offsets.forEach((offset, index) => {
    const region = Object.keys($gameTemplate.validator.regions)[index];
    const regionValidator = $gameTemplate.validator.regions[region] as Validator; // prettier-ignore
    const key = parseInt(getObjKey(regionValidator, 0));
    const validator = regionValidator[key];

    if (checkValidator(magic, offset, dataView)) {
      const length = getInt(offset + 0xc, "uint32", {}, dataView);

      const compressedData = new Uint8Array(
        dataView.buffer.slice(offset + 0x100, offset + 0x100 + length),
      );

      const decompressedData = pako.inflate(compressedData);

      const dataViewTmp = new DataView(decompressedData.buffer);

      if (checkValidator(validator, key, dataViewTmp)) {
        regions.push(region);
        saveOffsets.push(saveOffset);
        saveLengths.push(decompressedData.length);
        uint8Arrays.push(decompressedData);

        saveOffset += decompressedData.length;
      }
    }
  });

  const uint8Array = mergeUint8Arrays(...uint8Arrays);

  if (regions.length > 0) {
    $dataViewAlt.collection = dataView;
  }

  return new DataView(uint8Array.buffer);
}

export function injectCastlevaniaCollectionSaves(game: Game): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  const offset = gameOffsets[game][$gameRegion];

  const previousLength = getInt(offset + 0xc, "uint32", {}, $dataViewAlt.collection); // prettier-ignore

  const index = getSaveIndex();

  const decompressedData = $dataView.buffer.slice(
    saveOffsets[index],
    saveOffsets[index] + saveLengths[index],
  ) as ArrayBuffer;

  const compressedData = pako.deflate(decompressedData);

  [0xc, 0x48, 0x88, 0xc8].forEach((shift) => {
    setInt(offset + shift, "uint32", compressedData.length, {}, "collection");
  });

  const buffer = new Uint8Array($dataViewAlt.collection.buffer);

  buffer.set(new Uint8Array(previousLength), offset + 0x100);
  buffer.set(compressedData, offset + 0x100);

  $dataViewAlt.collection = new DataView(buffer.buffer);

  return $dataViewAlt.collection.buffer;
}

export function customGetRegions(dataView: DataView, shift: number): string[] {
  const $dataViewAlt = get(dataViewAlt);

  if (!$dataViewAlt.collection) {
    return getRegions(dataView, shift);
  }

  const { regions } = getState();

  return regions;
}

export function getSaveIndex(): number {
  const $gameRegion = get(gameRegion);
  const $gameTemplate = get(gameTemplate);

  const currentRegion = Object.keys($gameTemplate.validator.regions)[
    $gameRegion
  ];

  return regions.findIndex((region) => region === currentRegion);
}

export function getShifts(shifts: number[] = []): number[] {
  if (regions.length === 0) {
    return shifts;
  }

  const index = getSaveIndex();

  return [...shifts, saveOffsets[index]];
}

export function getState(): { regions: string[]; saveOffsets: number[] } {
  return { regions, saveOffsets };
}

export function resetState(): void {
  regions = [];
  saveOffsets = [];
  saveLengths = [];
}
