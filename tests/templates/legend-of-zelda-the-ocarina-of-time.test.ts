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
    ["should not load a standard N64 save with bad region", "nintendo-64/usa-rev2.sra"               , ["r|japan"    , 't|["Slot 2","Slot 3","Options"]', "n|PASS"]],
    ["should load a deleted standard N64 save (Slot 2)"   , "nintendo-64/deleted-slot2.sra"          , ["r|japan"    , 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (Europe)"           , "nintendo-64/europe.sra"                 , ["r|europe"   , 't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a standard N64 save (Europe) (Rev 1)"   , "nintendo-64/europe-rev1.sra"            , ["r|europe"   , 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a standard N64 save (USA)"              , "nintendo-64/usa.sra"                    , ["r|usa"      , 't|["Slot 1","Slot 2","Options"]',  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (USA) (Rev 1)"      , "nintendo-64/usa-rev1.sra"               , ["r|usa"      , 't|["Slot 1","Options"]'         ,  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (USA) (Rev 2)"      , "nintendo-64/usa-rev2.sra"               , ["r|usa"      , 't|["Slot 2","Slot 3","Options"]',  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (Japan)"            , "nintendo-64/japan.sra"                  , ["r|japan"    , 't|["Slot 2","Slot 3","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (Japan) (Rev 1)"    , "nintendo-64/japan-rev1.sra"             , ["r|japan"    , 't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a standard N64 save (Japan) (Rev 2)"    , "nintendo-64/japan-rev2.sra"             , ["r|japan"    , 't|["Slot 3","Options"]'         ,  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Europe)"                    , "nintendo-64/europe.srm"                 , ["r|europe"   , 't|["Slot 2","Slot 3","Options"]',  "s|2$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a SRM save (Europe) (Rev 1)"            , "nintendo-64/europe-rev1.srm"            , ["r|europe"   , 't|["Slot 2","Slot 3","Options"]',  "s|3$1", "c|0x078d", "i|PASS", "w|QASS", "c|0x088d"]],
    ["should load a SRM save (USA)"                       , "nintendo-64/usa.srm"                    , ["r|usa"      , 't|["Slot 3","Options"]'         ,  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (USA) (Rev 1)"               , "nintendo-64/usa-rev1.srm"               , ["r|usa"      , 't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (USA) (Rev 2)"               , "nintendo-64/usa-rev2.srm"               , ["r|usa"      , 't|["Slot 1","Slot 3","Options"]',  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan)"                     , "nintendo-64/japan.srm"                  , ["r|japan"    , 't|["Slot 1","Options"]'         ,  "s|1$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan) (Rev 1)"             , "nintendo-64/japan-rev1.srm"             , ["r|japan"    , 't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    ["should load a SRM save (Japan) (Rev 2)"             , "nintendo-64/japan-rev2.srm"             , ["r|japan"    , 't|["Slot 2","Options"]'         ,  "s|2$1", "c|0x8e11", "i|PASS", "w|QASS", "c|0x8f11"]],
    // GameCube (OOT/MQ)
    ["should load an empty standard GC-OM save"           , "gamecube/oot-mq/empty.gci"              , [               't|["Options"]']],
    ["should load a standard GC-OM save (Europe)"         , "gamecube/oot-mq/europe.gci"             , [               't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x1d05", "i|PASS", "w|QASS", "c|0x1e05"]],
    ["should load a standard GC-OM save (USA)"            , "gamecube/oot-mq/usa.gci"                , [               't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0xa37e", "i|PASS", "w|QASS", "c|0xa47e"]],
    ["should load a standard GC-OM save (Japan)"          , "gamecube/oot-mq/japan.gci"              , [               't|["Slot 1","Slot 2","Options"]',  "s|1$1", "c|0xa37e", "i|PASS", "w|QASS", "c|0xa47e"]],
    ["should load a standard GC-CE save (Australia)"      , "gamecube/oot-mq/australia.gci"          , [               't|["Slot 1","Slot 3","Options"]',  "s|1$1", "c|0x1ce7", "i|PASS", "w|QASS", "c|0x1de7"]],
    ["should load a standard GC-CE save (Korea)"          , "gamecube/oot-mq/korea.gci"              , [               't|["Slot 2","Slot 3","Options"]',  "s|2$1", "c|0xa38a", "i|PASS", "w|QASS", "c|0xa48a"]],
    // GameCube (Collector's Edition)
    ["should load an empty standard GC-CE save"           , "gamecube/collector-s-edition/empty.gci" , [               't|["Options"]']],
    ["should load a standard GC-CE save (Europe)"         , "gamecube/collector-s-edition/europe.gci", [               't|["Slot 1","Slot 2","Options"]',  "s|2$1", "c|0x1cf7", "i|PASS", "w|QASS", "c|0x1df7"]],
    ["should load a standard GC-CE save (USA)"            , "gamecube/collector-s-edition/usa.gci"   , [               't|["Slot 1","Slot 3","Options"]',  "s|3$1", "c|0xa36a", "i|PASS", "w|QASS", "c|0xa46a"]],
    ["should load a standard GC-CE save (Japan)"          , "gamecube/collector-s-edition/japan.gci" , [               't|["Slot 1","Slot 2","Options"]',  "s|1$1", "c|0xa383", "i|PASS", "w|QASS", "c|0xa483"]],

  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
