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
    ["should load a filled standard save (USA)"  , "playstation-2/filled.ps2", ["r|usa"  , 't|["Slot 3","Slot 7"]' , "s|3" , "c|0xee6a", "i|PASS"           , "w|QASS"           , "c|0xee6b"]],
    ["should load a filled standard save (Japan)", "playstation-2/filled.ps2", ["r|japan", 't|["Slot 1","Slot 8"]' , "s|8" , "c|0x08dd", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0x08de"]],
    ["should load a standard save (Europe)"      , "playstation-2/europe.ps2", [           't|["Slot 1","Slot 4"]' , "s|4" , "c|0x598a", "i|PASS"           , "w|QASS"           , "c|0x598b"]],
    ["should load a standard save (USA)"         , "playstation-2/usa.ps2"   , [           't|["Slot 2","Slot 10"]', "s|10", "c|0xef10", "i|PASS"           , "w|QASS"           , "c|0xef11"]],
    ["should load a standard save (Japan)"       , "playstation-2/japan.ps2" , [           't|["Slot 3","Slot 7"]' , "s|3" , "c|0x089c", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0x089d"]],
    ["should load a PSV save (Europe)"           , "playstation-2/europe.psv", [           't|["Slot 1","Slot 4"]' , "s|4" , "c|0x598a", "i|PASS"           , "w|QASS"           , "c|0x598b"]],
    ["should load a PSV save (USA)"              , "playstation-2/usa.psv"   , [           't|["Slot 2","Slot 10"]', "s|10", "c|0xef10", "i|PASS"           , "w|QASS"           , "c|0xef11"]],
    ["should load a PSV save (Japan)"            , "playstation-2/japan.psv" , [           't|["Slot 3","Slot 7"]' , "s|3" , "c|0x089c", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0x089d"]],
    ["should load a PSU save (Europe)"           , "playstation-2/europe.psu", [           't|["Slot 1","Slot 4"]' , "s|4" , "c|0x598a", "i|PASS"           , "w|QASS"           , "c|0x598b"]],
    ["should load a PSU save (USA)"              , "playstation-2/usa.psu"   , [           't|["Slot 2","Slot 10"]', "s|10", "c|0xef10", "i|PASS"           , "w|QASS"           , "c|0xef11"]],
    ["should load a PSU save (Japan)"            , "playstation-2/japan.psu" , [           't|["Slot 3","Slot 7"]' , "s|3" , "c|0x089c", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0x089d"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
