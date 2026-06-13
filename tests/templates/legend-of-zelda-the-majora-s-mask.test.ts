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

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/empty.fla`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/deleted.fla`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should not load a standard N64 save with bad region", "nintendo-64/japan-rev1.fla"   , ["r|europe", 't|["Slot 1","Slot 2"]'         , "n|PASS"]],
    ["should load a deleted standard N64 save (Slot 2)"   , "nintendo-64/deleted-slot2.fla", ["r|europe", 't|["Slot 2"]'                  , "s|2$1", "c|0x69f7", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x69f8"]],
    ["should load a standard N64 save (Europe)"           , "nintendo-64/europe.fla"       , ["r|europe", 't|["Slot 1"]'                  , "s|1$1", "c|0x6a03", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x6a04"]],
    ["should load a standard N64 save (Europe) (Rev 1)"   , "nintendo-64/europe-rev1.fla"  , ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|0x69fb", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x69fc"]],
    ["should load a standard N64 save (USA)"              , "nintendo-64/usa.fla"          , ["r|usa"   , 't|["Slot 1"]'                  , "s|1$1", "c|0x684f", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|59$2", "c|0x6850"]],
    ["should load a standard N64 save (Japan)"            , "nintendo-64/japan.fla"        , [            't|["Slot 3"]'                  , "s|3$1", "c|0x7c77", "i|PASS", "w|QASS"                             , "c|0x7c78"]],
    ["should load a standard N64 save (Japan) (Rev 1)"    , "nintendo-64/japan-rev1.fla"   , ["r|japan" , 't|["Slot 2","Slot 3"]'         , "s|3$1", "c|0x7c90", "i|PASS", "w|QASS"                             , "c|0x7c91"]],
    ["should load a SRM save (Europe)"                    , "nintendo-64/europe.srm"       , ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2$1", "c|0x68c6", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|56$2", "c|0x68c7"]],
    ["should load a SRM save (Europe) (Rev 1)"            , "nintendo-64/europe-rev1.srm"  , ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|1$1", "c|0x69f5", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x69f6"]],
    ["should load a SRM save (USA)"                       , "nintendo-64/usa.srm"          , ["r|usa"   , 't|["Slot 2"]'                  , "s|2$1", "c|0x6801", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x6802"]],
    ["should load a SRM save (Japan)"                     , "nintendo-64/japan.srm"        , ["r|japan" , 't|["Slot 1","Slot 2","Slot 3"]', "s|3$1", "c|0x7e6f", "i|PASS", "w|QASS"                             , "c|0x7e70"]],
    ["should load a SRM save (Japan) (Rev 1)"             , "nintendo-64/japan-rev1.srm"   , ["r|japan" , 't|["Slot 1","Slot 2","Slot 3"]', "s|2$1", "c|0x7e6f", "i|PASS", "w|QASS"                             , "c|0x7e70"]],
    // GameCube
    ["should load an empty standard GC save"              , "gamecube/empty.gci"           , [            't|[]']],
    ["should load a standard GC save (Europe)"            , "gamecube/europe.gci"          , [            't|["Slot 1"]'                  , "s|1$1", "c|0x5c39", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x5c3a"]],
    ["should load a standard GC save (USA)"               , "gamecube/usa.gci"             , [            't|["Slot 1","Slot 2"]'         , "s|2$1", "c|0x5d08", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|00$2", "c|0x5d09"]],
    ["should load a standard GC save (Japan)"             , "gamecube/japan.gci"           , [            't|["Slot 2"]'                  , "s|2$1", "c|0x7eb4", "i|PASS", "w|QASS", "s|2$3", "i|06$1", "i|01$2", "c|0x7eb5"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
