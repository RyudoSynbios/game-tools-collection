import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-street-fighter-ii-turbo-revival-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"   ,  "empty.sav", ["i|1$1", "i|0$2"]],
    ["should load a standard save (Europe)" , "europe.sav", ["c|0xde", "i|5$1", "i|36$2", "w|37$2", "c|0xdd"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["c|0xfc", "i|3$1", "i|8$2" , "w|9$2" , "c|0xfb"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["c|0xdf", "i|4$1", "i|36$2", "w|37$2", "c|0xde"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["c|0xf4", "i|8$1", "i|15$2", "w|16$2", "c|0xf3"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["c|0xf3", "i|4$1", "i|16$2", "w|17$2", "c|0xf2"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["c|0xaf", "i|7$1", "i|80$2", "w|81$2", "c|0xae"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
