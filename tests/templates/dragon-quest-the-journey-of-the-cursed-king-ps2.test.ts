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
  defaultTests(game);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe)"  ,         "filled.ps2", ["r|europe", 't|["Slot 8","Slot 20"]' , "s|2", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a filled standard save (USA)"     ,         "filled.ps2", ["r|usa"   , 't|["Slot 1","Slot 12"]' , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a deleted standard save (Slot 29)", "deleted-slot29.ps2", [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (Europe)"         ,         "europe.ps2", [            't|["Slot 23","Slot 29"]', "s|2", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (USA)"            ,            "usa.ps2", [            't|["Slot 3","Slot 12"]' , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a standard save (Japan, Asia)"    ,      "japanasia.ps2", [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
    ["should load a PSV save (Europe)"              ,         "europe.psv", [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSV save (USA)"                 ,            "usa.psv", [            't|["Slot 3"]'           , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSV save (Japan, Asia)"         ,      "japanasia.psv", [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
    ["should load a PSU save (Europe)"              ,         "europe.psu", [            't|["Slot 29"]'          , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSU save (USA)"                 ,            "usa.psu", [            't|["Slot 3"]'           , "s|1", "c|0x00000179", "i|PASS"  , "w|QASS"   , "c|0x00000179"]],
    ["should load a PSU save (Japan, Asia)"         ,      "japanasia.psu", [            't|["Slot 17"]'          , "s|1", "c|0x00000179", "i|ごうかく", "w|ざうかく", "c|0x00000179"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
