export const itemQuantites: {
  [key: string]: {
    shift: number;
    dataType: "uint8" | "uint16";
    valuesMax: number[];
  };
} = {
  rupees: {
    shift: -0x18,
    dataType: "uint16",
    valuesMax: [99, 300, 500, 999],
  },
  bombs: {
    shift: 0x2,
    dataType: "uint8",
    valuesMax: [10, 30, 50, 99],
  },
  arrows: {
    shift: 0x2,
    dataType: "uint8",
    valuesMax: [30, 50, 70, 99],
  },
};
