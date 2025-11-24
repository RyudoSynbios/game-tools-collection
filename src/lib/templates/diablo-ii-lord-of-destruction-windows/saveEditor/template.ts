import type { GameJson } from "$lib/types";

import { getItemLength } from "./utils/compression";

const template: GameJson = {
  validator: {
    regions: {
      world: {
        $and: [
          { 0x0: [0x55, 0xaa, 0x55, 0xaa] },
          { 0x4: [0x60] },
          { 0x14f: [0x57] },
        ],
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    hint: "Only works with Diablo II: Lord of Destruction v1.10 or above (.d2s files).",
    error: "Not a valid save file.",
  },
  items: [
    {
      name: "Checksum",
      offset: 0xc,
      type: "checksum",
      dataType: "uint32",
      control: {
        offsetStart: 0x0,
        offsetEnd: 0x0,
      },
    },
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Save Size",
              offset: 0x8,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              name: "Timestamp",
              offset: 0x30,
              type: "variable",
              dataType: "uint32",
              hidden: true,
            },
            {
              name: "Character",
              type: "bitflags",
              flags: [
                { offset: 0x24, bit: 0, label: "???", hidden: true },
                { offset: 0x24, bit: 1, label: "???", hidden: true },
                { offset: 0x24, bit: 2, label: "Harcore" },
                { offset: 0x24, bit: 3, label: "???", hidden: true },
                { offset: 0x24, bit: 4, label: "Has been dead once" },
                { offset: 0x24, bit: 5, label: "Expansion Character", disabled: true },
                { offset: 0x24, bit: 6, label: "???", hidden: true },
                { offset: 0x24, bit: 7, label: "???", hidden: true },
              ],
            },
            {
              name: "Progression",
              offset: 0x25,
              type: "variable",
              dataType: "uint8",
              resource: "progressions",
              size: "lg",
              autocomplete: true,
            },
            {
              id: "gold",
              name: "Gold",
              dataViewAltKey: "heroStats",
              offset: 0x38,
              type: "variable",
              dataType: "uint32",
              max: 990000,
            },
            {
              name: "Gold in Stash",
              dataViewAltKey: "heroStats",
              offset: 0x3c,
              type: "variable",
              dataType: "uint32",
              max: 2500000,
            },
          ],
        },
        {
          name: "Hero",
          items: [
            {
              type: "tabs",
              items: [
                {
                  name: "Status",
                  items: [
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Name",
                          offset: 0x14,
                          length: 0xf,
                          type: "variable",
                          dataType: "string",
                          letterDataType: "uint8",
                          endCode: 0x0,
                          regex: "[A-Za-z]",
                          test: true,
                        },
                        {
                          id: "class",
                          name: "Class",
                          offset: 0x28,
                          type: "variable",
                          dataType: "uint8",
                          resource: "classes",
                          disabled: true,
                        },
                        {
                          id: "level",
                          name: "Level",
                          dataViewAltKey: "heroStats",
                          offset: 0x30,
                          type: "variable",
                          dataType: "uint32",
                          min: 1,
                          max: 99,
                          test: true,
                        },
                        {
                          name: "Level (Save Preview)",
                          offset: 0x2b,
                          type: "variable",
                          dataType: "uint8",
                          hidden: true,
                        },
                        {
                          name: "Experience",
                          dataViewAltKey: "heroStats",
                          offset: 0x34,
                          type: "variable",
                          dataType: "uint32",
                          max: 3520485254,
                        },
                        {
                          name: "Stat Points Remaining",
                          dataViewAltKey: "heroStats",
                          offset: 0x10,
                          type: "variable",
                          dataType: "uint32",
                          max: 1023,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Strength",
                          dataViewAltKey: "heroStats",
                          offset: 0x0,
                          type: "variable",
                          dataType: "uint32",
                          max: 1023,
                        },
                        {
                          name: "Dexterity",
                          dataViewAltKey: "heroStats",
                          offset: 0x8,
                          type: "variable",
                          dataType: "uint32",
                          max: 1023,
                        },
                        {
                          name: "Vitality",
                          dataViewAltKey: "heroStats",
                          offset: 0xc,
                          type: "variable",
                          dataType: "uint32",
                          max: 1023,
                        },
                        {
                          name: "Energy",
                          dataViewAltKey: "heroStats",
                          offset: 0x4,
                          type: "variable",
                          dataType: "uint32",
                          max: 1023,
                        },
                      ],
                    },
                    {
                      type: "section",
                      flex: true,
                      items: [
                        {
                          name: "Life",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                          ],
                        },
                        {
                          name: "Mana",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x20,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x24,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                          ],
                        },
                        {
                          name: "Stamina",
                          type: "group",
                          mode: "fraction",
                          items: [
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x28,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                            {
                              dataViewAltKey: "heroStats",
                              offset: 0x2c,
                              type: "variable",
                              dataType: "uint32",
                              max: 8191,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Skills",
                  items: [
                    {
                      type: "tabs",
                      vertical: true,
                      items: [
                        {
                          name: "General",
                          items: [
                            {
                              name: "Skill Choices Remaining",
                              dataViewAltKey: "heroStats",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint32",
                              max: 255,
                            },
                          ],
                        },
                        // Amazon
                        {
                          id: "skill-0",
                          name: "Javelin and Spear Skills",
                          flex: true,
                          items: [
                            {
                              name: "Jab",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Power Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Poison Javelin",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Impale",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning Bolt",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Charged Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Plague Javelin",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fend",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning Fury",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-0",
                          name: "Passive and Magic Skills",
                          flex: true,
                          items: [
                            {
                              name: "Inner Sight",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Critical Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dodge",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Slow Missiles",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Avoid",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Penetrate",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Decoy",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Evade",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Valkyrie",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Pierce",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-0",
                          name: "Bow and Crossbow Skills",
                          flex: true,
                          items: [
                            {
                              name: "Magic Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cold Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Multiple Shot",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Exploding Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Ice Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Guided Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Strafe",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Immolation Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Freezing Arrow",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Sorceress
                        {
                          id: "skill-1",
                          name: "Cold Spells",
                          flex: true,
                          items: [
                            {
                              name: "Ice Bolt",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Frozen Armor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Frost Nova",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Ice Blast",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shiver Armor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Glacial Spike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blizzard",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Chilling Armor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Frozen Orb",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cold Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-1",
                          name: "Lightning Spells",
                          flex: true,
                          items: [
                            {
                              name: "Charged Bolt",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Static Field",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Telekinesis",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Nova",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Chain Lightning",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Teleport",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Thunder Storm",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Energy Shield",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-1",
                          name: "Fire Spells",
                          flex: true,
                          items: [
                            {
                              name: "Fire Bolt",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Warmth",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Inferno",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blaze",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Ball",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Wall",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Enchant",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Meteor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Hydra",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Necromancer
                        {
                          id: "skill-2",
                          name: "Summoning Spells",
                          flex: true,
                          items: [
                            {
                              name: "Skeleton Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Raise Skeleton",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Clay Golem",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Golem Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Raise Skeletal Mage",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blood Golem",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Summon Resist",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Iron Golem",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Golem",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Revive",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-2",
                          name: "Poison and Bone Spells",
                          flex: true,
                          items: [
                            {
                              name: "Teeth",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Bone Armor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Poison Dagger",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Corpse Explosion",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Bone Wall",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Poison Explosion",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Bone Spear",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Bone Prison",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Poison Nova",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Bone Spirit",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-2",
                          name: "Curses",
                          flex: true,
                          items: [
                            {
                              name: "Amplify Damage",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dim Vision",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Weaken",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Iron Maiden",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Terror",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Confuse",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Life Tap",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Attract",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Decrepify",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lower Resist",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Paladin
                        {
                          id: "skill-3",
                          name: "Defensive Auras",
                          flex: true,
                          items: [
                            {
                              name: "Prayer",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Resist Fire",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Defiance",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Resist Cold",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cleansing",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Resist Lightning",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Vigor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Meditation",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Redemption",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Salvation",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-3",
                          name: "Offensive Auras",
                          flex: true,
                          items: [
                            {
                              name: "Might",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Holy Fire",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Thorns",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blessed Aim",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Concentration",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Holy Freeze",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Holy Shock",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Sanctuary",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fanaticism",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Conviction",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-3",
                          name: "Combat Skills",
                          flex: true,
                          items: [
                            {
                              name: "Sacrifice",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Smite",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Holy Bolt",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Zeal",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Charge",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Vengeance",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blessed Hammer",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Conversion",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Holy Shield",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fist of the Heavens",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Barbarian
                        {
                          id: "skill-4",
                          name: "Warcries",
                          flex: true,
                          items: [
                            {
                              name: "Howl",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Find Potion",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Taunt",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shout",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Find Item",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Battle Cry",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Battle Orders",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Grim Ward",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "War Cry",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Battle Command",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-4",
                          name: "Combat Masteries",
                          flex: true,
                          items: [
                            {
                              name: "Sword Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Axe Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Mace Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Pole Arm Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Throwing Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Spear Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Increased Stamina",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Iron Skin",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Increased Speed",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Natural Resistance",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-4",
                          name: "Combat Skills",
                          flex: true,
                          items: [
                            {
                              name: "Bash",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Leap",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Double Swing",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Stun",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Double Throw",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Leap Attack",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Concentrate",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Frenzy",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Whirlwind",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Berserk",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Druid
                        {
                          id: "skill-5",
                          name: "Elemental",
                          flex: true,
                          items: [
                            {
                              name: "Firestorm",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Molten Boulder",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Arctic Blast",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fissure",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cyclone Armor",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Twister",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Volcano",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Tornado",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Armageddon",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Hurricane",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-5",
                          name: "Shape Shifting",
                          flex: true,
                          items: [
                            {
                              name: "Wearwolf",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lycanthropy",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Wearbear",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Feral Rage",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Maul",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Rabies",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fire Claws",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Hunger",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shock Wave",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fury",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-5",
                          name: "Summoning",
                          flex: true,
                          items: [
                            {
                              name: "Raven",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Poison Creeper",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Oak Sage",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Summon Spirit Wolf",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Carrion Vine",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Heart of Wolverine",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Summon Dire Wolf",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Solar Creeper",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Spirit of Barbs",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Summon Grizzly",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        // Assassin
                        {
                          id: "skill-6",
                          name: "Martial Arts",
                          flex: true,
                          items: [
                            {
                              name: "Tiger Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x5,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dragon Talon",
                              dataViewAltKey: "heroSkills",
                              offset: 0x6,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fists of Fire",
                              dataViewAltKey: "heroSkills",
                              offset: 0xa,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dragon Claw",
                              dataViewAltKey: "heroSkills",
                              offset: 0xb,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cobra Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Claws of Thunder",
                              dataViewAltKey: "heroSkills",
                              offset: 0x14,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dragon Tail",
                              dataViewAltKey: "heroSkills",
                              offset: 0x15,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blades of Ice",
                              dataViewAltKey: "heroSkills",
                              offset: 0x19,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Dragon Flight",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1a,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Phoenix Strike",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1f,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-6",
                          name: "Shadow Disciplines",
                          flex: true,
                          items: [
                            {
                              name: "Claw Mastery",
                              dataViewAltKey: "heroSkills",
                              offset: 0x3,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Psychic Hammer",
                              dataViewAltKey: "heroSkills",
                              offset: 0x4,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Burst of Speed",
                              dataViewAltKey: "heroSkills",
                              offset: 0x9,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Weapon Block",
                              dataViewAltKey: "heroSkills",
                              offset: 0xe,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Cloak of Shadows",
                              dataViewAltKey: "heroSkills",
                              offset: 0xf,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Fade",
                              dataViewAltKey: "heroSkills",
                              offset: 0x12,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shadow Warrior",
                              dataViewAltKey: "heroSkills",
                              offset: 0x13,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Mind Blast",
                              dataViewAltKey: "heroSkills",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Venom",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1d,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shadow Master",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1e,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                        {
                          id: "skill-6",
                          name: "Traps",
                          flex: true,
                          items: [
                            {
                              name: "Fire Blast",
                              dataViewAltKey: "heroSkills",
                              offset: 0x2,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Shock Web",
                              dataViewAltKey: "heroSkills",
                              offset: 0x7,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blade Sentinel",
                              dataViewAltKey: "heroSkills",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Charged Bolt Sentry",
                              dataViewAltKey: "heroSkills",
                              offset: 0xc,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Wake of Fire",
                              dataViewAltKey: "heroSkills",
                              offset: 0xd,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blade Fury",
                              dataViewAltKey: "heroSkills",
                              offset: 0x11,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Lightning Sentry",
                              dataViewAltKey: "heroSkills",
                              offset: 0x16,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Wake of Inferno",
                              dataViewAltKey: "heroSkills",
                              offset: 0x17,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Death Sentry",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1b,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                            {
                              name: "Blade Shield",
                              dataViewAltKey: "heroSkills",
                              offset: 0x1c,
                              type: "variable",
                              dataType: "uint8",
                              max: 20,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  name: "Inventory",
                  planned: true,
                  items: [
                    {
                      id: "inventory",
                      length: getItemLength(),
                      type: "container",
                      instanceType: "tabs",
                      instances: 0,
                      resource: "inventoryNames",
                      vertical: true,
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              id: "itemType",
                              name: "Type",
                              dataViewAltKey: "inventory",
                              offset: 0x5c,
                              type: "variable",
                              dataType: "uint32",
                              resource: "itemTypes",
                              autocomplete: true,
                            },
                            {
                              name: "Location",
                              dataViewAltKey: "inventory",
                              offset: 0x44,
                              type: "variable",
                              dataType: "uint32",
                              resource: "itemLocations",
                            },
                            {
                              name: "Equipped Location",
                              dataViewAltKey: "inventory",
                              offset: 0x48,
                              type: "variable",
                              dataType: "uint32",
                              resource: "itemEquippedLocations",
                            },
                            {
                              name: "Stored Location",
                              dataViewAltKey: "inventory",
                              offset: 0x58,
                              type: "variable",
                              dataType: "uint32",
                              resource: "itemStoredLocation",
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Column",
                              dataViewAltKey: "inventory",
                              offset: 0x4c,
                              type: "variable",
                              dataType: "uint32",
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 10,
                            },
                            {
                              name: "Row",
                              dataViewAltKey: "inventory",
                              offset: 0x50,
                              type: "variable",
                              dataType: "uint32",
                              operations: [{ "+": 1 }],
                              min: 1,
                              max: 8,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              type: "section",
                              background: true,
                              items: [
                                {
                                  name: "Identified",
                                  dataViewAltKey: "inventory",
                                  offset: 0x4,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Socketed",
                                  dataViewAltKey: "inventory",
                                  offset: 0xc,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Obtained on Last Game",
                                  dataViewAltKey: "inventory",
                                  offset: 0x14,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Player Ear",
                                  dataViewAltKey: "inventory",
                                  offset: 0x1c,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Start Item",
                                  dataViewAltKey: "inventory",
                                  offset: 0x20,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Simple Item",
                                  dataViewAltKey: "inventory",
                                  offset: 0x28,
                                  type: "variable",
                                  dataType: "boolean",
                                  hidden: true,
                                },
                                {
                                  name: "Ethereal",
                                  dataViewAltKey: "inventory",
                                  offset: 0x2c,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                                {
                                  name: "Personalized",
                                  dataViewAltKey: "inventory",
                                  offset: 0x34,
                                  type: "variable",
                                  dataType: "boolean",
                                },
                              ],
                            },
                            {
                              name: "Attached Gems",
                              dataViewAltKey: "inventory",
                              offset: 0x60,
                              type: "variable",
                              dataType: "uint32",
                              max: 6,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x0,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x8,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x10,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x18,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x24,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x30,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x38,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x3c,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x40,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                            {
                              name: "???",
                              dataViewAltKey: "inventory",
                              offset: 0x54,
                              type: "variable",
                              dataType: "uint32",
                              hidden: true,
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Id",
                              dataViewAltKey: "inventory",
                              offset: 0x64,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Level",
                              dataViewAltKey: "inventory",
                              offset: 0x68,
                              type: "variable",
                              dataType: "uint32",
                              // max:
                            },
                            {
                              name: "Quality",
                              dataViewAltKey: "inventory",
                              offset: 0x6c,
                              type: "variable",
                              dataType: "uint32",
                              resource: "itemQualities",
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Mercenary",
          planned: true,
          items: [],
        },
        {
          name: "Quests",
          flex: true,
          items: [
            {
              length: 0x60,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  type: "tabs",
                  vertical: true,
                  items: [
                    {
                      name: "Act 1",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x159, bit: 0, label: "Introduction" },
                            { offset: 0x167, bit: 0, label: "Act Completed" },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Den of Evil",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15b, bit: 2, label: "Quest given by Akara" },
                                { offset: 0x15b, bit: 3, label: "Exit the Rogue Encampement" },
                                { offset: 0x15b, bit: 4, label: "Entering the Den of Evil" },
                                { offset: 0x15b, bit: 1, label: "All monsters killed" },
                                { offset: 0x15b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15b, bit: 5, label: "???", hidden: true },
                                { offset: 0x15b, bit: 6, label: "???", hidden: true },
                                { offset: 0x15b, bit: 7, label: "???", hidden: true },
                                { offset: 0x15c, bit: 0, label: "???", hidden: true },
                                { offset: 0x15c, bit: 1, label: "???", hidden: true },
                                { offset: 0x15c, bit: 2, label: "???", hidden: true },
                                { offset: 0x15c, bit: 3, label: "???", hidden: true },
                                { offset: 0x15c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x15c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x15c, bit: 6, label: "???", hidden: true },
                                { offset: 0x15c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Sisters' Burial Grounds",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15d, bit: 2, label: "Quest given by Kashya" },
                                { offset: 0x15d, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x15d, bit: 4, label: "Entering the Burial Grounds" },
                                { offset: 0x15d, bit: 1, label: "Blood Raven killed" },
                                { offset: 0x15d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15d, bit: 5, label: "???", hidden: true },
                                { offset: 0x15d, bit: 6, label: "???", hidden: true },
                                { offset: 0x15d, bit: 7, label: "???", hidden: true },
                                { offset: 0x15e, bit: 0, label: "???", hidden: true },
                                { offset: 0x15e, bit: 1, label: "???", hidden: true },
                                { offset: 0x15e, bit: 2, label: "???", hidden: true },
                                { offset: 0x15e, bit: 3, label: "???", hidden: true },
                                { offset: 0x15e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x15e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x15e, bit: 6, label: "???", hidden: true },
                                { offset: 0x15e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Search for Cain",
                              type: "bitflags",
                              flags: [
                                { offset: 0x161, bit: 2, label: "Quest given by Akara" },
                                { offset: 0x161, bit: 3, label: "Scroll of Inifuss obtained" },
                                { offset: 0x161, bit: 4, label: "Portal to Tristram open" },
                                { offset: 0x161, bit: 1, label: "Deckard Cain rescued by hero" },
                                { offset: 0x162, bit: 6, label: "Deckard Cain rescued by the Rogues" },
                                { offset: 0x161, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x162, bit: 2, label: "Cow Level completed", separator: true },
                                { offset: 0x161, bit: 5, label: "???", hidden: true },
                                { offset: 0x161, bit: 6, label: "???", hidden: true },
                                { offset: 0x161, bit: 7, label: "???", hidden: true },
                                { offset: 0x162, bit: 0, label: "???", hidden: true },
                                { offset: 0x162, bit: 1, label: "???", hidden: true },
                                { offset: 0x162, bit: 3, label: "???", hidden: true },
                                { offset: 0x162, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x162, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x162, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Forgotten Tower",
                              type: "bitflags",
                              flags: [
                                { offset: 0x163, bit: 2, label: "The Moldy Tome read" },
                                { offset: 0x163, bit: 6, label: "Entering the Forgotten Tower" },
                                { offset: 0x163, bit: 4, label: "Entering the Tower Cellar Level 5" },
                                { offset: 0x163, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x163, bit: 1, label: "???", hidden: true },
                                { offset: 0x163, bit: 3, label: "???", hidden: true },
                                { offset: 0x163, bit: 5, label: "???", hidden: true },
                                { offset: 0x163, bit: 7, label: "???", hidden: true },
                                { offset: 0x164, bit: 0, label: "???", hidden: true },
                                { offset: 0x164, bit: 1, label: "???", hidden: true },
                                { offset: 0x164, bit: 2, label: "???", hidden: true },
                                { offset: 0x164, bit: 3, label: "???", hidden: true },
                                { offset: 0x164, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x164, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x164, bit: 6, label: "???", hidden: true },
                                { offset: 0x164, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Tools of the Trade",
                              type: "bitflags",
                              flags: [
                                { offset: 0x15f, bit: 2, label: "Quest given by Charsi" },
                                { offset: 0x15f, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x15f, bit: 6, label: "Horadric Malus obtained" },
                                { offset: 0x15f, bit: 1, label: "Charsi offers to imbuing an item" },
                                { offset: 0x15f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x15f, bit: 4, label: "???", hidden: true },
                                { offset: 0x15f, bit: 5, label: "???", hidden: true },
                                { offset: 0x15f, bit: 7, label: "???", hidden: true },
                                { offset: 0x160, bit: 0, label: "???", hidden: true },
                                { offset: 0x160, bit: 1, label: "???", hidden: true },
                                { offset: 0x160, bit: 2, label: "???", hidden: true },
                                { offset: 0x160, bit: 3, label: "???", hidden: true },
                                { offset: 0x160, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x160, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x160, bit: 6, label: "???", hidden: true },
                                { offset: 0x160, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Sisters to the Slaughter",
                              type: "bitflags",
                              flags: [
                                { offset: 0x165, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x165, bit: 3, label: "Exit the Rogue Encampment" },
                                { offset: 0x165, bit: 4, label: "Entering the Catacombs Level 4" },
                                { offset: 0x165, bit: 1, label: "Andariel killed" },
                                { offset: 0x165, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x165, bit: 5, label: "???", hidden: true },
                                { offset: 0x165, bit: 6, label: "???", hidden: true },
                                { offset: 0x165, bit: 7, label: "???", hidden: true },
                                { offset: 0x166, bit: 0, label: "???", hidden: true },
                                { offset: 0x166, bit: 1, label: "???", hidden: true },
                                { offset: 0x166, bit: 2, label: "???", hidden: true },
                                { offset: 0x166, bit: 3, label: "???", hidden: true },
                                { offset: 0x166, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x166, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x166, bit: 6, label: "???", hidden: true },
                                { offset: 0x166, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 2",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x169, bit: 0, label: "Introduction" },
                            { offset: 0x177, bit: 0, label: "Act Completed" },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Dadament's Lair",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16b, bit: 2, label: "Quest given by Atma" },
                                { offset: 0x16b, bit: 3, label: "Exiting Lut Gholein" },
                                { offset: 0x16b, bit: 4, label: "Entering the Sewers Level 3" },
                                { offset: 0x16b, bit: 5, label: "Book of Skill usable" },
                                { offset: 0x16b, bit: 1, label: "Radament killed" },
                                { offset: 0x16b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16b, bit: 6, label: "???", hidden: true },
                                { offset: 0x16b, bit: 7, label: "???", hidden: true },
                                { offset: 0x16c, bit: 0, label: "???", hidden: true },
                                { offset: 0x16c, bit: 1, label: "???", hidden: true },
                                { offset: 0x16c, bit: 2, label: "???", hidden: true },
                                { offset: 0x16c, bit: 3, label: "???", hidden: true },
                                { offset: 0x16c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x16c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x16c, bit: 6, label: "???", hidden: true },
                                { offset: 0x16c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Horadric Staff",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16d, bit: 3, label: "Horadric Scroll presented to Deckard Cain" },
                                { offset: 0x16d, bit: 6, label: "Horadric Cube presented to Deckard Cain" },
                                { offset: 0x16d, bit: 5, label: "Staff of King presented to Deckard Cain" },
                                { offset: 0x16d, bit: 4, label: "Viper Amulet presented to Deckard Cain" },
                                { offset: 0x16e, bit: 3, label: "Horadric Staff transmuted" },
                                { offset: 0x16e, bit: 2, label: "Horadric Staff presented to Deckard Cain" },
                                { offset: 0x16d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16d, bit: 1, label: "???", hidden: true },
                                { offset: 0x16d, bit: 2, label: "???", hidden: true },
                                { offset: 0x16d, bit: 7, label: "???", hidden: true },
                                { offset: 0x16e, bit: 0, label: "???", hidden: true },
                                { offset: 0x16e, bit: 1, label: "???", hidden: true },
                                { offset: 0x16e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x16e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x16e, bit: 6, label: "???", hidden: true },
                                { offset: 0x16e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Tainted Sun",
                              type: "bitflags",
                              flags: [
                                { offset: 0x16f, bit: 3, label: "Staff of Kings obtained" },
                                { offset: 0x16f, bit: 2, label: "Amulet of the Viper obtained" },
                                { offset: 0x16f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x16f, bit: 1, label: "???", hidden: true },
                                { offset: 0x16f, bit: 4, label: "???", hidden: true },
                                { offset: 0x16f, bit: 5, label: "???", hidden: true },
                                { offset: 0x16f, bit: 6, label: "???", hidden: true },
                                { offset: 0x16f, bit: 7, label: "???", hidden: true },
                                { offset: 0x170, bit: 0, label: "???", hidden: true },
                                { offset: 0x170, bit: 1, label: "???", hidden: true },
                                { offset: 0x170, bit: 2, label: "???", hidden: true },
                                { offset: 0x170, bit: 3, label: "???", hidden: true },
                                { offset: 0x170, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x170, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x170, bit: 6, label: "???", hidden: true },
                                { offset: 0x170, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Arcane Sanctuary",
                              type: "bitflags",
                              flags: [
                                { offset: 0x171, bit: 2, label: "Quest given by Drognan" },
                                { offset: 0x171, bit: 7, label: "Way blocked by Kaelan" },
                                { offset: 0x171, bit: 3, label: "Talk with Jerhyn" },
                                { offset: 0x172, bit: 0, label: "Kaelan allowed passage" },
                                { offset: 0x171, bit: 4, label: "Entering the Harem Level 1" },
                                { offset: 0x171, bit: 5, label: "Entering the Arcane Sanctuary" },
                                { offset: 0x171, bit: 1, label: "Horazon's Journal read" },
                                { offset: 0x171, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x171, bit: 6, label: "???", hidden: true },
                                { offset: 0x172, bit: 1, label: "???", hidden: true },
                                { offset: 0x172, bit: 2, label: "???", hidden: true },
                                { offset: 0x172, bit: 3, label: "???", hidden: true },
                                { offset: 0x172, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x172, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x172, bit: 6, label: "???", hidden: true },
                                { offset: 0x172, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Summoner",
                              type: "bitflags",
                              flags: [
                                { offset: 0x173, bit: 2, label: "Summoner seen" },
                                { offset: 0x173, bit: 1, label: "Summoner killed" },
                                { offset: 0x173, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x173, bit: 3, label: "???", hidden: true },
                                { offset: 0x173, bit: 4, label: "???", hidden: true },
                                { offset: 0x173, bit: 5, label: "???", hidden: true },
                                { offset: 0x173, bit: 6, label: "???", hidden: true },
                                { offset: 0x173, bit: 7, label: "???", hidden: true },
                                { offset: 0x174, bit: 0, label: "???", hidden: true },
                                { offset: 0x174, bit: 1, label: "???", hidden: true },
                                { offset: 0x174, bit: 2, label: "???", hidden: true },
                                { offset: 0x174, bit: 3, label: "???", hidden: true },
                                { offset: 0x174, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x174, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x174, bit: 6, label: "???", hidden: true },
                                { offset: 0x174, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Seven Tombs",
                              type: "bitflags",
                              flags: [
                                { offset: 0x175, bit: 2, label: "Quest given by Jerhyn" },
                                { offset: 0x175, bit: 5, label: "Duriel killed" },
                                { offset: 0x175, bit: 3, label: "Tyrael rescued" },
                                { offset: 0x175, bit: 4, label: "Talk with Jerhyn" },
                                { offset: 0x175, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x175, bit: 1, label: "???", hidden: true },
                                { offset: 0x175, bit: 6, label: "???", hidden: true },
                                { offset: 0x175, bit: 7, label: "???", hidden: true },
                                { offset: 0x176, bit: 0, label: "???", hidden: true },
                                { offset: 0x176, bit: 1, label: "???", hidden: true },
                                { offset: 0x176, bit: 2, label: "???", hidden: true },
                                { offset: 0x176, bit: 3, label: "???", hidden: true },
                                { offset: 0x176, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x176, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x176, bit: 6, label: "???", hidden: true },
                                { offset: 0x176, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 3",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x179, bit: 0, label: "Introduction" },
                            { offset: 0x187, bit: 0, label: "Act Completed" },
                            { offset: 0x199, bit: 0, label: "Related to Dark Wanderer on Act 3", hidden: true },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Golden Bird",
                              type: "bitflags",
                              flags: [
                                { offset: 0x181, bit: 6, label: "Jade Figurine obtained" },
                                { offset: 0x181, bit: 2, label: "Jade Figurine presented to Deckard Cain" },
                                { offset: 0x181, bit: 4, label: "Golden Bird presented to Deckard Cain" },
                                { offset: 0x181, bit: 1, label: "Golden Bird given to Alkor" },
                                { offset: 0x181, bit: 5, label: "Potion of Life usable" },
                                { offset: 0x181, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x181, bit: 3, label: "???", hidden: true },
                                { offset: 0x181, bit: 7, label: "???", hidden: true },
                                { offset: 0x182, bit: 0, label: "???", hidden: true },
                                { offset: 0x182, bit: 1, label: "???", hidden: true },
                                { offset: 0x182, bit: 2, label: "???", hidden: true },
                                { offset: 0x182, bit: 3, label: "???", hidden: true },
                                { offset: 0x182, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x182, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x182, bit: 6, label: "???", hidden: true },
                                { offset: 0x182, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Blade of the Old Religion",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17f, bit: 3, label: "Quest given by Hrati" },
                                { offset: 0x17f, bit: 4, label: "Rat Man killed" },
                                { offset: 0x17f, bit: 5, label: "The Gidbinn obtained?", hidden: true },
                                { offset: 0x17f, bit: 6, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x17f, bit: 7, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x180, bit: 0, label: "The Gidbinn given to Asheara?", hidden: true },
                                { offset: 0x180, bit: 1, label: "The Gidbinn obtained?", hidden: true },
                                { offset: 0x17f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17f, bit: 1, label: "???", hidden: true },
                                { offset: 0x17f, bit: 2, label: "???", hidden: true },
                                { offset: 0x180, bit: 2, label: "???", hidden: true },
                                { offset: 0x180, bit: 3, label: "???", hidden: true },
                                { offset: 0x180, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x180, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x180, bit: 6, label: "???", hidden: true },
                                { offset: 0x180, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Khalim's Will",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17d, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x17d, bit: 3, label: "Khalim's Eye presented to Deckard Cain" },
                                { offset: 0x17d, bit: 4, label: "Khalim's Brain presented to Deckard Cain" },
                                { offset: 0x17d, bit: 6, label: "Khalim's Heart presented to Deckard Cain" },
                                { offset: 0x17d, bit: 5, label: "Khalim's Flail presented to Deckard Cain" },
                                { offset: 0x17d, bit: 7, label: "Khalim's Will presented to Deckard Cain" },
                                { offset: 0x17d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17d, bit: 1, label: "???", hidden: true },
                                { offset: 0x17e, bit: 0, label: "???", hidden: true },
                                { offset: 0x17e, bit: 1, label: "???", hidden: true },
                                { offset: 0x17e, bit: 2, label: "???", hidden: true },
                                { offset: 0x17e, bit: 3, label: "???", hidden: true },
                                { offset: 0x17e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x17e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x17e, bit: 6, label: "???", hidden: true },
                                { offset: 0x17e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Lam Esen's Tome",
                              type: "bitflags",
                              flags: [
                                { offset: 0x17b, bit: 2, label: "Quest given by Alkor" },
                                { offset: 0x17b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x17b, bit: 1, label: "???", hidden: true },
                                { offset: 0x17b, bit: 3, label: "???", hidden: true },
                                { offset: 0x17b, bit: 4, label: "???", hidden: true },
                                { offset: 0x17b, bit: 5, label: "???", hidden: true },
                                { offset: 0x17b, bit: 6, label: "???", hidden: true },
                                { offset: 0x17b, bit: 7, label: "???", hidden: true },
                                { offset: 0x17c, bit: 0, label: "???", hidden: true },
                                { offset: 0x17c, bit: 1, label: "???", hidden: true },
                                { offset: 0x17c, bit: 2, label: "???", hidden: true },
                                { offset: 0x17c, bit: 3, label: "???", hidden: true },
                                { offset: 0x17c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x17c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x17c, bit: 6, label: "???", hidden: true },
                                { offset: 0x17c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Blackened Temple",
                              type: "bitflags",
                              flags: [
                                { offset: 0x183, bit: 3, label: "Entering Travincal" },
                                { offset: 0x183, bit: 4, label: "High Council killed" },
                                { offset: 0x183, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x183, bit: 1, label: "???", hidden: true },
                                { offset: 0x183, bit: 2, label: "???", hidden: true },
                                { offset: 0x183, bit: 5, label: "???", hidden: true },
                                { offset: 0x183, bit: 6, label: "???", hidden: true },
                                { offset: 0x183, bit: 7, label: "???", hidden: true },
                                { offset: 0x184, bit: 0, label: "???", hidden: true },
                                { offset: 0x184, bit: 1, label: "???", hidden: true },
                                { offset: 0x184, bit: 2, label: "???", hidden: true },
                                { offset: 0x184, bit: 3, label: "???", hidden: true },
                                { offset: 0x184, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x184, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x184, bit: 6, label: "???", hidden: true },
                                { offset: 0x184, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "The Guardian",
                              type: "bitflags",
                              flags: [
                                { offset: 0x185, bit: 4, label: "Compelling Orb destroyed" },
                                { offset: 0x185, bit: 5, label: "Entering the Durance of Hate Level 1" },
                                { offset: 0x185, bit: 6, label: "Entering the Durance of Hate Level 3" },
                                { offset: 0x186, bit: 3, label: "Mephisto killed" },
                                { offset: 0x185, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x185, bit: 1, label: "???", hidden: true },
                                { offset: 0x185, bit: 2, label: "???", hidden: true },
                                { offset: 0x185, bit: 3, label: "???", hidden: true },
                                { offset: 0x185, bit: 7, label: "???", hidden: true },
                                { offset: 0x186, bit: 0, label: "???", hidden: true },
                                { offset: 0x186, bit: 1, label: "???", hidden: true },
                                { offset: 0x186, bit: 2, label: "???", hidden: true },
                                { offset: 0x186, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x186, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x186, bit: 6, label: "???", hidden: true },
                                { offset: 0x186, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 4",
                      items: [
                        {
                          name: "General",
                          type: "bitflags",
                          flags: [
                            { offset: 0x189, bit: 0, label: "Introduction" },
                            { offset: 0x191, bit: 0, label: "Act Completed", hidden: true },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "The Fallen Angel",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18b, bit: 2, label: "Quest given by Tyrael" },
                                { offset: 0x18b, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18b, bit: 1, label: "Izual killed" },
                                { offset: 0x18b, bit: 5, label: "Talk with Izual Spirit" },
                                { offset: 0x18b, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18b, bit: 4, label: "???", hidden: true },
                                { offset: 0x18b, bit: 6, label: "???", hidden: true },
                                { offset: 0x18b, bit: 7, label: "???", hidden: true },
                                { offset: 0x18c, bit: 0, label: "???", hidden: true },
                                { offset: 0x18c, bit: 1, label: "???", hidden: true },
                                { offset: 0x18c, bit: 2, label: "???", hidden: true },
                                { offset: 0x18c, bit: 3, label: "???", hidden: true },
                                { offset: 0x18c, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x18c, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x18c, bit: 6, label: "???", hidden: true },
                                { offset: 0x18c, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Hell's Forge",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18f, bit: 2, label: "Quest given by Deckard Cain" },
                                { offset: 0x18f, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18f, bit: 1, label: "Mephisto's Soulstone destroyed" },
                                { offset: 0x18f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18f, bit: 4, label: "???", hidden: true },
                                { offset: 0x18f, bit: 5, label: "???", hidden: true },
                                { offset: 0x18f, bit: 6, label: "???", hidden: true },
                                { offset: 0x18f, bit: 7, label: "???", hidden: true },
                                { offset: 0x190, bit: 0, label: "???", hidden: true },
                                { offset: 0x190, bit: 1, label: "???", hidden: true },
                                { offset: 0x190, bit: 2, label: "???", hidden: true },
                                { offset: 0x190, bit: 3, label: "???", hidden: true },
                                { offset: 0x190, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x190, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x190, bit: 6, label: "???", hidden: true },
                                { offset: 0x190, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Terror's End",
                              type: "bitflags",
                              flags: [
                                { offset: 0x18d, bit: 2, label: "Quest given by Tyrael" },
                                { offset: 0x18d, bit: 3, label: "Exiting the Pandemonium Fortress" },
                                { offset: 0x18e, bit: 0, label: "Talk with Deckard Cain" },
                                { offset: 0x18e, bit: 1, label: "Portal to Harrogath open" },
                                { offset: 0x18d, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x18d, bit: 1, label: "???", hidden: true },
                                { offset: 0x18d, bit: 4, label: "???", hidden: true },
                                { offset: 0x18d, bit: 5, label: "???", hidden: true },
                                { offset: 0x18d, bit: 6, label: "???", hidden: true },
                                { offset: 0x18d, bit: 7, label: "???", hidden: true },
                                { offset: 0x18e, bit: 2, label: "???", hidden: true },
                                { offset: 0x18e, bit: 3, label: "???", hidden: true },
                                { offset: 0x18e, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x18e, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x18e, bit: 6, label: "???", hidden: true },
                                { offset: 0x18e, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: "Act 5",
                      items: [
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Siege on Harrogath",
                              type: "bitflags",
                              flags: [
                                { offset: 0x19f, bit: 2, label: "Quest given by larzuk" },
                                { offset: 0x19f, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x19f, bit: 1, label: "Shenk killed" },
                                { offset: 0x19f, bit: 5, label: "Larzuk offers to socket an item" },
                                { offset: 0x19f, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x19f, bit: 4, label: "???", hidden: true },
                                { offset: 0x19f, bit: 6, label: "???", hidden: true },
                                { offset: 0x19f, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a0, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a0, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a0, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Rescue on Mount Arreat",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a1, bit: 2, label: "Quest given by Qual-Lehk" },
                                { offset: 0x1a1, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a1, bit: 4, label: "A group of Soldiers has been released" },
                                { offset: 0x1a1, bit: 5, label: "All soldiers have been released?", hidden: true },
                                { offset: 0x1a1, bit: 1, label: "All soldiers have been released?", hidden: true },
                                { offset: 0x1a1, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a1, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a1, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a2, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a2, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a2, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Prison of Ice",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a3, bit: 2, label: "Quest given by Malah" },
                                { offset: 0x1a3, bit: 3, label: "Anya seen" },
                                { offset: 0x1a3, bit: 1, label: "Anya rescued" },
                                { offset: 0x1a3, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a3, bit: 4, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a3, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a4, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a4, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a4, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                        {
                          type: "section",
                          flex: true,
                          items: [
                            {
                              name: "Betrayal of Harrogath",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a5, bit: 2, label: "Quest given by Anya" },
                                { offset: 0x1a5, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a5, bit: 4, label: "Talk with Anya" },
                                { offset: 0x1a5, bit: 1, label: "Anya offers to personalize an item" },
                                { offset: 0x1a5, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a5, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a5, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a5, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a6, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a6, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a6, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Rite of Passage",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a7, bit: 2, label: "Quest given by Qualk-Kehk" },
                                { offset: 0x1a7, bit: 3, label: "Exiting Harrogath" },
                                { offset: 0x1a7, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a7, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 4, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 5, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a7, bit: 7, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 0, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 3, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1a8, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1a8, bit: 6, label: "???", hidden: true },
                                { offset: 0x1a8, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                            {
                              name: "Eve of Destruction",
                              type: "bitflags",
                              flags: [
                                { offset: 0x1a9, bit: 3, label: "Entering the Throne of Destruction" },
                                { offset: 0x1aa, bit: 2, label: "Destruction's End reached" },
                                { offset: 0x1a9, bit: 0, label: "Quest completed", separator: true },
                                { offset: 0x1a9, bit: 4, label: "Talk with Larzuk" },
                                { offset: 0x1a9, bit: 6, label: "Talk with Malah" },
                                { offset: 0x1a9, bit: 7, label: "Talk with Tyrael" },
                                { offset: 0x1aa, bit: 0, label: "Talk with Qual-Kehk" },
                                { offset: 0x1aa, bit: 1, label: "Talk with Anya", separator: true },
                                { offset: 0x1a9, bit: 1, label: "???", hidden: true },
                                { offset: 0x1a9, bit: 2, label: "???", hidden: true },
                                { offset: 0x1a9, bit: 5, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 3, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 4, label: "Closing animation seen", hidden: true },
                                { offset: 0x1aa, bit: 5, label: "Completed in current game", hidden: true },
                                { offset: 0x1aa, bit: 6, label: "???", hidden: true },
                                { offset: 0x1aa, bit: 7, label: "Quest can't be completed" },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Waypoints",
          items: [
            {
              length: 0x18,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  name: "Act 1",
                  type: "bitflags",
                  flags: [
                    { offset: 0x283, bit: 0, label: "Rogue Encampment" },
                    { offset: 0x283, bit: 1, label: "Cold Plains" },
                    { offset: 0x283, bit: 2, label: "Stony Field" },
                    { offset: 0x283, bit: 3, label: "Dark Wood" },
                    { offset: 0x283, bit: 4, label: "Black Marsh" },
                    { offset: 0x283, bit: 5, label: "Outer Cloister" },
                    { offset: 0x283, bit: 6, label: "Jail Level 1" },
                    { offset: 0x283, bit: 7, label: "Inner Cloister" },
                    { offset: 0x284, bit: 0, label: "Catacombs Level 2" },
                  ],
                },
                {
                  name: "Act 2",
                  type: "bitflags",
                  flags: [
                    { offset: 0x284, bit: 1, label: "Lut Gholein" },
                    { offset: 0x284, bit: 2, label: "Sewers Level 2" },
                    { offset: 0x284, bit: 3, label: "Dry Hills" },
                    { offset: 0x284, bit: 4, label: "Halls of the Dead Level 2" },
                    { offset: 0x284, bit: 5, label: "Far Oasis" },
                    { offset: 0x284, bit: 6, label: "Lost City" },
                    { offset: 0x284, bit: 7, label: "Palace Cellar Level 1" },
                    { offset: 0x285, bit: 0, label: "Arcade Sanctuary" },
                    { offset: 0x285, bit: 1, label: "Canyon of the Magi" },
                  ],
                },
                {
                  name: "Act 3",
                  type: "bitflags",
                  flags: [
                    { offset: 0x285, bit: 2, label: "Kurast Docks" },
                    { offset: 0x285, bit: 3, label: "Spider Forest" },
                    { offset: 0x285, bit: 4, label: "Great Marsh" },
                    { offset: 0x285, bit: 5, label: "Flayer Jungle" },
                    { offset: 0x285, bit: 6, label: "Lower Kurast" },
                    { offset: 0x285, bit: 7, label: "Kurast Bazaar" },
                    { offset: 0x286, bit: 0, label: "Upper Kurast" },
                    { offset: 0x286, bit: 1, label: "Travincal" },
                    { offset: 0x286, bit: 2, label: "Durance of Hate Level 2" },
                  ],
                },
                {
                  name: "Act 4",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 3, label: "The Pandemonium Fortress" },
                    { offset: 0x286, bit: 4, label: "City of the Damned" },
                    { offset: 0x286, bit: 5, label: "River of Flame" },
                  ],
                },
                {
                  name: "Act 5",
                  type: "bitflags",
                  flags: [
                    { offset: 0x286, bit: 6, label: "Harrogath" },
                    { offset: 0x286, bit: 7, label: "Frigid Highlands" },
                    { offset: 0x287, bit: 0, label: "Arreat Plateau" },
                    { offset: 0x287, bit: 1, label: "Crystalline Passage" },
                    { offset: 0x287, bit: 2, label: "Glacial Trail" },
                    { offset: 0x287, bit: 3, label: "Halls of Pain" },
                    { offset: 0x287, bit: 4, label: "Frozen Tundra" },
                    { offset: 0x287, bit: 5, label: "The Ancients' Way" },
                    { offset: 0x287, bit: 6, label: "Worldstone Keep Level 2" },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Events",
          planned: true,
          items: [
            {
              length: 0x8,
              type: "container",
              instanceType: "tabs",
              instances: 3,
              resource: "difficulties",
              flex: true,
              items: [
                {
                  name: "Introductions",
                  type: "bitflags",
                  flags: [
                    { offset: 0x2cd, bit: 0, label: "???" },
                    { offset: 0x2cd, bit: 1, label: "Gheed" },
                    { offset: 0x2cd, bit: 2, label: "???" },
                    { offset: 0x2cd, bit: 3, label: "Kashya" },
                    { offset: 0x2cd, bit: 4, label: "???" },
                    { offset: 0x2cd, bit: 5, label: "Charsi" },
                    { offset: 0x2cd, bit: 6, label: "???" },
                    { offset: 0x2cd, bit: 7, label: "???" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  resources: {
    classes: {
      0x0: "Amazon",
      0x1: "Sorceress",
      0x2: "Necromancer",
      0x3: "Paladin",
      0x4: "Barbarian",
      0x5: "Druid",
      0x6: "Assassin",
    },
    difficulties: {
      0x0: "Normal",
      0x1: "Nightmare",
      0x2: "Hell",
    },
    inventoryNames: "getInventoryNames()",
    itemEquippedLocations: {
      0x0: "-",
      0x1: "Head",
      0x2: "Neck",
      0x3: "Torso",
      0x4: "Right Hand",
      0x5: "Left Hand",
      0x6: "Right Finger",
      0x7: "Left Finger",
      0x8: "Waist",
      0x9: "Feet",
      0xa: "Hands",
      0xb: "Alternate Right Hand",
      0xc: "Alternate Left Hand",
    },
    itemLocations: {
      0x0: "Stored",
      0x1: "Equipped",
      0x2: "Belt",
      0x6: "Socketed",
    },
    itemQualities: {
      0x0: "-",
      0x1: "Low Quality",
      0x2: "Normal",
      0x3: "High Quality",
      0x4: "Magically Enhanced",
      0x5: "Part of a Set",
      0x6: "Rare",
      0x7: "Unique",
      0x8: "Crafted",
    },
    itemStoredLocation: {
      0x0: "-",
      0x1: "Inventory",
      0x4: "Horadric Cube",
      0x5: "Stash",
    },
    itemTypes: {
      0x30736320: "Scroll of Knowledge", // 0sc
      0x32617820: "Double Axe", // 2ax
      0x32687320: "Two-Handed Sword", // 2hs
      0x36627320: "Shillelagh", // 6bs
      0x36636220: "Great Bow", // 6cb
      0x36637320: "Elder Staff", // 6cs
      0x36686220: "Blade Bow", // 6hb
      0x36687820: "Colossus Crossbow", // 6hx
      0x366c3720: "Crusader Bow", // 6l7
      0x366c6220: "Shadow Bow", // 6lb
      0x366c7320: "Stalagmite", // 6ls
      0x366c7720: "Hydra Bow", // 6lw
      0x366c7820: "Pellet Bow", // 6lx
      0x366d7820: "Gorgon Crossbow", // 6mx
      0x36727820: "Demon Crossbow", // 6rx
      0x36733720: "Diamond Bow", // 6s7
      0x36736220: "Spider Bow", // 6sb
      0x36737320: "Walking Stick", // 6ss
      0x36737720: "Ward Bow", // 6sw
      0x36777320: "Archon Staff", // 6ws
      0x37326120: "Ettin Axe", // 72a
      0x37326820: "Legend Sword", // 72h
      0x37617220: "Suwayyah", // 7ar
      0x37617820: "Small Crescent", // 7ax
      0x37623720: "Champion Sword", // 7b7
      0x37623820: "Winged Axe", // 7b8
      0x37626120: "Silver-edged Axe", // 7ba
      0x37626b20: "Winged Knife", // 7bk
      0x37626c20: "Legend Spike", // 7bl
      0x37627220: "Mancatcher", // 7br
      0x37627320: "Conquest Sword", // 7bs
      0x37627420: "Decapitator", // 7bt
      0x37627720: "Lich Wand", // 7bw
      0x37636c20: "Truncheon", // 7cl
      0x37636d20: "Highland Blade", // 7cm
      0x37637220: "Phase Blade", // 7cr
      0x37637320: "Battle Cestus", // 7cs
      0x37646720: "Bone Knife", // 7dg
      0x37646920: "Mithril Point", // 7di
      0x37666220: "Colossus Sword", // 7fb
      0x37666320: "Hydra Edge", // 7fc
      0x37666c20: "Scourge", // 7fl
      0x37676120: "Champion Axe", // 7ga
      0x37676420: "Colossus Blade", // 7gd
      0x37676920: "Glorious Axe", // 7gi
      0x37676c20: "Ghost Glaive", // 7gl
      0x37676d20: "Thunder Maul", // 7gm
      0x37677320: "Balrog Blade", // 7gs
      0x37677720: "Unearthed Wand", // 7gw
      0x37683720: "Great Poleaxe", // 7h7
      0x37686120: "Tomahawk", // 7ha
      0x376a6120: "Hyperion Javelin", // 7ja
      0x376b7220: "Fanged Knife", // 7kr
      0x376c6120: "Feral Axe", // 7la
      0x376c7320: "Cryptic Sword", // 7ls
      0x376c7720: "Feral Claws", // 7lw
      0x376d3720: "Ogre Maul", // 7m7
      0x376d6120: "Reinforced Mace", // 7ma
      0x376d7020: "War Spike", // 7mp
      0x376d7420: "Devil Star", // 7mt
      0x376f3720: "Ogre Axe", // 7o7
      0x37703720: "War Pike", // 7p7
      0x37706120: "Cryptic Axe", // 7pa
      0x37706920: "Stygian Pilum", // 7pi
      0x37717220: "Scissors Suwayyah", // 7qr
      0x37717320: "Seraph Rod", // 7qs
      0x37733720: "Balrog Spear", // 7s7
      0x37733820: "Thresher", // 7s8
      0x37736220: "Elegant Blade", // 7sb
      0x37736320: "Mighty Scepter", // 7sc
      0x37736d20: "Ataghan", // 7sm
      0x37737020: "Tyrant Club", // 7sp
      0x37737220: "Hyperion Spear", // 7sr
      0x37737320: "Falcata", // 7ss
      0x37737420: "Ghost Spear", // 7st
      0x37746120: "Flying Axe", // 7ta
      0x37746b20: "Flying Knife", // 7tk
      0x37747220: "Stygian Pike", // 7tr
      0x37747320: "Winged Harpoon", // 7ts
      0x37747720: "Runic Talons", // 7tw
      0x37766f20: "Colossus Voulge", // 7vo
      0x37776120: "Beserker Axe", // 7wa
      0x37776220: "Wrist Sword", // 7wb
      0x37776320: "Giant Thresher", // 7wc
      0x37776420: "Mythical Sword", // 7wd
      0x37776820: "Legendary Mallet", // 7wh
      0x37776e20: "Polished Wand", // 7wn
      0x37777320: "Caduceus", // 7ws
      0x37786620: "War Fist", // 7xf
      0x37797720: "Ghost Wand", // 7yw
      0x38627320: "Gothic Staff", // 8bs
      0x38636220: "Double Bow", // 8cb
      0x38637320: "Cedar Staff", // 8cs
      0x38686220: "Razor Bow", // 8hb
      0x38687820: "Ballista", // 8hx
      0x386c3820: "Large Siege Bow", // 8l8
      0x386c6220: "Cedar Bow", // 8lb
      0x386c7320: "Quarterstaff", // 8ls
      0x386c7720: "Gothic Bow", // 8lw
      0x386c7820: "Arbalest", // 8lx
      0x386d7820: "Siege Crossbow", // 8mx
      0x38727820: "Chu-Ko-Nu", // 8rx
      0x38733820: "Short Siege Bow", // 8s8
      0x38736220: "Edge Bow", // 8sb
      0x38737320: "Jo Staff", // 8ss
      0x38737720: "Rune Bow", // 8sw
      0x38777320: "Rune Staff", // 8ws
      0x39326120: "Twin Axe", // 92a
      0x39326820: "Espandon", // 92h
      0x39617220: "Quhab", // 9ar
      0x39617820: "Cleaver", // 9ax
      0x39623720: "Lochaber Axe", // 9b7
      0x39623820: "Hurlbat", // 9b8
      0x39623920: "Gothic Sword", // 9b9
      0x39626120: "Bearded Axe", // 9ba
      0x39626b20: "War Dart", // 9bk
      0x39626c20: "Stilleto", // 9bl
      0x39627220: "War Fork", // 9br
      0x39627320: "Battle Sword", // 9bs
      0x39627420: "Tabar", // 9bt
      0x39627720: "Tomb Wand", // 9bw
      0x39636c20: "Cudgel", // 9cl
      0x39636d20: "Dacian Falx", // 9cm
      0x39637220: "Dimensional Blade", // 9cr
      0x39637320: "Hand Scythe", // 9cs
      0x39646720: "Poignard", // 9dg
      0x39646920: "Rondel", // 9di
      0x39666220: "Zweihander", // 9fb
      0x39666320: "Tulwar", // 9fc
      0x39666c20: "Knout", // 9fl
      0x39676120: "Gothic Axe", // 9ga
      0x39676420: "Executioner Sword", // 9gd
      0x39676920: "Ancient Axe", // 9gi
      0x39676c20: "Spiculum", // 9gl
      0x39676d20: "Martel de Fer", // 9gm
      0x39677320: "Tusk Sword", // 9gs
      0x39677720: "Grave Wand", // 9gw
      0x39683920: "Bec-de-Corbin", // 9h9
      0x39686120: "Hatchet", // 9ha
      0x396a6120: "War Javelin", // 9ja
      0x396b7220: "Cinquedeas", // 9kr
      0x396c6120: "Military Axe", // 9la
      0x396c7320: "Rune Sword", // 9ls
      0x396c7720: "Greater Claws", // 9lw
      0x396d3920: "War Club", // 9m9
      0x396d6120: "Flanged Mace", // 9ma
      0x396d7020: "Crowbill", // 9mp
      0x396d7420: "Jagged Star", // 9mt
      0x39703920: "Lance", // 9p9
      0x39706120: "Partizan", // 9pa
      0x39706920: "Great Pilum", // 9pi
      0x39717220: "Scissors Quhab", // 9qr
      0x39717320: "Holy Water Sprinkler", // 9qs
      0x39733820: "Battle Scythe", // 9s8
      0x39733920: "Simbilan", // 9s9
      0x39736220: "Shamshir", // 9sb
      0x39736320: "Rune Scepter", // 9sc
      0x39736d20: "Cutlass", // 9sm
      0x39737020: "Barbed Club", // 9sp
      0x39737220: "War Spear", // 9sr
      0x39737320: "Gladius", // 9ss
      0x39737420: "Yari", // 9st
      0x39746120: "Francisca", // 9ta
      0x39746b20: "Battle Dart", // 9tk
      0x39747220: "Fuscina", // 9tr
      0x39747320: "Harpoon", // 9ts
      0x39747720: "Greater Talons", // 9tw
      0x39766f20: "Bill", // 9vo
      0x39776120: "Naga", // 9wa
      0x39776220: "Wrist Spike", // 9wb
      0x39776320: "Grim Scythe", // 9wc
      0x39776420: "Ancient Sword", // 9wd
      0x39776820: "Battle Hammer", // 9wh
      0x39776e20: "Burnt Wand", // 9wn
      0x39777320: "Divine Scepter", // 9ws
      0x39786620: "Fascia", // 9xf
      0x39797720: "Petrified Wand", // 9yw
      0x61617220: "Ancient Armor", // aar
      0x616d3120: "Stag Bow", // am1
      0x616d3220: "Reflex Bow", // am2
      0x616d3320: "Maiden Spear", // am3
      0x616d3420: "Maiden Pike", // am4
      0x616d3520: "Maiden Javelin", // am5
      0x616d3620: "Ashwood Bow", // am6
      0x616d3720: "Ceremonial Bow", // am7
      0x616d3820: "Ceremonial Spear", // am8
      0x616d3920: "Ceremonial Pike", // am9
      0x616d6120: "Ceremonial Javelin", // ama
      0x616d6220: "Matriarchal Bow", // amb
      0x616d6320: "Grand Matron Bow", // amc
      0x616d6420: "Matriarchal Spear", // amd
      0x616d6520: "Matriarchal Pike", // ame
      0x616d6620: "Matriarchal Javelin", // amf
      0x616d7520: "Amulet", // amu
      0x61717620: "Arrows", // aqv
      0x61733120: "Wraps", // as1
      0x61733220: "Knuckles", // as2
      0x61733320: "Slashers", // as3
      0x61733420: "Splay", // as4
      0x61733520: "Hook", // as5
      0x61733620: "Shank", // as6
      0x61733720: "Claws", // as7
      0x61737320: "Book of Skill", // ass
      0x61786520: "Axe", // axe
      0x61786620: "Hatchet Hands", // axf
      0x62613120: "Jawbone Cap", // ba1
      0x62613220: "Fanged Helm", // ba2
      0x62613320: "Horned Helm", // ba3
      0x62613420: "Assault Helmet", // ba4
      0x62613520: "Avenger Guard", // ba5
      0x62613620: "Jawbone Visor", // ba6
      0x62613720: "Lion Helm", // ba7
      0x62613820: "Rage Mask", // ba8
      0x62613920: "Savage Helmet", // ba9
      0x62616120: "Slayer Guard", // baa
      0x62616220: "Carnage Helm", // bab
      0x62616320: "Fury Visor", // bac
      0x62616420: "Destroyer Helm", // bad
      0x62616520: "Conqueror Crown", // bae
      0x62616620: "Guardian Crown", // baf
      0x62616c20: "Balanced Axe", // bal
      0x62617220: "Bardiche", // bar
      0x62617820: "Broad Axe", // bax
      0x62626220: "Lam Esen's Tome", // bbb
      0x62657420: "Burning Essence of Terror", // bet
      0x62657920: "Baal's Eye", // bey
      0x62686d20: "Bone Helm", // bhm
      0x626b6420: "Key to the Cairn Stones", // bkd
      0x626b6620: "Balanced Knife", // bkf
      0x626b7320: "Scroll of Inifuss", // bks
      0x626c6420: "Blade", // bld
      0x626f7820: "Horadric Cube", // box
      0x62726e20: "Brandistock", // brn
      0x62727320: "Breast Plate", // brs
      0x62736420: "Broad Sword", // bsd
      0x62736820: "Bone Shield", // bsh
      0x62737420: "Battle Staff", // bst
      0x62737720: "Bastard Sword", // bsw
      0x62746c20: "Blade Talons", // btl
      0x62747820: "Battle Axe", // btx
      0x62756320: "Buckler", // buc
      0x62776e20: "Bone Wand", // bwn
      0x63617020: "Cap", // cap
      0x63627720: "Composite Bow", // cbw
      0x63656820: "Charged Essence of Hatred", // ceh
      0x63657320: "Cestus", // ces
      0x63686e20: "Chain Mail", // chn
      0x63693020: "Circlet", // ci0
      0x63693120: "Coronet", // ci1
      0x63693220: "Tiara", // ci2
      0x63693320: "Diadem", // ci3
      0x636c6220: "Club", // clb
      0x636c6d20: "Claymore", // clm
      0x636c7720: "Claws", // clw
      0x636d3120: "Small Charm", // cm1
      0x636d3220: "Large Charm", // cm2
      0x636d3320: "Grand Charm", // cm3
      0x63717620: "Bolts", // cqv
      0x63726e20: "Crown", // crn
      0x63727320: "Crystal Sword", // crs
      0x63737420: "Gnarled Staff", // cst
      0x64333320: "Decoy Gidbinn", // d33
      0x64677220: "Dagger", // dgr
      0x64686e20: "Diablo's Horn", // dhn
      0x64697220: "Dirk", // dir
      0x64723120: "Wolf Head", // dr1
      0x64723220: "Hawk Helm", // dr2
      0x64723320: "Antlers", // dr3
      0x64723420: "Falcon Mask", // dr4
      0x64723520: "Spirit Mask", // dr5
      0x64723620: "Alpha Helm", // dr6
      0x64723720: "Griffon Headdress", // dr7
      0x64723820: "Hunter's Guise", // dr8
      0x64723920: "Sacred Feathers", // dr9
      0x64726120: "Totemic Mask", // dra
      0x64726220: "Blood Spirit", // drb
      0x64726320: "Sun Spirit", // drc
      0x64726420: "Earth Spirit", // drd
      0x64726520: "Sky Spirit", // dre
      0x64726620: "Dream Spirit", // drf
      0x65617220: "Ear", // ear
      0x656c7820: "Elixir", // elx
      0x66656420: "Festering Essence of Destruction", // fed
      0x66686c20: "Full Helm", // fhl
      0x666c6120: "Flail", // fla
      0x666c6220: "Flamberge", // flb
      0x666c6320: "Falchion", // flc
      0x666c6420: "Field Plate", // fld
      0x66756c20: "Full Plate Mail", // ful
      0x67333320: "The Gidbinn", // g33
      0x67333420: "The Golden Bird", // g34
      0x67617820: "Great Axe", // gax
      0x67636220: "Chipped Sapphire", // gcb
      0x67636720: "Chipped Emerald", // gcg
      0x67637220: "Chipped Ruby", // gcr
      0x67637620: "Chipped Amethyst", // gcv
      0x67637720: "Chipped Diamond", // gcw
      0x67637920: "Chipped Topaz", // gcy
      0x67666220: "Flawed Sapphire", // gfb
      0x67666720: "Flawed Emerald", // gfg
      0x67667220: "Flawed Ruby", // gfr
      0x67667620: "Flawed Amethyst", // gfv
      0x67667720: "Flawed Diamond", // gfw
      0x67667920: "Flawed Topaz", // gfy
      0x67686d20: "Great Helm", // ghm
      0x67697320: "Giant Sword", // gis
      0x67697820: "Giant Axe", // gix
      0x676c6220: "Flawless Sapphire", // glb
      0x676c6420: "Gold", // gld
      0x676c6720: "Flawless Emerald", // glg
      0x676c7220: "Flawless Ruby", // glr
      0x676c7620: "Glaive", // glv
      0x676c7720: "Flawless Diamond", // glw
      0x676c7920: "Flawless Topaz", // gly
      0x676d6120: "Great Maul", // gma
      0x67706220: "Perfect Sapphire", // gpb
      0x67706720: "Perfect Emerald", // gpg
      0x67706c20: "Strangling Gas Potion", // gpl
      0x67706d20: "Choking Gas Potion", // gpm
      0x67707220: "Perfect Ruby", // gpr
      0x67707320: "Rancid Gas Potion", // gps
      0x67707620: "Perfect Amethyst", // gpv
      0x67707720: "Perfect Diamond", // gpw
      0x67707920: "Perfect Topaz", // gpy
      0x67736220: "Sapphire", // gsb
      0x67736320: "Grand Scepter", // gsc
      0x67736420: "Great Sword", // gsd
      0x67736720: "Emerald", // gsg
      0x67737220: "Ruby", // gsr
      0x67737620: "Amethyst", // gsv
      0x67737720: "Diamond", // gsw
      0x67737920: "Topaz", // gsy
      0x67746820: "Gothic Plate", // gth
      0x67747320: "Gothic Shield", // gts
      0x67776e20: "Grim Wand", // gwn
      0x677a7620: "Flawless Amethyst", // gzv
      0x68616c20: "Halberd", // hal
      0x68617820: "Hand Axe", // hax
      0x68626c20: "Plated Belt", // hbl
      0x68627420: "Greaves", // hbt
      0x68627720: "Hunter's Bow", // hbw
      0x68646d20: "Horadric Malus", // hdm
      0x68666820: "Hell Forge Hammer", // hfh
      0x68676c20: "Gauntlets", // hgl
      0x686c6120: "Hard Leather Armor", // hla
      0x686c6d20: "Helm", // hlm
      0x68703120: "Minor Healing Potion", // hp1
      0x68703220: "Light Healing Potion", // hp2
      0x68703320: "Healing Potion", // hp3
      0x68703420: "Greater Healing Potion", // hp4
      0x68703520: "Super Healing Potion", // hp5
      0x68726220: "Herb", // hrb
      0x68737420: "Horadric Staff", // hst
      0x68786220: "Heavy Crossbow", // hxb
      0x69626b20: "Tome of Identify", // ibk
      0x69636520: "Malah's Potion", // ice
      0x69736320: "Scroll of Identify", // isc
      0x6a333420: "A Jade Figurine", // j34
      0x6a617620: "Javelin", // jav
      0x6a657720: "Jewel", // jew
      0x6b657920: "Key", // key
      0x6b697420: "Kite Shield", // kit
      0x6b726920: "Kris", // kri
      0x6b747220: "Katar", // ktr
      0x6c617820: "Large Axe", // lax
      0x6c626220: "Long Battle Bow", // lbb
      0x6c626c20: "Sash", // lbl
      0x6c627420: "Boots", // lbt
      0x6c627720: "Long Bow", // lbw
      0x6c656120: "Leather Armor", // lea
      0x6c656720: "Wirt's Leg", // leg
      0x6c676c20: "Leather Gloves", // lgl
      0x6c726720: "Large Shield", // lrg
      0x6c736420: "Long Sword", // lsd
      0x6c737420: "Long Staff", // lst
      0x6c747020: "Light Plate", // ltp
      0x6c757620: "The Black Tower Key", // luv
      0x6c776220: "Long War Bow", // lwb
      0x6c786220: "Light Crossbow", // lxb
      0x6d616320: "Mace", // mac
      0x6d617520: "Maul", // mau
      0x6d626c20: "Belt", // mbl
      0x6d627220: "Mephisto's Brain", // mbr
      0x6d627420: "Chain Boots", // mbt
      0x6d676c20: "Chain Gloves", // mgl
      0x6d703120: "Minor Mana Potion", // mp1
      0x6d703220: "Light Mana Potion", // mp2
      0x6d703320: "Mana Potion", // mp3
      0x6d703420: "Greater Mana Potion", // mp4
      0x6d703520: "Super Mana Potion", // mp5
      0x6d706920: "Military Pick", // mpi
      0x6d736620: "Shaft of the Horadric Staff", // msf
      0x6d736b20: "Mask", // msk
      0x6d737320: "Mephisto's Soulstone", // mss
      0x6d737420: "Morning Star", // mst
      0x6d786220: "Crossbow", // mxb
      0x6e653120: "Preserved Head", // ne1
      0x6e653220: "Zombie Head", // ne2
      0x6e653320: "Unraveller Head", // ne3
      0x6e653420: "Gargoyle Head", // ne4
      0x6e653520: "Demon Head", // ne5
      0x6e653620: "Mummified Trophy", // ne6
      0x6e653720: "Fetish Trophy", // ne7
      0x6e653820: "Sexton Trophy", // ne8
      0x6e653920: "Cantor Trophy", // ne9
      0x6e656120: "Hierophant Trophy", // nea
      0x6e656220: "Minion Skull", // neb
      0x6e656320: "Hellspawn Skull", // nec
      0x6e656420: "Overseer Skull", // ned
      0x6e656520: "Succubus Skull", // nee
      0x6e656620: "Bloodlord Skull", // nef
      0x6e656720: "HellspawnSkull", // neg
      0x6f623120: "Eagle Orb", // ob1
      0x6f623220: "Sacred Globe", // ob2
      0x6f623320: "Smoked Sphere", // ob3
      0x6f623420: "Clasped Orb", // ob4
      0x6f623520: "Jared's Stone", // ob5
      0x6f623620: "Glowing Orb", // ob6
      0x6f623720: "Crystalline Globe", // ob7
      0x6f623820: "Cloudy Sphere", // ob8
      0x6f623920: "Sparkling Ball", // ob9
      0x6f626120: "Swirling Crystal", // oba
      0x6f626220: "Heavenly Stone", // obb
      0x6f626320: "Eldritch Orb", // obc
      0x6f626420: "Demon Heart", // obd
      0x6f626520: "Vortex Orb", // obe
      0x6f626620: "Dimensional Shard", // obf
      0x6f706c20: "Fulminating Potion", // opl
      0x6f706d20: "Exploding Potion", // opm
      0x6f707320: "Oil Potion", // ops
      0x70613120: "Targe", // pa1
      0x70613220: "Rondache", // pa2
      0x70613320: "Heraldic Shield", // pa3
      0x70613420: "Aerin Shield", // pa4
      0x70613520: "Crown Shield", // pa5
      0x70613620: "Akaran Targe", // pa6
      0x70613720: "Akaran Rondache", // pa7
      0x70613820: "Protector Shield", // pa8
      0x70613920: "Gilded Shield", // pa9
      0x70616120: "Royal Shield", // paa
      0x70616220: "Sacred Targe", // pab
      0x70616320: "Sacred Rondache", // pac
      0x70616420: "Kurast Shield", // pad
      0x70616520: "Zakarum Shield", // pae
      0x70616620: "Vortex Shield", // paf
      0x70617820: "Poleaxe", // pax
      0x70696b20: "Pike", // pik
      0x70696c20: "Pilum", // pil
      0x706b3120: "Key of Terror", // pk1
      0x706b3220: "Key of Hate", // pk2
      0x706b3320: "Key of Destruction", // pk3
      0x706c7420: "Plate Mail", // plt
      0x71627220: "Khalim's Brain", // qbr
      0x71657920: "Khalim's Eye", // qey
      0x71663120: "Khalim’s Flail", // qf1
      0x71663220: "Khalim’s Will", // qf2
      0x71687220: "Khalim's Heart", // qhr
      0x71756920: "Quilted Armor", // qui
      0x72303120: "El Rune", // r01
      0x72303220: "Eld Rune", // r02
      0x72303320: "Tir Rune", // r03
      0x72303420: "Nef Rune", // r04
      0x72303520: "Eth Rune", // r05
      0x72303620: "Ith Rune", // r06
      0x72303720: "Tal Rune", // r07
      0x72303820: "Ral Rune", // r08
      0x72303920: "Ort Rune", // r09
      0x72313020: "Thul Rune", // r10
      0x72313120: "Amn Rune", // r11
      0x72313220: "Sol Rune", // r12
      0x72313320: "Shae Rune", // r13
      0x72313420: "Dol Rune", // r14
      0x72313520: "Hel Rune", // r15
      0x72313620: "Po Rune", // r16
      0x72313720: "Lum Rune", // r17
      0x72313820: "Ko Rune", // r18
      0x72313920: "Fal Rune", // r19
      0x72323020: "Lem Rune", // r20
      0x72323120: "Pul Rune", // r21
      0x72323220: "Um Rune", // r22
      0x72323320: "Mal Rune", // r23
      0x72323420: "Ist Rune", // r24
      0x72323520: "Gul Rune", // r25
      0x72323620: "Vex Rune", // r26
      0x72323720: "Ohm Rune", // r27
      0x72323820: "Lo Rune", // r28
      0x72323920: "Sur Rune", // r29
      0x72333020: "Ber Rune", // r30
      0x72333120: "Jo Rune", // r31
      0x72333220: "Cham Rune", // r32
      0x72333320: "Zod Rune", // r33
      0x72696e20: "Ring", // rin
      0x726e6720: "Ring Mail", // rng
      0x72766c20: "Full Rejuvenation Potion", // rvl
      0x72767320: "Rejuvenation Potion", // rvs
      0x72786220: "Repeating Crossbow", // rxb
      0x73626220: "Short Battle Bow", // sbb
      0x73627220: "Sabre", // sbr
      0x73627720: "Short Bow", // sbw
      0x73636c20: "Scale Mail", // scl
      0x73636d20: "Scimitar", // scm
      0x73637020: "Scepter", // scp
      0x73637920: "Scythe", // scy
      0x736b6320: "Chipped Skull", // skc
      0x736b6620: "Flawed Skull", // skf
      0x736b6c20: "Flawless Skull", // skl
      0x736b7020: "Skull Cap", // skp
      0x736b7220: "Scissors Katar", // skr
      0x736b7520: "Skull", // sku
      0x736b7a20: "Perfect Skull", // skz
      0x736d6c20: "Small Shield", // sml
      0x73706320: "Spiked Club", // spc
      0x73706b20: "Spiked Shield", // spk
      0x73706c20: "Splint Mail", // spl
      0x73707220: "Spear", // spr
      0x73707420: "Spetum", // spt
      0x73736420: "Short Sword", // ssd
      0x73737020: "Short Spear", // ssp
      0x73737420: "Short Staff", // sst
      0x73746420: "StandardofHeroes", // std
      0x73747520: "Studded Leather", // stu
      0x73776220: "Short War Bow", // swb
      0x74617820: "Throwing Axe", // tax
      0x74626b20: "Tome of Town Portal", // tbk
      0x74626c20: "Heavy Belt", // tbl
      0x74627420: "Light Plated Boots", // tbt
      0x74636820: "Torch", // tch
      0x74657320: "Twisted Essence of Suffering", // tes
      0x74676c20: "Light Gauntlets", // tgl
      0x746b6620: "Throwing Knife", // tkf
      0x746f6120: "TokenofAbsolution", // toa
      0x746f7720: "Tower Shield", // tow
      0x74723120: "Horadric Scroll", // tr1
      0x74723220: "Scroll of Resistance", // tr2
      0x74726920: "Trident", // tri
      0x74736320: "Scroll of Town Portal", // tsc
      0x74737020: "Throwing Spear", // tsp
      0x75617020: "Shako", // uap
      0x75617220: "Sacred Armor", // uar
      0x75636c20: "Loricated Mail", // ucl
      0x75656120: "Wyrmhide", // uea
      0x75683920: "Bone Visage", // uh9
      0x75686220: "Myrmidon Greaves", // uhb
      0x75686320: "Colossus Girdle", // uhc
      0x75686720: "Ogre Gauntlets", // uhg
      0x75686c20: "Giant Conch", // uhl
      0x75686d20: "Spired Helm", // uhm
      0x75686e20: "Boneweave", // uhn
      0x75697420: "Monarch", // uit
      0x756b7020: "Hydraskull", // ukp
      0x756c6120: "Scarab Husk", // ula
      0x756c6220: "Wyrmhide Boots", // ulb
      0x756c6320: "Spiderweb Sash", // ulc
      0x756c6420: "Kraken Shell", // uld
      0x756c6720: "Bramble Mitts", // ulg
      0x756c6d20: "Armet", // ulm
      0x756c7420: "Hellforge Plate", // ult
      0x756d6220: "Boneweave Boots", // umb
      0x756d6320: "Mithril Coil", // umc
      0x756d6720: "Vambraces", // umg
      0x756d6c20: "Luna", // uml
      0x756e6720: "Diamond Mail", // ung
      0x756f7720: "Aegis", // uow
      0x75706b20: "Blade Barrier", // upk
      0x75706c20: "Balrog Skin", // upl
      0x75726720: "Hyperion", // urg
      0x75726e20: "Corona", // urn
      0x75727320: "Great Hauberk", // urs
      0x75736820: "Troll Nest", // ush
      0x75736b20: "Demonhead", // usk
      0x75746220: "Mirrored Boots", // utb
      0x75746320: "Troll Belt", // utc
      0x75746720: "Crusader Gauntlets", // utg
      0x75746820: "Lacquered Plate", // uth
      0x75747020: "Archon Plate", // utp
      0x75747320: "Ward", // uts
      0x75747520: "Wire Fleece", // utu
      0x75756320: "Heater", // uuc
      0x75756920: "Dusk Shroud", // uui
      0x75756c20: "Shadow Plate", // uul
      0x75766220: "Scarabshell Boots", // uvb
      0x75766320: "Vampirefang Belt", // uvc
      0x75766720: "Vampirebone Gloves", // uvg
      0x76626c20: "Light Belt", // vbl
      0x76627420: "Heavy Boots", // vbt
      0x76676c20: "Heavy Gloves", // vgl
      0x76697020: "Top of the Horadric Staff", // vip
      0x766f7520: "Voulge", // vou
      0x76707320: "Stamina Potion", // vps
      0x77617820: "War Axe", // wax
      0x77686d20: "War Hammer", // whm
      0x776d7320: "Thawing Potion", // wms
      0x776e6420: "Wand", // wnd
      0x77726220: "Wrist Blade", // wrb
      0x77736320: "War Scythe", // wsc
      0x77736420: "War Sword", // wsd
      0x77737020: "War Scepter", // wsp
      0x77737420: "War Staff", // wst
      0x78617020: "War Hat", // xap
      0x78617220: "Ornate Plate", // xar
      0x78636c20: "Tigulated Mail", // xcl
      0x78656120: "Serpentskin Armor", // xea
      0x78683920: "Grim Helm", // xh9
      0x78686220: "War Boots", // xhb
      0x78686720: "War Gaunlets", // xhg
      0x78686c20: "Basinet", // xhl
      0x78686d20: "Winged helm", // xhm
      0x78686e20: "Mesh Armor", // xhn
      0x78697420: "Dragon Shield", // xit
      0x786b7020: "Sallet", // xkp
      0x786c6120: "Demonhide Armor", // xla
      0x786c6220: "Demonhide Boots", // xlb
      0x786c6420: "Sharktooth Armor", // xld
      0x786c6720: "Demonhide Gloves", // xlg
      0x786c6d20: "Casque", // xlm
      0x786c7420: "Templar Coat", // xlt
      0x786d6220: "Mesh Boots", // xmb
      0x786d6720: "Heavy Bracers", // xmg
      0x786d6c20: "Round Shield", // xml
      0x786e6720: "Linked Mail", // xng
      0x786f7720: "Pavise", // xow
      0x78706b20: "Barbed Shield", // xpk
      0x78706c20: "Russet Armor", // xpl
      0x78726720: "Scutum", // xrg
      0x78726e20: "Grand Crown", // xrn
      0x78727320: "Cuirass", // xrs
      0x78736820: "Grim Shield", // xsh
      0x78736b20: "Death Mask", // xsk
      0x78746220: "Battle Boots", // xtb
      0x78746720: "Battle Gauntlets", // xtg
      0x78746820: "Embossed Plate", // xth
      0x78747020: "Mage Plate", // xtp
      0x78747320: "Ancient Shield", // xts
      0x78747520: "Trellised Armor", // xtu
      0x78756320: "Defender", // xuc
      0x78756920: "Ghost Armor", // xui
      0x78756c20: "Chaos Armor", // xul
      0x78766220: "Sharkskin Boots", // xvb
      0x78766720: "Sharkskin Gloves", // xvg
      0x78797a20: "Potion of Life", // xyz
      0x79707320: "Antidote Potion", // yps
      0x79776e20: "Yew Wand", // ywn
      0x7a686220: "War Belt", // zhb
      0x7a6c6220: "Demonhide Sash", // zlb
      0x7a6d6220: "Mesh Belt", // zmb
      0x7a746220: "Battle Belt", // ztb
      0x7a766220: "Sharkskin Belt", // zvb
    },
    progressions: {
      0x0: "-",
      0x1: "Normal: Act 1 Completed",
      0x2: "Normal: Act 2 Completed",
      0x3: "Normal: Act 3 Completed",
      0x4: "Normal: Act 4 Completed",
      0x5: "Normal: Act 5 Completed",
      0x6: "Nightmare: Act 1 Completed",
      0x7: "Nightmare: Act 2 Completed",
      0x8: "Nightmare: Act 3 Completed",
      0x9: "Nightmare: Act 4 Completed",
      0xa: "Nightmare: Act 5 Completed",
      0xb: "Hell: Act 1 Completed",
      0xc: "Hell: Act 2 Completed",
      0xd: "Hell: Act 3 Completed",
      0xe: "Hell: Act 4 Completed",
      0xf: "Hell: Act 5 Completed",
    },
  },
  resourcesLabels: {
    progressions: {
      0x1: "Normal",
      0x6: "Nightmare",
      0xb: "Hell",
    },
  },
};

export default template;
