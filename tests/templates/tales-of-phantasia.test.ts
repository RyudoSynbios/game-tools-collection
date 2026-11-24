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
    ["should load a filled standard save (Japan)"   , "playstation/filled.mcr"        , ['t|["Slot 5","Slot 15"]' , "s|5$1" , "s|2$2", "c|0x00002969$1", "c|0x00033d83$2", "i|PASS", "w|QASS", "c|0x0000298a$1", "c|0x00033de6$2"]],
    ["should load a deleted standard save (Slot 14)", "playstation/deleted-slot14.mcr", ['t|["Slot 14"]'          , "s|14$1", "s|2$2", "c|0x00002a0c$1", "c|0x00033e64$2", "i|PASS", "w|QASS", "c|0x00002a2d$1", "c|0x00033ec7$2"]],
    ["should load a standard save (Japan)"          , "playstation/japan.mcr"         , ['t|["Slot 12","Slot 14"]', "s|14$1", "s|2$2", "c|0x00002a0c$1", "c|0x00033e64$2", "i|PASS", "w|QASS", "c|0x00002a2d$1", "c|0x00033ec7$2"]],
    ["should load a PSV save (Japan)"               , "playstation/japan.psv"         , ['t|["Slot 14"]'          , "s|14$1", "s|2$2", "c|0x00002a0c$1", "c|0x00033e64$2", "i|PASS", "w|QASS", "c|0x00002a2d$1", "c|0x00033ec7$2"]],
    ["should load a VMP save (Japan)"               , "playstation/japan.vmp"         , ['t|["Slot 12","Slot 14"]', "s|14$1", "s|2$2", "c|0x00002a0c$1", "c|0x00033e64$2", "i|PASS", "w|QASS", "c|0x00002a2d$1", "c|0x00033ec7$2"]],
    ["should load a DexDrive save (Japan)"          , "playstation/japan.gme"         , ['t|["Slot 12","Slot 14"]', "s|14$1", "s|2$2", "c|0x00002a0c$1", "c|0x00033e64$2", "i|PASS", "w|QASS", "c|0x00002a2d$1", "c|0x00033ec7$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
