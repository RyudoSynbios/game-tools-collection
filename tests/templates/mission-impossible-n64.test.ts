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
    ["should load an empty standard save"          ,         "empty.eep", ['t|[]']],
    ["should load a deleted standard save"         ,       "deleted.eep", ['t|[]']],
    ["should load a deleted standard save (Slot 3)", "deleted-slot3.eep", ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Europe)"        ,        "europe.eep", ['t|["Slot 3"]', "s|3$1", "c|0x76579748", "s|2$2", "i|8" , "w|10", "c|0xcfac4ca0"]],
    ["should load a standard save (USA)"           ,           "usa.eep", ['t|["Slot 2"]', "s|2$1", "c|0xded126d9", "s|2$2", "i|12", "w|14", "c|0x672afd31"]],
    ["should load a standard save (France)"        ,        "france.eep", ['t|["Slot 1"]', "s|1$1", "c|0xfc2bf22b", "s|2$2", "i|0" , "w|2" , "c|0x45d029c3"]],
    ["should load a standard save (Germany)"       ,       "germany.eep", ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Italy)"         ,         "italy.eep", ['t|["Slot 2"]', "s|2$1", "c|0xcfac4ca0", "s|2$2", "i|10", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Spain)"         ,         "spain.eep", ['t|["Slot 1"]', "s|1$1", "c|0x45d029c3", "s|2$2", "i|2" , "w|4" , "c|0x54ad43ba"]],
    ["should load a standard save (Spain) (Rev 1)" ,    "spain-rev1.eep", ['t|["Slot 4"]', "s|4$1", "c|0xed569852", "s|2$2", "i|6" , "w|8" , "c|0x76579748"]],
    ["should load a SRM save (Europe)"             ,        "europe.srm", ['t|["Slot 2"]', "s|2$1", "c|0x54ad43ba", "s|2$2", "i|4" , "w|6" , "c|0xed569852"]],
    ["should load a SRM save (USA)"                ,           "usa.srm", ['t|["Slot 4"]', "s|4$1", "c|0xcfac4ca0", "s|2$2", "i|10", "w|12", "c|0xded126d9"]],
    ["should load a SRM save (France)"             ,        "france.srm", ['t|["Slot 3"]', "s|3$1", "c|0xded126d9", "s|2$2", "i|12", "w|14", "c|0x672afd31"]],
    ["should load a SRM save (Germany)"            ,       "germany.srm", ['t|["Slot 1"]', "s|1$1", "c|0x76579748", "s|2$2", "i|8" , "w|10", "c|0xcfac4ca0"]],
    ["should load a SRM save (Italy)"              ,         "italy.srm", ['t|["Slot 4"]', "s|4$1", "c|0xed569852", "s|2$2", "i|6" , "w|8" , "c|0x76579748"]],
    ["should load a SRM save (Spain)"              ,         "spain.srm", ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a SRM save (Spain) (Rev 1)"      ,    "spain-rev1.srm", ['t|["Slot 1"]', "s|1$1", "c|0xfc2bf22b", "s|2$2", "i|0" , "w|2" , "c|0x45d029c3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
