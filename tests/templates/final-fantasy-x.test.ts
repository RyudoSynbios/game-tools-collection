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
  defaultTests(game, ["playstation-2"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation-2/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (Europe)"        , "playstation-2/filled.ps2"             , ["r|europe", 't|["Slot 17","Slot 68"]', "s|2$1", "c|0x4dd1$1", "c|0x4dd1$2", "s|2$2", "i|PASS", "w|QASS", "c|0x6fed$1", "c|0x6fed$2"]],
    ["should load a filled standard save (Japan)"         , "playstation-2/filled.ps2"             , ["r|japan" , 't|["Slot 54","Slot 55"]', "s|2$1", "c|0xe164$1", "c|0xe164$2", "s|2$2", "i|PASS", "w|QASS", "c|0xa489$1", "c|0xa489$2"]],
    ["should load a deleted standard save (Slot 40)"      , "playstation-2/deleted-slot40.ps2"     , [            't|["Slot 40"]'          , "s|1$1", "c|0x30e1$1", "c|0x30e1$2", "s|2$2", "i|PASS", "w|QASS", "c|0xcec2$1", "c|0xcec2$2"]],
    ["should load a standard save (Europe)"               , "playstation-2/europe.ps2"             , [            't|["Slot 23"]'          , "s|1$1", "c|0x833f$1", "c|0x833f$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2f8e$1", "c|0x2f8e$2"]],
    ["should load a standard save (USA)"                  , "playstation-2/usa.ps2"                , [            't|["Slot 59"]'          , "s|1$1", "c|0x902c$1", "c|0x902c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2bda$1", "c|0x2bda$2"]],
    ["should load a standard save (Japan)"                , "playstation-2/japan.ps2"              , [            't|["Slot 18"]'          , "s|1$1", "c|0x99b1$1", "c|0x99b1$2", "s|2$2", "i|PASS", "w|QASS", "c|0xbff0$1", "c|0xbff0$2"]],
    ["should load a standard save (France)"               , "playstation-2/france.ps2"             , [            't|["Slot 97"]'          , "s|1$1", "c|0x4c99$1", "c|0x4c99$2", "s|2$2", "i|PASS", "w|QASS", "c|0x97d7$1", "c|0x97d7$2"]],
    ["should load a standard save (Germany)"              , "playstation-2/germany.ps2"            , [            't|["Slot 10"]'          , "s|1$1", "c|0xd68a$1", "c|0xd68a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x8c1a$1", "c|0x8c1a$2"]],
    ["should load a standard save (Italy)"                , "playstation-2/italy.ps2"              , [            't|["Slot 69"]'          , "s|1$1", "c|0xa91c$1", "c|0xa91c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x80eb$1", "c|0x80eb$2"]],
    ["should load a standard save (Spain)"                , "playstation-2/spain.ps2"              , [            't|["Slot 42"]'          , "s|1$1", "c|0x4b1d$1", "c|0x4b1d$2", "s|2$2", "i|PASS", "w|QASS", "c|0x16f2$1", "c|0x16f2$2"]],
    ["should load a standard save (International) (Japan)", "playstation-2/international-japan.ps2", [            't|["Slot 32"]'          , "s|1$1", "c|0xb211$1", "c|0xb211$2", "s|2$2", "i|PASS", "w|QASS", "c|0x1ea0$1", "c|0x1ea0$2"]],
    ["should load a standard save (International) (Asia)" , "playstation-2/international-asia.ps2" , [            't|["Slot 77"]'          , "s|1$1", "c|0xe95a$1", "c|0xe95a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x0976$1", "c|0x0976$2"]],
    ["should load a standard save (International) (Korea)", "playstation-2/international-korea.ps2", [            't|["Slot 86"]'          , "s|1$1", "c|0x5724$1", "c|0x5724$2", "s|2$2", "i|PASS", "w|QASS", "c|0xb682$1", "c|0xb682$2"]],
    ["should load a PSV save (Europe)"                    , "playstation-2/europe.psv"             , [            't|["Slot 23"]'          , "s|1$1", "c|0x833f$1", "c|0x833f$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2f8e$1", "c|0x2f8e$2"]],
    ["should load a PSV save (USA)"                       , "playstation-2/usa.psv"                , [            't|["Slot 59"]'          , "s|1$1", "c|0x902c$1", "c|0x902c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2bda$1", "c|0x2bda$2"]],
    ["should load a PSV save (Japan)"                     , "playstation-2/japan.psv"              , [            't|["Slot 18"]'          , "s|1$1", "c|0x99b1$1", "c|0x99b1$2", "s|2$2", "i|PASS", "w|QASS", "c|0xbff0$1", "c|0xbff0$2"]],
    ["should load a PSV save (France)"                    , "playstation-2/france.psv"             , [            't|["Slot 97"]'          , "s|1$1", "c|0x4c99$1", "c|0x4c99$2", "s|2$2", "i|PASS", "w|QASS", "c|0x97d7$1", "c|0x97d7$2"]],
    ["should load a PSV save (Germany)"                   , "playstation-2/germany.psv"            , [            't|["Slot 10"]'          , "s|1$1", "c|0xd68a$1", "c|0xd68a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x8c1a$1", "c|0x8c1a$2"]],
    ["should load a PSV save (Italy)"                     , "playstation-2/italy.psv"              , [            't|["Slot 69"]'          , "s|1$1", "c|0xa91c$1", "c|0xa91c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x80eb$1", "c|0x80eb$2"]],
    ["should load a PSV save (Spain)"                     , "playstation-2/spain.psv"              , [            't|["Slot 42"]'          , "s|1$1", "c|0x4b1d$1", "c|0x4b1d$2", "s|2$2", "i|PASS", "w|QASS", "c|0x16f2$1", "c|0x16f2$2"]],
    ["should load a PSV save (International) (Japan)"     , "playstation-2/international-japan.psv", [            't|["Slot 32"]'          , "s|1$1", "c|0xb211$1", "c|0xb211$2", "s|2$2", "i|PASS", "w|QASS", "c|0x1ea0$1", "c|0x1ea0$2"]],
    ["should load a PSV save (International) (Asia)"      , "playstation-2/international-asia.psv" , [            't|["Slot 77"]'          , "s|1$1", "c|0xe95a$1", "c|0xe95a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x0976$1", "c|0x0976$2"]],
    ["should load a PSV save (International) (Korea)"     , "playstation-2/international-korea.psv", [            't|["Slot 86"]'          , "s|1$1", "c|0x5724$1", "c|0x5724$2", "s|2$2", "i|PASS", "w|QASS", "c|0xb682$1", "c|0xb682$2"]],
    ["should load a PSU save (Europe)"                    , "playstation-2/europe.psu"             , [            't|["Slot 23"]'          , "s|1$1", "c|0x833f$1", "c|0x833f$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2f8e$1", "c|0x2f8e$2"]],
    ["should load a PSU save (USA)"                       , "playstation-2/usa.psu"                , [            't|["Slot 59"]'          , "s|1$1", "c|0x902c$1", "c|0x902c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x2bda$1", "c|0x2bda$2"]],
    ["should load a PSU save (Japan)"                     , "playstation-2/japan.psu"              , [            't|["Slot 18"]'          , "s|1$1", "c|0x99b1$1", "c|0x99b1$2", "s|2$2", "i|PASS", "w|QASS", "c|0xbff0$1", "c|0xbff0$2"]],
    ["should load a PSU save (France)"                    , "playstation-2/france.psu"             , [            't|["Slot 97"]'          , "s|1$1", "c|0x4c99$1", "c|0x4c99$2", "s|2$2", "i|PASS", "w|QASS", "c|0x97d7$1", "c|0x97d7$2"]],
    ["should load a PSU save (Germany)"                   , "playstation-2/germany.psu"            , [            't|["Slot 10"]'          , "s|1$1", "c|0xd68a$1", "c|0xd68a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x8c1a$1", "c|0x8c1a$2"]],
    ["should load a PSU save (Italy)"                     , "playstation-2/italy.psu"              , [            't|["Slot 69"]'          , "s|1$1", "c|0xa91c$1", "c|0xa91c$2", "s|2$2", "i|PASS", "w|QASS", "c|0x80eb$1", "c|0x80eb$2"]],
    ["should load a PSU save (Spain)"                     , "playstation-2/spain.psu"              , [            't|["Slot 42"]'          , "s|1$1", "c|0x4b1d$1", "c|0x4b1d$2", "s|2$2", "i|PASS", "w|QASS", "c|0x16f2$1", "c|0x16f2$2"]],
    ["should load a PSU save (International) (Japan)"     , "playstation-2/international-japan.psu", [            't|["Slot 32"]'          , "s|1$1", "c|0xb211$1", "c|0xb211$2", "s|2$2", "i|PASS", "w|QASS", "c|0x1ea0$1", "c|0x1ea0$2"]],
    ["should load a PSU save (International) (Asia)"      , "playstation-2/international-asia.psu" , [            't|["Slot 77"]'          , "s|1$1", "c|0xe95a$1", "c|0xe95a$2", "s|2$2", "i|PASS", "w|QASS", "c|0x0976$1", "c|0x0976$2"]],
    ["should load a PSU save (International) (Korea)"     , "playstation-2/international-korea.psu", [            't|["Slot 86"]'          , "s|1$1", "c|0x5724$1", "c|0x5724$2", "s|2$2", "i|PASS", "w|QASS", "c|0xb682$1", "c|0xb682$2"]],
    // Final Fantasy X Remaster
    ["should load a Final Fantasy X Remastered save"      , "final-fantasy-x-hd-remaster/ffx_000"  , [            't|["Slot 0"]'           , "s|1$1", "c|0x6815$1", "c|0x6815$2", "s|2$2", "i|PASS", "w|QASS", "c|0x591d$1", "c|0x591d$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
