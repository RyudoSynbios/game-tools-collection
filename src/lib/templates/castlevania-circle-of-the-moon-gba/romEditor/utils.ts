import { get } from "svelte/store";

import { gameJson, gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";

import {
  pointerToItemTexts,
  pointerToMonsterTexts,
  pointerToTexts,
} from "./template";

function getRegionArray<T>(array: T[]): T {
  const $gameRegion = get(gameRegion);

  return array[$gameRegion === 2 ? 1 : 0];
}

export function getItemNames(): { [value: number]: string } {
  const offset = getInt(getRegionArray(pointerToItemTexts), "uint24");

  const names: { [value: number]: string } = {};

  [...Array(55).keys()].forEach((index) => {
    names[index] = getText(getInt(offset + index * 0x2, "uint16"));
  });

  names[0x0] = "-";

  const dssCards = [
    "Salamander Card",
    "Serpent Card",
    "Mandragora Card",
    "Golem Card",
    "Cockatrice Card",
    "Manticore Card",
    "Griffin Card",
    "Thunderbir Card",
    "Unicorn Card",
    "Black Dog Card",
    "Mercury Card",
    "Venus Card",
    "Jupiter Card",
    "Mars Card",
    "Diana Card",
    "Apollo Card",
    "Neptune Card",
    "Saturn Card",
    "Uranus Card",
    "Pluto Card",
  ];

  for (let i = 0; i < dssCards.length; i += 1) {
    const offset = Object.keys(names).length;

    names[offset] = dssCards[i];
  }

  return names;
}

export function getMonsterNames(): { [value: number]: string } {
  const offset = getInt(getRegionArray(pointerToMonsterTexts), "uint24");

  const names: { [value: number]: string } = {};

  [...Array(142).keys()].forEach((index) => {
    names[index] = getText(getInt(offset + index * 0x4, "uint16"));
  });

  return names;
}

export function getText(index: number): string {
  const $gameJson = get(gameJson);

  if (!$gameJson.resources) {
    return "???";
  }

  const offsetTexts = getInt(getRegionArray(pointerToTexts), "uint24");

  let offset = getInt(offsetTexts + (index - 0x8001) * 0x4, "uint24");

  const letters = getRegionArray(
    $gameJson.resources.letters as { [key: number]: string }[],
  );

  let text = "";

  const isDialog = getInt(offset, "uint8") === 29;

  while (true) {
    const int = getInt(offset, "uint8");

    text += letters[int] || `[${int.toHex(2)}]`;

    if (int === 0) {
      if (
        !isDialog ||
        (isDialog &&
          (getInt(offset - 0x1, "uint8") === 3 ||
            (getInt(offset - 0x2, "uint8") === 29 &&
              getInt(offset - 0x1, "uint8") === 32) ||
            (getInt(offset - 0x2, "uint8") === 29 &&
              getInt(offset - 0x1, "uint8") === 192)))
      ) {
        break;
      }
    }

    offset += 0x1;
  }

  return text.replace(/\{.*?\}/g, "");
}
