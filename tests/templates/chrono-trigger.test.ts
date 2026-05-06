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
  defaultTests(game, ["super-nintendo"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/super-nintendo/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/super-nintendo/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Super Nintendo
    ["should not load a standard save with bad region", "super-nintendo/japan.sav"        , ["r|usa"  , 't|["System","Slot 1","Slot 2"]', "s|2$1", "s|2$2", "n|ごうかく"]],
    ["should load a deleted standard save (Slot 3)"   , "super-nintendo/deleted-slot3.sav", ["r|usa"  , 't|["System","Slot 3"]'         , "s|4$1", "s|2$2", "c|0x39a8", "i|PASS"   , "w|QASS"  , "c|0x39a9"]],
    ["should load a standard save (USA)"              , "super-nintendo/usa.sav"          , ["r|usa"  , 't|["System","Slot 2","Slot 3"]', "s|4$1", "s|2$2", "c|0x39a8", "i|PASS"   , "w|QASS"  , "c|0x39a9"]],
    ["should load a standard save (Japan)"            , "super-nintendo/japan.sav"        , ["r|japan", 't|["System","Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x7813", "i|ごうかく", "w|ざうかく", "c|0x7815"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
