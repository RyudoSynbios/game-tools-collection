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
  defaultTests(game, ["game-boy-color"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Color
    ["should load an empty standard save"  , "game-boy-color/empty.sav" , ["r|europe"]],
    ["should load a standard save (Europe)", "game-boy-color/europe.sav", ["r|europe", "s|3", "c|0xd43e", "i|PASS"   , "w|QASS"  , "c|0xd43f"]],
    ["should load a standard save (USA)"   , "game-boy-color/usa.sav"   , ["r|usa"   , "s|4", "c|0xd304", "i|PASS"   , "w|QASS"  , "c|0xd305"]],
    ["should load a standard save (Japan)" , "game-boy-color/japan.sav" , ["r|japan" , "s|2", "c|0xd7ce", "i|ごうかく", "w|ざうかく", "c|0xd7d0"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
