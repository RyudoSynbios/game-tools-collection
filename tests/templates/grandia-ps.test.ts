import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "grandia-ps";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Japan)"       ,        "filled.mcr", ["r|japan" , 't|["Slot 3"]'                  , "s|3", "i|08$1", "i|17$2"]],
    ["should load a filled standard save (France)"      ,        "filled.mcr", ["r|france", 't|["Slot 2","Slot 4","Slot 5"]', "s|4", "i|08$1", "i|53$2"]],
    ["should load a deleted standard save"              ,       "deleted.mcr", [            't|[]']],
    ["should load a deleted standard save (Slot 2)"     , "deleted-slot2.mcr", [            't|["Slot 2"]'                  , "s|2", "i|07$1", "i|50$2"]],
    ["should load a standard save (Europe)"             ,        "europe.mcr", [            't|["Slot 1"]'                  , "s|1", "i|09$1", "i|49$2"]],
    ["should load a standard save (USA)"                ,           "usa.mcr", [            't|["Slot 2"]'                  , "s|2", "i|07$1", "i|50$2"]],
    ["should load a standard save (Japan)"              ,         "japan.mcr", [            't|["Slot 5"]'                  , "s|5", "i|08$1", "i|00$2"]],
    ["should load a standard save (France)"             ,        "france.mcr", [            't|["Slot 2"]'                  , "s|2", "i|08$1", "i|21$2"]],
    ["should load a standard save (Germany)"            ,       "germany.mcr", [            't|["Slot 4"]'                  , "s|2", "i|08$1", "i|31$2"]],
    ["should load a PSV save (Europe)"                  ,        "europe.psv", [            't|["Slot 1"]'                  , "s|1", "i|09$1", "i|49$2"]],
    ["should load a PSV save (USA)"                     ,           "usa.psv", [            't|["Slot 1"]'                  , "s|1", "i|07$1", "i|50$2"]],
    ["should load a PSV save (Japan)"                   ,         "japan.psv", [            't|["Slot 1"]'                  , "s|1", "i|08$1", "i|00$2"]],
    ["should load a PSV save (France)"                  ,        "france.psv", [            't|["Slot 1"]'                  , "s|1", "i|08$1", "i|21$2"]],
    ["should load a PSV save (Germany)"                 ,       "germany.psv", [            't|["Slot 1"]'                  , "s|1", "i|08$1", "i|31$2"]],
    ["should load a VMP save (Europe)"                  ,        "europe.vmp", [            't|["Slot 1"]'                  , "s|1", "i|09$1", "i|49$2"]],
    ["should load a VMP save (USA)"                     ,           "usa.vmp", [            't|["Slot 2"]'                  , "s|2", "i|07$1", "i|50$2"]],
    ["should load a VMP save (Japan)"                   ,         "japan.vmp", [            't|["Slot 5"]'                  , "s|5", "i|08$1", "i|00$2"]],
    ["should load a VMP save (France)"                  ,        "france.vmp", [            't|["Slot 2"]'                  , "s|2", "i|08$1", "i|21$2"]],
    ["should load a VMP save (Germany)"                 ,       "germany.vmp", [            't|["Slot 4"]'                  , "s|2", "i|08$1", "i|31$2"]],
    ["should load a DexDrive save (Europe)"             ,        "europe.gme", [            't|["Slot 1"]'                  , "s|1", "i|09$1", "i|49$2"]],
    ["should load a DexDrive save (USA)"                ,           "usa.gme", [            't|["Slot 2"]'                  , "s|2", "i|07$1", "i|50$2"]],
    ["should load a DexDrive save (Japan)"              ,         "japan.gme", [            't|["Slot 5"]'                  , "s|5", "i|08$1", "i|00$2"]],
    ["should load a DexDrive save (France)"             ,        "france.gme", [            't|["Slot 2"]'                  , "s|2", "i|08$1", "i|21$2"]],
    ["should load a DexDrive save (Germany)"            ,       "germany.gme", [            't|["Slot 4"]'                  , "s|2", "i|08$1", "i|31$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
