import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "banjo-kazooie-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"  ,   "empty.eep", ['t|["Stop \'n\' Swop"]']],
    ["should load a deleted standard save" , "deleted.eep", ['t|["Stop \'n\' Swop"]']],
    ["should load a standard save (Europe)",  "europe.eep", ['t|["Slot 3","Stop \'n\' Swop"]', "s|3$1", "c|0xb48a7c48", "s|2$2", "i|13", "w|14", "c|0x213ad53c"]],
    ["should load a standard save (USA)"   ,     "usa.eep", ['t|["Slot 1","Stop \'n\' Swop"]', "s|1$1", "c|0x2129e021", "s|2$2", "i|35", "w|36", "c|0x0c5f777d"]],
    ["should load a standard save (Japan)" ,   "japan.eep", ['t|["Slot 2","Stop \'n\' Swop"]', "s|2$1", "c|0x5e806948", "s|2$2", "i|05", "w|06", "c|0x9aeb79b1"]],
    ["should load a SRM save (Europe)"     ,  "europe.srm", ['t|["Slot 3","Stop \'n\' Swop"]', "s|3$1", "c|0x959da827", "s|2$2", "i|07", "w|08", "c|0x1873cd41"]],
    ["should load a SRM save (USA)"        ,     "usa.srm", ['t|["Slot 2","Stop \'n\' Swop"]', "s|2$1", "c|0x5e806948", "s|2$2", "i|05", "w|06", "c|0x9aeb79b1"]],
    ["should load a SRM save (Japan)"      ,   "japan.srm", ['t|["Slot 1","Stop \'n\' Swop"]', "s|1$1", "c|0xd530c30c", "s|2$2", "i|04", "w|05", "c|0x07d6cf1b"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
