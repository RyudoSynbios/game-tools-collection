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
    ["should load a filled standard save (Europe)"               , "playstation/filled.mcr"             , ["r|europe"             , 't|["Slot 9"]'           , "s|9$1" , "c|0x6bbe", "s|2$2", "i|PASS", "w|QASS", "c|0xe236"]],
    ["should load a filled standard save (Japan) (International)", "playstation/filled.mcr"             , ["r|japan international", 't|["Slot 14"]'          , "s|14$1", "c|0x94b6", "s|2$2", "i|PASS", "w|QASS", "c|0x186d"]],
    ["should load a deleted standard save (Slot 6)"              , "playstation/deleted-slot6.mcr"      , [                         't|["Slot 6"]'           , "s|6$1" , "c|0xf2d1", "s|2$2", "i|PASS", "w|QASS", "c|0x7b59"]],
    ["should load a standard save (Europe)"                      , "playstation/europe.mcr"             , [                         't|["Slot 4","Slot 8"]'  , "s|8$1" , "c|0x08ba", "s|2$2", "i|PASS", "w|QASS", "c|0x8132"]],
    ["should load a standard save (USA)"                         , "playstation/usa.mcr"                , [                         't|["Slot 7","Slot 10"]' , "s|7$1" , "c|0xddb9", "s|2$2", "i|PASS", "w|QASS", "c|0x5431"]],
    ["should load a standard save (Japan)"                       , "playstation/japan.mcr"              , [                         't|["Slot 4","Slot 6"]'  , "s|4$1" , "c|0x1730", "s|2$2", "i|PASS", "w|QASS", "c|0x9beb"]],
    ["should load a standard save (Japan) (International)"       , "playstation/japan-international.mcr", [                         't|["Slot 14","Slot 15"]', "s|15$1", "c|0x96e8", "s|2$2", "i|PASS", "w|QASS", "c|0x1a33"]],
    ["should load a standard save (France)"                      , "playstation/france.mcr"             , [                         't|["Slot 12","Slot 15"]', "s|12$1", "c|0xcfcb", "s|2$2", "i|PASS", "w|QASS", "c|0x4643"]],
    ["should load a standard save (Germany)"                     , "playstation/germany.mcr"            , [                         't|["Slot 2","Slot 6"]'  , "s|6$1" , "c|0xf2d1", "s|2$2", "i|PASS", "w|QASS", "c|0x7b59"]],
    ["should load a standard save (Spain)"                       , "playstation/spain.mcr"              , [                         't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xb778", "s|2$2", "i|PASS", "w|QASS", "c|0x3ef0"]],
    ["should load a standard save (Spain) (Rev 1)"               , "playstation/spain-rev1.mcr"         , [                         't|["Slot 1","Slot 11"]' , "s|1$1" , "c|0x98b6", "s|2$2", "i|PASS", "w|QASS", "c|0x113e"]],
    ["should load a PSV save (Europe)"                           , "playstation/europe.psv"             , [                         't|["Slot 8"]'           , "s|8$1" , "c|0x08ba", "s|2$2", "i|PASS", "w|QASS", "c|0x8132"]],
    ["should load a PSV save (USA)"                              , "playstation/usa.psv"                , [                         't|["Slot 7"]'           , "s|7$1" , "c|0xddb9", "s|2$2", "i|PASS", "w|QASS", "c|0x5431"]],
    ["should load a PSV save (Japan)"                            , "playstation/japan.psv"              , [                         't|["Slot 4"]'           , "s|4$1" , "c|0x1730", "s|2$2", "i|PASS", "w|QASS", "c|0x9beb"]],
    ["should load a PSV save (Japan) (International)"            , "playstation/japan-international.psv", [                         't|["Slot 15"]'          , "s|15$1", "c|0x96e8", "s|2$2", "i|PASS", "w|QASS", "c|0x1a33"]],
    ["should load a PSV save (France)"                           , "playstation/france.psv"             , [                         't|["Slot 12"]'          , "s|12$1", "c|0xcfcb", "s|2$2", "i|PASS", "w|QASS", "c|0x4643"]],
    ["should load a PSV save (Germany)"                          , "playstation/germany.psv"            , [                         't|["Slot 6"]'           , "s|6$1" , "c|0xf2d1", "s|2$2", "i|PASS", "w|QASS", "c|0x7b59"]],
    ["should load a PSV save (Spain)"                            , "playstation/spain.psv"              , [                         't|["Slot 9"]'           , "s|9$1" , "c|0xb778", "s|2$2", "i|PASS", "w|QASS", "c|0x3ef0"]],
    ["should load a PSV save (Spain) (Rev 1)"                    , "playstation/spain-rev1.psv"         , [                         't|["Slot 1"]'           , "s|1$1" , "c|0x98b6", "s|2$2", "i|PASS", "w|QASS", "c|0x113e"]],
    ["should load a VMP save (Europe)"                           , "playstation/europe.vmp"             , [                         't|["Slot 4","Slot 8"]'  , "s|8$1" , "c|0x08ba", "s|2$2", "i|PASS", "w|QASS", "c|0x8132"]],
    ["should load a VMP save (USA)"                              , "playstation/usa.vmp"                , [                         't|["Slot 7","Slot 10"]' , "s|7$1" , "c|0xddb9", "s|2$2", "i|PASS", "w|QASS", "c|0x5431"]],
    ["should load a VMP save (Japan)"                            , "playstation/japan.vmp"              , [                         't|["Slot 4","Slot 6"]'  , "s|4$1" , "c|0x1730", "s|2$2", "i|PASS", "w|QASS", "c|0x9beb"]],
    ["should load a VMP save (Japan) (International)"            , "playstation/japan-international.vmp", [                         't|["Slot 14","Slot 15"]', "s|15$1", "c|0x96e8", "s|2$2", "i|PASS", "w|QASS", "c|0x1a33"]],
    ["should load a VMP save (France)"                           , "playstation/france.vmp"             , [                         't|["Slot 12","Slot 15"]', "s|12$1", "c|0xcfcb", "s|2$2", "i|PASS", "w|QASS", "c|0x4643"]],
    ["should load a VMP save (Germany)"                          , "playstation/germany.vmp"            , [                         't|["Slot 2","Slot 6"]'  , "s|6$1" , "c|0xf2d1", "s|2$2", "i|PASS", "w|QASS", "c|0x7b59"]],
    ["should load a VMP save (Spain)"                            , "playstation/spain.vmp"              , [                         't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xb778", "s|2$2", "i|PASS", "w|QASS", "c|0x3ef0"]],
    ["should load a VMP save (Spain) (Rev 1)"                    , "playstation/spain-rev1.vmp"         , [                         't|["Slot 1","Slot 11"]' , "s|1$1" , "c|0x98b6", "s|2$2", "i|PASS", "w|QASS", "c|0x113e"]],
    ["should load a DexDrive save (Europe)"                      , "playstation/europe.gme"             , [                         't|["Slot 4","Slot 8"]'  , "s|8$1" , "c|0x08ba", "s|2$2", "i|PASS", "w|QASS", "c|0x8132"]],
    ["should load a DexDrive save (USA)"                         , "playstation/usa.gme"                , [                         't|["Slot 7","Slot 10"]' , "s|7$1" , "c|0xddb9", "s|2$2", "i|PASS", "w|QASS", "c|0x5431"]],
    ["should load a DexDrive save (Japan)"                       , "playstation/japan.gme"              , [                         't|["Slot 4","Slot 6"]'  , "s|4$1" , "c|0x1730", "s|2$2", "i|PASS", "w|QASS", "c|0x9beb"]],
    ["should load a DexDrive save (Japan) (International)"       , "playstation/japan-international.gme", [                         't|["Slot 14","Slot 15"]', "s|15$1", "c|0x96e8", "s|2$2", "i|PASS", "w|QASS", "c|0x1a33"]],
    ["should load a DexDrive save (France)"                      , "playstation/france.gme"             , [                         't|["Slot 12","Slot 15"]', "s|12$1", "c|0xcfcb", "s|2$2", "i|PASS", "w|QASS", "c|0x4643"]],
    ["should load a DexDrive save (Germany)"                     , "playstation/germany.gme"            , [                         't|["Slot 2","Slot 6"]'  , "s|6$1" , "c|0xf2d1", "s|2$2", "i|PASS", "w|QASS", "c|0x7b59"]],
    ["should load a DexDrive save (Spain)"                       , "playstation/spain.gme"              , [                         't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xb778", "s|2$2", "i|PASS", "w|QASS", "c|0x3ef0"]],
    ["should load a DexDrive save (Spain) (Rev 1)"               , "playstation/spain-rev1.gme"         , [                         't|["Slot 1","Slot 11"]' , "s|1$1" , "c|0x98b6", "s|2$2", "i|PASS", "w|QASS", "c|0x113e"]],
    // Steam
    ["should load a Steam save"                                  , "steam/save03.ff7"                   , ["r|europe"             , 't|["Slot 5","Slot 14"]' , "s|14$1", "c|0x5213", "s|2$2", "i|PASS", "w|QASS", "c|0xdb9b"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
