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
  defaultTests(game, ["nintendo-64"]);

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load a standard save (Europe)", "nintendo-64/europe.sra", ["r|europe", "s|2", "c|0x0e21", "i|PAS", "w|QAS", "c|0x0e22"]],
    ["should load a standard save (USA)"   , "nintendo-64/usa.sra"   , ["r|usa"   , "s|2", "c|0x0e15", "i|PAS", "w|QAS", "c|0x0e16"]],
    ["should load a standard save (Japan)" , "nintendo-64/japan.sra" , ["r|japan" , "s|2", "c|0x0e6a", "i|PAS", "w|QAS", "c|0x0e6b"]],
    ["should load a SRM save (Europe)"     , "nintendo-64/europe.srm", ["r|europe", "s|2", "c|0x0e7e", "i|PAS", "w|QAS", "c|0x0e7f"]],
    ["should load a SRM save (USA)"        , "nintendo-64/usa.srm"   , ["r|usa"   , "s|2", "c|0x0d9e", "i|PAS", "w|QAS", "c|0x0d9f"]],
    ["should load a SRM save (Japan)"      , "nintendo-64/japan.srm" , ["r|japan" , "s|2", "c|0x0df7", "i|PAS", "w|QAS", "c|0x0df8"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
