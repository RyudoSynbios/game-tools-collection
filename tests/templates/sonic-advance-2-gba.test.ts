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
    ["should load a standard save (Europe)" , "europe.sav" , ["c|0xd801980b", "s|3", "i|PASS", "w|QASS", "c|0xd801980c"]],
    ["should load a standard save (USA)"    ,    "usa.sav" , ["c|0x15907860", "s|3", "i|PASS", "w|QASS", "c|0x15907861"]],
    ["should load a standard save (Japan)"  ,  "japan.sav" , ["c|0x72561ef2", "s|3", "i|PASS", "w|QASS", "c|0x72561ef3"]],
    ["should load a GameShark save (Europe)", "europe.sps" , ["c|0xd801980b", "s|3", "i|PASS", "w|QASS", "c|0xd801980c"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps" , ["c|0x15907860", "s|3", "i|PASS", "w|QASS", "c|0x15907861"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps" , ["c|0x72561ef2", "s|3", "i|PASS", "w|QASS", "c|0x72561ef3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
