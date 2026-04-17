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
    ["should not load a standard save with bad region", "europe.srm", ["r|japan" , "s|6", "n|English"]],
    ["should load a standard save (Europe)"           , "europe.eep", ["r|europe", "c|0x0700", "i|300", "w|301", "c|0x0701"]],
    ["should load a standard save (USA)"              ,    "usa.eep", ["r|usa"   , "c|0x0421", "i|300", "w|301", "c|0x0422"]],
    ["should load a standard save (Japan)"            ,  "japan.eep", ["r|japan" , "c|0x0420", "i|300", "w|301", "c|0x0421"]],
    ["should load a SRM save (Europe)"                , "europe.srm", ["r|europe", "c|0x0700", "i|300", "w|301", "c|0x0701"]],
    ["should load a SRM save (USA)"                   ,    "usa.srm", ["r|usa"   , "c|0x0421", "i|300", "w|301", "c|0x0422"]],
    ["should load a SRM save (Japan)"                 ,  "japan.srm", ["r|japan" , "c|0x0420", "i|300", "w|301", "c|0x0421"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
