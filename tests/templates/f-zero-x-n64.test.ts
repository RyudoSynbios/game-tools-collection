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
    ["should load a standard save (Europe)", "europe.sra", ["r|europe", "s|2", "c|0x0e21", "i|PAS", "w|QAS", "c|0x0e22"]],
    ["should load a standard save (USA)"   ,    "usa.sra", ["r|usa"   , "s|2", "c|0x0e15", "i|PAS", "w|QAS", "c|0x0e16"]],
    ["should load a standard save (Japan)" ,  "japan.sra", ["r|japan" , "s|2", "c|0x0e6a", "i|PAS", "w|QAS", "c|0x0e6b"]],
    ["should load a SRM save (Europe)"     , "europe.srm", ["r|europe", "s|2", "c|0x0e7e", "i|PAS", "w|QAS", "c|0x0e7f"]],
    ["should load a SRM save (USA)"        ,    "usa.srm", ["r|usa"   , "s|2", "c|0x0d9e", "i|PAS", "w|QAS", "c|0x0d9f"]],
    ["should load a SRM save (Japan)"      ,  "japan.srm", ["r|japan" , "s|2", "c|0x0df7", "i|PAS", "w|QAS", "c|0x0df8"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
