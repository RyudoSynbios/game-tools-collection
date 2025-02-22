// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface BigInt {
    toHex: (length?: number) => string;
  }

  interface DataView {
    getBit: (offset: number, bit: number) => number;
    getLower4: (offset: number) => number;
    getUpper4: (offset: number) => number;
    getUint24: (offset: number, littleEndian?: boolean) => number;
    getInt24: (offset: number, littleEndian?: boolean) => number;
    setBit: (offset: number, bit: number, value) => void;
    setLower4: (offset: number, value: number) => void;
    setUpper4: (offset: number, value: number) => void;
    setUint24: (offset: number, value: number, littleEndian?: boolean) => void;
    setInt24: (offset: number, value: number, littleEndian?: boolean) => void;
  }

  interface Number {
    toBinary: (length?: number) => string;
    toBitCount: () => number;
    toEuler: () => number;
    toHex: (length?: number) => string;
  }

  interface String {
    format: (value: number) => string;
    reverse: () => string;
    splitInt: () => number[];
  }
}

export {};
