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
  defaultTests(game, ["game-boy-advance"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load an empty standard save"   , "game-boy-advance/empty.sav" , ['t|["Time Attack"]']],
    ["should load a standard save (Europe)" , "game-boy-advance/europe.sav", ['t|["Slot 3","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a standard save (USA)"    , "game-boy-advance/usa.sav"   , ['t|["Slot 1","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a standard save (Japan)"  , "game-boy-advance/japan.sav" , ['t|["Slot 2","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (Europe)", "game-boy-advance/europe.sps", ['t|["Slot 1","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (USA)"   , "game-boy-advance/usa.sps"   , ['t|["Slot 2","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (Japan)" , "game-boy-advance/japan.sps" , ['t|["Slot 3","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
