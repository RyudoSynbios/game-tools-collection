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
    ["should load a filled standard save (USA)"       , "playstation-2/filled.ps2"         , ["r|usa"  , 't|["Slot 2","Slot 4"]', "s|2", "i|PASS"  ]],
    ["should load a filled standard save (Japan)"     , "playstation-2/filled.ps2"         , ["r|japan", 't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a standard save (Europe)"           , "playstation-2/europe.ps2"         , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a standard save (USA)"              , "playstation-2/usa.ps2"            , [           't|["Slot 2","Slot 4"]', "s|2", "i|PASS"  ]],
    ["should load a standard save (Japan)"            , "playstation-2/japan.ps2"          , [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a standard save (Japan) (Maniax)"   , "playstation-2/japan-maniax.ps2"   , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a standard save (Japan) (Chronicle)", "playstation-2/japan-chronicle.ps2", [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a standard save (Korea)"            , "playstation-2/korea.ps2"          , [           't|["Slot 3"]'         , "s|1", "i|ぼねみみ"]],
    ["should load a standard save (Korea) (Maniax)"   , "playstation-2/korea-maniax.ps2"   , [           't|["Slot 3"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (Europe)"                , "playstation-2/europe.psv"         , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (USA)"                   , "playstation-2/usa.psv"            , [           't|["Slot 4"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (Japan)"                 , "playstation-2/japan.psv"          , [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (Japan) (Maniax)"        , "playstation-2/japan-maniax.psv"   , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (Japan) (Chronicle)"     , "playstation-2/japan-chronicle.psv", [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSV save (Korea)"                 , "playstation-2/korea.psv"          , [           't|["Slot 3"]'         , "s|1", "i|ぼねみみ"]],
    ["should load a PSV save (Korea) (Maniax)"        , "playstation-2/korea-maniax.psv"   , [           't|["Slot 3"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (Europe)"                , "playstation-2/europe.psu"         , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (USA)"                   , "playstation-2/usa.psu"            , [           't|["Slot 4"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (Japan)"                 , "playstation-2/japan.psu"          , [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (Japan) (Maniax)"        , "playstation-2/japan-maniax.psu"   , [           't|["Slot 5"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (Japan) (Chronicle)"     , "playstation-2/japan-chronicle.psu", [           't|["Slot 2"]'         , "s|1", "i|PASS"  ]],
    ["should load a PSU save (Korea)"                 , "playstation-2/korea.psu"          , [           't|["Slot 3"]'         , "s|1", "i|ぼねみみ"]],
    ["should load a PSU save (Korea) (Maniax)"        , "playstation-2/korea-maniax.psu"   , [           't|["Slot 3"]'         , "s|1", "i|PASS"  ]],
   ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
