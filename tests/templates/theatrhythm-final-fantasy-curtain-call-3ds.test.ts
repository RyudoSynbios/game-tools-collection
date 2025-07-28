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
    ["should load a standard save (Europe)", "europe/savedata.bk", ['t|["Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (USA)"   ,    "usa/savedata.bk", ['t|["Slot 1","Slot 2"]', "s|2", "i|PASS"]],
    ["should load a standard save (Japan)" ,  "japan/savedata.bk", ['t|["Slot 1"]'         , "s|1", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
