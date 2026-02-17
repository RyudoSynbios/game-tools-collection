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

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.bcr`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.bcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a deleted standard save (Slot 2)",  "deleted-slot2.bcr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x000140ae", "i|PASS", "w|QASS", "c|0x000140af"]],
    ["should load a filled BKR save"               ,         "filled.bkr", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x00014049", "i|PASS", "w|QASS", "c|0x0001404a"]],
    ["should load a filled BCR save"               ,         "filled.bcr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x00014010", "i|PASS", "w|QASS", "c|0x00014011"]],
    ["should load a filled padded BKR save"        ,     "filled-bkr.bin", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x00014049", "i|PASS", "w|QASS", "c|0x0001404a"]],
    ["should load a BKR save (Europe)"             ,         "europe.bkr", ['t|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x000140b0", "i|PASS", "w|QASS", "c|0x000140b1"]],
    ["should load a BKR save (USA)"                ,            "usa.bkr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x00014010", "i|PASS", "w|QASS", "c|0x00014011"]],
    ["should load a BKR save (Japan) (1M)"         ,       "japan-1m.bkr", ['t|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x00014740", "i|PASS", "w|QASS", "c|0x00014741"]],
    ["should load a BKR save (Japan) (3M)"         ,       "japan-3m.bkr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x0001456c", "i|PASS", "w|QASS", "c|0x0001456d"]],
    ["should load a BCR save (Europe)"             ,         "europe.bcr", ['t|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x00014049", "i|PASS", "w|QASS", "c|0x0001404a"]],
    ["should load a BCR save (USA)"                ,            "usa.bcr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x000140ae", "i|PASS", "w|QASS", "c|0x000140af"]],
    ["should load a BCR save (Japan) (1M)"         ,       "japan-1m.bcr", ['t|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x00014759", "i|PASS", "w|QASS", "c|0x0001475a"]],
    ["should load a BCR save (Japan) (3M)"         ,       "japan-3m.bcr", ['t|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x00014608", "i|PASS", "w|QASS", "c|0x00014609"]],
    ["should load a Hook save"                     ,           "hook.bin", ['t|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x000140b0", "i|PASS", "w|QASS", "c|0x000140b1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
