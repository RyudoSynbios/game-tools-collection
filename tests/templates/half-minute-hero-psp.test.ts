import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "half-minute-hero-psp";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",    "usa.bin", ["r|japan" , "n|PASS"]],
    ["should load a standard save (Europe)"           , "europe.bin", ["r|europe", "i|PASS"]],
    ["should load a standard save (USA)"              ,    "usa.bin", ["r|usa"   , "i|PASS"]],
    ["should load a standard save (Japan)"            ,  "japan.bin", ["r|japan" , "i|ＰＡＳＳ"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
