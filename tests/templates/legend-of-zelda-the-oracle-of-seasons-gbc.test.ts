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
    ["should not load a standard save with bad region",        "japan.sav", ["r|usa"   , 't|["Slot 2"]', "n|ごうかく"]],
    ["should load a standard save (Europe)"           ,       "europe.sav", ["r|europe", 't|["Slot 3"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (USA, Australia)"   , "usaaustralia.sav", ["r|usa"   , 't|["Slot 1"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (Japan)"            ,        "japan.sav", ["r|japan" , 't|["Slot 2"]', "c|0xebd3", "i|ごうかく", "w|ざうかく", "c|0xebd4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
