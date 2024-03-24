import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "goldeneye-007-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"  ,   "empty.eep", ['t|[]']],
    ["should load a deleted standard save" , "deleted.eep", ['t|[]']],
    ["should load a standard save (Europe)",  "europe.eep", ['t|["Slot 4"]', "s|2$2", "c|0x4e86d50aaf40e24c", "i|02$1", "i|22$2", "w|03$1", "c|0x69b1d16490e21bb0"]],
    ["should load a standard save (USA)"   ,     "usa.eep", ['t|["Slot 1"]', "s|1$2", "c|0x9d31d03d095fb5f8", "i|01$1", "i|25$2", "w|02$1", "c|0xcb397d89fc1d4b95"]],
    ["should load a standard save (Japan)" ,   "japan.eep", ['t|["Slot 3"]', "s|1$2", "c|0xac2ea6145372b2bc", "i|01$1", "i|35$2", "w|02$1", "c|0x3957d9b25c4bf1f5"]],
    ["should load a SRM save (Europe)"     ,  "europe.srm", ['t|["Slot 2"]', "s|1$2", "c|0x6a3d007175ad4750", "i|01$1", "i|21$2", "w|02$1", "c|0x9a13484e441a456a"]],
    ["should load a SRM save (USA)"        ,     "usa.srm", ['t|["Slot 3"]', "s|2$2", "c|0x145c0fe6fc62221f", "i|02$1", "i|14$2", "w|03$1", "c|0xe319434ce11758f2"]],
    ["should load a SRM save (Japan)"      ,   "japan.srm", ['t|["Slot 4"]', "s|2$2", "c|0x20ba7f96ea95203b", "i|02$1", "i|41$2", "w|03$1", "c|0xd71d02bdc659aa77"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
