import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { decodeWindows31J } from "$lib/utils/encoding";

export function parseVariable(
  dataView: DataView,
  offset: number,
): [number, number] {
  const instruction = getInt(offset, "uint32", { bigEndian: true }, dataView);

  let value = 0;
  let length = 1;

  switch (instruction & 0xff000000) {
    case 0x4000000: // Float
      value = getInt(offset + 0x4, "float32", { bigEndian: true }, dataView);
      length = 2;
      break;
    case 0x10000000: // ???
      value = instruction & 0xffffff;
      break;
    case 0x20000000: // ???
      value = instruction & 0xffffff;
      break;
    case 0x50000000: // ???
      value = instruction & 0xffffff;
      break;
  }

  return [value, length];
}

export function isEnd(dataView: DataView, offset: number): boolean {
  const int = getInt(offset, "uint32", { bigEndian: true }, dataView);

  return int === 0x1d;
}

type Parse = [string, number, number, string];

export function parseIf(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should if";

  const [value1, varLength1] = parseVariable(dataView, offset);

  offset += varLength1 * 0x4;
  length += varLength1;

  const [value2, varLength2] = parseVariable(dataView, offset);

  offset += varLength2 * 0x4;
  length += varLength2;

  const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  offset += 0x4;
  length += 1;

  const end = isEnd(dataView, offset);

  offset += 0x4;
  length += 1;

  const jumpOffset = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  offset += 0x4;
  length += 1;

  if (unknown === 0x4 && end) {
    color = "lightblue";
    text = `if "${value1}", "${value2}", "${unknown}", jump to "${jumpOffset.toHex(8)}"`;
  }

  return [color, offset, length, text];
}

export function parseInit(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should init script";

  if (isEnd(dataView, offset)) {
    color = "limegreen";
    text = "init";
  } else {
    const unknown1 = getInt(offset, "uint32", { bigEndian: true }, dataView);

    if (unknown1 === 0x20000400) {
      offset += 0x4;
      length += 1;
    }

    const [value, varLength] = parseVariable(dataView, offset);

    offset += varLength * 0x4;
    length += varLength;

    const unknown2 = getInt(offset, "uint32", { bigEndian: true }, dataView);

    if (unknown1 === 0x20000400 && unknown2 === 0x4) {
      offset += 0x4;
      length += 1;
    }

    if (isEnd(dataView, offset)) {
      color = "limegreen";
      text = `init if "${value}"`;
    }
  }

  offset += 0x4;
  length += 1;

  return [color, offset, length, text];
}

export function parseJump(dataView: DataView, offset: number): Parse {
  let length = 1;

  const jumpOffset = offset + getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  offset += 0x4;
  length += 1;

  const color = "limegreen";
  const text = `jump to "${jumpOffset.toHex(8)}"`;

  return [color, offset, length, text];
}

export function parseUnknown0b(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0xb";

  const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView);

  offset += 0x4;
  length += 1;

  color = "mediumorchid";
  text = `unknown instruction 0xb with value "${unknown}"`;

  return [color, offset, length, text];
}

export function parseWait(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should wait frames";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "limegreen";
    text = `wait "${value}" frames`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseSetFlag(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should set flag";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "limegreen";
    text = `set flag at position "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnsetFlag(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should unset flag";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "limegreen";
    text = `unset flag at position "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown1a(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x1a";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "mediumorchid";
    text = `unknown instruction 0x1a with value "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown1b(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x1b";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "mediumorchid";
    text = `unknown instruction 0x1b with value "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown1c(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x1c";

  const [value1, varLength1] = parseVariable(dataView, offset);

  length += varLength1;
  offset += varLength1 * 0x4;

  const end1 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  const [value2, varLength2] = parseVariable(dataView, offset);

  length += varLength2;
  offset += varLength2 * 0x4;

  const end2 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  length += 1;
  offset += 0x4;

  const [value3, varLength3] = parseVariable(dataView, offset);

  length += varLength3;
  offset += varLength3 * 0x4;

  const end3 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  if (end1 && end2 && end3) {
    color = "mediumorchid";
    text = `unknown instruction 0x1c with value "${value1}",  "${value2}",  "${unknown.toHex(8)}",  "${value3}"`;
  }

  return [color, offset, length, text];
}

export function parseUnknown28(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x28";

  const [value1, varLength1] = parseVariable(dataView, offset);

  length += varLength1;
  offset += varLength1 * 0x4;

  const end1 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  const [value2, varLength2] = parseVariable(dataView, offset);

  length += varLength2;
  offset += varLength2 * 0x4;

  const end2 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  const [value3, varLength3] = parseVariable(dataView, offset);

  length += varLength3;
  offset += varLength3 * 0x4;

  const end3 = isEnd(dataView, offset);

  length += 1;
  offset += 0x4;

  if (end1 && end2 && end3) {
    color = "mediumorchid";
    text = `unknown instruction 0x28 with value "${value1}",  "${value2}", "${value3}"`;
  }

  return [color, offset, length, text];
}

export function parseUnknown41(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x41";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "mediumorchid";
    text = `unknown instruction 0x41 with value "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown5c(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x5c";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "mediumorchid";
    text = `unknown instruction 0x5c with value "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown5d(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "unknown instruction 0x5d";

  const [value, varLength] = parseVariable(dataView, offset);

  length += varLength;
  offset += varLength * 0x4;

  if (isEnd(dataView, offset)) {
    color = "mediumorchid";
    text = `unknown instruction 0x5d with value "${value}"`;
  }

  length += 1;
  offset += 0x4;

  return [color, offset, length, text];
}

export function parseUnknown90(dataView: DataView, offset: number): Parse {
  let color = "orange";
  let length = 1;
  let text = "should open dialog box";

  const rOffset = offset + getInt(offset, "int32", { bigEndian: true }, dataView); // prettier-ignore

  length += 1;
  offset += 0x4;

  const unknown = getInt(offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  length += 1;
  offset += 0x4;

  if (unknown === 0x7fffffff) {
    color = "limegreen";
    text = `open dialog box and read ${rOffset.toHex(8)}`;
  }

  return [color, offset, length, text];
}

export function parseText(
  dataView: DataView,
  offset: number,
): [number, string] {
  const $gameRegion = get(gameRegion);

  const savedOffset = offset;

  let text = "";

  while (true) {
    if ($gameRegion === 2) {
      const int = getInt(offset, "uint16", { bigEndian: true }, dataView); // prettier-ignore

      text += decodeWindows31J(int);

      offset += 0x2;

      if (int === 0x0) {
        break;
      }
    } else {
      let int = getInt(offset, "uint8", {}, dataView);

      if (int === 0x7f) {
        int = 0x20;
      } else if (int === 0x0) {
        break;
      }

      text += String.fromCharCode(int);

      offset += 0x1;
    }
  }

  const length = Math.ceil((offset - savedOffset) / 0x4);

  return [length, text];
}
