import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "final-fantasy-vii-rebirth-windows";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (World)", "ff7rebirth001.sav", ["i|2000"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
