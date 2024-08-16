import { get } from "svelte/store";

import { dataView, dataViewAlt, gameJson } from "$lib/stores";
import { extractBinary, getInt, setInt } from "$lib/utils/bytes";
import { formatChecksum } from "$lib/utils/checksum";
import { mergeUint8Arrays } from "$lib/utils/format";
import { getItem, updateResources } from "$lib/utils/parser";

import type {
  Bit,
  Item,
  ItemChecksum,
  ItemContainer,
  ItemInt,
  ItemTab,
} from "$lib/types";

export function beforeItemsParsing(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  let offset = 0x2ff;

  offset = loadHeroStats(offset);

  $dataViewAlt.heroSkills = new DataView(
    $dataView.buffer.slice(offset, offset + 0x20),
  );

  $dataViewAlt.temporary = new DataView($dataView.buffer.slice(offset + 0x20));

  offset += 0x20;

  loadInventory(offset);
}

export function overrideItem(item: Item): Item | ItemTab {
  if ("id" in item && item.id?.match(/skill-/)) {
    const itemTab = item as ItemTab;

    const split = item.id.split("-");

    const skillClass = parseInt(split[1]);

    const heroClass = getItem("class") as ItemInt;

    const int = getInt(heroClass.offset, "uint8");

    if (skillClass !== int) {
      itemTab.hidden = true;
    }

    return itemTab;
  } else if ("id" in item && item.id === "inventory") {
    const itemContainer = item as ItemContainer;

    itemContainer.instances = getItemCount();
  }

  return item;
}

export function afterSetInt(item: Item): void {
  const $dataViewAlt = get(dataViewAlt);

  if ("id" in item && item.id === "level") {
    const itemInt = item as ItemInt;

    const value = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStats);

    setInt(0x2b, "uint8", value);

    let gold = getInt(itemInt.offset + 0x8, "uint32", {}, $dataViewAlt.heroStats); // prettier-ignore

    gold = Math.min(gold, value * 10000);

    setInt(itemInt.offset + 0x8, "uint32", gold, {}, "heroStats");
  } else if ("id" in item && item.id === "gold") {
    const itemInt = item as ItemInt;

    let gold = getInt(itemInt.offset, "uint32", {}, $dataViewAlt.heroStats);
    const level = getInt(itemInt.offset - 0x8, "uint32", {}, $dataViewAlt.heroStats); // prettier-ignore

    gold = Math.min(gold, level * 10000);

    setInt(itemInt.offset, "uint32", gold, {}, "heroStats");
  } else if ("id" in item && item.id === "itemType") {
    updateResources("inventoryNames");
  }
}

export function getInventoryNames(): { [value: number]: string } {
  const $dataViewAlt = get(dataViewAlt);
  const $gameJson = get(gameJson);

  const names: { [value: number]: string } = {};

  [...Array(getItemCount()).keys()].forEach((index) => {
    names[index] = $gameJson.resources!.itemTypes[
      getInt(
        0x5c + index * getItemLength(),
        "uint32",
        {},
        $dataViewAlt.inventory,
      )
    ] as string;
  });

  return names;
}

function getItemCount(): number {
  const $dataViewAlt = get(dataViewAlt);

  return $dataViewAlt.inventory.byteLength / getItemLength();
}

export function getItemLength(): number {
  return (baseItemAttributes.length + extendedItemAttributes.length) * 0x4;
}

function decode(
  offset: number,
  length: number,
  byteStart: number,
): [number, number, number] {
  let value = 0x0;
  let shift = 0x0;

  while (true) {
    let byteLength = 0x8 - byteStart;

    if (byteLength > length) {
      byteLength = length;
    }

    const int = getInt(offset, "uint8");

    value += extractBinary(int, byteStart as Bit, byteLength) << shift;

    length -= byteLength;
    byteStart += byteLength;
    shift += byteLength;

    if (byteStart === 0x8) {
      byteStart = 0x0;
      offset += 0x1;
    }

    if (length === 0x0) {
      return [value, offset, byteStart];
    }
  }
}

function goToNextIdentifier(offset: number, identifier: number): number {
  while (true) {
    if (getInt(offset, "uint16") === identifier) {
      return offset;
    }

    offset += 0x1;
  }
}

// prettier-ignore
const heroStatsAttributes = [
  0xa,  // #0 Strength
  0xa,  // #1 Energy
  0xa,  // #2 Dexterity
  0xa,  // #3 Vitality
  0xa,  // #4 Stats Points Remaining
  0x8,  // #5 Skill Choices Remaining
  0x15, // #6 Life
  0x15, // #7 Max Life
  0x15, // #8 Mana
  0x15, // #9 Max Mana
  0x15, // #A Stamina
  0x15, // #B Max Stamina
  0x7,  // #C Level
  0x20, // #D Experience
  0x19, // #E Gold
  0x19, // #F Gold in Stash
];

const heroStatusEnd = 0x1ff;

function loadHeroStats(offset: number): number {
  const $dataViewAlt = get(dataViewAlt);

  $dataViewAlt.heroStats = new DataView(new ArrayBuffer(0x40));

  let byteStart = 0;

  for (let i = 0; i < heroStatsAttributes.length; i += 1) {
    let attributeId = 0x0;

    let length = 0x9;

    for (let j = 0; j < 2; j += 1) {
      let value = 0x0;

      if (j === 1) {
        length = heroStatsAttributes[attributeId];
      }

      [value, offset, byteStart] = decode(offset, length, byteStart);

      if (j === 0) {
        if (value === heroStatusEnd) {
          dataViewAlt.set($dataViewAlt);

          if (byteStart !== 0) {
            offset += 0x1;
          }

          return offset;
        }

        attributeId = value;
      } else if (j === 1) {
        if (attributeId >= 0x6 && attributeId < 0xc) {
          value >>= 0x8;
        }

        setInt(attributeId * 0x4, "uint32", value, {}, "heroStats");
      }
    }
  }

  return 0x0;
}

// prettier-ignore
const baseItemAttributes = [
  0x4,  // #00 Unknown
  0x1,  // #01 Is identified
  0x6,  // #02 Unknown
  0x1,  // #03 Is socketed
  0x1,  // #04 Unknown
  0x1,  // #05 Picked up during last save
  0x2,  // #06 Unknown
  0x1,  // #07 Is player ear
  0x1,  // #08 Start item
  0x3,  // #09 Unknown
  0x1,  // #0A Simple item
  0x1,  // #0B Is ethereal
  0x1,  // #0C Unknown
  0x1,  // #0D Has been personalized
  0x1,  // #0E Unknown
  0x1,  // #0F Unknown
  0xf,  // #10 Unknown
  0x3,  // #11 Location
  0x4,  // #12 Equipped location
  0x4,  // #13 Matrix column
  0x3,  // #14 Matrix row
  0x1,  // #15 Unknown
  0x3,  // #16 Stored Location
  0x20, // #17 Type
  0x3,  // #18 Number of gems attached
];

// prettier-ignore
const extendedItemAttributes = [
  0x20, // #00 ID
  0x7,  // #01 Item level
  0x4,  // #02 Quality
];

// Source from https://user.xmission.com/~trevin/DiabloIIv1.09_Item_Format.shtml
function loadInventory(offset: number): number {
  const $dataViewAlt = get(dataViewAlt);

  let count = getInt(offset + 0x2, "uint16");

  offset += 0x4;

  const items: number[][] = [];

  for (let i = 0x0; i < count; i += 0x1) {
    offset += 0x2;

    let byteStart = 0;

    items[i] = [];

    let isSimple = false;

    for (let j = 0x0; j < baseItemAttributes.length; j += 0x1) {
      let value = 0x0;

      [value, offset, byteStart] = decode(
        offset,
        baseItemAttributes[j],
        byteStart,
      );

      if (j === 0x11 && value === 0x6) {
        // Socketed items are not included in the initial count
        count += 0x1;
      } else if (j === 0x17) {
        const binary = value.toBinary(32).match(/.{8}/g)!.reverse().join("");

        value = parseInt(binary, 2);
      }

      items[i].push(value);

      if (j === 0xa) {
        isSimple = Boolean(value);
      }
    }

    if (!isSimple) {
      for (let j = 0x0; j < extendedItemAttributes.length; j += 0x1) {
        let value = 0x0;

        [value, offset, byteStart] = decode(
          offset,
          extendedItemAttributes[j],
          byteStart,
        );

        if (j === 0x0) {
          value >>>= 0x0;
        }

        items[i].push(value);
      }
    }

    offset = goToNextIdentifier(offset, 0x4d4a); // "JM"
  }

  $dataViewAlt.inventory = new DataView(
    new ArrayBuffer(count * getItemLength()),
  );

  items.forEach((attributes, itemIndex) => {
    attributes.forEach((attribute, index) => {
      setInt(
        itemIndex * getItemLength() + index * 0x4,
        "uint32",
        attribute,
        {},
        "inventory",
      );
    });
  });

  return offset;
}

function updateHeroStats(): void {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);

  const encoded = [];

  let binaries = [];
  let binary = "";

  for (let i = 0x0; i < $dataViewAlt.heroStats.byteLength; i += 0x4) {
    const attributeId = i / 4;
    let attributeValue = getInt(i, "uint32", {}, $dataViewAlt.heroStats);

    if (attributeValue) {
      if (attributeId >= 0x6 && attributeId < 0xc) {
        attributeValue <<= 0x8;
      }

      const length = heroStatsAttributes[attributeId];

      binaries.push(`0${attributeId.toBinary()}`);

      let attributeValueBinary = attributeValue.toBinary();

      if (length < 8) {
        attributeValueBinary = attributeValueBinary.substring(8 - length);
      } else {
        attributeValueBinary = attributeValueBinary.padStart(length, "0");
      }

      binaries.push(attributeValueBinary);
    }
  }

  binaries.push(heroStatusEnd.toBinary());

  let offset = 0x2ff;

  // Encode
  binaries.forEach((value) => {
    while (value.length > 0) {
      if (value.length > 8 - binary.length) {
        const start = value.length - (8 - binary.length);

        binary = value.substring(start) + binary;
        value = value.substring(0, start);

        encoded.push(parseInt(binary, 2));

        offset += 0x1;

        binary = "";
      } else {
        binary = value + binary;
        break;
      }
    }
  });

  if (binary.length > 0) {
    encoded.push(parseInt(binary, 2));
  }

  const uint8Array = mergeUint8Arrays(
    new Uint8Array($dataView.buffer.slice(0x0, 0x2ff)),
    new Uint8Array(encoded),
  );

  dataView.set(new DataView(uint8Array.buffer));
}

export function generateChecksum(item: ItemChecksum): number {
  const $dataViewAlt = get(dataViewAlt);

  updateHeroStats();

  const uint8Array = mergeUint8Arrays(
    new Uint8Array(get(dataView).buffer),
    new Uint8Array($dataViewAlt.heroSkills.buffer),
    new Uint8Array($dataViewAlt.temporary.buffer),
  );

  dataView.set(new DataView(uint8Array.buffer));

  // Update file size
  setInt(0x8, "uint32", uint8Array.byteLength);

  let checksum = 0x0;

  for (
    let i = item.control.offsetStart;
    i < get(dataView).byteLength;
    i += 0x1
  ) {
    const carry = checksum < 0x0 ? 0x1 : 0x0;

    checksum = (checksum << 0x1) & 0xffffffff;
    checksum += carry + getInt(i, "uint8");
  }

  return formatChecksum(checksum, item.dataType);
}
