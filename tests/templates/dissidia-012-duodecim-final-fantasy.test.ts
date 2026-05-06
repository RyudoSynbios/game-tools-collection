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
  defaultTests(game, ["playstation-portable"]);

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation Portable
    ["should load a standard save (Europe)", "playstation-portable/europe.bin", ["r|europe", "i|PASS"]],
    ["should load a standard save (USA)"   , "playstation-portable/usa.bin"   , ["r|usa"   , "i|PASS"]],
    ["should load a standard save (Japan)" , "playstation-portable/japan.bin" , [            "i|PASS"]],
    ["should load a standard save (Asia)"  , "playstation-portable/asia.bin"  , ["r|asia"  , "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
