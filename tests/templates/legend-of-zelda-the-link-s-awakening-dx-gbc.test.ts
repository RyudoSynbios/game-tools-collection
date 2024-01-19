import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "legend-of-zelda-the-link-s-awakening-dx-gbc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
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
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
