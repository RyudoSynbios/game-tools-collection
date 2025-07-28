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
    ["should load a filled standard save (Japan)"   ,         "filled.mcr", ["r|japan", 't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a filled standard save (Italy)"   ,         "filled.mcr", ["r|italy", 't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a deleted standard save"          ,        "deleted.mcr", [           't|[]']],
    ["should load a deleted standard save (Slot 12)", "deleted-slot12.mcr", [           't|["Slot 12"]'         , "s|1$1" , "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a standard save (Europe)"         ,         "europe.mcr", [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a standard save (USA)"            ,            "usa.mcr", [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a standard save (Japan)"          ,          "japan.mcr", [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a standard save (France)"         ,         "france.mcr", [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a standard save (Germany)"        ,        "germany.mcr", [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a standard save (Italy)"          ,          "italy.mcr", [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a standard save (Spain)"          ,          "spain.mcr", [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a PSV save (Europe)"              ,         "europe.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a PSV save (USA)"                 ,            "usa.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a PSV save (Japan)"               ,          "japan.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a PSV save (France)"              ,         "france.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a PSV save (Germany)"             ,        "germany.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a PSV save (Italy)"               ,          "italy.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a PSV save (Spain)"               ,          "spain.psv", [           't|["Slot 1"]'          , "s|1$1" , "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a VMP save (Europe)"              ,         "europe.vmp", [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a VMP save (USA)"                 ,            "usa.vmp", [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a VMP save (Japan)"               ,          "japan.vmp", [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a VMP save (France)"              ,         "france.vmp", [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a VMP save (Germany)"             ,        "germany.vmp", [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a VMP save (Italy)"               ,          "italy.vmp", [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a VMP save (Spain)"               ,          "spain.vmp", [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
    ["should load a DexDrive save (Europe)"         ,         "europe.gme", [           't|["Slot 2","Slot 4"]' , "s|4$1" , "c|0x07cf", "s|2$2", "i|PASS", "w|QASS", "c|0x04e2"]],
    ["should load a DexDrive save (USA)"            ,            "usa.gme", [           't|["Slot 11"]'         , "s|11$1", "c|0xb639", "s|2$2", "i|PASS", "w|QASS", "c|0xb514"]],
    ["should load a DexDrive save (Japan)"          ,          "japan.gme", [           't|["Slot 15"]'         , "s|15$1", "c|0x79e7", "s|2$2", "i|PASS", "w|QASS", "c|0x5694"]],
    ["should load a DexDrive save (France)"         ,         "france.gme", [           't|["Slot 9"]'          , "s|9$1" , "c|0x639a", "s|2$2", "i|PASS", "w|QASS", "c|0x60b7"]],
    ["should load a DexDrive save (Germany)"        ,        "germany.gme", [           't|["Slot 1"]'          , "s|1$1" , "c|0xf047", "s|2$2", "i|PASS", "w|QASS", "c|0xf36a"]],
    ["should load a DexDrive save (Italy)"          ,          "italy.gme", [           't|["Slot 8","Slot 10"]', "s|8$1" , "c|0x1676", "s|2$2", "i|PASS", "w|QASS", "c|0x155b"]],
    ["should load a DexDrive save (Spain)"          ,          "spain.gme", [           't|["Slot 1","Slot 12"]', "s|12$1", "c|0xac58", "s|2$2", "i|PASS", "w|QASS", "c|0xaf75"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
