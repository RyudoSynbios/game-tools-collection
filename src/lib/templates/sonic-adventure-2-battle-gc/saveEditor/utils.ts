import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem, updateResources } from "$lib/utils/parser";

import { Item, ItemChecksum, ItemInt, ItemString, ItemTab } from "$lib/types";

import { stories } from "./utils/resource";

export function overrideParseItem(item: Item): Item | ItemChecksum | ItemTab {
  if ("id" in item && item.id === "checksum") {
    const itemChecksum = item as ItemChecksum;

    if (isChaoGarden()) {
      itemChecksum.offset = 0xfae4;
      itemChecksum.dataType = "uint64";
      itemChecksum.control.offsetStart = 0x3080;
      itemChecksum.control.offsetEnd = 0xfaec;
    }

    return itemChecksum;
  } else if ("id" in item && item.id === "main") {
    const itemTab = item as ItemTab;

    if (isChaoGarden()) {
      itemTab.hidden = true;
    }

    return itemTab;
  } else if ("id" in item && item.id === "chaoGarden") {
    const itemTab = item as ItemTab;

    if (!isChaoGarden()) {
      itemTab.hidden = true;
    }

    return itemTab;
  }

  return item;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/storyProgression-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const progression = getInt(itemInt.offset, "uint8");

    let value = 0x0;

    if (
      (index === 0 && progression === 0x2d) ||
      (index === 1 && progression === 0x2b) ||
      (index === 2 && progression === 0x7)
    ) {
      value = 0x1;
    }

    setInt(itemInt.offset + 0x3489, "uint8", value);

    updateEmblems();
  } else if ("id" in item && item.id === "storyRank") {
    const aRanks: {
      [key: string]: {
        count: number;
        total: number;
      };
    } = {
      sonic: { count: 0, total: 0 },
      tails: { count: 0, total: 0 },
      knuckles: { count: 0, total: 0 },
      shadow: { count: 0, total: 0 },
      eggman: { count: 0, total: 0 },
      rouge: { count: 0, total: 0 },
      last: { count: 0, total: 0 },
    };

    stories.forEach((story) =>
      story.stages.forEach((stage) => {
        for (let i = 0x0; i < 0x5; i += 0x1) {
          const value = getInt(0x28b8 + stage.index * 0xc4 + i, "uint8");

          if (value === 5) {
            aRanks[stage.character].count += 1;
          }

          aRanks[stage.character].total += 1;
        }
      }),
    );

    Object.entries(aRanks).forEach(([character, stats]) => {
      const aRank = getItem(`${character}ARank`) as ItemInt;

      setInt(aRank.offset, "uint8", stats.count === stats.total ? 1 : 0);
    });

    updateEmblems();
  } else if ("id" in item && item.id?.match(/bossProgression-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - 0xc4 * index + 0x4be + index;

    const value = getInt(itemInt.offset, "uint8");

    setInt(offset, "uint8", value);

    updateEmblems();
  } else if ("id" in item && item.id?.match(/updateEmblems-/)) {
    updateEmblems();
  } else if ("id" in item && item.id?.match(/chaoName-/)) {
    updateResources("chaoNames");
  } else if ("id" in item && item.id?.match(/chaoKarateCount-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x2;

    let count = 0;

    for (let i = 0x0; i < 0x3; i += 0x1) {
      count += getInt(offset + i * 0x2, "uint16", { bigEndian: true });
    }

    setInt(offset - 0x2, "uint16", count, { bigEndian: true });
  }
}

export function getChaoNames(): { [value: number]: string } {
  const names: { [value: number]: string } = {};

  const item = getItem("chaoName-0") as ItemString;

  [...Array(24).keys()].forEach((index) => {
    const type = getInt(item.offset + 0x800 * index + 0x6e, "uint8");

    const name = getString(
      item.offset + 0x800 * index,
      item.length,
      item.letterDataType,
      {
        resource: item.resource,
        zeroTerminated: item.zeroTerminated,
      },
    );

    names[index] = name || `Slot ${index + 1}`;

    if (type !== 0x0 && name === "") {
      names[index] = " ";
    }
  });

  return names;
}

export function generateChecksum(item: ItemChecksum): number | bigint {
  if (isChaoGarden()) {
    return generateChaoGardenChecksum(item);
  }

  const checksum = generateMainChecksum(item);

  return formatChecksum(checksum, item.dataType);
}

function isChaoGarden() {
  const $gameRegion = get(gameRegion);

  return $gameRegion >= 3;
}

function updateEmblems(): void {
  let emblemCount = 0;

  // Missions Emblems
  stories.forEach((story) =>
    story.stages.forEach((stage) => {
      for (let i = 0x0; i < 0x5; i += 0x1) {
        const value = getInt(0x28b8 + stage.index * 0xc4 + i, "uint8");

        if (value > 0) {
          emblemCount += 1;
        }
      }
    }),
  );

  // All A Rank Emblems
  ["sonic", "tails", "knuckles", "shadow", "eggman", "rouge", "last"].forEach(
    (character) => {
      const aRank = getItem(`${character}ARank`) as ItemInt;

      emblemCount += getInt(aRank.offset, "uint8");
    },
  );

  // Ending Emblems
  [...Array(3).keys()].forEach((index) => {
    const storyProgression = getItem(`storyProgression-${index}`) as ItemInt;

    emblemCount += getInt(storyProgression.offset + 0x3489, "uint8");
  });

  // Chao World & Kart Race Emblems
  for (let i = 0; i < 12; i += 1) {
    const item = getItem(`updateEmblems-${i}`) as ItemInt;

    emblemCount += getInt(item.offset, "uint8");
  }

  // Boss Emblems
  [...Array(3).keys()].forEach((index) => {
    const bossProgression = getItem(`bossProgression-${index}`) as ItemInt;

    emblemCount += getInt(bossProgression.offset, "uint8");
  });

  const emblems = getItem("emblems") as ItemInt;

  setInt(emblems.offset, "uint8", emblemCount);
}

function generateMainChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return checksum;
}

const dataArray = [
  0x00000000, 0xc9073096, 0x920e612c, 0xa50951ba, 0xff6dc419, 0xca6af48f,
  0x9163a535, 0xa66495a3, 0xfedb8832, 0xcfdcb8a4, 0x94d5e91e, 0xa3d2d988,
  0xf9b64c2b, 0xccb17cbd, 0x97b82d07, 0xa0bf1d91, 0xfdb71064, 0xc4b020f2,
  0x9fb97148, 0xa8be41de, 0xf2dad47d, 0xc7dde4eb, 0x9cd4b551, 0xabd385c7,
  0xf36c9856, 0xc26ba8c0, 0x9962f97a, 0xae65c9ec, 0xf4015c4f, 0xc1066cd9,
  0x9a0f3d63, 0xad080df5, 0xfb6e20c8, 0xd269105e, 0x896041e4, 0xbe677172,
  0xe403e4d1, 0xd104d447, 0x8a0d85fd, 0xbd0ab56b, 0xe5b5a8fa, 0xd4b2986c,
  0x8fbbc9d6, 0xb8bcf940, 0xe2d86ce3, 0xd7df5c75, 0x8cd60dcf, 0xbbd13d59,
  0xe6d930ac, 0xdfde003a, 0x84d75180, 0xb3d06116, 0xe9b4f4b5, 0xdcb3c423,
  0x87ba9599, 0xb0bda50f, 0xe802b89e, 0xd9058808, 0x820cd9b2, 0xb50be924,
  0xef6f7c87, 0xda684c11, 0x81611dab, 0xb6662d3d, 0xf6dc4190, 0xffdb7106,
  0xa4d220bc, 0x93d5102a, 0xc9b18589, 0xfcb6b51f, 0xa7bfe4a5, 0x90b8d433,
  0xc807c9a2, 0xf900f934, 0xa209a88e, 0x950e9818, 0xcf6a0dbb, 0xfa6d3d2d,
  0xa1646c97, 0x96635c01, 0xcb6b51f4, 0xf26c6162, 0xa96530d8, 0x9e62004e,
  0xc40695ed, 0xf101a57b, 0xaa08f4c1, 0x9d0fc457, 0xc5b0d9c6, 0xf4b7e950,
  0xafbeb8ea, 0x98b9887c, 0xc2dd1ddf, 0xf7da2d49, 0xacd37cf3, 0x9bd44c65,
  0xcdb26158, 0xe4b551ce, 0xbfbc0074, 0x88bb30e2, 0xd2dfa541, 0xe7d895d7,
  0xbcd1c46d, 0x8bd6f4fb, 0xd369e96a, 0xe26ed9fc, 0xb9678846, 0x8e60b8d0,
  0xd4042d73, 0xe1031de5, 0xba0a4c5f, 0x8d0d7cc9, 0xd005713c, 0xe90241aa,
  0xb20b1010, 0x850c2086, 0xdf68b525, 0xea6f85b3, 0xb166d409, 0x8661e49f,
  0xdedef90e, 0xefd9c998, 0xb4d09822, 0x83d7a8b4, 0xd9b33d17, 0xecb40d81,
  0xb7bd5c3b, 0x80ba6cad, 0xedb88320, 0xa4bfb3b6, 0xffb6e20c, 0xc8b1d29a,
  0x92d54739, 0xa7d277af, 0xfcdb2615, 0xcbdc1683, 0x93630b12, 0xa2643b84,
  0xf96d6a3e, 0xce6a5aa8, 0x940ecf0b, 0xa109ff9d, 0xfa00ae27, 0xcd079eb1,
  0x900f9344, 0xa908a3d2, 0xf201f268, 0xc506c2fe, 0x9f62575d, 0xaa6567cb,
  0xf16c3671, 0xc66b06e7, 0x9ed41b76, 0xafd32be0, 0xf4da7a5a, 0xc3dd4acc,
  0x99b9df6f, 0xacbeeff9, 0xf7b7be43, 0xc0b08ed5, 0x96d6a3e8, 0xbfd1937e,
  0xe4d8c2c4, 0xd3dff252, 0x89bb67f1, 0xbcbc5767, 0xe7b506dd, 0xd0b2364b,
  0x880d2bda, 0xb90a1b4c, 0xe2034af6, 0xd5047a60, 0x8f60efc3, 0xba67df55,
  0xe16e8eef, 0xd669be79, 0x8b61b38c, 0xb266831a, 0xe96fd2a0, 0xde68e236,
  0x840c7795, 0xb10b4703, 0xea0216b9, 0xdd05262f, 0x85ba3bbe, 0xb4bd0b28,
  0xefb45a92, 0xd8b36a04, 0x82d7ffa7, 0xb7d0cf31, 0xecd99e8b, 0xdbdeae1d,
  0x9b64c2b0, 0x9263f226, 0xc96aa39c, 0xfe6d930a, 0xa40906a9, 0x910e363f,
  0xca076785, 0xfd005713, 0xa5bf4a82, 0x94b87a14, 0xcfb12bae, 0xf8b61b38,
  0xa2d28e9b, 0x97d5be0d, 0xccdcefb7, 0xfbdbdf21, 0xa6d3d2d4, 0x9fd4e242,
  0xc4ddb3f8, 0xf3da836e, 0xa9be16cd, 0x9cb9265b, 0xc7b077e1, 0xf0b74777,
  0xa8085ae6, 0x990f6a70, 0xc2063bca, 0xf5010b5c, 0xaf659eff, 0x9a62ae69,
  0xc16bffd3, 0xf66ccf45, 0xa00ae278, 0x890dd2ee, 0xd2048354, 0xe503b3c2,
  0xbf672661, 0x8a6016f7, 0xd169474d, 0xe66e77db, 0xbed16a4a, 0x8fd65adc,
  0xd4df0b66, 0xe3d83bf0, 0xb9bcae53, 0x8cbb9ec5, 0xd7b2cf7f, 0xe0b5ffe9,
  0xbdbdf21c, 0x84bac28a, 0xdfb39330, 0xe8b4a3a6, 0xb2d03605, 0x87d70693,
  0xdcde5729, 0xebd967bf, 0xb3667a2e, 0x82614ab8, 0xd9681b02, 0xee6f2b94,
  0xb40bbe37, 0x810c8ea1, 0xda05df1b, 0xed02ef8d,
];

function generateChaoGardenChecksum(item: ItemChecksum): bigint {
  let checksum = 0x6368616f;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum =
      (checksum >>> 0x8) ^ dataArray[(checksum & 0xff) ^ getInt(i, "uint8")];
  }

  checksum ^= 0x686f6765;

  const byte1 = (checksum & 0xff).toHex(2);
  const byte2 = ((checksum >> 0x8) & 0xff).toHex(2);
  const byte3 = ((checksum >> 0x10) & 0xff).toHex(2);
  const byte4 = ((checksum >> 0x18) & 0xff).toHex(2);

  return BigInt(`0x${byte2}00${byte4}0000${byte1}00${byte3}`);
}
