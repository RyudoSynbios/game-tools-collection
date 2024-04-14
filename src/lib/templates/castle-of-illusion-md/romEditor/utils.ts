import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { ItemChecksum } from "$lib/types";

import Debug from "./components/Debug.svelte";

export function getComponent(component: string): any {
  if (component === "Debug") {
    return Debug;
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16", { bigEndian: true });
  }

  return formatChecksum(checksum, item.dataType);
}
