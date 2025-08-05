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
    ["should load a standard save (Europe)"       ,     "europe.gci", ['t|["Mario B","Options"]', "s|2$1", "c|0xbbbb3447", "i|1$1", "i|3$2", "w|4$2", "c|0xbbbc3446"]],
    ["should load a standard save (USA)"          ,        "usa.gci", ['t|["Mario A","Options"]', "s|1$1", "c|0xa8704792", "i|1$1", "i|3$2", "w|4$2", "c|0xa8714791"]],
    ["should load a standard save (Japan)"        ,      "japan.gci", ['t|["Mario B","Options"]', "s|2$1", "c|0x2808c7fa", "i|1$1", "i|3$2", "w|4$2", "c|0x2809c7f9"]],
    ["should load a standard save (Japan) (Rev 1)", "japan-rev1.gci", ['t|["Mario C","Options"]', "s|3$1", "c|0xf469fb99", "i|1$1", "i|3$2", "w|4$2", "c|0xf46afb98"]],
    ["should load a standard save (Korea)"        ,      "korea.gci", ['t|["Mario C","Options"]', "s|3$1", "c|0xe8ba0748", "i|1$1", "i|3$2", "w|4$2", "c|0xe8bb0747"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
