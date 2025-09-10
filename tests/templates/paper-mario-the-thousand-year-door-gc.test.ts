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
    ["should load a standard save (Europe)", "europe.gci", ['t|["Slot 2","Slot 4"]', "s|4", "c|0x00005257$1", "c|0xffffada8$2", "i|PASS"   , "w|QASS"  , "c|0x00005258$1", "c|0xffffada7$2"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ['t|["Slot 1","Slot 3"]', "s|1", "c|0x00004d31$1", "c|0xffffb2ce$2", "i|PASS"   , "w|QASS"  , "c|0x00004d32$1", "c|0xffffb2cd$2"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ['t|["Slot 1","Slot 4"]', "s|4", "c|0x000049e7$1", "c|0xffffb618$2", "i|ごうかく", "w|ざうかく", "c|0x000049e9$1", "c|0xffffb616$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
