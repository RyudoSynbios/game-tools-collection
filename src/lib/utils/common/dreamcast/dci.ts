import { getInt } from "$lib/utils/bytes";

import { FileType } from ".";

export function isDciFile(dataView?: DataView): boolean {
  const type = getInt(0x0, "uint8", {}, dataView);

  if (
    dataView?.byteLength !== 0x20000 &&
    Object.values(FileType).includes(type)
  ) {
    return true;
  }

  return false;
}
