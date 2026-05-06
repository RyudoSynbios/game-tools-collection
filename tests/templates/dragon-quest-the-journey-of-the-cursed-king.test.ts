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
    ["should load a filled standard save (Europe)"  , "playstation-2/filled.ps2"        , ["r|europe", 't|["Slot 8","Slot 20"]' , "s|2", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a filled standard save (USA)"     , "playstation-2/filled.ps2"        , ["r|usa"   , 't|["Slot 1","Slot 12"]' , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a deleted standard save (Slot 29)", "playstation-2/deleted-slot29.ps2", [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (Europe)"         , "playstation-2/europe.ps2"        , [            't|["Slot 23","Slot 29"]', "s|2", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (USA)"            , "playstation-2/usa.ps2"           , [            't|["Slot 3","Slot 12"]' , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (Japan, Asia)"    , "playstation-2/japanasia.ps2"     , [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
    ["should load a PSV save (Europe)"              , "playstation-2/europe.psv"        , [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSV save (USA)"                 , "playstation-2/usa.psv"           , [            't|["Slot 3"]'           , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSV save (Japan, Asia)"         , "playstation-2/japanasia.psv"     , [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
    ["should load a PSU save (Europe)"              , "playstation-2/europe.psu"        , [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSU save (USA)"                 , "playstation-2/usa.psu"           , [            't|["Slot 3"]'           , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSU save (Japan, Asia)"         , "playstation-2/japanasia.psu"     , [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
