import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "skies-of-arcadia-legends-gc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe.gci", ["c|0x848bd05c", "i|37", "w|38", "c|0x848bd05f"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ["c|0xab7a7687", "i|38", "w|39", "c|0xab7a7686"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ["c|0x4bb75684", "i|22", "w|23", "c|0x4bb75685"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
