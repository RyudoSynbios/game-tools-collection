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
  defaultTests(game, ["game-boy-advance"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-advance/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load a standard save (Europe)" , "game-boy-advance/europe.sav", ["r|europe", 't|["System","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a standard save (USA)"    , "game-boy-advance/usa.sav"   , ["r|usa"   , 't|["System","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a standard save (Japan)"  , "game-boy-advance/japan.sav" , ["r|japan" , 't|["System","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
    ["should load a GameShark save (Europe)", "game-boy-advance/europe.sps", ["r|usa"   , 't|["System","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a GameShark save (USA)"   , "game-boy-advance/usa.sps"   , ["r|usa"   , 't|["System","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a GameShark save (Japan)" , "game-boy-advance/japan.sps" , ["r|japan" , 't|["System","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
