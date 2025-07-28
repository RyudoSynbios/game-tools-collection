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
    ["should load a standard save (Europe)" , "europe.sav", ["c|0xba88", "i|2", "s|3", "i|PASS", "w|QASS", "c|0xba87"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["c|0xc587", "i|5", "s|3", "i|PASS", "w|QASS", "c|0xc586"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["c|0xb86e", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xb86d"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["c|0xc884", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xc883"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["c|0xbb88", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xbb87"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["c|0xb468", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xb467"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
