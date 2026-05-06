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
    ["should load a filled standard save (USA)"   , "playstation/filled.mcr"    , ["r|usa"  , "c|0xba", "s|3", "i|PAS", "w|QAS", "c|0xb9"]],
    ["should load a filled standard save (Japan)" , "playstation/filled.mcr"    , ["r|japan", "c|0x22", "s|3", "i|PAS", "w|QAS", "c|0x21"]],
    ["should load a standard save (Europe)"       , "playstation/europe.mcr"    , [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a standard save (USA)"          , "playstation/usa.mcr"       , [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a standard save (USA) (Rev 1)"  , "playstation/usa-rev1.mcr"  , [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a standard save (Japan)"        , "playstation/japan.mcr"     , [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a standard save (Japan) (Rev 1)", "playstation/japan-rev1.mcr", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a PSV save (Europe)"            , "playstation/europe.psv"    , [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a PSV save (USA)"               , "playstation/usa.psv"       , [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a PSV save (USA) (Rev 1)"       , "playstation/usa-rev1.psv"  , [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a PSV save (Japan)"             , "playstation/japan.psv"     , [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a PSV save (Japan) (Rev 1)"     , "playstation/japan-rev1.psv", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a VMP save (Europe)"            , "playstation/europe.vmp"    , [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a VMP save (USA)"               , "playstation/usa.vmp"       , [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a VMP save (USA) (Rev 1)"       , "playstation/usa-rev1.vmp"  , [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a VMP save (Japan)"             , "playstation/japan.vmp"     , [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a VMP save (Japan) (Rev 1)"     , "playstation/japan-rev1.vmp", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
    ["should load a DexDrive save (Europe)"       , "playstation/europe.gme"    , [           "c|0x86", "s|3", "i|PAS", "w|QAS", "c|0x85"]],
    ["should load a DexDrive save (USA)"          , "playstation/usa.gme"       , [           "c|0x70", "s|3", "i|PAS", "w|QAS", "c|0x6f"]],
    ["should load a DexDrive save (USA) (Rev 1)"  , "playstation/usa-rev1.gme"  , [           "c|0xa0", "s|3", "i|PAS", "w|QAS", "c|0x9f"]],
    ["should load a DexDrive save (Japan)"        , "playstation/japan.gme"     , [           "c|0x8e", "s|3", "i|PAS", "w|QAS", "c|0x8d"]],
    ["should load a DexDrive save (Japan) (Rev 1)", "playstation/japan-rev1.gme", [           "c|0x28", "s|3", "i|PAS", "w|QAS", "c|0x27"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
