import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  saveShouldBeRejected,
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
    ["should load an empty standard save"              ,   "empty.dsv", ["c|0x417f18b5", "s|2$1", "s|2$3", "i|0"    , "w|1"    , "c|0xedfef7c7"]],
    ["should load a deleted standard save"             , "deleted.dsv", ["c|0x417f18b5", "s|2$1", "s|2$3", "i|0"    , "w|1"    , "c|0xedfef7c7"]],
    ["should load a standard save (Europe)"            ,  "europe.dsv", ["c|0x3ecc9487", "s|2$1", "s|2$3", "i|60790", "w|60791", "c|0x924d7bf5"]],
    ["should load a standard save (USA)"               ,     "usa.dsv", ["c|0x36f11e80", "s|2$1", "s|2$3", "i|60820", "w|60821", "c|0x9a70f1f2"]],
    ["should load a standard save (Japan)"             ,   "japan.dsv", ["c|0xc157b9d9", "s|2$1", "s|2$3", "i|60790", "w|60791", "c|0x6dd656ab"]],
    ["should load a Action Replay Max DS save (Europe)",  "europe.duc", ["c|0x3ecc9487", "s|2$1", "s|2$3", "i|60790", "w|60791", "c|0x924d7bf5"]],
    ["should load a Action Replay Max DS save (USA)"   ,     "usa.duc", ["c|0x36f11e80", "s|2$1", "s|2$3", "i|60820", "w|60821", "c|0x9a70f1f2"]],
    ["should load a Action Replay Max DS save (Japan)" ,   "japan.duc", ["c|0xc157b9d9", "s|2$1", "s|2$3", "i|60790", "w|60791", "c|0x6dd656ab"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
