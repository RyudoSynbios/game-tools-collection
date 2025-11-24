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
    ["should load a filled standard save (USA)"        ,        "filled.mcr", ["r|usa"   , 't|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x0004c7cd", "i|PASS", "w|QASS", "c|0x0004c7cf"]],
    ["should load a filled standard save (Japan, Asia)",        "filled.mcr", ["r|japan" , 't|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x0004c00d", "i|PASS", "w|QASS", "c|0x0004c00e"]],
    ["should load a deleted standard save"             ,       "deleted.mcr", [            't|[]']],
    ["should load a deleted standard save (Slot 2)"    , "deleted-slot2.mcr", [            't|["Slot 2"]'         , "s|2$1", "s|2$2", "c|0x0004cbee", "i|PASS", "w|QASS", "c|0x0004cbf0"]],
    ["should load a standard save (USA)"               ,           "usa.mcr", [            't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x0004cbee", "i|PASS", "w|QASS", "c|0x0004cbf0"]],
    ["should load a standard save (Japan, Asia)"       ,     "japanasia.mcr", [            't|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x0004c09b", "i|PASS", "w|QASS", "c|0x0004c09c"]],
    ["should load a PSV save (USA)"                    ,           "usa.psv", [            't|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x0004cbee", "i|PASS", "w|QASS", "c|0x0004cbf0"]],
    ["should load a PSV save (Japan, Asia)"            ,     "japanasia.psv", [            't|["Slot 1"]'         , "s|1$1", "s|2$2", "c|0x0004c09b", "i|PASS", "w|QASS", "c|0x0004c09c"]],
    ["should load a VMP save (USA)"                    ,           "usa.vmp", [            't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x0004cbee", "i|PASS", "w|QASS", "c|0x0004cbf0"]],
    ["should load a VMP save (Japan, Asia)"            ,     "japanasia.vmp", [            't|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x0004c09b", "i|PASS", "w|QASS", "c|0x0004c09c"]],
    ["should load a DexDrive save (USA)"               ,           "usa.gme", [            't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x0004cbee", "i|PASS", "w|QASS", "c|0x0004cbf0"]],
    ["should load a DexDrive save (Japan, Asia)"       ,     "japanasia.gme", [            't|["Slot 1","Slot 2"]', "s|1$1", "s|2$2", "c|0x0004c09b", "i|PASS", "w|QASS", "c|0x0004c09c"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
