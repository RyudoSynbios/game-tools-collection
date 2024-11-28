import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "shining-force-3-saturn";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.bkr`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.bkr`);
  });

  // prettier-ignore
  test.each([
    ["should load a deleted standard save (Slot 1)"       ,        "deleted-slot1.bkr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000d065", "i|PASS"    , "w|QASS"     , "c|0x0000d066"]],
    ["should load a deleted standard save (Slot 2)"       ,        "deleted-slot2.bkr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000d109", "i|PASS"    , "w|QASS"     , "c|0x0000d10a"]],
    ["should load a filled BKR save (Patched)"            ,               "filled.bkr", ["r|scenario1", 't|["Slot 1"]'         , "s|2$1", "s|2$2", "s|1$3" , "c|0x0000d109", "i|PASS"    , "w|QASS"     , "c|0x0000d10a"]],
    ["should load a filled BCR save (Patched)"            ,               "filled.bcr", ["r|scenario3", 't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|8$3" , "c|0x000376db", "i|PASS"    , "w|QASS"     , "c|0x000376dc"]],
    ["should load a filled padded BKR save (Patched)"     ,           "filled-bkr.bin", ["r|scenario1", 't|["Slot 1"]'         , "s|2$1", "s|2$2", "s|1$3" , "c|0x0000d108", "i|PASS"    , "w|QASS"     , "c|0x0000d109"]],
    ["should load a filled padded BCR save (Patched)",                "filled-bcr.bin", ["r|scenario1", 't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000d108", "i|PASS"    , "w|QASS"     , "c|0x0000d109"]],
    ["should load a filled padded 4 MB BCR save (Patched)",       "filled-bcr-4mb.bin", ["r|scenario2", 't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "s|21$3", "c|0x000238fa", "i|PASS"    , "w|QASS"     , "c|0x000238fb"]],
    ["should load a BKR save (Scenario 1) (Europe)"       ,     "scenario1-europe.bkr", [               't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "s|1$3" , "c|0x0000d109", "i|PASS"    , "w|QASS"     , "c|0x0000d10a"]],
    ["should load a BKR save (Scenario 1) (USA)"          ,        "scenario1-usa.bkr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000d186", "i|PASS"    , "w|QASS"     , "c|0x0000d187"]],
    ["should load a BKR save (Scenario 1) (Japan)"        ,      "scenario1-japan.bkr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000f1f8", "i|PASS"    , "w|QASS"     , "c|0x0000f1f9"]],
    ["should load a BKR save (Scenario 1) (Japan) (Rev A)", "scenario1-japan-reva.bkr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|1$3" , "c|0x0000f341", "i|こ\"うかく", "w|さ\"うかく", "c|0x0000f342"]],
    ["should load a BCR save (Scenario 2) (Patched)"      ,    "scenario2-patched.bcr", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|21$3", "c|0x00023910", "i|PASS"    , "w|QASS"     , "c|0x00023911"]],
    ["should load a BCR save (Scenario 3) (Patched)"      ,    "scenario3-patched.bcr", [               't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "s|8$3" , "c|0x00037886", "i|PASS"    , "w|QASS"     , "c|0x00037887"]],
    ["should load a Hook save (Scenario 2) (Patched)"     ,       "scenario2-hook.bin", [               't|["Slot 1"]'         , "s|1$1", "s|2$2", "s|21$3", "c|0x0002381d", "i|PASS"    , "w|QASS"     , "c|0x0002381e"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
