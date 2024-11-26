import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "golden-sun-the-lost-age-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  it("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.sav`);
  });

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",         "japan.sav", ["r|europe" , 't|["Slot 2"]'         , "n|Jenna$1"]],
    ["should load a deleted standard save (Slot 2)"   , "deleted-slot2.sav", ["r|germany", 't|["Slot 2"]'         , "s|2$1", "c|0x642b", "i|57$2", "i|57$3", "w|58$2", "i|58$3", "s|2$2", "s|5$3", "i|PASS", "c|0x64df"]],
    ["should load a standard save (Europe, USA)"      ,     "europeusa.sav", ["r|europe" , 't|["Slot 1"]'         , "s|1$1", "c|0x5f17", "i|59$2", "i|59$3", "w|00$2", "i|00$3", "s|2$2", "s|5$3", "i|PASS", "c|0x5f71"]],
    ["should load a standard save (Japan)"            ,         "japan.sav", ["r|japan"  , 't|["Slot 2"]'         , "s|1$2", "c|0x76dd", "i|33$2", "i|33$3", "w|34$2", "i|34$3", "s|2$2", "s|5$3", "i|PASS", "c|0x7791"]],
    ["should load a standard save (France)"           ,        "france.sav", ["r|france" , 't|["Slot 1","Slot 3"]', "s|1$1", "c|0x5fcb", "i|42$2", "i|42$3", "w|43$2", "i|43$3", "s|2$2", "s|5$3", "i|PASS", "c|0x607f"]],
    ["should load a standard save (Germany)"          ,       "germany.sav", ["r|germany", 't|["Slot 2","Slot 3"]', "s|3$1", "c|0x624f", "i|29$2", "i|29$3", "w|30$2", "i|30$3", "s|2$2", "s|5$3", "i|PASS", "c|0x6303"]],
    ["should load a standard save (Italy)"            ,         "italy.sav", ["r|italy"  , 't|["Slot 3"]'         , "s|3$1", "c|0x61f8", "i|54$2", "i|54$3", "w|55$2", "i|55$3", "s|2$2", "s|5$3", "i|PASS", "c|0x62ac"]],
    ["should load a standard save (Spain)"            ,         "spain.sav", ["r|spain"  , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0x6220", "i|07$2", "i|07$3", "w|08$2", "i|08$3", "s|2$2", "s|5$3", "i|PASS", "c|0x62d4"]],
    ["should load a GameShark save (Europe, USA)"     ,     "europeusa.sps", ["r|europe" , 't|["Slot 1"]'         , "s|1$1", "c|0x5f17", "i|59$2", "i|59$3", "w|00$2", "i|00$3", "s|2$2", "s|5$3", "i|PASS", "c|0x5f71"]],
    ["should load a GameShark save (Japan)"           ,         "japan.sps", ["r|japan"  , 't|["Slot 2"]'         , "s|1$2", "c|0x76dd", "i|33$2", "i|33$3", "w|34$2", "i|34$3", "s|2$2", "s|5$3", "i|PASS", "c|0x7791"]],
    ["should load a GameShark save (France)"          ,        "france.sps", ["r|france" , 't|["Slot 1","Slot 3"]', "s|1$1", "c|0x5fcb", "i|42$2", "i|42$3", "w|43$2", "i|43$3", "s|2$2", "s|5$3", "i|PASS", "c|0x607f"]],
    ["should load a GameShark save (Germany)"         ,       "germany.sps", ["r|germany", 't|["Slot 2","Slot 3"]', "s|3$1", "c|0x624f", "i|29$2", "i|29$3", "w|30$2", "i|30$3", "s|2$2", "s|5$3", "i|PASS", "c|0x6303"]],
    ["should load a GameShark save (Italy)"           ,         "italy.sps", ["r|italy"  , 't|["Slot 3"]'         , "s|3$1", "c|0x61f8", "i|54$2", "i|54$3", "w|55$2", "i|55$3", "s|2$2", "s|5$3", "i|PASS", "c|0x62ac"]],
    ["should load a GameShark save (Spain)"           ,         "spain.sps", ["r|spain"  , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0x6220", "i|07$2", "i|07$3", "w|08$2", "i|08$3", "s|2$2", "s|5$3", "i|PASS", "c|0x62d4"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
