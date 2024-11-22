import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "kirby-s-adventure-nes";

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
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA)"           ,           "usa.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (USA) (Rev 1)"   ,      "usa-rev1.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (France)"        ,        "france.sav", ['t|["Slot 1"]', "s|1$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Germany)"       ,       "germany.sav", ['t|["Slot 3"]', "s|3$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
    ["should load a standard save (Canada)"        ,        "canada.sav", ['t|["Slot 2"]', "s|2$1", "c|0x00d2", "i|1", "w|2", "c|0x03d3"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
