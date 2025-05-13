import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "legend-of-zelda-the-oracle-of-seasons-gbc";

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
    ["should not load a standard save with bad region",        "japan.sav", ["r|usa"   , 't|["Slot 2"]', "n|ごうかく"]],
    ["should load a standard save (Europe)"           ,       "europe.sav", ["r|europe", 't|["Slot 3"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (USA, Australia)"   , "usaaustralia.sav", ["r|usa"   , 't|["Slot 1"]', "c|0xb676", "i|PASS"   , "w|QASS"  , "c|0xb677"]],
    ["should load a standard save (Japan)"            ,        "japan.sav", ["r|japan" , 't|["Slot 2"]', "c|0xebd3", "i|ごうかく", "w|ざうかく", "c|0xebd4"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
