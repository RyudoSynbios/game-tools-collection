import { get } from "svelte/store";

import { gameJson, gameUtils, isDebug } from "$lib/stores";
import {
  dataTypeToLength,
  dataTypeToValue,
  getBigInt,
  getInt,
  setBigInt,
  setInt,
} from "$lib/utils/bytes";
import { utilsExists } from "$lib/utils/format";

import type { DataType } from "$lib/types";

export function formatChecksum(
  checksum: number,
  dataType: Exclude<DataType, "bit" | "boolean" | "string">,
): number {
  const mask = dataTypeToValue(dataType);

  checksum &= mask;

  if (checksum < 0) {
    checksum += mask + 0x1;
  }

  return checksum;
}

export function updateChecksums(): void {
  const $gameJson = get(gameJson);
  const $gameUtils = get(gameUtils) as any;
  const $isDebug = get(isDebug);

  $gameJson.checksums?.forEach((item) => {
    const hexLength = dataTypeToLength(item.dataType) * 2;

    let previousChecksum;

    if (item.disabled) {
      console.log(`${item.name} > Skipped`);

      return;
    }

    if (item.dataType !== "int64" && item.dataType !== "uint64") {
      previousChecksum = getInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);

      setInt(item.offset, item.dataType, 0x0);
    } else {
      previousChecksum = getBigInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);

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
      setBigInt(item.offset, item.dataType, checksum, {
        bigEndian: item.bigEndian,
      });
    }

    if ($isDebug) {
      const newChecksum = checksum.toHex(hexLength);

      console.log(
        `${item.name}: ${previousChecksum} > ${newChecksum} > ${
          previousChecksum === newChecksum ? "Same" : "Different"
        }`,
      );
    }
  });
}
