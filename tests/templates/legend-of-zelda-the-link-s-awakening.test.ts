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
    // Game Boy
    ["should load an empty GB standard save"                , "game-boy/empty.sav"               , ["r|france" , 't|[]']],
    ["should load a deleted GB standard save"               , "game-boy/deleted.sav"             , ["r|japan"  , 't|[]']],
    ["should load a standard GB save (Europe, USA)"         , "game-boy/europeusa.sav"           , ["r|europe" , 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GB save (Europe, USA) (Rev 1)" , "game-boy/europeusa-rev1.sav"      , ["r|usa"    , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GB save (Europe, USA) (Rev 2)" , "game-boy/europeusa-rev2.sav"      , ["r|europe" , 't|["Slot 1"]', "i|PASS"]],
    ["should load a standard GB save (Japan)"               , "game-boy/japan.sav"               , [             't|["Slot 3"]', "i|ごうかく"]],
    ["should load a standard GB save (Japan) (Rev 1)"       , "game-boy/japan-rev1.sav"          , ["r|japan"  , 't|["Slot 2"]', "i|ごうかく"]],
    ["should load a standard GB save (France)"              , "game-boy/france.sav"              , ["r|france" , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GB save (Germany)"             , "game-boy/germany.sav"             , ["r|germany", 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GB save (Canada)"              , "game-boy/canada.sav"              , ["r|canada" , 't|["Slot 2"]', "i|PASS"]],
    // Game Boy Color
    ["should load an empty GBC standard save"               , "game-boy-color/empty.sav"         , ["r|france" , 't|[]']],
    ["should load a deleted GBC standard save"              , "game-boy-color/deleted.sav"       , ["r|japan"  , 't|[]']],
    ["should not load a GBC standard save with bad region"  , "game-boy-color/japan.sav"         , ["r|germany", 't|["Slot 3"]', "n|ごうかく"]],
    ["should load a standard GBC save (Europe, USA)"        , "game-boy-color/europeusa.sav"     , ["r|europe" , 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GBC save (Europe, USA) (Rev 1)", "game-boy-color/europeusa-rev1.sav", ["r|usa"    , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GBC save (Europe, USA) (Rev 2)", "game-boy-color/europeusa-rev2.sav", ["r|europe" , 't|["Slot 1"]', "i|PASS"]],
    ["should load a standard GBC save (Japan)"              , "game-boy-color/japan.sav"         , ["r|japan"  , 't|["Slot 3"]', "i|ごうかく"]],
    ["should load a standard GBC save (Japan) (Rev 1)"      , "game-boy-color/japan-rev1.sav"    , ["r|japan"  , 't|["Slot 2"]', "i|ごうかく"]],
    ["should load a standard GBC save (Japan) (Rev 2)"      , "game-boy-color/japan-rev2.sav"    , ["r|japan"  , 't|["Slot 1"]', "i|ごうかく"]],
    ["should load a standard GBC save (France)"             , "game-boy-color/france.sav"        , ["r|france" , 't|["Slot 2"]', "i|PASS"]],
    ["should load a standard GBC save (Germany)"            , "game-boy-color/germany.sav"       , ["r|germany", 't|["Slot 3"]', "i|PASS"]],
    ["should load a standard GBC save (Germany) (Rev 1)"    , "game-boy-color/germany-rev1.sav"  , ["r|germany", 't|["Slot 1"]', "i|PASS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
