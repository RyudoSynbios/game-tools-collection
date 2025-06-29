import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "final-fantasy-nes";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",      "japan.sav", ["r|usa"  , "s|2$1", "s|4$2", "n|ごうかく"]],
    ["should load a standard save (USA)"              ,        "usa.sav", ["r|usa"  , "s|2$1", "s|2$2", "c|0x6f", "i|PASS"   , "w|QASS"  , "c|0x6e"]],
    ["should load a standard save (Japan)"            ,      "japan.sav", ["r|japan", "s|2$1", "s|4$2", "c|0x99", "i|ごうかく", "w|ざうかく", "c|0x98"]],
    ["should load a standard save (Japan) (Rev 1)"    , "japan-rev1.sav", ["r|japan", "s|2$1", "s|3$2", "c|0x99", "i|ごうかく", "w|ざうかく", "c|0x98"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
