import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { cloneDataView, getInt, setInt } from "$lib/utils/bytes";
import { resetGcm } from "$lib/utils/common/gamecube";
import { getRandomNumber } from "$lib/utils/format";
import Prng from "$lib/utils/prng";

import { Item, ItemInt } from "$lib/types";

import {
  exportDataViewAlt,
  initDataViewAlt,
} from "../romEditor/utils/dataView";
import { randomizeAbilities } from "./utils/ability";
import { randomizeEnemies } from "./utils/enemies";
import { generateInventory, randomizeItems } from "./utils/item";
import { randomizeParty } from "./utils/party";
import { applyQualityOfLife } from "./utils/qualityOfLife";
import { randomizeShips } from "./utils/ship";
import { randomizeShops } from "./utils/shop";
import { randomizeTreasures } from "./utils/treasures";

export function beforeItemsParsing(): void {
  const $dataViewAlt = get(dataViewAlt);

  initDataViewAlt();

  $dataViewAlt.randomizer = new DataView(new ArrayBuffer(0xb0));

  generateSeed();

  // Init Experience / Gold scales
  setInt(0xa0, "uint16", 100, { bigEndian: true }, "randomizer");
  setInt(0xa2, "uint16", 100, { bigEndian: true }, "randomizer");
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "shopCount") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x1, "uint8", {}, $dataViewAlt.randomizer); // prettier-ignore

    itemInt.disabled = int < 0x3;

    return itemInt;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "shopItems") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.randomizer);

    if (int < 0x3) {
      setInt(itemInt.offset + 0x1, "uint8", 0x0, {}, "randomizer");
    }
  }
}

export function beforeSaving(): ArrayBufferLike {
  const $dataViewAlt = get(dataViewAlt);

  // Make a copy of initial dataViews before randomize
  const dataViewAltSave: { [key: string]: DataView } = {};

  Object.entries($dataViewAlt).forEach(([key, dataView]) => {
    dataViewAltSave[key] = cloneDataView(dataView);
  });

  randomize();

  const dataView = exportDataViewAlt();

  // Reapply initial dataViews
  dataViewAlt.set(dataViewAltSave);

  return dataView;
}

export function onReset(): void {
  resetGcm();
}

export function generateSeed(): void {
  setInt(0x0, "uint32", getRandomNumber(0x0, 0xffffffff), {}, "randomizer");
}

export function applyPreset(value: number): void {
  let items = 0;
  let modes = 0;
  let randomizes = 0;
  let vanillaRandomize = 0;
  let vanillaShuffleRandomize = 0;

  switch (value) {
    case 1:
      items = 1;
      modes = 1;
      vanillaShuffleRandomize = 1;
      break;
    case 2:
      items = 3;
      modes = 2;
      randomizes = 1;
      vanillaRandomize = 1;
      vanillaShuffleRandomize = 1;
      break;
    case 3:
      items = 4;
      modes = 3;
      randomizes = 2;
      vanillaRandomize = 1;
      vanillaShuffleRandomize = 2;
      break;
  }

  // General
  setInt(0x4, "uint8", modes, {}, "randomizer");

  // Party
  setInt(0x10, "uint8", randomizes, {}, "randomizer");
  setInt(0x11, "uint8", vanillaRandomize, {}, "randomizer");
  setInt(0x12, "uint8", vanillaRandomize, {}, "randomizer");
  setInt(0x13, "uint8", modes, {}, "randomizer");

  // Abilities
  setInt(0x20, "uint8", randomizes, {}, "randomizer");
  setInt(0x21, "uint8", vanillaShuffleRandomize, {}, "randomizer");
  setInt(0x22, "uint8", randomizes, {}, "randomizer");
  setInt(0x23, "uint8", vanillaShuffleRandomize, {}, "randomizer");

  // Items
  setInt(0x30, "uint8", randomizes, {}, "randomizer");
  setInt(0x31, "uint8", vanillaRandomize, {}, "randomizer");
  setInt(0x32, "uint8", randomizes, {}, "randomizer");

  // Ships
  setInt(0x40, "uint8", randomizes, {}, "randomizer");

  // Crew
  setInt(0x50, "uint8", randomizes, {}, "randomizer");

  // Enemies
  setInt(0x60, "uint8", randomizes, {}, "randomizer");
  setInt(0x61, "uint8", randomizes, {}, "randomizer");
  setInt(0x62, "uint8", vanillaRandomize, {}, "randomizer");

  // Shops
  setInt(0x70, "uint8", items, {}, "randomizer");
  setInt(0x71, "uint8", modes, {}, "randomizer");

  // Ranks
  setInt(0x80, "uint8", modes, {}, "randomizer");

  // Treasures
  setInt(0x90, "uint8", vanillaShuffleRandomize, {}, "randomizer");
}

export interface Options {
  seed: number;
  general: {
    moonStones: number;
  };
  party: {
    stats: number;
    equipment: number;
    moonStone: number;
  };
  abilities: {
    magicEffectsValue: number;
    magicRequiredRanks: number;
    superMoveEffectsValue: number;
    superMoveRequiredMoonberries: number;
  };
  items: {
    stats: number;
    effects: number;
    prices: number;
  };
  ships: {
    stats: number;
  };
  crew: {
    stats: number;
  };
  enemies: {
    stats: number;
    experienceGold: number;
    drops: number;
  };
  shops: {
    items: number;
    count: number;
  };
  ranks: {
    stats: number;
  };
  treasures: {
    contents: number;
  };
  qualityOfLife: {
    experienceScale: number;
    goldScale: number;
    magicUnlocked: number;
    superMovesUnlocked: number;
    magicNoCost: number;
    superMovesNoCost: number;
  };
}

function randomize(): void {
  const $dataViewAlt = get(dataViewAlt);

  const randomizer = $dataViewAlt.randomizer;

  const options: Options = {
    seed: getInt(0x0, "uint32", {}, randomizer),
    general: {
      moonStones: getInt(0x14, "uint8", {}, randomizer),
    },
    party: {
      stats: getInt(0x10, "uint8", {}, randomizer),
      equipment: getInt(0x11, "uint8", {}, randomizer),
      moonStone: getInt(0x12, "uint8", {}, randomizer),
    },
    abilities: {
      magicEffectsValue: getInt(0x20, "uint8", {}, randomizer),
      magicRequiredRanks: getInt(0x21, "uint8", {}, randomizer),
      superMoveEffectsValue: getInt(0x22, "uint8", {}, randomizer),
      superMoveRequiredMoonberries: getInt(0x23, "uint8", {}, randomizer),
    },
    items: {
      stats: getInt(0x30, "uint8", {}, randomizer),
      effects: getInt(0x31, "uint8", {}, randomizer),
      prices: getInt(0x32, "uint8", {}, randomizer),
    },
    ships: {
      stats: getInt(0x40, "uint8", {}, randomizer),
    },
    crew: {
      stats: getInt(0x50, "uint8", {}, randomizer),
    },
    enemies: {
      stats: getInt(0x60, "uint8", {}, randomizer),
      experienceGold: getInt(0x61, "uint8", {}, randomizer),
      drops: getInt(0x62, "uint8", {}, randomizer),
    },
    shops: {
      items: getInt(0x70, "uint8", {}, randomizer),
      count: getInt(0x71, "uint8", {}, randomizer),
    },
    ranks: {
      stats: getInt(0x80, "uint8", {}, randomizer),
    },
    treasures: {
      contents: getInt(0x90, "uint8", {}, randomizer),
    },
    qualityOfLife: {
      experienceScale: getInt(0xa0, "uint16", { bigEndian: true }, randomizer),
      goldScale: getInt(0xa2, "uint16", { bigEndian: true }, randomizer),
      magicUnlocked: getInt(0xa4, "bit", { bit: 0 }, randomizer),
      superMovesUnlocked: getInt(0xa4, "bit", { bit: 1 }, randomizer),
      magicNoCost: getInt(0xa4, "bit", { bit: 2 }, randomizer),
      superMovesNoCost: getInt(0xa4, "bit", { bit: 3 }, randomizer),
    },
  };

  const prng = new Prng(options.seed, "soal");

  const inventory = generateInventory();

  randomizeParty(prng, options, inventory);
  randomizeAbilities(prng, options);
  randomizeItems(prng, options);
  randomizeShips(prng, options);
  // randomizeCrew(prng, options);
  randomizeEnemies(prng, options, inventory);
  randomizeShops(prng, options, inventory);
  // randomizeRanks(prng, options);
  randomizeTreasures(prng, options, inventory);
  applyQualityOfLife(options);
}
