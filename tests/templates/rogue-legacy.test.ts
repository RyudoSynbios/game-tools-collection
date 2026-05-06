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
    ["should load a standard Main save (World)" , "steam/RogueLegacyPlayer.rcdat", ['t|["General","Current Game","Current Run","Bestiary"]', "s|3$1", "i|PASS"]],
    ["should load a standard Manor save (World)", "steam/RogueLegacyBP.rcdat"    , ['t|["Manor"]', "s|5$1", "s|1$2", "i|8$1", "i|2$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
