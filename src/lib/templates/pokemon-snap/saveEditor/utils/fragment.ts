import type { ItemTab, ItemTabs } from "$lib/types";

export function photoFragment(type: "pokemon" | "sign" | "album"): ItemTabs {
  let baseOffset = 0x0;

  if (type === "sign") {
    baseOffset = 0xe460;
  } else if (type === "album") {
    baseOffset = 0x108a0;
  }

  return {
    type: "tabs",
    vertical: true,
    items: [
      {
        name: "General",
        items: [
          {
            type: "section",
            flex: true,
            items: [
              {
                id: `photoStatus-${type}-%index%`,
                name: "Status",
                offset: baseOffset + 0x184,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
                resource: "photoStatus",
                disabled: type === "album",
              },
              type === "pokemon"
                ? {
                    name: "Score",
                    offset: 0x6c,
                    type: "variable",
                    dataType: "uint32",
                    bigEndian: true,
                    max: 99999,
                    overrideShift: {
                      parent: 1,
                      shift: 0x4,
                    },
                  }
                : {},
              {
                name: "Course",
                offset: baseOffset + 0x180,
                type: "variable",
                dataType: "uint8",
                resource: "photoCourses",
                disabled: true,
              },
              type === "album"
                ? {
                    id: "comment",
                    name: "Comment",
                    offset: baseOffset + 0x520,
                    length: 0x3e,
                    type: "variable",
                    dataType: "string",
                    letterDataType: "uint16",
                    letterBigEndian: true,
                    endCode: 0x0,
                    resource: "letters",
                    size: "lg",
                  }
                : {},
            ],
          },
          {
            type: "section",
            flex: true,
            hidden: true,
            items: [
              {
                name: "Unknown",
                offset: baseOffset + 0x182,
                type: "variable",
                dataType: "uint16",
                bigEndian: true,
                hidden: true,
              },
              {
                name: "Terrain Position?",
                offset: baseOffset + 0x181,
                type: "variable",
                dataType: "uint8",
                hidden: true,
              },
              {
                name: "Terrain Animation?",
                offset: baseOffset + 0x184,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
                hidden: true,
              },
            ],
          },
          {
            name: "Camera",
            type: "section",
            flex: true,
            noMargin: true,
            items: [
              {
                name: "Position X",
                offset: baseOffset + 0x188,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
              {
                name: "Position Y",
                offset: baseOffset + 0x18c,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
              {
                name: "Position Z",
                offset: baseOffset + 0x190,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
            ],
          },
          {
            type: "section",
            flex: true,
            items: [
              {
                name: "Rotation X",
                offset: baseOffset + 0x194,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
              {
                name: "Rotation Y",
                offset: baseOffset + 0x198,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
              {
                name: "Rotation Z",
                offset: baseOffset + 0x19c,
                type: "variable",
                dataType: "float32",
                bigEndian: true,
                step: 0.1,
              },
            ],
          },
        ],
      } as ItemTab,
      ...[...Array(12).keys()].map((index) => {
        const offset = baseOffset + 0x1a0 + index * 0x18;

        return {
          name: `Actor ${index + 1}`,
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Actor",
                  offset: offset,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hex: true,
                  disabled: true,
                },
                {
                  name: "Animation Track",
                  offset: offset + 0x4,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  min: 0,
                  step: 0.1,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Position X",
                  offset: offset + 0x8,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
                {
                  name: "Position Y",
                  offset: offset + 0xc,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
                {
                  name: "Position Z",
                  offset: offset + 0x10,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Orientation",
                  offset: offset + 0x14,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
              ],
            },
          ],
        } as ItemTab;
      }),
      ...[...Array(6).keys()].map((index) => {
        const offset = baseOffset + 0x2c0 + index * 0x10;

        return {
          name: `Sprite ${index + 1}`,
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Sprite",
                  offset: offset,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hex: true,
                  disabled: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Position X",
                  offset: offset + 0x4,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
                {
                  name: "Position Y",
                  offset: offset + 0x8,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
                {
                  name: "Position Z",
                  offset: offset + 0xc,
                  type: "variable",
                  dataType: "float32",
                  bigEndian: true,
                  step: 0.1,
                },
              ],
            },
          ],
        } as ItemTab;
      }),
      ...[...Array(32).keys()].map((index) => {
        const offset = baseOffset + 0x320 + index * 0x10;

        return {
          name: `??? ${index + 1}`,
          hidden: true,
          items: [
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unknown 1",
                  offset: offset + 0x2,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  hidden: true,
                },
                {
                  name: "Unknown 2",
                  offset: offset,
                  type: "variable",
                  dataType: "uint16",
                  bigEndian: true,
                  hidden: true,
                },
              ],
            },
            {
              type: "section",
              flex: true,
              items: [
                {
                  name: "Unknown 3",
                  offset: offset + 0x4,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                },
                {
                  name: "Unknown 4",
                  offset: offset + 0x8,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                },
                {
                  name: "Unknown 5",
                  offset: offset + 0xc,
                  type: "variable",
                  dataType: "uint32",
                  bigEndian: true,
                  hidden: true,
                },
              ],
            },
          ],
        } as ItemTab;
      }),
    ],
  };
}
