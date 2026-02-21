import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { decodeChar } from "$lib/utils/encoding";
import { getRegionArray } from "$lib/utils/format";
import { applyPalette } from "$lib/utils/graphics";
import { getResource, updateResources } from "$lib/utils/parser";

import type { Item, ItemInt, Palette, Resource } from "$lib/types";

import AbilityIconSelector from "./components/AbilityIconSelector.svelte";
import ItemIconSelector from "./components/ItemIconSelector.svelte";
import PartyPortraitSelector from "./components/PartyPortraitSelector.svelte";
import {
  ABILITY_DESCRIPTIONS_START_INDEX,
  ABILITY_NAMES_START_INDEX,
  CHARACTER_NAMES_START_INDEX,
  CLASS_NAMES_START_INDEX,
  DJINNI_DESCRIPTIONS_START_INDEX,
  DJINNI_NAMES_START_INDEX,
  ENEMY_GROUPS_POINTER,
  ENEMY_NAMES_START_INDEX,
  ITEM_DESCRIPTIONS_START_INDEX,
  ITEM_NAMES_START_INDEX,
  MAP_NAMES_START_INDEX,
  PARTY_EXPERIENCES_POINTER,
  SHOPS_POINTER,
  SUMMONS_POINTER,
  TEXTS_POINTER,
} from "./utils/constants";

export function getComponent(
  component: string,
):
  | typeof AbilityIconSelector
  | typeof ItemIconSelector
  | typeof PartyPortraitSelector
  | undefined {
  switch (component) {
    case "AbilityIconSelector":
      return AbilityIconSelector;
    case "ItemIconSelector":
      return ItemIconSelector;
    case "PartyPortraitSelector":
      return PartyPortraitSelector;
  }
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | undefined] {
  if ("id" in item && item.id?.match(/getResource-/)) {
    const [index] = item.id.splitInt();

    let resource: Resource = {};

    if (item.id.match(/pName-/)) {
      resource = getCharacterNames();
    } else if (item.id.match(/cName-/)) {
      resource = getClassNames();
    } else if (item.id.match(/aName-/)) {
      resource = getAbilityNames();
    } else if (item.id.match(/aDescription-/)) {
      resource = getAbilityDescriptions();
    } else if (item.id.match(/iName-/)) {
      resource = getItemNames();
    } else if (item.id.match(/iDescription-/)) {
      resource = getItemDescriptions();
    } else if (item.id.match(/dName-/)) {
      resource = getDjinniNames();
    } else if (item.id.match(/dDescription-/)) {
      resource = getDjinniDescriptions();
    } else if (item.id.match(/sName-/)) {
      resource = getSummonNames();
    } else if (item.id.match(/sDescription-/)) {
      resource = getSummonDescriptions();
    } else if (item.id.match(/eName-/)) {
      resource = getEnemyNames();
    } else if (item.id.match(/mName-/)) {
      resource = getMapNames();
    }

    return [true, resource[index]];
  } else if ("id" in item && item.id?.match(/eExperience-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const partyExperiencesPointer = getRegionArray(PARTY_EXPERIENCES_POINTER);

    const offset = getInt(partyExperiencesPointer, "uint24");

    const int = getInt(offset + index * 99 * 4 + itemInt.offset, "int32");

    return [true, int];
  } else if ("id" in item && item.id === "aType") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint8") & 0x3f;

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/eExperience-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    const partyExperiencesPointer = getRegionArray(PARTY_EXPERIENCES_POINTER);

    const offset = getInt(partyExperiencesPointer, "uint24");

    setInt(offset + index * 99 * 4 + itemInt.offset, "int32", value);

    return true;
  } else if ("id" in item && item.id === "aType") {
    const itemInt = item as ItemInt;

    const int = (getInt(itemInt.offset, "uint8") & 0xc0) | parseInt(value);

    setInt(itemInt.offset, "uint8", int);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id === "sAbility") {
    updateResources("summonNames");
  } else if ("id" in item && item.id === "egEnemy") {
    updateResources("enemyGroupNames");
  } else if ("id" in item && item.id === "shType") {
    updateResources("shopNames");
  }
}

export function onReset(): void {
  textsCache = [];
  treesCache = [];
}

export function getAbilityDescriptions(): Resource {
  const descriptions: Resource = {};

  const abilityDescriptionStartIndex = getRegionArray(
    ITEM_DESCRIPTIONS_START_INDEX,
  );

  for (let i = 0x0; i < 0x207; i += 0x1) {
    descriptions[i] = getText(abilityDescriptionStartIndex + i);
  }

  return descriptions;
}

export function getAbilityNames(): Resource {
  const names: Resource = {};

  const abilityNamesStartIndex = getRegionArray(ABILITY_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x207; i += 0x1) {
    names[i] = getText(abilityNamesStartIndex + i);
  }

  return names;
}

export function getCharacterNames(): Resource {
  const names: Resource = {};

  const characterNamesStartIndex = getRegionArray(CHARACTER_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x8; i += 0x1) {
    names[i] = getText(characterNamesStartIndex + i);
  }

  return names;
}

export function getClassNames(): Resource {
  const names: Resource = {};

  const classNamesStartIndex = getRegionArray(CLASS_NAMES_START_INDEX);

  for (let i = 0x0; i < 0xcb; i += 0x1) {
    names[i] = getText(classNamesStartIndex + i);
  }

  return names;
}

export function getDjinniDescriptions(): Resource {
  const descriptions: Resource = {};

  const djinniDescriptionsStartIndex = getRegionArray(
    DJINNI_DESCRIPTIONS_START_INDEX,
  );

  for (let i = 0x0; i < 0x50; i += 0x1) {
    descriptions[i] = getText(djinniDescriptionsStartIndex + i);
  }

  return descriptions;
}

export function getDjinniNames(): Resource {
  const names: Resource = {};

  const djinniNamesStartIndex = getRegionArray(DJINNI_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x50; i += 0x1) {
    names[i] = getText(djinniNamesStartIndex + i);
  }

  return names;
}

export function getEnemyGroupNames(): Resource {
  const names: Resource = {};

  const offset = getInt(getRegionArray(ENEMY_GROUPS_POINTER), "int24");

  const enemyNamesStartIndex = getRegionArray(ENEMY_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x17c; i += 0x1) {
    names[i] = getText(
      enemyNamesStartIndex + getInt(offset + 0x1 + i * 0x10, "uint8"),
    );
  }

  names[0x0] = "-";

  return names;
}

export function getEnemyNames(): Resource {
  const names: Resource = {};

  const enemyNamesStartIndex = getRegionArray(ENEMY_NAMES_START_INDEX);

  for (let i = 0x0; i < 0xa4; i += 0x1) {
    names[i] = getText(enemyNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getItemDescriptions(): Resource {
  const descriptions: Resource = {};

  const itemDescriptionStartIndex = getRegionArray(
    ITEM_DESCRIPTIONS_START_INDEX,
  );

  for (let i = 0x0; i < 0x10d; i += 0x1) {
    descriptions[i] = getText(itemDescriptionStartIndex + i);
  }

  return descriptions;
}

export function getItemNames(): Resource {
  const names: Resource = {};

  const itemNamesStartIndex = getRegionArray(ITEM_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x10d; i += 0x1) {
    names[i] = getText(itemNamesStartIndex + i);
  }

  names[0x0] = "-";

  return names;
}

export function getMapNames(): Resource {
  const names: Resource = {};

  const mapNamesStartIndex = getRegionArray(MAP_NAMES_START_INDEX);

  for (let i = 0x0; i < 0xc9; i += 0x1) {
    names[i] = getText(mapNamesStartIndex + i);
  }

  return names;
}

export function getShopNames(): Resource {
  const names: Resource = {};

  const offset = getInt(getRegionArray(SHOPS_POINTER), "int24");

  const shopTypes = getResource("shopTypes") as Resource;

  for (let i = 0x0; i < 0x23; i += 0x1) {
    names[i] = shopTypes[getInt(offset + 0x40 + i * 0x42, "uint8")];
  }

  return names;
}

export function getSummonDescriptions(): Resource {
  const descriptions: Resource = {};

  const offset = getInt(getRegionArray(SUMMONS_POINTER), "int24");

  const abilityDescriptionsStartIndex = getRegionArray(
    ABILITY_DESCRIPTIONS_START_INDEX,
  );

  for (let i = 0x0; i < 0x10; i += 0x1) {
    descriptions[i] = getText(
      abilityDescriptionsStartIndex + getInt(offset + i * 0x8, "uint16"),
    );
  }

  return descriptions;
}

export function getSummonNames(): Resource {
  const names: Resource = {};

  const offset = getInt(getRegionArray(SUMMONS_POINTER), "int24");

  const abilityNamesStartIndex = getRegionArray(ABILITY_NAMES_START_INDEX);

  for (let i = 0x0; i < 0x10; i += 0x1) {
    names[i] = getText(
      abilityNamesStartIndex + getInt(offset + i * 0x8, "uint16"),
    );
  }

  return names;
}

let textsCache: string[] = [];

export function getText(index: number): string {
  if (treesCache.length === 0) {
    generateTrees();
  }

  if (!textsCache[index]) {
    textsCache[index] = decodeText(index);
  }

  return textsCache[index].replace(/\{.*?\}/g, "");
}

let treesCache: {
  binary: string;
  int: number;
}[][] = [];

function generateTrees(): void {
  const pointer = getRegionArray(TEXTS_POINTER);

  const pointerToStartCharTrees = getInt(pointer, "uint24");
  const startOffsetsTable = getInt(pointerToStartCharTrees + 0x4, "uint24");
  const startCharTrees = getInt(pointerToStartCharTrees, "uint24");

  let lastOffsetAddress = 0x0;

  for (
    let i = 0;
    i < (pointerToStartCharTrees - startOffsetsTable) / 2;
    i += 1
  ) {
    treesCache[i] = [];

    const offset = getInt(startOffsetsTable + i * 0x2, "uint16");

    const indexLimit = Math.round(
      ((lastOffsetAddress === 0x0
        ? offset
        : startCharTrees + offset - lastOffsetAddress) *
        8) /
        12,
    );

    if (offset !== 0x8000) {
      let bitstream = "";

      for (let j = 0x1; j <= offset; j += 0x1) {
        bitstream += getInt(startCharTrees + offset - j, "uint8").toBinary();
      }

      const chars = [];

      let char = "";

      for (let j = 0; j < bitstream.length; j += 0x1) {
        if (j >= 12 * chars.length + 0x4) {
          char += bitstream[j];

          if (char.length === 8) {
            const int = parseInt(char, 2);

            chars.push(int);

            char = "";
          }
        }
      }

      let binary = "";
      let index = 0x0;

      for (let j = 0x0; index < indexLimit; j += 0x1) {
        const bitstream = getInt(startCharTrees + offset + j, "uint8")
          .toBinary()
          .reverse();

        for (let k = 0x0; k < bitstream.length; k += 0x1) {
          if (bitstream[k] === "0") {
            binary += "0";
          } else if (bitstream[k] === "1") {
            treesCache[i].push({
              binary,
              int: chars[index],
            });

            binary = `${binary.substring(0, binary.lastIndexOf("0"))}1`;

            index += 1;
          }
        }

        if (index === indexLimit) {
          lastOffsetAddress = startCharTrees + offset + j + 0x1;
        }
      }
    }
  }
}

function decodeText(index: number): string {
  const $gameRegion = get(gameRegion);

  const pointer = getRegionArray(TEXTS_POINTER);

  const pointerToStartTextBitstream =
    getInt(pointer + 0x60, "uint24") + 0x8 * (index >> 0x8);

  const textBlock = getInt(pointerToStartTextBitstream, "uint24");
  const textBlockLengths = getInt(pointerToStartTextBitstream + 0x4, "uint24");

  const subindex = index & 0xff;

  let reducedTextsLength = 0x0;

  for (let i = textBlockLengths; i < textBlockLengths + subindex; i += 0x1) {
    reducedTextsLength += getInt(i, "uint8");
  }

  let bitstream = "";

  for (
    let i = 0x0;
    i <= getInt(textBlockLengths + subindex, "uint8");
    i += 0x1
  ) {
    bitstream += getInt(textBlock + reducedTextsLength + i, "uint8")
      .toBinary()
      .reverse();
  }

  let binary = "";
  let text = "";
  let treeIndex = 0x0;

  for (let i = 0x0; i <= bitstream.length; i += 0x1) {
    binary += bitstream[i];

    let charIndex = 0x0;

    if (treesCache[treeIndex].length > 1) {
      charIndex = treesCache[treeIndex].findIndex(
        (item) => item.binary === binary,
      );
    }

    if (charIndex !== -1) {
      for (let j = 0; j < 2; j += 1) {
        const tree = treesCache[treeIndex];

        if (tree.length === 0) {
          return text;
        }

        if (j === 0 || (j === 1 && tree.length === 1)) {
          const { int } = tree[j === 0 ? charIndex : 0];

          if (int < 0x20) {
            text += `{${int.toHex(2)}}`;
          } else if ($gameRegion !== 1) {
            text += String.fromCharCode(int);
          } else {
            if ([0xde, 0xdf].includes(int)) {
              text = text.slice(0, -1);
              text += decodeChar((int << 0x8) | treeIndex, "shiftJis");
            } else {
              text += decodeChar(int, "shiftJis");
            }
          }

          if (tree.length > 1) {
            binary = "";
          }

          if (int === 0x0) {
            return text;
          }

          treeIndex = int;
        }
      }
    }
  }

  return "DECODE ERROR!";
}

const compressed16Scheme = [
  "0", // #0
  "100", // #1
  "1010", // #2
  "1011", // #3
  "1100", // #4
  "1101", // #5
  "1110", // #6
  "111100", // #7
  "111101", // #8
  "111110", // #9
  "11111100", // #A
  "11111101", // #B
  "11111110", // #C
  "1111111100", // #D
  "1111111101", // #E
  "1111111110", // #F
  "1111111111", // End
];

export function getDecompressedData(offset: number): number[] {
  const decompressedData = [];

  let buffer = "";

  while (true) {
    const bitstream = getInt(offset, "uint8").toBinary().reverse();

    decompressedData.push(getInt(offset, "uint8"));

    for (let i = 0; i < bitstream.length; i += 1) {
      buffer += bitstream[i];

      if (compressed16Scheme.includes(buffer)) {
        const index = compressed16Scheme.findIndex((item) => item === buffer);

        if (index === 0x10) {
          return decompressedData;
        }

        buffer = "";
      }
    }

    offset += 0x1;
  }
}

export function getDecompressedSpriteData(
  decompressedData: number[],
): number[] {
  const spriteData = [];

  if (decompressedData.length > 0) {
    let bitstream = "";

    for (let i = 0x0; i < decompressedData.length; i += 0x1) {
      bitstream += decompressedData[i].toBinary().reverse();
    }

    let reference = "0123456789ABCDEF";

    let binary = "";

    for (let i = 0x0; i < bitstream.length; i += 1) {
      binary += bitstream[i];

      if (compressed16Scheme.includes(binary)) {
        const index = compressed16Scheme.findIndex((item) => item === binary);

        if (index === 0x10) {
          return spriteData;
        }

        spriteData.push(parseInt(reference[index], 16));

        reference =
          reference[index] +
          reference.substring(0, index) +
          reference.substring(index + 1);

        binary = "";
      }
    }
  }

  return spriteData;
}

export function getSprite(offset: number, palette: Palette): Uint8Array {
  const decompressedData = getDecompressedData(offset);
  const spriteData = getDecompressedSpriteData(decompressedData);
  const sprite = applyPalette(spriteData, palette);

  return sprite;
}
