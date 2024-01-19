import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-street-fighter-ii-turbo-revival-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"   ,  "empty.sav", ["i|1$1", "i|0$2"]],
    ["should load a standard save (Europe)" , "europe.sav", ["c|de", "i|5$1", "i|36$2", "w|37$2", "c|dd"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ["c|fc", "i|3$1", "i|8$2" , "w|9$2" , "c|fb"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ["c|df", "i|4$1", "i|36$2", "w|37$2", "c|de"]],
    ["should load a GameShark save (Europe)", "europe.sps", ["c|f4", "i|8$1", "i|15$2", "w|16$2", "c|f3"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ["c|f3", "i|4$1", "i|16$2", "w|17$2", "c|f2"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ["c|af", "i|7$1", "i|80$2", "w|81$2", "c|ae"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
