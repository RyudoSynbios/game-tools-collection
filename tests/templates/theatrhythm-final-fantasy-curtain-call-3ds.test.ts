import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "theatrhythm-final-fantasy-curtain-call-3ds";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe/savedata.bk", ['t|["Slot 2"]'         , "s|2", "i|PASS"]],
    ["should load a standard save (USA)"   ,    "usa/savedata.bk", ['t|["Slot 1","Slot 2"]', "s|2", "i|PASS"]],
    ["should load a standard save (Japan)" ,  "japan/savedata.bk", ['t|["Slot 1"]'         , "s|1", "i|PASS"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
