import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-smash-bros-melee-gc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe.gci", ["c|0x3f24cd9788ab9153$1", "c|0x01f610a1b675a510$2", "i|5", "w|6", "c|0x3f24cda188ab9153$1", "c|0x01f610a1b675a510$2"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ["c|0xff248d9888ab5153$1", "c|0xc1f610a07675e410$2", "i|5", "w|6", "c|0xff248da288ab5153$1", "c|0xc1f610a07675e410$2"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ["c|0xff22849888aa4c53$1", "c|0xc1f50ba07674de2f$2", "i|5", "w|6", "c|0xff2284a288aa4c53$1", "c|0xc1f50ba07674de2f$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
