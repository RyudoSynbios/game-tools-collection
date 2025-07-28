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
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",  "europeusa.sav", ["r|japan" , "n|PASS"]],
    ["should load a standard save (Europe, USA)"      ,  "europeusa.sav", ['r|europe', "c|0xd77d$2", "i|PASS", "w|QASS", "c|0xd47e$2"]],
    ["should load a standard save (USA) (Gold)"       ,   "usa-gold.sav", ['r|usa'   , "c|0xd9fb$2", "i|PASS", "w|QASS", "c|0xdafc$2"]],
    ["should load a standard save (Japan) (Rev 1)"    , "japan-rev1.sav", ['r|japan' , "c|0xd169$2", "i|PASS", "w|QASS", "c|0xd06a$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
