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
  defaultTests(game, ["gamecube"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard save (Europe)", "europe.gci", ["c|0xa48a2e8f", "i|01$1", "i|43$2", "w|44$2", "c|0xed4c511f"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ["c|0x3c023168", "i|01$1", "i|55$2", "w|56$2", "c|0xbf16ed1d"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ["c|0xca185886", "i|01$1", "i|46$2", "w|47$2", "c|0x16874088"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
