import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "shining-force-3-scenario-1-saturn";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.bkr`);
  });

  // prettier-ignore
  test.each([
    ["should load a deleted standard save (Europe)",       "deleted.bkr", ['t|[]']],
    ["should load a deleted standard save (Slot 1)", "deleted-slot1.bkr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|d065", "i|PASS"    , "w|QASS"     , "c|d066"]],
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.bkr", ['t|["Slot 2"]'         , "s|2$1", "s|2$2", "c|d109", "i|PASS"    , "w|QASS"     , "c|d0ca"]],
    ["should load a standard save (Europe)"        ,        "europe.bkr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|d109", "i|PASS"    , "w|QASS"     , "c|d0ca"]],
    ["should load a standard save (USA)"           ,           "usa.bkr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|d186", "i|PASS"    , "w|QASS"     , "c|d147"]],
    ["should load a standard save (Japan)"         ,         "japan.bkr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|f1f8", "i|PASS"    , "w|QASS"     , "c|f1b9"]],
    ["should load a standard save (Japan) (Rev A)" ,    "japan-reva.bkr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|f341", "i|こ\"うかく", "w|さ\"うかく", "c|f322"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
