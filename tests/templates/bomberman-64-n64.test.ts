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
    ["should load an empty standard save"             ,    "empty.eep", ["r|europe", 't|["Options"]']],
    ["should load a deleted standard save"            ,  "deleted.eep", ["r|europe", 't|["Options"]']],
    ["should not load a standard save with bad region",    "japan.eep", ["r|europe", 't|["Slot 2","Options"]', "s|3$2", "n|ごうかく"]],
    ["should load a standard save (Europe)"           ,   "europe.eep", ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a standard save (USA)"              ,      "usa.eep", ["r|usa"   , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a standard save (Japan)"            ,    "japan.eep", ["r|japan" , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x01$3", "i|ごうかく", "w|ざうかく", "c|0x3f$1", "c|0xc4$3"]],
    ["should load a SRM save (Europe)"                ,   "europe.srm", ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a SRM save (USA)"                   ,      "usa.srm", ["r|usa"   , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a SRM save (Japan)"                 ,    "japan.srm", ["r|japan" , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
