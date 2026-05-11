import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game, ["super-nintendo"]);

  // prettier-ignore
  const tests: Test[] = [
    // Super Nintendo
    ["should load an empty standard save"         , "super-nintendo/empty.sav"     , ['r|europe', 't|["All Time Greats","Options"]']],
    ["should load a deleted standard save"        , "super-nintendo/deleted.sav"   , ['r|europe', 't|["All Time Greats","Options"]']],
    ["should load a standard save (Europe)"       , "super-nintendo/europe.sav"    , ['r|europe', 't|["Slot 3","All Time Greats","Options"]', "s|3", "c|0xb6b39131", "i|PASS", "w|QASS", "c|0xb6b29132"]],
    ["should load a standard save (USA)"          , "super-nintendo/usa.sav"       , ['r|usa'   , 't|["Slot 2","All Time Greats","Options"]', "s|2", "c|0xb6b39131", "i|PASS", "w|QASS", "c|0xb6b29132"]],
    ["should load a standard save (Japan)"        , "super-nintendo/japan.sav"     , ['r|japan' , 't|["Slot 1","All Time Greats","Options"]', "s|1", "c|0xb6b39131", "i|PASS", "w|QASS", "c|0xb6b29132"]],
    ["should load a standard save (Japan) (Rev 1)", "super-nintendo/japan-rev1.sav", ['r|japan' , 't|["Slot 3","All Time Greats","Options"]', "s|3", "c|0xb6b39131", "i|PASS", "w|QASS", "c|0xb6b29132"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
