import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "mystic-quest-legend-snes";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",      "japan.sav", ["r|france" , 't|["Slot 2"]', "s|2$2", "n|ごうかく"]],
    ["should load a standard save (Europe)"           ,     "europe.sav", ["r|europe" , 't|["Slot 2"]', "s|2$2", "c|f629", "i|PASS",   "w|QASS"   , "c|f62a"]],
    ["should load a standard save (USA)"              ,        "usa.sav", ["r|usa"    , 't|["Slot 3"]', "s|2$2", "c|c025", "i|PASS",   "w|QASS"   , "c|c026"]],
    ["should load a standard save (USA) (Rev 1)"      ,   "usa-rev1.sav", ["r|usa"    , 't|["Slot 1"]', "s|2$2", "c|7f26", "i|PASS",   "w|QASS"   , "c|7f27"]],
    ["should load a standard save (Japan)"            ,      "japan.sav", ["r|japan"  , 't|["Slot 2"]', "s|2$2", "c|7da8", "i|ごうかく", "w|ざうかく", "c|7da9"]],
    ["should load a standard save (France)"           ,     "france.sav", ["r|france" , 't|["Slot 1"]', "s|2$2", "c|c1e7", "i|PASS",   "w|QASS"   , "c|c1e8"]],
    ["should load a standard save (Germany)"          ,    "germany.sav", ["r|germany", 't|["Slot 3"]', "s|2$2", "c|f3ea", "i|PASS",   "w|QASS"   , "c|f3eb"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
