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
    ["should load a standard save (Europe, USA)", "europeusa.sav", ["c|0x251a", "s|3", "s|5$2", "i|0087", "w|0088", "c|0x251b"]],
    ["should load a standard save (Japan)"      ,     "japan.sav", ["c|0x3139", "s|3", "s|1$2", "i|0103", "w|0104", "c|0x313a"]],
    ["should load a standard save (Australia)"  , "australia.sav", ["c|0x1783", "s|3", "s|2$2", "i|0069", "w|0070", "c|0x177b"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
