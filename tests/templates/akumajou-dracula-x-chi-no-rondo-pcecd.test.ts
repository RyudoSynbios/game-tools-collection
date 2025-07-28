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
    ["should load an empty standard save"          ,         "empty.sav", ['t|[]']],
    ["should load a deleted standard save (Slot 3)", "deleted-slot3.sav", ['t|["Slot 3"]', "c|0xfbbb", "i|PASS", "w|QASS", "c|0xfbba"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 2"]', "c|0xfbbb", "i|PASS", "w|QASS", "c|0xfbba"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
