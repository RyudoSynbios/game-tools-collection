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
  defaultTests(game, ["gamecube", "playstation-2"]);

  test("should not load a deleted standard PS2 save", async () => {
    await saveShouldBeRejected(`${game}/playstation-2/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // GameCube
    ["should load a standard GC save (Europe)"        , "gamecube/europe.gci"     , [            't|["Slot 3","Slot 6","Options"]', "c|0xb067", "s|3$1", "i|PASS", "w|QASS", "c|0x2af0"]],
    ["should load a standard GC save (USA)"           , "gamecube/usa.gci"        , [            't|["Slot 6","Slot 7","Options"]', "c|0xab96", "s|7$1", "i|PASS", "w|QASS", "c|0x2b1b"]],
    ["should load a standard GC save (France)"        , "gamecube/france.gci"     , [            't|["Slot 7","Slot 8","Options"]', "c|0xb5d4", "s|8$1", "i|PASS", "w|QASS", "c|0x65d8"]],
    ["should load a standard GC save (Germany)"       , "gamecube/germany.gci"    , [            't|["Slot 1","Slot 8","Options"]', "c|0x3821", "s|1$1", "i|PASS", "w|QASS", "c|0x3031"]],
    // PlayStation 2
    ["should load a filled standard PS2 save (Europe)", "playstation-2/filled.ps2", ["r|europe", 't|["Slot 5","Slot 6","Options"]', "s|6$1", "i|PASS"]],
    ["should load a filled standard PS2 save (Korea)" , "playstation-2/filled.ps2", ["r|korea" , 't|["Slot 1","Slot 6","Options"]', "s|6$1", "i|PASS"]],
    ["should load a standard PS2 save (Europe)"       , "playstation-2/europe.ps2", [            't|["Slot 1","Slot 3","Options"]', "s|3$1", "i|PASS"]],
    ["should load a standard PS2 save (USA)"          , "playstation-2/usa.ps2"   , [            't|["Slot 5","Slot 7","Options"]', "s|5$1", "i|PASS"]],
    ["should load a standard PS2 save (Korea)"        , "playstation-2/korea.ps2" , [            't|["Slot 2","Slot 8","Options"]', "s|2$1", "i|PASS"]],
    ["should load a PSV save (Europe)"                , "playstation-2/europe.psv", [            't|["Slot 1","Slot 3","Options"]', "s|3$1", "i|PASS"]],
    ["should load a PSV save (USA)"                   , "playstation-2/usa.psv"   , [            't|["Slot 5","Slot 7","Options"]', "s|5$1", "i|PASS"]],
    ["should load a PSV save (Korea)"                 , "playstation-2/korea.psv" , [            't|["Slot 2","Slot 8","Options"]', "s|2$1", "i|PASS"]],
    ["should load a PSU save (Europe)"                , "playstation-2/europe.psu", [            't|["Slot 1","Slot 3","Options"]', "s|3$1", "i|PASS"]],
    ["should load a PSU save (USA)"                   , "playstation-2/usa.psu"   , [            't|["Slot 5","Slot 7","Options"]', "s|5$1", "i|PASS"]],
    ["should load a PSU save (Korea)"                 , "playstation-2/korea.psu" , [            't|["Slot 2","Slot 8","Options"]', "s|2$1", "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
