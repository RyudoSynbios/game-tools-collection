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

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.mpk`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.mpk`);
  });

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.mpk", [            't|["Slot 1"]'         , "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a filled standard save (Europe)" ,        "filled.mpk", ["r|europe", 't|["Slot 1"]'         , "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a filled standard save (USA)"    ,        "filled.mpk", ["r|usa"   , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a standard save (Europe)"        ,        "europe.mpk", [            't|["Slot 1","Slot 2"]', "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a standard save (USA)"           ,           "usa.mpk", [            't|["Slot 1","Slot 2"]', "s|2$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a SRM save (Europe)"             ,        "europe.srm", [            't|["Slot 1","Slot 2"]', "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a SRM save (USA)"                ,           "usa.srm", [            't|["Slot 1","Slot 2"]', "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a DexDrive save (Europe)"        ,        "europe.n64", [            't|["Slot 1","Slot 2"]', "s|1$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
    ["should load a DexDrive save (USA)"           ,           "usa.n64", [            't|["Slot 1","Slot 2"]', "s|2$1", "c|0x0000039e$1", "c|0x0000039e$2", "i|29", "w|30", "c|0x0000039f$1", "c|0x0000039f$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
