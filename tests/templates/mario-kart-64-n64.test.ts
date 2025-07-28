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
    ["should load a standard save (Europe)"        ,      "europe.eep", ["s|2", "c|0xce", "i|33$1", "i|180$2", "w|190$2", "c|0xcf"]],
    ["should load a standard save (Europe) (Rev 1)", "europe-rev1.eep", ["s|2", "c|0xd7", "i|35$1", "i|590$2", "w|600$2", "c|0xd8"]],
    ["should load a standard save (USA)"           ,         "usa.eep", ["s|2", "c|0x3e", "i|13$1", "i|750$2", "w|760$2", "c|0x3f"]],
    ["should load a standard save (Japan)"         ,       "japan.eep", ["s|2", "c|0xca", "i|15$1", "i|580$2", "w|590$2", "c|0xcb"]],
    ["should load a standard save (Japan) (Rev 1)" ,  "japan-rev1.eep", ["s|2", "c|0x9c", "i|14$1", "i|060$2", "w|070$2", "c|0x9d"]],
    ["should load a SRM save (Europe)"             ,      "europe.srm", ["s|2", "c|0x3c", "i|11$1", "i|910$2", "w|920$2", "c|0x3d"]],
    ["should load a SRM save (Europe) (Rev 1)"     , "europe-rev1.srm", ["s|2", "c|0x8a", "i|54$1", "i|400$2", "w|410$2", "c|0x8b"]],
    ["should load a SRM save (USA)"                ,         "usa.srm", ["s|2", "c|0xda", "i|06$1", "i|990$2", "w|980$2", "c|0xd9"]],
    ["should load a SRM save (Japan)"              ,       "japan.srm", ["s|2", "c|0x2b", "i|05$1", "i|950$2", "w|960$2", "c|0x2c"]],
    ["should load a SRM save (Japan) (Rev 1)"      ,  "japan-rev1.srm", ["s|2", "c|0xec", "i|02$1", "i|360$2", "w|370$2", "c|0xed"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
