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
    ["should load an empty standard save"   , "game-boy-advance/empty.sav" , ["i|1$1", "i|0$2"]],
    ["should load a standard save (Europe)" , "game-boy-advance/europe.sav", ["c|0xde", "i|5$1", "i|36$2", "w|37$2", "c|0xdd"]],
    ["should load a standard save (USA)"    , "game-boy-advance/usa.sav"   , ["c|0xfc", "i|3$1", "i|8$2" , "w|9$2" , "c|0xfb"]],
    ["should load a standard save (Japan)"  , "game-boy-advance/japan.sav" , ["c|0xdf", "i|4$1", "i|36$2", "w|37$2", "c|0xde"]],
    ["should load a GameShark save (Europe)", "game-boy-advance/europe.sps", ["c|0xf4", "i|8$1", "i|15$2", "w|16$2", "c|0xf3"]],
    ["should load a GameShark save (USA)"   , "game-boy-advance/usa.sps"   , ["c|0xf3", "i|4$1", "i|16$2", "w|17$2", "c|0xf2"]],
    ["should load a GameShark save (Japan)" , "game-boy-advance/japan.sps" , ["c|0xaf", "i|7$1", "i|80$2", "w|81$2", "c|0xae"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
