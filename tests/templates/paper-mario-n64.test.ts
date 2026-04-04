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
    await saveShouldBeRejected(`${game}/deleted.fla`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",         "japan.fla", ["r|europe", 't|["Slot 2"]'         , "n|PASS"]],
    ["should load a deleted standard save (Slot 3)"   , "deleted-slot3.fla", ["r|europe", 't|["Slot 3"]'         , "s|3", "c|0xdc42d29d$1", "c|0x23bd2d62$2", "i|PASS"   , "w|QASS"  , "c|0xdc42d29e$1", "c|0x23bd2d61$2"]],
    ["should load a standard save (Europe)"           ,        "europe.fla", ["r|europe", 't|["Slot 2","Slot 3"]', "s|3", "c|0xdc42d29d$1", "c|0x23bd2d62$2", "i|PASS"   , "w|QASS"  , "c|0xdc42d29e$1", "c|0x23bd2d61$2"]],
    ["should load a standard save (USA)"              ,           "usa.fla", ["r|usa"   , 't|["Slot 1","Slot 2"]', "s|1", "c|0x797903a0$1", "c|0x8686fc5f$2", "i|PASS"   , "w|QASS"  , "c|0x797903a1$1", "c|0x8686fc5e$2"]],
    ["should load a standard save (Japan)"            ,         "japan.fla", ["r|japan" , 't|["Slot 2"]'         , "s|2", "c|0xe891e798$1", "c|0x176e1867$2", "i|ごうかく", "w|ざうかく", "c|0xe891e799$1", "c|0x176e1866$2"]],
    ["should load a SRM save (Europe)"                ,        "europe.srm", ["r|europe", 't|["Slot 2","Slot 4"]', "s|2", "c|0x93e96d8c$1", "c|0x6c169273$2", "i|PASS"   , "w|QASS"  , "c|0x93e96d8d$1", "c|0x6c169272$2"]],
    ["should load a SRM save (USA)"                   ,           "usa.srm", ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|3", "c|0xd18be716$1", "c|0x2e7418e9$2", "i|PASS"   , "w|QASS"  , "c|0xd18be717$1", "c|0x2e7418e8$2"]],
    ["should load a SRM save (Japan)"                 ,         "japan.srm", ["r|japan" , 't|["Slot 1"]'         , "s|1", "c|0xe891e796$1", "c|0x176e1869$2", "i|ごうかく", "w|ざうかく", "c|0xe891e797$1", "c|0x176e1868$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
