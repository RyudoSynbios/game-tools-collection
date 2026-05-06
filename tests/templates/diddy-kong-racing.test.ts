import test from "@playwright/test";

import {
  defaultTests,
  ejectFile,
  extractGameName,
  initPage,
  saveShouldBeRejected,
  snippet,
  type Test,
} from "../";

const game = extractGameName(import.meta.url);

test.beforeAll(async ({ browser }) => initPage(browser, `${game}/save-editor`));

test.beforeEach(async () => ejectFile());

test.describe(game, () => {
  defaultTests(game, ["nintendo-64"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/empty.eep`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-64/deleted.eep`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo 64
    ["should load a standard save (Europe)"        , "nintendo-64/europe.eep"     , ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (Europe) (Rev 1)", "nintendo-64/europe-rev1.eep", ["r|europe", 't|["General","Adventure","Records","Options"]$1', "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (USA)"           , "nintendo-64/usa.eep"        , ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (USA) (Rev 1)"   , "nintendo-64/usa-rev1.eep"   , ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 3"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a standard save (Japan)"         , "nintendo-64/japan.eep"      , ["r|japan" , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 2"]$2', "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Europe)"             , "nintendo-64/europe.srm"     , ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1","Slot 3"]$2', "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Europe) (Rev 1)"     , "nintendo-64/europe-rev1.srm", ["r|europe", 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2","Slot 3"]$2', "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (USA)"                , "nintendo-64/usa.srm"        , ["r|usa"   , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 1"]$2'         , "s|1$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (USA) (Rev 1)"        , "nintendo-64/usa-rev1.srm"   , ["r|usa"   , 't|["General","Adventure","Records","Options"]$1', "s|2$1", 't|["Slot 3"]$2'         , "s|3$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
    ["should load a SRM save (Japan)"              , "nintendo-64/japan.srm"      , ["r|japan" , 't|["General","Adventure","Options"]$1'          , "s|2$1", 't|["Slot 2"]$2'         , "s|2$2", "c|0x0053", "i|PAS", "w|QAS", "c|0x0057"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
