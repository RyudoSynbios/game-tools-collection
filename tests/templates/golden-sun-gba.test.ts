import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "golden-sun-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",         "japan.sav", ["r|italy"  , 't|["Slot 3"]'         , "n|こ\"うかく$1"]],
    ["should load a deleted standard save (Slot 3)"   , "deleted-slot3.sav", ["r|france" , 't|["Slot 3"]'         , "s|3", "c|5e92$1", "c|6912$2", "i|PASS$1"     , "i|18$2", "i|18$3", "w|19$2", "i|19$3", "c|5f0a$1", "c|694e$2"]],
    ["should load a standard save (Europe, USA)"      ,     "europeusa.sav", ["r|europe" , 't|["Slot 1"]'         , "s|1", "c|6033$1", "c|6a34$2", "i|PASS$1"     , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|5ead$1", "c|6971$2"]],
    ["should load a standard save (Japan)"            ,         "japan.sav", ["r|japan"  , 't|["Slot 3"]'         , "s|3", "c|7259$1", "c|722a$2", "i|こ\"うかく$1", "i|42$2", "i|42$3", "w|43$2", "i|43$3", "c|70d3$1", "c|7167$2"]],
    ["should load a standard save (France)"           ,        "france.sav", ["r|france" , 't|["Slot 1","Slot 3"]', "s|3", "c|5e92$1", "c|6912$2", "i|PASS$1"     , "i|18$2", "i|18$3", "w|19$2", "i|19$3", "c|5f0a$1", "c|694e$2"]],
    ["should load a standard save (Germany)"          ,       "germany.sav", ["r|germany", 't|["Slot 2"]'         , "s|2", "c|605c$1", "c|69a6$2", "i|PASS$1"     , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|5ed6$1", "c|68e3$2"]],
    ["should load a standard save (Italy)"            ,         "italy.sav", ["r|italy"  , 't|["Slot 2","Slot 3"]', "s|2", "c|5fa4$1", "c|69f3$2", "i|PASS$1"     , "i|01$2", "i|01$3", "w|02$2", "i|02$3", "c|601c$1", "c|6a2f$2"]],
    ["should load a standard save (Spain)"            ,         "spain.sav", ["r|spain"  , 't|["Slot 1"]'         , "s|1", "c|60d6$1", "c|6904$2", "i|PASS$1"     , "i|17$2", "i|17$3", "w|18$2", "i|18$3", "c|614e$1", "c|6940$2"]],
    ["should load a GameShark save (Europe, USA)"     ,     "europeusa.sps", ["r|usa"    , 't|["Slot 2"]'         , "s|2", "c|60ae$1", "c|6a5d$2", "i|PASS$1"     , "i|12$2", "i|12$3", "w|13$2", "i|13$3", "c|5f28$1", "c|699a$2"]],
    ["should load a GameShark save (Japan)"           ,         "japan.sps", ["r|japan"  , 't|["Slot 1"]'         , "s|1", "c|7241$1", "c|7222$2", "i|こ\"うかく$1", "i|29$2", "i|29$3", "w|30$2", "i|30$3", "c|70bb$1", "c|715f$2"]],
    ["should load a GameShark save (France)"          ,        "france.sps", ["r|france" , 't|["Slot 1"]'         , "s|1", "c|5d9c$1", "c|68c0$2", "i|PASS$1"     , "i|16$2", "i|16$3", "w|17$2", "i|17$3", "c|5e14$1", "c|68fc$2"]],
    ["should load a GameShark save (Germany)"         ,       "germany.sps", ["r|germany", 't|["Slot 3"]'         , "s|3", "c|6099$1", "c|69af$2", "i|PASS$1"     , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|5f13$1", "c|68ec$2"]],
    ["should load a GameShark save (Italy)"           ,         "italy.sps", ["r|italy"  , 't|["Slot 1"]'         , "s|1", "c|5f5d$1", "c|69d0$2", "i|PASS$1"     , "i|14$2", "i|14$3", "w|15$2", "i|15$3", "c|5fd5$1", "c|6a0c$2"]],
    ["should load a GameShark save (Spain)"           ,         "spain.sps", ["r|spain"  , 't|["Slot 2"]'         , "s|2", "c|62d4$1", "c|69a6$2", "i|PASS$1"     , "i|16$2", "i|16$3", "w|17$2", "i|17$3", "c|614e$1", "c|68e3$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
