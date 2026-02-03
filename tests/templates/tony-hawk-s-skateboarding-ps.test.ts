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
    ["should load a filled standard save (Europe)",   "filled.mcr", ["r|europe", "s|2$1", "s|2$2", "s|7$3", "c|0x29b7", "i|PAS", "w|QAS", "c|0x29b8"]],
    ["should load a filled standard save (Japan)" ,   "filled.mcr", ["r|japan" , "s|2$1", "s|2$2", "s|4$3", "c|0x2340", "i|PAS", "w|QAS", "c|0x2341"]],
    ["should load a standard save (Europe)"       ,   "europe.mcr", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a standard save (USA)"          ,      "usa.mcr", [            "s|1$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a standard save (Japan)"        ,    "japan.mcr", [            "s|1$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a PSV save (Europe)"            ,   "europe.psv", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a PSV save (USA)"               ,      "usa.psv", [            "s|1$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a PSV save (Japan)"             ,    "japan.psv", [            "s|1$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a VMP save (Europe)"            ,   "europe.vmp", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a VMP save (USA)"               ,      "usa.vmp", [            "s|1$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a VMP save (Japan)"             ,    "japan.vmp", [            "s|1$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a DexDrive save (Europe)"       ,   "europe.gme", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a DexDrive save (USA)"          ,      "usa.gme", [            "s|1$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a DexDrive save (Japan)"        ,    "japan.gme", [            "s|1$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
