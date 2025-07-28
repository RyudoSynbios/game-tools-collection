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
    ["should load an empty standard save"   ,  "empty.sav", ['t|["Time Attack"]']],
    ["should load a standard save (Europe)" , "europe.sav", ['t|["Slot 3","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ['t|["Slot 1","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ['t|["Slot 2","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (Europe)", "europe.sps", ['t|["Slot 1","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ['t|["Slot 2","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ['t|["Slot 3","Time Attack"]', "c|0xeab6", "i|PASS", "w|QASS", "c|0xeab5"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
