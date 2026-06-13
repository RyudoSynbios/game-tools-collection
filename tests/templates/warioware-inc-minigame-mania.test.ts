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
  defaultTests(game, ["game-boy-advance"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-advance/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load a deleted standard save"  , "game-boy-advance/deleted.sav", ["r|usa"]],
    ["should load a standard save (Europe)" , "game-boy-advance/europe.sav" , ["r|europe", "c|0x42d72f5b", "i|PASS"  , "w|QASS"   , "c|0x42d7305b"]],
    ["should load a standard save (USA)"    , "game-boy-advance/usa.sav"    , ["r|usa"   , "c|0x41d72f5b", "i|PASS"  , "w|QASS"   , "c|0x41d7305b"]],
    ["should load a standard save (Japan)"  , "game-boy-advance/japan.sav"  , ["r|japan" , "c|0xc0d7a95b", "i|ごうかく", "w|ざうかく", "c|0xc0d7ab5b"]],
    ["should load a GameShark save (Europe)", "game-boy-advance/europe.sps" , ["r|europe", "c|0x42d72f5b", "i|PASS"  , "w|QASS"   , "c|0x42d7305b"]],
    ["should load a GameShark save (USA)"   , "game-boy-advance/usa.sps"    , ["r|usa"   , "c|0x41d72f5b", "i|PASS"  , "w|QASS"   , "c|0x41d7305b"]],
    ["should load a GameShark save (Japan)" , "game-boy-advance/japan.sps"  , ["r|japan" , "c|0xc0d7a95b", "i|ごうかく", "w|ざうかく", "c|0xc0d7ab5b"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
