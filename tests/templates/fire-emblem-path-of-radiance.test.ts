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
  defaultTests(game, ["gamecube"]);

  // prettier-ignore
  const tests: Test[] = [
    // GameCube
    ["should load an empty standard save"          , "gamecube/empty.gci"        , ['t|["System"]']],
    ["should load a deleted standard save"         , "gamecube/deleted.gci"      , ['t|["System"]']],
    ["should load a deleted standard save (Slot 4)", "gamecube/deleted-slot4.gci", ['t|["System","Slot 4"]', "c|0x6cda06ae", "s|5$1", "c|0x6cda06ae", "i|04$1", "i|07$2", "s|2$2", "i|21", "w|22", "c|0x1face39d", "s|1$1", "i|0", "w|1", "c|0x14ea5b20"]],
    ["should load a standard save (Europe)"        , "gamecube/europe.gci"       , ['t|["System","Slot 2"]', "c|0x6cda06ae", "s|3$1", "c|0x6cda06ae", "i|04$1", "i|07$2", "s|2$2", "i|21", "w|22", "c|0x679cbe13", "s|1$1", "i|0", "w|1", "c|0x679cbe13"]],
    ["should load a standard save (USA)"           , "gamecube/usa.gci"          , ['t|["System","Slot 5"]', "c|0x224ccd9c", "s|6$1", "c|0xc85ccf73", "i|03$1", "i|35$2", "s|2$2", "i|20", "w|21", "c|0x505e6e5d", "s|1$1", "i|0", "w|1", "c|0x79811527"]],
    ["should load a standard save (Japan)"         , "gamecube/japan.gci"        , ['t|["System","Slot 1"]', "c|0xeabaa64f", "s|2$1", "c|0x7c895eec", "i|03$1", "i|36$2", "s|2$2", "i|19", "w|20", "c|0x026635a4", "s|1$1", "i|0", "w|1", "c|0xb1777ef4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
