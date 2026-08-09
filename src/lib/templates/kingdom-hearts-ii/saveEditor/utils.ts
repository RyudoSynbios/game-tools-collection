import { get } from "svelte/store";

import { dataView, gamePlatform, gameRegion } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import {
  customGetRegions,
  getRegionSaves,
  getSlotShifts,
  repackFile,
  resetState,
  unpackFile,
} from "$lib/utils/common/playstation2";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  Resource,
} from "$lib/types";

import { finalMixParseItemAdaptater } from "./utils/finalmix";
import { japanParseItemAdaptater } from "./utils/japan";
import { abilityList, itemList } from "./utils/resource";

export function setGamePlatform(dataView: DataView, fileName: string): void {
  if (fileName.match(/KHIIFM/)) {
    gamePlatform.set(1);
  } else {
    gamePlatform.set(0);
  }
}

export function beforeInitDataView(dataView: DataView): DataView {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return unpackFile(dataView);
  }

  return dataView;
}

export function overrideGetRegions(dataView: DataView): string[] {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    const saves = getHD25RemixSaves(dataView);

    if (saves.length > 0) {
      return ["finalMix"];
    }

    return [];
  }

  return customGetRegions();
}

export function onInitFailed(): void {
  resetState();
}

export function beforeItemsParsing(): void {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    gameRegion.set(7);
  }
}

export function overrideParseItem(item: Item): Item {
  const $gamePlatform = get(gamePlatform);
  const $gameRegion = get(gameRegion);

  if ("id" in item && item.id?.match(/time/)) {
    const itemInt = item as ItemInt;

    if ([1, 2, 7].includes($gameRegion)) {
      itemInt.operations![0] = { "/": 60 };
    }
  } else if ("id" in item && item.id?.match(/^drive-/)) {
    const itemInt = item as ItemInt;

    const [index] = item.id.splitInt();

    itemInt.hidden = index !== 0;
  } else if ("id" in item && item.id?.match(/ability-/)) {
    const itemInt = item as ItemInt;

    const [max, index] = item.id.splitInt();

    itemInt.hidden = $gameRegion !== 7 && index >= max;
  } else if ("id" in item && item.id === "finalMixExclude") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion === 7;
  } else if ("id" in item && item.id === "finalMixOnly") {
    const itemInt = item as ItemInt;

    itemInt.hidden = $gameRegion !== 7;
  }

  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    if ($gamePlatform === 1) {
      const saves = getHD25RemixSaves();

      itemContainer.instances = saves.length;

      return itemContainer;
    }

    const saves = getRegionSaves().filter(
      (save) => !save.file.name.endsWith("-SYS"),
    );

    itemContainer.instances = saves.length;

    return itemContainer;
  }

  if ($gameRegion === 2) {
    return japanParseItemAdaptater(item);
  } else if ($gameRegion === 7) {
    return finalMixParseItemAdaptater(item);
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  const $gamePlatform = get(gamePlatform);

  if (item.id === "slots") {
    if ($gamePlatform === 1) {
      const saves = getHD25RemixSaves();

      return [true, [saves[index].offset]];
    }

    return getSlotShifts(index);
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    const [shift, index] = item.id.splitInt();

    const int = getInt(itemInt.offset - shift - index * 0x2, "uint8");

    itemInt.disabled = index >= int;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/item-/)) {
    const itemInt = item as ItemInt;

    if (itemInt.disabled) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

const dataArray = [
  0x00000000, 0x8b17e770, 0x12eed357, 0x99f93427, 0x25dda6ae, 0xaeca41de,
  0x373375f9, 0xbc249289, 0x4bbb4d5c, 0xc0acaa2c, 0x59559e0b, 0xd242797b,
  0x6e66ebf2, 0xe5710c82, 0x7c8838a5, 0xf79fdfd5, 0x97769ab8, 0x1c617dc8,
  0x859849ef, 0x0e8fae9f, 0xb2ab3c16, 0x39bcdb66, 0xa045ef41, 0x2b520831,
  0xdccdd7e4, 0x57da3094, 0xce2304b3, 0x4534e3c3, 0xf910714a, 0x7207963a,
  0xebfea21d, 0x60e9456d, 0x2a2c28c7, 0xa13bcfb7, 0x38c2fb90, 0xb3d51ce0,
  0x0ff18e69, 0x84e66919, 0x1d1f5d3e, 0x9608ba4e, 0x6197659b, 0xea8082eb,
  0x7379b6cc, 0xf86e51bc, 0x444ac335, 0xcf5d2445, 0x56a41062, 0xddb3f712,
  0xbd5ab27f, 0x364d550f, 0xafb46128, 0x24a38658, 0x988714d1, 0x1390f3a1,
  0x8a69c786, 0x017e20f6, 0xf6e1ff23, 0x7df61853, 0xe40f2c74, 0x6f18cb04,
  0xd33c598d, 0x582bbefd, 0xc1d28ada, 0x4ac56daa, 0x5458518e, 0xdf4fb6fe,
  0x46b682d9, 0xcda165a9, 0x7185f720, 0xfa921050, 0x636b2477, 0xe87cc307,
  0x1fe31cd2, 0x94f4fba2, 0x0d0dcf85, 0x861a28f5, 0x3a3eba7c, 0xb1295d0c,
  0x28d0692b, 0xa3c78e5b, 0xc32ecb36, 0x48392c46, 0xd1c01861, 0x5ad7ff11,
  0xe6f36d98, 0x6de48ae8, 0xf41dbecf, 0x7f0a59bf, 0x8895866a, 0x0382611a,
  0x9a7b553d, 0x116cb24d, 0xad4820c4, 0x265fc7b4, 0xbfa6f393, 0x34b114e3,
  0x7e747949, 0xf5639e39, 0x6c9aaa1e, 0xe78d4d6e, 0x5ba9dfe7, 0xd0be3897,
  0x49470cb0, 0xc250ebc0, 0x35cf3415, 0xbed8d365, 0x2721e742, 0xac360032,
  0x101292bb, 0x9b0575cb, 0x02fc41ec, 0x89eba69c, 0xe902e3f1, 0x62150481,
  0xfbec30a6, 0x70fbd7d6, 0xccdf455f, 0x47c8a22f, 0xde319608, 0x55267178,
  0xa2b9aead, 0x29ae49dd, 0xb0577dfa, 0x3b409a8a, 0x87640803, 0x0c73ef73,
  0x958adb54, 0x1e9d3c24, 0xa8b0a31c, 0x23a7446c, 0xba5e704b, 0x3149973b,
  0x8d6d05b2, 0x067ae2c2, 0x9f83d6e5, 0x14943195, 0xe30bee40, 0x681c0930,
  0xf1e53d17, 0x7af2da67, 0xc6d648ee, 0x4dc1af9e, 0xd4389bb9, 0x5f2f7cc9,
  0x3fc639a4, 0xb4d1ded4, 0x2d28eaf3, 0xa63f0d83, 0x1a1b9f0a, 0x910c787a,
  0x08f54c5d, 0x83e2ab2d, 0x747d74f8, 0xff6a9388, 0x6693a7af, 0xed8440df,
  0x51a0d256, 0xdab73526, 0x434e0101, 0xc859e671, 0x829c8bdb, 0x098b6cab,
  0x9072588c, 0x1b65bffc, 0xa7412d75, 0x2c56ca05, 0xb5affe22, 0x3eb81952,
  0xc927c687, 0x423021f7, 0xdbc915d0, 0x50def2a0, 0xecfa6029, 0x67ed8759,
  0xfe14b37e, 0x7503540e, 0x15ea1163, 0x9efdf613, 0x0704c234, 0x8c132544,
  0x3037b7cd, 0xbb2050bd, 0x22d9649a, 0xa9ce83ea, 0x5e515c3f, 0xd546bb4f,
  0x4cbf8f68, 0xc7a86818, 0x7b8cfa91, 0xf09b1de1, 0x696229c6, 0xe275ceb6,
  0xfce8f292, 0x77ff15e2, 0xee0621c5, 0x6511c6b5, 0xd935543c, 0x5222b34c,
  0xcbdb876b, 0x40cc601b, 0xb753bfce, 0x3c4458be, 0xa5bd6c99, 0x2eaa8be9,
  0x928e1960, 0x1999fe10, 0x8060ca37, 0x0b772d47, 0x6b9e682a, 0xe0898f5a,
  0x7970bb7d, 0xf2675c0d, 0x4e43ce84, 0xc55429f4, 0x5cad1dd3, 0xd7bafaa3,
  0x20252576, 0xab32c206, 0x32cbf621, 0xb9dc1151, 0x05f883d8, 0x8eef64a8,
  0x1716508f, 0x9c01b7ff, 0xd6c4da55, 0x5dd33d25, 0xc42a0902, 0x4f3dee72,
  0xf3197cfb, 0x780e9b8b, 0xe1f7afac, 0x6ae048dc, 0x9d7f9709, 0x16687079,
  0x8f91445e, 0x0486a32e, 0xb8a231a7, 0x33b5d6d7, 0xaa4ce2f0, 0x215b0580,
  0x41b240ed, 0xcaa5a79d, 0x535c93ba, 0xd84b74ca, 0x646fe643, 0xef780133,
  0x76813514, 0xfd96d264, 0x0a090db1, 0x811eeac1, 0x18e7dee6, 0x93f03996,
  0x2fd4ab1f, 0xa4c34c6f, 0x3d3a7848, 0xb62d9f38,
];

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0xffffffff;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    const iteration = i - item.control.offsetStart;

    if (iteration < 0x8 || iteration >= 0xc) {
      const index = (getInt(i, "uint8") ^ (checksum >> 0x18)) & 0xff;

      checksum = (checksum << 0x8) ^ dataArray[index];
    }
  }

  checksum = ~checksum;

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 0) {
    return repackFile();
  }

  return $dataView.buffer;
}

export function onReset(): void {
  resetState();
}

export function getAbilityNames(): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  abilityList.forEach((ability) => {
    if (!ability.finalMix || (ability.finalMix && $gameRegion === 7)) {
      names[ability.index] = ability.name;
    }
  });

  names[0x0] = "-";

  return names;
}

export function getItemNames(type: string): Resource {
  const $gameRegion = get(gameRegion);

  const names: Resource = {};

  let subtype = -1;

  switch (type) {
    case "accessories":
      subtype = 0x3;
      break;
    case "armors":
      subtype = 0x2;
      break;
    case "items":
      subtype = 0x0;
      break;
    case "weapons":
      subtype = 0x1;
      break;
  }

  itemList.forEach((item) => {
    if (
      (!item.finalMix || $gameRegion === 7) &&
      item.type !== 0x1 &&
      item.type >> 0x4 === subtype
    ) {
      names[item.index] = item.name;
    }
  });

  names[0x0] = "-";

  return names;
}

export function getSlotNames(): Resource {
  const $gamePlatform = get(gamePlatform);

  if ($gamePlatform === 1) {
    const saves = getHD25RemixSaves();

    return saves.reduce((names: Resource, save, index) => {
      names[index] = `Slot ${parseInt(save.name) + 1}`;

      return names;
    }, {});
  }

  const saves = getRegionSaves();

  return saves.reduce((names: Resource, save, index) => {
    const name = save.file.name.slice(-2);

    names[index] = `Slot ${parseInt(name) + 1}`;

    return names;
  }, {});
}

function getHD25RemixSaves(
  dataView?: DataView,
): { name: string; offset: number }[] {
  const saves = [];

  for (let i = 0x0; i < 0x63; i += 0x1) {
    const offset = 0x1d6 + i * 0x158;

    if (getInt(offset, "uint8", {}, dataView) === 0x2d) {
      saves.push({
        name: getString(offset + 0x1, 0x2, "uint8", {}, dataView),
        offset: 0x19690 + i * 0x10fc0,
      });
    }
  }

  return saves.sort((a, b) =>
    a.name.localeCompare(b.name, "en", { numeric: true }),
  );
}
