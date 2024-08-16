import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "diablo-ii-lord-of-destruction-windows";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an uninitialized standard save", async () => {
    await saveShouldBeRejected(`${game}/uninitialized.d2s`);
  });

  it("should not load a standard save with version below 1.10", async () => {
    await saveShouldBeRejected(`${game}/badversion.d2s`);
  });

  // prettier-ignore
  test.each([
    ["should load a standard save (World)",   "world.d2s", ["c|0x52bc02bd", "s|2$1", "i|PASS$1", "i|1$2", "w|QASS$1", "c|0x52bc02be"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
