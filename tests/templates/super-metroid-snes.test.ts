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
    ["should load a standard save (Europe)"    ,   "europe.sav", ["r|europe", 't|["Samus B","Miscellaneous"]', "c|0x1127$1", "c|0xeed8$2", "i|02$1", "i|47$2", "w|48$2", "c|0x1128$1", "c|0xeed7$2"]],
    ["should load a standard save (USA, Japan)", "usajapan.sav", ["r|usa"   , 't|["Samus C","Miscellaneous"]', "c|0x10f9$1", "c|0xef06$2", "i|02$1", "i|01$2", "w|02$2", "c|0x10fa$1", "c|0xef05$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
