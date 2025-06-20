export const itemQuantites: {
  [key: string]: {
    shift: number;
    dataType: "uint8" | "uint16";
    bitStart: number;
    valuesMax: number[];
  };
} = {
  rupees: {
    shift: 0x80,
    dataType: "uint16",
    bitStart: 4,
    valuesMax: [99, 200, 500],
  },
  bombs: {
    shift: 0x15,
    dataType: "uint8",
    bitStart: 3,
    valuesMax: [0, 20, 30, 40],
  },
  arrows: {
    shift: 0x1a,
    dataType: "uint8",
    bitStart: 0,
    valuesMax: [0, 30, 40, 50],
  },
};
