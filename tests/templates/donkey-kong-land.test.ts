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
    ["should load an empty standard save"       , "game-boy/empty.sav"    , ['t|[]']],
    ["should load a deleted standard save"      , "game-boy/deleted.sav"  , ['t|[]']],
    ["should load a standard save (Europe, USA)", "game-boy/europeusa.sav", ['t|["Slot 2"]', "c|0x2840", "i|00$1", "i|02$2", "i|13$3", "w|01$1", "c|0x2941"]],
    ["should load a standard save (Japan)"      , "game-boy/japan.sav"    , ['t|["Slot 3"]', "c|0x4a7e", "i|00$1", "i|00$2", "i|49$3", "w|01$1", "c|0x4b7f"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
