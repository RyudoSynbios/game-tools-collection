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
    await saveShouldBeRejected(`${game}/empty.mpk`);
  });

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a deleted standard save (Slot 1)", "deleted-slot1.mpk", [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a filled standard save (Japan)"  ,        "filled.mpk", ["r|japan" , 't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a filled standard save (France)" ,        "filled.mpk", ["r|france", 't|["Slot 1"]', "i|0$1", "i|00$2"]],
    ["should load a standard save (Europe)"        ,        "europe.mpk", [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a standard save (USA)"           ,           "usa.mpk", [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a standard save (Japan)"         ,         "japan.mpk", [            't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a standard save (France)"        ,        "france.mpk", [            't|["Slot 1"]', "i|0$1", "i|03$2"]],
    ["should load a standard save (Germany)"       ,       "germany.mpk", [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (Europe)"             ,        "europe.srm", [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a SRM save (USA)"                ,           "usa.srm", [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (Japan)"              ,         "japan.srm", [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (France)"             ,        "france.srm", [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a SRM save (Germany)"            ,       "germany.srm", [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a DexDrive save (Europe)"        ,        "europe.n64", [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a DexDrive save (USA)"           ,           "usa.n64", [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a DexDrive save (Japan)"         ,         "japan.n64", [            't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a DexDrive save (France)"        ,        "france.n64", [            't|["Slot 1"]', "i|0$1", "i|03$2"]],
    ["should load a DexDrive save (Germany)"       ,       "germany.n64", [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
