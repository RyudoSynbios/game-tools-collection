import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "castlevania-order-of-ecclesia-ds";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"              ,         "empty.dsv", ["r|europe", 't|["General","Records"]']],
    ["should load a deleted standard save"             ,       "deleted.dsv", ["r|usa"   , 't|["General","Records"]']],
    ["should load a deleted standard save (Slot 1)"    , "deleted-slot1.dsv", ["r|korea" , 't|["General","Slot 1","Records"]'         , "s|2$1", "c|0x84d1$1", "c|0x11ba$2", "c|0x12f0$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x61b7$3", "c|0x2697$4"]],
    ["should load a standard save (Europe)"            ,        "europe.dsv", ["r|europe", 't|["General","Slot 1","Slot 3","Records"]', "s|4$1", "c|0x82d7$1", "c|0x84e9$2", "c|0xb4ea$3", "c|0xd9ac$4", "i|PASS", "w|QASS", "c|0x87a5$3", "c|0x581f$4"]],
    ["should load a standard save (USA)"               ,           "usa.dsv", ["r|usa"   , 't|["General","Slot 3","Records"]'         , "s|4$1", "c|0x82d7$1", "c|0x02c2$2", "c|0x2a4d$3", "c|0xdcd4$4", "i|PASS", "w|QASS", "c|0x1902$3", "c|0x5d67$4"]],
    ["should load a standard save (Japan)"             ,         "japan.dsv", ["r|japan" , 't|["General","Slot 2","Records"]'         , "s|3$1", "c|0x43d7$1", "c|0x5ac6$2", "c|0x18ea$3", "c|0xb848$4", "i|PASS", "w|QASS", "c|0xc30c$3", "c|0x39fb$4"]],
    ["should load a standard save (Korea)"             ,         "korea.dsv", ["r|korea" , 't|["General","Slot 1","Slot 2","Records"]', "s|2$1", "c|0x84d1$1", "c|0xe8c8$2", "c|0x4cc9$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x3f8e$3", "c|0x2697$4"]],
    ["should load a Action Replay Max DS save (Europe)",        "europe.duc", ["r|europe", 't|["General","Slot 1","Slot 3","Records"]', "s|4$1", "c|0x82d7$1", "c|0x84e9$2", "c|0xb4ea$3", "c|0xd9ac$4", "i|PASS", "w|QASS", "c|0x87a5$3", "c|0x581f$4"]],
    ["should load a Action Replay Max DS save (USA)"   ,           "usa.duc", ["r|usa"   , 't|["General","Slot 3","Records"]'         , "s|4$1", "c|0x82d7$1", "c|0x02c2$2", "c|0x2a4d$3", "c|0xdcd4$4", "i|PASS", "w|QASS", "c|0x1902$3", "c|0x5d67$4"]],
    ["should load a Action Replay Max DS save (Japan)" ,         "japan.duc", ["r|japan" , 't|["General","Slot 2","Records"]'         , "s|3$1", "c|0x43d7$1", "c|0x5ac6$2", "c|0x18ea$3", "c|0xb848$4", "i|PASS", "w|QASS", "c|0xc30c$3", "c|0x39fb$4"]],
    ["should load a Action Replay Max DS save (Korea)" ,         "korea.duc", ["r|korea" , 't|["General","Slot 1","Slot 2","Records"]', "s|2$1", "c|0x84d1$1", "c|0xe8c8$2", "c|0x4cc9$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x3f8e$3", "c|0x2697$4"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
