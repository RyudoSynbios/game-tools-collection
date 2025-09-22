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
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"          ,         "empty.sav", ["r|usa"   , 't|[]']],
    ["should load a deleted standard save"         ,       "deleted.sav", ["r|usa"   , 't|[]']],
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.sav", ["r|usa"   , 't|["Slot 2"]'         , "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (USA)"           ,           "usa.sav", ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ["r|japan" , 't|["Slot 1","Slot 2"]', "s|1", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (Europe)"       ,        "europe.sps", ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (USA)"          ,           "usa.sps", ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
    ["should load a GameShark save (Japan)"        ,         "japan.sps", ["r|japan" , 't|["Slot 1","Slot 2"]', "s|1", "c|0x691096f0", "i|PASS"   , "w|QASS"  , "c|0x690f96f1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
