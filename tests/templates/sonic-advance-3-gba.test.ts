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
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a deleted standard save"  , "deleted.sav", []],
    ["should load a standard save (Europe)" , "europe.sav" , ["c|0x4ff4b66f", "s|3", "i|PASS", "w|QASS", "c|0x5041b6be"]],
    ["should load a standard save (USA)"    ,    "usa.sav" , ["c|0x1c7d543f", "s|3", "i|PASS", "w|QASS", "c|0x1cca548e"]],
    ["should load a standard save (Japan)"  ,  "japan.sav" , ["c|0xfb277c80", "s|3", "i|PASS", "w|QASS", "c|0xfb747ccf"]],
    ["should load a GameShark save (Europe)", "europe.sps" , ["c|0x4ff4b66f", "s|3", "i|PASS", "w|QASS", "c|0x5041b6be"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps" , ["c|0x1c7d543f", "s|3", "i|PASS", "w|QASS", "c|0x1cca548e"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps" , ["c|0xfb277c80", "s|3", "i|PASS", "w|QASS", "c|0xfb747ccf"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
