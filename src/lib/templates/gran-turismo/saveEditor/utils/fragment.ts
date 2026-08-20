import { bitToOffset } from "$lib/utils/bytes";

import type { Item, ItemBitflags, ItemSection } from "$lib/types";

import { PART_OFFSETS } from "./constants";
import { partSubtypes, type Car, type Part } from "./resource";

export function partFragment(car: Car, part: Part): ItemBitflags {
  return {
    name: part.name,
    type: "bitflags",
    flags: part.subtypes
      .filter((_, index) => index > 0)
      .map((subtype, index) => {
        const carPart = car.parts[part.dataIndex + index];

        // By default, we use a value that always return 0x0 to display an
        // unchecked checkbox if the car doesn't have this part
        let offset = PART_OFFSETS[0x13];
        let bit = 0;

        if (carPart) {
          offset = PART_OFFSETS[part.index] + bitToOffset(carPart);
          bit = carPart % 8;
        }

        return {
          offset,
          bit,
          label: partSubtypes[subtype],
          disabled: carPart === undefined,
        };
      }),
  };
}

export function timeFragment(
  type: "arcade" | "license" | "mainRace" | "speedChallenge" | "standard",
  offset: number,
  name = "",
): ItemSection {
  let nameOffset = offset;
  let timeOffset = offset + 0xc;
  let carOffset = offset + 0x10;

  if (type === "arcade") {
    timeOffset = offset + 0x4;
    carOffset = offset + 0x8;
  }

  return {
    name,
    type: "section",
    flex: true,
    items: [
      ...((type !== "mainRace"
        ? [
            {
              name: "Name",
              offset: nameOffset,
              length: 0xb,
              type: "variable",
              dataType: "string",
              letterDataType: "uint8",
              fallback: 0x20,
              endCode: 0x0,
              regex: "[ -~]",
            },
          ]
        : []) as Item[]),
      type === "speedChallenge"
        ? {
            name: "Speed",
            offset: timeOffset,
            type: "variable",
            dataType: "uint32",
            max: 9999,
          }
        : {
            name: "Time",
            type: "group",
            mode: "chrono",
            items: [
              {
                id: "time",
                offset: timeOffset,
                type: "variable",
                dataType: "uint32",
                operations: [
                  {
                    convert: {
                      from: "milliseconds",
                      to: "minutes",
                    },
                  },
                ],
                leadingZeros: 1,
                max: 59,
              },
              {
                id: "time",
                offset: timeOffset,
                type: "variable",
                dataType: "uint32",
                operations: [
                  {
                    convert: {
                      from: "milliseconds",
                      to: "seconds",
                    },
                  },
                ],
                leadingZeros: 1,
                max: 59,
              },
              {
                id: "time",
                offset: timeOffset,
                type: "variable",
                dataType: "uint32",
                operations: [
                  {
                    convert: {
                      from: "milliseconds",
                      to: "milliseconds",
                    },
                  },
                ],
                leadingZeros: 2,
                max: 999,
              },
            ],
          },
      ...((type !== "license"
        ? [
            {
              id: "raceCar",
              name: "Car",
              offset: carOffset,
              type: "variable",
              dataType: "uint16",
              resource: "raceCars",
              size: "lg",
              autocomplete: true,
            },
          ]
        : []) as Item[]),
    ],
  };
}
