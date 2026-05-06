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
  defaultTests(game, ["nintendo-3ds"]);

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 3DS
    ["should load a standard save (Europe)", "nintendo-3ds/europe/savedata.bk", ['t|["Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (USA)"   , "nintendo-3ds/usa/savedata.bk"   , ['t|["Slot 1","Slot 2"]', "s|2", "i|PASS"]],
    ["should load a standard save (Japan)" , "nintendo-3ds/japan/savedata.bk" , ['t|["Slot 1"]'         , "s|1", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
