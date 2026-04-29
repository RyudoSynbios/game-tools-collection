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
  defaultTests(game, ["playstation"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (USA)"   ,     "filled.mcr", ["r|usa"  , "c|0xba", "s|3", "i|PAS", "w|QAS", "c|0xb9"]],
    ["should load a filled standard save (Japan)" ,     "filled.mcr", ["r|japan", "c|0x22", "s|3", "i|PAS", "w|QAS", "c|0x21"]],
    ["should load a standard save (Europe)"       ,     "europe.mcr", [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a standard save (USA)"          ,        "usa.mcr", [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a standard save (USA) (Rev 1)"  ,   "usa-rev1.mcr", [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a standard save (Japan)"        ,      "japan.mcr", [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a standard save (Japan) (Rev 1)", "japan-rev1.mcr", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a PSV save (Europe)"            ,     "europe.psv", [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a PSV save (USA)"               ,        "usa.psv", [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a PSV save (USA) (Rev 1)"       ,   "usa-rev1.psv", [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a PSV save (Japan)"             ,      "japan.psv", [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a PSV save (Japan) (Rev 1)"     , "japan-rev1.psv", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a VMP save (Europe)"            ,     "europe.vmp", [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a VMP save (USA)"               ,        "usa.vmp", [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a VMP save (USA) (Rev 1)"       ,   "usa-rev1.vmp", [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a VMP save (Japan)"             ,      "japan.vmp", [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a VMP save (Japan) (Rev 1)"     , "japan-rev1.vmp", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a DexDrive save (Europe)"       ,     "europe.gme", [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a DexDrive save (USA)"          ,        "usa.gme", [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a DexDrive save (USA) (Rev 1)"  ,   "usa-rev1.gme", [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a DexDrive save (Japan)"        ,      "japan.gme", [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a DexDrive save (Japan) (Rev 1)", "japan-rev1.gme", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
