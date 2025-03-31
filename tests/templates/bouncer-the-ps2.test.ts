import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "bouncer-the-ps2";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Europe)", "filled.ps2", ["r|europe", 't|["Slot 10"]'         , "s|10$1", "c|0x20c27530", "i|00$1", "i|57$2", "w|58$2", "c|0x849db3b2"]],
    ["should load a filled standard save (Japan)" , "filled.ps2", ["r|japan" , 't|["Slot 2","Slot 3"]' , "s|3$1" , "c|0x2b804a0f", "i|01$1", "i|54$2", "w|55$2", "c|0xb038c3a9"]],
    ["should load a standard save (Europe)"       , "europe.ps2", [            't|["Slot 6","Slot 14"]', "s|14$1", "c|0x2070257e", "i|02$1", "i|40$2", "w|41$2", "c|0x3802567b"]],
    ["should load a standard save (USA)"          ,    "usa.ps2", [            't|["Slot 1","Slot 16"]', "s|1$1" , "c|0x9db2acb0", "i|00$1", "i|52$2", "w|53$2", "c|0x4fa4333b"]],
    ["should load a standard save (Japan)"        ,  "japan.ps2", [            't|["Slot 3"]'          , "s|3$1" , "c|0x4ff1883b", "i|01$1", "i|22$2", "w|23$2", "c|0xb9378351"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
