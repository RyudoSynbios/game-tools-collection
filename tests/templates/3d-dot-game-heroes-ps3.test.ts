import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "3d-dot-game-heroes-ps3";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a Main save (Europe)"  , "europe/DATA.SAV", ["r|europe", 't|["General","Inventory","Bestiary","Loading Art","Options"]', "i|PASS$1", "i|57$2"]],
    ["should load a Main save (USA)"     ,    "usa/DATA.SAV", ["r|usa"   , 't|["General","Inventory","Bestiary","Loading Art","Options"]', "i|PASS$1", "i|58$2"]],
    ["should load a Main save (Japan)"   ,  "japan/DATA.SAV", ["r|japan" , 't|["General","Inventory","Bestiary","Options"]'              , "i|PASS$1", "i|57$2"]],
    ["should load a System save (Europe)",  "europe/SYS.DAT", ["r|europe", 't|["System"]']],
    ["should load a System save (USA)"   ,     "usa/SYS.DAT", ["r|usa"   , 't|["System"]']],
    ["should load a System save (Japan)" ,   "japan/SYS.DAT", ["r|japan" , 't|["System"]']],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
