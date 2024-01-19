import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "legend-of-zelda-the-majora-s-mask-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.fla`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.fla`);
  });

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",    "japan-rev1.fla", ["r|europe", 't|["Slot 1","Slot 2","Slot 3"]', "n|PASS"]],
    ["should load a deleted standard save (Slot 2)"   , "deleted-slot2.fla", ["r|europe", 't|["Slot 2"]'                  , "s|2$1", "c|69f7", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|69f8"]],
    ["should load a standard save (Europe)"           ,        "europe.fla", ["r|europe", 't|["Slot 1"]'                  , "s|1$1", "c|6a03", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|6a04"]],
    ["should load a standard save (Europe) (Rev 1)"   ,   "europe-rev1.fla", ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|69fb", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|69fc"]],
    ["should load a standard save (USA)"              ,           "usa.fla", ["r|usa"   , 't|["Slot 1"]'                  , "s|1$1", "c|684f", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|59$2", "c|6850"]],
    ["should load a standard save (Japan)"            ,         "japan.fla", [            't|["Slot 3"]'                  , "s|3$1", "c|7c77", "i|PASS", "w|QASS"                             , "c|7c78"]],
    ["should load a standard save (Japan) (Rev 1)"    ,    "japan-rev1.fla", ["r|japan" , 't|["Slot 2","Slot 3"]'         , "s|3$1", "c|7c90", "i|PASS", "w|QASS"                             , "c|7c91"]],
    ["should load a SRM save (Europe)"                ,        "europe.srm", ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|68c6", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|56$2", "c|68c7"]],
    ["should load a SRM save (Europe) (Rev 1)"        ,   "europe-rev1.srm", ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|1$1", "c|69f5", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|69f6"]],
    ["should load a SRM save (USA)"                   ,           "usa.srm", ["r|usa"   , 't|["Slot 2"]'                  , "s|2$1", "c|6801", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|6802"]],
    ["should load a SRM save (Japan)"                 ,         "japan.srm", ["r|japan" , 't|["Slot 1","Slot 2","Slot 3"]', "s|3$1", "c|7e6f", "i|PASS", "w|QASS"                             , "c|7e70"]],
    ["should load a SRM save (Japan) (Rev 1)"         ,    "japan-rev1.srm", ["r|japan" , 't|["Slot 1","Slot 2","Slot 3"]', "s|2$1", "c|7e6f", "i|PASS", "w|QASS"                             , "c|7e70"]],
    ["should load a DexDrive save (Europe)"           ,        "europe.n64", ["r|europe", 't|["Slot 1"]'                  , "s|1$1", "c|69e6", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|69e7"]],
    ["should load a DexDrive save (Europe) (Rev 1)"   ,   "europe-rev1.n64", ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|6800", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|6801"]],
    ["should load a DexDrive save (USA)"              ,           "usa.n64", ["r|usa"   , 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|694c", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|26$2", "c|694d"]],
    ["should load a DexDrive save (Japan)"            ,         "japan.n64", ["r|japan" , 't|["Slot 2"]'                  , "s|2$1", "c|7c8f", "i|PASS", "w|QASS"                             , "c|7c90"]],
    ["should load a DexDrive save (Japan) (Rev 1)"    ,    "japan-rev1.n64", ["r|japan" , 't|["Slot 1"]'                  , "s|1$1", "c|7e75", "i|PASS", "w|QASS"                             , "c|7e76"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
