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
    ["should load a standard save (Europe, Australia)", "europeaustralia/GameData.bin", ['t|["Slot 3"]', "s|3$1", "c|0xedfeb304", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xeefeb204"]],
    ["should load a standard save (USA)"              ,             "usa/GameData.bin", ['t|["Slot 4"]', "s|4$1", "c|0x592c47d6", "i|PLAY$1", "i|4$2", "w|5$2", "c|0x5a2c46d6"]],
    ["should load a standard save (Japan)"            ,           "japan/GameData.bin", ['t|["Slot 2"]', "s|2$1", "c|0xb3d2ed30", "i|PLAY$1", "i|4$2", "w|5$2", "c|0xb4d2ec30"]],
    ["should load a standard save (Korea)"            ,           "korea/GameData.bin", ['t|["Slot 6"]', "s|6$1", "c|0x0b929570", "i|PLAY$1", "i|4$2", "w|5$2", "c|0x0c929470"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
