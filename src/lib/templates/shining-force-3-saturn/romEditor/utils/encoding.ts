import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { decodeChar } from "$lib/utils/encoding";
import { getRegionArray } from "$lib/utils/format";

import { cache, getFileOffset, getScenario, iso, isPatched } from "../utils";
import { kanjiTable } from "./resource";

export function getText(
  index: number,
  format = true,
  dataView?: DataView,
): string {
  let text = "";

  if (cache.dummyTextFile.byteLength === 0) {
    const file = iso.getFile("X5SHOP_T.BIN");

    if (file) {
      cache.dummyTextFile = file.dataView;
    }
  }

  if (dataView) {
    text = decodeText(index, dataView);
  } else {
    if (!cache.texts[index]) {
      cache.texts[index] = decodeText(index, cache.dummyTextFile);
    }

    text = cache.texts[index];
  }

  if (format) {
    return text.replace(/\{.*?\}/g, "");
  }

  return text;
}

export const decodeTextError = "DECODE ERROR!";

function decodeText(index: number, dataView: DataView): string {
  const $gameRegion = get(gameRegion);

  const scenario = getScenario();
  const patched = isPatched();

  const kanjis = getRegionArray(kanjiTable);

  if (dataView.byteLength === 0) {
    return decodeTextError;
  }

  const treesPointerOffset = scenario === "1" && !patched ? 0xc : 0x18;
  const treesOffset = getFileOffset("x5", treesPointerOffset, dataView);

  const pagesPointerOffset = scenario === "1" && !patched ? 0x18 : 0x24;

  const page = Math.floor(index / 0x100);

  index -= page * 0x100;

  const pagesOffset = getFileOffset("x5", pagesPointerOffset, dataView);

  if (pagesOffset + page * 0x4 >= dataView.byteLength) {
    return decodeTextError;
  }

  let wordOffset = getFileOffset("x5", pagesOffset + page * 0x4, dataView);

  for (let i = 0x0; i < index; i += 0x1) {
    wordOffset += getInt(wordOffset, "uint8", {}, dataView) + 0x1;

    const size = getInt(wordOffset, "uint8", {}, dataView);

    if (size === 0x0) {
      if ((i & 0xff) === 0xff) {
        i -= 0x1;
      } else {
        return decodeTextError;
      }
    }
  }

  wordOffset += 0x1;

  let text = "";

  let letter = 0xffff;
  let lastLetter = 0x0;

  let treeIndex = 0x0;
  let local10 = 0x80;

  while (letter !== 0x0) {
    letter = 0x0;

    for (let i = 0x0; i < 0x2; i += 0x1) {
      let mask = 0x80;

      const treeOffset = treesOffset + treeIndex * 0x8;
      const lettersOffset = getFileOffset("x5", treeOffset, dataView);

      let local1c = getFileOffset("x5", treeOffset + 0x4, dataView);
      let leaf = 0x0;

      while (true) {
        let bVar1 = getInt(local1c, "uint8", {}, dataView) & mask;

        mask >>= 0x1;

        if (mask === 0x0) {
          local1c += 0x1;
          mask = 0x80;
        }

        if (bVar1 !== 0x0) {
          break;
        }

        bVar1 = getInt(wordOffset, "uint8", {}, dataView) & local10;

        local10 >>= 0x1;

        if (local10 === 0x0) {
          wordOffset += 0x1;
          local10 = 0x80;
        }

        if (bVar1 !== 0x0) {
          let iVar3 = 0x0;

          while (iVar3 >= 0x0) {
            if ((getInt(local1c, "uint8", {}, dataView) & mask) === 0x0) {
              iVar3 += 0x1;
            } else {
              leaf += 0x1;
              iVar3 -= 0x1;
            }

            mask >>= 0x1;

            if (mask === 0x0) {
              local1c += 0x1;
              mask = 0x80;
            }
          }
        }
      }

      const leafValue = getInt(lettersOffset + leaf, "uint8", {}, dataView);

      letter = (letter << 0x8) | leafValue;
      treeIndex = leafValue;
    }

    if (letter < 0x20) {
      text += `{${letter.toHex(2)}}`;
    } else if ($gameRegion === 0) {
      text += String.fromCharCode(letter);
    } else {
      if (letter >= 0x100) {
        text += kanjis[letter] || "�";
      } else if ([0xde, 0xdf].includes(letter)) {
        text = text.slice(0, -1);
        text += decodeChar((letter << 0x8) | lastLetter, "shiftJis");
      } else {
        text += decodeChar(letter, "shiftJis");
      }
    }

    lastLetter = letter;
  }

  return text;
}
