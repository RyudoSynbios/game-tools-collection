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
    // PlayStation
    ["should load a filled standard save (Europe)", "playstation/filled.mcr", ["r|europe", "s|2$1", "s|2$2", "s|7$3", "c|0x29b7", "i|PAS", "w|QAS", "c|0x29b8"]],
    ["should load a filled standard save (Japan)" , "playstation/filled.mcr", ["r|japan" , "s|2$1", "s|2$2", "s|4$3", "c|0x2340", "i|PAS", "w|QAS", "c|0x2341"]],
    ["should load a standard save (Europe)"       , "playstation/europe.mcr", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a standard save (USA)"          , "playstation/usa.mcr"   , [            "s|2$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a standard save (Japan)"        , "playstation/japan.mcr" , [            "s|2$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a PSV save (Europe)"            , "playstation/europe.psv", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a PSV save (USA)"               , "playstation/usa.psv"   , [            "s|1$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a PSV save (Japan)"             , "playstation/japan.psv" , [            "s|1$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a VMP save (Europe)"            , "playstation/europe.vmp", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a VMP save (USA)"               , "playstation/usa.vmp"   , [            "s|2$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a VMP save (Japan)"             , "playstation/japan.vmp" , [            "s|2$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
    ["should load a DexDrive save (Europe)"       , "playstation/europe.gme", [            "s|2$1", "s|2$2", "s|3$3", "c|0x29b8", "i|PAS", "w|QAS", "c|0x29b9"]],
    ["should load a DexDrive save (USA)"          , "playstation/usa.gme"   , [            "s|2$1", "s|2$2", "s|8$3", "c|0x2839", "i|PAS", "w|QAS", "c|0x283a"]],
    ["should load a DexDrive save (Japan)"        , "playstation/japan.gme" , [            "s|2$1", "s|2$2", "s|2$3", "c|0x2327", "i|PAS", "w|QAS", "c|0x2328"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
