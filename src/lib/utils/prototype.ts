import { decToHex } from "hex2dec";

import { extractBit } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";

import { getOrdinalSuffix } from "./format";

// DataView prototype adapted from https://gist.github.com/tjmehta/7e0f0d2aca966c71e70a453d0786f938

const littleEndian24 = [0, 1, 2];
const bigEndian24 = [2, 1, 0];

function boundsCheck(offset: number, size: number, max: number): boolean {
  if (offset < 0x0) {
    debug.error("Tried to write to a negative offset");

    return false;
  } else if (offset + size > max) {
    debug.error(
      `Tried to write ${size} bytes past the end of a buffer at offset 0x${offset.toHex()} of 0x${max.toHex()}`,
    );

    return false;
  }

  return true;
}

DataView.prototype.getBit = function (offset, bit) {
  return extractBit(this.getUint8(offset), bit) ? 1 : 0;
};

DataView.prototype.getLower4 = function (offset) {
  return this.getUint8(offset) & 0xf;
};

DataView.prototype.getUpper4 = function (offset) {
  return this.getUint8(offset) >> 0x4;
};

DataView.prototype.getUint24 = function (offset, littleEndian) {
  const buffer = new Uint8Array(this.buffer);
  const order = littleEndian ? littleEndian24 : bigEndian24;

  const b0 = buffer[offset + order[0]];
  const b1 = buffer[offset + order[1]] << 0x8;
  const b2 = buffer[offset + order[2]] << 0x10;

  return b0 | b1 | b2;
};

DataView.prototype.getInt24 = function (offset, littleEndian) {
  const int = this.getUint24(offset, littleEndian);

  return int & 0x800000 ? int ^ -0x1000000 : int;
};

DataView.prototype.setBit = function (offset, bit, value) {
  let int = this.getUint8(offset);

  if (value) {
    int = int | (0x1 << bit);
  } else {
    int = int & ~(0x1 << bit);
  }

  this.setInt8(offset, int);
};

DataView.prototype.setLower4 = function (offset, value) {
  const upper4 = this.getUpper4(offset);

  this.setInt8(offset, (upper4 << 0x4) | value);
};

DataView.prototype.setUpper4 = function (offset, value) {
  const lower4 = this.getLower4(offset);

  this.setInt8(offset, (value << 0x4) | lower4);
};

DataView.prototype.setUint24 = function (offset, value, littleEndian) {
  const buffer = new Uint8Array(this.buffer);
  const order = littleEndian ? littleEndian24 : bigEndian24;

  if (!boundsCheck(offset, 3, buffer.length)) {
    return;
  }

  this.setInt8(offset + order[0], value & 0xff);
  this.setInt8(offset + order[1], (value >>> 0x8) & 0xff);
  this.setInt8(offset + order[2], (value >>> 0x10) & 0xff);
};

DataView.prototype.setInt24 = function (offset, value, littleEndian) {
  this.setUint24(offset, value < 0 ? value | 0x1000000 : value, littleEndian);
};

BigInt.prototype.toHex = function (length = 0) {
  let hex = decToHex(this.toString(), { prefix: false }) as string;

  if (length) {
    if (hex.length > length) {
      hex = hex.substring(hex.length - length);
    } else {
      hex = hex.padStart(length, "0");
    }
  }

  return hex;
};

Number.prototype.toBinary = function (length = 8) {
  return this.toString(2).padStart(length, "0");
};

Number.prototype.toBitCount = function () {
  if (this === 0) {
    return 0;
  }

  return this.toBinary().match(/1/g)!.length;
};

Number.prototype.toEuler = function () {
  return this.valueOf() / (0x8000 / Math.PI);
};

Number.prototype.toHex = function (length = 0) {
  let hex = this.toString(16);

  if (length) {
    if (hex.length > length) {
      hex = hex.substring(hex.length - length);
    } else {
      hex = hex.padStart(length, "0");
    }
  }

  return hex;
};

String.prototype.format = function (value: number) {
  return this.replace("%d", `${value}`)
    .replace("%o", getOrdinalSuffix(value))
    .replace("%s", String.fromCharCode(0x40 + value));
};

String.prototype.reverse = function () {
  return this.split("").reverse().join("");
};

String.prototype.splitInt = function () {
  const split = this.split("-");

  return split.reduce((strings: number[], string) => {
    if (string.match(/^[0-9]+$/)) {
      strings.push(parseInt(string));
    }

    return strings;
  }, []);
};
