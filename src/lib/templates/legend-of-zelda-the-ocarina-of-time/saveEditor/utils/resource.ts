export const itemQuantites: {
  [key: string]: {
    shift: number;
    dataType: "uint8" | "uint16";
    bitStart: number;
    valuesMax: number[];
  };
} = {
  rupees: {
    shift: 0x6e,
    dataType: "uint16",
    bitStart: 4,
    valuesMax: [99, 200, 500],
  },
  dekuSticks: {
    shift: 0x15,
    dataType: "uint8",
    bitStart: 1,
    valuesMax: [0, 10, 20, 30],
  },
  dekuNuts: {
    shift: 0x14,
    dataType: "uint8",
    bitStart: 4,
    valuesMax: [0, 20, 30, 40],
  },
  bombs: {
    shift: 0x15,
    dataType: "uint8",
    bitStart: 3,
    valuesMax: [0, 20, 30, 40],
  },
  arrows: {
    shift: 0x14,
    dataType: "uint8",
    bitStart: 0,
    valuesMax: [0, 30, 40, 50],
  },
  dekuSeeds: {
    shift: 0x10,
    dataType: "uint8",
    bitStart: 6,
    valuesMax: [0, 30, 40, 50],
  },
};
