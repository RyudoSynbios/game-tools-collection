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
    ["should load a standard save (Europe)"        ,      "europe.sav", ['r|europe', 't|["Slot 1","Options"]', "s|1", "c|0xdb96c208", "i|00$1", "i|08$2", "w|09$2", "c|0xdc96c308"]],
    ["should load a standard save (Europe) (Rev 1)", "europe-rev1.sav", ['r|europe', 't|["Slot 2","Options"]', "s|2", "c|0x91191489", "i|00$1", "i|07$2", "w|08$2", "c|0x92191b89"]],
    ["should load a standard save (USA)"           ,         "usa.sav", ['r|usa'   , 't|["Slot 2","Options"]', "s|2", "c|0xdf17c687", "i|00$1", "i|05$2", "w|06$2", "c|0xe017c587"]],
    ["should load a standard save (USA) (Rev 1)"   ,    "usa-rev1.sav", ['r|usa'   , 't|["Slot 3","Options"]', "s|3", "c|0x0a14a986", "i|00$1", "i|08$2", "w|09$2", "c|0x0b14a886"]],
    ["should load a standard save (USA) (Rev 2)"   ,    "usa-rev2.sav", ['r|usa'   , 't|["Slot 1","Options"]', "s|1", "c|0xad91fc01", "i|00$1", "i|06$2", "w|07$2", "c|0xae91fd01"]],
    ["should load a standard save (Japan)"         ,       "japan.sav", ['r|japan' , 't|["Slot 2","Options"]', "s|2", "c|0x821e2982", "i|00$1", "i|07$2", "w|08$2", "c|0x831e2682"]],
    ["should load a standard save (Japan) (Rev 1)" ,  "japan-rev1.sav", ['r|japan' , 't|["Slot 3","Options"]', "s|3", "c|0xc294e502", "i|00$1", "i|05$2", "w|06$2", "c|0xc394e602"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
