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
    ["should load a filled standard save (Europe)" , "playstation-2/filled.ps2"               , ["r|europe", 't|["Slot 1","Slot 10"]' , "s|2$1", "i|08$1", "i|32$2"]],
    ["should load a filled standard save (USA)"    , "playstation-2/filled.ps2"               , ["r|usa"   , 't|["Slot 10"]'          , "s|1$1", "i|08$1", "i|26$2"]],
    ["should load a deleted standard save (Slot 9)", "playstation-2/deleted-slot9.ps2"        , [            't|["Slot 9"]'           , "s|1$1", "i|11$1", "i|21$2"]],
    ["should load a standard save (Europe)"        , "playstation-2/europe.ps2"               , [            't|["Slot 3"]'           , "s|1$1", "i|08$1", "i|35$2"]],
    ["should load a standard save (USA)"           , "playstation-2/usa.ps2"                  , [            't|["Slot 6"]'           , "s|1$1", "i|09$1", "i|16$2"]],
    ["should load a standard save (Japan, Asia)"   , "playstation-2/japanasia.ps2"            , [            't|["Slot 2","Slot 9"]'  , "s|1$1", "i|11$1", "i|07$2"]],
    ["should load a PSU save (Europe)"             , "playstation-2/europe.psu"               , [            't|["Slot 3"]'           , "s|1$1", "i|08$1", "i|35$2"]],
    ["should load a PSU save (USA)"                , "playstation-2/usa.psu"                  , [            't|["Slot 6"]'           , "s|1$1", "i|09$1", "i|16$2"]],
    ["should load a PSU save (Japan, Asia)"        , "playstation-2/japanasia.psu"            , [            't|["Slot 2"]'           , "s|1$1", "i|11$1", "i|07$2"]],
    // Grandia II HD Remaster
    ["should load a Grandia II HD Remaster save"   , "grandia-ii-hd-remaster/GRANDIA2_002.vms", [            't|["Slot 1"]'           , "s|1$1", "i|06$1", "i|10$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
