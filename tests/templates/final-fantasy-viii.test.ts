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
  defaultTests(game, ["playstation"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation/deleted.mcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (France)"     , "playstation/filled.mcr"                        , ["r|france", 't|["Slot 12"]'          , "s|12$1", "c|0x23e6", "i|15", "w|16", "c|0x8eee", "s|3$3", "i|PASS"]],
    ["should load a filled standard save (Spain)"      , "playstation/filled.mcr"                        , ["r|spain" , 't|["Slot 4"]'           , "s|4$1" , "c|0xb37a", "i|16", "w|17", "c|0x47b4", "s|3$3", "i|PASS"]],
    ["should load a deleted standard save (Slot 1)"    , "playstation/deleted-slot1.mcr"                 , [            't|["Slot 1"]'           , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a standard save (Europe, Australia)" , "playstation/europeaustralia.mcr"               , [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a standard save (USA)"               , "playstation/usa.mcr"                           , [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a standard save (Japan, Asia)"       , "playstation/japanasia.mcr"                     , [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a standard save (France)"            , "playstation/france.mcr"                        , [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a standard save (Germany)"           , "playstation/germany.mcr"                       , [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a standard save (Italy)"             , "playstation/italy.mcr"                         , [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a standard save (Spain)"             , "playstation/spain.mcr"                         , [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Europe, Australia)"      , "playstation/europeaustralia.psv"               , [            't|["Slot 9"]'           , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a PSV save (USA)"                    , "playstation/usa.psv"                           , [            't|["Slot 15"]'          , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Japan, Asia)"            , "playstation/japanasia.psv"                     , [            't|["Slot 7"]'           , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a PSV save (France)"                 , "playstation/france.psv"                        , [            't|["Slot 1"]'           , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Germany)"                , "playstation/germany.psv"                       , [            't|["Slot 11"]'          , "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Italy)"                  , "playstation/italy.psv"                         , [            't|["Slot 3"]'           , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Spain)"                  , "playstation/spain.psv"                         , [            't|["Slot 5"]'           , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Europe, Australia)"      , "playstation/europeaustralia.vmp"               , [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a VMP save (USA)"                    , "playstation/usa.vmp"                           , [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Japan, Asia)"            , "playstation/japanasia.vmp"                     , [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a VMP save (France)"                 , "playstation/france.vmp"                        , [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Germany)"                , "playstation/germany.vmp"                       , [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Italy)"                  , "playstation/italy.vmp"                         , [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Spain)"                  , "playstation/spain.vmp"                         , [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Europe, Australia)" , "playstation/europeaustralia.gme"               , [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (USA)"               , "playstation/usa.gme"                           , [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Japan, Asia)"       , "playstation/japanasia.gme"                     , [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (France)"            , "playstation/france.gme"                        , [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Germany)"           , "playstation/germany.gme"                       , [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Italy)"             , "playstation/italy.gme"                         , [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Spain)"             , "playstation/spain.gme"                         , [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    // Final Fantasy VIII Remastered
    ["should load a Final Fantasy VIII Remastered save", "final-fantasy-viii-remastered/slot1_save02.ff8", ["r|usa"   , 't|["Slot 1"]'           , "s|1$1" , "c|0x49e1", "i|08", "w|09", "c|0x7575", "s|3$3", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
