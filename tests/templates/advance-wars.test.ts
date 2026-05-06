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
  defaultTests(game, ["game-boy-advance"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Advance
    ["should load an empty standard save"             , "game-boy-advance/empty.sav"   , ['r|europe']],
    ["should load a deleted standard save"            , "game-boy-advance/empty.sav"   , ['r|europe']],
    ["should not load a standard save with bad region", "game-boy-advance/japan.sav"   , ["r|usa"   , "n|ゴウカク$1"]],
    ["should load a standard save (Europe)"           , "game-boy-advance/europe.sav"  , ["r|europe", "c|0x9867", "i|1$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x9768"]],
    ["should load a standard save (USA)"              , "game-boy-advance/usa.sav"     , ["r|usa"   , "c|0x9669", "i|2$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x956a"]],
    ["should load a standard save (USA) (Rev 1)"      , "game-boy-advance/usa-rev1.sav", ["r|usa"   , "c|0x936c", "i|3$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x926d"]],
    ["should load a standard save (Japan)"            , "game-boy-advance/japan.sav"   , ["r|japan" , "c|0x8976", "i|4$1", "i|ゴウカク$2", "w|ザウカク$2", "c|0x8778"]],
    ["should load a GameShark save (Europe)"          , "game-boy-advance/europe.sps"  , ["r|europe", "c|0x9867", "i|1$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x9768"]],
    ["should load a GameShark save (USA)"             , "game-boy-advance/usa.sps"     , ["r|usa"   , "c|0x9669", "i|2$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x956a"]],
    ["should load a GameShark save (USA) (Rev 1)"     , "game-boy-advance/usa-rev1.sps", ["r|usa"   , "c|0x936c", "i|3$1", "i|PASS$2"   , "w|QASS$2"  , "c|0x926d"]],
    ["should load a GameShark save (Japan)"           , "game-boy-advance/japan.sps"   , ["r|japan" , "c|0x8976", "i|4$1", "i|ゴウカク$2", "w|ザウカク$2", "c|0x8778"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
