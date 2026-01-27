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
    ["should load a standard save (Europe)"        ,     "europe.sav", ["r|europe", "c|0xd24d416b", "i|84", "w|85", "c|0xd24d416c"]],
    ["should load a standard save (USA)"           ,        "usa.sav", ["r|usa"   , "c|0xd24c414b", "i|52", "w|53", "c|0xd24c414c"]],
    ["should load a standard save (Japan)"         ,      "japan.sav", ["r|japan" , "c|0xd24c4051", "i|58", "w|59", "c|0xd24c4052"]],
    ["should load a standard save (Japan) (Rev 1)" , "japan-rev1.sav", ["r|japan" , "c|0xd24c406d", "i|86", "w|87", "c|0xd24c406e"]],
    ["should load a GameShark save (Europe)"       ,     "europe.sps", ["r|europe", "c|0xd24d416b", "i|84", "w|85", "c|0xd24d416c"]],
    ["should load a GameShark save (USA)"          ,        "usa.sps", ["r|usa"   , "c|0xd24c414b", "i|52", "w|53", "c|0xd24c414c"]],
    ["should load a GameShark save (Japan)"        ,      "japan.sps", ["r|japan" , "c|0xd24c4051", "i|58", "w|59", "c|0xd24c4052"]],
    ["should load a GameShark save (Japan) (Rev 1)", "japan-rev1.sps", ["r|japan" , "c|0xd24c406d", "i|86", "w|87", "c|0xd24c406e"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
