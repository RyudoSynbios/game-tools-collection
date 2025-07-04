import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "3d-dot-game-heroes-ps3";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe/DATA.SAV", ["i|PASS$1", "i|57$2"]],
    ["should load a standard save (USA)"   ,    "usa/DATA.SAV", ["i|PASS$1", "i|58$2"]],
    ["should load a standard save (Japan)" ,  "japan/DATA.SAV", ["i|PASS$1", "i|57$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
