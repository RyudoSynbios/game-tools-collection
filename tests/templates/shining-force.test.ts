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
  defaultTests(game, ["mega-drive"]);

  // prettier-ignore
  const tests: Test[] = [
    // Mega Drive
    ["should load an empty standard save"          , "mega-drive/empty.sav"        , ["r|europe", 't|[]']],
    ["should load a deleted standard save"         , "mega-drive/deleted.sav"      , ["r|europe", 't|[]']],
    ["should load a deleted standard save (Slot 1)", "mega-drive/deleted-slot3.sav", ["r|europe", 't|["Slot 3"]'         , "s|3$1", "s|2$2", "c|0x16", "i|PASS"   , "w|QASS"  , "c|0x17"]],
    ["should load a standard save (Europe)"        , "mega-drive/europe.sav"       , ["r|europe", 't|["Slot 2","Slot 3"]', "s|3$1", "s|2$2", "c|0x16", "i|PASS"   , "w|QASS"  , "c|0x17"]],
    ["should load a standard save (USA)"           , "mega-drive/usa.sav"          , ["r|usa"   , 't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x11", "i|PASS"   , "w|QASS"  , "c|0x12"]],
    ["should load a standard save (Japan)"         , "mega-drive/japan.sav"        , ["r|japan" , 't|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x6d", "i|ごうかく", "w|ざうかく", "c|0x6e"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
