import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "final-fight-one-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  it("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)" , "europe.sav", ["c|0xba88", "i|2", "s|3", "i|PASS", "w|QASS", "c|0xba87"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["c|0xc587", "i|5", "s|3", "i|PASS", "w|QASS", "c|0xc586"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["c|0xb86e", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xb86d"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["c|0xc884", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xc883"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["c|0xbb88", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xbb87"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["c|0xb468", "i|3", "s|3", "i|PASS", "w|QASS", "c|0xb467"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
