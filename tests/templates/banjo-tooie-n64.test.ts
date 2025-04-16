import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "banjo-tooie-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.eep`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.eep`);
  });

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)"   ,    "europe.eep", ["r|europe"   , 't|["Slot 2","Slot 3","Replay","Settings"]', "s|2$1", "c|0xa3ac8b8129367c14", "s|2$2", "i|33", "w|34", "c|0xa5f3977b985ff601"]],
    ["should load a standard save (USA)"      ,       "usa.eep", ["r|usa"      , 't|["Slot 3","Replay","Settings"]'         , "s|3$1", "c|0x735073e70e82d089", "s|2$2", "i|57", "w|58", "c|0x8a8f20436470d731"]],
    ["should load a standard save (Japan)"    ,     "japan.eep", ["r|japan"    , 't|["Slot 1","Slot 3","Replay","Settings"]', "s|1$1", "c|0x2729f887fe0af8fc", "s|2$2", "i|41", "w|42", "c|0xf201cee8081f6e96"]],
    ["should load a standard save (Australia)", "australia.eep", ["r|australia", 't|["Slot 2","Replay","Settings"]'         , "s|2$1", "c|0x5294eb80eb4b0f1a", "s|2$2", "i|15", "w|16", "c|0xf27269ee5f29d35c"]],
    ["should load a SRM save (Europe)"        ,    "europe.srm", ["r|europe"   , 't|["Slot 1","Replay","Settings"]'         , "s|1$1", "c|0x23c968357ab44e7d", "s|2$2", "i|28", "w|29", "c|0x3e057aa387ff87f8"]],
    ["should load a SRM save (USA)"           ,       "usa.srm", ["r|usa"      , 't|["Slot 1","Slot 3","Replay","Settings"]', "s|3$1", "c|0x993ffc2bc3fde26e", "s|2$2", "i|33", "w|34", "c|0xdf7605577baf5401"]],
    ["should load a SRM save (Japan)"         ,     "japan.srm", ["r|japan"    , 't|["Slot 2","Replay","Settings"]'         , "s|2$1", "c|0xeaf27c726e36501b", "s|2$2", "i|18", "w|19", "c|0xfb9e5f63dae7ff9f"]],
    ["should load a SRM save (Australia)"     , "australia.srm", ["r|australia", 't|["Slot 1","Slot 2","Replay","Settings"]', "s|1$1", "c|0x10c8060e65aaa11a", "s|2$2", "i|18", "w|19", "c|0x9d45086b36a1a4ec"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
