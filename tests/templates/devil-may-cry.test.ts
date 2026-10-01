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
    ["should load a filled standard save (Europe)"   , "playstation-2/filled.ps2"            , ["r|europe", 't|["System","Slot 8","Options"]' , "c|0x000000e1", "i|0", "w|1", "s|9" , "c|0x00004a20", "i|8" , "w|9" , "c|0x00004a21", "s|1", "c|0x000000e2"]],
    ["should load a filled standard save (USA)"      , "playstation-2/filled.ps2"            , ["r|usa"   , 't|["System","Slot 1","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|2" , "c|0x00004a0a", "i|1" , "w|2" , "c|0x00004a0b", "s|1", "c|0x000000e1"]],
    ["should load a standard save (Europe)"          , "playstation-2/europe.ps2"            , [            't|["System","Slot 4","Options"]' , "c|0x000000e1", "i|0", "w|1", "s|5" , "c|0x00004a3a", "i|4" , "w|5" , "c|0x00004a3b", "s|1", "c|0x000000e2"]],
    ["should load a standard save (USA)"             , "playstation-2/usa.ps2"               , [            't|["System","Slot 5","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|6" , "c|0x00004a45", "i|5" , "w|6" , "c|0x00004a46", "s|1", "c|0x000000e1"]],
    ["should load a standard save (Japan)"           , "playstation-2/japan.ps2"             , [            't|["System","Slot 2","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|3" , "c|0x00004a18", "i|2" , "w|3" , "c|0x00004a19", "s|1", "c|0x000000e1"]],
    ["should load a standard save (Korea)"           , "playstation-2/korea.ps2"             , [            't|["System","Slot 10","Options"]', "c|0x000000e0", "i|0", "w|1", "s|11", "c|0x00004a96", "i|10", "w|11", "c|0x00004a97", "s|1", "c|0x000000e1"]],
    ["should load a PSV save (Europe)"               , "playstation-2/europe.psv"            , [            't|["System","Slot 4","Options"]' , "c|0x000000e1", "i|0", "w|1", "s|5" , "c|0x00004a3a", "i|4" , "w|5" , "c|0x00004a3b", "s|1", "c|0x000000e2"]],
    ["should load a PSV save (USA)"                  , "playstation-2/usa.psv"               , [            't|["System","Slot 5","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|6" , "c|0x00004a45", "i|5" , "w|6" , "c|0x00004a46", "s|1", "c|0x000000e1"]],
    ["should load a PSV save (Japan)"                , "playstation-2/japan.psv"             , [            't|["System","Slot 2","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|3" , "c|0x00004a18", "i|2" , "w|3" , "c|0x00004a19", "s|1", "c|0x000000e1"]],
    ["should load a PSV save (Korea)"                , "playstation-2/korea.psv"             , [            't|["System","Slot 10","Options"]', "c|0x000000e0", "i|0", "w|1", "s|11", "c|0x00004a96", "i|10", "w|11", "c|0x00004a97", "s|1", "c|0x000000e1"]],
    ["should load a PSU save (Europe)"               , "playstation-2/europe.psu"            , [            't|["System","Slot 4","Options"]' , "c|0x000000e1", "i|0", "w|1", "s|5" , "c|0x00004a3a", "i|4" , "w|5" , "c|0x00004a3b", "s|1", "c|0x000000e2"]],
    ["should load a PSU save (USA)"                  , "playstation-2/usa.psu"               , [            't|["System","Slot 5","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|6" , "c|0x00004a45", "i|5" , "w|6" , "c|0x00004a46", "s|1", "c|0x000000e1"]],
    ["should load a PSU save (Japan)"                , "playstation-2/japan.psu"             , [            't|["System","Slot 2","Options"]' , "c|0x000000e0", "i|0", "w|1", "s|3" , "c|0x00004a18", "i|2" , "w|3" , "c|0x00004a19", "s|1", "c|0x000000e1"]],
    ["should load a PSU save (Korea)"                , "playstation-2/korea.psu"             , [            't|["System","Slot 10","Options"]', "c|0x000000e0", "i|0", "w|1", "s|11", "c|0x00004a96", "i|10", "w|11", "c|0x00004a97", "s|1", "c|0x000000e1"]],
    // Devil May Cry HD Collection
    ["should load a Devil May Cry HD Collection save", "devil-may-cry-hd-collection/dmc1.sav", [            't|["System","Slot 7","Options"]' , "c|0x00000000", "i|0", "w|1", "s|8" , "c|0x000049e2", "i|7" , "w|8" , "c|0x000049e3", "s|1", "c|0x00000001"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
