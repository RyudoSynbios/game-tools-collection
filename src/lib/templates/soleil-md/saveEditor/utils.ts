import { get } from "svelte/store";

import { dataView, gameRegion } from "$lib/stores";
import { getInt, setBitflag, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { getItem } from "$lib/utils/parser";

import type {
  Item,
  ItemBitflag,
  ItemBitflags,
  ItemChecksum,
  ItemInt,
  ItemString,
} from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  const array = [];

  for (let i = 0x0; i < dataView.byteLength; i += 0x1) {
    if (i % 0x2 !== 0) {
      array.push(getInt(i, "uint8", {}, dataView));
    }
  }

  const uint8Array = new Uint8Array(array);

  return new DataView(uint8Array.buffer);
}

export function overrideParseItem(item: Item): Item {
  const $gameRegion = get(gameRegion);

  if (
    "id" in item &&
    item.id === "name" &&
    ($gameRegion === 1 || $gameRegion === 5)
  ) {
    const itemString = item as ItemString;

    itemString.letterDataType = "uint16";
    itemString.letterBigEndian = true;

    return itemString;
  }

  return item;
}

export function overrideItem(item: Item): Item {
  if ("id" in item && item.id === "health") {
    const itemInt = item as ItemInt;

    const maxHealth = getInt(itemInt.offset + 0x2, "uint16", {
      bigEndian: true,
    });

    itemInt.max = maxHealth;
  }

  return item;
}

export function afterSetInt(item: Item, flag: ItemBitflag): void {
  if ("id" in item && item.id === "location") {
    const itemInt = item as ItemInt;

    const location = getInt(itemInt.offset, "uint16", { bigEndian: true });

    let locationSavePreview = 0x0;

    switch (location) {
      case 0x1:
      case 0x6:
      case 0x7:
      case 0x8:
      case 0x9:
      case 0xa:
      case 0xd:
      case 0x26:
      case 0x2b:
      case 0x2c:
      case 0x32:
      case 0x3a:
      case 0x3b:
      case 0x77:
      case 0x84:
      case 0x85:
      case 0x86:
      case 0x87:
      case 0x88:
      case 0x89:
      case 0x8b:
        locationSavePreview = 0x1;
        break;
      case 0x4:
      case 0x13:
      case 0x15:
      case 0x16:
      case 0x17:
      case 0x21:
      case 0x33:
        locationSavePreview = 0x4;
        break;
      case 0x10:
      case 0x23:
      case 0x28:
      case 0x29:
      case 0x2a:
      case 0x2f:
      case 0x34:
      case 0x50:
      case 0x51:
      case 0x67:
      case 0x68:
      case 0x69:
      case 0x6a:
      case 0x82:
        locationSavePreview = 0x28;
        break;
      case 0x12:
      case 0x58:
      case 0x8a:
      case 0x8c:
        locationSavePreview = 0x12;
        break;
      case 0x14:
      case 0x2e:
      case 0x73:
      case 0x80:
      case 0x81:
        locationSavePreview = 0x14;
        break;
      case 0x18:
      case 0x19:
      case 0x1b:
      case 0x1d:
      case 0x1e:
      case 0x1f:
      case 0x20:
      case 0x3e:
      case 0x3f:
      case 0x48:
      case 0x49:
      case 0x4a:
      case 0x4b:
      case 0x4c:
      case 0x4d:
      case 0x52:
      case 0x53:
      case 0x54:
      case 0x55:
      case 0x56:
      case 0x57:
      case 0x59:
      case 0x5a:
      case 0x5b:
      case 0x5c:
      case 0x5d:
      case 0x5e:
      case 0x5f:
      case 0x62:
      case 0x63:
      case 0x64:
      case 0x65:
      case 0x66:
      case 0x83:
        locationSavePreview = 0x18;
        break;
      case 0x1a:
      case 0x1c:
      case 0x30:
      case 0x35:
      case 0x36:
      case 0x37:
      case 0x38:
      case 0x39:
      case 0x6d:
      case 0x6e:
      case 0x6f:
      case 0x70:
      case 0x71:
      case 0x72:
      case 0x78:
        locationSavePreview = 0x1a;
        break;
      case 0x22:
        locationSavePreview = 0x22;
        break;
      case 0x24:
      case 0x46:
      case 0x47:
        locationSavePreview = 0x47;
        break;
      case 0x27:
      case 0x2d:
      case 0x3c:
      case 0x3d:
      case 0x40:
        locationSavePreview = 0x3c;
        break;
      case 0x41:
      case 0x42:
      case 0x6c:
      case 0x74:
      case 0x75:
      case 0x76:
        locationSavePreview = 0x6c;
        break;
      case 0x43:
      case 0x44:
      case 0x45:
      case 0x6b:
        locationSavePreview = 0x45;
        break;
      case 0x79:
      case 0x7a:
      case 0x7b:
      case 0x7c:
      case 0x7d:
      case 0x7e:
      case 0x7f:
        locationSavePreview = 0x79;
        break;
    }

    setInt(itemInt.offset + 0x4, "uint16", locationSavePreview, {
      bigEndian: true,
    });
  } else if ("id" in item && item.id === "maxHealth") {
    const itemInt = item as ItemInt;

    let health = getInt(itemInt.offset - 0x2, "uint16", { bigEndian: true });
    const maxHealth = getInt(itemInt.offset, "uint16", { bigEndian: true });

    health = Math.min(health, maxHealth);

    setInt(itemInt.offset - 0x2, "uint16", health, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/equippedAnimal-/)) {
    const itemInt = item as ItemInt;

    const [, animalSlot, slotIndex] = item.id.split("-");

    const animals = getItem(`animals-${slotIndex}`) as ItemBitflags;

    for (let i = 0; i < 2; i += 1) {
      if (i === 0) {
        animals.flags.forEach((flag) => {
          const isChecked = Boolean(
            getInt(flag.offset, "bit", { bit: flag.bit }),
          );

          setBitflag(flag.offset + 0x4, flag.bit, isChecked);
        });
      }

      let offset = itemInt.offset;

      if (i === 1) {
        if (animalSlot === "a") {
          offset += 0x2;
        } else if (animalSlot === "b") {
          offset -= 0x2;
        }
      }

      const equippedAnimal = getInt(offset, "uint16", {
        bigEndian: true,
      });

      if (equippedAnimal) {
        const animalFlag = animals.flags[equippedAnimal];

        setBitflag(animalFlag.offset, animalFlag.bit, true);
        setBitflag(animalFlag.offset + 0x4, animalFlag.bit, false);
      }
    }
  } else if ("id" in item && item.id?.match(/animals-/)) {
    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    setBitflag(flag.offset + 0x4, flag.bit, isChecked);
  } else if ("id" in item && item.id === "items") {
    const isChecked = Boolean(getInt(flag.offset, "bit", { bit: flag.bit }));

    switch (flag.bit) {
      case 0:
        setBitflag(flag.offset - 0x72, 6, isChecked);
        break;
      case 1:
        setBitflag(flag.offset - 0x63, 3, isChecked);
        break;
      case 2:
        setBitflag(flag.offset - 0x63, 4, isChecked);
        break;
      case 3:
        setBitflag(flag.offset - 0x63, 7, isChecked);
        break;
      case 4:
        setBitflag(flag.offset - 0x67, 0, isChecked);
        break;
      case 5:
        setBitflag(flag.offset - 0x5f, 7, isChecked);
        break;
      case 6:
        setBitflag(flag.offset - 0x5d, 1, isChecked);
        break;
      case 7:
        setBitflag(flag.offset - 0x53, 5, isChecked);
        break;
    }
  }
}

export function generateChecksum(item: ItemChecksum): number {
  let checksum = 0x0;

  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x2) {
    checksum += getInt(i, "uint16", { bigEndian: true });
  }

  return formatChecksum(checksum, item.dataType);
}

export function beforeSaving(): ArrayBufferLike {
  const $dataView = get(dataView);

  const array = [];

  let j = 0x0;

  for (let i = 0x0; i < $dataView.byteLength; i += 0x1) {
    if (j % 0x2 === 0) {
      array.push(0xff);

      j += 0x1;
    }

    array.push(getInt(i, "uint8"));

    j += 0x1;
  }

  const uint8Array = new Uint8Array(array);

  return uint8Array.buffer;
}
