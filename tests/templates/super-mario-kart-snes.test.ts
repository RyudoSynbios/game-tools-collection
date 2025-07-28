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
    ["should load an empty standard save"  ,  "empty.sav", ["c|0x0000", "i|-"     , "w|3", "c|0x000c", "s|2$1", "s|1$2" , "c|0x05e8"]],
    ["should load a standard save (Europe)", "europe.sav", ["c|0x000c", "i|Bronze", "w|2", "c|0x0008", "s|2$1", "s|10$2", "c|0x044f", "i|15", "w|16", "c|0x0450"]],
    ["should load a standard save (USA)"   ,    "usa.sav", ["c|0x0008", "i|Silver", "w|1", "c|0x0004", "s|2$1", "s|3$2" , "c|0x053e", "i|97", "w|98", "c|0x053f"]],
    ["should load a standard save (Japan)" ,  "japan.sav", ["c|0x0004", "i|Gold"  , "w|2", "c|0x0008", "s|2$1", "s|12$2", "c|0x0483", "i|03", "w|04", "c|0x0484"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
