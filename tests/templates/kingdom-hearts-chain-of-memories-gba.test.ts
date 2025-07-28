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
    ["should load a standard save (Europe)" , "europe.sav", ["r|europe", 't|["General","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["r|usa"   , 't|["General","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["r|japan" , 't|["General","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["r|usa"   , 't|["General","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["r|usa"   , 't|["General","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["r|japan" , 't|["General","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
