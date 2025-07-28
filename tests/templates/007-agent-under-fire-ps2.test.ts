import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  saveShouldBeRejected,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)", "filled.ps2", ["r|europe", 't|["Slot 5","Slot 6","Options"]', "s|6$1", "i|PASS"]],
    ["should load a filled standard save (Korea)" , "filled.ps2", ["r|korea" , 't|["Slot 1","Slot 6","Options"]', "s|6$1", "i|PASS"]],
    ["should load a standard save (Europe)"       , "europe.ps2", [            't|["Slot 1","Slot 3","Options"]', "s|3$1", "i|PASS"]],
    ["should load a standard save (USA)"          ,    "usa.ps2", [            't|["Slot 5","Slot 7","Options"]', "s|5$1", "i|PASS"]],
    ["should load a standard save (Korea)"        ,  "korea.ps2", [            't|["Slot 2","Slot 8","Options"]', "s|2$1", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
