import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "lylat-wars-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)"       ,      "europe.eep", ["r|europe"   , "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a standard save (USA)"          ,         "usa.eep", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a standard save (USA) (Rev 1)"  ,    "usa-rev1.eep", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a standard save (Japan)"        ,       "japan.eep", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a standard save (Japan) (Rev 1)",  "japan-rev1.eep", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a standard save (Australia)"    ,   "australia.eep", ["r|australia", "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a SRM save (Europe)"            ,      "europe.srm", ["r|europe"   , "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a SRM save (USA)"               ,         "usa.srm", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a SRM save (USA) (Rev 1)"       ,    "usa-rev1.srm", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a SRM save (Japan)"             ,       "japan.srm", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a SRM save (Japan) (Rev 1)"     ,  "japan-rev1.srm", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a SRM save (Australia)"         ,   "australia.srm", ["r|australia", "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
