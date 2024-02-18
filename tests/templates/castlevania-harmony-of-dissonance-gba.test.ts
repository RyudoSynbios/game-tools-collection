import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "castlevania-harmony-of-dissonance-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"   ,   "empty.sav", ['t|["General","Boss Rush Mode"]']],
    ["should load a deleted standard save"  , "deleted.sav", ['t|["General","Boss Rush Mode"]']],
    ["should load a standard save (Europe)" ,  "europe.sav", ['t|["General","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a standard save (USA)"    ,     "usa.sav", ['t|["General","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"  ,   "japan.sav", ['t|["General","Slot 2","Boss Rush Mode"]'         , "s|3", "i|PASS"]],
    ["should load a GameShark save (Europe)",  "europe.sps", ['t|["General","Slot 1","Slot 3","Boss Rush Mode"]', "s|2", "i|PASS"]],
    ["should load a GameShark save (USA)"   ,     "usa.sps", ['t|["General","Slot 1","Slot 2","Boss Rush Mode"]', "s|3", "i|PASS"]],
    ["should load a GameShark save (Japan)" ,   "japan.sps", ['t|["General","Slot 1","Slot 3","Boss Rush Mode"]', "s|4", "i|PASS"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
