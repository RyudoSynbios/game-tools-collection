import type { ItemInt, ItemTab } from "$lib/types";

import { regex } from "../template";

export function recordFragment(
  name: string,
  offset: number,
  hasWins = false,
): ItemTab {
  return {
    name,
    flex: true,
    items: [
      {
        length: 0x10,
        type: "container",
        instanceType: "section",
        instances: 20,
        enumeration: "%o Place",
        flex: true,
        items: [
          {
            id: "character",
            name: "Character",
            dataViewAltKey: "save",
            offset,
            type: "variable",
            dataType: "uint8",
            resource: "characters",
            autocomplete: true,
          },
          {
            name: "Costume",
            dataViewAltKey: "save",
            offset: offset + 0x1,
            type: "variable",
            dataType: "uint8",
            hidden: true,
          },
          ...(hasWins
            ? [
                {
                  name: "Wins",
                  dataViewAltKey: "save",
                  offset: offset + 0x140,
                  type: "variable",
                  dataType: "uint32",
                  max: 999,
                  overrideShift: {
                    parent: 1,
                    shift: 0x4,
                  },
                } as ItemInt,
              ]
            : []),
          {
            name: "Clear Time",
            type: "group",
            mode: "chrono",
            items: [
              {
                dataViewAltKey: "save",
                offset: offset + 0xd,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                dataViewAltKey: "save",
                offset: offset + 0xe,
                type: "variable",
                dataType: "uint8",
                leadingZeros: 1,
                max: 59,
              },
              {
                dataViewAltKey: "save",
                offset: offset + 0xf,
                type: "variable",
                dataType: "uint8",
                leadingZeros: 1,
                max: 99,
              },
            ],
          },
          {
            id: "playerName",
            name: "Player Name",
            dataViewAltKey: "save",
            offset: offset + 0x2,
            length: 0xa,
            type: "variable",
            dataType: "string",
            letterDataType: "uint8",
            fallback: 0x20,
            endCode: 0x0,
            regex,
          },
        ],
      },
    ],
  };
}

export function teamRecordFragment(name: string, offset: number): ItemTab {
  return {
    name,
    flex: true,
    items: [
      {
        length: 0x14,
        type: "container",
        instanceType: "section",
        instances: 20,
        enumeration: "%o Place",
        flex: true,
        items: [
          {
            id: "character",
            name: "Character 1",
            dataViewAltKey: "save",
            offset,
            type: "variable",
            dataType: "uint8",
            resource: "teamCharacters",
            autocomplete: true,
          },
          {
            name: "Character 2",
            dataViewAltKey: "save",
            offset: offset + 0x1,
            type: "variable",
            dataType: "uint8",
            resource: "teamCharacters",
            autocomplete: true,
          },
          {
            name: "Character 3",
            dataViewAltKey: "save",
            offset: offset + 0x2,
            type: "variable",
            dataType: "uint8",
            resource: "teamCharacters",
            autocomplete: true,
          },
          {
            name: "Costume 1",
            dataViewAltKey: "save",
            offset: offset + 0x3,
            type: "variable",
            dataType: "uint8",
            hidden: true,
          },
          {
            name: "Costume 2",
            dataViewAltKey: "save",
            offset: offset + 0x4,
            type: "variable",
            dataType: "uint8",
            hidden: true,
          },
          {
            name: "Costume 3",
            dataViewAltKey: "save",
            offset: offset + 0x5,
            type: "variable",
            dataType: "uint8",
            hidden: true,
          },
          {
            name: "Clear Time",
            type: "group",
            mode: "chrono",
            items: [
              {
                dataViewAltKey: "save",
                offset: offset + 0x11,
                type: "variable",
                dataType: "uint8",
                max: 99,
              },
              {
                dataViewAltKey: "save",
                offset: offset + 0x12,
                type: "variable",
                dataType: "uint8",
                leadingZeros: 1,
                max: 59,
              },
              {
                dataViewAltKey: "save",
                offset: offset + 0x13,
                type: "variable",
                dataType: "uint8",
                leadingZeros: 1,
                max: 99,
              },
            ],
          },
          {
            id: "playerName",
            name: "Player Name",
            dataViewAltKey: "save",
            offset: offset + 0x6,
            length: 0xa,
            type: "variable",
            dataType: "string",
            letterDataType: "uint8",
            fallback: 0x20,
            endCode: 0x0,
            regex,
          },
        ],
      },
    ],
  };
}
