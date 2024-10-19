import { get } from "svelte/store";

import { dataView } from "$lib/stores";
import { cloneDataView, getInt, setBigInt, setInt } from "$lib/utils/bytes";
import { round } from "$lib/utils/format";

import { Item, ItemChecksum, ItemInt } from "$lib/types";

export function beforeInitDataView(dataView: DataView): DataView {
  return decodeSave(dataView);
}

export function initShifts(shifts: number[]): number[] {
  const $dataView = get(dataView);

  let shift = 0x0;

  for (let i = 0x2040; i < $dataView.byteLength; i += 0x2000) {
    if (getInt(i + 0x10, "uint16", { bigEndian: true }) === 0x1) {
      shift = i;
    }
  }

  return [...shifts, shift];
}

export function overrideGetInt(item: Item): [boolean, number | undefined] {
  if ("id" in item && item.id?.match(/cleared-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const mode = parseInt(split[1]);

    const int =
      getInt(itemInt.offset - 0x4 - mode, "bit", { bit: 3 - mode }) +
      getInt(itemInt.offset, "uint8");

    return [true, int];
  } else if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = 100 - getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = 100 + getInt(itemInt.offset, "int8");

    return [true, int];
  } else if ("id" in item && item.id === "hitPercentage") {
    const itemInt = item as ItemInt;

    const successfulHits = getInt(itemInt.offset, "uint32", {
      bigEndian: true,
    });
    const hits = getInt(itemInt.offset + 0x4, "uint32", { bigEndian: true });

    const int = round((successfulHits / hits) * 100, 2);

    return [true, int];
  } else if ("id" in item && item.id === "vsPlayMatchTotal") {
    const itemInt = item as ItemInt;

    let count = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      count += getInt(itemInt.offset + i * 0x4, "uint32", { bigEndian: true });
    }

    return [true, count];
  }

  return [false, undefined];
}

export function overrideSetInt(item: Item, value: string): boolean {
  if ("id" in item && item.id?.match(/cleared-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const mode = parseInt(split[1]);
    const characterIndex = parseInt(split[2]);

    const int = parseInt(value);

    setInt(itemInt.offset - 0x4 - mode, "bit", int > 0x0 ? 0x1 : 0x0, {
      bit: 3 - mode,
    });
    setInt(itemInt.offset, "uint8", int > 0 ? int - 0x1 : 0);

    const offset =
      itemInt.offset -
      characterIndex * 0xac -
      Math.floor(characterIndex / 8) -
      (0x729 - mode * 0x3);

    setInt(offset, "bit", int, { bit: characterIndex % 8 });

    return true;
  } else if ("id" in item && item.id === "sounds") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", 100 - int);

    return true;
  } else if ("id" in item && item.id === "music") {
    const itemInt = item as ItemInt;

    const int = parseInt(value);

    setInt(itemInt.offset, "uint8", int - 100);

    return true;
  }

  return false;
}

export function afterSetInt(item: Item): void {
  if ("id" in item && item.id?.match(/trophy-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x2;

    let count = 0;

    for (let i = 0; i < 0x12c; i += 1) {
      const int = getInt(offset + i * 0x2, "uint8");

      let value = 0;

      if (int > 0x0) {
        count += 1;
        value = 1;
      }

      const flagOffset =
        offset - 0x17a + Math.floor(i / 0x20) * 0x8 - Math.floor(i / 8);

      setInt(flagOffset, "bit", value, { bit: i % 8 });
    }

    setInt(offset - 0x5, "uint16", count, { bigEndian: true });
  } else if ("id" in item && item.id === "combinedVsPlayTime") {
    const itemInt = item as ItemInt;

    const int = getInt(itemInt.offset, "uint32", { bigEndian: true });

    setInt(itemInt.offset - 0x1c4, "uint32", int, { bigEndian: true });
  } else if ("id" in item && item.id?.match(/vsMatchTotal-/)) {
    const itemInt = item as ItemInt;

    const split = item.id.split("-");

    const index = parseInt(split[1]);

    const offset = itemInt.offset - index * 0x4;

    let count = 0x0;

    for (let i = 0x0; i < 0x5; i += 0x1) {
      const int = getInt(offset + i * 0x4, "uint32", {
        bigEndian: true,
      });

      if (i === 2) {
        setInt(offset - 0x17c, "uint32", int, { bigEndian: true });
      }

      count += int;
    }

    setInt(offset - 0x1a8, "uint32", count, { bigEndian: true });
    setInt(offset - 0x188, "uint32", count, { bigEndian: true });
    setInt(offset - 0x180, "uint32", count, { bigEndian: true });
  }
}

export function generateChecksum(item: ItemChecksum): bigint {
  if (item.id !== "checksum") {
    return BigInt(0x0);
  }

  const dataArray = [
    0x01, 0x23, 0x45, 0x67, 0x89, 0xab, 0xcd, 0xef, 0xfe, 0xdc, 0xba, 0x98,
    0x76, 0x54, 0x32, 0x10,
  ];

  let uVar6 = 0x0;
  let uVar8 = 0x0;
  let iVar10 = 0x0;

  item.control.offsetEnd = item.control.offsetEnd;

  // prettier-ignore
  for (let i = item.control.offsetStart; i < item.control.offsetEnd; i += 0x8) {
    console.log((i-item.control.offsetStart).toHex(),(i).toHex())
    iVar10 = uVar8 + ((uVar8 >> 0x4) + ((uVar8 < 0x0 && (uVar8 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x1;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i, "uint8")) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x2;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x1, "uint8")) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x3;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x2, "uint8")) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x4;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x3, "uint8")) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x5;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x4, 'uint8')) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x6;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x5, 'uint8')) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 0x4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    uVar6 = uVar8 + 0x7;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x6, 'uint8')) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    iVar10 = uVar6 + ((uVar6 >> 4) + ((uVar6 < 0x0 && (uVar6 & 0xf) !== 0x0) ? 0x1 : 0x0)) * -0x10;
    dataArray[iVar10] = (dataArray[iVar10] + getInt(i + 0x7, 'uint8')) & 0xff;
    console.log(`store ${dataArray[iVar10].toHex()} to dataArray[${iVar10.toHex()}]`);
    uVar8 += 0x8;
  }

  console.log(dataArray.map((a) => a.toHex()));

  let checksum1 = 0x0;
  checksum1 = dataArray[0] << 0x18;
  checksum1 |= dataArray[1] << 0x10;
  checksum1 |= dataArray[2] << 0x8;
  checksum1 |= dataArray[3];
  checksum1 >>>= 0x0;
  console.log(checksum1.toHex(8));

  let checksum2 = 0x0;
  checksum2 = dataArray[4] << 0x18;
  checksum2 |= dataArray[5] << 0x10;
  checksum2 |= dataArray[6] << 0x8;
  checksum2 |= dataArray[7];
  checksum2 >>>= 0x0;
  console.log(checksum2.toHex(8));

  let checksum3 = 0x0;
  checksum3 = dataArray[8] << 0x18;
  checksum3 |= dataArray[9] << 0x10;
  checksum3 |= dataArray[10] << 0x8;
  checksum3 |= dataArray[11];
  checksum3 >>>= 0x0;
  console.log(checksum3.toHex(8));

  let checksum4 = 0x0;
  checksum4 = dataArray[12] << 0x18;
  checksum4 |= dataArray[13] << 0x10;
  checksum4 |= dataArray[14] << 0x8;
  checksum4 |= dataArray[15];
  checksum4 >>>= 0x0;
  console.log(checksum4.toHex(8));

  const checksumA = BigInt(`0x${checksum1.toHex(8)}${checksum2.toHex(8)}`);
  const checksumB = BigInt(`0x${checksum3.toHex(8)}${checksum4.toHex(8)}`);

  console.log(
    `0x${checksum1}${checksum2}`,
    `0x${checksum3}${checksum4}`,
    checksumA.toHex(),
    checksumB.toHex(),
  );

  setBigInt(item.offset - 0x8, "uint64", checksumA, {
    bigEndian: true,
  });

  return BigInt(checksumB);
}

export function beforeSaving(): ArrayBufferLike {
  return encodeSave();
}

const dataArray = [
  0x26, 0xff, 0xe8, 0xef, 0x42, 0xd6, 0x01, 0x54, 0x14, 0xa3, 0x80, 0xfd, 0x6e,
];

function decodeSave(dataView: DataView): DataView {
  let previous = getInt(0x203f, "uint8", {}, dataView);

  for (let i = 0x2040; i < dataView.byteLength; i += 0x1) {
    const encoded = getInt(i, "uint8", {}, dataView);

    let decoded = 0x0;

    switch (previous % 7) {
      case 0:
        decoded = (encoded & 0x80) | ((encoded >> 0x1) & 0x20);
        decoded |= ((encoded >> 0x2) & 0x8) | ((encoded >> 0x3) & 0x2);
        decoded |= ((encoded & 0x8) << 0x3) | ((encoded & 0x4) << 0x2);
        decoded |= (encoded & 0x1) | ((encoded & 0x2) << 0x1);
        break;
      case 1:
        decoded = ((encoded >> 0x1) & 0x40) | ((encoded >> 0x3) & 0x8);
        decoded |= ((encoded >> 0x1) & 0x10) | ((encoded & 0x10) << 0x1);
        decoded |= ((encoded >> 0x3) & 0x1) | (encoded & 0x4);
        decoded |= ((encoded & 0x1) << 0x1) | ((encoded & 0x2) << 0x6);
        break;
      case 2:
        decoded = ((encoded >> 0x2) & 0x20) | ((encoded >> 0x6) & 0x1);
        decoded |= ((encoded >> 0x4) & 0x2) | ((encoded & 0x10) << 0x3);
        decoded |= ((encoded & 0x8) << 0x1) | ((encoded & 0x4) << 0x4);
        decoded |= (encoded & 0x3) << 0x2;
        break;
      case 3:
        decoded = ((encoded >> 0x5) & 0x4) | ((encoded & 0x40) << 0x1);
        decoded |= ((encoded & 0x20) << 0x1) | ((encoded >> 0x1) & 0x8);
        decoded |= ((encoded >> 0x2) & 0x2) | ((encoded & 0x4) << 0x3);
        decoded |= ((encoded & 0x1) << 0x4) | ((encoded >> 0x1) & 0x1);
        break;
      case 4:
        decoded = ((encoded >> 0x7) & 0x1) | ((encoded >> 0x2) & 0x10);
        decoded |= ((encoded >> 0x3) & 0x4) | ((encoded & 0x10) << 0x2);
        decoded |= ((encoded & 0x8) << 0x4) | ((encoded >> 0x1) & 0x2);
        decoded |= ((encoded & 0x1) << 0x3) | ((encoded & 0x2) << 0x4);
        break;
      case 5:
        decoded = ((encoded >> 0x3) & 0x10) | ((encoded >> 0x5) & 0x2);
        decoded |= ((encoded >> 0x5) & 0x1) | ((encoded >> 0x2) & 0x4);
        decoded |= (encoded & 0x8) | ((encoded & 0x7) << 0x5);
        break;
      case 6:
        decoded = ((encoded >> 0x4) & 0x8) | ((encoded >> 0x4) & 0x4);
        decoded |= ((encoded & 0x20) << 0x2) | (encoded & 0x10);
        decoded |= ((encoded & 0x8) << 0x2) | ((encoded >> 0x2) & 0x1);
        decoded |= ((encoded & 0x1) << 0x6) | (encoded & 0x2);
    }

    const int = decoded ^ previous ^ dataArray[previous % 0xd];

    dataView.setUint8(i, int);

    previous = encoded;
  }

  return dataView;
}

function encodeSave(): ArrayBufferLike {
  const $dataView = get(dataView);

  const encodedDataView = cloneDataView($dataView);

  let previous = getInt(0x203f, "uint8");

  for (let i = 0x2040; i < $dataView.byteLength; i += 0x1) {
    const decoded = getInt(i, "uint8");

    let encoded = 0x0;

    encoded = decoded ^ previous ^ dataArray[previous % 0xd];

    let int = encoded;

    switch (previous % 7) {
      case 0:
        int = (encoded & 0x80) | ((encoded >> 0x3) & 0x8);
        int |= ((encoded & 0x20) << 0x1) | ((encoded >> 0x2) & 0x4);
        int |= ((encoded & 0x8) << 0x2) | ((encoded >> 0x1) & 0x2);
        int |= (encoded & 0x1) | ((encoded & 0x2) << 0x3);
        break;
      case 1:
        int = ((encoded >> 0x6) & 0x2) | ((encoded & 0x40) << 0x1);
        int |= ((encoded >> 0x1) & 0x10) | ((encoded & 0x10) << 0x1);
        int |= ((encoded & 0x8) << 0x3) | (encoded & 0x4);
        int |= ((encoded & 0x1) << 0x3) | ((encoded >> 0x1) & 0x1);
        break;
      case 2:
        int = ((encoded >> 0x3) & 0x10) | ((encoded >> 0x4) & 0x4);
        int |= ((encoded & 0x20) << 0x2) | ((encoded >> 0x1) & 0x8);
        int |= ((encoded >> 0x2) & 0x2) | ((encoded >> 0x2) & 0x1);
        int |= ((encoded & 0x1) << 0x6) | ((encoded & 0x2) << 0x4);
        break;
      case 3:
        int = ((encoded >> 0x1) & 0x40) | ((encoded >> 0x1) & 0x20);
        int |= ((encoded >> 0x3) & 0x4) | ((encoded >> 0x4) & 0x1);
        int |= ((encoded & 0x8) << 0x1) | ((encoded & 0x4) << 0x5);
        int |= ((encoded & 0x1) << 0x1) | ((encoded & 0x2) << 0x2);
        break;
      case 4:
        int = ((encoded >> 0x4) & 0x8) | ((encoded >> 0x2) & 0x10);
        int |= ((encoded >> 0x4) & 0x2) | ((encoded & 0x10) << 0x2);
        int |= ((encoded >> 0x3) & 0x1) | ((encoded & 0x4) << 0x3);
        int |= ((encoded & 0x1) << 0x7) | ((encoded & 0x2) << 0x1);
        break;
      case 5:
        int = ((encoded >> 0x5) & 0x4) | ((encoded >> 0x5) & 0x2);
        int |= ((encoded >> 0x5) & 0x1) | ((encoded & 0x10) << 0x3);
        int |= (encoded & 0x8) | ((encoded & 0x4) << 0x2);
        int |= (encoded & 0x3) << 0x5;
        break;
      case 6:
        int = ((encoded >> 0x2) & 0x20) | ((encoded >> 0x6) & 0x1);
        int |= ((encoded >> 0x2) & 0x8) | (encoded & 0x10);
        int |= ((encoded & 0x8) << 0x4) | ((encoded & 0x4) << 0x4);
        int |= ((encoded & 0x1) << 0x2) | (encoded & 0x2);
        break;
    }

    encodedDataView.setUint8(i, int);

    previous = int;
  }

  return encodedDataView.buffer;
}
