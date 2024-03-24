import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "donkey-kong-land-gb";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"       ,     "empty.sav", ['t|[]']],
    ["should load a deleted standard save"      ,   "deleted.sav", ['t|[]']],
    ["should load a standard save (Europe, USA)", "europeusa.sav", ['t|["Slot 2"]', "c|0x2840", "i|00$1", "i|02$2", "i|13$3", "w|01$1", "c|0x2941"]],
    ["should load a standard save (Japan)"      ,     "japan.sav", ['t|["Slot 3"]', "c|0x4a7e", "i|00$1", "i|00$2", "i|49$3", "w|01$1", "c|0x4b7f"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
