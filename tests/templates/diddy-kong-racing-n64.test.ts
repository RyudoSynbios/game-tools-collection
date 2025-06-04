import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "diddy-kong-racing-n64";

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
    ["should load a standard save (Europe)"        ,      "europe.eep", ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (Europe) (Rev 1)", "europe-rev1.eep", ["r|europe", 't|["General","Adventure","Records","Options"]$1', "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (USA)"           ,         "usa.eep", ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (USA) (Rev 1)"   ,    "usa-rev1.eep", ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 3"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (Japan)"         ,       "japan.eep", ["r|japan" , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Europe)"             ,      "europe.srm", ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 3"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Europe) (Rev 1)"     , "europe-rev1.srm", ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (USA)"                ,         "usa.srm", ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1"]$2'         , "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (USA) (Rev 1)"        ,    "usa-rev1.srm", ["r|usa"   , 't|["General","Adventure","Records","Options"]$1', "s|2$1", 't|["Slot 3"]$2'         , "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Japan)"              ,       "japan.srm", ["r|japan" , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2"]$2'         , "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
