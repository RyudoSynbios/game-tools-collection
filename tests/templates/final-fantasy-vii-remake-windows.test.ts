import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "final-fantasy-vii-remake-windows";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard Main Story save (World)"  ,     "ff7remake001.sav", ["i|50016"]],
    ["should load a standard INTERmission save (World)", "ff7remakeplus001.sav", ["i|50000"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
