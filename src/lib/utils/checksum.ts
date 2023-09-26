import { get } from "svelte/store";

import { gameJson, gameUtils, isDebug } from "$lib/stores";
import {
  dataTypeToLength,
  getBigInt,
  getInt,
  setBigInt,
  setInt,
} from "$lib/utils/bytes";
import { utilsExists } from "$lib/utils/format";

export function updateChecksums(): void {
  const $gameJson = get(gameJson);
  const $gameUtils = get(gameUtils) as any;
  const $isDebug = get(isDebug);

  $gameJson.checksums?.forEach((item) => {
    const hexLength = dataTypeToLength(item.dataType) * 2;

    let previousChecksum;

    if (item.dataType !== "int64" && item.dataType !== "uint64") {
      previousChecksum = getInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);
    } else {
      previousChecksum = getBigInt(item.offset, item.dataType, {
        bigEndian: item.bigEndian,
      }).toHex(hexLength);
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
