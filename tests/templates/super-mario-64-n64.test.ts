import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-mario-64-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"  ,   "empty.eep", ["r|japan" , 't|["Score","Option"]']],
    ["should load a deleted standard save" , "deleted.eep", ["r|usa"   , 't|["Score","Option"]']],
    ["should load a standard save (Europe)",  "europe.eep", ["r|europe", 't|["Mario D","Score","Option"]'          , "c|0x0709$1", "s|4$1", "s|2$2", "c|0x00a9$2", "i|3$1" , "w|4$1" , "c|0x00aa$2"]],
    ["should load a standard save (USA)"   ,     "usa.eep", ["r|usa"   , 't|["Mario A","Mario D","Score","Option"]', "c|0x070a$1", "s|4$1", "s|2$2", "c|0x00b2$2", "i|12$1", "w|13$1", "c|0x00b3$2"]],
    ["should load a standard save (Japan)" ,   "japan.eep", ["r|japan" , 't|["Mario B","Score","Option"]'          , "c|0x0709$1", "s|2$1", "s|2$2", "c|0x00a8$2", "i|2$1" , "w|3$1" , "c|0x00a9$2"]],
    ["should load a SRM save (Europe)"     ,  "europe.srm", ["r|europe", 't|["Mario B","Mario C","Score","Option"]', "c|0x070a$1", "s|3$1", "s|2$2", "c|0x00ae$2", "i|8$1" , "w|9$1" , "c|0x00af$2"]],
    ["should load a SRM save (USA)"        ,     "usa.srm", ["r|usa"   , 't|["Mario C","Score","Option"]'          , "c|0x0709$1", "s|3$1", "s|2$2", "c|0x00ab$2", "i|5$1" , "w|6$1" , "c|0x00ac$2"]],
    ["should load a SRM save (Japan)"      ,   "japan.srm", ["r|japan" , 't|["Mario A","Score","Option"]'          , "c|0x0709$1", "s|1$1", "s|2$2", "c|0x00a8$2", "i|2$1" , "w|3$1" , "c|0x00a9$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
