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
    ["should load a standard save (Europe)",  "europe.eep", ['t|["Slot 4"]', "s|2$2", "c|4e86d50aaf40e24c", "i|02$1", "i|22$2", "w|03$1", "c|69b1d16490e21bb0"]],
    ["should load a standard save (USA)"   ,     "usa.eep", ['t|["Slot 1"]', "s|1$2", "c|9d31d03d095fb5f8", "i|01$1", "i|25$2", "w|02$1", "c|cb397d89fc1d4b95"]],
    ["should load a standard save (Japan)" ,   "japan.eep", ['t|["Slot 3"]', "s|1$2", "c|ac2ea6145372b2bc", "i|01$1", "i|35$2", "w|02$1", "c|3957d9b25c4bf1f5"]],
    ["should load a SRM save (Europe)"     ,  "europe.srm", ['t|["Slot 2"]', "s|1$2", "c|6a3d007175ad4750", "i|01$1", "i|21$2", "w|02$1", "c|9a13484e441a456a"]],
    ["should load a SRM save (USA)"        ,     "usa.srm", ['t|["Slot 3"]', "s|2$2", "c|145c0fe6fc62221f", "i|02$1", "i|14$2", "w|03$1", "c|e319434ce11758f2"]],
    ["should load a SRM save (Japan)"      ,   "japan.srm", ['t|["Slot 4"]', "s|2$2", "c|20ba7f96ea95203b", "i|02$1", "i|41$2", "w|03$1", "c|d71d02bdc659aa77"]],
    ["should load a DexDrive save (Europe)",  "europe.n64", ['t|["Slot 1"]', "s|1$2", "c|b34415dda25db4bd", "i|02$1", "i|00$2", "w|03$1", "c|d95bde7cf9989e4f"]],
    ["should load a DexDrive save (USA)"   ,     "usa.n64", ['t|["Slot 4"]', "s|1$2", "c|80ff788069283268", "i|01$1", "i|21$2", "w|02$1", "c|ff89b41187cb793c"]],
    ["should load a DexDrive save (Japan)" ,   "japan.n64", ['t|["Slot 2"]', "s|1$2", "c|1750aafc34f254c8", "i|01$1", "i|33$2", "w|02$1", "c|7d4f615d11eee11d"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
