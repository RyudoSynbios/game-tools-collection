import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "wario-land-3-gbc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  it("should not load a standard Level save (World)", async () => {
    await saveShouldBeRejected(`${game}/world-level.sav`);
  });

  // prettier-ignore
  test.each([
    ["should load a standard World Map save (World)", "world-worldmap.sav", ["c|0x257f", "i|4$1", "i|2$2", "w|3$2", "c|0x2580"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
