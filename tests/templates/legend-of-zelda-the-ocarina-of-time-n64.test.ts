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
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",      "usa-rev2.sra", ["r|japan" , 't|["Slot 2","Slot 3","Options"]', "n|PASS"]],
    ["should load a deleted standard save (Slot 2)"   , "deleted-slot2.sra", ["r|japan" , 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (Europe)"           ,        "europe.sra", ["r|europe", 't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a standard save (Europe) (Rev 1)"   ,   "europe-rev1.sra", ["r|europe", 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a standard save (USA)"              ,           "usa.sra", ["r|usa"   , 't|["Slot 1","Slot 2","Options"]',  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (USA) (Rev 1)"      ,      "usa-rev1.sra", ["r|usa"   , 't|["Slot 1","Options"]'         ,  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (USA) (Rev 2)"      ,      "usa-rev2.sra", ["r|usa"   , 't|["Slot 2","Slot 3","Options"]',  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (Japan)"            ,         "japan.sra", ["r|japan" , 't|["Slot 2","Slot 3","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (Japan) (Rev 1)"    ,    "japan-rev1.sra", ["r|japan" , 't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard save (Japan) (Rev 2)"    ,    "japan-rev2.sra", ["r|japan" , 't|["Slot 3","Options"]'         ,  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Europe)"                ,        "europe.srm", ["r|europe", 't|["Slot 2","Slot 3","Options"]',  "s|2$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a SRM save (Europe) (Rev 1)"        ,   "europe-rev1.srm", ["r|europe", 't|["Slot 2","Slot 3","Options"]',  "s|3$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a SRM save (USA)"                   ,           "usa.srm", ["r|usa"   , 't|["Slot 3","Options"]'         ,  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (USA) (Rev 1)"           ,      "usa-rev1.srm", ["r|usa"   , 't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (USA) (Rev 2)"           ,      "usa-rev2.srm", ["r|usa"   , 't|["Slot 1","Slot 3","Options"]',  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan)"                 ,         "japan.srm", ["r|japan" , 't|["Slot 1","Options"]'         ,  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan) (Rev 1)"         ,    "japan-rev1.srm", ["r|japan" , 't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan) (Rev 2)"         ,    "japan-rev2.srm", ["r|japan" , 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
