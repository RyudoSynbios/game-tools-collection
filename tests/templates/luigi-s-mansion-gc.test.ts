import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "luigi-s-mansion-gc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)"        ,      "europe.gci", ['t|["Slot 1","Options"]', "s|1$1", "c|0x92cb5d37", "i|90", "w|91", "c|0x92cc5d36"]],
    ["should load a standard save (Europe) (Rev 1)", "europe-rev1.gci", ['t|["Slot 2","Options"]', "s|2$1", "c|0x6a1585ed", "i|75", "w|76", "c|0x6a1685ec"]],
    ["should load a standard save (USA)"           ,         "usa.gci", ['t|["Slot 3","Options"]', "s|3$1", "c|0x983157d1", "i|55", "w|56", "c|0x983257d0"]],
    ["should load a standard save (Japan)"         ,       "japan.gci", ['t|["Slot 2","Options"]', "s|2$1", "c|0x596296a0", "i|70", "w|71", "c|0x5963969f"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
