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

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)", "filled.ps2", ["r|europe", 't|["Slot 10"]'         , "s|10$1", "c|0x20c27530", "i|00$1", "i|57$2", "w|58$2", "c|0x849db3b2"]],
    ["should load a filled standard save (Japan)" , "filled.ps2", ["r|japan" , 't|["Slot 2","Slot 3"]' , "s|3$1" , "c|0x2b804a0f", "i|01$1", "i|54$2", "w|55$2", "c|0xb038c3a9"]],
    ["should load a standard save (Europe)"       , "europe.ps2", [            't|["Slot 6","Slot 14"]', "s|14$1", "c|0x2070257e", "i|02$1", "i|40$2", "w|41$2", "c|0x3802567b"]],
    ["should load a standard save (USA)"          ,    "usa.ps2", [            't|["Slot 1","Slot 16"]', "s|1$1" , "c|0x9db2acb0", "i|00$1", "i|52$2", "w|53$2", "c|0x4fa4333b"]],
    ["should load a standard save (Japan)"        ,  "japan.ps2", [            't|["Slot 3"]'          , "s|3$1" , "c|0x4ff1883b", "i|01$1", "i|22$2", "w|23$2", "c|0xb9378351"]],
    ["should load a PSV save (Europe)"            , "europe.psv", [            't|["Slot 6","Slot 14"]', "s|14$1", "c|0x2070257e", "i|02$1", "i|40$2", "w|41$2", "c|0x3802567b"]],
    ["should load a PSV save (USA)"               ,    "usa.psv", [            't|["Slot 1","Slot 16"]', "s|1$1" , "c|0x9db2acb0", "i|00$1", "i|52$2", "w|53$2", "c|0x4fa4333b"]],
    ["should load a PSV save (Japan)"             ,  "japan.psv", [            't|["Slot 3"]'          , "s|3$1" , "c|0x4ff1883b", "i|01$1", "i|22$2", "w|23$2", "c|0xb9378351"]],
    ["should load a PSU save (Europe)"            , "europe.psu", [            't|["Slot 6","Slot 14"]', "s|14$1", "c|0x2070257e", "i|02$1", "i|40$2", "w|41$2", "c|0x3802567b"]],
    ["should load a PSU save (USA)"               ,    "usa.psu", [            't|["Slot 1","Slot 16"]', "s|1$1" , "c|0x9db2acb0", "i|00$1", "i|52$2", "w|53$2", "c|0x4fa4333b"]],
    ["should load a PSU save (Japan)"             ,  "japan.psu", [            't|["Slot 3"]'          , "s|3$1" , "c|0x4ff1883b", "i|01$1", "i|22$2", "w|23$2", "c|0xb9378351"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
