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
    ["should load a standard save (Europe)" ,  "europe.sav", ["r|europe" , "c|0x5901fec5", "i|PASS"   , "w|QASS"  , "c|0x5801ffc5"]],
    ["should load a standard save (USA)"    ,     "usa.sav", ["r|usa"    , "c|0x4185f641", "i|PASS"   , "w|QASS"  , "c|0x4085f741"]],
    ["should load a standard save (Japan)"  ,   "japan.sav", ["r|japan"  , "c|0x9323595f", "i|ごうかく", "w|ざうかく", "c|0x93225960"]],
    ["should load a standard save (France)" ,  "france.sav", ["r|france" , "c|0x5aa7fd23", "i|PASS"   , "w|QASS"  , "c|0x5ba7fe23"]],
    ["should load a standard save (Germany)", "germany.sav", ["r|germany", "c|0x5fd40072", "i|PASS"   , "w|QASS"  , "c|0x5ed40172"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
