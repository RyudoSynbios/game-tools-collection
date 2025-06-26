import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "muramasa-the-demon-blade-wii";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a standard save (Europe)", "europe/save.dat", ['t|["Slot 4"]$1', "s|4$1", 't|["General","Momohime","Blades"]$2'         , "c|0xb4313f9d", "i|00$1", "i|04$2", "w|05$2", "c|0x31c634bf"]],
    ["should load a standard save (USA)"   ,    "usa/save.dat", ['t|["Slot 2"]$1', "s|2$1", 't|["General","Kisuke","Blades"]$2'           , "c|0x705b81c1", "i|00$1", "i|06$2", "w|07$2", "c|0xb6cc9ec6"]],
    ["should load a standard save (Japan)" ,  "japan/save.dat", ['t|["Slot 5"]$1', "s|5$1", 't|["General","Kisuke","Momohime","Blades"]$2', "c|0x4e2bc45a", "i|00$1", "i|13$2", "w|14$2", "c|0xb6f0fe7c"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
