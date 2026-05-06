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
  defaultTests(game, ["super-nintendo"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/super-nintendo/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/super-nintendo/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Super Nintendo
    ["should not load a standard save with bad region", "super-nintendo/japan.sav"     , ["r|france" , 't|["Slot 2"]', "n|PASS"]],
    ["should load a standard save (Europe)"           , "super-nintendo/europe.sav"    , ["r|europe" , 't|["Slot 2"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (USA)"              , "super-nintendo/usa.sav"       , ["r|usa"    , 't|["Slot 1"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Japan)"            , "super-nintendo/japan.sav"     , ["r|japan"  , 't|["Slot 2"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (Japan) (Rev 1)"    , "super-nintendo/japan-rev1.sav", ["r|japan"  , 't|["Slot 1"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (Japan) (Rev 2)"    , "super-nintendo/japan-rev2.sav", ["r|japan"  , 't|["Slot 3"]', "c|0x34ea", "i|PASS", "w|QASS", "c|0x33ea"]],
    ["should load a standard save (France)"           , "super-nintendo/france.sav"    , ["r|france" , 't|["Slot 3"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Germany)"          , "super-nintendo/germany.sav"   , ["r|germany", 't|["Slot 2"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
    ["should load a standard save (Canada)"           , "super-nintendo/canada.sav"    , ["r|canada" , 't|["Slot 1"]', "c|0x1aee", "i|PASS", "w|QASS", "c|0x09ee"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
