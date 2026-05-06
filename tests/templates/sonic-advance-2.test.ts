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
    ["should load a deleted standard save"  , "game-boy-advance/deleted.sav", []],
    ["should load a standard save (Europe)" , "game-boy-advance/europe.sav" , ["c|0xd801980b", "s|3", "i|PASS", "w|QASS", "c|0xd801980c"]],
    ["should load a standard save (USA)"    , "game-boy-advance/usa.sav"    , ["c|0x15907860", "s|3", "i|PASS", "w|QASS", "c|0x15907861"]],
    ["should load a standard save (Japan)"  , "game-boy-advance/japan.sav"  , ["c|0x72561ef2", "s|3", "i|PASS", "w|QASS", "c|0x72561ef3"]],
    ["should load a GameShark save (Europe)", "game-boy-advance/europe.sps" , ["c|0xd801980b", "s|3", "i|PASS", "w|QASS", "c|0xd801980c"]],
    ["should load a GameShark save (USA)"   , "game-boy-advance/usa.sps"    , ["c|0x15907860", "s|3", "i|PASS", "w|QASS", "c|0x15907861"]],
    ["should load a GameShark save (Japan)" , "game-boy-advance/japan.sps"  , ["c|0x72561ef2", "s|3", "i|PASS", "w|QASS", "c|0x72561ef3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
