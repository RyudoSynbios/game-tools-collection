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
    ["should not load a standard save with bad region", "nintendo-64/europe.srm", ["r|japan" , "s|6", "n|English"]],
    ["should load a standard save (Europe)"           , "nintendo-64/europe.eep", ["r|europe", "c|0x0700", "i|300", "w|301", "c|0x0701"]],
    ["should load a standard save (USA)"              , "nintendo-64/usa.eep"   , ["r|usa"   , "c|0x0421", "i|300", "w|301", "c|0x0422"]],
    ["should load a standard save (Japan)"            , "nintendo-64/japan.eep" , ["r|japan" , "c|0x0420", "i|300", "w|301", "c|0x0421"]],
    ["should load a SRM save (Europe)"                , "nintendo-64/europe.srm", ["r|europe", "c|0x0700", "i|300", "w|301", "c|0x0701"]],
    ["should load a SRM save (USA)"                   , "nintendo-64/usa.srm"   , ["r|usa"   , "c|0x0421", "i|300", "w|301", "c|0x0422"]],
    ["should load a SRM save (Japan)"                 , "nintendo-64/japan.srm" , ["r|japan" , "c|0x0420", "i|300", "w|301", "c|0x0421"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
