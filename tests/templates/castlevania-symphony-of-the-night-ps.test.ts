import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "castlevania-symphony-of-the-night-ps";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Europe)" ,        "filled.mcr", ["r|europe", 't|["Slot 1","Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a filled standard save (Japan)"  ,        "filled.mcr", ["r|japan" , 't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a deleted standard save"         ,       "deleted.mcr", [            't|[]']],
    ["should load a deleted standard save (Slot 1)", "deleted-slot1.mcr", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a standard save (Europe)"        ,        "europe.mcr", [            't|["Slot 1","Slot 2","Slot 3"]', "s|2", "i|PASS"]],
    ["should load a standard save (USA)"           ,           "usa.mcr", [            't|["Slot 1","Slot 2","Slot 3"]', "s|3", "i|PASS"]],
    ["should load a standard save (Japan)"         ,         "japan.mcr", [            't|["Slot 1","Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (Japan) (Rev 1)" ,    "japan-rev1.mcr", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a standard save (Japan) (Rev 2)" ,    "japan-rev2.mcr", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
    ["should load a standard save (Asia)"          ,          "asia.mcr", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
    ["should load a PSV save (Europe)"             ,        "europe.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a PSV save (USA)"                ,           "usa.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a PSV save (Japan)"              ,         "japan.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a PSV save (Japan) (Rev 1)"      ,    "japan-rev1.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a PSV save (Japan) (Rev 2)"      ,    "japan-rev2.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a PSV save (Asia)"               ,          "asia.psv", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a VMP save (Europe)"             ,        "europe.vmp", [            't|["Slot 1","Slot 2","Slot 3"]', "s|2", "i|PASS"]],
    ["should load a VMP save (USA)"                ,           "usa.vmp", [            't|["Slot 1","Slot 2","Slot 3"]', "s|3", "i|PASS"]],
    ["should load a VMP save (Japan)"              ,         "japan.vmp", [            't|["Slot 1","Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a VMP save (Japan) (Rev 1)"      ,    "japan-rev1.vmp", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a VMP save (Japan) (Rev 2)"      ,    "japan-rev2.vmp", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
    ["should load a VMP save (Asia)"               ,          "asia.vmp", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
    ["should load a DexDrive save (Europe)"        ,        "europe.gme", [            't|["Slot 1","Slot 2","Slot 3"]', "s|2", "i|PASS"]],
    ["should load a DexDrive save (USA)"           ,           "usa.gme", [            't|["Slot 1","Slot 2","Slot 3"]', "s|3", "i|PASS"]],
    ["should load a DexDrive save (Japan)"         ,         "japan.gme", [            't|["Slot 1","Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a DexDrive save (Japan) (Rev 1)" ,    "japan-rev1.gme", [            't|["Slot 1"]'                  , "s|1", "i|PASS"]],
    ["should load a DexDrive save (Japan) (Rev 2)" ,    "japan-rev2.gme", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
    ["should load a DexDrive save (Asia)"          ,          "asia.gme", [            't|["Slot 1","Slot 2"]'         , "s|1", "i|PASS"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
