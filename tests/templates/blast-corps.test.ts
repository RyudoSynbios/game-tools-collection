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
  defaultTests(game, ["nintendo-64"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/deleted.mpk`);
  });

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load an empty standard save"           , "nintendo-64/empty.mpk"        , [            't|[]']],
    ["should load a standard EEP save (Europe)"     , "nintendo-64/europe.eep"       , [                                                 "c|0x7e00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|576c$2", "i|11$1", "w|12$1", "i|577a$2", "c|0x8200b200$1"                                    ]],
    ["should load a standard EEP save (USA)"        , "nintendo-64/usa.eep"          , [                                                 "c|0xaa00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|56f1$2", "i|25$1", "w|26$1", "i|56cf$2", "c|0xa600b200$1"                                    ]],
    ["should load a standard EEP save (USA) (Rev 1)", "nintendo-64/usa-rev1.eep"     , [                                                 "c|0x3e00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|57de$2", "i|02$1", "w|03$1", "i|57d4$2", "c|0x4200b200$1"                                    ]],
    ["should load a standard EEP save (Japan)"      , "nintendo-64/japan.eep"        , [                                                 "c|0x6500b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|5726$2", "i|05$1", "w|06$1", "i|573c$2", "c|0x6900b200$1"                                    ]],
    ["should load a standard MPK save (Europe)"     , "nintendo-64/europe.mpk"       , [            't|["Slot 2"]'            , "s|2$1", "c|0xba00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x84000000$2", "c|0xa4e80000$3", "i|49$3", "w|50$3"            , "c|0xe9000000$2", "c|0xa4e80000$3", "c|0xb600b200$1"]],
    ["should load a standard MPK save (USA)"        , "nintendo-64/usa.mpk"          , [            't|["Slot 4"]'            , "s|4$1", "c|0x8e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0xc6000000$2", "c|0xe0e50000$3", "i|12$3", "w|13$3"            , "c|0xb3000000$2", "c|0xe0e50000$3", "c|0x9200b200$1"]],
    ["should load a standard MPK save (USA) (Rev 1)", "nintendo-64/usa-rev1.mpk"     , [            't|["Slot 3"]'            , "s|3$1", "c|0xc700b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x39000000$2", "c|0x0d9d0000$3", "i|18$3", "w|19$3"            , "c|0xdf000000$2", "c|0x0d9d0000$3", "c|0xcb00b200$1"]],
    ["should load a standard MPK save (Japan)"      , "nintendo-64/japan.mpk"        , [            't|["Slot 1"]'            , "s|1$1", "c|0x6f00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x11000000$2", "c|0x51f10000$3", "i|01$3", "w|02$3"            , "c|0x34000000$2", "c|0x51f10000$3", "c|0x7300b200$1"]],
    ["should load a SRM EEP save (Europe)"          , "nintendo-64/europe-eep.srm"   , [                                                 "c|0x7e00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|576c$2", "i|11$1", "w|12$1", "i|577a$2", "c|0x8200b200$1"                                    ]],
    ["should load a SRM EEP save (USA)"             , "nintendo-64/usa-eep.srm"      , [                                                 "c|0xaa00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|56f1$2", "i|25$1", "w|26$1", "i|56cf$2", "c|0xa600b200$1"                                    ]],
    ["should load a SRM EEP save (USA) (Rev 1)"     , "nintendo-64/usa-rev1-eep.srm" , [                                                 "c|0x3e00b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|57de$2", "i|02$1", "w|03$1", "i|57d4$2", "c|0x4200b200$1"                                    ]],
    ["should load a SRM EEP save (Japan)"           , "nintendo-64/japan-eep.srm"    , [                                                 "c|0x6500b200$1", "i|PASS", "w|QASS", "s|2$1"                  ,       "i|5726$2", "i|05$1", "w|06$1", "i|573c$2", "c|0x6900b200$1"                                    ]],
    ["should load a SRM MPK save (Europe)"          , "nintendo-64/europe-mpk.srm"   , [            't|["Slot 3"]'            , "s|3$1", "c|0x9900b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x4e000000$2", "c|0x77b80000$3", "i|51$3", "w|52$3"            , "c|0x65000000$2", "c|0x77b80000$3", "c|0x9500b200$1"]],
    ["should load a SRM MPK save (USA)"             , "nintendo-64/usa-mpk.srm"      , [            't|["Slot 1"]'            , "s|1$1", "c|0x1e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x96000000$2", "c|0x1af30000$3", "i|53$3", "w|54$3"            , "c|0xe3000000$2", "c|0x1af30000$3", "c|0x2200b200$1"]],
    ["should load a SRM MPK save (USA) (Rev 1)"     , "nintendo-64/usa-rev1-mpk.srm" , [            't|["Slot 4"]'            , "s|4$1", "c|0x2e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x5f000000$2", "c|0x44a80000$3", "i|47$3", "w|48$3"            , "c|0x89000000$2", "c|0x44a80000$3", "c|0x3200b200$1"]],
    ["should load a SRM MPK save (Japan)"           , "nintendo-64/japan-mpk.srm"    , [            't|["Slot 2"]'            , "s|2$1", "c|0x2a00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x24000000$2", "c|0x29160000$3", "i|01$3", "w|02$3"            , "c|0x51000000$2", "c|0x29160000$3", "c|0x2600b200$1"]],
    ["should load a SRM Both EEP save (Europe)"     , "nintendo-64/europe-both.srm"  , [            't|["Cartridge","Slot 3"]', "s|1$1", "c|0x7e00b200$1", "i|PASS", "w|QASS", "s|2$2"                  ,       "i|576c$2", "i|11$1", "w|12$1", "i|577a$2", "c|0x8200b200$1"                                    ]],
    ["should load a SRM Both EEP save (USA)"        , "nintendo-64/usa-both.srm"     , [            't|["Cartridge","Slot 1"]', "s|1$1", "c|0xaa00b200$1", "i|PASS", "w|QASS", "s|2$2"                  ,       "i|56f1$2", "i|25$1", "w|26$1", "i|56cf$2", "c|0xa600b200$1"                                    ]],
    ["should load a SRM Both EEP save (USA) (Rev 1)", "nintendo-64/usa-rev1-both.srm", [            't|["Cartridge","Slot 4"]', "s|1$1", "c|0x3e00b200$1", "i|PASS", "w|QASS", "s|2$2"                  ,       "i|57de$2", "i|02$1", "w|03$1", "i|57d4$2", "c|0x4200b200$1"                                    ]],
    ["should load a SRM Both EEP save (Japan)"      , "nintendo-64/japan-both.srm"   , [            't|["Cartridge","Slot 2"]', "s|1$1", "c|0x6500b200$1", "i|PASS", "w|QASS", "s|2$2"                  ,       "i|5726$2", "i|05$1", "w|06$1", "i|573c$2", "c|0x6900b200$1"                                    ]],
    ["should load a SRM Both MPK save (Europe)"     , "nintendo-64/europe-both.srm"  , [            't|["Cartridge","Slot 3"]', "s|4$1", "c|0x9900b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x4e000000$2", "c|0x77b80000$3", "i|51$3", "w|52$3"            , "c|0x65000000$2", "c|0x77b80000$3", "c|0x9500b200$1"]],
    ["should load a SRM Both MPK save (USA)"        , "nintendo-64/usa-both.srm"     , [            't|["Cartridge","Slot 1"]', "s|2$1", "c|0x1e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x96000000$2", "c|0x1af30000$3", "i|53$3", "w|54$3"            , "c|0xe3000000$2", "c|0x1af30000$3", "c|0x2200b200$1"]],
    ["should load a SRM Both MPK save (USA) (Rev 1)", "nintendo-64/usa-rev1-both.srm", [            't|["Cartridge","Slot 4"]', "s|5$1", "c|0x2e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x5f000000$2", "c|0x44a80000$3", "i|47$3", "w|48$3"            , "c|0x89000000$2", "c|0x44a80000$3", "c|0x3200b200$1"]],
    ["should load a SRM Both MPK save (Japan)"      , "nintendo-64/japan-both.srm"   , [            't|["Cartridge","Slot 2"]', "s|3$1", "c|0x2a00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x24000000$2", "c|0x29160000$3", "i|01$3", "w|02$3"            , "c|0x51000000$2", "c|0x29160000$3", "c|0x2600b200$1"]],
    ["should load a DexDrive save (Europe)"         , "nintendo-64/europe.n64"       , [            't|["Slot 2"]'            , "s|2$1", "c|0xba00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x84000000$2", "c|0xa4e80000$3", "i|49$3", "w|50$3"            , "c|0xe9000000$2", "c|0xa4e80000$3", "c|0xb600b200$1"]],
    ["should load a DexDrive save (USA)"            , "nintendo-64/usa.n64"          , [            't|["Slot 4"]'            , "s|4$1", "c|0x8e00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0xc6000000$2", "c|0xe0e50000$3", "i|12$3", "w|13$3"            , "c|0xb3000000$2", "c|0xe0e50000$3", "c|0x9200b200$1"]],
    ["should load a DexDrive save (USA) (Rev 1)"    , "nintendo-64/usa-rev1.n64"     , [            't|["Slot 3"]'            , "s|3$1", "c|0xc700b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x39000000$2", "c|0x0d9d0000$3", "i|18$3", "w|19$3"            , "c|0xdf000000$2", "c|0x0d9d0000$3", "c|0xcb00b200$1"]],
    ["should load a DexDrive save (Japan)"          , "nintendo-64/japan.n64"        , [            't|["Slot 1"]'            , "s|1$1", "c|0x6f00b200$1", "i|PASS", "w|QASS", "s|2$2", "c|0x11000000$2", "c|0x51f10000$3", "i|01$3", "w|02$3"            , "c|0x34000000$2", "c|0x51f10000$3", "c|0x7300b200$1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
