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
  defaultTests(game);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA)"           ,           "usa.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA) (Rev 1)"   ,      "usa-rev1.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (France)"        ,        "france.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Germany)"       ,       "germany.sav", ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Canada)"        ,        "canada.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
