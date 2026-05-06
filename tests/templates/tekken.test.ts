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
    ["should load a filled standard save (Europe)", "playstation/filled.mcr"    , ["r|europe", "s|3", "i|PAS"]],
    ["should load a filled standard save (Japan)" , "playstation/filled.mcr"    , ["r|japan" , "s|3", "i|PAS"]],
    ["should load a standard save (Europe)"       , "playstation/europe.mcr"    , [            "s|3", "i|PAS"]],
    ["should load a standard save (USA)"          , "playstation/usa.mcr"       , [            "s|3", "i|PAS"]],
    ["should load a standard save (Japan)"        , "playstation/japan.mcr"     , [            "s|3", "i|PAS"]],
    ["should load a standard save (Japan) (Rev 1)", "playstation/japan-rev1.mcr", [            "s|3", "i|PAS"]],
    ["should load a PSV save (Europe)"            , "playstation/europe.psv"    , [            "s|3", "i|PAS"]],
    ["should load a PSV save (USA)"               , "playstation/usa.psv"       , [            "s|3", "i|PAS"]],
    ["should load a PSV save (Japan)"             , "playstation/japan.psv"     , [            "s|3", "i|PAS"]],
    ["should load a PSV save (Japan) (Rev 1)"     , "playstation/japan-rev1.psv", [            "s|3", "i|PAS"]],
    ["should load a VMP save (Europe)"            , "playstation/europe.vmp"    , [            "s|3", "i|PAS"]],
    ["should load a VMP save (USA)"               , "playstation/usa.vmp"       , [            "s|3", "i|PAS"]],
    ["should load a VMP save (Japan)"             , "playstation/japan.vmp"     , [            "s|3", "i|PAS"]],
    ["should load a VMP save (Japan) (Rev 1)"     , "playstation/japan-rev1.vmp", [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Europe)"       , "playstation/europe.gme"    , [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (USA)"          , "playstation/usa.gme"       , [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Japan)"        , "playstation/japan.gme"     , [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Japan) (Rev 1)", "playstation/japan-rev1.gme", [            "s|3", "i|PAS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
