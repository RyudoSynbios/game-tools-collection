import { get } from "svelte/store";

import { gameJson, gameUtils } from "$lib/stores";
import {
  dataTypeToLength,
  dataTypeToValue,
  getBigInt,
  getInt,
  setBigInt,
  setInt,
} from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { utilsExists } from "$lib/utils/format";

import type { DataType } from "$lib/types";

export function formatChecksum(
  checksum: number,
  dataType: Exclude<DataType, "bit" | "boolean" | "string">,
): number {
  const mask = dataTypeToValue(dataType);

  checksum = (checksum & mask) >>> 0x0;

  return checksum;
}

export function updateChecksums(): void {
  const $gameJson = get(gameJson);
  const $gameUtils = get(gameUtils) as any;

  $gameJson.checksums
    ?.sort((a, b) => (a.order || 9999) - (b.order || 9999))
    .forEach((item) => {
      const dataTypeLength = dataTypeToLength(item.dataType) * 2;

      let previousChecksum;

      if (item.disabled) {
        debug.log(`${item.name} > Skipped`);

        return;
      }

      if (item.dataType !== "int64" && item.dataType !== "uint64") {
        previousChecksum = getInt(item.offset, item.dataType, {
          bigEndian: item.bigEndian,
        }).toHex(dataTypeLength);

        setInt(item.offset, item.dataType, 0x0);
      } else {
        previousChecksum = getBigInt(item.offset, item.dataType, {
          bigEndian: item.bigEndian,
        }).toHex(dataTypeLength);

        setBigInt(item.offset, item.dataType, 0x0n);
      }

      let checksum = 0x0;

      if (utilsExists("generateChecksum")) {
        checksum = $gameUtils.generateChecksum(item);
      }

      if (item.dataType !== "int64" && item.dataType !== "uint64") {
        setInt(item.offset, item.dataType, checksum, {
          bigEndian: item.bigEndian,
        });
      } else {
        setBigInt(item.offset, item.dataType, BigInt(checksum), {
          bigEndian: item.bigEndian,
        });
      }

      const newChecksum = checksum.toHex(dataTypeLength);

      debug.log(
        `${item.name}: ${previousChecksum} > ${newChecksum} > ${
          previousChecksum === newChecksum ? "Same" : "Different"
        }`,
      );
    });
}
