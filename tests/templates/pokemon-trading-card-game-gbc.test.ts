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
    ["should load a standard save (Europe) (En,Es,It)"        ,      "europe-enesit.sav", ["r|europe", "c|0x0160", "i|PASS$1", "i|37$2", "w|38$2", "c|0x0161"]],
    ["should load a standard save (Europe) (En,Es,It) (Rev 1)", "europe-enesit-rev1.sav", ["r|europe", "c|0x018f", "i|PASS$1", "i|51$2", "w|52$2", "c|0x0190"]],
    ["should load a standard save (Europe) (En,Fr,De)"        ,      "europe-enfrde.sav", ["r|europe", "c|0x0184", "i|PASS$1", "i|31$2", "w|32$2", "c|0x0185"]],
    ["should load a standard save (Europe) (En,Fr,De) (Rev 1)", "europe-enfrde-rev1.sav", ["r|europe", "c|0x017d", "i|PASS$1", "i|43$2", "w|44$2", "c|0x017e"]],
    ["should load a standard save (USA, Australia)"           ,       "usaaustralia.sav", ["r|usa"   , "c|0x016f", "i|PASS$1", "i|28$2", "w|29$2", "c|0x0170"]],
    ["should load a standard save (Japan)"                    ,              "japan.sav", ["r|japan" , "c|0x014d", "i|PASS$1", "i|32$2", "w|33$2", "c|0x014e"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
