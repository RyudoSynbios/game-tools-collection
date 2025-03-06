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
  | "script (0xd6)"
  | "script (0x101)"
  | "sound (0x45)"
  | "sound (0xf8)"
  | "sound (0xfa)";

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
  private subroutineStatus: string;

  constructor(dataView: DataView) {
    this.dataView = dataView;

    this.count = getInt(0x8, "uint32", { bigEndian: true }, this.dataView);

    this.baseOffset = 0xc + this.count * 0x14;
    this.endOffset = this.dataView.byteLength;

    this.subroutines = [];
    this.files = [];

    this.subroutineStatus = "";

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
      this.subroutineStatus = "";

      this.loadSubroutine(i);

      if (
        this.subroutines[i].actions.find((action) => action.text.match(/"%/))
      ) {
        this.subroutineStatus = "hasError";
      } else if (
        this.subroutines[i].actions.length === 2 &&
        (this.subroutines[i].actions[1].text.match(/^\\h/) ||
          this.subroutines[i].actions[1].text.match(/^/))
      ) {
        this.subroutineStatus = "text";
      } else if (this.subroutineStatus === "") {
        this.subroutineStatus = "complete";
      }

      this.subroutines[i].name += ` (${this.subroutineStatus})`;
    }

    debug.log(this.files);
  }

  private loadSubroutine(index: number): void {
    const subroutine = this.subroutines[index];

    let { offset } = subroutine;

    while (offset < this.endOffset) {
      const instruction = getInt(offset, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore

      if ([0x5c000000, 0x81000000].includes((instruction & 0xff000000) >>> 0)) {
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

      if (
        !["hasError", "hasUnparsedInstruction"].includes(this.subroutineStatus)
      ) {
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
          case 0x7:
            this.parseUnknown07(action);
            break;
          case 0x9:
            this.parseLabel(action);
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
          case 0x15:
            this.parseUnknown15(action);
            break;
          case 0x17:
            this.parseLoadFile(action, "mld (0x17)");
            break;
          case 0x18:
            this.parseDebugText(action);
            break;
          case 0x19:
            this.parseUnknown19(action);
            break;
          case 0x1a:
            this.parseSetEntityDefaultAnimation(action);
            break;
          case 0x1b:
            this.parseSetEntityLookAtCamera(action);
            break;
          case 0x1c:
            this.parseSetEntityAnimation(action);
            break;
          case 0x1d:
            this.parseUnknown1d(action);
            break;
          case 0x1e:
            this.parseUnknown1e(action);
            break;
          case 0x1f:
            this.parseUnknown1f(action);
            break;
          case 0x20:
            this.parseUnknown20(action);
            break;
          case 0x21:
            this.parseUnknown21(action);
            break;
          case 0x22:
            this.parseUnknown22(action);
            break;
          case 0x23:
            this.parseUnknown23(action);
            break;
          case 0x24:
            this.parseUnknown24(action);
            break;
          case 0x25:
            this.parseUnknown25(action);
            break;
          case 0x27:
            this.parseUnknown27(action);
            break;
          case 0x28:
            this.parseSetCameraTargetEntity(action);
            break;
          case 0x29:
            this.parseSetEntityDefaultLookAt(action);
            break;
          case 0x2a:
            this.parseUnknown2a(action);
            break;
          case 0x2b:
            this.parseLoadFile(action, "script (0x2b)");
            break;
          case 0x2d:
            this.parseUnknown2d(action);
            break;
          case 0x2e:
            this.parseUnknown2e(action);
            break;
          case 0x2f:
            this.parseUnknown2f(action);
            break;
          case 0x31:
            this.parseUnknown31(action);
            break;
          case 0x32:
            this.parseUnknown32(action);
            break;
          case 0x33:
            this.parseUnknown33(action);
            break;
          case 0x34:
            this.parseUnknown34(action);
            break;
          case 0x35:
            this.parseUnknown35(action);
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
          case 0x3d:
            this.parseUnknown3d(action);
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
            this.parseLoadFile(action, "sound (0x45)");
            break;
          case 0x46:
            this.parseUnknown46(action);
            break;
          case 0x47:
            this.parseSetCameraPosition(action);
            break;
          case 0x48:
            this.parseUnknown48(action);
            break;
          case 0x49:
            this.parseUnknown49(action);
            break;
          case 0x4a:
            this.parseSetCameraPositionTarget(action);
            break;
          case 0x4b:
            this.parseUnknown4b(action);
            break;
          case 0x4c:
            this.parseUnknown4c(action);
            break;
          case 0x4d:
            this.parseSetPlayerPosition(action);
            break;
          case 0x4e:
            this.parseUnknown4e(action);
            break;
          case 0x4f:
            this.parseSetFog1(action);
            break;
          case 0x50:
            this.parseUnknown50(action);
            break;
          case 0x51:
            this.parseSetUnknownLight1(action);
            break;
          case 0x52:
            this.parseSetAmbientLight(action);
            break;
          case 0x53:
            this.parseSetDirectionalLight(action);
            break;
          case 0x54:
            this.parseSetPointLight(action);
            break;
          case 0x55:
            this.parseUnknown55(action);
            break;
          case 0x56:
            this.parseUnknown56(action);
            break;
          case 0x57:
            this.parseUnknown57(action);
            break;
          case 0x59:
            this.parseUnknown59(action);
            break;
          case 0x5a:
            this.parseUnknown5a(action);
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
          case 0x60:
            this.parseUnknown60(action);
            break;
          case 0x61:
            this.parseUnknown61(action);
            break;
          case 0x62:
            this.parseUnknown62(action);
            break;
          case 0x63:
            this.parseUnknown63(action);
            break;
          case 0x65:
            this.parseUnknown65(action);
            break;
          case 0x67:
            this.parseUnknown67(action);
            break;
          case 0x68:
            this.parseUnknown68(action);
            break;
          case 0x69:
            this.parseUnknown69(action);
            break;
          case 0x6a:
            this.parseUnknown6a(action);
            break;
          case 0x6b:
            this.parseUnknown6b(action);
            break;
          case 0x6c:
            this.parseUnknown6c(action);
            break;
          case 0x6d:
            this.parseSetFog2(action);
            break;
          case 0x6e:
            this.parseLoadFile(action, "mld (0x6e)");
            break;
          case 0x6f:
            this.parseUnknown6f(action);
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
            this.parseSetEntitiesInvisible(action);
            break;
          case 0x79:
            this.parseUnknown79(action);
            break;
          case 0x7a:
            this.parseUnknown7a(action);
            break;
          case 0x7b:
            this.parseUnknown7b(action);
            break;
          case 0x7c:
            this.parseUnknown7c(action);
            break;
          case 0x7d:
            this.parseUnknown7d(action);
            break;
          case 0x7e:
            this.parseUnknown7e(action);
            break;
          case 0x7f:
            this.parseUnknown7f(action);
            break;
          case 0x80:
            this.parseUnknown80(action);
            break;
          case 0x81:
            this.parseUnknown81(action);
            break;
          case 0x82:
            this.parseUnknown82(action);
            break;
          case 0x83:
            this.parseAnimateAmbientLight(action);
            break;
          case 0x84:
            this.parseAnimateDirectionalLight(action);
            break;
          case 0x85:
            this.parseAnimatePointLight(action);
            break;
          case 0x86:
            this.parseUnknown86(action);
            break;
          case 0x87:
            this.parseUnknown87(action);
            break;
          case 0x88:
            this.parseUnknown88(action);
            break;
          case 0x89:
            this.parseUnknown89(action);
            break;
          case 0x8a:
            this.parseInitSave(action);
            break;
          case 0x8b:
            this.parseUnknown8b(action);
            break;
          case 0x8c:
            this.parseUnknown8c(action);
            break;
          case 0x8d:
            this.parseUnknown8d(action);
            break;
          case 0x8e:
            this.parseUnknown8e(action);
            break;
          case 0x90:
            this.parseDialogBox(action);
            break;
          case 0x91:
            this.parseUnknown91(action);
            break;
          case 0x92:
            this.parseUnknown92(action);
            break;
          case 0x93:
            this.parseUnknown93(action);
            break;
          case 0x94:
            this.parseUnknown94(action);
            break;
          case 0x95:
            this.parseUnknown95(action);
            break;
          case 0x96:
            this.parseUnknown96(action);
            break;
          case 0x97:
            this.parseUnknown97(action);
            break;
          case 0x98:
            this.parseUnknown98(action);
            break;
          case 0x99:
            this.parseUnknown99(action);
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
          case 0x9d:
            this.parseUnknown9d(action);
            break;
          case 0x9e:
            this.parseUnknown9e(action);
            break;
          case 0x9f:
            this.parseUnknown9f(action);
            break;
          case 0xa0:
            this.parseUnknownA0(action);
            break;
          case 0xa2:
            this.parseUnknownA2(action);
            break;
          case 0xa3:
            this.parseUnknownA3(action);
            break;
          case 0xa4:
            this.parseUnknownA4(action);
            break;
          case 0xa5:
            this.parseUnknownA5(action);
            break;
          case 0xa6:
            this.parseUnknownA6(action);
            break;
          case 0xa7:
            this.parseUnknownA7(action);
            break;
          case 0xa8:
            this.parseUnknownA8(action);
            break;
          case 0xa9:
            this.parseUnknownA9(action);
            break;
          case 0xaa:
            this.parseUnknownAa(action);
            break;
          case 0xab:
            this.parseUnknownAb(action);
            break;
          case 0xac:
            this.parseUnknownAc(action);
            break;
          case 0xad:
            this.parseUnknownAd(action);
            break;
          case 0xae:
            this.parseUnknownAe(action);
            break;
          case 0xb0:
            this.parseUnknownB0(action);
            break;
          case 0xb1:
            this.parseUnknownB1(action);
            break;
          case 0xb2:
            this.parseUnknownB2(action);
            break;
          case 0xb3:
            this.parseUnknownB3(action);
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
          case 0xbe:
            this.parseUnknownBe(action);
            break;
          case 0xbf:
            this.parseUnknownBf(action);
            break;
          case 0xc3:
            this.parseUnknownC3(action);
            break;
          case 0xc4:
            this.parseUnknownC4(action);
            break;
          case 0xc5:
            this.parseUnknownC5(action);
            break;
          case 0xc6:
            this.parseUnknownC6(action);
            break;
          case 0xc7:
            this.parseUnknownC7(action);
            break;
          case 0xc9:
            this.parseRestorePartyHp(action);
            break;
          case 0xca:
            this.parseRestorePartyMp(action);
            break;
          case 0xcb:
            this.parseUnknownCb(action);
            break;
          case 0xce:
            this.parseUnknownCe(action);
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
          case 0xd3:
            this.parseUnknownD3(action);
            break;
          case 0xd4:
            this.parseUnknownD4(action);
            break;
          case 0xd5:
            this.parseUnknownD5(action);
            break;
          case 0xd6:
            this.parseLoadFile(action, "script (0xd6)");
            break;
          case 0xd7:
            this.parseUnknownD7(action);
            break;
          case 0xd8:
            this.parseUnknownD8(action);
            break;
          case 0xd9:
            this.parseUnknownD9(action);
            break;
          case 0xda:
            this.parseUnknownDa(action);
            break;
          case 0xdb:
            this.parseUnknownDb(action);
            break;
          case 0xdc:
            this.parseUnknownDc(action);
            break;
          case 0xde:
            this.parseUnknownDe(action);
            break;
          case 0xdf:
            this.parseUnknownDf(action);
            break;
          case 0xe0:
            this.parseUnknownE0(action);
            break;
          case 0xe1:
            this.parseUnknownE1(action);
            break;
          case 0xe2:
            this.parseUnknownE2(action);
            break;
          case 0xe3:
            this.parseUnknownE3(action);
            break;
          case 0xe4:
            this.parseUnknownE4(action);
            break;
          case 0xe5:
            this.parseUnknownE5(action);
            break;
          case 0xe6:
            this.parseUnknownE6(action);
            break;
          case 0xe7:
            this.parseUnknownE7(action);
            break;
          case 0xe8:
            this.parseUnknownE8(action);
            break;
          case 0xe9:
            this.parseUnknownE9(action);
            break;
          case 0xeb:
            this.parseUnknownEb(action);
            break;
          case 0xed:
            this.parseUnknownEd(action);
            break;
          case 0xee:
            this.parseUnknownEe(action);
            break;
          case 0xf0:
            this.parseUnknownF0(action);
            break;
          case 0xf1:
            this.parseUnknownF1(action);
            break;
          case 0xf2:
            this.parseUnknownF2(action);
            break;
          case 0xf3:
            this.parseUnknownF3(action);
            break;
          case 0xf5:
            this.parseUnknownF5(action);
            break;
          case 0xf6:
            this.parseUnknownF6(action);
            break;
          case 0xf7:
            this.parseUnknownF7(action);
            break;
          case 0xf8:
            this.parseLoadFile(action, "sound (0xf8)");
            break;
          case 0xf9:
            this.parseUnknownF9(action);
            break;
          case 0xfa:
            this.parseLoadFile(action, "sound (0xfa)");
            break;
          case 0xfc:
            this.parseUnknownFc(action);
            break;
          case 0xfe:
            this.parseUnknownFe(action);
            break;
          case 0xff:
            this.parseUnknownFf(action);
            break;
          case 0x101:
            this.parseLoadFile(action, "script (0x101)");
            break;
          case 0x102:
            this.parseUnknown102(action);
            break;
          case 0x103:
            this.parseUnknown103(action);
            break;
          case 0x104:
            this.parseRestoreShipHp(action);
            break;
          case 0x105:
            this.parseUnknown105(action);
            break;
          case 0x106:
            this.parseUnknown106(action);
            break;
          case 0x107:
            this.parseUnknown107(action);
            break;
          case 0x108:
            this.parseUnknown108(action);
            break;
          case 0x109:
            this.parseUnknown109(action);
            break;
          default:
            action.color = "red";
            this.subroutineStatus = "hasUnparsedInstruction";
            if (
              [
                0xf, 0x13, 0x16, 0x26, 0x2c, 0x30, 0x36, 0x39, 0x3a, 0x40, 0x42,
                0x43, 0x44, 0x58, 0x5f, 0x64, 0x66, 0x74, 0x78, 0x8f, 0xa1,
                0xaf, 0xbb, 0xbc, 0xc0, 0xc1, 0xc2, 0xcc, 0xcd, 0xcf, 0xdd,
                0xea, 0xec, 0xef, 0xf4, 0xfb, 0xfd, 0x100,
              ].includes(instruction)
            ) {
              debug.warn(
                `Unknown instruction ${instruction.toHex()} not parsed at 0x${action.offset.toHex(8)}`,
              );
            }
        }
      } else {
        action.color = "red";
      }

      subroutine.actions.push({ ...action, offset });

      if (action.color === "orange") {
        this.subroutineStatus = "hasError";
      } else if (
        this.subroutineStatus !== "hasError" &&
        this.subroutineStatus !== "hasUnparsedInstruction" &&
        action.color === "mediumorchid"
      ) {
        this.subroutineStatus = "hasUnknownInstruction";
      }

      offset += action.length * 0x4;

      if (
        offset === this.subroutines[index + 1]?.offset ||
        offset === this.endOffset
      ) {
        return;
      }
    }
  }

  private getValue(action: Action, increment = true): number {
    const value = getInt(action.offset, "int32", { bigEndian: true }, this.dataView); // prettier-ignore

    if (increment) {
      action.offset += 0x4;
      action.length += 1;
    }

    return value;
  }

  private parseEventValue(value: number): string {
    let text = `EVx${value.toHex(2)}`;

    switch (value) {
      case 0x57:
        text = "language";
        break;
    }

    return `{${text}}`;
  }

  private parseFlag(value: number): string {
    const baseOffset = (value >> 0x3) & 0x1ffffffc;
    const shift = Math.floor((0x1f - (value & 0x1f)) / 0x8);
    const bit = (value & 0x1f) - (0x3 - shift) * 0x8;

    const offset = baseOffset + shift;

    let text = `${offset.toHex(8)}[${bit}]`;

    // TODO: To confirm with USA and Japan
    if (offset === 0x83 && bit === 1) {
      text += " (no random encounter)";
    } else if (offset === 0x84 && bit === 7) {
      text += " (lock player movements)";
    } else if (offset === 0x8b && bit === 6) {
      text += " (hide mini-map)";
    }

    return text;
  }

  private parseSpecialValue(value: number): string {
    let text = `SPx${value.toHex(2)}`;

    switch (value) {
      case 0x0:
        text = "Gold";
        break;
      case 0x1:
        text = "Swashbuckler Rating";
        break;
      case 0x2:
        text = "Vyse's HP";
        break;
      case 0x3:
        text = "Aika's HP";
        break;
      case 0x4:
        text = "Fina's HP";
        break;
      case 0x5:
        text = "Drachma's HP";
        break;
      case 0x6:
        text = "Enrique's HP";
        break;
      case 0x7:
        text = "Gilder's HP";
        break;
      case 0xa:
        text = "Player";
        break;
      case 0x18:
        text = "Camera Position X?";
        break;
      case 0x19:
        text = "Camera Position Y?";
        break;
      case 0x1a:
        text = "Camera Position Z?";
        break;
      case 0x4a:
        text = "Vyse's Level";
        break;
    }

    return `[${text}]`;
  }

  private parseVariables(action: Action, isFlag = false): string {
    const variables = [];

    while (this.getValue(action, false) !== 0x1d) {
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
              `Unknown operator ${instruction} (${JSON.stringify(action)}).`,
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
      } else if ([0x800000, 0x7f7fffff, 0x7fffffff].includes(instruction)) {
        type = "unknown";
        value = instruction;
        variables.push({ type, subtype, value });
        break;
      } else {
        // Variable Types
        switch (instruction & 0xff000000) {
          case 0x4000000:
            type = "float";
            value = getInt(action.offset + 0x4, "float32", { bigEndian: true }, this.dataView); // prettier-ignore
            action.offset += 0x4;
            action.length += 1;
            break;
          case 0x8000000:
            type = "0x8000000";
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
          case 0x40000000:
            type = "0x40000000";
            value = instruction & 0xffffff;
            break;
          case 0x50000000:
            type = "special";
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

    const texts: string[] = [];

    variables.forEach((variable) => {
      if (variable.type === "0x8000000") {
        texts.push(`${variable.value.toHex()} (${variable.type})`);
      } else if (variable.type === "0x40000000") {
        texts.push(`${variable.value.toHex()} (${variable.type})`);
      } else if (variable.type === "eventValue") {
        texts.push(this.parseEventValue(variable.value));
      } else if (variable.type === "flag") {
        texts.push(`${this.parseFlag(variable.value)}`);
      } else if (variable.type === "float") {
        texts.push(
          `${isFlag ? this.parseFlag(variable.value) : variable.value}`,
        );
      } else if (variable.type === "special") {
        texts.push(`${this.parseSpecialValue(variable.value)}`);
      } else if (variable.type === "unknown") {
        texts.push(`${variable.value.toHex(8)}`);
      } else if (variable.type === "operator") {
        const text = `${texts.at(-2)} ${variable.subtype} ${texts.at(-1)}`;
        texts.splice(-2, 2);
        texts.push(text);
      }
    });

    if (variables.length === 2) {
      debug.warn(
        `Weird variables length: ${variables.length}, ${texts.join("")} (${JSON.stringify(action)})`,
      );
    }

    return texts.join("");
  }

  private parseIf(action: Action): void {
    const condition = this.parseVariables(action);
    const offset = action.offset + this.getValue(action);

    action.color = "limegreen";
    action.text = `if "${condition}" then continue else jump to "${offset.toHex(8)}"`;
  }

  private parseSwitch(action: Action): void {
    const variable = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const caseValue = this.getValue(action);
      const offset = action.offset + this.getValue(action);

      text += `, "case ${caseValue === -1 ? "default" : caseValue}: jump to ${offset.toHex(8)}"`;
    }

    action.color = "mediumorchid";
    action.text = `switch variable "${variable}": ${text.replace(", ", "")}`;
  }

  private parseUpdateEventValue(action: Action): void {
    const value = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `update event value "${value}"`;
  }

  private parseUpdateSpecialValue(action: Action): void {
    const value = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `update special value: "${value}"`;
  }

  private parseUnknown07(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7 with value "${unknown}"`;
  }

  private parseLabel(action: Action): void {
    while (this.getValue(action) !== 0x1d);

    action.color = "limegreen";
    action.text = "label";
  }

  private parseJump(action: Action): void {
    const offset = action.offset + this.getValue(action);

    action.color = "limegreen";
    action.text = `jump to "${offset.toHex(8)}"`;
  }

  private parseCallSubroutine(action: Action): void {
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
    const frames = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `wait "${frames}" frame(s)`;
  }

  private parseSetFlag(action: Action): void {
    const flag = this.parseVariables(action, true);

    action.color = "limegreen";
    action.text = `set flag "${flag}"`;
  }

  private parseUnsetFlag(action: Action): void {
    const flag = this.parseVariables(action, true);

    action.color = "limegreen";
    action.text = `unset flag "${flag}"`;
  }

  private parseGetItem(action: Action): void {
    const unknown = this.parseVariables(action);

    const inventory = getResource("inventories") as Resource;

    const item = inventory[parseInt(unknown)];

    if (item) {
      action.color = "mediumorchid";
      action.text = `get item "${item}"`;
    }
  }

  private parseUnknown15(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x15 with value "${unknown}"`;
  }

  private parseDebugText(action: Action): void {
    const offset = action.offset + this.getValue(action);

    const text = this.parseText(offset);

    action.color = "limegreen";
    action.text = `get debug text "${text[1]}"`;
  }

  private parseUnknown19(action: Action): void {
    const unknown = this.parseVariables(action);

    const offset = action.offset + this.getValue(action);

    const name = getString(offset, 0x100, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

    if (offset < this.endOffset) {
      this.endOffset = offset;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x19 with value "${unknown}", "${name}" (${offset.toHex(8)})`;
  }

  private parseSetEntityDefaultAnimation(action: Action): void {
    const entity = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set default animation to entity "${entity}"`;
  }

  private parseSetEntityLookAtCamera(action: Action): void {
    const entity = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set look at camera to entity "${entity}"`;
  }

  private parseSetEntityAnimation(action: Action): void {
    const entity = this.parseVariables(action);
    const animation = this.parseVariables(action);
    const unknown = this.parseVariables(action);
    const speed = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set animation to entity "${entity}": Animation = "${animation}", Unknown = "${unknown}", Speed = "${speed}"`;
  }

  private parseUnknown1d(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1d with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknown1e(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1e with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown1f(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x1f with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknown20(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x20 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknown21(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x21 with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown22(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x22 with value "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown23(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x23 with value "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown24(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x24 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknown25(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x25 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknown27(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x27 with values "${unknown1}", "${unknown2}"`;
  }

  private parseSetCameraTargetEntity(action: Action): void {
    const entity = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const isAnimated = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set camera target: Entity "${entity}", Y = "${positionY}" (${isAnimated === "0" ? "not " : ""}animated)`;
  }

  private parseSetEntityDefaultLookAt(action: Action): void {
    const entity = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set default look at to entity "${entity}"`;
  }

  private parseUnknown2a(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x2a with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown2d(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x2d";
  }

  private parseUnknown32(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x32 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}"`;
  }

  private parseUnknown2e(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x2e with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknown2f(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x2f with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknown31(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x31 with values "${unknown}"`;
  }

  private parseUnknown33(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x33 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknown34(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x34 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}"`;
  }

  private parseUnknown35(action: Action): void {
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
    const unknown18 = this.parseVariables(action);
    const unknown19 = this.parseVariables(action);
    const unknown20 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x35 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}", "${unknown15}", "${unknown16}", "${unknown17}", "${unknown18}", "${unknown19}", "${unknown20}"`;
  }

  private parseUnknown37(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x37 with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknown38(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x38 with value "${unknown}"`;
  }

  private parseUnknown3d(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x3d with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseFadeOut(action: Action): void {
    const frames = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `fade out for "${frames}" frames`;
  }

  private parseFadeIn(action: Action): void {
    const frames = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `fade in for "${frames}" frames`;
  }

  private parseUnknown3e(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x3e with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown3f(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x3f with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown41(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x41 with value "${unknown}"`;
  }

  private parseUnknown46(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x46 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseSetCameraPosition(action: Action): void {
    const positionX = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const positionZ = this.parseVariables(action);
    const isAnimated = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set camera position: Position = "[${positionX}, ${positionY}, ${positionZ}]" (${isAnimated === "0" ? "not " : ""}animated)`;
  }

  private parseUnknown48(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x48 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
  }

  private parseUnknown49(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x49 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}"`;
  }

  private parseSetCameraPositionTarget(action: Action): void {
    const positionX = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const positionZ = this.parseVariables(action);
    const targetX = this.parseVariables(action);
    const targetY = this.parseVariables(action);
    const targetZ = this.parseVariables(action);
    const isAnimated = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set camera position and target: Position = "[${positionX}, ${positionY}, ${positionZ}]", Target = "[${targetX}", "${targetY}", "${targetZ}"] (${isAnimated === "0" ? "not " : ""}animated)`;
  }

  private parseUnknown4b(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x4b with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}"`;
  }

  private parseUnknown4c(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x4c with value "${unknown}"`;
  }

  private parseSetPlayerPosition(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const positionX = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const positionZ = this.parseVariables(action);
    const rotation = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set player position: Unknown = "${unknown1}", Position = "[${positionX}, ${positionY}, ${positionZ}]", Rotation = "${rotation}°"`;
  }

  private parseUnknown4e(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x4e with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseSetFog1(action: Action): void {
    const red = this.parseVariables(action);
    const blue = this.parseVariables(action);
    const green = this.parseVariables(action);
    const transitionDuration = this.parseVariables(action);
    const near = this.parseVariables(action);
    const far = this.parseVariables(action);
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set fog 1: RGB = "[${red}, ${blue}, ${green}]", Duration = "${transitionDuration}", Near = "${near}", Far = "${far}", Unknown = "${unknown}"`;
  }

  private parseUnknown50(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x50";
  }

  private parseSetUnknownLight1(action: Action): void {
    const enabled = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const red = this.parseVariables(action);
    const green = this.parseVariables(action);
    const blue = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set unknown light 1: Enabled = "${enabled}", Unknown = "${unknown2}", Unknown = "${unknown3}", Unknown = "${unknown4}", Unknown = "${unknown5}", Unknown = "${unknown6}", RGB = "[${red}, ${blue}, ${green}]"`;
  }

  private parseSetAmbientLight(action: Action): void {
    const enabled = this.parseVariables(action);
    const red = this.parseVariables(action);
    const green = this.parseVariables(action);
    const blue = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set ambient light: Enabled = "${enabled}", RGB = "[${red}, ${blue}, ${green}]"`;
  }

  private parseSetDirectionalLight(action: Action): void {
    const enabled = this.parseVariables(action);
    const positionX = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const positionZ = this.parseVariables(action);
    const red = this.parseVariables(action);
    const green = this.parseVariables(action);
    const blue = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `set directional light: Enabled = "${enabled}", Position = "[${positionX}, ${positionY}, ${positionZ}]", RGB = "[${red}, ${blue}, ${green}]"`;
  }

  private parseSetPointLight(action: Action): void {
    const light = this.parseVariables(action);
    const enabled = this.parseVariables(action);
    const positionX = this.parseVariables(action);
    const positionY = this.parseVariables(action);
    const positionZ = this.parseVariables(action);
    const unknown = this.parseVariables(action);
    const radius = this.parseVariables(action);
    const red = this.parseVariables(action);
    const green = this.parseVariables(action);
    const blue = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set point light "${light}": Enabled = "${enabled}", Position = "[${positionX}, ${positionY}, ${positionZ}]", Unknown = "${unknown}", Radius = "${radius}", RGB = "[${red}, ${blue}, ${green}]"`;
  }

  private parseUnknown55(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x55 with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown56(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x56 with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown57(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x57 with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown59(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x59 with "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown5a(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5a with "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown5b(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5b with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown5c(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5c with value "${unknown}"`;
  }

  private parseUnknown5d(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5d with value "${unknown}"`;
  }

  private parseUnknown5e(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x5e with value "${unknown}"`;
  }

  private parseUnknown60(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x60 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
  }

  private parseUnknown61(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x61 with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknown62(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x62 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown63(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x63 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown65(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x65 with value "${unknown}"`;
  }

  private parseUnknown67(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x67";
  }

  private parseUnknown68(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x68 with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknown69(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x69 with value "${unknown}`;
  }

  private parseUnknown6a(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x6a with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
  }

  private parseUnknown6b(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x6b with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown6c(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x6c with "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseSetFog2(action: Action): void {
    const red = this.parseVariables(action);
    const blue = this.parseVariables(action);
    const green = this.parseVariables(action);
    const transitionDuration = this.parseVariables(action);
    const near = this.parseVariables(action);
    const nearDensity = this.parseVariables(action);
    const unknown = this.parseVariables(action);
    const far = this.parseVariables(action);
    const farDensity = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `set fog 2: RGB = "[${red}, ${blue}, ${green}]", Duration = "${transitionDuration}", Near = "${near}", Near Density = "${nearDensity}", Unknown = "${unknown}", Far = "${far}", Far Density = "${farDensity}"`;
  }

  private parseUnknown6f(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x6f with values "${unknown1}", "${unknown2}"`;
  }

  private parseInitEventBattle(action: Action): void {
    const unknown = this.parseVariables(action);

    const group = this.parseVariables(action);
    const stage = this.parseVariables(action);
    const transition = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `init event battle: Unknown = "${unknown}", Group = "${group}", Stage = "${stage}", Transition = "${transition}"`;
  }

  private parseUnknown72(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x72 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown73(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x73";
  }

  private parseUnknown75(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x75 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown76(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x76 with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseSetEntitiesInvisible(action: Action): void {
    const frames = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const entity = this.parseVariables(action);

      text += `, "${entity}"`;
    }

    action.color = "limegreen";
    action.text = `set invisibility in "${frames}" frames to ${count} entity(ies): ${text.replace(", ", "")}`;
  }

  private parseUnknown79(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x79 with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown7a(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7a with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}"`;
  }

  private parseUnknown7b(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7b with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown7c(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7c with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown7d(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x7d";
  }

  private parseUnknown7e(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7e with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown7f(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x7f with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown80(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x80 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}"`;
  }

  private parseUnknown81(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const offset = action.offset + this.getValue(action) + 0x4;

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x81 with values "${unknown1}", jump to "${offset.toHex(8)}" (if?)`;
  }

  private parseUnknown82(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x82 with "${unknown}" then ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseAnimateAmbientLight(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const red = this.parseVariables(action);
      const green = this.parseVariables(action);
      const blue = this.parseVariables(action);
      const transitionDuration = this.parseVariables(action);

      text += ` | RGB = "[${red}, ${blue}, ${green}]", Duration = "${transitionDuration}"`;
    }

    action.color = "limegreen";
    action.text = `animate ambient light with ${count} step(s) ${text.replace(" | ", "")}`;
  }

  private parseAnimateDirectionalLight(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const positionX = this.parseVariables(action);
      const positionY = this.parseVariables(action);
      const positionZ = this.parseVariables(action);
      const red = this.parseVariables(action);
      const green = this.parseVariables(action);
      const blue = this.parseVariables(action);
      const transitionDuration = this.parseVariables(action);

      text += ` | Position = "[${positionX}, ${positionY}, ${positionZ}]", RGB = "[${red}, ${blue}, ${green}]", Duration = "${transitionDuration}"`;
    }

    action.color = "limegreen";
    action.text = `animate directional light with ${count} step(s) ${text.replace(" | ", "")}`;
  }

  private parseAnimatePointLight(action: Action): void {
    const count = this.getValue(action);

    const light = this.parseVariables(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const positionX = this.parseVariables(action);
      const positionY = this.parseVariables(action);
      const positionZ = this.parseVariables(action);
      const unknown = this.parseVariables(action);
      const range = this.parseVariables(action);
      const red = this.parseVariables(action);
      const green = this.parseVariables(action);
      const blue = this.parseVariables(action);
      const transitionDuration = this.parseVariables(action);

      text += ` | Position = "[${positionX}, ${positionY}, ${positionZ}]", Unknown = "${unknown}", Range = "${range}", RGB = "[${red}, ${blue}, ${green}]", Duration = "${transitionDuration}"`;
    }

    action.color = "mediumorchid";
    action.text = `animate point light "${light}" with ${count} step(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown86(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x86 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
  }

  private parseUnknown87(action: Action): void {
    const unknown = this.parseVariables(action);

    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x87 with value "${unknown}" then ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown88(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x88 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}"`;
  }

  private parseUnknown89(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x89 with value "${unknown}"`;
  }

  private parseInitSave(action: Action): void {
    action.color = "limegreen";
    action.text = "init save";
  }

  private parseUnknown8b(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x8b with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown8c(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x8c with value "${unknown}"`;
  }

  private parseUnknown8d(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x8d with value "${unknown}"`;
  }

  private parseUnknown8e(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x8e with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}"`;
  }

  private parseDialogBox(action: Action): void {
    const offset = action.offset + this.getValue(action);

    const unknown = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `open dialog box and read "${offset.toHex(8)}" ${unknown === "7fffffff" ? "and keep it open" : "then close it"}`;
  }

  private parseUnknown91(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x91 with value "${unknown}"`;
  }

  private parseUnknown92(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x92 with value "${unknown}"`;
  }

  private parseUnknown93(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x93 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}"`;
  }

  // TODO: Related to Light 1 (0x51)
  private parseUnknown94(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);
      const unknown9 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x94 with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknown95(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x95 with value "${unknown}"`;
  }

  private parseUnknown96(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x96 with value "${unknown}"`;
  }

  private parseUnknown97(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x97 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknown98(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x98 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown99(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x99 with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseOpenTreasure(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `open treasure "${unknown}" (related to main.dol)`;
  }

  private parseChoiceBox(action: Action): void {
    const choices = this.parseVariables(action);
    const offset = action.offset + this.getValue(action);

    const unknown = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `open choice box with "${choices}" choices and read "${offset.toHex(8)} ${unknown === "7fffffff" ? "and keep it open" : "then close it"}`;
  }

  private parseUnknown9c(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x9c";
  }

  private parseUnknown9d(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x9d with value "${unknown}"`;
  }

  private parseUnknown9e(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x9e with value "${unknown}"`;
  }

  private parseUnknown9f(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown1 = this.parseVariables(action);
      const unknown2 = this.parseVariables(action);
      const unknown3 = this.parseVariables(action);
      const unknown4 = this.parseVariables(action);
      const unknown5 = this.parseVariables(action);
      const unknown6 = this.parseVariables(action);
      const unknown7 = this.parseVariables(action);
      const unknown8 = this.parseVariables(action);

      text += ` | "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x9f with ${count} block(s) ${text.replace(" | ", "")}`;
  }

  private parseUnknownA0(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa0 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
  }

  private parseUnknownA2(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa2 with value "${unknown}"`;
  }

  private parseUnknownA3(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa3 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
  }

  private parseUnknownA4(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa4 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownA5(action: Action): void {
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
    const unknown18 = this.parseVariables(action);
    const unknown19 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa5 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}", "${unknown15}", "${unknown16}", "${unknown17}", "${unknown18}", "${unknown19}"`;
  }

  private parseUnknownA6(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa6 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownA7(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xa7";
  }

  private parseUnknownA8(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa8 with value "${unknown}"`;
  }

  private parseUnknownA9(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xa9 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknownAa(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xaa";
  }

  private parseUnknownAb(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xab";
  }

  private parseUnknownAc(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xac with value "${unknown}"`;
  }

  private parseUnknownAd(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xad with value "${unknown}"`;
  }

  private parseUnknownAe(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xae with value "${unknown}"`;
  }

  private parseUnknownB0(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb0 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}"`;
  }

  private parseUnknownB1(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb1 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}"`;
  }

  private parseUnknownB2(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb2 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknownB3(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb3 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}"`;
  }

  private parseUnknownB4(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb4 with value "${unknown}"`;
  }

  private parseInitShop(action: Action): void {
    const shop = this.parseVariables(action);

    action.color = "limegreen";
    action.text = `init shop "${shop}"`;
  }

  private parseUnknownB7(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb7 with value "${unknown}"`;
  }

  private parseUnknownB8(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb8 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownB9(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xb9 with value "${unknown}"`;
  }

  private parseUnknownBa(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xba with value "${unknown}"`;
  }

  private parseUnknownBe(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xbe with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknownBf(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xbf with value "${unknown}"`;
  }

  private parseUnknownC3(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xc3 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownC4(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xc4";
  }

  private parseUnknownC5(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xc5 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownC6(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xc6 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownC7(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xc7 with values "${unknown}"`;
  }

  private parseRestorePartyHp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore party's HP";
  }

  private parseRestorePartyMp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore party's MP";
  }

  private parseUnknownCb(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xcb with value "${unknown}"`;
  }

  private parseUnknownCe(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xce";
  }

  private parseUnknownD0(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd0";
  }

  private parseUnknownD1(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd1";
  }

  private parseUnknownD3(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xd3";
  }

  private parseUnknownD4(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xd4 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}"`;
  }

  private parseUnknownD5(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xd5 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}", "${unknown15}", "${unknown16}", "${unknown17}"`;
  }

  private parseUnknownD7(action: Action): void {
    const unknown = this.parseVariables(action);

    const offset = action.offset + this.getValue(action);

    const name = getString(offset, 0x100, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

    if (offset < this.endOffset) {
      this.endOffset = offset;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xd7 with value "${unknown}", "${name}" (${offset.toHex(8)})`;
  }

  private parseUnknownD8(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xd8 with value "${unknown}"`;
  }

  private parseUnknownD9(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xd9 with value "${unknown}"`;
  }

  private parseUnknownDa(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xda with value "${unknown}"`;
  }

  private parseUnknownDb(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xdb with value "${unknown}"`;
  }

  private parseUnknownDc(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);
    const unknown9 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xdc with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}"`;
  }

  private parseUnknownDe(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xde with value "${unknown}"`;
  }

  private parseUnknownDf(action: Action): void {
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
    const unknown18 = this.parseVariables(action);
    const unknown19 = this.parseVariables(action);
    const unknown20 = this.parseVariables(action);
    const unknown21 = this.parseVariables(action);
    const unknown22 = this.parseVariables(action);
    const unknown23 = this.parseVariables(action);
    const unknown24 = this.parseVariables(action);
    const unknown25 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xdf with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}", "${unknown15}", "${unknown16}", "${unknown17}", "${unknown18}", "${unknown19}", "${unknown20}", "${unknown21}", "${unknown22}", "${unknown23}", "${unknown24}", "${unknown25}"`;
  }

  private parseUnknownE0(action: Action): void {
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
    const unknown18 = this.parseVariables(action);
    const unknown19 = this.parseVariables(action);
    const unknown20 = this.parseVariables(action);
    const unknown21 = this.parseVariables(action);
    const unknown22 = this.parseVariables(action);
    const unknown23 = this.parseVariables(action);
    const unknown24 = this.parseVariables(action);
    const unknown25 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe0 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}", "${unknown15}", "${unknown16}", "${unknown17}", "${unknown18}", "${unknown19}", "${unknown20}", "${unknown21}", "${unknown22}", "${unknown23}", "${unknown24}", "${unknown25}"`;
  }

  private parseUnknownE1(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe1 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
  }

  private parseUnknownE2(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe2 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownE3(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe3 with values "${unknown}"`;
  }

  private parseUnknownE4(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xe4";
  }

  private parseUnknownE5(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xe5";
  }

  private parseUnknownE6(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe6 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}"`;
  }

  private parseUnknownE7(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe7 with values "${unknown}"`;
  }

  private parseUnknownE8(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe8 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}", "${unknown11}", "${unknown12}", "${unknown13}", "${unknown14}"`;
  }

  private parseUnknownE9(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xe9 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownEb(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xeb with value "${unknown}"`;
  }

  private parseUnknownEd(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xed";
  }

  private parseUnknownEe(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xee with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknownF0(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf0 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}"`;
  }

  private parseUnknownF1(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xf1";
  }

  private parseUnknownF2(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf2 with values "${unknown1}", "${unknown2}", "${unknown3}"`;
  }

  private parseUnknownF3(action: Action): void {
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

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf3 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}", "${unknown9}", "${unknown10}"`;
  }

  private parseUnknownF5(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf5 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknownF6(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf6 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknownF7(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xf7";
  }

  private parseUnknownF9(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xf9 with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownFc(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0xfc with values "${unknown1}", "${unknown2}"`;
  }

  private parseUnknownFe(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xfe";
  }

  private parseUnknownFf(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0xff";
  }

  private parseUnknown102(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x102 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown103(action: Action): void {
    const unknown = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x103 with values "${unknown}"`;
  }

  private parseRestoreShipHp(action: Action): void {
    action.color = "limegreen";
    action.text = "restore ship's HP";
  }

  private parseUnknown105(action: Action): void {
    action.color = "mediumorchid";
    action.text = "unknown instruction 0x105";
  }

  private parseUnknown106(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x106 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}"`;
  }

  private parseUnknown107(action: Action): void {
    const count = this.getValue(action);

    let text = "";

    for (let i = 0; i < count; i += 1) {
      const unknown = this.parseVariables(action);

      text += `, "${unknown}"`;
    }

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x107 with ${count} value(s) ${text.replace(", ", "")}`;
  }

  private parseUnknown108(action: Action): void {
    const unknown1 = this.parseVariables(action);
    const unknown2 = this.parseVariables(action);
    const unknown3 = this.parseVariables(action);
    const unknown4 = this.parseVariables(action);
    const unknown5 = this.parseVariables(action);
    const unknown6 = this.parseVariables(action);
    const unknown7 = this.parseVariables(action);
    const unknown8 = this.parseVariables(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x108 with values "${unknown1}", "${unknown2}", "${unknown3}", "${unknown4}", "${unknown5}", "${unknown6}", "${unknown7}", "${unknown8}"`;
  }

  private parseUnknown109(action: Action): void {
    const unknown = this.parseVariables(action);

    const offset = action.offset + this.getValue(action);

    action.color = "mediumorchid";
    action.text = `unknown instruction 0x109 with value "${unknown}" and read "${offset.toHex(8)}"`;
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

    action.color = "mediumorchid";
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
