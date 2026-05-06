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
    // Game Boy Advance
    ["should load an empty standard save"                        , "game-boy-advance/empty.sav"               , ["r|europe", 't|["System"]']],
    ["should load a deleted standard save"                       , "game-boy-advance/deleted.sav"             , ["r|europe", 't|["System"]']],
    ["should load a standard save (Europe)"                      , "game-boy-advance/europe.sav"              , ["r|europe", 't|["System","Slot 7"]', "s|8", "c|0x92", "i|PASS", "w|QASS", "c|0x93"]],
    ["should load a standard save (USA)"                         , "game-boy-advance/usa.sav"                 , ["r|usa"   , 't|["System","Slot 3"]', "s|4", "c|0xf1", "i|PASS", "w|QASS", "c|0xf2"]],
    ["should load a standard save (Japan)"                       , "game-boy-advance/japan.sav"               , ["r|japan" , 't|["System","Slot 4"]', "s|5", "c|0x12", "i|PASS", "w|QASS", "c|0x13"]],
    ["should load a GameShark save (Europe)"                     , "game-boy-advance/europe.sps"              , ["r|europe", 't|["System","Slot 8"]', "s|9", "c|0x22", "i|PASS", "w|QASS", "c|0x23"]],
    ["should load a GameShark save (USA)"                        , "game-boy-advance/usa.sps"                 , ["r|usa"   , 't|["System","Slot 5"]', "s|6", "c|0x2b", "i|PASS", "w|QASS", "c|0x2c"]],
    ["should load a GameShark save (Japan)"                      , "game-boy-advance/japan.sps"               , ["r|japan" , 't|["System","Slot 1"]', "s|2", "c|0xb4", "i|PASS", "w|QASS", "c|0xb5"]],
    // Castlevania Advance Collection
    ["should load a filled Castlevania Advance Collection save"  , "castlevania-advance-collection/filled.bin", ["r|usa"   , 't|["System","Slot 4"]', "s|5", "c|0xd7", "i|PASS", "w|QASS", "c|0xd8"]],
    ["should load a Castlevania Advance Collection save (Europe)", "castlevania-advance-collection/europe.bin", [            't|["System","Slot 7"]', "s|8", "c|0x09", "i|PASS", "w|QASS", "c|0x0a"]],
    ["should load a Castlevania Advance Collection save (USA)"   , "castlevania-advance-collection/usa.bin"   , [            't|["System","Slot 4"]', "s|5", "c|0xd7", "i|PASS", "w|QASS", "c|0xd8"]],
    ["should load a Castlevania Advance Collection save (Japan)" , "castlevania-advance-collection/japan.bin" , [            't|["System","Slot 5"]', "s|6", "c|0x81", "i|PASS", "w|QASS", "c|0x82"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
