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
  defaultTests(game, ["super-nintendo"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/super-nintendo/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Super Nintendo
    ["should not load a standard save with bad region", "super-nintendo/japan.sav"   , ["r|france" , 't|["Slot 2"]', "s|2$2", "n|ごうかく"]],
    ["should load a standard save (Europe)"           , "super-nintendo/europe.sav"  , ["r|europe" , 't|["Slot 2"]', "s|2$2", "c|0xf629", "i|PASS",   "w|QASS"   , "c|0xf62a"]],
    ["should load a standard save (USA)"              , "super-nintendo/usa.sav"     , ["r|usa"    , 't|["Slot 3"]', "s|2$2", "c|0xc025", "i|PASS",   "w|QASS"   , "c|0xc026"]],
    ["should load a standard save (USA) (Rev 1)"      , "super-nintendo/usa-rev1.sav", ["r|usa"    , 't|["Slot 1"]', "s|2$2", "c|0x7f26", "i|PASS",   "w|QASS"   , "c|0x7f27"]],
    ["should load a standard save (Japan)"            , "super-nintendo/japan.sav"   , ["r|japan"  , 't|["Slot 2"]', "s|2$2", "c|0x7da8", "i|ごうかく", "w|ざうかく", "c|0x7da9"]],
    ["should load a standard save (France)"           , "super-nintendo/france.sav"  , ["r|france" , 't|["Slot 1"]', "s|2$2", "c|0xc1e7", "i|PASS",   "w|QASS"   , "c|0xc1e8"]],
    ["should load a standard save (Germany)"          , "super-nintendo/germany.sav" , ["r|germany", 't|["Slot 3"]', "s|2$2", "c|0xf3ea", "i|PASS",   "w|QASS"   , "c|0xf3eb"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
