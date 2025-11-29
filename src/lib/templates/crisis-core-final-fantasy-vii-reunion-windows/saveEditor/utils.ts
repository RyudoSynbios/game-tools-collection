import { get } from "svelte/store";

import { dataViewAlt, gameTemplate } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getObjKey } from "$lib/utils/format";
import Gvas from "$lib/utils/gvas";
import { getItem, getResource, updateResources } from "$lib/utils/parser";
import { checkValidator } from "$lib/utils/validator";

import type {
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  Resource,
  Validator,
} from "$lib/types";

import { decryptData, encryptData } from "./utils/crypto";
import { c0, c1, c2, c3, c4, c5, c6, c7 } from "./utils/lookupTable";
import { materiaList } from "./utils/resource";

const PARSER_OFFSET = 0x528;

let gvas: Gvas;

export function beforeInitDataView(dataView: DataView): DataView {
  const $gameTemplate = get(gameTemplate);

  const regionValidator = $gameTemplate.validator.regions.world as Validator;
  const key = parseInt(getObjKey(regionValidator, 0));
  const validator = regionValidator[key];

  if (!checkValidator(validator, key, dataView)) {
    return dataView;
  }

  gvas = new Gvas(dataView, PARSER_OFFSET);

  const json = gvas.parseToJson();

  const cryptedData = new Uint8Array((json.buf as number[]).slice(0x8));

  const decryptedData = decryptData(cryptedData);

  dataViewAlt.set({ save: new DataView(decryptedData.buffer) });

  return dataView;
}

export function overrideGetRegions(): string[] {
  const $dataViewAlt = get(dataViewAlt);

  const validator = [0x46, 0x41, 0x49, 0x52];

  if (checkValidator(validator, 0x4, $dataViewAlt.save)) {
    return ["world"];
  }

  return [];
}

export function overrideParseItem(item: Item): Item {
  if ("id" in item && item.id === "slots") {
    const itemContainer = item as ItemContainer;

    const slots = getSlots();

    const instances = slots.reduce(
      (slots, slot) => (slots += slot.save !== -1 ? 1 : 0),
      0,
    );

    itemContainer.instances = instances;
  }

  return item;
}

export function overrideParseContainerItemsShifts(
  item: ItemContainer,
  shifts: number[],
  index: number,
): [boolean, number[] | undefined] {
  if (item.id === "slots") {
    const slots = getSlots();

    let offset = -1;
    let count = 0;

    slots.some((slot) => {
      if (slot.save !== -1) {
        if (count === index) {
          offset = slot.save;
          return true;
        }

        count += 1;
      }
    });

    return [true, [...shifts, offset]];
  }

  return [false, undefined];
}

export function overrideItem(item: Item): Item {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    const dataType = itemInt.dataType as "uint8" | "uint32";

    const calculate = getInt(itemInt.offset, dataType, {}, $dataViewAlt.save);
    const base = getInt(itemInt.offset + shift, dataType, {}, $dataViewAlt.save); // prettier-ignore

    itemInt.min = Math.max(0, calculate - base);

    return itemInt;
  } else if ("id" in item && item.id === "materiaBonusValue") {
    const itemInt = item as ItemInt;

    const type = getInt(itemInt.offset - 0x2, "uint16", {}, $dataViewAlt.save);

    itemInt.operations = undefined;
    itemInt.max = 99;
    itemInt.step = 1;
    itemInt.suffix = "";

    if (type < 0x2) {
      itemInt.operations = [{ "*": 10 }];
      itemInt.max = 990;
      itemInt.step = 10;
      itemInt.suffix = "%";
    }

    return itemInt;
  } else if ("id" in item && item.id === "quantity") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset - 0x2, "uint16", {}, $dataViewAlt.save); // prettier-ignore
    const quantity = getInt(itemInt.offset, "uint8", {}, $dataViewAlt.save);

    itemInt.disabled = itemIndex === 0x0 || quantity === 0x0;

    return itemInt;
  }

  return item;
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/(materia-|item)/)) {
    const itemInt = item as ItemInt;

    const quantity = getInt(itemInt.offset + 0x2, "uint8", {}, $dataViewAlt.save); // prettier-ignore

    if (quantity === 0) {
      return [true, 0x0];
    }
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/baseStats-/)) {
    const itemInt = item as ItemInt;

    let [shift] = item.id.splitInt();

    const int = parseInt(value);

    const dataType = itemInt.dataType as "uint8" | "uint32";

    const calculate = getInt(itemInt.offset, dataType, {}, $dataViewAlt.save);
    const base = getInt(itemInt.offset + shift, dataType, {}, $dataViewAlt.save); // prettier-ignore

    const diff = int - calculate;

    setInt(itemInt.offset, dataType, value, {}, "save");
    setInt(itemInt.offset + shift, dataType, base + diff, {}, "save");

    return true;
  } else if ("id" in item && item.id?.match(/materia-/)) {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    const materiaIndex = getInt(itemInt.offset, "uint16", {}, $dataViewAlt.save); // prettier-ignore

    // If new materia is added, we reset "Is Equipped"
    if (materiaIndex === 0x0 && int !== 0x0) {
      setInt(itemInt.offset + 0xa, "uint8", 0xff, {}, "save");
    }

    setInt(itemInt.offset, "uint16", value, {}, "save");
  }

  return false;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id?.match(/materia-/)) {
    const itemInt = item as ItemInt;

    const [slotIndex] = item.id.splitInt();

    const materiaIndex = getInt(itemInt.offset, "uint16", {}, $dataViewAlt.save); // prettier-ignore

    const materia = materiaList.find(
      (materia) => materia.index === materiaIndex,
    );

    let quantity = 1;
    let subtype = 0;
    let unknown1 = 0;
    let unknown2 = 0;

    if (materia) {
      subtype = materia.subtype;
      unknown1 = materia.unknown1;
      unknown2 = materia.unknown2;
    } else {
      quantity = 0;
    }

    setInt(itemInt.offset + 0x2, "uint8", quantity, {}, "save");
    setInt(itemInt.offset + 0x6, "uint8", subtype, {}, "save");
    setInt(itemInt.offset + 0x7, "uint8", unknown1, {}, "save");
    setInt(itemInt.offset + 0x8, "uint8", unknown2, {}, "save");

    updateInvetoryMateriaNames(slotIndex);
  } else if ("id" in item && item.id === "item") {
    const itemInt = item as ItemInt;

    const itemIndex = getInt(itemInt.offset, "uint16", {}, $dataViewAlt.save);
    const quantity = getInt(itemInt.offset + 0x2, "uint8", {}, $dataViewAlt.save); // prettier-ignore

    if (itemIndex === 0x0) {
      setInt(itemInt.offset + 0x2, "uint8", 0x0, {}, "save");
    } else if (quantity === 0x0) {
      setInt(itemInt.offset + 0x2, "uint8", 0x1, {}, "save");
    }
  }
}

export function beforeChecksum(): void {
  updateSavePreviews();

  const $dataViewAlt = get(dataViewAlt);

  const save = new Uint8Array($dataViewAlt.save.buffer);

  const encryptedData = encryptData(save);

  const newSave = new Uint8Array(encryptedData.length + 0x8);

  newSave.set(encryptedData, 0x8);

  newSave.set([0x6b, 0x43, 0x41, 0x7a], 0x0); // kCAz

  $dataViewAlt.tmp = new DataView(newSave.buffer);
}

export function generateChecksum(item: ItemChecksum): number {
  const $dataViewAlt = get(dataViewAlt);

  let checksum = ~0x52494146; // RIAF

  for (let i = 0x8; i < $dataViewAlt.tmp.byteLength; i += 0x8) {
    const int1 = getInt(i, "uint32", {}, $dataViewAlt.tmp) ^ checksum;
    const int2 = getInt(i + 0x4, "uint32", {}, $dataViewAlt.tmp);

    checksum =
      c0[(int2 >> 0x18) & 0xff] ^
      c1[(int2 >> 0x10) & 0xff] ^
      c2[(int2 >> 0x8) & 0xff] ^
      c3[int2 & 0xff] ^
      c4[(int1 >> 0x18) & 0xff] ^
      c5[(int1 >> 0x10) & 0xff] ^
      c6[(int1 >> 0x8) & 0xff] ^
      c7[int1 & 0xff];
  }

  checksum = ~checksum;

  checksum =
    ((checksum & 0xff) << 0x18) |
    ((checksum & 0xff00) << 0x8) |
    ((checksum & 0xff0000) >> 0x8) |
    ((checksum & 0xff000000) >>> 0x18);

  setInt(0x4, "uint32", checksum, {}, "tmp");

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataViewAlt = get(dataViewAlt);

  const buf = new Uint8Array($dataViewAlt.tmp.buffer);

  gvas.updateJson({ buf: [...buf] });

  return gvas.writeToBuffer();
}

export function getInventoryMateriaNames(
  slotIndex: number,
  isEquipment = false,
): Resource {
  const $dataViewAlt = get(dataViewAlt);

  if (typeof slotIndex === "string") {
    return {};
  }

  const names: Resource = {};

  const materiaItem = getItem(`materia-${slotIndex}-0`) as ItemInt;

  const materias = getResource("materias") as Resource;

  // prettier-ignore
  [...Array(999).keys()].forEach((index) => {
    const materia = getInt(materiaItem.offset + index * 0xf, "uint16", {}, $dataViewAlt.save);
    const quantity = getInt(materiaItem.offset + index * 0xf + 0x2, "uint8", {}, $dataViewAlt.save);
    const isEquipped = getInt(materiaItem.offset + index * 0xf + 0xa, "uint8", {}, $dataViewAlt.save);

    if (materia !== 0x0 && quantity === 0x1) {
      names[index + (isEquipment ? 0xe000 : 0x0)] = materias[materia];

      if (isEquipped === 0x0 && !isEquipment) {
        names[index + 0x0] += ` (Equipped)`;
      }
    }
  });

  if (isEquipment) {
    names[0x0] = "-";
  }

  return names;
}

interface Slot {
  savePreview: number;
  save: number;
}

function getSlots(): Slot[] {
  const $dataViewAlt = get(dataViewAlt);

  let offset = 0x1d;

  let slots: Slot[] = [];

  for (let i = 0x0; i < 0x1f; i += 0x1) {
    const isActive = getInt(offset, "uint32", {}, $dataViewAlt.save) !== 0x0;

    slots.push({ savePreview: offset, save: isActive ? 0x0 : -1 });

    if (i > 0 && isActive) {
      offset += 0x60008;
    }

    offset += 0x31;
  }

  slots = slots.map((slot, index) => {
    if (slot.save === 0x0) {
      slot.save = getInt(offset + index * 0x4, "uint32", {}, $dataViewAlt.save);
    }

    return slot;
  });

  return slots;
}

export function getSlotNames(): Resource {
  const slots = getSlots();

  let count = 0;

  const names = slots.reduce((names: Resource, slot, index) => {
    if (slot.save !== -1) {
      names[count] = `Slot ${index}`;
      count += 1;
    }

    return names;
  }, {});

  return names;
}

export function onSlotChange(slotIndex: number): void {
  updateInvetoryMateriaNames(slotIndex);
}

export function updateInvetoryMateriaNames(slotIndex: number): void {
  const values1 = getInventoryMateriaNames(slotIndex, true);
  const values2 = getInventoryMateriaNames(slotIndex);

  updateResources("equippableMateriaNames", values1);
  updateResources("inventoryMateriaNames", values2);
}

export function updateSavePreviews(): void {
  const $dataViewAlt = get(dataViewAlt);

  const slots = getSlots();

  // prettier-ignore
  slots.forEach((slot) => {
    if (slot.save !== -1) {
      const level = getInt(slot.save + 0x8a37, "uint8", {}, $dataViewAlt.save);
      const cleared = getInt(slot.save + 0xde1, "uint8", {}, $dataViewAlt.save);
      const difficulty = getInt(slot.save + 0x8ad4, "uint8", {}, $dataViewAlt.save);

      setInt(slot.savePreview, "uint8", level, {}, "save");
      setInt(slot.savePreview + 0x25, "uint8", cleared, {}, "save");
      setInt(slot.savePreview + 0x29, "uint8", difficulty, {}, "save");
    }
  });
}
