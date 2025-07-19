import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "kingdom-hearts-chain-of-memories-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)" , "europe.sav", ["r|europe", 't|["General","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["r|usa"   , 't|["General","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["r|japan" , 't|["General","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["r|usa"   , 't|["General","Sora 1"]'         , "s|2", "c|0x002b", "i|09$1" , "i|02$2", "w|03$2", "c|0x002a"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["r|usa"   , 't|["General","Sora 2","Riku 1"]', "s|3", "c|0x3cce", "i|07$1" , "i|13$2", "w|14$2", "c|0x3ccd"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["r|japan" , 't|["General","Sora 1","Riku 2"]', "s|5", "c|0xbeec", "i|02$1" , "i|49$2", "w|50$2", "c|0xbeeb"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
