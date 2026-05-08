import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";

import type { ItemChecksum } from "$lib/types";

const HEADER_SIZE = 0x02;
const SLOT_SIZE = 440;
const SLOT_COUNT = 3;
const TOTAL_SIZE = 0x2000;

const NAME_SIZE = 8;
const INVENTORY_SIZE = 40;
const MAP_SIZE = 384;

const OFFSETS = {
  NAMES: 0x02,
  INVENTORY: 0x1a,
  MAP: 0x92,
  SLOTSTATE: 0x512,
  UNKNOWN1: 0x515,
  PLAYCOUNT: 0x518,
  QUEST: 0x51b,
  UNKNOWN2: 0x51e,
  CHECKSUM: 0x524,
};

function copySlotFromInterlaced(src: DataView, dst: DataView, slot: number) {
  let offset = HEADER_SIZE + slot * SLOT_SIZE;

  for (let i = 0; i < NAME_SIZE; i++) {
    dst.setUint8(offset++, src.getUint8(OFFSETS.NAMES + slot * NAME_SIZE + i));
  }

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    dst.setUint8(
      offset++,
      src.getUint8(OFFSETS.INVENTORY + slot * INVENTORY_SIZE + i),
    );
  }

  for (let i = 0; i < MAP_SIZE; i++) {
    dst.setUint8(offset++, src.getUint8(OFFSETS.MAP + slot * MAP_SIZE + i));
  }

  dst.setUint8(offset++, src.getUint8(OFFSETS.SLOTSTATE + slot));
  dst.setUint8(offset++, src.getUint8(OFFSETS.UNKNOWN1 + slot));
  dst.setUint8(offset++, src.getUint8(OFFSETS.PLAYCOUNT + slot));
  dst.setUint8(offset++, src.getUint8(OFFSETS.QUEST + slot));

  for (let i = 0; i < 2; i++) {
    dst.setUint8(offset++, src.getUint8(OFFSETS.UNKNOWN2 + slot * 2 + i));
  }

  for (let i = 0; i < 2; i++) {
    dst.setUint8(offset++, src.getUint8(OFFSETS.CHECKSUM + slot * 2 + i));
  }
}

function copySlotToInterlaced(src: DataView, dst: DataView, slot: number) {
  let offset = HEADER_SIZE + slot * SLOT_SIZE;

  for (let i = 0; i < NAME_SIZE; i++) {
    dst.setUint8(OFFSETS.NAMES + slot * NAME_SIZE + i, src.getUint8(offset++));
  }

  for (let i = 0; i < INVENTORY_SIZE; i++) {
    dst.setUint8(
      OFFSETS.INVENTORY + slot * INVENTORY_SIZE + i,
      src.getUint8(offset++),
    );
  }

  for (let i = 0; i < MAP_SIZE; i++) {
    dst.setUint8(OFFSETS.MAP + slot * MAP_SIZE + i, src.getUint8(offset++));
  }

  dst.setUint8(OFFSETS.SLOTSTATE + slot, src.getUint8(offset++));
  dst.setUint8(OFFSETS.UNKNOWN1 + slot, src.getUint8(offset++));
  dst.setUint8(OFFSETS.PLAYCOUNT + slot, src.getUint8(offset++));
  dst.setUint8(OFFSETS.QUEST + slot, src.getUint8(offset++));

  for (let i = 0; i < 2; i++) {
    dst.setUint8(OFFSETS.UNKNOWN2 + slot * 2 + i, src.getUint8(offset++));
  }

  for (let i = 0; i < 2; i++) {
    dst.setUint8(OFFSETS.CHECKSUM + slot * 2 + i, src.getUint8(offset++));
  }
}

export function beforeInitDataView(input: DataView): DataView {
  const buffer = new ArrayBuffer(TOTAL_SIZE);
  const out = new DataView(buffer);

  for (let i = 0; i < TOTAL_SIZE; i++) {
    out.setUint8(i, input.getUint8(i));
  }

  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    copySlotFromInterlaced(input, out, slot);
  }

  return out;
}

export function beforeSaving(): ArrayBufferLike {
  const input = get(dataView);

  const buffer = new ArrayBuffer(TOTAL_SIZE);
  const out = new DataView(buffer);

  for (let i = 0; i < TOTAL_SIZE; i++) {
    out.setUint8(i, input.getUint8(i));
  }

  for (let slot = 0; slot < SLOT_COUNT; slot++) {
    copySlotToInterlaced(input, out, slot);
  }

  return out.buffer;
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x1) {
    checksum += getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
