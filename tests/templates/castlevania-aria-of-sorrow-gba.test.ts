import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "castlevania-aria-of-sorrow-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"             ,   "empty.sav", ["r|europe", 't|["General"]'         , "i|English"]],
    ["should load a deleted standard save"            , "deleted.sav", ["r|japan" , 't|["General"]'         , "i|Japanese"]],
    ["should not load a standard save with bad region",   "empty.sav", ["r|japan" , 't|["General"]'         , "n|English"]],
    ["should load a standard save (Europe)"           ,  "europe.sav", ["r|europe", 't|["General","Slot 2"]', "i|French",   "s|3", "i|PASS"]],
    ["should load a standard save (USA)"              ,     "usa.sav", ["r|usa"   , 't|["General","Slot 1"]', "i|English",  "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"            ,   "japan.sav", ["r|japan" , 't|["General","Slot 3"]', "i|Japanese", "s|4", "i|PASS"]],
    ["should load a GameShark save (Europe)"          ,  "europe.sps", ["r|europe", 't|["General","Slot 2"]', "i|German",   "s|3", "i|PASS"]],
    ["should load a GameShark save (USA)"             ,     "usa.sps", ["r|usa"   , 't|["General","Slot 3"]', "i|English",  "s|4", "i|PASS"]],
    ["should load a GameShark save (Japan)"           ,   "japan.sps", ["r|japan" , 't|["General","Slot 1"]', "i|Japanese", "s|2", "i|PASS"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
