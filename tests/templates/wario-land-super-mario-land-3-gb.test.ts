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
    ["should load an empty standard save" ,   "empty.sav", ['t|[]']],
    ["should load a deleted standard save", "deleted.sav", ['t|[]']],
    ["should load a standard save (World)",   "world.sav", ['t|["Slot 3"]', "c|0x75", "i|20$1", "i|38$2", "w|21$1", "c|0x76"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
