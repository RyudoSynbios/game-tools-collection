import { getInt, getString } from "../bytes";
import { checkValidator } from "../validator";

type Game = "kh1" | "kh2";

const games: Record<Game, { count: number; offset: number; length: number }> = {
  kh1: { count: 0xc8, offset: 0x10d30, length: 0x16c40 },
  kh2: { count: 0x64, offset: 0x86d0, length: 0x10fc0 },
};

export class HDReMIXSave {
  private game: Game;
  private dataView: DataView;
  private _root: { name: string; offset: number }[];

  constructor(game: Game, dataView: DataView) {
    this.game = game;
    this.dataView = dataView;
    this._root = [];

    if (this.isKHRemixSaveFile()) {
      this.generateRoot();
    }
  }

  get root() {
    return this._root;
  }

  private isKHRemixSaveFile(): boolean {
    return checkValidator([0x89, 0x50, 0x4e, 0x47], 0x0, this.dataView);
  }

  private generateRoot(): void {
    this._root = [];

    const game = games[this.game];

    let offset = 0x70;
    let saveOffset = game.offset;

    for (let i = 0x0; i < game.count; i += 0x1) {
      let dataView = this.dataView;

      // We decrypt the first save file header
      if (i === 0x0) {
        const decryptedData = new Uint8Array(0x1c8);
        const xor = new Uint8Array(0x10);

        for (let i = 0x0; i < 0x10; i += 0x1) {
          xor[i] = getInt(0x150 + i, "uint8", {}, this.dataView);
        }

        for (let i = 0x70; i < 0x160; i += 0x1) {
          decryptedData[i] =
            getInt(i, "uint8", {}, this.dataView) ^ xor[i % 0x10];
        }

        dataView = new DataView(decryptedData.buffer);
      }

      const name = getString(offset, 0x40, "uint8", { endCode: 0x0 }, dataView);

      if (name.length > 0) {
        this._root.push({ name, offset: saveOffset });
      }

      offset += 0x158;
      saveOffset += game.length;
    }
  }

  public isInitialized(): boolean {
    return this._root.length > 0;
  }

  public destroy(): void {
    this.dataView = new DataView(new ArrayBuffer(0));
    this._root = [];
  }
}
