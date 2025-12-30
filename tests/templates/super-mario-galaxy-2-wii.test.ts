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
    ["should load a standard save (Europe)", "europe/GameData.bin", ['t|["Slot 3","Shared"]', "s|3$1", "c|0xa71c4096", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xa81c3f96"]],
    ["should load a standard save (USA)"   ,    "usa/GameData.bin", ['t|["Slot 2","Shared"]', "s|2$1", "c|0xbeda28d8", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xbfda27d8"]],
    ["should load a standard save (Japan)" ,  "japan/GameData.bin", ['t|["Slot 1","Shared"]', "s|1$1", "c|0xfeaae908", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xffaae808"]],
    ["should load a standard save (Korea)" ,  "korea/GameData.bin", ['t|["Slot 1","Shared"]', "s|1$1", "c|0x0f36d87c", "i|PLAY$1", "i|4$2", "w|5$2", "c|0x1036d77c"]],
    ["should load a standard save (Asia)"  ,   "asia/GameData.bin", ['t|["Slot 2","Shared"]', "s|2$1", "c|0xddee09c4", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xdeee08c4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
