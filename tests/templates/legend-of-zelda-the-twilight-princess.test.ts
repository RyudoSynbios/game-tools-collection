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
  defaultTests(game, ["gamecube", "wii"]);

  // prettier-ignore
  const tests: Test[] = [
    // GameCube
    ["should load an empty standard GC save"          , "gamecube/empty.gci"            , [            't|[]']],
    ["should load a deleted standard GC save"         , "gamecube/deleted.gci"          , [            't|[]']],
    ["should load a deleted standard GC save (Slot 1)", "gamecube/deleted-slot1.gci"    , [            't|["Slot 1"]'         , "s|1", "c|0x0000c464ffff3110", "i|PASS", "w|QASS", "c|0x0000c465ffff310f"]],
    ["should load a standard GC save (Europe)"        , "gamecube/europe.gci"           , [            't|["Slot 1","Slot 2"]', "s|1", "c|0x0000c464ffff3110", "i|PASS", "w|QASS", "c|0x0000c465ffff310f"]],
    ["should load a standard GC save (USA)"           , "gamecube/usa.gci"              , [            't|["Slot 2","Slot 3"]', "s|3", "c|0x00005e61ffff9713", "i|PASS", "w|QASS", "c|0x00005e62ffff9712"]],
    ["should load a standard GC save (Japan)"         , "gamecube/japan.gci"            , [            't|["Slot 1","Slot 3"]', "s|3", "c|0x00006047ffff952d", "i|PASS", "w|QASS", "c|0x00006048ffff952c"]],
    // Wii
    ["should load an empty standard Wii save"          , "wii/empty/zeldaTp.dat"        , ["r|japan" , 't|[]']],
    ["should load a deleted standard Wii save"         , "wii/deleted/zeldaTp.dat"      , ["r|japan" , 't|[]']],
    ["should load a deleted standard Wii save (Slot 1)", "wii/deleted-slot1/zeldaTp.dat", ["r|japan" , 't|["Slot 1"]'         , "s|1", "c|0x0000beadffff36c7", "i|PASS", "w|QASS", "c|0x0000beaeffff36c6"]],
    ["should load a standard Wii save (Europe)"        , "wii/europe/zeldaTp.dat"       , ["r|europe", 't|["Slot 1","Slot 3"]', "s|1", "c|0x0000b0d6ffff449e", "i|PASS", "w|QASS", "c|0x0000b0d7ffff449d"]],
    ["should load a standard Wii save (USA)"           , "wii/usa/zeldaTp.dat"          , ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0x00005c43ffff9931", "i|PASS", "w|QASS", "c|0x00005c44ffff9930"]],
    ["should load a standard Wii save (Japan)"         , "wii/japan/zeldaTp.dat"        , ["r|japan" , 't|["Slot 1","Slot 2"]', "s|1", "c|0x0000beadffff36c7", "i|PASS", "w|QASS", "c|0x0000beaeffff36c6"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
