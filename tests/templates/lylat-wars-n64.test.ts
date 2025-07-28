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
    ["should load a standard save (Europe)"       ,      "europe.eep", ["r|europe"   , "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a standard save (USA)"          ,         "usa.eep", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a standard save (USA) (Rev 1)"  ,    "usa-rev1.eep", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a standard save (Japan)"        ,       "japan.eep", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a standard save (Japan) (Rev 1)",  "japan-rev1.eep", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a standard save (Australia)"    ,   "australia.eep", ["r|australia", "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a SRM save (Europe)"            ,      "europe.srm", ["r|europe"   , "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
    ["should load a SRM save (USA)"               ,         "usa.srm", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a SRM save (USA) (Rev 1)"       ,    "usa-rev1.srm", ["r|usa"      , "s|2", "c|0x95c2", "i|PAS", "w|QAS", "c|0x9582"]],
    ["should load a SRM save (Japan)"             ,       "japan.srm", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a SRM save (Japan) (Rev 1)"     ,  "japan-rev1.srm", ["r|japan"    , "s|2", "c|0x958d", "i|PAS", "w|QAS", "c|0x95cd"]],
    ["should load a SRM save (Australia)"         ,   "australia.srm", ["r|australia", "s|2", "c|0x950a", "i|PAS", "w|QAS", "c|0x954a"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
