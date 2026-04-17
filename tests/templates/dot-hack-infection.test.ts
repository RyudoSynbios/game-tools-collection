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
  defaultTests(game, ["playstation-2"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)", "filled.ps2", ["r|europe", 't|["Slot 2","Slot 5"]'  , "s|5" , "c|0xd007", "i|PASS"           , "w|QASS"           , "c|0xd008"]],
    ["should load a filled standard save (USA)"   , "filled.ps2", ["r|usa"   , 't|["Slot 3","Slot 10"]' , "s|10", "c|0x4500", "i|PASS"           , "w|QASS"           , "c|0x4501"]],
    ["should load a standard save (Europe)"       , "europe.ps2", [            't|["Slot 2","Slot 4"]'  , "s|4" , "c|0xcfba", "i|PASS"           , "w|QASS"           , "c|0xcfbb"]],
    ["should load a standard save (USA)"          ,    "usa.ps2", [            't|["Slot 11","Slot 12"]', "s|11", "c|0x4555", "i|PASS"           , "w|QASS"           , "c|0x4556"]],
    ["should load a standard save (Japan)"        ,  "japan.ps2", [            't|["Slot 4","Slot 5"]'  , "s|4" , "c|0xf3a4", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xf3a5"]],
    ["should load a PSV save (Europe)"            , "europe.psv", [            't|["Slot 2","Slot 4"]'  , "s|4" , "c|0xcfba", "i|PASS"           , "w|QASS"           , "c|0xcfbb"]],
    ["should load a PSV save (USA)"               ,    "usa.psv", [            't|["Slot 11","Slot 12"]', "s|11", "c|0x4555", "i|PASS"           , "w|QASS"           , "c|0x4556"]],
    ["should load a PSV save (Japan)"             ,  "japan.psv", [            't|["Slot 4","Slot 5"]'  , "s|4" , "c|0xf3a4", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xf3a5"]],
    ["should load a PSU save (Europe)"            , "europe.psu", [            't|["Slot 2","Slot 4"]'  , "s|4" , "c|0xcfba", "i|PASS"           , "w|QASS"           , "c|0xcfbb"]],
    ["should load a PSU save (USA)"               ,    "usa.psu", [            't|["Slot 11","Slot 12"]', "s|11", "c|0x4555", "i|PASS"           , "w|QASS"           , "c|0x4556"]],
    ["should load a PSU save (Japan)"             ,  "japan.psu", [            't|["Slot 4","Slot 5"]'  , "s|4" , "c|0xf3a4", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xf3a5"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
