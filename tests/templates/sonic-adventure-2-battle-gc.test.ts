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
    ["should load a standard Main save (Europe)"       , "main-europe.gci", ["c|0x9a04", "i|02$1", "i|26$2", "w|27$2", "c|0x9a40"]],
    ["should load a standard Main save (USA)"          ,    "main-usa.gci", ["c|0x99d1", "i|01$1", "i|58$2", "w|59$2", "c|0x9a0d"]],
    ["should load a standard Main save (Japan)"        ,  "main-japan.gci", ["c|0x9ab9", "i|04$1", "i|43$2", "w|44$2", "c|0x9af5"]],
    ["should load a standard Chao Garden save (Europe)", "chao-europe.gci", ["c|0xcd00d700001f0018", "s|7$1", "s|2$2", "s|1$3", "i|PASS", "w|QASS", "c|0x0d00ef0000c50027"]],
    ["should load a standard Chao Garden save (USA)"   ,    "chao-usa.gci", ["c|0x6d00b00000950078", "s|7$1", "s|2$2", "s|1$3", "i|PASS", "w|QASS", "c|0x0300c90000fb00ef"]],
    ["should load a standard Chao Garden save (Japan)" ,  "chao-japan.gci", ["c|0x5100ee00004700f0", "s|7$1", "s|2$2", "s|2$3", "i|PASS", "w|QASS", "c|0xe900840000890049"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
