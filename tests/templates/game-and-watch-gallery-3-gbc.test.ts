import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "game-and-watch-gallery-3-gbc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe, USA)", "europeusa.sav", ["c|0x251a", "s|2", "s|5$2", "i|0087", "w|0088", "c|0x251b"]],
    ["should load a standard save (Japan)"      ,     "japan.sav", ["c|0x3139", "s|2", "s|1$2", "i|0103", "w|0104", "c|0x313a"]],
    ["should load a standard save (Australia)"  , "australia.sav", ["c|0x1783", "s|2", "s|2$2", "i|0069", "w|0070", "c|0x177b"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
