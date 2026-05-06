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
    ["should load a filled standard save (USA)"     , "playstation/filled.mcr"       , ["r|usa", 't|["Slot 7"]'         , "s|7" , "c|0x4f1c040000d8352e", "i|PASS", "w|QASS", "c|0x4f1c040000d8352e"]],
    ["should load a deleted standard save (Slot 3)" , "playstation/deleted-slot3.mcr", [         't|["Slot 3"]'         , "s|3" , "c|0x4f5602000054780e", "i|PASS", "w|QASS", "c|0x4f5602000054780e"]],
    ["should load a standard save (USA)"            , "playstation/usa.mcr"          , [         't|["Slot 2","Slot 3"]', "s|3" , "c|0x4f5602000054780e", "i|PASS", "w|QASS", "c|0x4f5602000054780e"]],
    ["should load a standard save (Japan)"          , "playstation/japan.mcr"        , [         't|["Slot 12"]'        , "s|12", "c|0x4f3c040600f84e8e", "i|PASS", "w|QASS", "c|0x4f3c040600f84e8e"]],
    ["should load a standard save (Japan) (Rev 1)"  , "playstation/japan-rev1.mcr"   , [         't|["Slot 15"]'        , "s|15", "c|0x4f3c04000014622e", "i|PASS", "w|QASS", "c|0x4f3c04000014622e"]],
    ["should load a PSV save (USA)"                 , "playstation/usa.psv"          , [         't|["Slot 3"]'         , "s|3" , "c|0x4f5602000054780e", "i|PASS", "w|QASS", "c|0x4f5602000054780e"]],
    ["should load a PSV save (Japan)"               , "playstation/japan.psv"        , [         't|["Slot 12"]'        , "s|12", "c|0x4f3c040600f84e8e", "i|PASS", "w|QASS", "c|0x4f3c040600f84e8e"]],
    ["should load a PSV save (Japan) (Rev 1)"       , "playstation/japan-rev1.psv"   , [         't|["Slot 15"]'        , "s|15", "c|0x4f3c04000014622e", "i|PASS", "w|QASS", "c|0x4f3c04000014622e"]],
    ["should load a VMP save (USA)"                 , "playstation/usa.vmp"          , [         't|["Slot 2","Slot 3"]', "s|3" , "c|0x4f5602000054780e", "i|PASS", "w|QASS", "c|0x4f5602000054780e"]],
    ["should load a VMP save (Japan)"               , "playstation/japan.vmp"        , [         't|["Slot 12"]'        , "s|12", "c|0x4f3c040600f84e8e", "i|PASS", "w|QASS", "c|0x4f3c040600f84e8e"]],
    ["should load a VMP save (Japan) (Rev 1)"       , "playstation/japan-rev1.vmp"   , [         't|["Slot 15"]'        , "s|15", "c|0x4f3c04000014622e", "i|PASS", "w|QASS", "c|0x4f3c04000014622e"]],
    ["should load a DexDrive save (USA)"            , "playstation/usa.gme"          , [         't|["Slot 2","Slot 3"]', "s|3" , "c|0x4f5602000054780e", "i|PASS", "w|QASS", "c|0x4f5602000054780e"]],
    ["should load a DexDrive save (Japan)"          , "playstation/japan.gme"        , [         't|["Slot 12"]'        , "s|12", "c|0x4f3c040600f84e8e", "i|PASS", "w|QASS", "c|0x4f3c040600f84e8e"]],
    ["should load a DexDrive save (Japan) (Rev 1)"  , "playstation/japan-rev1.gme"   , [         't|["Slot 15"]'        , "s|15", "c|0x4f3c04000014622e", "i|PASS", "w|QASS", "c|0x4f3c04000014622e"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
