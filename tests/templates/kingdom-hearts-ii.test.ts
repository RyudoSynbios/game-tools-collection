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
    ["should load a filled standard save (Europe, Australia)"    , "playstation-2/filled.ps2"                 , ["r|australia" , 't|["Slot 18"]', "c|0x66cbafc9", "i|09$1", "i|19$2", "w|20$2", "c|0x13fcd781"]],
    ["should load a filled standard save (Japan)"                , "playstation-2/filled.ps2"                 , ["r|japan"     , 't|["Slot 97"]', "c|0x0032266e", "i|03$1", "i|59$2", "w|58$2", "c|0x13fb5658"]],
    ["should load a filled standard save (Final Mix)"            , "playstation-2/filled.ps2"                 , ["r|final mix" , 't|["Slot 9"]' , "c|0xc3b9c36c", "i|04$1", "i|02$2", "w|03$2", "c|0x72f3b2f5"]],
    ["should load a deleted standard save (Slot 13)"             , "playstation-2/deleted-slot36.ps2"         , [                't|["Slot 36"]', "c|0x04b23702", "i|05$1", "i|06$2", "w|07$2", "c|0x0c3ff4d8"]],
    ["should load a standard save (Europe, Australia)"           , "playstation-2/europeaustralia.ps2"        , [                't|["Slot 14"]', "c|0x96a88b0a", "i|11$1", "i|36$2", "w|37$2", "c|0xdd4d2917"]],
    ["should load a standard save (USA)"                         , "playstation-2/usa.ps2"                    , [                't|["Slot 21"]', "c|0x50e33e57", "i|03$1", "i|57$2", "w|58$2", "c|0x05f0f86f"]],
    ["should load a standard save (Japan)"                       , "playstation-2/japan.ps2"                  , [                't|["Slot 81"]', "c|0xa28d05b7", "i|04$1", "i|17$2", "w|18$2", "c|0x92165d04"]],
    ["should load a standard save (France)"                      , "playstation-2/france.ps2"                 , [                't|["Slot 38"]', "c|0x88106dd4", "i|04$1", "i|23$2", "w|24$2", "c|0xfd27159c"]],
    ["should load a standard save (Germany)"                     , "playstation-2/germany.ps2"                , [                't|["Slot 79"]', "c|0x3578388d", "i|04$1", "i|24$2", "w|25$2", "c|0x278e2ba8"]],
    ["should load a standard save (Italy)"                       , "playstation-2/italy.ps2"                  , [                't|["Slot 1"]' , "c|0x729ee2fb", "i|04$1", "i|00$2", "w|01$2", "c|0xbdea5d1b"]],
    ["should load a standard save (Spain)"                       , "playstation-2/spain.ps2"                  , [                't|["Slot 64"]', "c|0xa403b68e", "i|04$1", "i|03$2", "w|04$2", "c|0xb6f5a5ab"]],
    ["should load a standard save (Final Mix)"                   , "playstation-2/finalmix.ps2"               , [                't|["Slot 9"]' , "c|0xc3b9c36c", "i|04$1", "i|02$2", "w|03$2", "c|0x72f3b2f5"]],
    ["should load a PSV save (Europe, Australia)"                , "playstation-2/europeaustralia.psv"        , [                't|["Slot 14"]', "c|0x96a88b0a", "i|11$1", "i|36$2", "w|37$2", "c|0xdd4d2917"]],
    ["should load a PSV save (USA)"                              , "playstation-2/usa.psv"                    , [                't|["Slot 21"]', "c|0x50e33e57", "i|03$1", "i|57$2", "w|58$2", "c|0x05f0f86f"]],
    ["should load a PSV save (Japan)"                            , "playstation-2/japan.psv"                  , [                't|["Slot 81"]', "c|0xa28d05b7", "i|04$1", "i|17$2", "w|18$2", "c|0x92165d04"]],
    ["should load a PSV save (France)"                           , "playstation-2/france.psv"                 , [                't|["Slot 38"]', "c|0x88106dd4", "i|04$1", "i|23$2", "w|24$2", "c|0xfd27159c"]],
    ["should load a PSV save (Germany)"                          , "playstation-2/germany.psv"                , [                't|["Slot 79"]', "c|0x3578388d", "i|04$1", "i|24$2", "w|25$2", "c|0x278e2ba8"]],
    ["should load a PSV save (Italy)"                            , "playstation-2/italy.psv"                  , [                't|["Slot 1"]' , "c|0x729ee2fb", "i|04$1", "i|00$2", "w|01$2", "c|0xbdea5d1b"]],
    ["should load a PSV save (Spain)"                            , "playstation-2/spain.psv"                  , [                't|["Slot 64"]', "c|0xa403b68e", "i|04$1", "i|03$2", "w|04$2", "c|0xb6f5a5ab"]],
    ["should load a PSV save (Final Mix)"                        , "playstation-2/finalmix.psv"               , [                't|["Slot 9"]' , "c|0xc3b9c36c", "i|04$1", "i|02$2", "w|03$2", "c|0x72f3b2f5"]],
    ["should load a PSU save (Europe, Australia)"                , "playstation-2/europeaustralia.psu"        , [                't|["Slot 14"]', "c|0x96a88b0a", "i|11$1", "i|36$2", "w|37$2", "c|0xdd4d2917"]],
    ["should load a PSU save (USA)"                              , "playstation-2/usa.psu"                    , [                't|["Slot 21"]', "c|0x50e33e57", "i|03$1", "i|57$2", "w|58$2", "c|0x05f0f86f"]],
    ["should load a PSU save (Japan)"                            , "playstation-2/japan.psu"                  , [                't|["Slot 81"]', "c|0xa28d05b7", "i|04$1", "i|17$2", "w|18$2", "c|0x92165d04"]],
    ["should load a PSU save (France)"                           , "playstation-2/france.psu"                 , [                't|["Slot 38"]', "c|0x88106dd4", "i|04$1", "i|23$2", "w|24$2", "c|0xfd27159c"]],
    ["should load a PSU save (Germany)"                          , "playstation-2/germany.psu"                , [                't|["Slot 79"]', "c|0x3578388d", "i|04$1", "i|24$2", "w|25$2", "c|0x278e2ba8"]],
    ["should load a PSU save (Italy)"                            , "playstation-2/italy.psu"                  , [                't|["Slot 1"]' , "c|0x729ee2fb", "i|04$1", "i|00$2", "w|01$2", "c|0xbdea5d1b"]],
    ["should load a PSU save (Spain)"                            , "playstation-2/spain.psu"                  , [                't|["Slot 64"]', "c|0xa403b68e", "i|04$1", "i|03$2", "w|04$2", "c|0xb6f5a5ab"]],
    ["should load a PSU save (Final Mix)"                        , "playstation-2/finalmix.psu"               , [                't|["Slot 9"]' , "c|0xc3b9c36c", "i|04$1", "i|02$2", "w|03$2", "c|0x72f3b2f5"]],
    // Kingdom Hearts HD 2.5 ReMIX
    ["should load a Kingdom Hearts HD 2.5 ReMIX save (Final Mix)", "kingdom-hearts-hd-2-5-remix/KHIIFM_WW.png", [                't|["Slot 99"]', "c|0xe136e438", "i|02$1", "i|52$2", "w|53$2", "c|0xa4b80a84"]],
   ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
