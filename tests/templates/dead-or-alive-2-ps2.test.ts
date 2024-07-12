import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "dead-or-alive-2-ps2";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Europe)", "filled.ps2", ["c|0x16", "i|54$1", "i|10$2" , "w|55$1", "c|0x17"]],
    ["should load a standard save (Europe)"       , "europe.ps2", ["c|0xc9", "i|21$1", "i|30$2" , "w|22$1", "c|0xca"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
