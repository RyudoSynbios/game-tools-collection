import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "rogue-legacy-windows";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard Main save (World)" , "RogueLegacyPlayer.rcdat", ['t|["General","Current Game","Current Run","Bestiary"]', "s|3$1", "i|PASS"]],
    ["should load a standard Manor save (World)",     "RogueLegacyBP.rcdat", ['t|["Manor"]', "s|5$1", "s|1$2", "i|8$1", "i|2$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
