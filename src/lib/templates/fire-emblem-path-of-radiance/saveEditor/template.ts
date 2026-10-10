import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    platforms: {
      gamecube: {
        europe: { 0x0: [0x47, 0x46, 0x45, 0x50, 0x30, 0x31] }, // "GFEP01"
        usa: { 0x0: [0x47, 0x46, 0x45, 0x45, 0x30, 0x31] }, // "GFEE01"
        japan: { 0x0: [0x47, 0x46, 0x45, 0x4a, 0x30, 0x31] }, // "GFEJ01"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      id: "slots",
      length: 0x4000,
      type: "container",
      instanceType: "tabs",
      instances: 5,
      enumeration: "Slot %d",
      items: [
        {
          type: "section",
          flex: true,
          hidden: true,
          items: [
            {
              name: "Checksum FE8X",
              offset: 0x2090,
              type: "checksum",
              dataType: "uint32",
              bigEndian: true,
              control: {
                offsetStart: 0x2080,
                offsetEnd: 0x20b0,
              },
            },
          ],
        },
        {
          type: "tabs",
          items: [
            {
              name: "General",
              items: [
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Filename",
                      offset: 0x2040,
                      length: 0x20,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      size: "lg",
                      hidden: true,
                    },
                    {
                      name: "FE8X",
                      offset: 0x2080,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                    {
                      name: "SYSF",
                      offset: 0x20b0,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                    {
                      name: "BMST",
                      offset: 0x20f8,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                    {
                      name: "MDST",
                      offset: 0x2310,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                    {
                      name: "UNIP",
                      offset: 0x2334,
                      length: 0x4,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Slot",
                      offset: 0x20a2,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Save Count",
                      offset: 0x208b,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Chapter?",
                      offset: 0x20a4,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Map?",
                      offset: 0x22f0,
                      length: 0x6,
                      type: "variable",
                      dataType: "string",
                      letterDataType: "uint8",
                      fallback: 0x20,
                      hidden: true,
                    },
                    {
                      name: "Level Up", // Random / Fraction
                      offset: 0x219b,
                      type: "variable",
                      dataType: "bit",
                      bit: 7,
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  hidden: true,
                  items: [
                    {
                      name: "Playthrough 2",
                      offset: 0x20c2,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                    {
                      name: "Playthrough 31",
                      offset: 0x20df,
                      type: "variable",
                      dataType: "uint8",
                      hidden: true,
                    },
                  ],
                },
                {
                  type: "section",
                  flex: true,
                  items: [
                    {
                      name: "Difficulty",
                      offset: 0x20a6,
                      type: "variable",
                      dataType: "uint8",
                      resource: "difficulties",
                    },
                    {
                      name: "Event Points",
                      offset: 0x2118,
                      type: "variable",
                      dataType: "int32",
                      bigEndian: true,
                      hidden: true,
                      // min: 0,
                      // max: 0,
                    },
                    {
                      name: "Funds",
                      offset: 0x2114,
                      type: "variable",
                      dataType: "uint32",
                      bigEndian: true,
                      max: 9999999,
                    },
                    {
                      name: "Turns",
                      offset: 0x210e,
                      type: "variable",
                      dataType: "int16",
                      bigEndian: true,
                      hidden: true,
                      // min: 0,
                      // max: 0,
                    },
                  ],
                },
              ],
            },
            {
              name: "Party",
              items: [
                {
                  length: 0x8f,
                  type: "container",
                  instanceType: "tabs",
                  instances: 50,
                  enumeration: "Character %d",
                  vertical: true,
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        { name: "0x2338", offset: 0x2338, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "Character?", offset: 0x2339, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x233a", offset: 0x233a, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "Class", offset: 0x233b, type: "variable", dataType: "uint8" }, // prettier-ignore
                        { name: "0x233c", offset: 0x233c, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x233d", offset: 0x233d, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x233e", offset: 0x233e, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x233f", offset: 0x233f, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2340", offset: 0x2340, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        {
                          name: "Level",
                          offset: 0x2341,
                          type: "variable",
                          dataType: "uint8",
                          min: 1,
                          max: 20,
                        },
                        {
                          name: "Experience",
                          offset: 0x2342,
                          type: "variable",
                          dataType: "uint8",
                          max: 99,
                        },
                        { name: "0x2343", offset: 0x2343, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2344", offset: 0x2344, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2345", offset: 0x2345, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2346", offset: 0x2346, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2347", offset: 0x2347, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2348", offset: 0x2348, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2349", offset: 0x2349, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x234a", offset: 0x234a, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x234b", offset: 0x234b, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x234c", offset: 0x234c, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x234d", offset: 0x234d, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x234e", offset: 0x234e, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        {
                          name: "HP", // TODO: Really used?
                          offset: 0x234f,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                          hidden: true,
                        },
                        {
                          name: "Bonus Constitution",
                          offset: 0x2350,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Move",
                          offset: 0x2351,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus HP",
                          offset: 0x2352,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Strength",
                          offset: 0x2353,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Magic",
                          offset: 0x2354,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Skill",
                          offset: 0x2355,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Soeed",
                          offset: 0x2356,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Luck",
                          offset: 0x2357,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Defense",
                          offset: 0x2358,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        {
                          name: "Bonus Resistance",
                          offset: 0x2359,
                          type: "variable",
                          dataType: "uint8",
                          // max:
                        },
                        { name: "0x235a", offset: 0x235a, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x235b", offset: 0x235b, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x235c", offset: 0x235c, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x235d", offset: 0x235d, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x235e", offset: 0x235e, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x235f", offset: 0x235f, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2360", offset: 0x2360, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2361", offset: 0x2361, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2362", offset: 0x2362, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2363", offset: 0x2363, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2364", offset: 0x2364, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2365", offset: 0x2365, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2366", offset: 0x2366, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2367", offset: 0x2367, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2368", offset: 0x2368, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2369", offset: 0x2369, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236a", offset: 0x236a, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236b", offset: 0x236b, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236c", offset: 0x236c, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236d", offset: 0x236d, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236e", offset: 0x236e, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x236f", offset: 0x236f, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2370", offset: 0x2370, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x2371", offset: 0x2371, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x2372,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Weapon 1",
                              offset: 0x2373,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Resistance",
                              offset: 0x2374,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2375,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x2376,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Weapon 2",
                              offset: 0x2377,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Resistance",
                              offset: 0x2378,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2379,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x237a,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Weapon 3",
                              offset: 0x237b,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Resistance",
                              offset: 0x237c,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x237d,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x237e,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Weapon 4",
                              offset: 0x237f,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Resistance",
                              offset: 0x2380,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2381,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x2382,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Item 1",
                              offset: 0x2383,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Quantity",
                              offset: 0x2384,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2385,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x2386,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Item 2",
                              offset: 0x2387,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Quantity",
                              offset: 0x2388,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2389,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x238a,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Item 3",
                              offset: 0x238b,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Quantity",
                              offset: 0x238c,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x238d,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "???",
                              offset: 0x238e,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                            {
                              name: "Item 4",
                              offset: 0x238f,
                              type: "variable",
                              dataType: "uint8",
                            },
                            {
                              name: "Quantity",
                              offset: 0x2390,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Flags",
                              offset: 0x2391,
                              type: "variable",
                              dataType: "uint8",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          name: "Weapon Level",
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Sword Experience",
                              offset: 0x2392,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Lance Experience",
                              offset: 0x2393,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Axe Experience",
                              offset: 0x2394,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Bow Experience",
                              offset: 0x2395,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                              hidden: true,
                            },
                            {
                              name: "Fire Experience",
                              offset: 0x2396,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Thunder Experience",
                              offset: 0x2397,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                            },
                            {
                              name: "Wind Experience",
                              offset: 0x2398,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                              hidden: true,
                            },
                            {
                              name: "Staff Experience",
                              offset: 0x2399,
                              type: "variable",
                              dataType: "uint8",
                              // max:
                              hidden: true,
                            },
                          ],
                        },
                        { name: "0x239a", offset: 0x239a, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x239b", offset: 0x239b, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x239c", offset: 0x239c, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x239d", offset: 0x239d, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x239e", offset: 0x239e, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x239f", offset: 0x239f, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a0", offset: 0x23a0, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a1", offset: 0x23a1, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a2", offset: 0x23a2, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a3", offset: 0x23a3, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a4", offset: 0x23a4, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a5", offset: 0x23a5, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a6", offset: 0x23a6, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a7", offset: 0x23a7, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a8", offset: 0x23a8, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23a9", offset: 0x23a9, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23aa", offset: 0x23aa, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23ab", offset: 0x23ab, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23ac", offset: 0x23ac, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23ad", offset: 0x23ad, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23ae", offset: 0x23ae, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23af", offset: 0x23af, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b0", offset: 0x23b0, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b1", offset: 0x23b1, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b2", offset: 0x23b2, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b3", offset: 0x23b3, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b4", offset: 0x23b4, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b5", offset: 0x23b5, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b6", offset: 0x23b6, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b7", offset: 0x23b7, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b8", offset: 0x23b8, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23b9", offset: 0x23b9, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23ba", offset: 0x23ba, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23bb", offset: 0x23bb, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23bc", offset: 0x23bc, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23bd", offset: 0x23bd, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23be", offset: 0x23be, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23bf", offset: 0x23bf, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c0", offset: 0x23c0, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c1", offset: 0x23c1, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c2", offset: 0x23c2, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c3", offset: 0x23c3, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c4", offset: 0x23c4, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c5", offset: 0x23c5, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                        { name: "0x23c6", offset: 0x23c6, type: "variable", dataType: "uint8", hidden: true }, // prettier-ignore
                      ],
                    },
                  ],
                },
              ],
            },
            { name: "Convoy", items: [] },
          ],
        },
      ],
    },
  ],
  resources: {
    difficulties: {
      0x0: "Normal",
      0x1: "Difficult",
      0x2: "Maniac",
      0x3: "Easy",
    },
  },
  resourcesOrder: {
    difficulties: [0x3, 0x0, 0x1, 0x2],
  },
};

export default template;
