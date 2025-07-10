import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt, getString } from "$lib/utils/bytes";
import debug from "$lib/utils/debug";
import { decodeWindows31J } from "$lib/utils/encoding";
import { capitalize } from "$lib/utils/format";
import { getResource } from "$lib/utils/parser";

import { Resource } from "$lib/types";

enum Instruction {
  If = 0x0,
  Switch = 0x3,
  UpdateEventValue = 0x5,
  UpdateSpecialValue = 0x6,
  Unknown07 = 0x7,
  Label = 0x9,
  Jump = 0xa,
  JumpToLabel = 0xb,
  Return = 0xc,
  Unknown0d = 0xd,
  Wait = 0x10,
  SetFlag = 0x11,
  UnsetFlag = 0x12,
  AddItem = 0x14,
  RemoveItem = 0x15,
  WaitThenLoadMld = 0x17,
  PrintDebugText = 0x18,
  Unknown19 = 0x19,
  AddEntityToEntityTable = 0x1a,
  StartConversation = 0x1b,
  PlayEntityAnimationLoop = 0x1c,
  PlayEntityAnimationWait = 0x1d,
  SetEntityFace = 0x1e,
  Unknown1f = 0x1f,
  Unknown20 = 0x20,
  Unknown21 = 0x21,
  MoveEntity = 0x22,
  Unknown23 = 0x23,
  Unknown24 = 0x24,
  Unknown25 = 0x25,
  Unknown27 = 0x27,
  SetCameraTargetEntity = 0x28,
  RemoveEntityFromEntityTable = 0x29,
  Unknown2a = 0x2a,
  Warp = 0x2b,
  Unknown2d = 0x2d,
  Unknown2e = 0x2e,
  Unknown2f = 0x2f,
  SetCameraZoom = 0x31,
  Unknown32 = 0x32,
  PlaySe = 0x33,
  Unknown34 = 0x34,
  Unknown35 = 0x35,
  PlayBgm = 0x37,
  FadeOutBGM = 0x38,
  FadeOutBlack = 0x3b,
  FadeInBlack = 0x3c,
  Unknown3d = 0x3d,
  Unknown3e = 0x3e,
  Unknown3f = 0x3f,
  Unknown41 = 0x41,
  LoadSound = 0x45,
  Unknown46 = 0x46,
  SetCameraPosition = 0x47,
  Unknown48 = 0x48,
  Unknown49 = 0x49,
  SetCameraPositionTarget = 0x4a,
  Unknown4b = 0x4b,
  Unknown4c = 0x4c,
  SetPlayerPosition = 0x4d,
  Unknown4e = 0x4e,
  SetFog = 0x4f,
  ResetFog = 0x50,
  SetUnknownLight1 = 0x51,
  SetAmbientLight = 0x52,
  SetDirectionalLight = 0x53,
  SetPointLight = 0x54,
  Unknown55 = 0x55,
  Unknown56 = 0x56,
  Unknown57 = 0x57,
  Unknown59 = 0x59,
  Unknown5a = 0x5a,
  Unknown5b = 0x5b,
  Unknown5c = 0x5c,
  Unknown5d = 0x5d,
  Unknown5e = 0x5e,
  Unknown60 = 0x60,
  ChangeEntityParts = 0x61,
  Unknown62 = 0x62,
  Unknown63 = 0x63,
  Unknown65 = 0x65,
  StopSnd = 0x67,
  Unknown68 = 0x68,
  Unknown69 = 0x69,
  Unknown6a = 0x6a,
  Unknown6b = 0x6b,
  Unknown6c = 0x6c,
  SetNewFog = 0x6d,
  UnloadMld = 0x6e,
  Unknown6f = 0x6f,
  StartEventBattle = 0x70,
  LoadMld = 0x71,
  Unknown72 = 0x72,
  WarpToTitleScreen = 0x73,
  Unknown75 = 0x75,
  SetEntitiesVisible = 0x76,
  SetEntitiesInvisible = 0x77,
  Unknown79 = 0x79,
  Unknown7a = 0x7a,
  Unknown7b = 0x7b,
  AnimateCameraZoom = 0x7c,
  Unknown7d = 0x7d,
  Unknown7e = 0x7e,
  Unknown7f = 0x7f,
  Unknown80 = 0x80,
  Unknown81 = 0x81,
  Unknown82 = 0x82,
  AnimateAmbientLight = 0x83,
  AnimateDirectionalLight = 0x84,
  AnimatePointLight = 0x85,
  Unknown86 = 0x86,
  Unknown87 = 0x87,
  SetEntityScale = 0x88,
  SetPlayerAsEntity = 0x89,
  OpenSaveScreen = 0x8a,
  Unknown8b = 0x8b,
  FadeOutWhite = 0x8c,
  FadeInWhite = 0x8d,
  Unknown8e = 0x8e,
  OpenTextBox = 0x90,
  Unknown91 = 0x91,
  Unknown92 = 0x92,
  Unknown93 = 0x93,
  Unknown94 = 0x94,
  Unknown95 = 0x95,
  Unknown96 = 0x96,
  Unknown97 = 0x97,
  Unknown98 = 0x98,
  SetVibration = 0x99,
  OpenTreasure = 0x9a,
  OpenChoicesBox = 0x9b,
  RestoreShipPosition = 0x9c,
  AddToParty = 0x9d,
  RemoveFromParty = 0x9e,
  Unknown9f = 0x9f,
  UnknownA0 = 0xa0,
  UnknownA2 = 0xa2,
  UnknownA3 = 0xa3,
  UnknownA4 = 0xa4,
  UnknownA5 = 0xa5,
  UnknownA6 = 0xa6,
  OpenShipBattleMenu = 0xa7,
  UnknownA8 = 0xa8,
  UnknownA9 = 0xa9,
  UnknownAa = 0xaa,
  UnknownAb = 0xab,
  UnknownAc = 0xac,
  UnknownAd = 0xad,
  UnknownAe = 0xae,
  UnknownB0 = 0xb0,
  UnknownB1 = 0xb1,
  UnknownB2 = 0xb2,
  UnknownB3 = 0xb3,
  UnknownB4 = 0xb4,
  OpenShopScreen = 0xb5,
  UnknownB7 = 0xb7,
  UnknownB8 = 0xb8,
  UnknownB9 = 0xb9,
  UnknownBa = 0xba,
  UnknownBe = 0xbe,
  UnknownBf = 0xbf,
  WaitForKey = 0xc3,
  UnknownC4 = 0xc4,
  UnknownC5 = 0xc5,
  UnknownC6 = 0xc6,
  ResetShadow = 0xc7,
  RestorePartyHp = 0xc9,
  RestorePartyMp = 0xca,
  UnknownCb = 0xcb,
  UnknownCe = 0xce,
  UnknownD0 = 0xd0,
  UnknownD1 = 0xd1,
  StartShipBattle = 0xd2,
  UnknownD3 = 0xd3,
  UnknownD4 = 0xd4,
  UnknownD5 = 0xd5,
  FuneWarp = 0xd6,
  UnknownD7 = 0xd7,
  UnknownD8 = 0xd8,
  UnknownD9 = 0xd9,
  UnknownDa = 0xda,
  UnknownDb = 0xdb,
  UnknownDc = 0xdc,
  SetShip = 0xde,
  UnknownDf = 0xdf,
  UnknownE0 = 0xe0,
  UnknownE1 = 0xe1,
  UnknownE2 = 0xe2,
  RemoveFromPartyEquipmentIncluded = 0xe3,
  UnknownE4 = 0xe4,
  UnknownE5 = 0xe5,
  UnknownE6 = 0xe6,
  OpenGuildScreen = 0xe7,
  UnknownE8 = 0xe8,
  GetCupilItem = 0xe9,
  ChangeKmap = 0xeb,
  UnknownEd = 0xed,
  WarpToWorldMap = 0xee,
  UnknownF0 = 0xf0,
  UnknownF1 = 0xf1,
  UnknownF2 = 0xf2,
  UnknownF3 = 0xf3,
  UnknownF5 = 0xf5,
  UnknownF6 = 0xf6,
  UnknownF7 = 0xf7,
  LoadSoundFast = 0xf8,
  SetEntityNormalFace = 0xf9,
  WaitThenLoadSound = 0xfa,
  UnknownFc = 0xfc,
  UnknownFe = 0xfe,
  UnknownFf = 0xff,
  EndShipBattle = 0x101,
  Unknown102 = 0x102,
  Unknown103 = 0x103,
  RestoreShipHp = 0x104,
  DisplayDiscoveryCount = 0x105,
  Unknown106 = 0x106,
  Unknown107 = 0x107,
  Unknown108 = 0x108,
  DisplayCriminalList = 0x109,
}

interface Action {
  color: string;
  offset: number;
  type: string;
  subtype?: string;
  parameters: ActionParameter[];
  indent: number;
  debug: string;
  length: number;
  expanded?: boolean;
}

interface ActionParameter {
  type: string;
  value: string;
  subParameters: ActionParameter[][];
}

export interface EntityEvents {
  main: number;
  related: number[];
}

interface InstructionDefinition {
  type: string;
  subtype?: string;
  isComplete?: boolean;
  parameters?: string[];
  subParameters?: string[];
}

export interface ScriptEvent {
  offset: number;
  name: string;
  status: string;
  actions: Action[];
  linkedEvents: number[];
  expanded?: boolean;
}

export default class Script {
  private dataView: DataView;
  private count: number;
  private baseOffset: number;
  private endOffset: number;
  private indent: number;
  private jumpOffsets: {
    parsing: number[];
    ifSwitch: { actionIndex: number; type: string; offset: number }[];
    dummies: { type: string; offset: number }[];
  };
  private events: ScriptEvent[];
  private currentEventIndex: number;
  private currentLabel: string;
  private entities: { [entityId: number]: EntityEvents };
  private files: {
    offset: number;
    type: string;
    name: string;
  }[];

  constructor(dataView: DataView) {
    this.dataView = dataView;

    this.count = getInt(0x8, "uint32", { bigEndian: true }, this.dataView);

    this.baseOffset = 0xc + this.count * 0x14;
    this.endOffset = this.dataView.byteLength;
    this.indent = 0;
    this.jumpOffsets = { parsing: [], ifSwitch: [], dummies: [] };

    this.events = [];
    this.currentEventIndex = -1;
    this.currentLabel = "";
    this.entities = {};
    this.files = [];

    // We prepare empty events in order to retrieve them when JumpToLabel instruction is used
    for (let i = 0x0; i < this.count; i += 1) {
      const offset =
        this.baseOffset +
        getInt(0xc + i * 0x14, "uint32", { bigEndian: true }, this.dataView);

      const name = getString(0x10 + i * 0x14, 0x10, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

      this.events.push({
        offset,
        name,
        status: "",
        actions: [],
        linkedEvents: [],
      });
    }

    for (let i = 0; i < this.count; i += 1) {
      const event = this.events[i];

      if (event.name.match(/^M[0-9]{5}$/)) {
        this.pushEntity(event.name.substring(1), i);
      }

      this.indent = 0;
      this.jumpOffsets = { parsing: [], ifSwitch: [], dummies: [] };

      let hidden = false;

      this.events.forEach((event) => {
        if (event.linkedEvents.includes(i)) {
          hidden = true;
        }
      });

      if (!hidden) {
        this.loadEvent(i);
      }

      if (hidden) {
        event.status = "hidden";
      } else if (event.actions.find((action) => action.debug.match(/"%/))) {
        event.status = "hasError";
      } else if (
        event.actions.length === 2 &&
        (event.actions[1].debug.match(/^\\h/) ||
          event.actions[1].debug.match(/^/))
      ) {
        event.status = "text";
      } else if (event.status === "" && event.actions.length === 1) {
        event.status = "label";
      } else if (event.status === "") {
        event.status = "complete";
      }
    }
  }

  private loadEvent(index: number): void {
    const event = this.events[index];

    this.currentEventIndex = index;

    let { offset } = event;

    while (offset < this.endOffset) {
      const instruction = getInt(offset, "uint32", { bigEndian: true }, this.dataView); // prettier-ignore

      if (
        event.actions.at(-1)?.debug === "label" &&
        [0x5c000000, 0x81000000].includes((instruction & 0xff000000) >>> 0)
      ) {
        const [length, text] = this.parseText(offset);

        event.actions.push({
          color: "limegreen",
          offset,
          length,
          type: "text",
          parameters: [],
          indent: this.indent,
          debug: text,
        });

        break;
      }

      const dummies = this.jumpOffsets.dummies.filter(
        (dummy) => dummy.offset === offset,
      );

      if (dummies.length > 0) {
        let caseParsed = false;

        dummies.forEach((dummy) => {
          const action = {
            color: "limegreen",
            offset: 0x0,
            length: 1,
            type: "dummy",
            subtype: dummy.type,
            parameters: [],
            indent: this.indent,
            debug: instruction.toHex(8),
          };

          if (dummy.type.match(/^case_/)) {
            if (caseParsed) {
              action.indent -= 1;
            } else {
              this.indent += 1;
              caseParsed = true;
            }
          } else if (dummy.type === "end") {
            action.indent -= 1;
            this.indent -= 1;
          }

          event.actions.push(action);
        });
      }

      const action: Action = {
        color: "orange",
        offset: offset + 0x4,
        length: 1,
        type: "",
        parameters: [],
        indent: this.indent,
        debug: instruction.toHex(8),
      };

      if (
        event.status === "hasUnparsedInstruction" &&
        this.jumpOffsets.parsing.includes(offset)
      ) {
        event.status = "";
      }

      if (!["hasError", "hasUnparsedInstruction"].includes(event.status)) {
        switch (instruction) {
          case Instruction.If:
            this.parseInstruction(action, {
              type: "if",
              isComplete: true,
              parameters: ["operation", "offset"],
            });
            action.debug = `if "${action.parameters[0].value}" then continue else jump to "${action.parameters[1].value}"`;
            break;

          case Instruction.Switch:
            this.parseInstruction(action, {
              type: "switch",
              isComplete: true,
              parameters: ["variable", "count"],
              subParameters: ["case", "offset"],
            });
            action.debug = `switch "${action.parameters[0].value}"`;
            break;

          case Instruction.UpdateEventValue:
            this.parseInstruction(action, {
              type: "updateEventValue",
              isComplete: true,
              parameters: ["operation"],
            });
            action.debug = `update event value "${action.parameters[0].value}"`;
            break;

          case Instruction.UpdateSpecialValue:
            this.parseInstruction(action, {
              type: "updateSpecialValue",
              isComplete: true,
              parameters: ["operation"],
            });
            action.debug = `update special value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown07:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "07",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x7 with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Label:
            this.currentLabel =
              this.events.find((event) => event.offset === offset)?.name ||
              "???";
            this.parseInstruction(action, {
              type: "label",
              subtype: this.currentLabel,
              isComplete: true,
            });
            action.debug = "label";
            while (this.getValue(action) !== 0x1d);
            break;

          case Instruction.Jump:
            this.parseInstruction(action, {
              type: "jump",
              isComplete: true,
              parameters: ["offset"],
            });
            action.debug = `jump to "${action.parameters[0].value}"`;
            break;

          case Instruction.JumpToLabel:
            this.parseInstruction(action, {
              type: "jumpToLabel",
              isComplete: true,
              parameters: ["label"],
            });
            action.debug = `jump to label "${action.parameters[0].value}"`;
            break;

          case Instruction.Return:
            this.parseInstruction(action, {
              type: "return",
              isComplete: true,
            });
            action.debug = "return";
            break;

          case Instruction.Unknown0d:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "0d",
            });
            action.debug = "unknown instruction 0xd";
            break;

          case Instruction.Wait:
            this.parseInstruction(action, {
              type: "wait",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `wait "${action.parameters[0].value}" frame(s)`;
            break;

          case Instruction.SetFlag:
            this.parseInstruction(action, {
              type: "updateFlag",
              subtype: "set",
              isComplete: true,
              parameters: ["flag"],
            });
            action.debug = `set flag "${action.parameters[0].value}"`;
            break;

          case Instruction.UnsetFlag:
            this.parseInstruction(action, {
              type: "updateFlag",
              subtype: "unset",
              isComplete: true,
              parameters: ["flag"],
            });
            action.debug = `unset flag "${action.parameters[0].value}"`;
            break;

          case Instruction.AddItem:
            this.parseInstruction(action, {
              type: "updateInventory",
              subtype: "add",
              isComplete: true,
              parameters: ["item"],
            });
            action.debug = `add item "${action.parameters[0].value}"`;
            break;

          case Instruction.RemoveItem:
            this.parseInstruction(action, {
              type: "updateInventory",
              subtype: "remove",
              isComplete: true,
              parameters: ["item"],
            });
            action.debug = `remove item "${action.parameters[0].value}"`;
            break;

          case Instruction.WaitThenLoadMld:
            this.parseInstruction(action, {
              type: "waitThenLoadMld",
              parameters: ["assetName"],
            });
            action.debug = `waits until others finish then load mld "${action.parameters[0].value}"`;
            break;

          case Instruction.PrintDebugText:
            this.parseInstruction(action, {
              type: "printDebugText",
              isComplete: true,
              parameters: ["text"],
            });
            action.debug = `print debug text "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown19:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "19_Select",
              parameters: ["unknown", "assetName"],
            });
            action.debug = `unknown instruction 0x19 (Select) with value "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.AddEntityToEntityTable:
            this.parseInstruction(action, {
              type: "updateEntityTable",
              subtype: "add",
              isComplete: true,
              parameters: ["entity"],
            });
            action.debug = `add entity "${action.parameters[0].value}" to entity table`;
            break;

          case Instruction.StartConversation:
            this.parseInstruction(action, {
              type: "startConversation",
              isComplete: true,
              parameters: ["entity"],
            });
            action.debug = `start conversation with entity "${action.parameters[0].value}"`;
            break;

          case Instruction.PlayEntityAnimationLoop:
            this.parseInstruction(action, {
              type: "playAnimationLoop",
              parameters: ["entity", "animation", "unknown", "speed"],
            });
            action.debug = `set loop animation to entity "${action.parameters[0].value}": Animation = "${action.parameters[1].value}", Unknown = "${action.parameters[2].value}", Speed = "${action.parameters[3].value}"`;
            break;

          case Instruction.PlayEntityAnimationWait:
            this.parseInstruction(action, {
              type: "playAnimationWait",
              parameters: ["entity", "animation", "unknown", "speed"],
            });
            action.debug = `set wait animation to entity "${action.parameters[0].value}": Animation = "${action.parameters[1].value}", Unknown = "${action.parameters[2].value}", Speed = "${action.parameters[3].value}"`;
            break;

          case Instruction.SetEntityFace:
            this.parseInstruction(action, {
              type: "setFace",
              parameters: ["entity", "face"],
            });
            action.debug = `set face "${action.parameters[1].value}" to entity "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown1f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "1f_PutA",
              parameters: [
                "entity",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x1f (PutA) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;
            break;

          case Instruction.Unknown20:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "20_PutP",
              parameters: [
                "entity",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x20 (PutP) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;
            break;

          case Instruction.Unknown21:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "21_mvCB2",
              parameters: ["count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x21 (mvCB2) with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.MoveEntity:
            this.parseInstruction(action, {
              type: "moveEntity",
              parameters: ["entity", "count"],
              subParameters: [
                "positionX",
                "positionY",
                "positionZ",
                "speed",
                "animation",
                "unknown",
                "animationSpeed",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `move (mvR) entity "${action.parameters[0].value}" with ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.Unknown23:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "23_mv",
              parameters: ["entity", "count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x23 (mv) with value "${action.parameters[0].value}" then ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.Unknown24:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "24_rollA",
              parameters: [
                "entity",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x24 (rollA) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;

            break;

          case Instruction.Unknown25:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "25_rollP",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x25 (rollP) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;
            break;

          case Instruction.Unknown27:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "27_NecA",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x27 (NecA) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.SetCameraTargetEntity:
            this.parseInstruction(action, {
              type: "setCamera",
              subtype: "targetEntity",
              isComplete: true,
              parameters: ["entity", "positionY", "isAnimated"],
            });
            action.debug = `set camera target: Entity "${action.parameters[0].value}", Y = "${action.parameters[1].value}", Animated = "${action.parameters[2].value}"`;
            break;

          case Instruction.RemoveEntityFromEntityTable:
            this.parseInstruction(action, {
              type: "updateEntityTable",
              subtype: "remove",
              isComplete: true,
              parameters: ["entity"],
            });
            action.debug = `remove entity "${action.parameters[0].value}" from entity table`;
            break;

          case Instruction.Unknown2a:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "2a_Cl",
              parameters: ["unknown", "count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x2a (Cl, make entities visible?) with value "${action.parameters[0].value}" then ${action.parameters[1].value} value(s)`;
            break;

          case Instruction.Warp:
            this.parseInstruction(action, {
              type: "warp",
              isComplete: true,
              parameters: ["assetName"],
            });
            action.debug = `warp to "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown2d:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "2d_RunC0",
            });
            action.debug = "unknown instruction 0x2d (RunC0)";
            break;

          case Instruction.Unknown2e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "2e_angleCA",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x2e (angleCA) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.Unknown2f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "2f_angleCP",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x2f (angleCP) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.SetCameraZoom:
            this.parseInstruction(action, {
              type: "setCamera",
              subtype: "zoom",
              isComplete: true,
              parameters: ["zoom"],
            });
            action.debug = `set camera zoom to "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown32:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "32_PutCA",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x32 (PutCA) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}"`;
            break;

          case Instruction.PlaySe:
            this.parseInstruction(action, {
              type: "playSe",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `play SE with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.Unknown34:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "34_PutCP",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x34 (PutCP) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}"`;
            break;

          case Instruction.Unknown35:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "35_Mvj",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x35 (Mvj) with values "action.parameters[0].value}", "action.parameters[1].value}", "action.parameters[2].value}", "action.parameters[3].value}", "action.parameters[4].value}", "action.parameters[5].value}", "action.parameters[6].value}", "action.parameters[7].value}", "action.parameters[8].value}", "action.parameters[9].value}", "action.parameters[10].value}", "action.parameters[11].value}", "action.parameters[12].value}", "action.parameters[13].value}", "action.parameters[14].value}", "action.parameters[15].value}", "action.parameters[16].value}", "action.parameters[17].value}", "action.parameters[18].value}", "action.parameters[19].value}"`;
            break;

          case Instruction.PlayBgm:
            this.parseInstruction(action, {
              type: "playBgm",
              parameters: ["unknown", "unknown", "unknown"],
            });
            action.debug = `play BGM with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}"`;
            break;

          case Instruction.FadeOutBGM:
            this.parseInstruction(action, {
              type: "fadeOutBgm",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `fade-out BGM for "${action.parameters[0].value}" frames`;
            break;

          case Instruction.FadeOutBlack:
            this.parseInstruction(action, {
              type: "fadeScreen",
              subtype: "outBlack",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `fade-out black for "${action.parameters[0].value}" frames`;
            break;

          case Instruction.FadeInBlack:
            this.parseInstruction(action, {
              type: "fadeScreen",
              subtype: "inBlack",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `fade-in black for "${action.parameters[0].value}" frames`;
            break;

          case Instruction.Unknown3d:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "3d_Hopen",
              parameters: ["unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x3d (Hopen) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}"`;
            break;

          case Instruction.Unknown3e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "3e_Hclose",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x3e (Hclose) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.Unknown3f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "3f_Hchange",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x3f (Hchange) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.Unknown41:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "41_Hset",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x41 (Hset) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.LoadSound:
            this.parseInstruction(action, {
              type: "loadSound",
              isComplete: true,
              parameters: ["assetName"],
            });
            action.debug = `load sound "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown46:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "46_RunC1a",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x46 (RunC1a) with values "${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.SetCameraPosition:
            this.parseInstruction(action, {
              type: "setCamera",
              subtype: "position",
              isComplete: true,
              parameters: ["positionX", "positionY", "positionZ", "isAnimated"],
            });
            action.debug = `set camera position: Position = "[${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}]", Animated = "${action.parameters[3].value}"`;
            break;

          case Instruction.Unknown48:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "48_RunC3",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x48 (RunC3) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}"`;
            break;

          case Instruction.Unknown49:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "49_RunC4",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x49 (RunC4) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}"`;
            break;

          case Instruction.SetCameraPositionTarget:
            this.parseInstruction(action, {
              type: "setCamera",
              subtype: "positionAndTarget",
              isComplete: true,
              parameters: [
                "positionX",
                "positionY",
                "positionZ",
                "targetX",
                "targetY",
                "targetZ",
                "isAnimated",
              ],
            });
            action.debug = `set camera position and target: Position = "[${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}]", Target = "[${action.parameters[3].value}, ${action.parameters[4].value}, ${action.parameters[5].value}"], Animated = "${action.parameters[6].value}"`;
            break;

          case Instruction.Unknown4b:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "4b_RunC6",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x4b (RunC6) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}"`;
            break;

          case Instruction.Unknown4c:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "4c_retC",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x4c (retC) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.SetPlayerPosition:
            this.parseInstruction(action, {
              type: "setPlayerPosition",
              parameters: [
                "unknown",
                "positionX",
                "positionY",
                "positionZ",
                "rotation",
              ],
            });
            action.debug = `set player position: Ground? = "${action.parameters[0].value}", Position = "[${action.parameters[1].value}, ${action.parameters[2].value}, ${action.parameters[3].value}]", Rotation = "${action.parameters[4].value}°"`;
            break;

          case Instruction.Unknown4e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "4e_PlayColMO",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x4e (PlayColMO) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.SetFog:
            this.parseInstruction(action, {
              type: "setFog",
              parameters: [
                "colorRed",
                "colorGreen",
                "colorBlue",
                "frames",
                "near",
                "far",
                "unknown",
              ],
            });
            action.debug = `set fog: RGB = "[${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}]", Duration = "${action.parameters[3].value}", Near = "${action.parameters[4].value}", Far = "${action.parameters[5].value}", Unknown = "${action.parameters[6].value}"`;
            break;

          case Instruction.ResetFog:
            this.parseInstruction(action, {
              type: "resetFog",
              isComplete: true,
            });
            action.debug = "reset fog";
            break;

          case Instruction.SetUnknownLight1:
            this.parseInstruction(action, {
              type: "setLight",
              parameters: [
                "boolean",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "colorRed",
                "colorGreen",
                "colorBlue",
              ],
            });
            action.debug = `set unknown light 1: Enabled = "${action.parameters[0].value}", Unknown = "${action.parameters[1].value}", Unknown = "${action.parameters[2].value}", Unknown = "${action.parameters[3].value}", Unknown = "${action.parameters[4].value}", Unknown = "${action.parameters[5].value}", RGB = "[${action.parameters[6].value}, ${action.parameters[7].value}, ${action.parameters[8].value}]"`;
            break;

          case Instruction.SetAmbientLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "ambient",
              isComplete: true,
              parameters: ["boolean", "colorRed", "colorGreen", "colorBlue"],
            });
            action.debug = `set ambient light: Enabled = "${action.parameters[0].value}", RGB = "[${action.parameters[1].value}, ${action.parameters[2].value}, ${action.parameters[3].value}]"`;
            break;

          case Instruction.SetDirectionalLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "directional",
              isComplete: true,
              parameters: [
                "boolean",
                "positionX",
                "positionY",
                "positionZ",
                "colorRed",
                "colorGreen",
                "colorBlue",
              ],
            });
            action.debug = `set directional light: Enabled = "${action.parameters[0].value}", Position = "[${action.parameters[1].value}, ${action.parameters[2].value}, ${action.parameters[3].value}]", RGB = "[${action.parameters[4].value}, ${action.parameters[5].value}, ${action.parameters[6].value}]"`;
            break;

          case Instruction.SetPointLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "point",
              isComplete: true,
              parameters: [
                "light",
                "boolean",
                "positionX",
                "positionY",
                "positionZ",
                "unknown",
                "radius",
                "colorRed",
                "colorGreen",
                "colorBlue",
              ],
            });
            action.debug = `set point light "${action.parameters[0].value}": Enabled = "${action.parameters[1].value}", Position = "[${action.parameters[2].value}, ${action.parameters[3].value}, ${action.parameters[4].value}]", Unknown = "${action.parameters[5].value}", Radius = "${action.parameters[6].value}", RGB = "[${action.parameters[7].value}, ${action.parameters[8].value}, ${action.parameters[9].value}]"`;
            break;

          case Instruction.Unknown55:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "55_ukisuguR",
              parameters: ["unknown", "count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x55 (ukisuguR) with value "${action.parameters[0].value}" then ${action.parameters[1].value} value(s)`;
            break;

          case Instruction.Unknown56:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "56_Ukisugu1",
              parameters: ["unknown", "count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x56 (Ukisugu1) with value "${action.parameters[0].value}" then ${action.parameters[1].value} value(s)`;
            break;

          case Instruction.Unknown57:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "57_Ukinoru",
              parameters: ["unknown", "count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x57 (Ukinoru) with value "${action.parameters[0].value}" then ${action.parameters[1].value} value(s)`;
            break;

          case Instruction.Unknown59:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "59_mvF",
              parameters: ["unknown", "count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x59 (mvF) with "${action.parameters[0].value}" then ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.Unknown5a:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "5a_mvS",
              parameters: ["entity", "count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x5a (mvS) with "${action.parameters[0].value}" then ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.Unknown5b:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "5b_ChangeRoof",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x5b (ChangeRoof) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.Unknown5c:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "5c_scptiLinkEnable",
              parameters: ["boolean"],
            });
            action.debug = `unknown instruction 0x5c (scptiLinkEnable) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown5d:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "5d_visibilityLink",
              parameters: ["boolean"],
            });
            action.debug = `unknown instruction 0x5d (visibility link) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown5e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "5e_setiLink",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x5e (setiLink) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown60:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "60_RunC7b",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x60 (RunC7b) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}"`;
            break;

          case Instruction.ChangeEntityParts:
            this.parseInstruction(action, {
              type: "changeEntityParts",
              isComplete: true,
              parameters: ["entity", "partToChange", "njcm"],
            });
            action.debug = `change part "${action.parameters[1].value}" to NJCM "${action.parameters[2].value}" on entity "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown62:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "62_TaskOn",
              parameters: ["count"],
              subParameters: ["entity"],
            });
            action.debug = "unknown instruction 0x62 (TaskOn)";
            break;

          case Instruction.Unknown63:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "63_TaskOff",
              parameters: ["count"],
              subParameters: ["entity"],
            });
            action.debug = "unknown instruction 0x63 (TaskOff)";
            break;

          case Instruction.Unknown65:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "65_stopSE",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x65 (stopSE) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.StopSnd:
            this.parseInstruction(action, {
              type: "stopSnd",
            });
            action.debug = "stop SND (BGM + SE?)";
            break;

          case Instruction.Unknown68:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "68_swingOnC",
              parameters: ["unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x68 (swingOnC) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}"`;
            break;

          case Instruction.Unknown69:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "69_swingOffC",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x69 (swingOffC) with value "${action.parameters[0].value}`;
            break;

          case Instruction.Unknown6a:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "6a_ParentOn",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x6a (ParentOn) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}"`;
            break;

          case Instruction.Unknown6b:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "6b_ParentOff",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x6b (ParentOff) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.Unknown6c:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "6c_mvSF",
              parameters: ["unknown", "count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x6c (mvSF) with "${action.parameters[0].value}" then ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.SetNewFog:
            this.parseInstruction(action, {
              type: "setFog",
              subtype: "new",
              parameters: [
                "colorRed",
                "colorGreen",
                "colorBlue",
                "frames",
                "near",
                "nearDensity",
                "unknown",
                "far",
                "farDensity",
              ],
            });
            action.debug = `set new fog (setNewFog): RGB = "[${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}]", Duration = "${action.parameters[3].value}", Near = "${action.parameters[4].value}", Near Density = "${action.parameters[5].value}", Unknown = "${action.parameters[6].value}", Far = "${action.parameters[7].value}", Far Density = "${action.parameters[8].value}"`;
            break;

          case Instruction.UnloadMld:
            this.parseInstruction(action, {
              type: "unloadMld",
              isComplete: true,
              parameters: ["assetName"],
            });
            action.debug = `unload mld "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown6f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "6f_RunC8",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x6f (RunC8) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.StartEventBattle:
            this.parseInstruction(action, {
              type: "startEventBattle",
              parameters: ["unknown", "group", "stage", "transition"],
            });
            action.debug = `start event battle: Unknown = "${action.parameters[0].value}", Group = "${action.parameters[1].value}", Stage = "${action.parameters[2].value}", Transition = "${action.parameters[3].value}"`;
            break;

          case Instruction.LoadMld:
            this.parseInstruction(action, {
              type: "loadMld",
              isComplete: true,
              parameters: ["assetName"],
            });
            action.debug = `load mld "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown72:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "72_chgGrdMdl",
              parameters: ["placement", "index"],
            });
            action.debug = `unknown instruction 0x72 (chgGrdMdl) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.WarpToTitleScreen:
            this.parseInstruction(action, {
              type: "warpToTitleScreen",
              isComplete: true,
            });
            action.debug = "warp to title screen";
            break;

          case Instruction.Unknown75:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "75_CWait",
              parameters: ["entity", "frames"],
            });
            action.debug = `unknown instruction 0x75 (CWait "Entity wait for x frames") with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.SetEntitiesVisible:
            this.parseInstruction(action, {
              type: "setVisibility",
              subtype: "show",
              isComplete: true,
              parameters: ["frames", "count"],
              subParameters: ["entity"],
            });
            action.debug = `set visibility in "${action.parameters[0].value}" frames to ${action.parameters[1].value} entity(ies)`;
            break;

          case Instruction.SetEntitiesInvisible:
            this.parseInstruction(action, {
              type: "setVisibility",
              subtype: "hide",
              isComplete: true,
              parameters: ["frames", "count"],
              subParameters: ["entity"],
            });
            action.debug = `set invisibility in "${action.parameters[0].value}" frames to ${action.parameters[1].value} entity(ies)`;
            break;

          case Instruction.Unknown79:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "79_mvCA",
              parameters: ["count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "frames",
              ],
            });
            action.debug = `unknown instruction 0x79 (mvCA) with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.Unknown7a:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "7a_RunC9",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x7a (RunC9) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}"`;
            break;

          case Instruction.Unknown7b:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "7b_TrackUp",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x7b (TrackUp) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.AnimateCameraZoom:
            this.parseInstruction(action, {
              type: "setCamera",
              subtype: "zoom_animate",
              isComplete: true,
              parameters: ["zoom", "frames"],
            });
            action.debug = `animate camera zoom to "${action.parameters[0].value}" in "${action.parameters[1].value}" frames`;
            break;

          case Instruction.Unknown7d:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "7d",
            });
            action.debug = "unknown instruction 0x7d";
            break;

          case Instruction.Unknown7e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "7e",
              parameters: ["count"],
              subParameters: ["entity"],
            });
            action.debug = `unknown instruction 0x7e with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.Unknown7f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "7f",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x7f with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.Unknown80:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "80_PlayMO2",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x80 (PlayMO2) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}"`;
            break;

          case Instruction.Unknown81:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "81_WWW",
              parameters: ["unknown", "offset"],
            });
            action.debug = `unknown instruction 0x81 (WWW) with values "${action.parameters[0].value}", jump to "${action.parameters[1].value}" (if?)`;
            break;

          case Instruction.Unknown82:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "82_mv2",
              parameters: ["entity", "count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x82 (mv2) with "${action.parameters[0].value}" then ${action.parameters[1].value} block(s)`;
            break;

          case Instruction.AnimateAmbientLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "ambient",
              isComplete: true,
              parameters: ["count"],
              subParameters: ["colorRed", "colorGreen", "colorBlue", "frames"],
            });
            action.debug = `animate ambient light with ${action.parameters[0].value} step(s)`;
            break;

          case Instruction.AnimateDirectionalLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "directional",
              isComplete: true,
              parameters: ["count"],
              subParameters: [
                "positionX",
                "positionY",
                "positionZ",
                "colorRed",
                "colorGreen",
                "colorBlue",
                "frames",
              ],
            });
            action.debug = `animate directional light with ${action.parameters[0].value} step(s)`;
            break;

          case Instruction.AnimatePointLight:
            this.parseInstruction(action, {
              type: "setLight",
              subtype: "point",
              parameters: ["count", "light"],
              subParameters: [
                "positionX",
                "positionY",
                "positionZ",
                "unknown",
                "radius",
                "colorRed",
                "colorGreen",
                "colorBlue",
                "frames",
              ],
            });
            action.debug = `animate point light "${action.parameters[1].value}" with ${action.parameters[0].value} step(s)`;
            break;

          case Instruction.Unknown86:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "86_Proll",
              parameters: [
                "entity",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "frames",
              ],
            });
            action.debug = `unknown instruction 0x86 (Proll "Entity wait for x frames) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}"`;

            break;

          case Instruction.Unknown87:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "87_fogM",
              parameters: ["unknown", "count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x87 (fogM) with value "${action.parameters[0].value}" then ${action.parameters[1].value} value(s)`;
            break;

          case Instruction.SetEntityScale:
            this.parseInstruction(action, {
              type: "setEntityScale",
              isComplete: true,
              parameters: ["entity", "scaleX", "scaleY", "scaleZ", "frames"],
            });
            action.debug = `set scale of entity "${action.parameters[0].value}": Scale = "[${action.parameters[1].value}, ${action.parameters[2].value}, ${action.parameters[3].value}]", Duration = "${action.parameters[4].value}"`;
            break;

          case Instruction.SetPlayerAsEntity:
            this.parseInstruction(action, {
              type: "setPlayer",
              isComplete: true,
              parameters: ["entity"],
            });
            action.debug = `set player as entity "${action.parameters[0].value}"`;
            break;

          case Instruction.OpenSaveScreen:
            this.parseInstruction(action, {
              type: "openSaveScreen",
              isComplete: true,
            });
            action.debug = "open save screen";
            break;

          case Instruction.Unknown8b:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "8b_mvCALP",
              parameters: ["count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x8b (mvCALP) with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.FadeOutWhite:
            this.parseInstruction(action, {
              type: "fadeScreen",
              subtype: "outWhite",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `fade-out white for "${action.parameters[0].value}" frames`;
            break;

          case Instruction.FadeInWhite:
            this.parseInstruction(action, {
              type: "fadeScreen",
              subtype: "inWhite",
              isComplete: true,
              parameters: ["frames"],
            });
            action.debug = `fade-in white for "${action.parameters[0].value}" frames`;
            break;

          case Instruction.Unknown8e:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "8e_greyOut?",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x8e (grey out?) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}"`;
            break;

          case Instruction.OpenTextBox:
            this.parseInstruction(action, {
              type: "openTextBox",
              isComplete: true,
              parameters: ["text", "dialogAction"],
            });
            action.debug = `open dialog box and read "${action.parameters[0].value}" ${action.parameters[1].value === "7fffffff" ? "and keep it open" : "then close it"}`;
            break;

          case Instruction.Unknown91:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "91_randomOccurence?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x91 (random occurence?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown92:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "92_addedObjectInformation",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x92 (added object information?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown93:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "93_setAsk2",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x93 (setAsk2) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}"`;
            break;

          case Instruction.Unknown94:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "94_relatedToLight1",
              parameters: ["count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x94 (related to light1) with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.Unknown95:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "95_enterTheEffectUnderControl",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x95 (enter the effect under control) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown96:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "96_returnTheEffectUnderControl",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x96 (return the effect under control) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown97:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "97",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0x97 with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.Unknown98:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "98_resetTaskRecursively",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x98 (reset task recursively) with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.SetVibration:
            this.parseInstruction(action, {
              type: "setVibration",
              parameters: ["count"],
              subParameters: ["unknown", "unknown", "unknown"],
            });
            action.debug = `set vibration with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.OpenTreasure:
            this.parseInstruction(action, {
              type: "openTreasure",
              parameters: ["unknown"],
            });
            action.debug = `open treasure "${action.parameters[0].value}" (related to main.dol)`;
            break;

          case Instruction.OpenChoicesBox:
            this.parseInstruction(action, {
              type: "openChoicesBox",
              isComplete: true,
              parameters: ["choices", "text", "dialogAction"],
            });
            action.debug = `open choice box with "${action.parameters[0].value}" choices and read "${action.parameters[1].value}" ${action.parameters[2].value === "7fffffff" ? "and keep it open" : "then close it"}`;
            break;

          case Instruction.RestoreShipPosition:
            this.parseInstruction(action, {
              type: "restoreShipPosition",
              isComplete: true,
            });
            action.debug = "restore ship position";
            break;

          case Instruction.AddToParty:
            this.parseInstruction(action, {
              type: "changeParty",
              subtype: "add",
              isComplete: true,
              parameters: ["character"],
            });
            action.debug = `add "${action.parameters[0].value}" to party`;
            break;

          case Instruction.RemoveFromParty:
            this.parseInstruction(action, {
              type: "changeParty",
              subtype: "remove",
              isComplete: true,
              parameters: ["character"],
            });
            action.debug = `remove "${action.parameters[0].value}" from party`;
            break;

          case Instruction.Unknown9f:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "9f_mvCA3",
              parameters: ["count"],
              subParameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x9f (mvCA3) with ${action.parameters[0].value} block(s)`;
            break;

          case Instruction.UnknownA0:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a0_gChangegrd",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xa0 (gChangegrd) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}"`;
            break;

          case Instruction.UnknownA2:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a2_RunC10",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xa2 (RunC10) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownA3:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a3_RunC11",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xa3 (RunC11) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}"`;
            break;

          case Instruction.UnknownA4:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a4_houseClear",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xa4 (houseClear) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.UnknownA5:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a5_relatedToShipBattle",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xa5 (related to ship battle) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}", "${action.parameters[13].value}", "${action.parameters[14].value}", "${action.parameters[15].value}", "${action.parameters[16].value}", "${action.parameters[17].value}", "${action.parameters[18].value}"`;
            break;

          case Instruction.UnknownA6:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a6_relatedToShipBattle",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xa6 (related to ship battle) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.OpenShipBattleMenu:
            this.parseInstruction(action, {
              type: "openShipBattleMenu",
              isComplete: true,
            });
            action.debug = "open ship battle menu";
            break;

          case Instruction.UnknownA8:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a8_changeTo2PModifier?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xa8 (change to 2P modifier?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownA9:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "a9_changeTheColorOfThe2PModifier",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xa9 (change the color of the 2P modifier) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.UnknownAa:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "aa_shipBattleInitialized?",
            });
            action.debug =
              "unknown instruction 0xaa (ship battle initialized?)";
            break;

          case Instruction.UnknownAb:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ab_shipBattlePaused?",
            });
            action.debug = "unknown instruction 0xab (ship battle paused?)";
            break;

          case Instruction.UnknownAc:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ac_shipBattleSceneTableStart?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xac (ship battle scene table start?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownAd:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ad_shipBattleSceneTableEnd?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xad (ship battle scene table end?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownAe:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ae_path?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xae (path?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownB0:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b0_partsScale",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xb0 (partsScale) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}"`;
            break;

          case Instruction.UnknownB1:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b1_getHakken",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xb1 (getHakken) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}"`;
            break;

          case Instruction.UnknownB2:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b2_putCM",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xb2 (putCM) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;
            break;

          case Instruction.UnknownB3:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b3_RunC13B",
              parameters: ["unknown", "unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xb3 (RunC13B) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}"`;
            break;

          case Instruction.UnknownB4:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b4_Htaskset",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xb4 (Htaskset) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.OpenShopScreen:
            this.parseInstruction(action, {
              type: "openShopScreen",
              isComplete: true,
              parameters: ["shop"],
            });
            action.debug = `open shop screen "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownB7:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b7_itemInformationHasBeenAddedTo$KAZU",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xb7 (item information has been added to $KAZU) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownB8:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b8_RunC14",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xb8 (RunC14) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.UnknownB9:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "b9_SoraMadoOnCompassDisplay",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xb9 (SoraMadoOn Compass Display) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownBa:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ba_SoraMadoOffCompassHidden",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xba (SoraMadoOff Compass Hidden) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownBe:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "be_mapDefMO",
              parameters: ["entity", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xbe (mapDefMO) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}"`;
            break;

          case Instruction.UnknownBf:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "bf_shipInfo?",
              parameters: ["entity"],
            });
            action.debug = `unknown instruction 0xbf (ship info?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.WaitForKey:
            this.parseInstruction(action, {
              type: "waitForKey",
              parameters: ["unknown", "frames"],
            });
            action.debug = `wait for key with value "${action.parameters[0].value}" and "${action.parameters[1].value}" frames`;
            break;

          case Instruction.UnknownC4:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "c4",
            });
            action.debug = "unknown instruction 0xc4 (camera related?)";
            break;

          case Instruction.UnknownC5:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "c5_cameraPathRelated?",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xc5 (camera path related?) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.UnknownC6:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "c6_SetShadow",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xc6 (Set Shadow) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.ResetShadow:
            this.parseInstruction(action, {
              type: "resetShadow",
              isComplete: true,
              parameters: ["entity"],
            });
            action.debug = `reset shadow of entity "${action.parameters[0].value}"`;
            break;

          case Instruction.RestorePartyHp:
            this.parseInstruction(action, {
              type: "restorePartyHp",
              isComplete: true,
            });
            action.debug = "restore party's HP";
            break;

          case Instruction.RestorePartyMp:
            this.parseInstruction(action, {
              type: "restorePartyMp",
              isComplete: true,
            });
            action.debug = "restore party's MP";
            break;

          case Instruction.UnknownCb:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "cb_delSetAsk2",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xcb (delSetAsk2) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownCe:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ce_shipBattleSbGetTime",
            });
            action.debug = "unknown instruction 0xce (ship battle sbGetTime)";
            break;

          case Instruction.UnknownD0:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d0_sbCammOn",
            });
            action.debug = "unknown instruction 0xd0 (sbCammOn)";
            break;

          case Instruction.UnknownD1:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d1_sbCammOff",
            });
            action.debug = "unknown instruction 0xd1 (sbCammOff)";
            break;

          case Instruction.StartShipBattle:
            this.parseInstruction(action, {
              type: "startShipBattle",
              isComplete: true,
              parameters: ["assetName"],
            });
            action.debug = `start ship battle "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownD3:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d3_sb_end",
            });
            action.debug = "unknown instruction 0xd3 (sb_end)";
            break;

          case Instruction.UnknownD4:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d4_sbCommandEnemyWarpToMe099q.sct?",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xd4 (sb command enemy, warp to me099q.sct?) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}"`;
            break;

          case Instruction.UnknownD5:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d5_sbBT",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xd5 (sbBT with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}", "${action.parameters[13].value}", "${action.parameters[14].value}", "${action.parameters[15].value}", "${action.parameters[16].value}""`;
            break;
            break;

          case Instruction.FuneWarp:
            this.parseInstruction(action, {
              type: "funeWarp",
              parameters: ["assetName"],
            });
            action.debug = `fune warp "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownD7:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d7_reqPCM",
              parameters: ["unknown", "assetName"],
            });
            action.debug = `unknown instruction 0xd7 (reqPCM) with value "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            action.debug = `unknown instruction 0xd7 (reqPCM) with value "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.UnknownD8:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d8_startPCM",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xd8 (startPCM) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownD9:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "d9_sonarSet",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xd9 (sonarSet) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownDa:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "da_crewIn",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xda (crewIn) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownDb:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "db_WorldMapSwitch?",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xdb (World Map Switch?) with value "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownDc:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "dc_ParentOnNew",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xdc (ParentOnNew) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}"`;
            break;

          case Instruction.SetShip:
            this.parseInstruction(action, {
              type: "setShip",
              isComplete: true,
              parameters: ["ship"],
            });
            action.debug = `set ship "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownDf:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "df",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xdf with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}", "${action.parameters[13].value}", "${action.parameters[14].value}", "${action.parameters[15].value}", "${action.parameters[16].value}", "${action.parameters[17].value}", "${action.parameters[18].value}", "${action.parameters[19].value}", "${action.parameters[20].value}", "${action.parameters[21].value}", "${action.parameters[22].value}", "${action.parameters[23].value}", "${action.parameters[24].value}"`;
            break;

          case Instruction.UnknownE0:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e0",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xe0 with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}", "${action.parameters[13].value}", "${action.parameters[14].value}", "${action.parameters[15].value}", "${action.parameters[16].value}", "${action.parameters[17].value}", "${action.parameters[18].value}", "${action.parameters[19].value}", "${action.parameters[20].value}", "${action.parameters[21].value}", "${action.parameters[22].value}", "${action.parameters[23].value}", "${action.parameters[24].value}"`;
            break;

          case Instruction.UnknownE1:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e1",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xe1 with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}"`;
            break;

          case Instruction.UnknownE2:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e2",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xe2 with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.RemoveFromPartyEquipmentIncluded:
            this.parseInstruction(action, {
              type: "changeParty",
              subtype: "removeEquipmentIncluded",
              isComplete: true,
              parameters: ["character"],
            });
            action.debug = `remove "${action.parameters[0].value}" from party (equipment included)`;
            break;

          case Instruction.UnknownE4:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e4_partyCHG",
            });
            action.debug = "unknown instruction 0xe4 (partyCHG)";
            break;

          case Instruction.UnknownE5:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e5_partyMRG",
            });
            action.debug = "unknown instruction 0xe5 (partyMRG)";
            break;

          case Instruction.UnknownE6:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e6_RunC12",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xe6 (RunC12) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}"`;
            break;

          case Instruction.OpenGuildScreen:
            this.parseInstruction(action, {
              type: "openGuildScreen",
              isComplete: true,
              parameters: ["guild"],
            });
            action.debug = `open guild screen "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownE8:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "e8",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xe8 with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}", "${action.parameters[10].value}", "${action.parameters[11].value}", "${action.parameters[12].value}", "${action.parameters[13].value}"`;
            break;

          case Instruction.GetCupilItem:
            this.parseInstruction(action, {
              type: "getCupilItem",
              isComplete: true,
              parameters: ["cupilItem", "cupilFlag"],
            });
            action.debug = `get "${action.parameters[0].value}" and set flag "${action.parameters[1].value}"`;
            break;

          case Instruction.ChangeKmap:
            this.parseInstruction(action, {
              type: "changeKmap",
              parameters: ["entity"],
            });
            action.debug = `change kmap "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownEd:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ed_warpToTitleScreen?",
            });
            action.debug = "unknown instruction 0xed (warp to title screen?)";
            break;

          case Instruction.WarpToWorldMap:
            this.parseInstruction(action, {
              type: "warpToWorldMap",
              isComplete: true,
              parameters: ["positionX", "positionY", "positionZ"],
            });
            action.debug = `warp to world map at position "[${action.parameters[0].value}, ${action.parameters[1].value}, ${action.parameters[2].value}]"`;
            break;

          case Instruction.UnknownF0:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f0_scrEffect",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xf0 (scrEffect) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}"`;
            break;

          case Instruction.UnknownF1:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f1_scrEffectOff",
            });
            action.debug = "unknown instruction 0xf1 (scrEffectOff)";
            break;

          case Instruction.UnknownF2:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f2",
              parameters: ["unknown", "unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xf2 with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}"`;
            break;

          case Instruction.UnknownF3:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f3_setAsk3",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0xf3 (setAsk3) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}", "${action.parameters[8].value}", "${action.parameters[9].value}"`;
            break;

          case Instruction.UnknownF5:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f5_TaskOn",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xf5 (TaskOn) with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.UnknownF6:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f6_TaskOff",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0xf6 (TaskOff) with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.UnknownF7:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "f7_stopAllSND",
            });
            action.debug = "unknown instruction 0xf7 (stopAllSND)";
            break;

          case Instruction.LoadSoundFast:
            this.parseInstruction(action, {
              type: "loadSoundFast",
              parameters: ["assetName"],
            });
            action.debug = `load sound fast "${action.parameters[0].value}"`;
            break;

          case Instruction.SetEntityNormalFace:
            this.parseInstruction(action, {
              type: "setFace",
              subtype: "normal",
              parameters: ["entity", "face"],
            });
            action.debug = `set normal face "${action.parameters[1].value}" to entity "${action.parameters[0].value}"`;
            break;

          case Instruction.WaitThenLoadSound:
            this.parseInstruction(action, {
              type: "waitThenLoadSound",
              parameters: ["assetName"],
            });
            action.debug = `waits for load fast to finish "${action.parameters[0].value}"`;
            break;

          case Instruction.UnknownFc:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "fc_MA2RndSwitch",
              parameters: ["unknown", "unknown"],
            });
            action.debug = `unknown instruction 0xfc (MA2RndSwitch) with values "${action.parameters[0].value}", "${action.parameters[1].value}"`;
            break;

          case Instruction.UnknownFe:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "fe",
            });
            action.debug = "unknown instruction 0xfe";
            break;

          case Instruction.UnknownFf:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "ff",
            });
            action.debug = "unknown instruction 0xff";
            break;

          case Instruction.EndShipBattle:
            this.parseInstruction(action, {
              type: "endShipBattle",
              parameters: ["assetName"],
            });
            action.debug = `end ship battle "${action.parameters[0].value}"`;
            break;

          case Instruction.Unknown102:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "102",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x102 with ${action.parameters[0].value} value(s)`;
            break;

          case Instruction.Unknown103:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "103_MessageFromHamachoSennin",
              parameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x103 (Message from Hamacho Sennin) with values "${action.parameters[0].value}"`;
            break;

          case Instruction.RestoreShipHp:
            this.parseInstruction(action, {
              type: "restoreShipHp",
              isComplete: true,
            });
            action.debug = "restore ship's HP";
            break;

          case Instruction.DisplayDiscoveryCount:
            this.parseInstruction(action, {
              type: "displayDiscoveryCount",
              isComplete: true,
            });
            action.debug = "display Discovery count";
            break;

          case Instruction.Unknown106:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "106_greyIn?",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x106 (grey in?) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}"`;
            break;

          case Instruction.Unknown107:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "107",
              parameters: ["count"],
              subParameters: ["unknown"],
            });
            action.debug = `unknown instruction 0x107 with ${action.parameters[0].value} value(s)}`;
            break;

          case Instruction.Unknown108:
            this.parseInstruction(action, {
              type: "unknown",
              subtype: "108_FldPutA",
              parameters: [
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
                "unknown",
              ],
            });
            action.debug = `unknown instruction 0x108 (FldPutA) with values "${action.parameters[0].value}", "${action.parameters[1].value}", "${action.parameters[2].value}", "${action.parameters[3].value}", "${action.parameters[4].value}", "${action.parameters[5].value}", "${action.parameters[6].value}", "${action.parameters[7].value}"`;
            break;

          case Instruction.DisplayCriminalList:
            this.parseInstruction(action, {
              type: "displayCriminalList",
              isComplete: true,
              parameters: ["value", "text"],
            });
            action.debug = `display criminal list using "${action.parameters[0].value}" and read "${action.parameters[1].value}"`;
            break;

          default:
            action.color = "red";
            event.status = "hasUnparsedInstruction";
        }
      } else {
        action.color = "red";
      }

      event.actions.push({ ...action, offset });

      if (action.color === "orange") {
        event.status = "hasError";
      } else if (
        event.status !== "hasError" &&
        event.status !== "hasUnparsedInstruction" &&
        action.color === "mediumorchid"
      ) {
        event.status = "hasUnknownInstruction";
      }

      offset += action.length * 0x4;

      let stop = false;

      const nextEventIndex = this.events.findIndex(
        (event) => event.offset === offset,
      );

      if (nextEventIndex !== -1) {
        if (["", "jump", "label", "return"].includes(action.type)) {
          stop = true;
        } else {
          event.linkedEvents.push(nextEventIndex);
        }
      }

      if (stop || offset === this.endOffset) {
        return;
      }
    }
  }

  private parseInstruction(
    action: Action,
    definition: InstructionDefinition,
  ): void {
    action.color = definition.isComplete ? "limegreen" : "mediumorchid";
    action.type = definition.type;
    action.subtype = definition.subtype || "";

    if (definition.parameters) {
      definition.parameters.forEach((parameter) => {
        const a = {
          type: parameter,
          value: this.parseInstructionParameter(action, parameter),
          subParameters: [],
        };

        action.parameters.push(a);
      });
    }

    if (definition.subParameters && action.parameters) {
      const countParameter = action.parameters.find(
        (parameter) => parameter.type === "count",
      );

      if (countParameter) {
        const count = parseInt(countParameter.value);

        for (let i = 0; i < count; i += 1) {
          const iteration: ActionParameter[] = [];

          definition.subParameters?.forEach((parameter) => {
            iteration.push({
              type: parameter,
              value: this.parseInstructionParameter(action, parameter),
              subParameters: [],
            });
          });

          countParameter.subParameters.push(iteration);
        }
      }
    }
  }

  private parseInstructionParameter(action: Action, parameter: string): string {
    let offset = 0x0;
    let value = "";

    if (["assetName", "label", "offset", "text"].includes(parameter)) {
      offset = action.offset + this.getValue(action);

      if (action.subtype === "81_WWW") {
        offset += 0x4;
      }
    }

    if (parameter === "assetName") {
      let type = "";
      const name = getString(offset, 0x10, "uint8", { zeroTerminated: true }, this.dataView); // prettier-ignore

      if (name !== "") {
        if (offset < this.endOffset) {
          this.endOffset = offset;
        }

        switch (action.type) {
          case "loadMld":
          case "unloadMld":
          case "waitThenLoadMld":
            type = "mld";
          case "loadSound":
          case "loadSoundFast":
          case "waitThenLoadSound":
            type = "sound";
          case "endShipBattle":
          case "funeWarp":
          case "startShipBattle":
          case "warp":
            type = "script";
            break;
        }

        this.files.push({ offset, type, name });

        value = name;
      }
    } else if (["case", "count"].includes(parameter)) {
      value = `${this.getValue(action)}`;

      if (parameter === "case") {
        if (value === "-1") {
          value = "default";
        }

        this.jumpOffsets.dummies.push({ type: `case_${value}`, offset });
      }
    } else if (parameter === "label") {
      const event = this.events.find((event) => event.offset === offset);

      value = event?.name || `??? (${offset.toHex(8)})`;
    } else if (parameter === "offset") {
      const currentEvent = this.events[this.currentEventIndex];

      if (
        ["jump", "if", "switch"].includes(action.type) ||
        action.subtype === "81_WWW"
      ) {
        this.jumpOffsets.parsing.push(offset);
      }

      if (["if", "switch"].includes(action.type)) {
        this.jumpOffsets.ifSwitch.push({
          actionIndex: currentEvent.actions.length,
          type: action.type,
          offset,
        });
      }

      if (action.type === "if") {
        this.indent += 1;
      } else if (action.type === "switch") {
        this.jumpOffsets.dummies.at(-1)!.offset = offset;
      } else if (action.type === "jump") {
        const last = this.jumpOffsets.ifSwitch.at(-1);

        const event = this.events.find((event) => event.offset === offset);

        if (!last) {
          action.subtype = event?.name || "???";
        } else {
          if (offset === last.offset) {
            action.subtype = "endif";
            action.indent -= 1;
            this.indent -= 1;
          } else {
            if (last.type === "if") {
              if (event) {
                if (event.name === this.currentLabel) {
                  currentEvent.actions[last.actionIndex].subtype = "while";

                  action.subtype = "while";
                  action.indent -= 1;
                  this.indent -= 1;
                } else {
                  action.subtype = event?.name || "???";
                  this.jumpOffsets.dummies.push({
                    type: "end",
                    offset: action.offset,
                  });
                }
              } else {
                action.subtype = "else";
                action.indent -= 1;
                this.jumpOffsets.dummies.push({ type: "end", offset });
              }
            } else {
              action.subtype = "endcase";
              action.indent -= 1;
              this.indent -= 1;
            }
          }
        }

        this.jumpOffsets.ifSwitch.pop();
      }

      value = offset.toHex(8);
    } else if (parameter === "text") {
      const [, text] = this.parseText(offset + 0x10);

      value = text;
    } else {
      value = this.parseVariables(action, parameter === "flag");
    }

    if (parameter === "character") {
      const characters = getResource("characterNames") as Resource;

      value = characters[parseInt(value)];
    } else if (parameter === "cupilFlag") {
      value = this.parseFlag(0xa00 + parseInt(value));
    } else if (parameter === "cupilItem") {
      switch (value) {
        case "0":
          value = "Abirik Cham";
          break;
        case "1":
          value = "Cham";
          break;
        case "2":
          value = "Chom";
          break;
      }
    } else if (parameter === "entity") {
      this.pushEntity(value);
    } else if (parameter === "item") {
      const inventory = getResource("inventories") as Resource;

      value = inventory[parseInt(value)];
    }

    return value;
  }

  public printInstruction(action: Action): string {
    let text = action.type;

    switch (action.type) {
      case "changeEntityParts":
        text = "Change Entity Parts: ";
        break;
      case "changeKmap":
        text = "Change Kmap: ";
        break;
      case "changeParty":
        text = `Change Party: ${action.subtype === "add" ? "Add" : "Remove"} `;
        break;
      case "displayCriminalList":
        text = "Display Criminal List: ";
        break;
      case "displayDiscoveryCount":
        text = "Display Discovery Count";
        break;
      case "dummy":
        if (action.subtype?.match(/^case_/)) {
          const value = action.subtype!.split("_");
          text = `When ${value[1]}: `;
        } else if (action.subtype === "end") {
          text = "End";
        }
        break;
      case "endShipBattle":
        text = "End Ship Battle: ";
        break;
      case "fadeOutBgm":
        text = "Fade-out BGM: ";
        break;
      case "fadeScreen":
        text = "Fade Screen: ";
        switch (action.subtype) {
          case "inBlack":
            text += "In, Black, ";
            break;
          case "outBlack":
            text += "Out, Black, ";
            break;
          case "inWhite":
            text += "In, White, ";
            break;
          case "outWhite":
            text += "Out, White, ";
            break;
        }
        break;
      case "funeWarp":
        text = "Fune Warp: ";
        break;
      case "getCupilItem":
        text = "Get Cupil Item: ";
        break;
      case "if":
        switch (action.subtype) {
          case "while":
            text = "While: ";
            break;
          default:
            text = "If: ";
            break;
        }
        break;
      case "jumpToLabel":
        text = "Jump to Label: ";
        break;
      case "label":
        text = `Label: ${action.subtype}`;
        break;
      case "loadMld":
        text = "Load Model: ";
        break;
      case "loadSound":
        text = "Load Sound: ";
        break;
      case "loadSoundFast":
        text = "Load Sound Fast: ";
        break;
      case "moveEntity":
        text = "Move Entity: ";
        break;
      case "openChoicesBox":
        text = "Choices: ";
        break;
      case "openTreasure":
        text = "Open Treasure: ";
        break;
      case "openTextBox":
        text = "Text: ";
        break;
      case "openGuildScreen":
        text = "Open Guild Screen: ";
        break;
      case "openSaveScreen":
        text = "Open Save Screen";
        break;
      case "openShipBattleMenu":
        text = "Open Ship Battle Menu";
        break;
      case "openShopScreen":
        text = "Open Shop Screen: ";
        break;
      case "playAnimationLoop":
        text = "Play Animation: ";
        break;
      case "playAnimationWait":
        text = "Play Animation: ";
        break;
      case "playBgm":
        text = "Play BGM: ";
        break;
      case "playSe":
        text = "Play SE: ";
        break;
      case "printDebugText":
        text = "Debug Text: ";
        break;
      case "resetFog":
        text = "Reset Fog";
        break;
      case "resetShadow":
        text = "Reset Shadow: ";
        break;
      case "restorePartyHp":
        text = "Restore Party HP";
        break;
      case "restorePartyMp":
        text = "Restore Party MP";
        break;
      case "restoreShipPosition":
        text = "Restore Ship Position";
        break;
      case "restoreShipHp":
        text = "Restore Ship HP";
        break;
      case "return":
        text = "Return";
        break;
      case "setCamera":
        text = "Set Camera: ";
        break;
      case "setEntityScale":
        text = "Set Entity Scale: ";
        break;
      case "setFace":
        text = "Set Face: ";
        break;
      case "setFog":
        text = "Set Fog: ";
        break;
      case "setLight":
        text = `Set ${capitalize(action.subtype || "???")} Light: `;
        break;
      case "setPlayer":
        text = "Set Player: ";
        break;
      case "setPlayerPosition":
        text = "Set Player Position: ";
        break;
      case "setShip":
        text = "Set Ship: ";
        break;
      case "setVibration":
        text = "Set Vibration: ";
        break;
      case "setVisibility":
        text = `Set Visibility: ${action.subtype === "hide" ? "Hide" : "Show"}, `;
        break;
      case "startConversation":
        text = "Start Conversation: ";
        break;
      case "startEventBattle":
        text = "Start Event Battle: ";
        break;
      case "startShipBattle":
        text = "Start Ship Battle: ";
        break;
      case "stopSnd":
        text = "Stop SND (BGM + SE?)";
        break;
      case "switch":
        text = "Switch: ";
        break;
      case "unknown":
        const subtype = action.subtype!.split("_");
        text = `Unknown 0x${subtype[0]} (${subtype[1] || "???"})${action.parameters.length > 0 ? ": " : ""}`;
        break;
      case "unloadMld":
        text = "Unload Model: ";
        break;
      case "updateEntityTable":
        text = `Entity Table: ${action.subtype === "add" ? "Add" : "Remove"} `;
        break;
      case "updateEventValue":
        text = "Update Event: ";
        break;
      case "updateSpecialValue":
        text = "Update Special: ";
        break;
      case "updateFlag":
        text = "Update Flag: ";
        break;
      case "updateInventory":
        text = "Update Inventory: ";
        break;
      case "wait":
        text = "Wait: ";
        break;
      case "waitForKey":
        text = "Wait for Key: ";
        break;
      case "waitThenLoadMld":
        text = "Wait for others to finish then Load Model: ";
        break;
      case "waitThenLoadSound":
        text = "Wait for Load Sound Fast to finish: ";
        break;
      case "warp":
        text = "Warp: ";
        break;
      case "warpToTitleScreen":
        text = "Warp to Title Screen";
        break;
      case "warpToWorldMap":
        text = "Warp to World Map: ";
        break;
    }

    if (action.parameters.length > 0) {
      action.parameters.forEach((parameter, index) => {
        text += this.printInstructionParameter(action, parameter, index);
      });
    }

    switch (action.type) {
      case "jump":
        switch (action.subtype) {
          case "else":
            text = "Else";
            break;
          case "endcase":
          case "endif":
          case "while":
            text = "End";
            break;
          default:
            text = `Jump to ${action.subtype}`;
        }
        break;
      case "playAnimationLoop":
        text += " <span style='color: grey;'>(Loop)</span>";
        break;
      case "playAnimationWait":
        text += " <span style='color: grey;'>(Wait)</span>";
        break;
      case "setFog":
        if (action.subtype === "new") {
          text += " <span style='color: grey;'>(New)</span>";
        }
        break;
    }

    return text;
  }

  private printInstructionParameter(
    action: Action,
    parameter: ActionParameter & {
      subParameters: ActionParameter[][];
    },
    index: number,
  ): string {
    let text = "";

    const isExcluded =
      (action.type === "if" && parameter.type === "offset") ||
      (action.type === "switch" && parameter.type !== "variable");
    const isComaExcluded =
      isExcluded ||
      action.type === "openChoicesBox" ||
      action.type === "openTextBox" ||
      (action.type === "setCamera" && parameter.type === "isAnimated");

    if (!isComaExcluded && index > 0) {
      text += ", ";
    }

    if (!isExcluded) {
      // Before

      switch (parameter.type) {
        case "colorRed":
          text += "(";
          break;
        case "positionX":
        case "scaleX":
        case "targetX":
          text += "(";
          break;
        case "text":
          text += `<p style="margin-left: 12px; color: green;">`;
          break;
      }

      // Value

      if (parameter.value === "7f7fffff") {
        text += "[unchanged]";
      } else if (parameter.type === "boolean") {
        text += parameter.value === "1" ? "On" : "Off";
      } else if (parameter.type === "count") {
        parameter.subParameters.forEach((block, index) => {
          if (parameter.subParameters.length > 1 && block.length > 1) {
            text += "\n:<span style='margin-left: 12px;'>";
          } else if (index > 0) {
            text += ", ";
          }

          block.forEach((parameter, index) => {
            text += this.printInstructionParameter(action, parameter, index);
          });

          if (parameter.subParameters.length > 1 && block.length > 1) {
            text += "</span>";
          }
        });
      } else if (parameter.type === "dialogAction") {
        if (parameter.value !== "7fffffff") {
          text +=
            "<span style='margin-left: 12px; color: grey;'>(Close)</span>";
        }
      } else if (
        action.type === "setCamera" &&
        parameter.type === "isAnimated"
      ) {
        let subtype = "";

        switch (action.subtype) {
          case "position":
            subtype = "Position";
            break;
          case "positionAndTarget":
            subtype = "Position and Target";
            break;
          case "targetEntity":
            subtype = "Target Entity";
            break;
          case "zoom":
            subtype = "Zoom";
            break;
          case "zoom_animate":
            subtype = "Zoom, Animate";
            break;
        }

        text += ` <span style="color: grey;">(${subtype}${parameter.value === "1" ? ", Animated" : ""})</span>`;
      } else if (
        parameter.type === "flag" &&
        parameter.value.match(/\((.*?)\)/)
      ) {
        text += `[${parameter.value.match(/\((.*?)\)/)![1]}]`;
      } else if (parameter.type === "text") {
        text += parameter.value
          .replace(/\\h\(«/, "«") // Europe
          .replace(/\\h\(s/, "«") // USA
          .replace(/\\h\(《/, "《") // Japan
          .replace(/»\)/, "»\n") // Europe
          .replace(/t\)/, "»\n") // USA
          .replace(/》\)/, "》\n") // Japan
          .replace(/c/g, "…") // USA
          .replace(/\[/g, "“")
          .replace(/\]/g, "”")
          .replace(/\\n/g, "\n ")
          .replace(/\\c/, "") // Europe
          .replace(/\\e/, ""); // USA / Japan
      } else {
        text += parameter.value;
      }

      // After

      if (
        action.type === "changeParty" &&
        action.subtype === "removeEquipmentIncluded"
      ) {
        text += " <span style='color: grey;'>(Equipment Included)</span>";
      }

      switch (parameter.type) {
        case "colorBlue":
          text += ")";
        case "face":
          text +=
            action.subtype === "normal"
              ? " <span style='color: grey;'>(Normal)</span>"
              : "";
          break;
        case "flag":
          text += ` = ${action.subtype === "set" ? "On" : "Off"}`;
          break;
        case "frames":
          text += " frame(s)";
          break;
        case "item":
          text += ` ${action.subtype === "add" ? "+ 1" : "- 1"}`;
          break;
        case "positionZ":
        case "scaleZ":
        case "targetZ":
          text += ")";
          break;
        case "rotation":
          if (parameter.value !== "7f7fffff") {
            text += "°";
          }
          break;
        case "text":
          text += "</p>";
          break;
      }
    }

    return text;
  }

  private getValue(action: Action, increment = true): number {
    const value = getInt(action.offset, "int32", { bigEndian: true }, this.dataView); // prettier-ignore

    if (increment) {
      action.offset += 0x4;
      action.length += 1;
    }

    return value;
  }

  private parse40000000Value(value: number): string {
    let text = `40000000x${value.toHex(2)}`;

    switch (value) {
      case 0x40:
        text = "Ship Position X";
        break;
      case 0x41:
        text = "Ship Position Y";
        break;
      case 0x42:
        text = "Ship Position Z";
        break;
      case 0x43:
        text = "Ship Rotation";
        break;
    }

    return `(${text})`;
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
      text += " (No Random Encounter)";
    } else if (offset === 0x84 && bit === 7) {
      text += " (Lock Player)";
    } else if (offset === 0x8b && bit === 6) {
      text += " (Hide Mini-map)";
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
      case 0x9:
        text = "Choice";
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
      case 0x21:
        text = "Message";
        break;
      case 0x22:
        text = "Camera";
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
        texts.push(`${this.parse40000000Value(variable.value)}`);
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

  private parseText(offset: number): [number, string] {
    const $gameRegion = get(gameRegion);

    const savedOffset = offset;

    let text = "";

    while (true) {
      if ($gameRegion === 2) {
        const code8 = getInt(offset, "uint8", {}, this.dataView);
        const code16 = getInt(offset, "uint16", { bigEndian: true }, this.dataView); // prettier-ignore

        if (code8 >= 0x81) {
          text += decodeWindows31J(code16);
          offset += 0x1;
        } else if (code8 === 0x0) {
          break;
        } else {
          text += decodeWindows31J(code8);
        }

        offset += 0x1;
      } else {
        let int = getInt(offset, "uint8", {}, this.dataView);

        if (int === 0x7f) {
          int = 0x20;
        } else if (int === 0x85) {
          int = 0x2026;
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

  private pushEntity(entity: string, mainEventIndex = -1): void {
    const entityId = entity === "[Player]" ? 0xffff : parseInt(entity);

    if (!this.entities[entityId]) {
      this.entities[entityId] = {
        main: -1,
        related: [],
      };
    }

    if (mainEventIndex !== -1) {
      this.entities[entityId].main = mainEventIndex;
    } else if (
      !this.entities[entityId].related.includes(this.currentEventIndex)
    ) {
      this.entities[entityId].related.push(this.currentEventIndex);
    }
  }

  public getEntityEvents(entityId: number): EntityEvents | undefined {
    return this.entities[entityId];
  }

  public getEvents(): ScriptEvent[] {
    return this.events;
  }

  public expandEvent(index: number): ScriptEvent[] {
    this.events[index].expanded = !this.events[index].expanded;

    return this.getEvents();
  }

  public expandAction(eventIndex: number, actionIndex: number): ScriptEvent[] {
    this.events[eventIndex].actions[actionIndex].expanded =
      !this.events[eventIndex].actions[actionIndex].expanded;

    return this.getEvents();
  }
}
