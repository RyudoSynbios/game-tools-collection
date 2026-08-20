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
  defaultTests(game, ["playstation"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation/deleted.mcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (Europe)", "playstation/filled.mcr"   , ["r|europe", "s|3", "c|0x8afcdfef", "i|700"   , "w|701"   , "c|0x27fddfef"]],
    ["should load a filled standard save (USA)"   , "playstation/filled.mcr"   , ["r|usa"   , "s|3", "c|0xf8c0d315", "i|1020"  , "w|1021"  , "c|0xd1c1d315"]],
    ["should load a standard save (Europe)"       , "playstation/europe.mcr"   , [            "s|3", "c|0xebd389bb", "i|5740"  , "w|5741"  , "c|0x80d489bb"]],
    ["should load a standard save (USA)"          , "playstation/usa.mcr"      , [            "s|3", "c|0xdb0589bb", "i|1420"  , "w|1421"  , "c|0xe80689bb"]],
    ["should load a standard save (Japan, Asia)"  , "playstation/japanasia.mcr", [            "s|3", "c|0xfb67f01f", "i|125000", "w|125100", "c|0xb268f01f"]],
    ["should load a PSV save (Europe)"            , "playstation/europe.psv"   , [            "s|3", "c|0xebd389bb", "i|5740"  , "w|5741"  , "c|0x80d489bb"]],
    ["should load a PSV save (USA)"               , "playstation/usa.psv"      , [            "s|3", "c|0xdb0589bb", "i|1420"  , "w|1421"  , "c|0xe80689bb"]],
    ["should load a PSV save (Japan, Asia)"       , "playstation/japanasia.psv", [            "s|3", "c|0xfb67f01f", "i|125000", "w|125100", "c|0xb268f01f"]],
    ["should load a VMP save (Europe)"            , "playstation/europe.vmp"   , [            "s|3", "c|0xebd389bb", "i|5740"  , "w|5741"  , "c|0x80d489bb"]],
    ["should load a VMP save (USA)"               , "playstation/usa.vmp"      , [            "s|3", "c|0xdb0589bb", "i|1420"  , "w|1421"  , "c|0xe80689bb"]],
    ["should load a VMP save (Japan, Asia)"       , "playstation/japanasia.vmp", [            "s|3", "c|0xfb67f01f", "i|125000", "w|125100", "c|0xb268f01f"]],
    ["should load a DexDrive save (Europe)"       , "playstation/europe.gme"   , [            "s|3", "c|0xebd389bb", "i|5740"  , "w|5741"  , "c|0x80d489bb"]],
    ["should load a DexDrive save (USA)"          , "playstation/usa.gme"      , [            "s|3", "c|0xdb0589bb", "i|1420"  , "w|1421"  , "c|0xe80689bb"]],
    ["should load a DexDrive save (Japan, Asia)"  , "playstation/japanasia.gme", [            "s|3", "c|0xfb67f01f", "i|125000", "w|125100", "c|0xb268f01f"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
