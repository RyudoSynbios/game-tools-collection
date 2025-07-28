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
    ["should load an empty standard save"          ,         "empty.sav", ['t|["Records"]']],
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.sav", ['t|["Slot 2","Records"]'                  , "s|2$1", "c|0xea06", "i|PASS", "w|QASS", "c|0xea05"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|3$1", "c|0x2886", "i|PASS", "w|QASS", "c|0x2885"]],
    ["should load a standard save (USA)"           ,           "usa.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|1$1", "c|0xad86", "i|PASS", "w|QASS", "c|0xad85"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|2$1", "c|0xea06", "i|PASS", "w|QASS", "c|0xea05"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
