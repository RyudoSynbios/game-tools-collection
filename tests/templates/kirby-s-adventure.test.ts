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
  defaultTests(game, ["nintendo-entertainment-system"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-entertainment-system/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-entertainment-system/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo Entertainment System
    ["should load a deleted standard save (Slot 2)", "nintendo-entertainment-system/deleted-slot2.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Europe)"        , "nintendo-entertainment-system/europe.sav"       , ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA)"           , "nintendo-entertainment-system/usa.sav"          , ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA) (Rev 1)"   , "nintendo-entertainment-system/usa-rev1.sav"     , ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Japan)"         , "nintendo-entertainment-system/japan.sav"        , ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (France)"        , "nintendo-entertainment-system/france.sav"       , ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Germany)"       , "nintendo-entertainment-system/germany.sav"      , ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Canada)"        , "nintendo-entertainment-system/canada.sav"       , ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
