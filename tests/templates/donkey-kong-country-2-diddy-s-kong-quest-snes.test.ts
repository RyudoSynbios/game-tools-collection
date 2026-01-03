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
    ["should load a standard save (Europe) (Rev 1)" ,  "europe-rev1.sav", ['r|europe' , 't|["Slot 1"]', "s|1", "c|0x7865e767", "i|05$1", "i|03$2", "w|04$2", "c|0x78b7e799"]],
    ["should load a standard save (USA)"            ,          "usa.sav", ['r|usa'    , 't|["Slot 3"]', "s|3", "c|0x774fd881", "i|02$1", "i|39$2", "w|40$2", "c|0x778bd8bd"]],
    ["should load a standard save (USA) (Rev 1)"    ,     "usa-rev1.sav", ['r|usa'    , 't|["Slot 1"]', "s|1", "c|0x6f89d0bb", "i|02$1", "i|53$2", "w|54$2", "c|0x6fd5d0f7"]],
    ["should load a standard save (Japan)"          ,        "japan.sav", ['r|japan'  , 't|["Slot 2"]', "s|2", "c|0x786fdd61", "i|02$1", "i|59$2", "w|58$2", "c|0x7ba3dd25"]],
    ["should load a standard save (Japan) (Rev 1)"  ,   "japan-rev1.sav", ['r|japan'  , 't|["Slot 1"]', "s|1", "c|0x71f0ded2", "i|03$1", "i|36$2", "w|37$2", "c|0x703cdf0e"]],
    ["should load a standard save (Germany)"        ,      "germany.sav", ['r|germany', 't|["Slot 2"]', "s|2", "c|0x710ade3c", "i|02$1", "i|55$2", "w|56$2", "c|0x715cde6e"]],
    ["should load a standard save (Germany) (Rev 1)", "germany-rev1.sav", ['r|germany', 't|["Slot 3"]', "s|3", "c|0x6000cf42", "i|03$1", "i|20$2", "w|21$2", "c|0x6052cf74"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
