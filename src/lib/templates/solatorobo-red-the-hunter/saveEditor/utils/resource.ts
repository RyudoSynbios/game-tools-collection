import { Resource } from "$lib/types";

// prettier-ignore
export const locationList: {
  [key: string]: {
    area: number;
    preview: number;
    zone: number;
    coordinates: [number, number, number];
    name: string;
  };
} = {
  0x00: { area: 0x00, preview: 0x0a, zone: 0x01, coordinates: [ 20000,   -5340, -49000], name: "Vizsla" },
  0x01: { area: 0x00, preview: 0x04, zone: 0x0a, coordinates: [ 16000,       0,  68000], name: "Hindenburg" },
  0x02: { area: 0x00, preview: 0x09, zone: 0x08, coordinates: [-33000,     420,   2700], name: "Davren Islands" },
  0x03: { area: 0x00, preview: 0x05, zone: 0x01, coordinates: [ -9800,     208, -24000], name: "Airedale" },
  0x04: { area: 0x00, preview: 0x07, zone: 0x02, coordinates: [ -9800,       0, -39500], name: "Spinon" },
  0x05: { area: 0x00, preview: 0x0e, zone: 0x01, coordinates: [ -1000,       0, -44000], name: "Shetland" },
  0x06: { area: 0x00, preview: 0x10, zone: 0x0e, coordinates: [ 22600,       0,  -9800], name: "Royal Envy" },
  0x07: { area: 0x00, preview: 0x11, zone: 0x01, coordinates: [-13500,       0, -25000], name: "Basset" },
  0x08: { area: 0x00, preview: 0x14, zone: 0x00, coordinates: [-41000,       0,  17000], name: "Samoyede" },
  0x09: { area: 0x00, preview: 0x18, zone: 0x02, coordinates: [     0,       0, -17000], name: "Golden Roar" },
  0x0a: { area: 0x00, preview: 0x19, zone: 0x0a, coordinates: [ 88000,   17746, 111000], name: "Lares" },
  0x0b: { area: 0x00, preview: 0x1a, zone: 0x00, coordinates: [-19000,    1640,  26000], name: "Pharaoh" },
  0x0c: { area: 0x00, preview: 0x20, zone: 0x00, coordinates: [-34000,   10032,  40000], name: "Mau" },
  0x0d: { area: 0x00, preview: 0x23, zone: 0x00, coordinates: [0,          424, -10000], name: "Sealyham" },
  0x0e: { area: 0x01, preview: 0x25, zone: 0x06, coordinates: [-16000, -222048,  38000], name: "Earth" },
  0x0f: { area: 0x00, preview: 0x26, zone: 0x07, coordinates: [-60000,    2704, -26000], name: "Lemures" },
  0x11: { area: 0x00, preview: 0x28, zone: 0x01, coordinates: [-18432,     204,      0], name: "Duel Ship" },
  0xff: { area: 0xff, preview: 0x00, zone: 0xff, coordinates: [     0,       0,      0], name: "Asmodeus" },
};

export const locations = Object.entries(locationList).reduce(
  (locations: Resource, [index, location]) => {
    locations[parseInt(index)] = location.name;

    return locations;
  },
  {},
);
