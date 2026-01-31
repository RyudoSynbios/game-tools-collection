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
    ["should load a standard save (Europe)"        ,     "europe.sav", ["r|europe", "c|0x25a0aa1e", "s|2", "i|PASS", "w|QASS", "c|0x25a0aa1f"]],
    ["should load a standard save (USA)"           ,        "usa.sav", ["r|usa"   , "c|0x259fbc00", "s|2", "i|PASS", "w|QASS", "c|0x259fbc01"]],
    ["should load a standard save (Japan)"         ,      "japan.sav", ["r|japan" , "c|0x259fb67e", "s|2", "i|PASS", "w|QASS", "c|0x259fb67f"]],
    ["should load a standard save (Japan) (Rev 1)" , "japan-rev1.sav", ["r|japan" , "c|0x259fadcc", "s|2", "i|PASS", "w|QASS", "c|0x259fadcd"]],
    ["should load a GameShark save (Europe)"       ,     "europe.sps", ["r|europe", "c|0x25a0aa1e", "s|2", "i|PASS", "w|QASS", "c|0x25a0aa1f"]],
    ["should load a GameShark save (USA)"          ,        "usa.sps", ["r|usa"   , "c|0x259fbc00", "s|2", "i|PASS", "w|QASS", "c|0x259fbc01"]],
    ["should load a GameShark save (Japan)"        ,      "japan.sps", ["r|japan" , "c|0x259fb67e", "s|2", "i|PASS", "w|QASS", "c|0x259fb67f"]],
    ["should load a GameShark save (Japan) (Rev 1)", "japan-rev1.sps", ["r|japan" , "c|0x259fadcc", "s|2", "i|PASS", "w|QASS", "c|0x259fadcd"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
