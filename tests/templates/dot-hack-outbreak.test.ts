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
    // PlayStation 2
    ["should load a filled standard save (Europe)", "playstation-2/filled.ps2", ["r|europe", 't|["Slot 1","Slot 9"]'  , "s|1" , "c|0x4956", "i|PASS"           , "w|QASS"           , "c|0x4957"]],
    ["should load a filled standard save (Japan)" , "playstation-2/filled.ps2", ["r|japan" , 't|["Slot 2","Slot 12"]' , "s|2" , "c|0xd6b4", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xd6b5"]],
    ["should load a standard save (Europe)"       , "playstation-2/europe.ps2", [            't|["Slot 1","Slot 12"]' , "s|1" , "c|0x4a47", "i|PASS"           , "w|QASS"           , "c|0x4a48"]],
    ["should load a standard save (USA)"          , "playstation-2/usa.ps2"   , [            't|["Slot 3","Slot 5"]'  , "s|3" , "c|0xb4a2", "i|PASS"           , "w|QASS"           , "c|0xb4a3"]],
    ["should load a standard save (Japan)"        , "playstation-2/japan.ps2" , [            't|["Slot 10","Slot 12"]', "s|12", "c|0xd6aa", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xd6ab"]],
    ["should load a PSV save (Europe)"            , "playstation-2/europe.psv", [            't|["Slot 1","Slot 12"]' , "s|1" , "c|0x4a47", "i|PASS"           , "w|QASS"           , "c|0x4a48"]],
    ["should load a PSV save (USA)"               , "playstation-2/usa.psv"   , [            't|["Slot 3","Slot 5"]'  , "s|3" , "c|0xb4a2", "i|PASS"           , "w|QASS"           , "c|0xb4a3"]],
    ["should load a PSV save (Japan)"             , "playstation-2/japan.psv" , [            't|["Slot 10","Slot 12"]', "s|12", "c|0xd6aa", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xd6ab"]],
    ["should load a PSU save (Europe)"            , "playstation-2/europe.psu", [            't|["Slot 1","Slot 12"]' , "s|1" , "c|0x4a47", "i|PASS"           , "w|QASS"           , "c|0x4a48"]],
    ["should load a PSU save (USA)"               , "playstation-2/usa.psu"   , [            't|["Slot 3","Slot 5"]'  , "s|3" , "c|0xb4a2", "i|PASS"           , "w|QASS"           , "c|0xb4a3"]],
    ["should load a PSU save (Japan)"             , "playstation-2/japan.psu" , [            't|["Slot 10","Slot 12"]', "s|12", "c|0xd6aa", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xd6ab"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
