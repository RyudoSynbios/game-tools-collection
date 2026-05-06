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
  defaultTests(game, ["nintendo-64"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/empty.mpk`);
  });

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load a deleted standard save (Slot 1)", "nintendo-64/deleted-slot1.mpk", [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a filled standard save (Japan)"  , "nintendo-64/filled.mpk"       , ["r|japan" , 't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a filled standard save (France)" , "nintendo-64/filled.mpk"       , ["r|france", 't|["Slot 1"]', "i|0$1", "i|00$2"]],
    ["should load a standard save (Europe)"        , "nintendo-64/europe.mpk"       , [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a standard save (USA)"           , "nintendo-64/usa.mpk"          , [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a standard save (Japan)"         , "nintendo-64/japan.mpk"        , [            't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a standard save (France)"        , "nintendo-64/france.mpk"       , [            't|["Slot 1"]', "i|0$1", "i|03$2"]],
    ["should load a standard save (Germany)"       , "nintendo-64/germany.mpk"      , [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (Europe)"             , "nintendo-64/europe.srm"       , [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a SRM save (USA)"                , "nintendo-64/usa.srm"          , [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (Japan)"              , "nintendo-64/japan.srm"        , [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
    ["should load a SRM save (France)"             , "nintendo-64/france.srm"       , [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a SRM save (Germany)"            , "nintendo-64/germany.srm"      , [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a DexDrive save (Europe)"        , "nintendo-64/europe.n64"       , [            't|["Slot 1"]', "i|0$1", "i|02$2"]],
    ["should load a DexDrive save (USA)"           , "nintendo-64/usa.n64"          , [            't|["Slot 1"]', "i|0$1", "i|04$2"]],
    ["should load a DexDrive save (Japan)"         , "nintendo-64/japan.n64"        , [            't|["Slot 1"]', "i|0$1", "i|05$2"]],
    ["should load a DexDrive save (France)"        , "nintendo-64/france.n64"       , [            't|["Slot 1"]', "i|0$1", "i|03$2"]],
    ["should load a DexDrive save (Germany)"       , "nintendo-64/germany.n64"      , [            't|["Slot 1"]', "i|0$1", "i|01$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
