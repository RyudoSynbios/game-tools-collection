import type { ItemGroup, ItemTabs } from "$lib/types";

import type { EventRange } from "./resource";

const difficulties = ["Easy", "Normal", "Hard"];

export function eventsFragment(offset: number, events: EventRange[]): ItemTabs {
  return {
    type: "tabs",
    items: difficulties.map((difficulty, difficultyIndex) => ({
      name: difficulty,
      items: [
        {
          type: "tabs",
          vertical: true,
          flex: true,
          items: events.map((range, rangeIndex) => ({
            name: range.name,
            items: range.events.map((event, index) => {
              const shift = difficultyIndex * 0xcc + event.index * 0x4;

              index += rangeIndex * 10;

              return {
                name: event.name,
                type: "section",
                flex: true,
                items: [
                  {
                    id: `eventProgression-${difficultyIndex}-${index}`,
                    name: "Progression",
                    offset: offset + shift,
                    type: "variable",
                    dataType: "uint8",
                    binary: {
                      bitStart: 6,
                      bitLength: 2,
                    },
                    resource: "eventProgressions",
                  },
                  (event.type === "Time" &&
                    chronoFragment("Time", offset + 0x1 + shift, "uint24")) || {
                    name: event.type,
                    offset: offset + 0x1 + shift,
                    type: "variable",
                    dataType: "uint24",
                    bigEndian: true,
                    max: 99999,
                  },
                ],
              };
            }),
          })),
        },
      ],
    })),
  };
}

export function chronoFragment(
  name: string,
  offset: number,
  dataType: "uint24" | "uint32",
  id?: string,
): ItemGroup {
  return {
    id,
    name,
    type: "group",
    mode: "chrono",
    items: [
      {
        offset,
        type: "variable",
        dataType,
        bigEndian: true,
        operations: [
          { "/": 60 },
          {
            convert: {
              from: "seconds",
              to: "minutes",
            },
          },
        ],
        max: 59,
      },
      {
        offset,
        type: "variable",
        dataType,
        bigEndian: true,
        operations: [
          { "/": 60 },
          {
            convert: {
              from: "seconds",
              to: "seconds",
            },
          },
        ],
        leadingZeros: 1,
        max: 59,
      },
      {
        offset,
        type: "variable",
        dataType,
        bigEndian: true,
        operations: [
          { "/": 60 },
          {
            convert: {
              from: "seconds",
              to: "milliseconds",
            },
          },
          { round: 0 },
        ],
        leadingZeros: 2,
        max: 999,
        step: 100,
      },
    ],
  };
}

export function timeFragment(
  name: string,
  offset: number,
  isAdventure = false,
): ItemGroup {
  return {
    name,
    type: "group",
    mode: "time",
    items: [
      {
        offset,
        type: "variable",
        dataType: "uint32",
        bigEndian: true,
        operations: [
          isAdventure ? { "/": 60 } : {},
          {
            convert: {
              from: "seconds",
              to: "hours",
            },
          },
        ],
        max: 99999,
      },
      {
        offset,
        type: "variable",
        dataType: "uint32",
        bigEndian: true,
        operations: [
          isAdventure ? { "/": 60 } : {},
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
      {
        offset,
        type: "variable",
        dataType: "uint32",
        bigEndian: true,
        operations: [
          isAdventure ? { "/": 60 } : {},
          {
            convert: {
              from: "seconds",
              to: "seconds",
            },
          },
        ],
        leadingZeros: 1,
        max: 59,
      },
    ],
  };
}
