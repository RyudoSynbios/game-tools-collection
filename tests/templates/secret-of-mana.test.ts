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
  defaultTests(game, ["super-nintendo"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard save (USA)"                  ,              "usa.sav", ["r|usa"      , 't|["Slot 2","Slot 3"]', "s|3$1", "s|2$2", "c|0x6031", "i|PASS", "w|QASS", "c|0x6032"]],
    ["should load a standard save (Japan)"                ,            "japan.sav", ["r|japan"    , 't|["Slot 3","Slot 4"]', "s|3$1", "s|2$2", "c|0x6075", "i|PASS", "w|QASS", "c|0x6076"]],
    ["should load a standard save (France)"               ,           "france.sav", ["r|france"   , 't|["Slot 1","Slot 4"]', "s|1$1", "s|2$2", "c|0x63cf", "i|PASS", "w|QASS", "c|0x63d0"]],
    ["should load a standard save (France) (Rev 1)"       ,      "france-rev1.sav", ["r|france"   , 't|["Slot 1","Slot 4"]', "s|4$1", "s|2$2", "c|0x63f2", "i|PASS", "w|QASS", "c|0x63f3"]],
    ["should load a standard save (Germany)"              ,          "germany.sav", ["r|germany"  , 't|["Slot 2","Slot 3"]', "s|2$1", "s|2$2", "c|0x641d", "i|PASS", "w|QASS", "c|0x641e"]],
    ["should load a standard save (UK)"                   ,               "uk.sav", ["r|uk"       , 't|["Slot 1","Slot 3"]', "s|1$1", "s|2$2", "c|0x66dc", "i|PASS", "w|QASS", "c|0x66dd"]],
    ["should load a standard save (UK, Australia) (Rev 1)", "ukaustralia-rev1.sav", ["r|australia", 't|["Slot 1","Slot 2"]', "s|2$1", "s|2$2", "c|0x5fed", "i|PASS", "w|QASS", "c|0x5fee"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
