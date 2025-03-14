import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "sonic-3-md";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"             ,           "empty.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|[]$2']],
    ["should load a deleted standard save"            ,         "deleted.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|[]$2']],
    ["should load a standard save (Europe)"           ,          "europe.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 6"]$2', "c|0xf0f9", "i|Sonic & Tails$1", "i|1$2", "w|2$2", "c|0xc3ff"]],
    ["should load a standard save (USA)"              ,             "usa.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 4"]$2', "c|0xc7fb", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x81c2"]],
    ["should load a standard save (Japan)"            ,           "japan.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 5"]$2', "c|0x4afe", "i|Sonic$1"        , "i|5$2", "w|6$2", "c|0x2fc2"]],
    ["should load a standard save (Europe) (Knuckles)", "europe-knuckles.sav", ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 3"]$2', "c|0x8ed1", "i|Sonic$1"        , "i|0$2", "w|1$2", "c|0x1a50"]],
    ["should load a standard save (USA) (Knuckles)"   ,    "usa-knuckles.sav", ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 2"]$2', "c|0x1fbd", "i|Knuckles$1"     , "i|0$2", "w|1$2", "c|0x1398"]],
    ["should load a standard save (Japan) (Knuckles)" ,  "japan-knuckles.sav", ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 8"]$2', "c|0x73f4", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x7b75"]],
    ["should load a standard save (Japan) (Both)"     ,            "both.sav", ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 4"]$2', "c|0xc7fb", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x81c2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
