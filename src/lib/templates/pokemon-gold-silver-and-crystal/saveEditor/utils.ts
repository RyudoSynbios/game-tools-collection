import { get } from "svelte/store";

import { gameRegion, gameTemplate } from "$lib/stores";
import { copyInt, getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { clone } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflagChecked,
  ItemBitflags,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemSection,
  ItemString,
  ItemTabs,
  Resource,
} from "$lib/types";

import { crystalParseItemAdaptater } from "./utils/crystal";
import {
  japanParseContainerAdaptater,
  japanParseItemAdaptater,
  japanShift,
} from "./utils/japan";
import { moveList, pokemonList } from "./utils/resource";

export const checksumShifts = [
  { offset: -0x0, offsetEnd: 0x0 }, // Gold and Silver
  { offset: -0x5c, offsetEnd: -0xdd }, // Gold and Silver (Japan)
  { offset: -0x5c, offsetEnd: -0x1e6 }, // Crystal
  { offset: -0x5c, offsetEnd: -0x286 }, // Crystal (Japan)
];

export let isCrystal = false;

export function overrideGetRegions(dataView: DataView): string[] {
  const $gameTemplate = get(gameTemplate);

  const itemSection = $gameTemplate.items[0] as ItemSection;

  for (let i = 0x0; i < 0x4; i += 0x1) {
    const itemChecksum = clone(itemSection.items[0]) as ItemChecksum;

    itemChecksum.offset += checksumShifts[i].offset;
    itemChecksum.control.offsetEnd += checksumShifts[i].offsetEnd;

    if (dataView.byteLength < itemChecksum.control.offsetEnd) {
      return [];
    }

    const checksum = generateChecksum(itemChecksum, dataView);

    if (checksum === getInt(itemChecksum.offset, "uint16", {}, dataView)) {
      switch (i) {
        case 0x2:
          isCrystal = true;
        case 0x0:
          return ["europe_usa_france_germany_italy_spain_australia"];
        case 0x3:
          isCrystal = true;
        case 0x1:
          return ["japan"];
      }
    }
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id === "playerGender") {
    const itemInt = item as ItemInt;

    if (isCrystal && $gameRegion === 1) {
      itemInt.offset += 0x41c3;
    }

    itemInt.hidden = !isCrystal;

    return itemInt;
  }

  if ($gameRegion === 1) {
    return japanParseItemAdaptater(item);
  } else if (isCrystal) {
    return crystalParseItemAdaptater(item);
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gameRegion = get(gameRegion);

  if (item.id === "boxes" && $gameRegion !== 1 && index >= 7) {
    return [true, [...shifts, 0x2000 + item.length * (index - 0x7)]];
  }

  return japanParseContainerAdaptater(item, shifts, index);
}

export function overrideItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/pokemonUnset/)) {
    if (item.type === "bitflags") {
      const itemBitflags = item as ItemBitflags;

      const [shift] = item.id.splitInt();

      const pokemonIndex = getInt(
        itemBitflags.flags[0].offset - shift,
        "uint8",
      );

      itemBitflags.disabled = pokemonIndex === 0xff;
    } else {
      const itemInt = item as ItemInt;

      let [shift, index] = item.id.splitInt();

      const pokemonIndex = getInt(
        itemInt.offset - shift - (index || 0x0),
        "uint8",
      );

      itemInt.disabled = pokemonIndex === 0xff;
    }
  }

  if ("id" in item && item.id?.match(/mail-/)) {
    const itemInt = item as ItemInt;

    let [index, shift] = item.id.splitInt();

    if ($gameRegion === 1) {
      if (shift === 45) {
        shift -= 0x6;
      } else if (shift === 47) {
        shift -= 0x5;
      }

      shift += index * 0x2a;
    } else {
      shift += index * 0x2f;
    }

    const int = getInt(itemInt.offset - shift, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id?.match(/pokemonTabs-/)) {
    const itemTabs = item as ItemTabs;

    if (item.id.match(/daycare/)) {
      return itemTabs;
    }

    const slotsItem = getItem(
      item.id.replace("pokemonTabs", "pokemonSlots"),
    ) as ItemInt;

    let slots = getInt(slotsItem.offset, "uint8");

    if (slots === 0xff) {
      slots = 0x0;
    }

    if (item.id.match(/box/)) {
      slots += 0x1;
    }

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  } else if (
    "id" in item &&
    item.id?.match(/name-pokemon|name-originalTrainer/)
  ) {
    const itemString = item as ItemString;

    const [, , type, index] = item.id.split("-");

    const pokemonItem = getItem(
      `pokemonPreview-${type}-${index}`,
    ) as ItemString;

    const pokemonIndex = getInt(pokemonItem.offset, "uint8");

    itemString.disabled = pokemonIndex === 0xff;

    return itemString;
  } else if ("id" in item && item.id?.match(/pokemonEgg-/)) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [tabIndex] = item.id.splitInt();

    const pokemonItem = getItem(`pokemon-${type}-${tabIndex}`) as ItemInt;

    const pokemonIndex = getInt(pokemonItem.offset, "uint8");

    itemInt.hidden = pokemonIndex !== 0xfd;

    return itemInt;
  } else if ("id" in item && item.id?.match(/gender/)) {
    const itemInt = item as ItemInt;

    let pokemonOffset = itemInt.offset - 0x15;

    if (item.id.match(/hallOfFame/)) {
      pokemonOffset = itemInt.offset - 0x3;
    }

    const gender = getPokemonGender(pokemonOffset, itemInt.offset);

    itemInt.hidden = gender === "none";

    return itemInt;
  } else if ("id" in item && item.id?.match(/unown/)) {
    const itemInt = item as ItemInt;

    let offset = itemInt.offset - 0x15;

    if (item.id.match(/hallOfFame/)) {
      offset = itemInt.offset - 0x3;
    }

    const pokemonIndex = getInt(offset, "uint8");

    itemInt.hidden = pokemonIndex !== 0xc9;

    return itemInt;
  } else if ("id" in item && item.id?.match(/pokemonUnset-27/)) {
    const itemInt = item as ItemInt;

    const [, , type] = item.id.split("-");
    const [, , index] = item.id.splitInt();

    const pokemonItem = getItem(`pokemon-${type}-${index}`) as ItemInt;

    itemInt.name = "Friendship";

    if (pokemonItem) {
      const pokemonIndex = getInt(pokemonItem.offset, "uint8");

      if (pokemonIndex === 0xfd) {
        itemInt.name = "Remaining Egg Cycles";
      }
    }

    return itemInt;
  } else if ("id" in item && item.id?.match(/moveMaxPP-/)) {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset - 0x15, "uint8");

    let move = moveList.find((move) => move.index === int);

    if (itemInt.disabled) {
      move = undefined;
    }

    itemInt.resource = `move${move?.maxPP || 0}PPs`;
    itemInt.disabled = !Boolean(move);

    return itemInt;
  } else if ("id" in item && item.id?.match(/(keyItem|item)-/)) {
    const itemInt = item as ItemInt;

    let [index, shift] = item.id.splitInt();

    shift += index * (item.id.includes("keyItem") ? 0x1 : 0x2);

    const int = getInt(itemInt.offset - shift, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  } else if ("id" in item && item.id?.match(/hallOfFame-/)) {
    const itemInt = item as ItemInt;

    const [index, shift] = item.id.splitInt();

    let length = 0x10;

    if ($gameRegion === 1) {
      length = 0xb;
    }

    const offset = itemInt.offset - index * length - shift;

    let count = 0;

    for (let i = 0x0; i < 0x6; i += 0x1) {
      if ([0x0, 0xff].includes(getInt(offset + i * length, "uint8"))) {
        break;
      }

      count += 1;
    }

    let disabled = index >= count;

    if (shift === 0 && index === count) {
      disabled = false;
    }

    itemInt.disabled = disabled;

    return itemInt;
  } else if ("id" in item && item.id === "hallOfFameTabs") {
    const itemTabs = item as ItemTabs;

    const slotsItem = getItem(item.id.replace("Tabs", "Slots")) as ItemInt;

    const slots = getInt(slotsItem.offset, "uint8");

    itemTabs.items.map((item, index) => {
      item.disabled = index > slots;
    });

    return itemTabs;
  }

  return item;
}

export function overrideGetInt(
  item: Item,
): [boolean, number | string | ItemBitflagChecked[] | undefined] {
  if ("id" in item && item.id?.match(/pokemonUnset/)) {
    if (item.type === "bitflags") {
      const itemBitflags = item as ItemBitflags;

      const flags = itemBitflags.flags.reduce(
        (flags: ItemBitflagChecked[], flag) => {
          flags.push({ ...flag, checked: false, disabled: true });

          return flags;
        },
        [],
      );

      if (itemBitflags.disabled) {
        return [true, flags];
      }
    } else {
      const itemInt = item as ItemInt;

      if (itemInt.disabled) {
        return [true, 0x0];
      }
    }
  }

  if ("id" in item && item.id === "badges") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint16").toBitCount();

    return [true, count];
  } else if ("id" in item && item.id?.match(/mail-/)) {
    const itemInt = item as ItemInt;

    const [, shift] = item.id.splitInt();

    if (itemInt.disabled) {
      if ([45, 47].includes(shift)) {
        return [true, 0x0];
      } else {
        return [true, ""];
      }
    }
  } else if ("id" in item && item.id === "ownedPokemon") {
    const itemInt = item as ItemInt;

    let count = 0;

    for (let i = 0x0; i < 0x20; i += 0x1) {
      count += getInt(itemInt.offset + i, "uint8").toBitCount();
    }

    return [true, count];
  } else if ("id" in item && item.id === "pokedexUnown") {
    const itemBitflags = item as ItemBitflags;

    const flags = itemBitflags.flags.reduce(
      (flags: ItemBitflagChecked[], flag, flagIndex) => {
        let checked = false;

        for (let i = 0x0; i < 0x1a; i += 0x1) {
          if (getInt(flag.offset + i, "uint8") === flagIndex + 0x1) {
            checked = true;
            break;
          }
        }

        flags.push({ ...flag, checked });

        return flags;
      },
      [],
    );

    return [true, flags];
  } else if ("id" in item && item.id?.match(/^name-/)) {
    const itemString = item as ItemString;

    if (itemString.disabled) {
      return [true, ""];
    }
  } else if ("id" in item && item.id?.match(/gender/)) {
    const itemInt = item as ItemInt;

    let pokemonOffset = itemInt.offset - 0x15;

    if (item.id.match(/hallOfFame/)) {
      pokemonOffset = itemInt.offset - 0x3;
    }

    const gender = getPokemonGender(pokemonOffset, itemInt.offset);

    if (gender === "male") {
      return [true, 0x1];
    }

    return [true, 0x0];
  } else if ("id" in item && item.id?.match(/unown/)) {
    const itemInt = item as ItemInt;

    const ivs = getInt(itemInt.offset, "uint16", { bigEndian: true });

    const int =
      ((ivs >> 0x1) & 0x3) |
      ((ivs >> 0x3) & 0xc) |
      ((ivs >> 0x5) & 0x30) |
      ((ivs >> 0x7) & 0xc0);

    const letter = Math.floor(int / 10);

    return [true, letter];
  } else if ("id" in item && item.id?.match(/shiny/)) {
    const itemInt = item as ItemInt;

    const defenseIV = getInt(itemInt.offset, "lower4");
    const attackIV = getInt(itemInt.offset, "upper4");
    const specialIV = getInt(itemInt.offset + 0x1, "lower4");
    const speedIV = getInt(itemInt.offset + 0x1, "upper4");

    let shiny = 0;

    if (defenseIV === 10 && specialIV === 10 && speedIV === 10) {
      shiny = (attackIV >> 0x1) & 0x1 ? 1 : 0;
    }

    return [true, shiny];
  } else if ("id" in item && item.id?.match(/hallOfFame-/)) {
    const [, shift] = item.id.splitInt();

    if (shift === 6) {
      const itemString = item as ItemString;

      if (itemString.disabled) {
        return [true, ""];
      }
    } else {
      const itemInt = item as ItemInt;

      if (itemInt.disabled) {
        if (shift === 0) {
          return [true, 0xff];
        }

        return [true, 0x0];
      } else if (shift === 0) {
        const pokemonIndex = getInt(itemInt.offset, "uint8");

        if (pokemonIndex === 0x0) {
          return [true, 0xff];
        }
      }
    }
  } else if ("id" in item && item.id?.match(/(keyItem|item)-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  } else if ("id" in item && item.id === "chosenStarter") {
    const itemInt = item as ItemInt;

    let int = 0x0;

    int += getInt(itemInt.offset, "bit", { bit: 2 }); // Starter obtained
    int += getInt(itemInt.offset, "bit", { bit: 4 }) << 0x1; // Totodile chosen
    int += getInt(itemInt.offset, "bit", { bit: 5 }) << 0x2; // Chikorita chosen

    return [true, int];
  }

  return [false, undefined];
}

export function overrideSetInt(
  item: Item,
  value: string,
  flag: ItemBitflag,
): boolean {
  if ("id" in item && item.id === "pokedexUnown") {
    const itemBitflags = item as ItemBitflags;

    const index = itemBitflags.flags.findIndex((f) => f.label === flag.label);

    for (let i = 0x0; i < 0x1a; i += 0x1) {
      const int = getInt(flag.offset + i, "uint8");

      if (value && int === 0x0) {
        setInt(flag.offset + i, "uint8", index + 0x1);
        break;
      } else if (int === index + 0x1) {
        setInt(flag.offset + i, "uint8", 0x0);
        break;
      }
    }

    return true;
  } else if (
    "id" in item &&
    item.id?.match(/^pokemon-|pokemonPreview-daycare-/)
  ) {
    const itemInt = item as ItemInt;

    const [, type] = item.id.split("-");
    const [index] = item.id.splitInt();

    const pokemonIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset, "uint8", pokemonIndex);

    const isDaycare = Boolean(item.id.match(/daycare/));

    let statsOffset = itemInt.offset;

    if (!isDaycare) {
      statsOffset = getPokemonStatsOffset(type, itemInt.offset, index);
    }

    setInt(statsOffset, "uint8", pokemonIndex);

    if (isDaycare) {
      const int = pokemonIndex === 0xff ? 0x0 : 0x1;

      let shift = 0x17;

      if (index === 1) {
        shift = 0x19;
      }

      setInt(statsOffset - shift + japanShift(0xa), "uint8", int); // Is Deposited
    } else {
      if (pokemonIndex !== 0xff && previous === 0xff) {
        setInt(itemInt.offset - index - 0x1, "uint8", index + 0x1); // Slots
        setInt(itemInt.offset + 0x1, "uint8", 0xff); // Next Pokémon
      } else if (pokemonIndex === 0xff) {
        setInt(itemInt.offset - index - 0x1, "uint8", index); // Slots
      }
    }

    if (previous === 0xff) {
      initPokemon(type, statsOffset, index);
    }

    // If Pokémon is an Egg, we assign "175 Togepi" by default
    if (pokemonIndex === 0xfd) {
      setInt(statsOffset, "uint8", 0xaf);
    }

    updatePokemonNames(type);

    return true;
  } else if ("id" in item && item.id?.match(/gender/)) {
    const itemInt = item as ItemInt;

    let pokemonOffset = itemInt.offset - 0x15;

    if (item.id.match(/hallOfFame/)) {
      pokemonOffset = itemInt.offset - 0x3;
    }

    const gender = parseInt(value) === 1 ? "male" : "female";

    setPokemonGender(pokemonOffset, itemInt.offset, gender);

    return true;
  } else if ("id" in item && item.id?.match(/unown/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value) * 10;

    const ivs =
      ((int & 0x3) << 0x1) |
      ((int & 0xc) << 0x3) |
      ((int & 0x30) << 0x5) |
      ((int & 0xc0) << 0x7);

    setInt(itemInt.offset, "uint16", ivs, { bigEndian: true });

    return true;
  } else if ("id" in item && item.id?.match(/shiny/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    if (int === 0x0) {
      setInt(itemInt.offset, "lower4", 9);
    } else {
      setInt(itemInt.offset, "lower4", 10);
      setInt(itemInt.offset, "bit", 1, { bit: 5 });
      setInt(itemInt.offset + 0x1, "lower4", 10);
      setInt(itemInt.offset + 0x1, "upper4", 10);
    }

    return true;
  } else if ("id" in item && item.id?.match(/hallOfFame-(.*?)-0$/)) {
    const itemInt = item as ItemInt;

    const pokemonIndex = parseInt(value);

    const previous = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset, "uint8", pokemonIndex);

    if ([0x0, 0xff].includes(previous)) {
      const trainerIDItem = getItem("trainerID") as ItemInt;

      const trainerID = getInt(trainerIDItem.offset, "uint16", {
        bigEndian: true,
      });

      setInt(itemInt.offset + 0x1, "uint16", trainerID, { bigEndian: true });
      setInt(itemInt.offset + 0x5, "uint8", 0x1); // Level
      setInt(itemInt.offset + 0x6, "uint8", 0x50); // Pokémon Name
      setInt(itemInt.offset + 0x10, "uint8", 0xff); // Next Pokémon
    }

    return true;
  } else if ("id" in item && item.id === "chosenStarter") {
    const itemInt = item as ItemInt;

    let int = parseInt(value);

    setInt(itemInt.offset, "bit", int, { bit: 2 }); // Starter obtained
    setInt(itemInt.offset, "bit", (int >> 0x1) & 0x1, { bit: 4 }); // Totodile chosen
    setInt(itemInt.offset, "bit", (int >> 0x2) & 0x1, { bit: 5 }); // Chikorita chosen

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/^name/)) {
    const itemString = item as ItemString;

    setInt(itemString.offset + itemString.length, "uint8", 0x50);

    if (item.id.match(/name-box/)) {
      updateResources("boxNames");
    } else if (item.id.match(/pokemonName/)) {
      const [, , type] = item.id.split("-");

      updatePokemonNames(type);
    }
  } else if ("id" in item && item.id === "playerGender") {
    const itemInt = item as ItemInt;

    copyInt(itemInt.offset, itemInt.offset - 0x1dd3 - japanShift(0x41e1));
  } else if ("id" in item && item.id === "itemSlots") {
    const itemInt = item as ItemInt;

    const count = getInt(itemInt.offset, "uint8");

    setInt(itemInt.offset + 0x1 + count * 0x2, "uint8", 0xff);

    for (let i = 0x0; i < count; i += 0x1) {
      const offset = itemInt.offset + 0x1 + i * 0x2;

      const itemIndex = getInt(offset, "uint8");

      if (itemIndex === 0xff) {
        setInt(offset, "uint8", 0x0);
        setInt(offset + 0x1, "uint8", 0x0);
      }
    }
  } else if ("id" in item && item.id?.match(/item-(.*?)-1$/)) {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint8");

    let quantity = getInt(itemInt.offset + 0x1, "uint8");

    if (itemIndex !== 0x0 && quantity === 0x0) {
      quantity = 0x1;
    } else if (itemIndex === 0x0) {
      quantity = 0x0;
    }

    setInt(itemInt.offset + 0x1, "uint8", quantity);
  }
}

export function generateChecksum(
  item: ItemChecksum,
  dataView?: DataView,
): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8", {}, dataView);
  }

  return formatChecksum(checksum, item.dataType);
}

export function onReset(): void {
  isCrystal = false;
}

function getNameOffset(type: string, index: number): number {
  const nameItem = getItem(`name-${type}-${index}`) as ItemString;

  return nameItem.offset;
}

export function getBoxNames(): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  const nameItem = getItem(`name-box-0`) as ItemString;

  const count = $gameRegion === 1 ? 0x1e : 0x14;

  for (let i = 0x0; i < count; i += 0x1) {
    names[i] = getString(
      nameItem.offset + i * nameItem.overrideShift!.shift,
      nameItem.length,
      nameItem.letterDataType,
      { endCode: nameItem.endCode, resource: nameItem.resource },
    );
  }

  return names;
}

function getPokemonGender(
  pokemonOffset: number,
  ivsOffset: number,
): "female" | "male" | "none" {
  const pokemonIndex = getInt(pokemonOffset, "uint8");
  const attackIV = getInt(ivsOffset, "upper4");

  const pokemon = pokemonList.find((pokemon) => pokemon.index === pokemonIndex);

  if (pokemon && pokemon.genderThreshold !== -1) {
    return attackIV + 0x1 > pokemon.genderThreshold ? "male" : "female";
  }

  return "none";
}

function setPokemonGender(
  pokemonOffset: number,
  ivsOffset: number,
  value: "female" | "male",
): void {
  const pokemonIndex = getInt(pokemonOffset, "uint8");

  const pokemon = pokemonList.find((pokemon) => pokemon.index === pokemonIndex);

  if (pokemon) {
    const attackIV = value === "male" ? pokemon.genderThreshold : 0x0;

    setInt(ivsOffset, "upper4", attackIV);
  }
}

export function getPokemonNames(type: string): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  const nameItem = getItem(`name-pokemonName-${type}-0`) as ItemString;

  if (type === "daycare") {
    const depositedStatus = [];

    depositedStatus.push(getInt(nameItem.offset - 0x1, "bit", { bit: 0 }));
    depositedStatus.push(
      getInt(nameItem.offset + 0x36 - japanShift(0xa), "bit", { bit: 0 }),
    );

    for (let i = 0x0; i < 0x2; i += 0x1) {
      if (depositedStatus[i]) {
        names[i] = getString(
          nameItem.offset + i * ($gameRegion === 1 ? 0x2f : 0x39),
          nameItem.length,
          nameItem.letterDataType,
          { endCode: nameItem.endCode, resource: nameItem.resource },
        );
      } else {
        names[i] = "???";
      }
    }

    return names;
  }

  const slotsItem = getItem(`pokemonSlots-${type}`) as ItemInt;

  let slots = getInt(slotsItem.offset, "uint8");

  if (slots === 0xff) {
    slots = 0x0;
  }

  let count = 0x6;

  if (type.match(/box/)) {
    count = $gameRegion === 1 ? 0x1e : 0x14;
  }

  for (let i = 0x0; i < count; i += 0x1) {
    if (i < slots) {
      names[i] = getString(
        nameItem.offset + i * nameItem.overrideShift!.shift,
        nameItem.length,
        nameItem.letterDataType,
        { endCode: nameItem.endCode, resource: nameItem.resource },
      );
    } else {
      names[i] = "???";
    }
  }

  return names;
}

function getPokemonStatsOffset(
  type: string,
  offset: number,
  index: number,
): number {
  const $gameRegion = get(gameRegion);

  let shift = 0x7;
  let instanceShift = 0x30;

  if (type.match(/box/)) {
    shift = $gameRegion === 1 ? 0x1f : 0x15;
    instanceShift = 0x20;
  }

  return offset + index * instanceShift - index + shift;
}

function initPokemon(type: string, offset: number, index: number): void {
  const nameItem = getItem("name-trainerName") as ItemString;

  const pokemonOffset = getNameOffset(`pokemonName-${type}`, index);

  const trainerSrcOffset = nameItem.offset;
  const trainerDstOffset = getNameOffset(`originalTrainer-${type}`, index);

  const noIdSrcOffset = nameItem.offset - 0x2;

  setInt(pokemonOffset, "uint8", 0x50); // Pokémon Name
  copyInt(trainerSrcOffset, trainerDstOffset, nameItem.length); // Trainer Name

  setInt(offset + 0x1, "uint8", 0x0); // Held Item
  setInt(offset + 0x2, "uint8", 0x0); // Move 1
  setInt(offset + 0x3, "uint8", 0x0); // Move 2
  setInt(offset + 0x4, "uint8", 0x0); // Move 3
  setInt(offset + 0x5, "uint8", 0x0); // Move 4
  copyInt(noIdSrcOffset, offset + 0x6, 0x2); // No ID
  setInt(offset + 0x8, "uint24", 0x0, { bigEndian: true }); // Experience
  setInt(offset + 0xb, "uint16", 0x0, { bigEndian: true }); // HP EV
  setInt(offset + 0xd, "uint16", 0x0, { bigEndian: true }); // Attack EV
  setInt(offset + 0xf, "uint16", 0x0, { bigEndian: true }); // Defense EV
  setInt(offset + 0x11, "uint16", 0x0, { bigEndian: true }); // Speed EV
  setInt(offset + 0x13, "uint16", 0x0, { bigEndian: true }); // Special EV
  setInt(offset + 0x15, "uint8", 0x0); // Attack / Defense IV
  setInt(offset + 0x16, "uint8", 0x0); // Speed / Special IV
  setInt(offset + 0x17, "uint8", 0x0); // Move 1 PP
  setInt(offset + 0x18, "uint8", 0x0); // Move 2 PP
  setInt(offset + 0x19, "uint8", 0x0); // Move 3 PP
  setInt(offset + 0x1a, "uint8", 0x0); // Move 4 PP
  setInt(offset + 0x1c, "uint8", 0x0); // Pokérus
  setInt(offset + 0x1d, "uint16", 0x0, { bigEndian: true }); // Catch Data
  setInt(offset + 0x1f, "uint8", 0x1); // Level

  if (getInt(offset, "uint8") === 0xfd) {
    setInt(offset + 0x1b, "uint8", 0xa); // Remaining Egg Cycles
  } else {
    setInt(offset + 0x1b, "uint8", 0x46); // Friendship
  }

  if (type === "party") {
    setInt(offset + 0x20, "uint8", 0x0); // Condition
    setInt(offset + 0x22, "uint16", 0x1, { bigEndian: true }); // HP
    setInt(offset + 0x24, "uint16", 0x1, { bigEndian: true }); // Max HP
    setInt(offset + 0x26, "uint16", 0x0, { bigEndian: true }); // Attack
    setInt(offset + 0x28, "uint16", 0x0, { bigEndian: true }); // Defense
    setInt(offset + 0x2a, "uint16", 0x0, { bigEndian: true }); // Speed
    setInt(offset + 0x2c, "uint16", 0x0, { bigEndian: true }); // Special Attack
    setInt(offset + 0x2e, "uint16", 0x0, { bigEndian: true }); // Special Defense
  }
}

export function onBoxChange(tabIndex: number): void {
  let type = "party";

  if (tabIndex > 0) {
    type = `box${tabIndex - 1}`;
  }

  updatePokemonNames(type);
}

export function onMainTabChange(tabIndex: number): void {
  if (tabIndex !== 2) {
    return;
  }

  for (let i = 0x0; i < 0x2; i += 0x1) {
    const pokemonItem = getItem(`pokemonPreview-daycare-${i}`) as ItemInt;

    const offset = pokemonItem.offset - 0x17 - i * 0x2 + japanShift(0xa);

    const hasPokemon = getInt(offset, "bit", { bit: 0 });

    if (!hasPokemon) {
      setInt(pokemonItem.offset, "uint8", 0xff);
    }
  }

  updatePokemonNames("daycare");
}

export function onPokemonChange(tabIndex: number, itemId: string): void {
  const [, type] = itemId.split("-");

  if (itemId.match(/box/)) {
    if (tabIndex === 0) {
      return;
    }

    tabIndex -= 1;
  }

  const pokemonItemSrc = getItem(`pokemon-${type}-${tabIndex}`) as ItemInt;
  const pokemonItemDst = getItem(
    `pokemonPreview-${type}-${tabIndex}`,
  ) as ItemInt;

  copyInt(pokemonItemSrc.offset, pokemonItemDst.offset);
}

export function updatePokemonNames(type: string): void {
  const values = getPokemonNames(type);

  updateResources("pokemonNames", values);
}
