import { bitToOffset } from "$lib/utils/bytes";

import type { ItemBitflag, ItemSection, ItemTab } from "$lib/types";

import { gummiRouteRanks, gummiRouteTreasures, worlds } from "./resource";

export function gummiMissionFragment(
  routeIndex: number,
  mission: number,
): ItemTab {
  const shift = routeIndex * 0xc0 + mission * 0x40;

  return {
    name: `Mission ${mission + 1}`,
    items: [
      ...gummiMissionDetailsFragment(shift),
      ...gummiMissionDetailsFragment(shift, true),
      {
        id: "gummiTreasuresPercents",
        type: "section",
        flex: true,
        noMargin: true,
        items: [
          {
            name: "Treasures",
            offset: 0xace0 + shift,
            type: "variable",
            dataType: "float32",
            disabled: true,
            suffix: "%",
          },
          {
            id: "finalMixNoShift",
            name: "Treasures",
            offset: 0x107c0 + shift,
            type: "variable",
            dataType: "float32",
            disabled: true,
            suffix: "%",
            hidden: true,
          },
        ],
      },
      {
        id: "gummiTreasures",
        type: "section",
        flex: true,
        items: [
          {
            id: "gummiCompletionBonus",
            name: "Completion Bonus",
            type: "bitflags",
            flags: gummiRouteTreasures
              .filter(
                (treasure) =>
                  treasure.routeIndex === routeIndex &&
                  treasure.mission === mission + 1 &&
                  treasure.type <= 0x1,
              )
              .map((treasure, index) => ({
                offset: 0xb480 + bitToOffset(treasure.index),
                bit: treasure.index % 8,
                label: `${gummiRouteRanks[index]}: ${treasure.item}`,
                disabled: true,
                hidden: treasure.type === 0x1,
              })),
          },
          {
            id: "gummiTreasuresFlags",
            name: "Treasures",
            type: "bitflags",
            flags: gummiRouteTreasures
              .filter(
                (treasure) =>
                  treasure.routeIndex === routeIndex &&
                  treasure.mission === mission + 1 &&
                  treasure.type === 0x2,
              )
              .map((treasure) => ({
                offset: 0xb480 + bitToOffset(treasure.index),
                bit: treasure.index % 8,
                label: treasure.item!,
              })),
          },
        ],
      },
    ],
  };
}

function gummiMissionDetailsFragment(
  shift: number,
  isEx = false,
): ItemSection[] {
  let id = "";

  if (isEx) {
    id = "finalMixNoShift";
    shift += 0x5420 + 0x9 * 0xc0;
  }

  return [
    {
      id: isEx ? "finalMixOnly" : undefined,
      name: isEx ? "EX" : "",
      type: "section",
      hidden: isEx,
      items: [
        {
          type: "section",
          flex: true,
          noMargin: true,
          items: [
            {
              id,
              name: "Progression",
              offset: 0xacdd + shift,
              type: "variable",
              dataType: "uint16",
              resource: "gummiMissionStatus",
            },
            {
              id: `completionRank-${isEx ? "ex-finalMixNoShift" : ""}`,
              name: "Completion Rank",
              offset: 0xacdb + shift,
              type: "variable",
              dataType: "uint8",
              resource: "gummiRouteRanks",
            },
            {
              id,
              name: "Medal Level",
              offset: 0xacda + shift,
              type: "variable",
              dataType: "uint8",
              max: 30,
            },
            {
              id,
              name: "Score",
              offset: 0xacc0 + shift,
              type: "variable",
              dataType: "uint32",
              max: 9999999,
            },
          ],
        },
        {
          type: "section",
          flex: true,
          items: [
            {
              id,
              name: "Destroyed",
              offset: 0xacc6 + shift,
              type: "variable",
              dataType: "uint16",
              max: 9999,
            },
            {
              id,
              name: "Medal Orbs",
              offset: 0xacd2 + shift,
              type: "variable",
              dataType: "uint16",
            },
            {
              id,
              name: "Received Hits",
              offset: 0xacd4 + shift,
              type: "variable",
              dataType: "uint16",
            },
            {
              id,
              name: "???",
              offset: 0xacc4 + shift,
              type: "variable",
              dataType: "uint16",
              hidden: true,
            },
            {
              id,
              name: "???",
              offset: 0xacd6 + shift,
              type: "variable",
              dataType: "uint16",
              hidden: true,
            },
          ],
        },
      ],
    },
  ];
}

export function gummiShipFragment(offset: number): ItemSection {
  return {
    type: "section",
    flex: true,
    items: [
      {
        name: "Letters",
        offset: offset + 0x90,
        type: "variable",
        dataType: "uint16",
        hidden: true,
      },
      {
        id: "name",
        name: "Name",
        offset: offset + 0x92,
        length: 0x20,
        type: "variable",
        dataType: "string",
        letterDataType: "uint16",
        resource: "letters",
      },
      {
        name: "Material Gummies",
        offset: offset + 0x8,
        type: "variable",
        dataType: "uint16",
        disabled: true,
      },
      {
        name: "Deco-Gummies",
        offset: offset + 0xa,
        type: "variable",
        dataType: "uint16",
        disabled: true,
      },
      {
        name: "Abilities",
        offset: offset + 0xc,
        type: "variable",
        dataType: "uint16",
        disabled: true,
      },
    ],
  };
}

export function worldFragment(index: number, hidden = false): ItemSection {
  return {
    type: "section",
    hidden,
    items: [
      {
        name: worlds[index],
        offset: 0x2ff8 + index * 0x4,
        type: "variable",
        dataType: "uint8",
        resource: "worldStatus",
        disabled: true,
      },
      {
        name: "Playtime",
        type: "group",
        mode: "time",
        items: [
          {
            id: "time",
            offset: 0x160c + index * 0x4,
            type: "variable",
            dataType: "uint32",
            operations: [
              { "/": 50 },
              {
                convert: { from: "seconds", to: "hours" },
              },
            ],
            max: 999,
          },
          {
            id: "time",
            offset: 0x160c + index * 0x4,
            type: "variable",
            dataType: "uint32",
            operations: [
              { "/": 50 },
              {
                convert: {
                  from: "seconds",
                  to: "minutes",
                },
              },
            ],
            leadingZeros: 1,
            max: 59,
          },
        ],
      },
      {
        name: "Landing Points",
        type: "bitflags",
        flags: [...worldLandingPointsFragment(index)],
      },
    ],
  };
}

export function worldLandingPointsFragment(index: number): ItemBitflag[] {
  switch (index) {
    case 0x2: // Twilight Town
      return [
        { offset: 0x10b5, bit: 7, label: "The Usual Spot" },
        { offset: 0x10b6, bit: 0, label: "Central Station" },
        { offset: 0x10b6, bit: 1, label: "Sunset Station" },
        { offset: 0x10b6, bit: 2, label: "Mansion: The White Room" },
        { offset: 0x10b6, bit: 3, label: "Mansion: Computer Room" },
        { offset: 0x10b6, bit: 4, label: "Tower: Entryway" },
        { offset: 0x10b6, bit: 5, label: "Tower: Sorcerer's Loft" },
      ];

    case 0x4: // Radiant Garden
      return [
        { offset: 0x10b3, bit: 6, label: "Merlin's House" },
        { offset: 0x10b3, bit: 5, label: "Postern" },
        { offset: 0x10b3, bit: 4, label: "Ansem's Study" },
        { offset: 0x10b3, bit: 3, label: "Crystal Fissure" },
      ];

    case 0x5: // Beast's Castle
      return [
        { offset: 0x10b0, bit: 7, label: "Parlor" },
        { offset: 0x10b1, bit: 0, label: "Belle's Room" },
        { offset: 0x10b1, bit: 2, label: "Dungeon" },
        { offset: 0x10b1, bit: 1, label: "The Beast's Room" },
      ];

    case 0x6: // Olympus Coliseum
      return [
        { offset: 0x10b4, bit: 0, label: "Underworld Entrance" },
        { offset: 0x10b4, bit: 2, label: "Cave of the Dead" },
        { offset: 0x10b4, bit: 3, label: "The Lock" },
        { offset: 0x10b3, bit: 7, label: "Coliseum Gates" },
        // { offset: 0x10B4, bit: 1, label: "Coliseum Foyer (disabled)" },
      ];

    case 0x7: // Agrabah
      return [
        { offset: 0x10b0, bit: 6, label: "The Peddler's Shop" },
        // { offset: 0x10B0, bit: 0, label: "The Peddler's Shop (disabled)" },
        { offset: 0x10b0, bit: 1, label: "Palace Walls" },
        { offset: 0x10b0, bit: 3, label: "Stone Guardians" },
        { offset: 0x10b0, bit: 5, label: "Chasm of Challenges" },
        { offset: 0x10b0, bit: 4, label: "Ruined Chamber" },
      ];

    case 0x8: // The Land of Dragons
      return [
        { offset: 0x10b5, bit: 0, label: "Bamboo Grove" },
        { offset: 0x10b5, bit: 1, label: "Village" },
        // { offset: 0x10B5, bit: 3, label: "Village (disabled)" },
        { offset: 0x10b5, bit: 2, label: "Throne Room" },
      ];

    case 0xa: // Pride Lands
      return [
        { offset: 0x10b4, bit: 5, label: "Gorge" },
        { offset: 0x10b4, bit: 6, label: "Oasis" },
        { offset: 0x10b4, bit: 4, label: "Stone Hollow" },
      ];

    case 0xb: // Atlantica
      return [
        { offset: 0x10b4, bit: 7, label: "Undersea Courtyard" },
      ];

    case 0xc: // Disney Castle
      return [
        { offset: 0x10b2, bit: 4, label: "Gummi Hangar" },
        { offset: 0x10b2, bit: 1, label: "Library" },
        { offset: 0x10b2, bit: 3, label: "Hall of the Cornerstone" },
        // { offset: 0x10B2, bit: 2, label: "The Hall of the Cornerstone (disabled)" },
      ];

    case 0xe: // Halloween Town
      return [
        { offset: 0x10b5, bit: 4, label: "Dr. Finkelstein's Lab" },
        { offset: 0x10b5, bit: 5, label: "Yuletide Hill" },
        { offset: 0x10b5, bit: 6, label: "Santa's House" },
      ];

    case 0x10: // Port Royal
      return [
        { offset: 0x10b1, bit: 3, label: "Rampart" },
        { offset: 0x10b1, bit: 5, label: "The Black Pearl" },
        // { offset: 0x10B1, bit: 6, label: "Isla de Muerta: Rock Face (disabled)" },
        // { offset: 0x10B2, bit: 0, label: "Isla de Muerta: Rock Face (disabled)" },
        { offset: 0x10b1, bit: 4, label: "The Interceptor" },
        // { offset: 0x10B1, bit: 7, label: "Ship Graveyard: The Interceptor's Hold (disabled)" },
      ];

    case 0x12: // The World That Never Was
      return [
        { offset: 0x10b2, bit: 5, label: "Alley to Between" },
        { offset: 0x10b2, bit: 6, label: "The Brink of Despair" },
        { offset: 0x10b2, bit: 7, label: "Twilight's View" },
        { offset: 0x10b3, bit: 1, label: "Proof of Existence" },
        { offset: 0x10b3, bit: 2, label: "The Altar of Naught" },
        { offset: 0x10b3, bit: 0, label: "Hall of Empty Melodies" },
      ];
  }

  return [];
}
