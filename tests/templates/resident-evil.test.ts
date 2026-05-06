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
  defaultTests(game, ["playstation", "windows"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation/deleted.mcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (Japan)"            , "playstation/filled.mcr"              , ["r|japan" , 't|["Slot 2","Slot 4"]', "s|2", "i|02$1", "i|50$2"]],
    ["should load a filled standard save (France)"           , "playstation/filled.mcr"              , ["r|france", 't|["Slot 2","Slot 5"]', "s|5", "i|03$1", "i|10$2"]],
    ["should load a deleted standard save (Slot 4)"          , "playstation/deleted-slot4.mcr"       , [            't|["Slot 4"]'         , "s|5", "i|04$1", "i|10$2"]],
    ["should load a standard save (Europe)"                  , "playstation/europe.mcr"              , [            't|["Slot 3"]'         , "s|3", "i|07$1", "i|52$2"]],
    ["should load a standard save (USA)"                     , "playstation/usa.mcr"                 , [            't|["Slot 2"]'         , "s|2", "i|04$1", "i|26$2"]],
    ["should load a standard save (Japan)"                   , "playstation/japan.mcr"               , [            't|["Slot 4"]'         , "s|4", "i|08$1", "i|29$2"]],
    ["should load a standard save (France)"                  , "playstation/france.mcr"              , [            't|["Slot 5"]'         , "s|5", "i|10$1", "i|54$2"]],
    ["should load a standard save (Germany)"                 , "playstation/germany.mcr"             , [            't|["Slot 1"]'         , "s|1", "i|06$1", "i|39$2"]],
    ["should load a standard save (Director's Cut) (Europe)" , "playstation/directorscut-europe.mcr" , [            't|["Slot 3"]'         , "s|3", "i|06$1", "i|09$2"]],
    ["should load a standard save (Director's Cut) (USA)"    , "playstation/directorscut-usa.mcr"    , [            't|["Slot 5"]'         , "s|5", "i|05$1", "i|10$2"]],
    ["should load a standard save (Director's Cut) (Japan)"  , "playstation/directorscut-japan.mcr"  , [            't|["Slot 1"]'         , "s|1", "i|03$1", "i|40$2"]],
    ["should load a standard save (Director's Cut) (France)" , "playstation/directorscut-france.mcr" , [            't|["Slot 1"]'         , "s|1", "i|05$1", "i|42$2"]],
    ["should load a standard save (Director's Cut) (Germany)", "playstation/directorscut-germany.mcr", [            't|["Slot 2"]'         , "s|2", "i|06$1", "i|04$2"]],
    ["should load a PSV save (Europe)"                       , "playstation/europe.psv"              , [            't|["Slot 3"]'         , "s|3", "i|07$1", "i|52$2"]],
    ["should load a PSV save (USA)"                          , "playstation/usa.psv"                 , [            't|["Slot 2"]'         , "s|2", "i|04$1", "i|26$2"]],
    ["should load a PSV save (Japan)"                        , "playstation/japan.psv"               , [            't|["Slot 4"]'         , "s|4", "i|08$1", "i|29$2"]],
    ["should load a PSV save (France)"                       , "playstation/france.psv"              , [            't|["Slot 5"]'         , "s|5", "i|10$1", "i|54$2"]],
    ["should load a PSV save (Germany)"                      , "playstation/germany.psv"             , [            't|["Slot 1"]'         , "s|1", "i|06$1", "i|39$2"]],
    ["should load a VMP save (Europe)"                       , "playstation/europe.vmp"              , [            't|["Slot 3"]'         , "s|3", "i|07$1", "i|52$2"]],
    ["should load a VMP save (USA)"                          , "playstation/usa.vmp"                 , [            't|["Slot 2"]'         , "s|2", "i|04$1", "i|26$2"]],
    ["should load a VMP save (Japan)"                        , "playstation/japan.vmp"               , [            't|["Slot 4"]'         , "s|4", "i|08$1", "i|29$2"]],
    ["should load a VMP save (France)"                       , "playstation/france.vmp"              , [            't|["Slot 5"]'         , "s|5", "i|10$1", "i|54$2"]],
    ["should load a VMP save (Germany)"                      , "playstation/germany.vmp"             , [            't|["Slot 1"]'         , "s|1", "i|06$1", "i|39$2"]],
    ["should load a DexDrive save (Europe)"                  , "playstation/europe.gme"              , [            't|["Slot 3"]'         , "s|3", "i|07$1", "i|52$2"]],
    ["should load a DexDrive save (USA)"                     , "playstation/usa.gme"                 , [            't|["Slot 2"]'         , "s|2", "i|04$1", "i|26$2"]],
    ["should load a DexDrive save (Japan)"                   , "playstation/japan.gme"               , [            't|["Slot 4"]'         , "s|4", "i|08$1", "i|29$2"]],
    ["should load a DexDrive save (France)"                  , "playstation/france.gme"              , [            't|["Slot 5"]'         , "s|5", "i|10$1", "i|54$2"]],
    ["should load a DexDrive save (Germany)"                 , "playstation/germany.gme"             , [            't|["Slot 1"]'         , "s|1", "i|06$1", "i|39$2"]],
    // Windows
    ["should load a Windows save"                            , "windows/savedat1.dat"                , [            't|["Slot 1"]'         , "s|1", "i|07$1", "i|52$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
