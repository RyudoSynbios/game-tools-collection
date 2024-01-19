import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "konami-krazy-racers-gba";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"   ,  "empty.sav", ['t|["Time Attack"]']],
    ["should load a standard save (Europe)" , "europe.sav", ['t|["Slot 3","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
    ["should load a standard save (USA)"    ,    "usa.sav", ['t|["Slot 1","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
    ["should load a standard save (Japan)"  ,  "japan.sav", ['t|["Slot 2","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
    ["should load a GameShark save (Europe)", "europe.sps", ['t|["Slot 1","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
    ["should load a GameShark save (USA)"   ,    "usa.sps", ['t|["Slot 2","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
    ["should load a GameShark save (Japan)" ,  "japan.sps", ['t|["Slot 3","Time Attack"]', "c|eab6", "i|PASS", "w|QASS", "c|eab5"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
