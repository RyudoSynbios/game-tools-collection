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
    ["should load a filled standard save (USA)"    ,   "filled.mcr", ["r|usa"    , "s|2", "c|0x6d", "i|1000", "w|1001", "c|0x6c"]],
    ["should load a filled standard save (Germany)",   "filled.mcr", ["r|germany", "s|2", "c|0x76", "i|1000", "w|1001", "c|0x75"]],
    ["should load a standard save (Europe)"        ,   "europe.mcr", [             "s|2", "c|0x8e", "i|1000", "w|1001", "c|0x8d"]],
    ["should load a standard save (USA)"           ,      "usa.mcr", [             "s|2", "c|0xbf", "i|1000", "w|1001", "c|0xbe"]],
    ["should load a standard save (USA) (Rev 1)"   , "usa-rev1.mcr", [             "s|2", "c|0x9e", "i|1000", "w|1001", "c|0x9d"]],
    ["should load a standard save (USA) (Rev 2)"   , "usa-rev2.mcr", [             "s|2", "c|0xfe", "i|1000", "w|1001", "c|0xfd"]],
    ["should load a standard save (USA) (Rev 3)"   , "usa-rev3.mcr", [             "s|2", "c|0x82", "i|1000", "w|1001", "c|0x81"]],
    ["should load a standard save (Japan)"         ,    "japan.mcr", [             "s|2", "c|0xf3", "i|1000", "w|1001", "c|0xf2"]],
    ["should load a standard save (France)"        ,   "france.mcr", [             "s|2", "c|0x65", "i|1000", "w|1001", "c|0x64"]],
    ["should load a standard save (Germany)"       ,  "germany.mcr", [             "s|2", "c|0xe8", "i|1000", "w|1001", "c|0xe7"]],
    ["should load a standard save (Italy)"         ,    "italy.mcr", [             "s|2", "c|0xe3", "i|1000", "w|1001", "c|0xe2"]],
    ["should load a PSV save (Europe)"             ,   "europe.psv", [             "s|2", "c|0x8e", "i|1000", "w|1001", "c|0x8d"]],
    ["should load a PSV save (USA)"                ,      "usa.psv", [             "s|2", "c|0xbf", "i|1000", "w|1001", "c|0xbe"]],
    ["should load a PSV save (USA) (Rev 1)"        , "usa-rev1.psv", [             "s|2", "c|0x9e", "i|1000", "w|1001", "c|0x9d"]],
    ["should load a PSV save (USA) (Rev 2)"        , "usa-rev2.psv", [             "s|2", "c|0xfe", "i|1000", "w|1001", "c|0xfd"]],
    ["should load a PSV save (USA) (Rev 3)"        , "usa-rev3.psv", [             "s|2", "c|0x82", "i|1000", "w|1001", "c|0x81"]],
    ["should load a PSV save (Japan)"              ,    "japan.psv", [             "s|2", "c|0xf3", "i|1000", "w|1001", "c|0xf2"]],
    ["should load a PSV save (France)"             ,   "france.psv", [             "s|2", "c|0x65", "i|1000", "w|1001", "c|0x64"]],
    ["should load a PSV save (Germany)"            ,  "germany.psv", [             "s|2", "c|0xe8", "i|1000", "w|1001", "c|0xe7"]],
    ["should load a PSV save (Italy)"              ,    "italy.psv", [             "s|2", "c|0xe3", "i|1000", "w|1001", "c|0xe2"]],
    ["should load a VMP save (Europe)"             ,   "europe.vmp", [             "s|2", "c|0x8e", "i|1000", "w|1001", "c|0x8d"]],
    ["should load a VMP save (USA)"                ,      "usa.vmp", [             "s|2", "c|0xbf", "i|1000", "w|1001", "c|0xbe"]],
    ["should load a VMP save (USA) (Rev 1)"        , "usa-rev1.vmp", [             "s|2", "c|0x9e", "i|1000", "w|1001", "c|0x9d"]],
    ["should load a VMP save (USA) (Rev 2)"        , "usa-rev2.vmp", [             "s|2", "c|0xfe", "i|1000", "w|1001", "c|0xfd"]],
    ["should load a VMP save (USA) (Rev 3)"        , "usa-rev3.vmp", [             "s|2", "c|0x82", "i|1000", "w|1001", "c|0x81"]],
    ["should load a VMP save (Japan)"              ,    "japan.vmp", [             "s|2", "c|0xf3", "i|1000", "w|1001", "c|0xf2"]],
    ["should load a VMP save (France)"             ,   "france.vmp", [             "s|2", "c|0x65", "i|1000", "w|1001", "c|0x64"]],
    ["should load a VMP save (Germany)"            ,  "germany.vmp", [             "s|2", "c|0xe8", "i|1000", "w|1001", "c|0xe7"]],
    ["should load a VMP save (Italy)"              ,    "italy.vmp", [             "s|2", "c|0xe3", "i|1000", "w|1001", "c|0xe2"]],
    ["should load a DexDrive save (Europe)"        ,   "europe.gme", [             "s|2", "c|0x8e", "i|1000", "w|1001", "c|0x8d"]],
    ["should load a DexDrive save (USA)"           ,      "usa.gme", [             "s|2", "c|0xbf", "i|1000", "w|1001", "c|0xbe"]],
    ["should load a DexDrive save (USA) (Rev 1)"   , "usa-rev1.gme", [             "s|2", "c|0x9e", "i|1000", "w|1001", "c|0x9d"]],
    ["should load a DexDrive save (USA) (Rev 2)"   , "usa-rev2.gme", [             "s|2", "c|0xfe", "i|1000", "w|1001", "c|0xfd"]],
    ["should load a DexDrive save (USA) (Rev 3)"   , "usa-rev3.gme", [             "s|2", "c|0x82", "i|1000", "w|1001", "c|0x81"]],
    ["should load a DexDrive save (Japan)"         ,    "japan.gme", [             "s|2", "c|0xf3", "i|1000", "w|1001", "c|0xf2"]],
    ["should load a DexDrive save (France)"        ,   "france.gme", [             "s|2", "c|0x65", "i|1000", "w|1001", "c|0x64"]],
    ["should load a DexDrive save (Germany)"       ,  "germany.gme", [             "s|2", "c|0xe8", "i|1000", "w|1001", "c|0xe7"]],
    ["should load a DexDrive save (Italy)"         ,    "italy.gme", [             "s|2", "c|0xe3", "i|1000", "w|1001", "c|0xe2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
