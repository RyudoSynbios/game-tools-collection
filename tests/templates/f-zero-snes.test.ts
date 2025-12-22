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
    ["should load a standard save (Europe)", "europe.sav", ["s|2", "c|0x35ce", "i|35$1", "i|08$2", "w|09$2", "c|0x35cf"]],
    ["should load a standard save (USA)"   ,    "usa.sav", ["s|3", "c|0x3606", "i|28$1", "i|36$2", "w|37$2", "c|0x3607"]],
    ["should load a standard save (Japan)" ,  "japan.sav", ["s|4", "c|0x35e6", "i|25$1", "i|70$2", "w|71$2", "c|0x35e7"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
