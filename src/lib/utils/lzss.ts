// Adapted from https://github.com/crosswire/jsword-migration/blob/master/jsword/src/main/java/org/crosswire/common/compress/LZSS.java
export default class Lzss {
  private maxLength: number;
  private minLength: number;
  private bufferSize: number;
  private bufferIndex: number;
  private bufferMask: number;
  private notUsed: number;
  private buffer: Uint8Array;
  private dad: Uint16Array;
  private leftSon: Uint16Array;
  private rightSon: Uint16Array;
  private matchOffset: number;
  private matchLength: number;

  constructor(options?: {
    bufferSize?: number;
    maxLength?: number;
    minLength?: number;
  }) {
    this.maxLength = options?.maxLength || 0x12;
    this.minLength = options?.minLength || 0x3;
    this.bufferSize = options?.bufferSize || 0x1000;
    this.bufferIndex = 0;
    this.bufferMask = this.bufferSize - 0x1;
    this.notUsed = this.bufferSize;

    this.matchOffset = 0x0;
    this.matchLength = 0x0;

    this.buffer = new Uint8Array(this.bufferSize + this.maxLength - 0x1);
    this.dad = new Uint16Array(this.bufferSize + 0x1);
    this.leftSon = new Uint16Array(this.bufferSize + 0x1);
    this.rightSon = new Uint16Array(this.bufferSize + 0x101);
  }

  private initTree(): void {
    this.dad.fill(this.notUsed);
    this.leftSon.fill(this.notUsed);
    this.rightSon.fill(this.notUsed);
  }

  private insertNode(index: number): void {
    if (index < 0x0 && index >= this.bufferSize) {
      return;
    }

    let cmp = 0x1;

    let p = this.bufferSize + 0x1 + this.buffer[index];

    if (p <= this.bufferSize) {
      return;
    }

    this.leftSon[index] = this.notUsed;
    this.rightSon[index] = this.notUsed;

    this.matchLength = 0x0;

    while (true) {
      if (cmp >= 0x0) {
        if (this.rightSon[p] !== this.notUsed) {
          p = this.rightSon[p];
        } else {
          this.rightSon[p] = index;
          this.dad[index] = p;
          return;
        }
      } else {
        if (this.leftSon[p] !== this.notUsed) {
          p = this.leftSon[p];
        } else {
          this.leftSon[p] = index;
          this.dad[index] = p;
          return;
        }
      }

      let i = 0x1;

      while (i < this.maxLength) {
        cmp = this.buffer[index + i] - this.buffer[p + i];
        if (cmp !== 0x0) {
          break;
        }

        i += 0x1;
      }

      if (i > this.matchLength) {
        this.matchOffset = p;
        this.matchLength = i;

        if (i >= this.maxLength) {
          break;
        }
      }
    }

    this.dad[index] = this.dad[p];
    this.leftSon[index] = this.leftSon[p];
    this.rightSon[index] = this.rightSon[p];

    this.dad[this.leftSon[p]] = index;
    this.dad[this.rightSon[p]] = index;

    if (this.rightSon[this.dad[p]] === p) {
      this.rightSon[this.dad[p]] = index;
    } else {
      this.leftSon[this.dad[p]] = index;
    }

    this.dad[p] = this.notUsed;
  }

  private deleteNode(index: number): void {
    if (index < 0x0 && index >= this.bufferSize + 0x1) {
      return;
    }

    let q;

    if (this.dad[index] === this.notUsed) {
      return;
    }

    if (this.rightSon[index] === this.notUsed) {
      q = this.leftSon[index];
    } else if (this.leftSon[index] === this.notUsed) {
      q = this.rightSon[index];
    } else {
      q = this.leftSon[index];

      if (this.rightSon[q] !== this.notUsed) {
        while (this.rightSon[q] !== this.notUsed) {
          q = this.rightSon[q];
        }

        this.rightSon[this.dad[q]] = this.leftSon[q];
        this.dad[this.leftSon[q]] = this.dad[q];
        this.leftSon[q] = this.leftSon[index];
        this.dad[this.leftSon[index]] = q;
      }

      this.rightSon[q] = this.rightSon[index];
      this.dad[this.rightSon[index]] = q;
    }

    this.dad[q] = this.dad[index];

    if (this.rightSon[this.dad[index]] === index) {
      this.rightSon[this.dad[index]] = q;
    } else {
      this.leftSon[this.dad[index]] = q;
    }

    this.dad[index] = this.notUsed;
  }

  public compress(data: Uint8Array): Uint8Array {
    const compressedData: number[] = [];

    const dataTmp = new Uint8Array(0x11);

    let nodeIndex = this.bufferSize - this.maxLength;
    let flagPosition = 0x1;
    let mask = 0x1;

    this.initTree();

    const part = data.slice(0x0, this.maxLength);

    this.buffer.set(part, nodeIndex);

    let size = part.length;

    if (size <= 0x0) {
      return new Uint8Array(compressedData);
    }

    let offset = size;

    for (let i = 0x1; i <= this.maxLength; i += 0x1) {
      this.insertNode(nodeIndex - i);
    }

    this.insertNode(nodeIndex);

    while (size > 0x0) {
      if (this.matchLength > size) {
        this.matchLength = size;
      }

      if (this.matchLength < this.minLength) {
        this.matchLength = 0x1;

        dataTmp[0] |= mask;
        dataTmp[flagPosition++] = this.buffer[nodeIndex];
      } else {
        const countMask = this.maxLength - this.minLength;
        const wordShift = 0x8 - countMask.toBitCount();

        dataTmp[flagPosition++] = this.matchOffset;
        dataTmp[flagPosition++] =
          ((this.matchOffset >> wordShift) & (0xff - countMask)) |
          (this.matchLength - this.minLength);
      }

      mask = (mask << 0x1) & 0xff;

      if (mask === 0x0) {
        compressedData.push(...dataTmp.slice(0x0, flagPosition));

        dataTmp[0] = 0x0;
        flagPosition = 0x1;
        mask = 0x1;
      }

      const lastMatchLength = this.matchLength;

      let i = 0x0;

      while (i < lastMatchLength) {
        const value = data[offset++];

        if (value === undefined) {
          break;
        }

        this.deleteNode(this.bufferIndex);

        this.buffer[this.bufferIndex] = value;

        if (this.bufferIndex < this.maxLength - 0x1) {
          this.buffer[this.bufferIndex + this.bufferSize] = value;
        }

        this.bufferIndex = (this.bufferIndex + 0x1) & this.bufferMask;
        nodeIndex = (nodeIndex + 0x1) & this.bufferMask;

        this.insertNode(nodeIndex);

        i += 0x1;
      }

      while (i < lastMatchLength) {
        this.deleteNode(this.bufferIndex);

        this.bufferIndex = (this.bufferIndex + 0x1) & this.bufferMask;
        nodeIndex = (nodeIndex + 0x1) & this.bufferMask;

        if (size !== 0x0) {
          this.insertNode(nodeIndex);
          size -= 0x1;
        }

        i += 0x1;
      }
    }

    if (flagPosition > 1) {
      compressedData.push(...dataTmp.slice(0x0, flagPosition));
    }

    return new Uint8Array(compressedData);
  }

  public decompress(data: Uint8Array, size: number): Uint8Array {
    const decompressedData = [];

    let offset = 0x0;

    while (decompressedData.length < size) {
      let flags = data[offset++];
      let mask = 0x80;

      while (mask > 0x0) {
        if (flags & 0x1) {
          const value = data[offset++];

          decompressedData.push(value);

          this.buffer[this.bufferIndex] = value;
          this.bufferIndex = (this.bufferIndex + 0x1) & this.bufferMask;
        } else {
          const special1 = data[offset++];
          const special2 = data[offset++];

          const countMask = this.maxLength - this.minLength;
          const wordShift = 0x8 - countMask.toBitCount();

          const position =
            this.maxLength +
            (((special2 & (0xff - countMask)) << wordShift) | special1);
          const count = this.minLength + (special2 & countMask);

          for (let j = 0; j < count; j += 1) {
            const value = this.buffer[(position + j) & this.bufferMask];

            decompressedData.push(value);

            this.buffer[this.bufferIndex] = value;
            this.bufferIndex = (this.bufferIndex + 0x1) & this.bufferMask;
          }
        }

        if (decompressedData.length === size) {
          break;
        }

        mask >>= 0x1;
        flags >>= 0x1;
      }
    }

    return new Uint8Array(decompressedData);
  }
}
