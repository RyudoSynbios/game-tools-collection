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
  defaultTests(game, ["game-boy", "game-boy-color"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty GB standard save"                ,           "gb-empty.sav", ["r|france" , 't|[]']],
    ["should load a deleted GB standard save"               ,         "gb-deleted.sav", ["r|japan"  , 't|[]']],
    ["should load a standard GB save (Europe, USA)"         ,       "gb-europeusa.sav", ["r|europe" , 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GB save (Europe, USA) (Rev 1)" ,  "gb-europeusa-rev1.sav", ["r|usa"    , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GB save (Europe, USA) (Rev 2)" ,  "gb-europeusa-rev2.sav", ["r|europe" , 't|["Slot 1"]', "i|PASS"]],
    ["should load a standard GB save (Japan)"               ,           "gb-japan.sav", [             't|["Slot 3"]', "i|ごうかく"]],
    ["should load a standard GB save (Japan) (Rev 1)"       ,      "gb-japan-rev1.sav", ["r|japan"  , 't|["Slot 2"]', "i|ごうかく"]],
    ["should load a standard GB save (France)"              ,          "gb-france.sav", ["r|france" , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GB save (Germany)"             ,         "gb-germany.sav", ["r|germany", 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GB save (Canada)"              ,          "gb-canada.sav", ["r|canada" , 't|["Slot 2"]', "i|PASS"]],
    ["should load an empty GBC standard save"               ,          "gbc-empty.sav", ["r|france" , 't|[]']],
    ["should load a deleted GBC standard save"              ,        "gbc-deleted.sav", ["r|japan"  , 't|[]']],
    ["should not load a GBC standard save with bad region"  ,          "gbc-japan.sav", ["r|germany", 't|["Slot 3"]', "n|ごうかく"]],
    ["should load a standard GBC save (Europe, USA)"        ,      "gbc-europeusa.sav", ["r|europe" , 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GBC save (Europe, USA) (Rev 1)", "gbc-europeusa-rev1.sav", ["r|usa"    , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GBC save (Europe, USA) (Rev 2)", "gbc-europeusa-rev2.sav", ["r|europe" , 't|["Slot 1"]', "i|PASS"]],
    ["should load a standard GBC save (Japan)"              ,          "gbc-japan.sav", ["r|japan"  , 't|["Slot 3"]', "i|ごうかく"]],
    ["should load a standard GBC save (Japan) (Rev 1)"      ,     "gbc-japan-rev1.sav", ["r|japan"  , 't|["Slot 2"]', "i|ごうかく"]],
    ["should load a standard GBC save (Japan) (Rev 2)"      ,     "gbc-japan-rev2.sav", ["r|japan"  , 't|["Slot 1"]', "i|ごうかく"]],
    ["should load a standard GBC save (France)"             ,         "gbc-france.sav", ["r|france" , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GBC save (Germany)"            ,        "gbc-germany.sav", ["r|germany", 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GBC save (Germany) (Rev 1)"    ,   "gbc-germany-rev1.sav", ["r|germany", 't|["Slot 1"]', "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
