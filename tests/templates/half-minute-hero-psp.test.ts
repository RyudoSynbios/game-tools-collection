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
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",  "japan.bin", ["r|usa"   , "n|PASS"]],
    ["should load a standard save (Europe)"           , "europe.bin", ["r|europe", "i|PASS"]],
    ["should load a standard save (USA)"              ,    "usa.bin", ["r|usa"   , "i|PASS"]],
    ["should load a standard save (Japan)"            ,  "japan.bin", ["r|japan" , "i|ＰＡＳＳ"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
