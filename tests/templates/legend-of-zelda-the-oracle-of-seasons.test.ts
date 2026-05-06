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
  defaultTests(game, ["game-boy-color"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-color/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-color/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Color
    ["should not load a standard save with bad region", "game-boy-color/japan.sav"       , ["r|usa"   , 't|["Slot 2"]', "n|ごうかく"]],
    ["should load a standard save (Europe)"           , "game-boy-color/europe.sav"      , ["r|europe", 't|["Slot 3"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (USA, Australia)"   , "game-boy-color/usaaustralia.sav", ["r|usa"   , 't|["Slot 1"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (Japan)"            , "game-boy-color/japan.sav"       , ["r|japan" , 't|["Slot 2"]', "c|0xebd3", "i|ごうかく", "w|ざうかく", "c|0xebd4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
