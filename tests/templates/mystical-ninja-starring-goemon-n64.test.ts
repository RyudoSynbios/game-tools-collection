import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "mystical-ninja-starring-goemon-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/bad.n64`);
  });

  // prettier-ignore
  test.each([
    ["should load an empty standard save"         ,   "empty.mpk", [            't|["Option"]']],
    ["should load a deleted standard save"        , "deleted.mpk", [            't|["Option"]']],
    ["should load a filled standard save (USA)"   ,  "filled.mpk", ["r|usa"   , 't|["Slot 1","Option"]'         , "s|1$1", "c|0x6a0fa226", "i|94" , "w|95" , "c|0x86095158"]],
    ["should load a filled standard save (Japan)" ,  "filled.mpk", ["r|japan",  't|["Slot 3","Option"]'         , "s|3$1", "c|0xc95f3b9f", "i|91" , "w|92" , "c|0x44cdd88b"]],
    ["should load a standard save (Europe)"       ,  "europe.mpk", [            't|["Slot 2","Option"]'         , "s|2$1", "c|0x9550f435", "i|95" , "w|96" , "c|0x6751795d"]],
    ["should load a standard save (USA)"          ,     "usa.mpk", [            't|["Slot 3","Option"]'         , "s|3$1", "c|0x60b6b52a", "i|99" , "w|100", "c|0xed24563e"]],
    ["should load a standard save (Japan)"        ,   "japan.mpk", [            't|["Slot 1","Option"]'         , "s|1$1", "c|0xce8ec1d7", "i|100", "w|101", "c|0x228832a9"]],
    ["should load a SRM save (Europe)"            ,  "europe.srm", [            't|["Slot 1","Slot 3","Option"]', "s|3$1", "c|0xc3c4a23e", "i|99" , "w|100", "c|0x4e56412a"]],
    ["should load a SRM save (USA)"               ,     "usa.srm", [            't|["Slot 2","Slot 3","Option"]', "s|2$1", "c|0x459cb4de", "i|98" , "w|99" , "c|0xa99a47a0"]],
    ["should load a SRM save (Japan)"             ,   "japan.srm", [            't|["Slot 2","Option"]'         , "s|2$1", "c|0xf31ddf31", "i|82" , "w|83" , "c|0x1f1b2c4f"]],
    ["should load a DexDrive save (Europe)"       ,  "europe.n64", [            't|["Slot 2","Option"]'         , "s|2$1", "c|0x9550f435", "i|95" , "w|96" , "c|0x6751795d"]],
    ["should load a DexDrive save (USA)"          ,     "usa.n64", [            't|["Slot 3","Option"]'         , "s|3$1", "c|0x60b6b52a", "i|99" , "w|100", "c|0xed24563e"]],
    ["should load a DexDrive save (Japan)"        ,   "japan.n64", [            't|["Slot 1","Option"]'         , "s|1$1", "c|0xce8ec1d7", "i|100", "w|101", "c|0x228832a9"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
