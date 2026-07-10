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
    ["should load a standard save (Europe)", "nintendo-64/europe.eep", ["r|europe", "s|2", "c|0xe973", "i|PASS", "w|QASS", "c|0xd973"]],
    ["should load a standard save (USA)"   , "nintendo-64/usa.eep"   , ["r|usa"   , "s|2", "c|0xeb78", "i|PASS", "w|QASS", "c|0xdb78"]],
    ["should load a standard save (Japan)" , "nintendo-64/japan.eep" , ["r|japan" , "s|2", "c|0xc681", "i|PASS", "w|QASS", "c|0xc581"]],
    ["should load a SRM save (Europe)"     , "nintendo-64/europe.srm", ["r|europe", "s|2", "c|0xe973", "i|PASS", "w|QASS", "c|0xd973"]],
    ["should load a SRM save (USA)"        , "nintendo-64/usa.srm"   , ["r|usa"   , "s|2", "c|0xeb78", "i|PASS", "w|QASS", "c|0xdb78"]],
    ["should load a SRM save (Japan)"      , "nintendo-64/japan.srm" , ["r|japan" , "s|2", "c|0xc681", "i|PASS", "w|QASS", "c|0xc581"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
