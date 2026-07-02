import type { Item } from "$lib/types";

export function timeFragment(name: string, offset: number): Item[] {
  return [
    {
      name,
      type: "group",
      mode: "time",
      items: [
        {
          offset,
          type: "variable",
          dataType: "uint16",
          operations: [
            { "*": 10 },
            {
              convert: {
                from: "milliseconds",
                to: "minutes",
              },
            },
          ],
          max: 9,
        },
        {
          offset,
          type: "variable",
          dataType: "uint16",
          operations: [
            { "*": 10 },
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
          offset,
          type: "variable",
          dataType: "uint16",
          operations: [
            { "*": 10 },
            {
              convert: {
                from: "milliseconds",
                to: "milliseconds",
              },
            },
          ],
          leadingZeros: 2,
          max: 990,
          step: 10,
        },
      ],
    },
    {
      id: "machine",
      name: "Machine",
      offset: offset + 0x2,
      type: "variable",
      dataType: "uint8",
      binary: {
        bitStart: 4,
        bitLength: 4,
      },
      resource: "machines",
    },
    {
      name: "???",
      offset: offset + 0x2,
      type: "variable",
      dataType: "uint8",
      binary: {
        bitStart: 0,
        bitLength: 4,
      },
      hidden: true,
    },
  ];
}
