import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "grandia-ii-ps2";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Europe)" , "filled.ps2"       , ["r|europe" , 't|["Slot 1","Slot 10"]' , "s|2$1", "i|08$1", "i|32$2"]],
    ["should load a filled standard save (USA)"    , "filled.ps2"       , ["r|usa"    , 't|["Slot 10"]'          , "s|1$1", "i|08$1", "i|26$2"]],
    ["should load a deleted standard save (Slot 9)", "deleted-slot9.ps2", [             't|["Slot 9"]'           , "s|1$1", "i|11$1", "i|21$2"]],
    ["should load a standard save (Europe)"        , "europe.ps2"       , [             't|["Slot 3"]'           , "s|1$1", "i|08$1", "i|35$2"]],
    ["should load a standard save (USA)"           , "usa.ps2"          , [             't|["Slot 6"]'           , "s|1$1", "i|09$1", "i|16$2"]],
    ["should load a standard save (Japan, Asia)"   , "japanasia.ps2"    , [             't|["Slot 2","Slot 9"]'  , "s|1$1", "i|11$1", "i|07$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
