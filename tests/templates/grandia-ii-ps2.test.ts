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

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)" ,        "filled.ps2", ["r|europe", 't|["Slot 1","Slot 10"]' , "s|2$1", "i|08$1", "i|32$2"]],
    ["should load a filled standard save (USA)"    ,        "filled.ps2", ["r|usa"   , 't|["Slot 10"]'          , "s|1$1", "i|08$1", "i|26$2"]],
    ["should load a deleted standard save (Slot 9)", "deleted-slot9.ps2", [            't|["Slot 9"]'           , "s|1$1", "i|11$1", "i|21$2"]],
    ["should load a standard save (Europe)"        ,        "europe.ps2", [            't|["Slot 3"]'           , "s|1$1", "i|08$1", "i|35$2"]],
    ["should load a standard save (USA)"           ,           "usa.ps2", [            't|["Slot 6"]'           , "s|1$1", "i|09$1", "i|16$2"]],
    ["should load a standard save (Japan, Asia)"   ,     "japanasia.ps2", [            't|["Slot 2","Slot 9"]'  , "s|1$1", "i|11$1", "i|07$2"]],
    ["should load a PSU save (Europe)"             ,        "europe.psu", [            't|["Slot 3"]'           , "s|1$1", "i|08$1", "i|35$2"]],
    ["should load a PSU save (USA)"                ,           "usa.psu", [            't|["Slot 6"]'           , "s|1$1", "i|09$1", "i|16$2"]],
    ["should load a PSU save (Japan, Asia)"        ,     "japanasia.psu", [            't|["Slot 2"]'           , "s|1$1", "i|11$1", "i|07$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
