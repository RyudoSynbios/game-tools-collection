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
    ["should load an empty standard save"             ,   "empty.sav", ["r|europe", 't|["General"]'         , "i|English"]],
    ["should load a deleted standard save"            , "deleted.sav", ["r|japan" , 't|["General"]'         , "i|Japanese"]],
    ["should not load a standard save with bad region",   "empty.sav", ["r|japan" , 't|["General"]'         , "n|English"]],
    ["should load a standard save (Europe)"           ,  "europe.sav", ["r|europe", 't|["General","Slot 2"]', "i|French",   "s|3", "i|PASS"]],
    ["should load a standard save (USA)"              ,     "usa.sav", ["r|usa"   , 't|["General","Slot 1"]', "i|English",  "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"            ,   "japan.sav", ["r|japan" , 't|["General","Slot 3"]', "i|Japanese", "s|4", "i|PASS"]],
    ["should load a GameShark save (Europe)"          ,  "europe.sps", ["r|europe", 't|["General","Slot 2"]', "i|German",   "s|3", "i|PASS"]],
    ["should load a GameShark save (USA)"             ,     "usa.sps", ["r|usa"   , 't|["General","Slot 3"]', "i|English",  "s|4", "i|PASS"]],
    ["should load a GameShark save (Japan)"           ,   "japan.sps", ["r|japan" , 't|["General","Slot 1"]', "i|Japanese", "s|2", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
