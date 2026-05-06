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
  defaultTests(game, ["playstation-3"]);

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation 3
    ["should load a Main save (Europe)"  , "playstation-3/europe/DATA.SAV", ["r|europe", 't|["General","Inventory","Bestiary","Loading Art","Options"]', "i|PASS$1", "i|57$2"]],
    ["should load a Main save (USA)"     , "playstation-3/usa/DATA.SAV"   , ["r|usa"   , 't|["General","Inventory","Bestiary","Loading Art","Options"]', "i|PASS$1", "i|58$2"]],
    ["should load a Main save (Japan)"   , "playstation-3/japan/DATA.SAV" , ["r|japan" , 't|["General","Inventory","Bestiary","Options"]'              , "i|PASS$1", "i|57$2"]],
    ["should load a System save (Europe)", "playstation-3/europe/SYS.DAT" , ["r|europe", 't|["System"]']],
    ["should load a System save (USA)"   , "playstation-3/usa/SYS.DAT"    , ["r|usa"   , 't|["System"]']],
    ["should load a System save (Japan)" , "playstation-3/japan/SYS.DAT"  , ["r|japan" , 't|["System"]']],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
