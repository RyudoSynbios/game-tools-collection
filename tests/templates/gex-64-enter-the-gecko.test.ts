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
    await saveShouldBeRejected(`${game}/nintendo-64/empty.mpk`);
  });

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load a deleted standard save (Slot 1)", "nintendo-64/deleted-slot1.mpk", [            't|["Slot 1"]'         , "s|1", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a filled standard save (Europe)" , "nintendo-64/filled.mpk"       , ["r|europe", 't|["Slot 1","Slot 2"]', "s|2", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a filled standard save (USA)"    , "nintendo-64/filled.mpk"       , ["r|usa"   , 't|["Slot 1","Slot 2"]', "s|1", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a standard save (Europe)"        , "nintendo-64/europe.mpk"       , [            't|["Slot 1","Slot 2"]', "s|1", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a standard save (USA)"           , "nintendo-64/usa.mpk"          , [            't|["Slot 1","Slot 2"]', "s|2", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a SRM save (Europe)"             , "nintendo-64/europe.srm"       , [            't|["Slot 1","Slot 2"]', "s|1", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a SRM save (USA)"                , "nintendo-64/usa.srm"          , [            't|["Slot 1","Slot 2"]', "s|2", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a DexDrive save (Europe)"        , "nintendo-64/europe.n64"       , [            't|["Slot 1","Slot 2"]', "s|1", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
    ["should load a DexDrive save (USA)"           , "nintendo-64/usa.n64"          , [            't|["Slot 1","Slot 2"]', "s|2", "i|BGBVDBLCBGBVDBLCBQ$1", "i|4$2", "w|5$2", "i|BLCBGBVDBLCBGBVDBD$1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
