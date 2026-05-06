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
  defaultTests(game, ["nintendo-64"]);

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load an empty standard save"          , "nintendo-64/empty.eep"        , ['t|[]']],
    ["should load a deleted standard save"         , "nintendo-64/deleted.eep"      , ['t|[]']],
    ["should load a deleted standard save (Slot 3)", "nintendo-64/deleted-slot3.eep", ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Europe)"        , "nintendo-64/europe.eep"       , ['t|["Slot 3"]', "s|3$1", "c|0x76579748", "s|2$2", "i|8" , "w|10", "c|0xcfac4ca0"]],
    ["should load a standard save (USA)"           , "nintendo-64/usa.eep"          , ['t|["Slot 2"]', "s|2$1", "c|0xded126d9", "s|2$2", "i|12", "w|14", "c|0x672afd31"]],
    ["should load a standard save (France)"        , "nintendo-64/france.eep"       , ['t|["Slot 1"]', "s|1$1", "c|0xfc2bf22b", "s|2$2", "i|0" , "w|2" , "c|0x45d029c3"]],
    ["should load a standard save (Germany)"       , "nintendo-64/germany.eep"      , ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Italy)"         , "nintendo-64/italy.eep"        , ['t|["Slot 2"]', "s|2$1", "c|0xcfac4ca0", "s|2$2", "i|10", "w|12", "c|0xded126d9"]],
    ["should load a standard save (Spain)"         , "nintendo-64/spain.eep"        , ['t|["Slot 1"]', "s|1$1", "c|0x45d029c3", "s|2$2", "i|2" , "w|4" , "c|0x54ad43ba"]],
    ["should load a standard save (Spain) (Rev 1)" , "nintendo-64/spain-rev1.eep"   , ['t|["Slot 4"]', "s|4$1", "c|0xed569852", "s|2$2", "i|6" , "w|8" , "c|0x76579748"]],
    ["should load a SRM save (Europe)"             , "nintendo-64/europe.srm"       , ['t|["Slot 2"]', "s|2$1", "c|0x54ad43ba", "s|2$2", "i|4" , "w|6" , "c|0xed569852"]],
    ["should load a SRM save (USA)"                , "nintendo-64/usa.srm"          , ['t|["Slot 4"]', "s|4$1", "c|0xcfac4ca0", "s|2$2", "i|10", "w|12", "c|0xded126d9"]],
    ["should load a SRM save (France)"             , "nintendo-64/france.srm"       , ['t|["Slot 3"]', "s|3$1", "c|0xded126d9", "s|2$2", "i|12", "w|14", "c|0x672afd31"]],
    ["should load a SRM save (Germany)"            , "nintendo-64/germany.srm"      , ['t|["Slot 1"]', "s|1$1", "c|0x76579748", "s|2$2", "i|8" , "w|10", "c|0xcfac4ca0"]],
    ["should load a SRM save (Italy)"              , "nintendo-64/italy.srm"        , ['t|["Slot 4"]', "s|4$1", "c|0xed569852", "s|2$2", "i|6" , "w|8" , "c|0x76579748"]],
    ["should load a SRM save (Spain)"              , "nintendo-64/spain.srm"        , ['t|["Slot 3"]', "s|3$1", "c|0x672afd31", "s|2$2", "i|14", "w|12", "c|0xded126d9"]],
    ["should load a SRM save (Spain) (Rev 1)"      , "nintendo-64/spain-rev1.srm"   , ['t|["Slot 1"]', "s|1$1", "c|0xfc2bf22b", "s|2$2", "i|0" , "w|2" , "c|0x45d029c3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
