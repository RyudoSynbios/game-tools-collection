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
  defaultTests(game, ["steam"]);

  // prettier-ignore
  const tests: Test[] = [
    // Steam
    ["should load a standard save (World)", "steam/SAVEDATA_PROGRESS.sav", ["c|0x7aecc25a", "i|1000", "w|1001", "c|0x6f217de3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
