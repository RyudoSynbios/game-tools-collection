import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "soleil-md";

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
    ["should load a standard save (Europe)" , "europe.sav" , ["r|europe" , 't|["Slot 4"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (USA)"    , "usa.sav"    , ["r|usa"    , 't|["Slot 3"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Japan)"  , "japan.sav"  , ["r|japan"  , 't|["Slot 3"]', "c|0x9b14", "i|PASS", "w|QASS", "c|0x9c15"]],
    ["should load a standard save (France)" , "france.sav" , ["r|france" , 't|["Slot 2"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Germany)", "germany.sav", ["r|germany", 't|["Slot 3"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Spain)"  , "spain.sav"  , ["r|spain"  , 't|["Slot 2"]', "c|0xd092", "i|PASS", "w|QASS", "c|0xd28f"]],
    ["should load a standard save (Korea)"  , "korea.sav"  , ["r|korea"  , 't|["Slot 1"]', "c|0x9b14", "i|PASS", "w|QASS", "c|0x9c15"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
