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
    ["should load a filled standard save (France)"    ,          "filled.mcr", ["r|france", 't|["Slot 12"]'          , "s|12$1", "c|0x23e6", "i|15", "w|16", "c|0x8eee", "s|3$3", "i|PASS"]],
    ["should load a filled standard save (Spain)"     ,          "filled.mcr", ["r|spain" , 't|["Slot 4"]'           , "s|4$1" , "c|0xb37a", "i|16", "w|17", "c|0x47b4", "s|3$3", "i|PASS"]],
    ["should load a deleted standard save"            ,         "deleted.mcr", [            't|[]']],
    ["should load a deleted standard save (Slot 1)"   ,   "deleted-slot1.mcr", [            't|["Slot 1"]'           , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a standard save (Europe, Australia)", "europeaustralia.mcr", [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a standard save (USA)"              ,             "usa.mcr", [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a standard save (Japan, Asia)"      ,       "japanasia.mcr", [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a standard save (France)"           ,          "france.mcr", [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a standard save (Germany)"          ,         "germany.mcr", [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a standard save (Italy)"            ,           "italy.mcr", [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a standard save (Spain)"            ,           "spain.mcr", [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Europe, Australia)"     , "europeaustralia.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a PSV save (USA)"                   ,             "usa.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Japan, Asia)"           ,       "japanasia.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a PSV save (France)"                ,          "france.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Germany)"               ,         "germany.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Italy)"                 ,           "italy.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a PSV save (Spain)"                 ,           "spain.psv", [            't|["Slot 1"]'           , "s|1$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Europe, Australia)"     , "europeaustralia.vmp", [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a VMP save (USA)"                   ,             "usa.vmp", [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Japan, Asia)"           ,       "japanasia.vmp", [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a VMP save (France)"                ,          "france.vmp", [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Germany)"               ,         "germany.vmp", [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Italy)"                 ,           "italy.vmp", [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a VMP save (Spain)"                 ,           "spain.vmp", [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Europe, Australia)", "europeaustralia.gme", [            't|["Slot 8","Slot 9"]'  , "s|9$1" , "c|0xc763", "i|21", "w|22", "c|0x497a", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (USA)"              ,             "usa.gme", [            't|["Slot 1","Slot 15"]' , "s|15$1", "c|0x46a0", "i|15", "w|16", "c|0xaa26", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Japan, Asia)"      ,       "japanasia.gme", [            't|["Slot 7","Slot 8"]'  , "s|7$1" , "c|0x1e06", "i|12", "w|13", "c|0x557e", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (France)"           ,          "france.gme", [            't|["Slot 1","Slot 14"]' , "s|1$1" , "c|0x46a0", "i|19", "w|20", "c|0x122e", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Germany)"          ,         "germany.gme", [            't|["Slot 11","Slot 13"]', "s|11$1", "c|0x7935", "i|19", "w|20", "c|0x6fc8", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Italy)"            ,           "italy.gme", [            't|["Slot 3","Slot 12"]' , "s|3$1" , "c|0x7bd8", "i|19", "w|20", "c|0xc0bf", "s|3$3", "i|PASS"]],
    ["should load a DexDrive save (Spain)"            ,           "spain.gme", [            't|["Slot 2","Slot 5"]'  , "s|5$1" , "c|0x3c97", "i|19", "w|20", "c|0x2e64", "s|3$3", "i|PASS"]],
    ["should load a Remastered save"                  ,    "slot1_save02.ff8", ["r|usa"   , 't|["Slot 1"]'           , "s|1$1" , "c|0x49e1", "i|08", "w|09", "c|0x7575", "s|3$3", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
