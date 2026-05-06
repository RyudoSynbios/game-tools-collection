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
  defaultTests(game, ["game-boy-advance"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load an empty standard save"          , "game-boy-advance/empty.sav"        , ["r|usa"   , 't|[]']],
    ["should load a deleted standard save"         , "game-boy-advance/deleted.sav"      , ["r|usa"   , 't|[]']],
    ["should load a deleted standard save (Slot 2)", "game-boy-advance/deleted-slot2.sav", ["r|usa"   , 't|["Slot 2"]'         , "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (Europe)"        , "game-boy-advance/europe.sav"       , ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (USA)"           , "game-boy-advance/usa.sav"          , ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (Japan)"         , "game-boy-advance/japan.sav"        , ["r|japan" , 't|["Slot 1","Slot 2"]', "s|1", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (Europe)"       , "game-boy-advance/europe.sps"       , ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (USA)"          , "game-boy-advance/usa.sps"          , ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (Japan)"        , "game-boy-advance/japan.sps"        , ["r|japan" , 't|["Slot 1","Slot 2"]', "s|1", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
