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
    ["should load a standard save (USA)"   , "super-nintendo/usa.sav"   , ["r|usa"  , 't|["Slot 2","Slot 3"]', "c|0x2b08", "s|2", "i|PASS"  , "w|QASS"   , "c|0x2b07"]],
    ["should load a standard save (Japan)" , "super-nintendo/japan.sav" , ["r|japan", 't|["Slot 4"]'         , "c|0x2945", "s|4", "i|ごうかく", "w|ざうかく", "c|0x2943"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
