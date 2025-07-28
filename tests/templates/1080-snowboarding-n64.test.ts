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
    ["should not load a standard save with bad region", "usajapan.sra", ["r|europe", "s|4$1", "s|2$2", "n|Japanese"]],
    ["should load a standard save (Europe)"           ,   "europe.sra", ["r|europe", "s|3$1", "s|2$2", "s|1$3", "c|0x6cccfab8e9de4e9a$4", "i|PAS$1", "i|2100$2", "w|QAS$1", "c|0x6ccbfab8e9e04e9a$4"]],
    ["should load a standard save (USA, Japan)"       , "usajapan.sra", ["r|japan" , "s|3$1", "s|2$2", "s|2$3", "c|0x82d8e49ebdc67ace$4", "i|PAS$1", "i|9157$2", "w|QAS$1", "c|0x82d7e49ebdc87ace$4"]],
    ["should load a SRM save (Europe)"                ,   "europe.srm", ["r|europe", "s|3$1", "s|1$2", "s|3$3", "c|0x4de90f4927a62578$4", "i|PAS$1", "i|91$2"  , "w|QAS$1", "c|0x4de90e4927a62778$4"]],
    ["should load a SRM save (USA, Japan)"            , "usajapan.srm", ["r|usa"   , "s|3$1", "s|2$2", "s|2$3", "c|0x8adcfc96adbe4ade$4", "i|PAS$3", "i|3023$4", "w|QAS$3", "c|0x8adbfc96adc04ade$4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
