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

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",         "japan.sav", ["r|usa"  , 't|["General","Slot 1","Slot 2"]', "s|2$1", "s|2$2", "n|ごうかく"]],
    ["should load a deleted standard save (Slot 3)"   , "deleted-slot3.sav", ["r|usa"  , 't|["General","Slot 3"]'         , "s|4$1", "s|2$2", "c|0x39a8", "i|PASS"   , "w|QASS"  , "c|0x39a9"]],
    ["should load a standard save (USA)"              ,           "usa.sav", ["r|usa"  , 't|["General","Slot 2","Slot 3"]', "s|4$1", "s|2$2", "c|0x39a8", "i|PASS"   , "w|QASS"  , "c|0x39a9"]],
    ["should load a standard save (Japan)"            ,         "japan.sav", ["r|japan", 't|["General","Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x7813", "i|ごうかく", "w|ざうかく", "c|0x7815"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
