import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "f-zero-x-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe.sra", ["r|europe", "s|2", "c|0x0e21", "i|PAS", "w|QAS", "c|0x0e22"]],
    ["should load a standard save (USA)"   ,    "usa.sra", ["r|usa"   , "s|2", "c|0x0e15", "i|PAS", "w|QAS", "c|0x0e16"]],
    ["should load a standard save (Japan)" ,  "japan.sra", ["r|japan" , "s|2", "c|0x0e6a", "i|PAS", "w|QAS", "c|0x0e6b"]],
    ["should load a SRM save (Europe)"     , "europe.srm", ["r|europe", "s|2", "c|0x0e7e", "i|PAS", "w|QAS", "c|0x0e7f"]],
    ["should load a SRM save (USA)"        ,    "usa.srm", ["r|usa"   , "s|2", "c|0x0d9e", "i|PAS", "w|QAS", "c|0x0d9f"]],
    ["should load a SRM save (Japan)"      ,  "japan.srm", ["r|japan" , "s|2", "c|0x0df7", "i|PAS", "w|QAS", "c|0x0df8"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
