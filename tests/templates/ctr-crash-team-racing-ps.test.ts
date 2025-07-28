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
    ["should load a filled standard save (Europe)",  "filled.mcr", ["r|europe", "s|2$1", 't|["Slot 4"]$2'         , "s|4$2", "c|0xb4b8", "i|PASS", "w|QASS", "c|0x32aa"]],
    ["should load a filled standard save (USA)"   ,  "filled.mcr", ["r|usa"   , "s|2$1", 't|["Slot 1"]$2'         , "s|1$2", "c|0x53a0", "i|PASS", "w|QASS", "c|0x726b"]],
    ["should load a standard save (Europe)"       ,  "europe.mcr", [            "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0xc171", "i|PASS", "w|QASS", "c|0xc399"]],
    ["should load a standard save (USA)"          ,     "usa.mcr", [            "s|2$1", 't|["Slot 3","Slot 4"]$2', "s|4$2", "c|0x6e28", "i|PASS", "w|QASS", "c|0xe83a"]],
    ["should load a standard save (Japan)"        ,   "japan.mcr", [            "s|2$1", 't|["Slot 1","Slot 4"]$2', "s|1$2", "c|0x1222", "i|PASS", "w|QASS", "c|0x33e9"]],
    ["should load a PSV save (Europe)"            ,  "europe.psv", [            "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0xc171", "i|PASS", "w|QASS", "c|0xc399"]],
    ["should load a PSV save (USA)"               ,     "usa.psv", [            "s|2$1", 't|["Slot 3","Slot 4"]$2', "s|4$2", "c|0x6e28", "i|PASS", "w|QASS", "c|0xe83a"]],
    ["should load a PSV save (Japan)"             ,   "japan.psv", [            "s|2$1", 't|["Slot 1","Slot 4"]$2', "s|1$2", "c|0x1222", "i|PASS", "w|QASS", "c|0x33e9"]],
    ["should load a VMP save (Europe)"            ,  "europe.vmp", [            "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0xc171", "i|PASS", "w|QASS", "c|0xc399"]],
    ["should load a VMP save (USA)"               ,     "usa.vmp", [            "s|2$1", 't|["Slot 3","Slot 4"]$2', "s|4$2", "c|0x6e28", "i|PASS", "w|QASS", "c|0xe83a"]],
    ["should load a VMP save (Japan)"             ,   "japan.vmp", [            "s|2$1", 't|["Slot 1","Slot 4"]$2', "s|1$2", "c|0x1222", "i|PASS", "w|QASS", "c|0x33e9"]],
    ["should load a DexDrive save (Europe)"       ,  "europe.gme", [            "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0xc171", "i|PASS", "w|QASS", "c|0xc399"]],
    ["should load a DexDrive save (USA)"          ,     "usa.gme", [            "s|2$1", 't|["Slot 3","Slot 4"]$2', "s|4$2", "c|0x6e28", "i|PASS", "w|QASS", "c|0xe83a"]],
    ["should load a DexDrive save (Japan)"        ,   "japan.gme", [            "s|2$1", 't|["Slot 1","Slot 4"]$2', "s|1$2", "c|0x1222", "i|PASS", "w|QASS", "c|0x33e9"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
