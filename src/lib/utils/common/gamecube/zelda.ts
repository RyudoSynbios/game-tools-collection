import { get } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";
import { getIntFromArray } from "$lib/utils/bytes";

export function extractN64SaveFromGCI(
  dataView: DataView,
  formatSize: number,
): DataView {
  const $dataViewAlt = get(dataViewAlt);

  $dataViewAlt.gci = dataView;

  const gci = new Uint8Array(dataView.buffer);
  const save = new Uint8Array(formatSize);

  let offset = 0x6044;
  let size = 0x0;

  while (size < formatSize) {
    const max = Math.min(formatSize - size, 0x1ffc);

    const part = gci.slice(offset, offset + max);

    save.set(part, size);

    offset += 0x2000;
    size += part.byteLength;
  }

  return new DataView(save.buffer);
}

export function injectN64SaveToGCI(formatSize: number): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const gci = new Uint8Array($dataViewAlt.gci.buffer);
  const save = new Uint8Array($dataView.buffer);

  let offset = 0x6044;
  let size = 0x0;

  while (size < formatSize) {
    const max = Math.min(formatSize - size, 0x1ffc);

    const part = save.slice(size, size + max);

    gci.set(part, offset);

    let checksum = 0x0;

    for (let i = offset; i < offset + 0x1ffc; i += 0x4) {
      checksum += getIntFromArray(gci, i, "uint32", true);
    }

    checksum ||= 0x1;

    gci[offset - 0x1] = checksum & 0xff;
    gci[offset - 0x2] = (checksum >> 0x8) & 0xff;
    gci[offset - 0x3] = (checksum >> 0x10) & 0xff;
    gci[offset - 0x4] = (checksum >> 0x18) & 0xff;

    offset += 0x2000;
    size += part.byteLength;
  }

  return gci.buffer;
}
