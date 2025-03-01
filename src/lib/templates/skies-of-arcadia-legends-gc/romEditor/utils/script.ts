import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { decodeWindows31J } from "$lib/utils/encoding";
import { getResource } from "$lib/utils/parser";

import { Resource } from "$lib/types";

type FileType =
  | "mld (0x17)"
  | "mld (0x6e)"
  | "mld (0x71)"
  | "script (0x2b)"
  | "script (0xd2)"
  | "sound";

interface Action {
  color: string;
  offset: number;
  text: string;
  length: number;
  expanded?: boolean;
}

export interface Subroutine {
  offset: number;
  name: string;
  expanded?: boolean;
  actions: Action[];
}

interface Variable {
  type: string;
  subtype: string;
  value: number;
}

export default class Script {
  private dataView: DataView;
  private count: number;
  private baseOffset: number;
  private endOffset: number;
  private subroutines: Subroutine[];
  private files: {
    offset: number;
    type: FileType;
    name: string;
  }[];

  constructor(dataView: DataView) {
    this.dataView = dataView;

    this.count = getInt(0x8, "uint32", { bigEndian: true }, this.dataView);

    this.baseOffset = 0xc + this.count * 0x14;
    this.endOffset = this.dataView.byteLength;

    this.subroutines = [];
    this.files = [];

    for (let i = 0x0; i < this.count; i += 1) {
      const offset =
        this.baseOffset +
        getInt(0xc + i * 0x14, "uint32", { bigEndian: true }, this.dataView);

      const name = getString(0x10 + i * 0x14, 0x10, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

      this.subroutines.push({
        offset,
        name,
        actions: [],
      });
    }

    for (let i = 0x0; i < this.count; i += 1) {
      this.loadSubroutine(i);
    }

    debug.log(this.files);
  }

  private loadSubroutine(index: number): void {
    const subroutine = this.subroutines[index];

    let { offset } = subroutine;

    while (offset < this.endOffset) {
      const instruction = getInt(offset, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore

      if ((instruction & 0xff000000) === 0x5c000000) {
        const [length, text] = this.parseText(offset);

        subroutine.actions.push({ color: "limegreen", offset, length, text });

        break;
      }

      const action = {
        color: "orange",
        offset: offset + 0x4,
        length: 1,
        text: instruction.toHex(8),
      };

      switch (instruction) {
        case 0x0:
          this.parseIf(action);
          break;
        case 0x3:
          this.parseSwitch(action);
          break;
        case 0x5:
          this.parseUpdateEventValue(action);
          break;
        case 0x6:
          this.parseUpdateSpecialValue(action);
          break;
        case 0x9:
          this.parseInit(action);
          break;
        case 0xa:
          this.parseJump(action);
          break;
        case 0xb:
          this.parseCallSubroutine(action);
          break;
        case 0xc:
          this.parseReturn(action);
          break;
        case 0xd:
          this.parseUnknown0d(action);
          break;
        case 0x10:
          this.parseWait(action);
          break;
        case 0x11:
          this.parseSetFlag(action);
          break;
        case 0x12:
          this.parseUnsetFlag(action);
          break;
        case 0x14:
          this.parseGetItem(action);
          break;
        case 0x17:
          this.parseLoadFile(action, "mld (0x17)");
          break;
        case 0x18:
          this.parseDebugText(action);
          break;
        case 0x1a:
          this.parseUnknown1a(action);
          break;
        case 0x1b:
          this.parseUnknown1b(action);
          break;
        case 0x1c:
          this.parseUnknown1c(action);
          break;
        case 0x1e:
          this.parseUnknown1e(action);
          break;
        // case 0x22:
        //   this.parseUnknown22(action);
        //   break;
        case 0x28:
          this.parseUnknown28(action);
          break;
        case 0x29:
          this.parseUnknown29(action);
          break;
        case 0x2b:
          this.parseLoadFile(action, "script (0x2b)");
          break;
        case 0x2d:
          this.parseUnknown2d(action);
          break;
        case 0x33:
          this.parseUnknown33(action);
          break;
        case 0x37:
          this.parseUnknown37(action);
          break;
        case 0x38:
          this.parseUnknown38(action);
          break;
        case 0x3b:
          this.parseFadeOut(action);
          break;
        case 0x3c:
          this.parseFadeIn(action);
          break;
        case 0x3e:
          this.parseUnknown3e(action);
          break;
        case 0x3f:
          this.parseUnknown3f(action);
          break;
        case 0x41:
          this.parseUnknown41(action);
          break;
        case 0x45:
          this.parseLoadFile(action, "sound");
          break;
        case 0x47:
          this.parseSetCameraPosition(action);
          break;
        case 0x4a:
          this.parseMoveCamera(action);
          break;
        case 0x4c:
          this.parseUnknown4c(action);
          break;
        case 0x4d:
          this.parseSetCharacterPosition(action);
          break;
        case 0x4f:
          this.parseFog(action);
          break;
        case 0x52:
          this.parseLightColor(action);
          break;
        case 0x53:
          this.parseLightParameters(action);
          break;
        case 0x54:
          this.parseUnknown54(action);
          break;
        case 0x57:
          this.parseUnknown57(action);
          break;
        case 0x5b:
          this.parseUnknown5b(action);
          break;
        case 0x5c:
          this.parseUnknown5c(action);
          break;
        case 0x5d:
          this.parseUnknown5d(action);
          break;
        case 0x5e:
          this.parseUnknown5e(action);
          break;
        case 0x62:
          this.parseUnknown62(action);
          break;
        case 0x63:
          this.parseUnknown63(action);
          break;
        case 0x67:
          this.parseUnknown67(action);
          break;
        case 0x6d:
          this.parseUnknown6d(action);
          break;
        case 0x6e:
          this.parseLoadFile(action, "mld (0x6e)");
          break;
        case 0x70:
          this.parseInitEventBattle(action);
          break;
        case 0x71:
          this.parseLoadFile(action, "mld (0x71)");
          break;
        case 0x72:
          this.parseUnknown72(action);
          break;
        case 0x73:
          this.parseUnknown73(action);
          break;
        case 0x75:
          this.parseUnknown75(action);
          break;
        case 0x76:
          this.parseUnknown76(action);
          break;
        case 0x77:
          this.parseUnknown77(action);
          break;
        case 0x7c:
          this.parseUnknown7c(action);
          break;
        case 0x8a:
          this.parseInitSave(action);
          break;
        case 0x90:
          this.parseDialogBox(action);
          break;
        case 0x92:
          this.parseUnknown92(action);
          break;
        case 0x95:
          this.parseUnknown95(action);
          break;
        case 0x9a:
          this.parseOpenTreasure(action);
          break;
        case 0x9b:
          this.parseChoiceBox(action);
          break;
        case 0x9c:
          this.parseUnknown9c(action);
          break;
        case 0xa7:
          this.parseUnknownA7(action);
          break;
        case 0xab:
          this.parseUnknownAb(action);
          break;
        case 0xae:
          this.parseUnknownAe(action);
          break;
        case 0xb4:
          this.parseUnknownB4(action);
          break;
        case 0xb5:
          this.parseInitShop(action);
          break;
        case 0xb7:
          this.parseUnknownB7(action);
          break;
        case 0xb8:
          this.parseUnknownB8(action);
          break;
        case 0xb9:
          this.parseUnknownB9(action);
          break;
        case 0xba:
          this.parseUnknownBa(action);
          break;
        case 0xc3:
          this.parseUnknownC3(action);
          break;
        case 0xc4:
          this.parseUnknownC4(action);
          break;
        case 0xc9:
          this.parseRestorePartyHp(action);
          break;
        case 0xca:
          this.parseRestorePartyMp(action);
          break;
        case 0xd0:
          this.parseUnknownD0(action);
          break;
        case 0xd1:
          this.parseUnknownD1(action);
          break;
        case 0xd2:
          this.parseLoadFile(action, "script (0xd2)");
          break;
        case 0xd5:
          this.parseUnknownD5(action);
          break;
        case 0xe2:
          this.parseUnknownE2(action);
          break;
        case 0xe9:
          this.parseUnknownE9(action);
          break;
        case 0xeb:
          this.parseUnknownEb(action);
          break;
        case 0xf3:
          this.parseUnknownF3(action);
          break;
        case 0xf7:
          this.parseUnknownF7(action);
          break;
        case 0xf9:
          this.parseUnknownF9(action);
          break;
        case 0x104:
          this.parseRestoreShipHp(action);
          break;
        default:
          action.color = "red";
      }

      subroutine.actions.push({ ...action, offset });

      offset += action.length * 0x4;

      if (
        offset === this.subroutines[index + 1]?.offset ||
        offset === this.endOffset
      ) {
        return;
      }
    }
  }

  private getValue(action: Action): number {
    const value = getInt(action.offset, "int32", { bigEndian: true }, this.dataView); // prettier-ignore

    action.offset += 0x4;
    action.length += 1;

    return value;
  }

  private isReturn(action: Action, increment = true): boolean {
    const int = getInt(action.offset, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore

    if (increment) {
      action.offset += 0x4;
      action.length += 1;
    }

    return int === 0x1d;
  }

  private parseFlagOffset(value: number): string {
    const baseOffset = (value >> 0x3) & 0x1ffffffc;
    const shift = Math.floor((0x1f - (value & 0x1f)) / 0x8);
    const bit = (value & 0x1f) - (0x3 - shift) * 0x8;

    const offset = baseOffset + shift;

    let result = `${offset.toHex(8)}[${bit}]`;

    // TODO: To confirm with USA and Japan
    if (offset === 0x84 && bit === 7) {
      result += " (lock character movements)";
    } else if (offset === 0x8b && bit === 6) {
      result += " (hide mini-map)";
    }

    return result;
  }

  private parseVariables(action: Action): Variable | Variable[] {
    const variables = [];

    while (!this.isReturn(action, false)) {
      const instruction = getInt(action.offset, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore

      let type = "???";
      let subtype = "???";
      let value = 0;

      // Operators
      if (instruction <= 0x16) {
        type = "operator";

        switch (instruction) {
          case 0x0:
            subtype = "<";
            break;
          case 0x1:
            subtype = "<=";
            break;
          case 0x2:
            subtype = ">";
            break;
          case 0x3:
            subtype = ">=";
            break;
          case 0x4:
            subtype = "===";
            break;
          case 0x5: // TODO
            subtype = "?";
            debug.warn(
              `Operator ${instruction} unknown (${JSON.stringify(action)}).`,
            );
            break;
          case 0x6:
          case 0x10:
            subtype = "&";
            break;
          case 0x7:
          case 0x11:
            subtype = "|";
            break;
          case 0x8:
            subtype = "&&";
            break;
          case 0x9:
            subtype = "||";
            break;
          case 0xa:
            subtype = "=";
            break;
          case 0xb:
          case 0x12:
            subtype = "*";
            break;
          case 0xc:
          case 0x13:
            subtype = "/";
            break;
          case 0xd:
          case 0x14:
            subtype = "%";
            break;
          case 0xe:
          case 0x15:
            subtype = "+";
            break;
          case 0xf:
          case 0x16:
            subtype = "-";
            break;
        }
      } else if ([0x7f7fffff, 0x7fffffff].includes(instruction)) {
        type = "unknown";
        value = instruction;
        variables.push({ type, subtype, value });
        break;
      } else {
        // Variable Types
        switch (instruction & 0xff000000) {
          case 0x4000000: // Float
            type = "float";
            value = getInt(action.offset + 0x4, "float32", { bigEndian: true }, this.dataView); // prettier-ignore
            action.offset += 0x4;
            action.length += 1;
            break;
          case 0x8000000: // TODO
            value = instruction & 0xffffff;
            break;
          case 0x10000000:
            type = "eventValue";
            value = instruction & 0xffffff;
            break;
          case 0x20000000:
            type = "flag";
            value = instruction & 0xffffff;
            break;
          case 0x40000000: // TODO
            value = instruction & 0xffffff;
            break;
          case 0x50000000:
            type = "special";
            switch (instruction & 0xff) {
              case 0x0:
                subtype = "Gold";
                break;
              case 0x1:
                subtype = "Swashbuckler Rating";
                break;
              case 0x2:
                subtype = "Vyse's HP";
                break;
              case 0x3:
                subtype = "Aika's HP";
                break;
              case 0x4:
                subtype = "Fina's HP";
                break;
              case 0x5:
                subtype = "Drachma's HP";
                break;
              case 0x6:
                subtype = "Enrique's HP";
                break;
              case 0x7:
                subtype = "Gilder's HP";
                break;
              case 0x18:
                subtype = "Camera Position X?";
                break;
              case 0x19:
                subtype = "Camera Position Y?";
                break;
              case 0x1a:
                subtype = "Camera Position Z?";
                break;
              case 0x4a:
                subtype = "Vyse's Level";
                break;
            }
            value = instruction & 0xffffff;
            break;
        }
      }

      action.offset += 0x4;
      action.length += 1;

      variables.push({ type, subtype, value });
    }

    action.offset += 0x4;
    action.length += 1;

    if (variables.length === 1) {
      return variables[0];
    }

    return variables;
  }

  private parseIf(action: Action): void {
    action.text = "should if";

    const variables = this.parseVariables(action);
    const jumpOffset = action.offset + this.getValue(action);

    let text = "";
    let error = false;

    if (Array.isArray(variables) && variables.length >= 3) {
      for (let i = 0; i < variables.length; i += 3) {
        if (i >= 3) {
          if (i + 3 > variables.length) {
            error = true;
            break;
          }

          const operator = variables[i + 3];

          if (operator.type !== "operator") {
            error = true;
            break;
          }

          text = `${text} ${operator.subtype} `;

          if (i + 3 === variables.length) {
            error = true;
            break;
          }
        }

        const variable = variables[i];
        const value = variables[i + 1].value;
        const operator = variables[i + 2];

        if (operator.type !== "operator") {
          error = true;
          break;
        }

        const variableValue =
          variable.type === "flag"
            ? this.parseFlagOffset(variable.value)
            : variable.value;

        text += `(${variable.type} ${variableValue} ${operator.subtype} ${value})`;

        if (i >= 3) {
          i += 1;
        }
      }
    } else {
      error = true;
    }

    if (!error) {
      action.color = "limegreen";
      action.text = `if ${text} then continue else jump to "${jumpOffset.toHex(8)}"`;
    } else {
      debug.warn(
        `Error while parsing if (${JSON.stringify(action)}) (${JSON.stringify(variables)}).`,
      );
    }
  }

  private parseSwitch(action: Action): void {
    action.text = "should switch";

    const variable = this.parseVariables(action);

    if (!Array.isArray(variable)) {
      const variableValue =
        variable.type === "flag"
          ? this.parseFlagOffset(variable.value)
          : variable.value;

      const count = this.getValue(action);

      if (count > 10) {
        debug.warn(`Error while parsing switch (${JSON.stringify(action)}).`);
        return;
      }

      let text = "";

      for (let i = 0; i < count; i += 1) {
        const caseValue = this.getValue(action);
        const jumpOffset = action.offset + this.getValue(action);

        text += `, "case ${caseValue === -1 ? "default" : caseValue}: jump to ${jumpOffset.toHex(8)}"`;
      }

      action.color = "limegreen";
      action.text = `switch variable "${variableValue}": ${text.replace(",", "")}`;
    } else {
      debug.warn(`Error while parsing switch (${JSON.stringify(action)}).`);
    }
  }

  private parseUpdateEventValue(action: Action): void {
    action.text = "should update event value";

    const variables = this.parseVariables(action);

    if (
      Array.isArray(variables) &&
      variables.length === 3 &&
      variables[0].type === "eventValue" &&
      variables[2].type === "operator"
    ) {
      const offset = variables[0].value;
      const value = variables[1].value;
      const operator = variables[2].subtype;

      action.color = "limegreen";
      action.text = `update event value "${offset} ${operator} ${value}"`;
    } else {
      debug.warn(
        `Error while parsing update event (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUpdateSpecialValue(action: Action): void {
    action.text = "should update special value";

    const variables = this.parseVariables(action);

    if (
      Array.isArray(variables) &&
      variables.length === 3 &&
      variables[0].type === "special" &&
      variables[2].type === "operator"
    ) {
      const special = variables[0];
      const value = variables[1].value;
      const operator = variables[2].subtype;

      action.color = "limegreen";
      action.text = `update special value: "${special.subtype} ${operator} ${value}"`;
    } else {
      debug.warn(
        `Error while parsing update special (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseInit(action: Action): void {
    while (!this.isReturn(action));

    action.color = "limegreen";
    action.text = "init";
  }

  private parseJump(action: Action): void {
    const jumpOffset = action.offset + this.getValue(action);

    action.color = "limegreen";
    action.text = `jump to "${jumpOffset.toHex(8)}"`;
  }

  private parseCallSubroutine(action: Action): void {
    action.text = "should call subroutine";

    const offset = action.offset + this.getValue(action);

    const subroutine = this.subroutines.find(
      (subroutine) => subroutine.offset === offset,
    );

    if (subroutine) {
      action.color = "limegreen";
      action.text = `call subroutine "${subroutine.name}" ("${offset.toHex(8)}")`;
    }
  }

  private parseReturn(action: Action): void {
    action.color = "limegreen";
    action.text = "return";
  }

  private parseUnknown0d(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd";
  }

  private parseWait(action: Action): void {
    action.text = "should wait frames";

    const frames = this.parseVariables(action);

    if (!Array.isArray(frames)) {
      action.color = "limegreen";
      action.text = `wait "${frames.value}" frames`;
    } else {
      debug.warn(
        `Error while parsing wait frames (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseSetFlag(action: Action): void {
    action.text = "should set flag";

    const flag = this.parseVariables(action);

    if (!Array.isArray(flag)) {
      const flagOffset = this.parseFlagOffset(flag.value);

      action.color = "limegreen";
      action.text = `set flag at position "${flagOffset}"`;
    } else {
      debug.warn(`Error while parsing set flag (${JSON.stringify(action)}).`);
    }
  }

  private parseUnsetFlag(action: Action): void {
    action.text = "should unset flag";

    const flag = this.parseVariables(action);

    if (!Array.isArray(flag)) {
      const flagOffset = this.parseFlagOffset(flag.value);

      action.color = "limegreen";
      action.text = `unset flag at position "${flagOffset}"`;
    } else {
      debug.warn(`Error while parsing unset flag (${JSON.stringify(action)}).`);
    }
  }

  private parseGetItem(action: Action): void {
    action.text = "should get item";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      const inventory = getResource("inventories") as Resource;

      if (inventory[unknown.value]) {
        action.color = "limegreen";
        action.text = `get item "${inventory[unknown.value]}"`;
        return;
      }
    }

    debug.warn(`Error while parsing get item (${JSON.stringify(action)}).`);
  }

  private parseDebugText(action: Action): void {
    const offset = action.offset + this.getValue(action);

    const text = this.parseText(offset);

    action.color = "limegreen";
    action.text = `get debug text "${text[1]}"`;
  }

  private parseUnknown1a(action: Action): void {
    action.text = "unknown instruction 0x1a";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x1a with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x1a (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown1b(action: Action): void {
    action.text = "unknown instruction 0x1b";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x1b with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x1b (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown1c(action: Action): void {
    action.text = "unknown instruction 0x1c";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x1c with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value.toHex(8)}", "${unknown4.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x1c (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown1e(action: Action): void {
    action.text = "unknown instruction 0x1e";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x1e with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x1e (${JSON.stringify(action)}).`,
      );
    }
  }

  // private parseUnknown22(action: Action): void {
  //   action.text = "unknown instruction 0x22";

  //   const unknown1 = this.parseVariables(action);
  //   const unknown2 = this.parseVariables(action);
  //   const unknown3 = this.parseVariables(action);
  //   const unknown4 = this.parseVariables(action);
  //   const unknown5 = this.parseVariables(action);
  //   const unknown6 = this.parseVariables(action);
  //   const unknown7 = this.parseVariables(action);
  //   const unknown8 = this.parseVariables(action);
  //   const unknown9 = this.parseVariables(action);
  //   const unknown10 = this.parseVariables(action);

  //   if (end1 && end2 && end3 && end4 && end5 && end6 && end7 && end8) {
  //     action.color = "mediumorchid";
  //     action.text = `unknown instruction 0x22 with values P1 = "${unknown1}", P21 = "${unknown21}", P22 = "${unknown22}", P31 = "${unknown31.toHex(8)}", P32 = "${unknown32}", P4 = "${unknown4}", P5 = "${unknown5}", P61 = "${unknown61.toHex(8)}", P62 = "${unknown62}", P7 = "${unknown7}", P8 = "${unknown8}"`;
  //   }
  // }

  private parseUnknown28(action: Action): void {
    action.text = "unknown instruction 0x28";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x28 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x28 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown29(action: Action): void {
    action.text = "unknown instruction 0x29";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x29 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x29 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown2d(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x2d";
  }

  private parseUnknown33(action: Action): void {
    action.text = "unknown instruction 0x33";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x33 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}", "${unknown4.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x33 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown37(action: Action): void {
    action.text = "unknown instruction 0x37";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x37 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x37 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown38(action: Action): void {
    action.text = "unknown instruction 0x38";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x38 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x38 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseFadeOut(action: Action): void {
    action.text = "should fade out";

    const frames = this.parseVariables(action);

    if (!Array.isArray(frames)) {
      action.color = "limegreen";
      action.text = `fade out for "${frames.value} frames"`;
    } else {
      debug.warn(`Error while parsing fade out (${JSON.stringify(action)}).`);
    }
  }

  private parseFadeIn(action: Action): void {
    action.text = "should fade in";

    const frames = this.parseVariables(action);

    if (!Array.isArray(frames)) {
      action.color = "limegreen";
      action.text = `fade in for "${frames.value} frames"`;
    } else {
      debug.warn(`Error while parsing fade (${JSON.stringify(action)}).`);
    }
  }

  private parseUnknown3e(action: Action): void {
    action.text = "unknown instruction 0x3e";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x3e with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x3e (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown3f(action: Action): void {
    action.text = "unknown instruction 0x3f";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x3f with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x3f (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown41(action: Action): void {
    action.text = "unknown instruction 0x41";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x41 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x41 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseSetCameraPosition(action: Action): void {
    action.text = "should set camera position";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4)
    ) {
      action.color = "mediumorchid";
      action.text = `set camera position: X = "${unknown1.value}", Y = "${unknown2.value}", Z = "${unknown3.value}", Unknown = "${unknown4.value}"`;
    } else {
      debug.warn(
        `Error while parsing camera position (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseMoveCamera(action: Action): void {
    action.text = "should move camera";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    if (
      Array.isArray(unknown1) &&
      unknown1.length === 3 &&
      Array.isArray(unknown2) &&
      unknown2.length === 3 &&
      Array.isArray(unknown3) &&
      unknown3.length === 3 &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7)
    ) {
      const special1 = unknown1[0];
      const value1 = unknown1[1].value;
      const operator1 = unknown1[2].subtype;

      const special2 = unknown2[0];
      const value2 = unknown2[1].value;
      const operator2 = unknown2[2].subtype;

      const special3 = unknown3[0];
      const value3 = unknown3[1].value;
      const operator3 = unknown3[2].subtype;

      action.color = "mediumorchid";
      action.text = "move camera: ";
      action.text += `Unknown1 = "${operator1} ${value1} ${special1.subtype}", `;
      action.text += `Unknown2 = "${operator2} ${value2} ${special2.subtype}", `;
      action.text += `Unknown3 = "${operator3} ${value3} ${special3.subtype}", `;
      action.text += `Unknown4 = "${unknown4.value.toHex(8)}", `;
      action.text += `Unknown5 = "${unknown5.value.toHex(8)}", `;
      action.text += `Unknown6 = "${unknown6.value.toHex(8)}", `;
      action.text += `Unknown7 = "${unknown7.value}"`;
    } else {
      debug.warn(
        `Error while parsing move camera (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown4c(action: Action): void {
    action.text = "unknown instruction 0x4c";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x4c with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x4c (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseSetCharacterPosition(action: Action): void {
    action.text = "should set character position";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5)
    ) {
      action.color = "mediumorchid";
      action.text = `set character position: Unknown = "${unknown1.value}", X = "${unknown2.value}", Y = "${unknown3.value}", Z = "${unknown4.value}", Rotation = "${unknown5.value}°"`;
    } else {
      debug.warn(
        `Error while parsing character position (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseFog(action: Action): void {
    action.text = "should set fog";

    const red = this.parseVariables(action);
    const blue = this.parseVariables(action);
    const green = this.parseVariables(action);

    const transitionDuration = this.parseVariables(action);

    const distanceMin = this.parseVariables(action);
    const distanceMax = this.parseVariables(action);

    const unknown = this.parseVariables(action);

    if (
      !Array.isArray(red) &&
      !Array.isArray(blue) &&
      !Array.isArray(green) &&
      !Array.isArray(transitionDuration) &&
      !Array.isArray(distanceMin) &&
      !Array.isArray(distanceMax) &&
      !Array.isArray(unknown)
    ) {
      action.color = "mediumorchid";
      action.text = `set fog: R = "${red.value}", G = "${blue.value}", B = "${green.value}", TD = "${transitionDuration.value}", DMin = "${distanceMin.value}", Dmax = "${distanceMax.value}", Unknown = "${unknown.value}"`;
    } else {
      debug.warn(`Error while parsing fog (${JSON.stringify(action)}).`);
    }
  }

  private parseLightColor(action: Action): void {
    action.text = "should set light color";

    const unknown = this.parseVariables(action);
    const red = this.parseVariables(action);
    const green = this.parseVariables(action);
    const blue = this.parseVariables(action);

    if (
      !Array.isArray(unknown) &&
      !Array.isArray(red) &&
      !Array.isArray(green) &&
      !Array.isArray(blue)
    ) {
      action.color = "mediumorchid";
      action.text = `set light color: Unknown = "${unknown.value}", Red = "${red.value}", Green = "${green.value}", Blue = "${blue.value}"`;
    } else {
      debug.warn(
        `Error while parsing set light color (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseLightParameters(action: Action): void {
    action.text = "should set light parameters";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7)
    ) {
      action.color = "mediumorchid";
      action.text = `set light parameters: Unknown1 = "${unknown1.value}", Unknown2 = "${unknown2.value}", Unknown3 = "${unknown3.value}", Unknown4 = "${unknown4.value}", Unknown5 = "${unknown5.value}", Unknown6 = "${unknown6.value}", Unknown7 = "${unknown7.value}"`;
    } else {
      debug.warn(
        `Error while parsing set light parameters (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown54(action: Action): void {
    action.text = "unknown instruction 0x54";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);
    const unknown10 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7) &&
      !Array.isArray(unknown8) &&
      !Array.isArray(unknown9) &&
      !Array.isArray(unknown10)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x54 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}", "${unknown4.value}", "${unknown5.value}", "${unknown6.value}", "${unknown7.value}", "${unknown8.value}", "${unknown9.value}", "${unknown10.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x54 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown57(action: Action): void {
    action.text = "unknown instruction 0x57";

    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";
    let error = false;

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      if (Array.isArray(unknown)) {
        error = true;
        break;
      }

      text += `, "${unknown.value}"`;
    }

    if (!Array.isArray(unknown) && !error) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x57 with value "${unknown.value}" then ${count} value(s) ${text.replace(",", "")}`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x57 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown5b(action: Action): void {
    action.text = "unknown instruction 0x5b";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x5b with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x5b (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown5c(action: Action): void {
    action.text = "unknown instruction 0x5c";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x5c with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x5c (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown5d(action: Action): void {
    action.text = "unknown instruction 0x5d";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x5d with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x5d (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown5e(action: Action): void {
    action.text = "unknown instruction 0x5e";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x5e with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x5e (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown62(action: Action): void {
    action.text = "unknown instruction 0x62";

    const count = this.getValue(action);

    let text = "";
    let error = false;

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      if (Array.isArray(unknown)) {
        error = true;
        break;
      }

      text += `, "${unknown.value}"`;
    }

    if (!error) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x62 with ${count} value(s) ${text.replace(",", "")}`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x62 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown63(action: Action): void {
    action.text = "unknown instruction 0x63";

    const count = this.getValue(action);

    let text = "";
    let error = false;

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      if (Array.isArray(unknown)) {
        error = true;
        break;
      }

      text += `, "${unknown.value}"`;
    }

    if (!error) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x63 with ${count} value(s) ${text.replace(",", "")}`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x63 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown67(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x67";
  }

  private parseInitEventBattle(action: Action): void {
    action.text = "should init event battle";

    const unknown = this.parseVariables(action);

    const group = this.parseVariables(action);
    const stage = this.parseVariables(action);
    const transition = this.parseVariables(action);

    if (
      !Array.isArray(unknown) &&
      !Array.isArray(group) &&
      !Array.isArray(stage) &&
      !Array.isArray(transition)
    ) {
      action.color = "mediumorchid";
      action.text = `init event battle: Unknown = "${unknown.value}", Group = "${group.value}", Stage = "${stage.value}", Transition = "${transition.value}"`;
    }
  }

  private parseUnknown6d(action: Action): void {
    action.text = "unknown instruction 0x6d";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7) &&
      !Array.isArray(unknown8) &&
      !Array.isArray(unknown9)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x6d with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}", "${unknown4.value}", "${unknown5.value}", "${unknown6.value}", "${unknown7.value}", "${unknown8.value}", "${unknown9.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x6d (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown72(action: Action): void {
    action.text = "unknown instruction 0x72";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x72 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x72 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown73(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x73";
  }

  private parseUnknown75(action: Action): void {
    action.text = "unknown instruction 0x75";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x75 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x75 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown76(action: Action): void {
    action.text = "unknown instruction 0x76";

    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";
    let error = false;

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      if (Array.isArray(unknown)) {
        error = true;
        break;
      }

      text += `, "${unknown.value}"`;
    }

    if (!Array.isArray(unknown) && !error) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x76 with value "${unknown.value}" then ${count} value(s) ${text.replace(",", "")}`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x76 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown77(action: Action): void {
    action.text = "unknown instruction 0x77";

    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";
    let error = false;

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      if (Array.isArray(unknown)) {
        error = true;
        break;
      }

      text += `, "${unknown.value}"`;
    }

    if (!Array.isArray(unknown) && !error) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x77 with value "${unknown.value}" then ${count} value(s) ${text.replace(",", "")}`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x77 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown7c(action: Action): void {
    action.text = "unknown instruction 0x7c";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x7c with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x7c (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseInitSave(action: Action): void {
    action.color = "limegreen";
    action.text = "init save";
  }

  private parseDialogBox(action: Action): void {
    action.text = "should open dialog box";

    const offset = action.offset + this.getValue(action);

    const unknown = this.parseVariables(action);

    if (
      !Array.isArray(unknown) &&
      [0x100, 0x7fffffff].includes(unknown.value)
    ) {
      action.color = "mediumorchid";
      action.text = `open dialog box and read ${offset.toHex(8)} ${unknown.value === 0x7fffffff ? "(keep open)" : "(then close)"}`;
    } else {
      debug.warn(`Error while parsing dialog box (${JSON.stringify(action)}).`);
    }
  }

  private parseUnknown92(action: Action): void {
    action.text = "unknown instruction 0x92";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x92 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x92 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknown95(action: Action): void {
    action.text = "unknown instruction 0x95";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0x95 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0x95 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseOpenTreasure(action: Action): void {
    action.text = "should open treasure";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `open treasure "${unknown.value}" (related to main.dol)`;
    } else {
      debug.warn(
        `Error while parsing open treasure (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseChoiceBox(action: Action): void {
    action.text = "should open choice box";

    const choices = this.parseVariables(action);
    const offset = action.offset + this.getValue(action);

    const unknown = this.parseVariables(action);

    if (
      !Array.isArray(choices) &&
      !Array.isArray(unknown) &&
      [0x100, 0x7fffffff].includes(unknown.value)
    ) {
      action.color = "mediumorchid";
      action.text = `open choice box with "${choices.value}" choices and read "${offset.toHex(8)}" ${unknown.value === 0x7fffffff ? "(keep open)" : "(then close)"}`;
    } else {
      debug.warn(`Error while parsing choice box (${JSON.stringify(action)}).`);
    }
  }

  private parseUnknown9c(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x9c";
  }

  private parseUnknownA7(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xa7";
  }

  private parseUnknownAb(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xab";
  }

  private parseUnknownAe(action: Action): void {
    action.text = "unknown instruction 0xae";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xae with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xae (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownB4(action: Action): void {
    action.text = "unknown instruction 0xb4";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xb4 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xb4 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseInitShop(action: Action): void {
    action.text = "should init shop";

    const shop = this.parseVariables(action);

    if (!Array.isArray(shop)) {
      action.color = "limegreen";
      action.text = `init shop "${shop.value}"`;
    } else {
      debug.warn(`Error while parsing init shop (${JSON.stringify(action)}).`);
    }
  }

  private parseUnknownB7(action: Action): void {
    action.text = "unknown instruction 0xb7";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xb7 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xb7 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownB8(action: Action): void {
    action.text = "unknown instruction 0xb8";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xb8 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xb8 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownB9(action: Action): void {
    action.text = "unknown instruction 0xb9";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xb9 with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xb9 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownBa(action: Action): void {
    action.text = "unknown instruction 0xba";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xba with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xba (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownC3(action: Action): void {
    action.text = "unknown instruction 0xc3";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xc3 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xc3 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownC4(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xc4";
  }

  private parseRestorePartyHp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore party's HP";
  }

  private parseRestorePartyMp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore party's MP";
  }

  private parseUnknownD0(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd0";
  }

  private parseUnknownD1(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd1";
  }

  private parseUnknownD5(action: Action): void {
    action.text = "unknown instruction 0xd5";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);
    const unknown10 = this.parseVariables(action);
    const unknown11 = this.parseVariables(action);
    const unknown12 = this.parseVariables(action);
    const unknown13 = this.parseVariables(action);
    const unknown14 = this.parseVariables(action);
    const unknown15 = this.parseVariables(action);
    const unknown16 = this.parseVariables(action);
    const unknown17 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7) &&
      !Array.isArray(unknown8) &&
      !Array.isArray(unknown9) &&
      !Array.isArray(unknown10) &&
      !Array.isArray(unknown11) &&
      !Array.isArray(unknown12) &&
      !Array.isArray(unknown13) &&
      !Array.isArray(unknown14) &&
      !Array.isArray(unknown15) &&
      !Array.isArray(unknown16) &&
      !Array.isArray(unknown17)
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xd5 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}", "${unknown4.value}", "${unknown5.value}", "${unknown6.value}", "${unknown7.value}", "${unknown8.value}", "${unknown9.value}", "${unknown10.value}", "${unknown11.value}", "${unknown12.value}", "${unknown13.value}", "${unknown14.value}", "${unknown15.value}", "${unknown16.value}", "${unknown17.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xd5 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownE2(action: Action): void {
    action.text = "unknown instruction 0xe2";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xe2 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xe2 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownE9(action: Action): void {
    action.text = "unknown instruction 0xe9";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xe9 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xe9 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownEb(action: Action): void {
    action.text = "unknown instruction 0xeb";

    const unknown = this.parseVariables(action);

    if (!Array.isArray(unknown)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xeb with value "${unknown.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xeb (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownF3(action: Action): void {
    action.text = "unknown instruction 0xf3";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);
    const unknown10 = this.parseVariables(action);

    if (
      !Array.isArray(unknown1) &&
      !Array.isArray(unknown2) &&
      !Array.isArray(unknown3) &&
      !Array.isArray(unknown4) &&
      !Array.isArray(unknown5) &&
      !Array.isArray(unknown6) &&
      !Array.isArray(unknown7) &&
      !Array.isArray(unknown8) &&
      !Array.isArray(unknown9) &&
      !Array.isArray(unknown10) &&
      unknown10.type === "unknown"
    ) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xf3 with values "${unknown1.value}", "${unknown2.value}", "${unknown3.value}", "${unknown4.value}", "${unknown5.value}", "${unknown6.value}", "${unknown7.value}", "${unknown8.value}", "${unknown9.value}", "${unknown10.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xf3 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseUnknownF7(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xf7";
  }

  private parseUnknownF9(action: Action): void {
    action.text = "unknown instruction 0xf9";

    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    if (!Array.isArray(unknown1) && !Array.isArray(unknown2)) {
      action.color = "mediumorchid";
      action.text = `unknown instruction 0xf9 with values "${unknown1.value}", "${unknown2.value}"`;
    } else {
      debug.warn(
        `Error while parsing instruction 0xf9 (${JSON.stringify(action)}).`,
      );
    }
  }

  private parseRestoreShipHp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore ship's HP";
  }

  private parseLoadFile(action: Action, type: FileType): void {
    const offset = action.offset + this.getValue(action);

    const name = getString(offset, 0x10, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

    if (name !== "") {
      if (offset < this.endOffset) {
        this.endOffset = offset;
      }

      this.files.push({ offset, type, name });
    } else {
      debug.warn("Error while parsing sound", { offset, type, name });
    }

    action.color = type.match(/mld|script/) ? "mediumorchid" : "limegreen";
    action.text = `load ${type} "${name}" (${offset.toHex(8)})`;
  }

  private parseText(offset: number): [number, string] {
    const $gameRegion = get(gameRegion);

    const savedOffset = offset;

    let text = "";

    while (true) {
      if ($gameRegion === 2) {
        const int = getInt(offset, "uint16", { bigEndian: true }, this.dataView); // prettier-ignore

        text += decodeWindows31J(int);

        offset += 0x2;

        if (int === 0x0) {
          break;
        }
      } else {
        let int = getInt(offset, "uint8", {}, this.dataView);

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

  public getSubroutines(): Subroutine[] {
    return this.subroutines;
  }

  public expandSubroutine(index: number): Subroutine[] {
    this.subroutines[index].expanded = !this.subroutines[index].expanded;

    return this.getSubroutines();
  }

  public expandAction(
    subroutineIndex: number,
    actionIndex: number,
  ): Subroutine[] {
    this.subroutines[subroutineIndex].actions[actionIndex].expanded =
      !this.subroutines[subroutineIndex].actions[actionIndex].expanded;

    return this.getSubroutines();
  }
}
