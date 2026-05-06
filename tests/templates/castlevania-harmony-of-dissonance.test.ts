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
    ["should load an empty standard save"                        , "game-boy-advance/empty.sav"               , ["r|europe", 't|["System","Boss Rush Mode"]']],
    ["should load a deleted standard save"                       , "game-boy-advance/deleted.sav"             , ["r|europe", 't|["System","Boss Rush Mode"]']],
    ["should load a standard save (Europe)"                      , "game-boy-advance/europe.sav"              , ["r|europe", 't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a standard save (USA)"                         , "game-boy-advance/usa.sav"                 , ["r|usa"   , 't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (Japan)"                       , "game-boy-advance/japan.sav"               , ["r|japan" , 't|["System","Slot 2","Boss Rush Mode"]'         , "s|3", "i|PASS"]],
    ["should load a GameShark save (Europe)"                     , "game-boy-advance/europe.sps"              , ["r|europe", 't|["System","Slot 1","Slot 3","Boss Rush Mode"]', "s|2", "i|PASS"]],
    ["should load a GameShark save (USA)"                        , "game-boy-advance/usa.sps"                 , ["r|usa"   , 't|["System","Slot 1","Slot 2","Boss Rush Mode"]', "s|3", "i|PASS"]],
    ["should load a GameShark save (Japan)"                      , "game-boy-advance/japan.sps"               , ["r|japan" , 't|["System","Slot 1","Slot 3","Boss Rush Mode"]', "s|4", "i|PASS"]],
    // Castlevania Advance Collection
    ["should load a filled Castlevania Advance Collection save"  , "castlevania-advance-collection/filled.bin", ["r|europe", 't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Castlevania Advance Collection save (Europe)", "castlevania-advance-collection/europe.bin", [            't|["System","Slot 1","Boss Rush Mode"]'         , "s|2", "i|PASS"]],
    ["should load a Castlevania Advance Collection save (USA)"   , "castlevania-advance-collection/usa.bin"   , [            't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
    ["should load a Castlevania Advance Collection save (Japan)" , "castlevania-advance-collection/japan.bin" , [            't|["System","Slot 3","Boss Rush Mode"]'         , "s|4", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
