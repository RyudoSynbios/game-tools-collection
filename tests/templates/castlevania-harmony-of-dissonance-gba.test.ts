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
    ["should load an empty standard save"    ,   "empty.sav", ["r|europe", 't|["General","Boss Rush Mode"]']],
    ["should load a deleted standard save"   , "deleted.sav", ["r|europe", 't|["General","Boss Rush Mode"]']],
    ["should load a standard save (Europe)"  ,  "europe.sav", ["r|europe", 't|["General","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a standard save (USA)"     ,     "usa.sav", ["r|usa"   , 't|["General","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"   ,   "japan.sav", ["r|japan" , 't|["General","Slot 2","Boss Rush Mode"]'         , "s|3", "i|PASS"]],
    ["should load a GameShark save (Europe)" ,  "europe.sps", ["r|europe", 't|["General","Slot 1","Slot 3","Boss Rush Mode"]', "s|2", "i|PASS"]],
    ["should load a GameShark save (USA)"    ,     "usa.sps", ["r|usa"   , 't|["General","Slot 1","Slot 2","Boss Rush Mode"]', "s|3", "i|PASS"]],
    ["should load a GameShark save (Japan)"  ,   "japan.sps", ["r|japan" , 't|["General","Slot 1","Slot 3","Boss Rush Mode"]', "s|4", "i|PASS"]],
    ["should load a filled Collection save"  ,  "filled.bin", ["r|europe", 't|["General","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Collection save (Europe)",  "europe.bin", [            't|["General","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Collection save (USA)"   ,     "usa.bin", [            't|["General","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a Collection save (Japan)" ,   "japan.bin", [            't|["General","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
