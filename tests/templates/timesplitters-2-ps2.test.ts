import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "timesplitters-2-ps2";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  test.each([
    ["should load a filled standard save (USA)"   ,  "filled.ps2"      , ["r|usa"  , "c|0x913caf75", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x2f4cf94b"]],
    ["should load a filled standard save (Japan)" ,  "filled.ps2"      , ["r|japan", "c|0x9d7e58d9", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x6ce41301"]],
    ["should load a deleted standard save (Empty)", "deleted-empty.ps2", ['t|[]']],
    ["should load a standard save (Europe)"       ,  "europe.ps2"      , [           "c|0x7e676459", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xc0173267"]],
    ["should load a standard save (USA)"          ,     "usa.ps2"      , [           "c|0xb9782e98", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x48e26540"]],
    ["should load a standard save (Japan)"        ,   "japan.ps2"      , [           "c|0x1b32fa0d", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xa542ac33"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
