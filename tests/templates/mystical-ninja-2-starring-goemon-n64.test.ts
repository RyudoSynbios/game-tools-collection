import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "mystical-ninja-2-starring-goemon-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/bad.n64`);
  });

  // prettier-ignore
  test.each([
    ["should load an empty standard save"             ,   "empty.mpk", [            't|["Options"]']],
    ["should load a deleted standard save"            , "deleted.mpk", [            't|["Options"]']],
    ["should load a filled standard save (Europe)"    ,  "filled.mpk", ["r|europe", 't|["Slot 2","Options"]'         , "s|2$1", "c|6d9c72c4", "i|2", "s|2$2", "i|136", "w|137", "c|1d46dfc7"]],
    ["should load a filled standard save (USA)"       ,  "filled.mpk", ["r|usa",    't|["Slot 3","Options"]'         , "s|3$1", "c|a09897d7", "i|1", "s|2$2", "i|134", "w|135", "c|d0423ad4"]],
    ["should load a standard save (Europe)"           ,  "europe.mpk", [            't|["Slot 1","Options"]'         , "s|1$1", "c|94f4c941", "i|1", "s|2$2", "i|103", "w|104", "c|49a6d93e"]],
    ["should load a standard save (USA)"              ,     "usa.mpk", [            't|["Slot 3","Options"]'         , "s|3$1", "c|d5f430d2", "i|4", "s|2$2", "i|144", "w|145", "c|a52e9dd1"]],
    ["should load a standard save (Japan)"            ,   "japan.sra", [            't|["Slot 1","Options"]'         , "s|1$1", "c|92e76c8b", "i|3", "s|2$2", "i|131", "w|132", "c|c4233235"]],
    ["should load a SRM save (Europe)"                ,  "europe.srm", [            't|["Slot 2","Slot 3","Options"]', "s|3$1", "c|c335c510", "i|1", "s|2$2", "i|100", "w|101", "c|b3ef6813"]],
    ["should load a SRM save (USA)"                   ,     "usa.srm", [            't|["Slot 1","Options"]'         , "s|1$1", "c|28b374ff", "i|1", "s|2$2", "i|141", "w|142", "c|b9dc83fa"]],
    ["should load a SRM save (Japan)"                 ,   "japan.srm", [            't|["Slot 1","Slot 3","Options"]', "s|3$1", "c|ba0d154c", "i|6", "s|2$2", "i|432", "w|433", "c|cad7b84f"]],
    ["should load a DexDrive save (Europe)"           ,  "europe.n64", [            't|["Slot 3","Options"]'         , "s|3$1", "c|447416f4", "i|1", "s|2$2", "i|118", "w|119", "c|34aebbf7"]],
    ["should load a DexDrive save (USA)"              ,     "usa.n64", [            't|["Slot 1","Options"]'         , "s|1$1", "c|7b2ef164", "i|1", "s|2$2", "i|120", "w|121", "c|0bf45c67"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
