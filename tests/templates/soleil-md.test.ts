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

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard save (Europe)" ,  "europe.sav", ["r|europe" , 't|["Slot 4"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (USA)"    ,     "usa.sav", ["r|usa"    , 't|["Slot 3"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Japan)"  ,   "japan.sav", ["r|japan"  , 't|["Slot 3"]', "c|0x9b14", "i|PASS", "w|QASS", "c|0x9c15"]],
    ["should load a standard save (France)" ,  "france.sav", ["r|france" , 't|["Slot 2"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Germany)", "germany.sav", ["r|germany", 't|["Slot 3"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Spain)"  ,   "spain.sav", ["r|spain"  , 't|["Slot 2"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Korea)"  ,   "korea.sav", ["r|korea"  , 't|["Slot 1"]', "c|0x9b14", "i|PASS", "w|QASS", "c|0x9c15"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
