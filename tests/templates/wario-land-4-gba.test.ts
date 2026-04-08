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
    ["should load an empty standard save"          ,         "empty.sav", ['t|["System"]']],
    ["should load a deleted standard save"         ,       "deleted.sav", ['t|["System"]']],
    ["should load a deleted standard save (Slot 1)", "deleted-slot1.sav", ['t|["System","Slot 1"]', "c|0xd19e13af$1", "c|0x2e61ec50$2", "s|2", "c|0xc0118600$1", "c|0x3fee79ff$2", "i|5660", "w|5670", "c|0xc0118601$1", "c|0x3fee79fe$2"]],
    ["should load a standard save (Europe, USA)"   ,    "europeusa.sav" , ['t|["System","Slot 1"]', "c|0xd19e13af$1", "c|0x2e61ec50$2", "s|2", "c|0xc0118600$1", "c|0x3fee79ff$2", "i|5660", "w|5670", "c|0xc0118601$1", "c|0x3fee79fe$2"]],
    ["should load a standard save (Japan)"         ,        "japan.sav" , ['t|["System","Slot 2"]', "c|0x6f5bcece$1", "c|0x90a43131$2", "s|3", "c|0xc01184d0$1", "c|0x3fee7b2f$2", "i|4140", "w|4150", "c|0xc01184d1$1", "c|0x3fee7b2e$2"]],
    ["should load a GameShark save (Europe, USA)"  ,    "europeusa.sps" , ['t|["System","Slot 1"]', "c|0xd19e13af$1", "c|0x2e61ec50$2", "s|2", "c|0xc0118600$1", "c|0x3fee79ff$2", "i|5660", "w|5670", "c|0xc0118601$1", "c|0x3fee79fe$2"]],
    ["should load a GameShark save (Japan)"        ,        "japan.sps" , ['t|["System","Slot 2"]', "c|0x6f5bcece$1", "c|0x90a43131$2", "s|3", "c|0xc01184d0$1", "c|0x3fee7b2f$2", "i|4140", "w|4150", "c|0xc01184d1$1", "c|0x3fee7b2e$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
