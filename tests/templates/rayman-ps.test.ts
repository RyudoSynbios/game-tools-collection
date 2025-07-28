import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)" ,        "filled.mcr", ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "i|PAS"]],
    ["should load a filled standard save (Japan)"  ,        "filled.mcr", ["r|japan" , 't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a deleted standard save"         ,       "deleted.mcr", [            't|[]']],
    ["should load a deleted standard save (Slot 1)", "deleted-slot1.mcr", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (Europe)"        ,        "europe.mcr", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (USA)"           ,           "usa.mcr", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a standard save (Japan)"         ,         "japan.mcr", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (Europe)"             ,        "europe.psv", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (USA)"                ,           "usa.psv", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a PSV save (Japan)"              ,         "japan.psv", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (Europe)"             ,        "europe.vmp", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (USA)"                ,           "usa.vmp", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a VMP save (Japan)"              ,         "japan.vmp", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (Europe)"        ,        "europe.gme", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (USA)"           ,           "usa.gme", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
    ["should load a DexDrive save (Japan)"         ,         "japan.gme", [            't|["Slot 1"]'         , "s|1", "i|PAS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
