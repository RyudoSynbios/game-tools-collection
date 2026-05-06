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
  defaultTests(game, ["playstation-2"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation-2/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation 2
    ["should load a filled standard save (USA)"   , "playstation-2/filled.ps2"       , ["r|usa"  , "c|0x913caf75", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x2f4cf94b"]],
    ["should load a filled standard save (Japan)" , "playstation-2/filled.ps2"       , ["r|japan", "c|0x9d7e58d9", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x6ce41301"]],
    ["should load a deleted standard save (Empty)", "playstation-2/deleted-empty.ps2", ['t|[]']],
    ["should load a standard save (Europe)"       , "playstation-2/europe.ps2"       , [           "c|0x7e676459", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xc0173267"]],
    ["should load a standard save (USA)"          , "playstation-2/usa.ps2"          , [           "c|0xb9782e98", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x48e26540"]],
    ["should load a standard save (Japan)"        , "playstation-2/japan.ps2"        , [           "c|0x1b32fa0d", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xa542ac33"]],
    ["should load a PSV save (Europe)"            , "playstation-2/europe.psv"       , [           "c|0x7e676459", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xc0173267"]],
    ["should load a PSV save (USA)"               , "playstation-2/usa.psv"          , [           "c|0xb9782e98", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x48e26540"]],
    ["should load a PSV save (Japan)"             , "playstation-2/japan.psv"        , [           "c|0x1b32fa0d", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xa542ac33"]],
    ["should load a PSU save (Europe)"            , "playstation-2/europe.psu"       , [           "c|0x7e676459", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xc0173267"]],
    ["should load a PSU save (USA)"               , "playstation-2/usa.psu"          , [           "c|0xb9782e98", 't|["FAIL","PASS"]', "s|2$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0x48e26540"]],
    ["should load a PSU save (Japan)"             , "playstation-2/japan.psu"        , [           "c|0x1b32fa0d", 't|["PASS"]'       , "s|1$1", "i|PASS$1", "i|00$2", "w|01$2", "c|0xa542ac33"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
