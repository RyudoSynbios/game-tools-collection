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
  defaultTests(game, ["game-boy-color"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"             ,  "empty.sav", ["r|europe", 't|[]']],
    ["should not load a standard save with bad region",  "japan.sav", ["r|europe", 't|["Slot 1","Slot 2"]', "n|PASS"]],
    ["should load a standard save (Europe)"           , "europe.sav", ["r|europe", 't|["Slot 1","Slot 2"]', "s|1$1", "c|0xffa3$1", "c|0x6090$2", "i|92" , "w|93" , "s|2$2", "i|PASS", "w|QASS", "c|0xffa2$1", "c|0x608e$2"]],
    ["should load a standard save (USA)"              ,    "usa.sav", ["r|usa"   , 't|["Slot 2"]'         , "s|2$1", "c|0xff3d$1", "c|0x6068$2", "i|194", "w|195", "s|2$2", "i|PASS", "w|QASS", "c|0xff3c$1", "c|0x6066$2"]],
    ["should load a standard save (Japan)"            ,  "japan.sav", ["r|japan" , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0xffde$1", "c|0x60b9$2", "i|33" , "w|34" , "s|2$2", "i|PASS", "w|QASS", "c|0xffdd$1", "c|0x60b7$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
