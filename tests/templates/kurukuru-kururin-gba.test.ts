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
    ["should load an empty standard save"          ,         "empty.sav", ['t|["Slot 5","Records"]'                  , "c|0xe0f3$1", "c|0xe0f3$2", "s|5", "i|GUEST", "w|HUEST", "c|0xe0f4$1", "c|0xe0f3$2"]],
    ["should load a deleted standard save (Slot 4)", "deleted-slot4.sav", ['t|["Slot 2","Slot 5","Records"]'         , "c|0xd46a$1", "c|0xd4b0$2", "s|2", "i|PASS" , "w|QASS" , "c|0xd46b$1", "c|0xd4b0$2"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ['t|["Slot 2","Slot 4","Slot 5","Records"]', "c|0xd4b0$1", "c|0xd277$2", "s|2", "i|PASS" , "w|QASS" , "c|0xd4b1$1", "c|0xd277$2"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 1","Slot 3","Slot 5","Records"]', "c|0xe347$1", "c|0xe580$2", "s|3", "i|PASS" , "w|QASS" , "c|0xe347$1", "c|0xe581$2"]],
    ["should load a GameShark save (Europe)"       ,        "europe.sps", ['t|["Slot 2","Slot 4","Slot 5","Records"]', "c|0xd4b0$1", "c|0xd277$2", "s|2", "i|PASS" , "w|QASS" , "c|0xd4b1$1", "c|0xd277$2"]],
    ["should load a GameShark save (Japan)"        ,         "japan.sps", ['t|["Slot 1","Slot 3","Slot 5","Records"]', "c|0xe347$1", "c|0xe580$2", "s|3", "i|PASS" , "w|QASS" , "c|0xe347$1", "c|0xe581$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
