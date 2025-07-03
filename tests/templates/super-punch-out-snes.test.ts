import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-punch-out-snes";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"          ,         "empty.sav", ['t|["Records"]']],
    ["should load a deleted standard save (Slot 2)", "deleted-slot2.sav", ['t|["Slot 2","Records"]'                  , "s|2$1", "c|0xea06", "i|PASS", "w|QASS", "c|0xea05"]],
    ["should load a standard save (Europe)"        ,        "europe.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|3$1", "c|0x2886", "i|PASS", "w|QASS", "c|0x2885"]],
    ["should load a standard save (USA)"           ,           "usa.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|1$1", "c|0xad86", "i|PASS", "w|QASS", "c|0xad85"]],
    ["should load a standard save (Japan)"         ,         "japan.sav", ['t|["Slot 1","Slot 2","Slot 3","Records"]', "s|2$1", "c|0xea06", "i|PASS", "w|QASS", "c|0xea05"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
