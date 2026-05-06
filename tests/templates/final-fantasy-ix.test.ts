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
    ["should load a filled standard save (Japan)"   , "playstation/filled.mcr"        , ["r|japan", 't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a filled standard save (Italy)"   , "playstation/filled.mcr"        , ["r|italy", 't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a deleted standard save (Slot 12)", "playstation/deleted-slot12.mcr", [           't|["Slot 12"]'         , "s|1$1" , "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a standard save (Europe)"         , "playstation/europe.mcr"        , [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a standard save (USA)"            , "playstation/usa.mcr"           , [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a standard save (Japan)"          , "playstation/japan.mcr"         , [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a standard save (France)"         , "playstation/france.mcr"        , [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a standard save (Germany)"        , "playstation/germany.mcr"       , [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a standard save (Italy)"          , "playstation/italy.mcr"         , [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a standard save (Spain)"          , "playstation/spain.mcr"         , [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a PSV save (Europe)"              , "playstation/europe.psv"        , [           't|["Slot 4"]'          , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a PSV save (USA)"                 , "playstation/usa.psv"           , [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a PSV save (Japan)"               , "playstation/japan.psv"         , [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a PSV save (France)"              , "playstation/france.psv"        , [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a PSV save (Germany)"             , "playstation/germany.psv"       , [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a PSV save (Italy)"               , "playstation/italy.psv"         , [           't|["Slot 8"]'          , "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a PSV save (Spain)"               , "playstation/spain.psv"         , [           't|["Slot 12"]'         , "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a VMP save (Europe)"              , "playstation/europe.vmp"        , [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a VMP save (USA)"                 , "playstation/usa.vmp"           , [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a VMP save (Japan)"               , "playstation/japan.vmp"         , [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a VMP save (France)"              , "playstation/france.vmp"        , [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a VMP save (Germany)"             , "playstation/germany.vmp"       , [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a VMP save (Italy)"               , "playstation/italy.vmp"         , [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a VMP save (Spain)"               , "playstation/spain.vmp"         , [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a DexDrive save (Europe)"         , "playstation/europe.gme"        , [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a DexDrive save (USA)"            , "playstation/usa.gme"           , [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a DexDrive save (Japan)"          , "playstation/japan.gme"         , [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a DexDrive save (France)"         , "playstation/france.gme"        , [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a DexDrive save (Germany)"        , "playstation/germany.gme"       , [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a DexDrive save (Italy)"          , "playstation/italy.gme"         , [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a DexDrive save (Spain)"          , "playstation/spain.gme"         , [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
