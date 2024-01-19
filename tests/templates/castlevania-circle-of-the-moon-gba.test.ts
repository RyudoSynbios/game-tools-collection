import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "castlevania-circle-of-the-moon-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"   ,   "empty.sav", ['t|["General"]']],
    ["should load a deleted standard save"  , "deleted.sav", ['t|["General"]']],
    ["should load a standard save (Europe)" ,  "europe.sav", ['t|["General","Slot 7"]', "s|8", "c|92", "i|PASS", "w|QASS", "c|93"]],
    ["should load a standard save (USA)"    ,     "usa.sav", ['t|["General","Slot 3"]', "s|4", "c|f1", "i|PASS", "w|QASS", "c|f2"]],
    ["should load a standard save (Japan)"  ,   "japan.sav", ['t|["General","Slot 4"]', "s|5", "c|12", "i|PASS", "w|QASS", "c|13"]],
    ["should load a GameShark save (Europe)",  "europe.sps", ['t|["General","Slot 8"]', "s|9", "c|22", "i|PASS", "w|QASS", "c|23"]],
    ["should load a GameShark save (USA)"   ,     "usa.sps", ['t|["General","Slot 5"]', "s|6", "c|2b", "i|PASS", "w|QASS", "c|2c"]],
    ["should load a GameShark save (Japan)" ,   "japan.sps", ['t|["General","Slot 1"]', "s|2", "c|b4", "i|PASS", "w|QASS", "c|b5"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
