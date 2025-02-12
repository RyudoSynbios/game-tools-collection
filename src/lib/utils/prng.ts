export default class Prng {
  private seed: number;

  constructor(initialSeed: number, key: string) {
    this.seed = this.xmur3(initialSeed.toHex(8) + key);
  }

  // Adapted from https://github.com/bryc/code/blob/master/jshash/PRNGs.md#addendum-a-seed-generating-functions
  private xmur3(string: string): number {
    let h = 0x6a09e667 ^ string.length;

    for (let i = 0; i < string.length; i += 1) {
      h = Math.imul(h ^ string.charCodeAt(i), 0xcc9e2d51);
      h = (h << 0xd) | (h >>> 0x13);
    }

    h = Math.imul(h ^ (h >>> 0x10), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 0xd), 0xc2b2ae35);

    return (h ^= h >>> 0x10) >>> 0x0;
  }

  // Adapted from https://github.com/bryc/code/blob/master/jshash/PRNGs.md#sfc32
  private sfc32(a: number, b: number, c: number, d: number): number {
    a |= 0x0;
    b |= 0x0;
    c |= 0x0;
    d |= 0x0;

    const t = (((a + b) | 0x0) + d) | 0x0;

    d = (d + 0x1) | 0x0;
    a = b ^ (b >>> 0x9);
    b = (c + (c << 0x3)) | 0x0;
    c = (c << 0x15) | (c >>> 0xb);
    c = (c + t) | 0x0;

    return (t >>> 0x0) / 0x100000000;
  }

  private splitKey(key: string): [string, string, string] {
    const length = Math.floor(key.length / 3);

    const key1 = key.slice(0, length);
    const key2 = key.slice(length, length * 2);
    const key3 = key.slice(length * 2);

    return [key1, key2, key3];
  }

  private getNumber(key: string): number {
    const [k1, k2, k3] = this.splitKey(key);

    const a = this.xmur3(k1 + k2);
    const b = this.xmur3(k2 + k3);
    const c = this.xmur3(k3 + k1);
    const d = this.xmur3(k1 + k2 + k3 + this.seed);

    return this.sfc32(a, b, c, d);
  }

  public getInt(min: number, max: number, key: string): number {
    const int = this.getNumber(key);

    return Math.round(int * (max - min) + min);
  }

  public getFloat(min: number, max: number, key: string): number {
    const int = this.getNumber(key);

    return int * (max - min) + min;
  }
}
