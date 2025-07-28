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
    ["should not load a standard save with bad region",      "japan.sav", ["r|france" , 't|["Slot 2"]', "n|PASS"]],
    ["should load a standard save (Europe)"           ,     "europe.sav", ["r|europe" , 't|["Slot 2"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (USA)"              ,        "usa.sav", ["r|usa"    , 't|["Slot 1"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Japan)"            ,      "japan.sav", ["r|japan"  , 't|["Slot 2"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (Japan) (Rev 1)"    , "japan-rev1.sav", ["r|japan"  , 't|["Slot 1"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (Japan) (Rev 2)"    , "japan-rev2.sav", ["r|japan"  , 't|["Slot 3"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (France)"           ,     "france.sav", ["r|france" , 't|["Slot 3"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Germany)"          ,    "germany.sav", ["r|germany", 't|["Slot 2"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Canada)"           ,     "canada.sav", ["r|canada" , 't|["Slot 1"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
