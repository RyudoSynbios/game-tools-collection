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

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard save (USA)"        ,      "usa.sav", ["r|usa"  , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0xd4ba", "s|2$2", "i|PASS"  , "w|QASS"   , "c|0xd4bb"]],
    ["should load a standard save (USA) (Rev 1)", "usa-rev1.sav", ["r|usa"  , 't|["Slot 2","Slot 3"]', "s|2$1", "c|0xd479", "s|2$2", "i|PASS"  , "w|QASS"   , "c|0xd47a"]],
    ["should load a standard save (Japan)"      ,    "japan.sav", ["r|japan", 't|["Slot 1","Slot 3"]', "s|3$1", "c|0xd5a7", "s|2$2", "i|ごうかく", "w|ざうかく", "c|0xd5a9"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
