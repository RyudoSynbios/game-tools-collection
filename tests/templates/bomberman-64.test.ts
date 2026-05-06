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
  defaultTests(game, ["nintendo-64"]);

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load an empty standard save"             , "nintendo-64/empty.eep"  , ["r|europe", 't|["Options"]']],
    ["should load a deleted standard save"            , "nintendo-64/deleted.eep", ["r|europe", 't|["Options"]']],
    ["should not load a standard save with bad region", "nintendo-64/japan.eep"  , ["r|europe", 't|["Slot 2","Options"]', "s|3$2", "n|ごうかく"]],
    ["should load a standard save (Europe)"           , "nintendo-64/europe.eep" , ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a standard save (USA)"              , "nintendo-64/usa.eep"    , ["r|usa"   , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a standard save (Japan)"            , "nintendo-64/japan.eep"  , ["r|japan" , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x01$3", "i|ごうかく", "w|ざうかく", "c|0x3f$1", "c|0xc4$3"]],
    ["should load a SRM save (Europe)"                , "nintendo-64/europe.srm" , ["r|europe", 't|["Slot 1","Options"]', "s|3$2", "c|0x1d$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x1d$1", "c|0x27$3"]],
    ["should load a SRM save (USA)"                   , "nintendo-64/usa.srm"    , ["r|usa"   , 't|["Slot 2","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
    ["should load a SRM save (Japan)"                 , "nintendo-64/japan.srm"  , ["r|japan" , 't|["Slot 3","Options"]', "s|3$2", "c|0x3f$1", "c|0x64$3", "i|PASS"   , "w|QASS"  , "c|0x3f$1", "c|0x27$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
