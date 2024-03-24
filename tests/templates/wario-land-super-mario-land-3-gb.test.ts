import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "wario-land-super-mario-land-3-gb";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save" ,   "empty.sav", ['t|[]']],
    ["should load a deleted standard save", "deleted.sav", ['t|[]']],
    ["should load a standard save (World)",   "world.sav", ['t|["Slot 3"]', "c|0x75", "i|20$1", "i|38$2", "w|21$1", "c|0x76"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
