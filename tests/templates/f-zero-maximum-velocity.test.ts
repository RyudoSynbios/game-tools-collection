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
  defaultTests(game, ["game-boy-advance"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load an empty standard save"           , "game-boy-advance/empty.sav"        , ['t|["Mixed Rankings"]']],
    ["should load a deleted standard save"          , "game-boy-advance/deleted.sav"      , ['t|["Mixed Rankings"]']],
    ["should load a deleted standard save (Slot 2)" , "game-boy-advance/deleted-slot2.sav", ['t|["Slot 2","Mixed Rankings"]'         , "s|2", "c|0x3d69e309$1", "c|0x00000012$2", "c|0x5d1a404d$3", "c|0x00000005$4", "i|PASS$1", "w|QASS$1", "i|0$2", "w|1$2", "c|0x3d69e30a$1", "c|0x00000012$2", "c|0x5d1b404d$3", "c|0x00000006$4"]],
    ["should load a standard save (Europe, USA)"    , "game-boy-advance/europeusa.sav"    , ['t|["Slot 1","Slot 2","Mixed Rankings"]', "s|2", "c|0x4ba7c33a$1", "c|0x00000012$2", "c|0x5d1a404d$3", "c|0x00000005$4", "i|PASS$1", "w|QASS$1", "i|0$2", "w|1$2", "c|0x4ba7c33b$1", "c|0x00000012$2", "c|0x5d1b404d$3", "c|0x00000006$4"]],
    ["should load a standard save (Japan)"          , "game-boy-advance/japan.sav"        , ['t|["Slot 2","Slot 3","Mixed Rankings"]', "s|3", "c|0xa0e7244f$1", "c|0x00000012$2", "c|0x126c404c$3", "c|0x00000005$4", "i|PASS$1", "w|QASS$1", "i|0$2", "w|1$2", "c|0xa0e8244f$1", "c|0x00000012$2", "c|0x126d404c$3", "c|0x00000006$4"]],
    ["should load a GameShark save (Europe, USA)"   , "game-boy-advance/europeusa.sps"    , ['t|["Slot 1","Slot 2","Mixed Rankings"]', "s|2", "c|0x4ba7c33a$1", "c|0x00000012$2", "c|0x5d1a404d$3", "c|0x00000005$4", "i|PASS$1", "w|QASS$1", "i|0$2", "w|1$2", "c|0x4ba7c33b$1", "c|0x00000012$2", "c|0x5d1b404d$3", "c|0x00000006$4"]],
    ["should load a GameShark save (Japan)"         , "game-boy-advance/japan.sps"        , ['t|["Slot 2","Slot 3","Mixed Rankings"]', "s|3", "c|0xa0e7244f$1", "c|0x00000012$2", "c|0x126c404c$3", "c|0x00000005$4", "i|PASS$1", "w|QASS$1", "i|0$2", "w|1$2", "c|0xa0e8244f$1", "c|0x00000012$2", "c|0x126d404c$3", "c|0x00000006$4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
