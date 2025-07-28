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
    ["should load an empty standard save"   ,   "empty.sav", ['t|["General"]']],
    ["should load a deleted standard save"  , "deleted.sav", ['t|["General"]']],
    ["should load a standard save (Europe)" ,  "europe.sav", ['t|["General","Slot 7"]', "s|8", "c|0x92", "i|PASS", "w|QASS", "c|0x93"]],
    ["should load a standard save (USA)"    ,     "usa.sav", ['t|["General","Slot 3"]', "s|4", "c|0xf1", "i|PASS", "w|QASS", "c|0xf2"]],
    ["should load a standard save (Japan)"  ,   "japan.sav", ['t|["General","Slot 4"]', "s|5", "c|0x12", "i|PASS", "w|QASS", "c|0x13"]],
    ["should load a GameShark save (Europe)",  "europe.sps", ['t|["General","Slot 8"]', "s|9", "c|0x22", "i|PASS", "w|QASS", "c|0x23"]],
    ["should load a GameShark save (USA)"   ,     "usa.sps", ['t|["General","Slot 5"]', "s|6", "c|0x2b", "i|PASS", "w|QASS", "c|0x2c"]],
    ["should load a GameShark save (Japan)" ,   "japan.sps", ['t|["General","Slot 1"]', "s|2", "c|0xb4", "i|PASS", "w|QASS", "c|0xb5"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
