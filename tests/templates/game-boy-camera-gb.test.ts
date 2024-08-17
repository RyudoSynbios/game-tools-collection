import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "game-boy-camera-gb";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",  "europeusa.sav", ["r|japan" , "n|PASS"]],
    ["should load a standard save (Europe, USA)"      ,  "europeusa.sav", ['r|europe', "c|0xd77d$2", "i|PASS", "w|QASS", "c|0xd47e$2"]],
    ["should load a standard save (USA) (Gold)"       ,   "usa-gold.sav", ['r|usa'   , "c|0xd9fb$2", "i|PASS", "w|QASS", "c|0xdafc$2"]],
    ["should load a standard save (Japan) (Rev 1)"    , "japan-rev1.sav", ['r|japan' , "c|0xd169$2", "i|PASS", "w|QASS", "c|0xd06a$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
