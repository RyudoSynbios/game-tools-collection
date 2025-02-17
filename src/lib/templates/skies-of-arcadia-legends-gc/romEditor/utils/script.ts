import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { decodeWindows31J } from "$lib/utils/encoding";

export function isEnd(
  action: Action,
  dataView: DataView,
  increment = true,
): boolean {
  const int = getInt(action.offset, "uint32", { bigEndian: true }, dataView);

  if (increment) {
    action.offset += 0x4;
    action.length += 1;
  }

  return int === 0x1d;
}

export function parseVariable(action: Action, dataView: DataView): number {
  const instruction = getInt(
    action.offset,
    "uint32",
    { bigEndian: true },
    dataView,
  );

  let value = 0;

  switch (instruction & 0xff000000) {
    case 0x4000000: // Float
      value = getInt(
        action.offset + 0x4,
        "float32",
        { bigEndian: true },
        dataView,
      );
      action.offset += 0x4;
      action.length += 1;
      break;
    case 0x10000000: // TODO
      value = instruction & 0xffffff;
      break;
    case 0x20000000: // TODO
      value = instruction & 0xffffff;
      break;
    case 0x80000000: // TODO
      value = instruction & 0xffffff;
      break;
    case 0x50000000: // TODO
      value = instruction & 0xffffff;
      break;
  }

  action.offset += 0x4;
  action.length += 1;

  return value;
}

export interface Action {
  color: string;
  offset: number;
  text: string;
  length: number;
  expanded?: boolean;
}

export function parseIf(action: Action, dataView: DataView): void {
  action.text = "should if";

  const value1 = parseVariable(action, dataView);
  const value2 = parseVariable(action, dataView);

  const unknown = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  action.offset += 0x4;
  action.length += 1;

  const end = isEnd(action, dataView);

  const jumpOffset =
    action.offset +
    getInt(action.offset, "uint32", { bigEndian: true }, dataView);

  action.offset += 0x4;
  action.length += 1;

  if (unknown === 0x4 && end) {
    action.color = "lightblue";
    action.text = `if "${value1}", "${value2}", "${unknown}", jump to "${jumpOffset.toHex(8)}"`;
  }
}

export function parseInit(action: Action, dataView: DataView): void {
  action.text = "should init script";

  if (isEnd(action, dataView, false)) {
    action.color = "limegreen";
    action.length += 1;
    action.text = "init";
  } else {
    const unknown1 = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    if (unknown1 === 0x20000400) {
      action.offset += 0x4;
      action.length += 1;
    }

    const value = parseVariable(action, dataView);

    const unknown2 = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    if (unknown1 === 0x20000400 && unknown2 === 0x4) {
      action.offset += 0x4;
      action.length += 1;
    }

    if (isEnd(action, dataView)) {
      action.color = "limegreen";
      action.text = `init if "${value}"`;
    }
  }
}

export function parseJump(action: Action, dataView: DataView): void {
  const jumpOffset =
    action.offset +
    getInt(action.offset, "uint32", { bigEndian: true }, dataView);

  action.offset += 0x4;
  action.length += 1;

  action.color = "limegreen";
  action.text = `jump to "${jumpOffset.toHex(8)}"`;
}

export function parseUnknown0b(action: Action, dataView: DataView): void {
  const unknown = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  action.offset += 0x4;
  action.length += 1;

  action.color = "mediumorchid";
  action.text = `unknown instruction 0xb with value "${unknown}"`;
}

export function parseEnd(action: Action): void {
  action.color = "limegreen";
  action.text = "return";
}

export function parseLightColor(action: Action, dataView: DataView): void {
  action.text = "should set light color";

  const value1 = parseVariable(action, dataView);

  const end1 = isEnd(action, dataView);

  const value2 = parseVariable(action, dataView);

  const end2 = isEnd(action, dataView);

  const value3 = parseVariable(action, dataView);

  const end3 = isEnd(action, dataView);

  const value4 = parseVariable(action, dataView);

  const end4 = isEnd(action, dataView);

  if (end1 && end2 && end3 && end4) {
    action.color = "limegreen";
    action.text = `set light color: "${value1}", R = "${value2}", G = "${value3}", B = "${value4}"`;
  }
}

export function parseLightParameters(action: Action, dataView: DataView): void {
  action.text = "should set light parameters";

  const value1 = parseVariable(action, dataView);

  const end1 = isEnd(action, dataView);

  const value2 = parseVariable(action, dataView);

  const end2 = isEnd(action, dataView);

  const value3 = parseVariable(action, dataView);

  const end3 = isEnd(action, dataView);

  const value4 = parseVariable(action, dataView);

  const end4 = isEnd(action, dataView);

  const value5 = parseVariable(action, dataView);

  const end5 = isEnd(action, dataView);

  const value6 = parseVariable(action, dataView);

  const end6 = isEnd(action, dataView);

  const value7 = parseVariable(action, dataView);

  const end7 = isEnd(action, dataView);

  if (end1 && end2 && end3 && end4 && end5 && end6 && end7) {
    action.color = "limegreen";
    action.text = `set light parameters: "${value1}", P1 = "${value2}", P2 = "${value3}", P3 = "${value4}", P4 = "${value5}", P5 = "${value6}", P6 = "${value7}"`;
  }
}

export function parseWait(action: Action, dataView: DataView): void {
  action.text = "should wait frames";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "limegreen";
    action.text = `wait "${value}" frames`;
  }
}

export function parseSetFlag(action: Action, dataView: DataView): void {
  action.text = "should set flag";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "limegreen";
    action.text = `set flag at position "${value}"`;
  }
}

export function parseUnsetFlag(action: Action, dataView: DataView): void {
  action.text = "should unset flag";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "limegreen";
    action.text = `unset flag at position "${value}"`;
  }
}

export function parseUnknown1a(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x1a";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1a with value "${value}"`;
  }
}

export function parseUnknown1b(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x1b";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1b with value "${value}"`;
  }
}

export function parseUnknown1c(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x1c";

  const value1 = parseVariable(action, dataView);

  const end1 = isEnd(action, dataView);

  const value2 = parseVariable(action, dataView);

  const end2 = isEnd(action, dataView);

  const unknown = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  action.length += 1;
  action.offset += 0x4;

  const value3 = parseVariable(action, dataView);

  const end3 = isEnd(action, dataView);

  if (end1 && end2 && end3) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1c with value "${value1}", "${value2}", "${unknown.toHex(8)}", "${value3}"`;
  }
}

export function parseUnknown28(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x28";

  const value1 = parseVariable(action, dataView);

  const end1 = isEnd(action, dataView);

  const value2 = parseVariable(action, dataView);

  const end2 = isEnd(action, dataView);

  const value3 = parseVariable(action, dataView);

  const end3 = isEnd(action, dataView);

  if (end1 && end2 && end3) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x28 with value "${value1}", "${value2}", "${value3}"`;
  }
}

export function parseUnknown29(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x29";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x29 with value "${value}"`;
  }
}

export function parseUnknown41(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x41";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x41 with value "${value}"`;
  }
}

export function parseUnknown4c(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x4c";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x4c with value "${value}"`;
  }
}

export function parseUnknown5c(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x5c";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5c with value "${value}"`;
  }
}

export function parseUnknown5d(action: Action, dataView: DataView): void {
  action.text = "unknown instruction 0x5d";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5d with value "${value}"`;
  }
}

export function parseDialogBox(action: Action, dataView: DataView): void {
  action.text = "should open dialog box";

  const offset =
    action.offset +
    getInt(action.offset, "int32", { bigEndian: true }, dataView);

  action.length += 1;
  action.offset += 0x4;

  const unknown = getInt(action.offset, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  action.length += 1;
  action.offset += 0x4;

  if (unknown === 0x7fffffff) {
    action.color = "limegreen";
    action.text = `open dialog box and read ${offset.toHex(8)}`;
  }
}

export function parseItemBox(action: Action, dataView: DataView): void {
  action.text = "should open choice box";

  const value = parseVariable(action, dataView);

  if (isEnd(action, dataView)) {
    action.color = "limegreen";
    action.text = `open item box with item "${value}" (related to main.dol)`;
  }
}

export function parseChoiceBox(action: Action, dataView: DataView): void {
  action.text = "should open choice box";

  const value1 = parseVariable(action, dataView);

  const end1 = isEnd(action, dataView);

  const offset =
    action.offset +
    getInt(action.offset, "int32", { bigEndian: true }, dataView);

  action.length += 1;
  action.offset += 0x4;

  const value2 = getInt(action.offset, "uint32", { bigEndian: true }, dataView);

  action.length += 1;
  action.offset += 0x4;

  const end2 = isEnd(action, dataView);

  if (end1 && end2) {
    action.color = "limegreen";
    action.text = `open choice box with "${value1}" choices and read "${offset.toHex(8)}" (${value2.toHex(8)})`;
  }
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
      const int = getInt(offset, "uint16", { bigEndian: true }, dataView);

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
