import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"               ,          "empty.sav", ["r|france" , 't|[]']],
    ["should load a deleted standard save"              ,        "deleted.sav", ["r|japan"  , 't|[]']],
    ["should not load a standard save with bad region"  ,          "japan.sav", ["r|germany", 't|["Slot 3"]', "n|ごうかく"]],
    ["should load a standard save (Europe, USA)"        ,      "europeusa.sav", ["r|europe" , 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard save (Europe, USA) (Rev 1)", "europeusa-rev1.sav", ["r|usa"    , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard save (Europe, USA) (Rev 2)", "europeusa-rev2.sav", ["r|europe" , 't|["Slot 1"]', "i|PASS"]],
    ["should load a standard save (Japan)"              ,          "japan.sav", ["r|japan"  , 't|["Slot 3"]', "i|ごうかく"]],
    ["should load a standard save (Japan) (Rev 1)"      ,     "japan-rev1.sav", ["r|japan"  , 't|["Slot 2"]', "i|ごうかく"]],
    ["should load a standard save (Japan) (Rev 2)"      ,     "japan-rev2.sav", ["r|japan"  , 't|["Slot 1"]', "i|ごうかく"]],
    ["should load a standard save (France)"             ,         "france.sav", ["r|france" , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard save (Germany)"            ,        "germany.sav", ["r|germany", 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard save (Germany) (Rev 1)"    ,   "germany-rev1.sav", ["r|germany", 't|["Slot 1"]', "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
