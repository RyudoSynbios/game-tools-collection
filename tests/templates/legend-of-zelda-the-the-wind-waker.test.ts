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
  defaultTests(game, ["gamecube", "wii"]);

  // prettier-ignore
  const tests: Test[] = [
    // GameCube
    ["should load an empty standard save"          , "gamecube/empty.gci"            , [            't|[]']],
    ["should load a deleted standard save"         , "gamecube/deleted.gci"          , [            't|[]']],
    ["should load a deleted standard save (Slot 1)", "gamecube/deleted-slot1.gci"    , [            't|["Slot 1"]'         , "s|1", "c|0x0000442fffffb469", "i|PASS", "w|QASS", "c|0x00004430ffffb468"]],
    ["should load a standard save (Europe)"        , "gamecube/europe.gci"           , [            't|["Slot 1","Slot 2"]', "s|1", "c|0x0000442fffffb469", "i|PASS", "w|QASS", "c|0x00004430ffffb468"]],
    ["should load a standard save (USA)"           , "gamecube/usa.gci"              , [            't|["Slot 2","Slot 3"]', "s|3", "c|0x00004454ffffb444", "i|PASS", "w|QASS", "c|0x00004455ffffb443"]],
    ["should load a standard save (Japan)"         , "gamecube/japan.gci"            , [            't|["Slot 1","Slot 3"]', "s|3", "c|0x000048cbffffafcd", "i|PASS", "w|QASS", "c|0x000048ccffffafcc"]],
    ["should load a standard save (Korea)"         , "gamecube/korea.gci"            , [            't|["Slot 1","Slot 3"]', "s|1", "c|0x0000447cffffb41c", "i|PASS", "w|QASS", "c|0x0000447dffffb41b"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
