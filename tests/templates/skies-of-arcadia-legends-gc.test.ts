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
    ["should load a standard save (Europe)", "europe.gci", ["c|0x848bd05c", "i|37", "w|38", "c|0x848bd05f"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ["c|0xab7a7687", "i|38", "w|39", "c|0xab7a7686"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ["c|0x4bb75684", "i|22", "w|23", "c|0x4bb75685"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
