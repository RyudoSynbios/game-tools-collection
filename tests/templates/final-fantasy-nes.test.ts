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

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",      "japan.sav", ["r|usa"  , "s|2$1", "s|4$2", "n|ごうかく"]],
    ["should load a standard save (USA)"              ,        "usa.sav", ["r|usa"  , "s|2$1", "s|2$2", "c|0x6f", "i|PASS"   , "w|QASS"  , "c|0x6e"]],
    ["should load a standard save (Japan)"            ,      "japan.sav", ["r|japan", "s|2$1", "s|4$2", "c|0x99", "i|ごうかく", "w|ざうかく", "c|0x98"]],
    ["should load a standard save (Japan) (Rev 1)"    , "japan-rev1.sav", ["r|japan", "s|2$1", "s|3$2", "c|0x99", "i|ごうかく", "w|ざうかく", "c|0x98"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
