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
    ["should load a filled standard save (Europe)", "filled.ps2", ["r|europe", 't|["Slot 1","Slot 2"]', "s|1", "c|0xc23c", "i|PASS"           , "w|QASS"           , "c|0xc23d"]],
    ["should load a filled standard save (USA)"   , "filled.ps2", ["r|usa"   , 't|["Slot 5","Slot 6"]', "s|6", "c|0xb781", "i|PASS"           , "w|QASS"           , "c|0xb782"]],
    ["should load a standard save (Europe)"       , "europe.ps2", [            't|["Slot 1","Slot 9"]', "s|9", "c|0xc1fd", "i|PASS"           , "w|QASS"           , "c|0xc1fe"]],
    ["should load a standard save (USA)"          ,    "usa.ps2", [            't|["Slot 4","Slot 8"]', "s|8", "c|0xb723", "i|PASS"           , "w|QASS"           , "c|0xb724"]],
    ["should load a standard save (Japan)"        ,  "japan.ps2", [            't|["Slot 2","Slot 5"]', "s|5", "c|0xdfe1", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xdfe2"]],
    ["should load a PSV save (Europe)"            , "europe.psv", [            't|["Slot 1","Slot 9"]', "s|9", "c|0xc1fd", "i|PASS"           , "w|QASS"           , "c|0xc1fe"]],
    ["should load a PSV save (USA)"               ,    "usa.psv", [            't|["Slot 4","Slot 8"]', "s|8", "c|0xb723", "i|PASS"           , "w|QASS"           , "c|0xb724"]],
    ["should load a PSV save (Japan)"             ,  "japan.psv", [            't|["Slot 2","Slot 5"]', "s|5", "c|0xdfe1", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xdfe2"]],
    ["should load a PSU save (Europe)"            , "europe.psu", [            't|["Slot 1","Slot 9"]', "s|9", "c|0xc1fd", "i|PASS"           , "w|QASS"           , "c|0xc1fe"]],
    ["should load a PSU save (USA)"               ,    "usa.psu", [            't|["Slot 4","Slot 8"]', "s|8", "c|0xb723", "i|PASS"           , "w|QASS"           , "c|0xb724"]],
    ["should load a PSU save (Japan)"             ,  "japan.psu", [            't|["Slot 2","Slot 5"]', "s|5", "c|0xdfe1", "i|ＰＡＳＳ　．．．．", "w|ＱＡＳＳ　．．．．", "c|0xdfe2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
