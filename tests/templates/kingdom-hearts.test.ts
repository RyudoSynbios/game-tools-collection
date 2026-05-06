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
    // PlayStation 2
    ["should load a filled standard save (Europe, Australia)", "playstation-2/filled.ps2"         , ["r|australia" , 't|["Slot 76"]'           , "s|1$1", "i|31$1", "i|55$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a filled standard save (Japan)"            , "playstation-2/filled.ps2"         , ["r|japan"     , 't|["Slot 98"]'           , "s|1$1", "i|29$1", "i|39$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a filled standard save (Final Mix)"        , "playstation-2/filled.ps2"         , ["r|final mix" , 't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a deleted standard save (Slot 13)"         , "playstation-2/deleted-slot13.ps2" , [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Europe, Australia)"       , "playstation-2/europeaustralia.ps2", [                't|["Slot 1","Slot 13"]'  , "s|2$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (USA)"                     , "playstation-2/usa.ps2"            , [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Japan)"                   , "playstation-2/japan.ps2"          , [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (France)"                  , "playstation-2/france.ps2"         , [                't|["Slot 94","Slot 97"]' , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Germany)"                 , "playstation-2/germany.ps2"        , [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Italy)"                   , "playstation-2/italy.ps2"          , [                't|["Slot 3","Slot 5"]'   , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Spain)"                   , "playstation-2/spain.ps2"          , [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Final Mix)"               , "playstation-2/finalmix.ps2"       , [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Europe, Australia)"            , "playstation-2/europeaustralia.psv", [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (USA)"                          , "playstation-2/usa.psv"            , [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Japan)"                        , "playstation-2/japan.psv"          , [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (France)"                       , "playstation-2/france.psv"         , [                't|["Slot 94"]'           , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Germany)"                      , "playstation-2/germany.psv"        , [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Italy)"                        , "playstation-2/italy.psv"          , [                't|["Slot 3"]'            , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Spain)"                        , "playstation-2/spain.psv"          , [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Final Mix)"                    , "playstation-2/finalmix.psv"       , [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Europe, Australia)"            , "playstation-2/europeaustralia.psu", [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (USA)"                          , "playstation-2/usa.psu"            , [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Japan)"                        , "playstation-2/japan.psu"          , [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (France)"                       , "playstation-2/france.psu"         , [                't|["Slot 94"]'           , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Germany)"                      , "playstation-2/germany.psu"        , [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Italy)"                        , "playstation-2/italy.psu"          , [                't|["Slot 3"]'            , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Spain)"                        , "playstation-2/spain.psu"          , [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Final Mix)"                    , "playstation-2/finalmix.psu"       , [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
   ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
