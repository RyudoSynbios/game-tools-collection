import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "bomberman-64-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"             ,    "empty.eep", ["r|europe", 't|["Options"]']],
    ["should load a deleted standard save"            ,  "deleted.eep", ["r|europe", 't|["Options"]']],
    ["should not load a standard save with bad region",    "japan.eep", ["r|europe", 't|["Slot 2","Options"]', "s|3$2", "n|ごうかく"]],
    ["should load a standard save (Europe)"           ,   "europe.eep", ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a standard save (USA)"              ,      "usa.eep", ["r|usa"   , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a standard save (Japan)"            ,    "japan.eep", ["r|japan" , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x01$3", "i|ごうかく", "w|ざうかく", "c|0x3f$1", "c|0xc4$3"]],
    ["should load a SRM save (Europe)"                ,   "europe.srm", ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a SRM save (USA)"                   ,      "usa.srm", ["r|usa"   , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a SRM save (Japan)"                 ,    "japan.srm", ["r|japan" , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
