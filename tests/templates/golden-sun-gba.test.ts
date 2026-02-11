import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  saveShouldBeRejected,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",         "japan.sav", ["r|italy"  , 't|["Slot 3"]'         , "n|こﾞうかく$1"]],
    ["should load a deleted standard save (Slot 3)"   , "deleted-slot3.sav", ["r|france" , 't|["Slot 3"]'         , "s|3", "c|0x5e92$1", "c|0x6912$2", "i|PASS$1"    , "i|18$2", "i|18$3", "w|19$2", "i|19$3", "c|0x5f0a$1", "c|0x694e$2"]],
    ["should load a standard save (Europe, USA)"      ,     "europeusa.sav", ["r|europe" , 't|["Slot 1"]'         , "s|1", "c|0x6033$1", "c|0x6a34$2", "i|PASS$1"    , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|0x5ead$1", "c|0x6971$2"]],
    ["should load a standard save (Japan)"            ,         "japan.sav", ["r|japan"  , 't|["Slot 3"]'         , "s|3", "c|0x7259$1", "c|0x722a$2", "i|こﾞうかく$1", "i|42$2", "i|42$3", "w|43$2", "i|43$3", "c|0x70d3$1", "c|0x7167$2"]],
    ["should load a standard save (France)"           ,        "france.sav", ["r|france" , 't|["Slot 1","Slot 3"]', "s|3", "c|0x5e92$1", "c|0x6912$2", "i|PASS$1"    , "i|18$2", "i|18$3", "w|19$2", "i|19$3", "c|0x5f0a$1", "c|0x694e$2"]],
    ["should load a standard save (Germany)"          ,       "germany.sav", ["r|germany", 't|["Slot 2"]'         , "s|2", "c|0x605c$1", "c|0x69a6$2", "i|PASS$1"    , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|0x5ed6$1", "c|0x68e3$2"]],
    ["should load a standard save (Italy)"            ,         "italy.sav", ["r|italy"  , 't|["Slot 2","Slot 3"]', "s|2", "c|0x5fa4$1", "c|0x69f3$2", "i|PASS$1"    , "i|01$2", "i|01$3", "w|02$2", "i|02$3", "c|0x601c$1", "c|0x6a2f$2"]],
    ["should load a standard save (Spain)"            ,         "spain.sav", ["r|spain"  , 't|["Slot 1"]'         , "s|1", "c|0x60d6$1", "c|0x6904$2", "i|PASS$1"    , "i|17$2", "i|17$3", "w|18$2", "i|18$3", "c|0x614e$1", "c|0x6940$2"]],
    ["should load a GameShark save (Europe, USA)"     ,     "europeusa.sps", ["r|usa"    , 't|["Slot 2"]'         , "s|2", "c|0x60ae$1", "c|0x6a5d$2", "i|PASS$1"    , "i|12$2", "i|12$3", "w|13$2", "i|13$3", "c|0x5f28$1", "c|0x699a$2"]],
    ["should load a GameShark save (Japan)"           ,         "japan.sps", ["r|japan"  , 't|["Slot 1"]'         , "s|1", "c|0x7241$1", "c|0x7222$2", "i|こﾞうかく$1", "i|29$2", "i|29$3", "w|30$2", "i|30$3", "c|0x70bb$1", "c|0x715f$2"]],
    ["should load a GameShark save (France)"          ,        "france.sps", ["r|france" , 't|["Slot 1"]'         , "s|1", "c|0x5d9c$1", "c|0x68c0$2", "i|PASS$1"    , "i|16$2", "i|16$3", "w|17$2", "i|17$3", "c|0x5e14$1", "c|0x68fc$2"]],
    ["should load a GameShark save (Germany)"         ,       "germany.sps", ["r|germany", 't|["Slot 3"]'         , "s|3", "c|0x6099$1", "c|0x69af$2", "i|PASS$1"    , "i|20$2", "i|20$3", "w|21$2", "i|21$3", "c|0x5f13$1", "c|0x68ec$2"]],
    ["should load a GameShark save (Italy)"           ,         "italy.sps", ["r|italy"  , 't|["Slot 1"]'         , "s|1", "c|0x5f5d$1", "c|0x69d0$2", "i|PASS$1"    , "i|14$2", "i|14$3", "w|15$2", "i|15$3", "c|0x5fd5$1", "c|0x6a0c$2"]],
    ["should load a GameShark save (Spain)"           ,         "spain.sps", ["r|spain"  , 't|["Slot 2"]'         , "s|2", "c|0x62d4$1", "c|0x69a6$2", "i|PASS$1"    , "i|16$2", "i|16$3", "w|17$2", "i|17$3", "c|0x614e$1", "c|0x68e3$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
