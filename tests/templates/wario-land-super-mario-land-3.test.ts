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
  defaultTests(game, ["game-boy"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy
    ["should load an empty standard save" , "game-boy/empty.sav"  , ['t|[]']],
    ["should load a deleted standard save", "game-boy/deleted.sav", ['t|[]']],
    ["should load a standard save (World)", "game-boy/world.sav"  , ['t|["Slot 3"]', "c|0x75", "i|20$1", "i|38$2", "w|21$1", "c|0x76"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
