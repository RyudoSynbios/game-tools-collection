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
  defaultTests(game, ["game-boy-advance"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"    ,   "empty.sav", ["r|europe", 't|["System","Boss Rush Mode"]']],
    ["should load a deleted standard save"   , "deleted.sav", ["r|europe", 't|["System","Boss Rush Mode"]']],
    ["should load a standard save (Europe)"  ,  "europe.sav", ["r|europe", 't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a standard save (USA)"     ,     "usa.sav", ["r|usa"   , 't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"   ,   "japan.sav", ["r|japan" , 't|["System","Slot 2","Boss Rush Mode"]'         , "s|3", "i|PASS"]],
    ["should load a GameShark save (Europe)" ,  "europe.sps", ["r|europe", 't|["System","Slot 1","Slot 3","Boss Rush Mode"]', "s|2", "i|PASS"]],
    ["should load a GameShark save (USA)"    ,     "usa.sps", ["r|usa"   , 't|["System","Slot 1","Slot 2","Boss Rush Mode"]', "s|3", "i|PASS"]],
    ["should load a GameShark save (Japan)"  ,   "japan.sps", ["r|japan" , 't|["System","Slot 1","Slot 3","Boss Rush Mode"]', "s|4", "i|PASS"]],
    ["should load a filled Collection save"  ,  "filled.bin", ["r|europe", 't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Collection save (Europe)",  "europe.bin", [            't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Collection save (USA)"   ,     "usa.bin", [            't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a Collection save (Japan)" ,   "japan.bin", [            't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
