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
    ["should load a standard Main Story save (World)"  , "steam/ff7remake001.sav"    , ["i|50016"]],
    ["should load a standard INTERmission save (World)", "steam/ff7remakeplus001.sav", ["i|50000"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
