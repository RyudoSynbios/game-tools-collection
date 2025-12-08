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
    ["should load an empty standard save"              ,         "empty.sav", ["r|europe", 't|["General","Extras"]']],
    ["should load a deleted standard save"             ,       "deleted.sav", ["r|europe", 't|["General","Extras"]']],
    ["should not load a standard save with bad region" ,         "japan.sav", ["r|usa"   , 't|["General","Slot 2","Slot 3","Extras"]', "s|4", "n|PASS"]],
    ["should load a deleted standard save (Slot 1)"    , "deleted-slot1.sav", ["r|usa"   , 't|["General","Slot 1","Extras"]'         , "s|2", "c|0x88fba8cb", "i|PASS"   , "w|QASS"  , "c|0x88faa8cc"]],
    ["should load a standard save (Europe) (En,Fr,De)" , "europe-enfrde.sav", ["r|europe", 't|["General","Slot 1","Slot 3","Extras"]', "s|4", "c|0xed028484", "i|PASS"   , "w|QASS"  , "c|0xed038485"]],
    ["should load a standard save (Europe) (En,Es,It)" , "europe-enesit.sav", ["r|europe", 't|["General","Slot 1","Slot 2","Extras"]', "s|3", "c|0x9584abfc", "i|PASS"   , "w|QASS"  , "c|0x9585abfd"]],
    ["should load a standard save (USA, Australia)"    ,  "usaaustralia.sav", ["r|usa"   , 't|["General","Slot 1","Slot 2","Extras"]', "s|2", "c|0x88fba8cb", "i|PASS"   , "w|QASS"  , "c|0x88faa8cc"]],
    ["should load a standard save (Japan)"             ,         "japan.sav", ["r|japan" , 't|["General","Slot 2","Slot 3","Extras"]', "s|4", "c|0x951cc9fc", "i|ＰＡＳＳ", "w|ＱＡＳＳ", "c|0x8a1ccafc"]],
    ["should load a GameShark save (Europe) (En,Fr,De)", "europe-enfrde.sps", ["r|europe", 't|["General","Slot 1","Slot 3","Extras"]', "s|4", "c|0xed028484", "i|PASS"   , "w|QASS"  , "c|0xed038485"]],
    ["should load a GameShark save (Europe) (En,Es,It)", "europe-enesit.sps", ["r|europe", 't|["General","Slot 1","Slot 2","Extras"]', "s|3", "c|0x9584abfc", "i|PASS"   , "w|QASS"  , "c|0x9585abfd"]],
    ["should load a GameShark save (USA, Australia)"   ,  "usaaustralia.sps", ["r|usa"   , 't|["General","Slot 1","Slot 2","Extras"]', "s|2", "c|0x88fba8cb", "i|PASS"   , "w|QASS"  , "c|0x88faa8cc"]],
    ["should load a GameShark save (Japan)"            ,         "japan.sps", ["r|japan" , 't|["General","Slot 2","Slot 3","Extras"]', "s|4", "c|0x951cc9fc", "i|ＰＡＳＳ", "w|ＱＡＳＳ", "c|0x8a1ccafc"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
