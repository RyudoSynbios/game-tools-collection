import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "dissidia-012-duodecim-final-fantasy-psp";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)"           , "europe.bin", ["r|europe", "i|PASS"]],
    ["should load a standard save (USA)"              ,    "usa.bin", ["r|usa"   , "i|PASS"]],
    ["should load a standard save (Japan)"            ,  "japan.bin", [            "i|PASS"]],
    ["should load a standard save (Asia)"            ,    "asia.bin", ["r|asia"  , "i|PASS"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
