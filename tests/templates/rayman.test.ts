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
    ["should load a filled standard save (Europe)" , "playstation/filled.mcr"       , ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "i|PAS"]],
    ["should load a filled standard save (Japan)"  , "playstation/filled.mcr"       , ["r|japan" , 't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a deleted standard save (Slot 1)", "playstation/deleted-slot1.mcr", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (Europe)"        , "playstation/europe.mcr"       , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (USA)"           , "playstation/usa.mcr"          , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (Japan)"         , "playstation/japan.mcr"        , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (Europe)"             , "playstation/europe.psv"       , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (USA)"                , "playstation/usa.psv"          , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (Japan)"              , "playstation/japan.psv"        , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (Europe)"             , "playstation/europe.vmp"       , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (USA)"                , "playstation/usa.vmp"          , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (Japan)"              , "playstation/japan.vmp"        , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (Europe)"        , "playstation/europe.gme"       , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (USA)"           , "playstation/usa.gme"          , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (Japan)"         , "playstation/japan.gme"        , [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
