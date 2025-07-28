import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"              ,         "empty.dsv", ['t|["General"]']],
    ["should load a deleted standard save"             ,       "deleted.dsv", ['t|["General"]']],
    ["should load a deleted standard save (Slot 1)"    , "deleted-slot1.dsv", ['t|["General","Slot 1"]', "s|2$1", "c|0xa4ea$1", "c|0x7dc7$2", "i|202", "w|203", "c|0x6247$1", "c|0xd1c6$2"]],
    ["should load a standard save (Europe)"            ,        "europe.dsv", ['t|["General","Slot 2"]', "s|3$1", "c|0xae13$1", "c|0xb198$2", "i|202", "w|203", "c|0x73d2$1", "c|0x1d99$2"]],
    ["should load a standard save (USA)"               ,           "usa.dsv", ['t|["General","Slot 3"]', "s|4$1", "c|0x76c5$1", "c|0xdf01$2", "i|50" , "w|51" , "c|0xdac4$1", "c|0x7300$2"]],
    ["should load a standard save (Japan)"             ,         "japan.dsv", ['t|["General","Slot 1"]', "s|2$1", "c|0x7d93$1", "c|0xa439$2", "i|160", "w|161", "c|0xbb3e$1", "c|0x0838$2"]],
    ["should load a Action Replay Max DS save (Europe)",        "europe.duc", ['t|["General","Slot 3"]', "s|4$1", "c|0xdd14$1", "c|0x0bdb$2", "i|150", "w|151", "c|0x7115$1", "c|0xa7da$2"]],
    ["should load a Action Replay Max DS save (USA)"   ,           "usa.duc", ['t|["General","Slot 2"]', "s|3$1", "c|0x9db1$1", "c|0xfc6c$2", "i|50" , "w|51" , "c|0x4070$1", "c|0x506d$2"]],
    ["should load a Action Replay Max DS save (Japan)" ,         "japan.duc", ['t|["General","Slot 2"]', "s|3$1", "c|0x554f$1", "c|0x2122$2", "i|100", "w|101", "c|0x888e$1", "c|0x8d23$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
