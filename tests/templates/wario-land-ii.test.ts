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
  defaultTests(game, ["game-boy", "game-boy-color"]);

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy
    ["should load an empty GB standard save"                   , "game-boy/empty.sav"              , ["c|0x010c"]],
    ["should load a deleted GB standard save"                  , "game-boy/deleted.sav"            , ["c|0x010c"]],
    ["should load a standard GB save (Europe, USA)"            , "game-boy/europeusa.sav"          , ["c|0x16a7", "i|1$1", "i|23$2", "w|24$2", "c|0x16a8"]],
    // Game Boy Color
    ["should load an empty GBC standard save"                  , "game-boy-color/empty.sav"        , ["c|0x010c"]],
    ["should load a deleted GBC standard save"                 , "game-boy-color/deleted.sav"      , ["c|0x010c"]],
    ["should load a standard GBC (GB Mode) save (Europe, USA)" , "game-boy-color/gb-europeusa.sav" , ["c|0x10c2", "i|1$1", "i|23$2", "w|24$2", "c|0x10c3"]],
    ["should load a standard GBC (GBC Mode) save (Europe, USA)", "game-boy-color/gbc-europeusa.sav", ["c|0x0fb5", "i|1$1", "i|23$2", "w|24$2", "c|0x0fb6"]],
    ["should load a standard GBC (GB Mode) save (Japan)"       , "game-boy-color/gb-japan.sav"     , ["c|0x103b", "i|1$1", "i|23$2", "w|24$2", "c|0x103c"]],
    ["should load a standard GBC (GBC Mode) save (Japan)"      , "game-boy-color/gbc-japan.sav"    , ["c|0x09cc", "i|1$1", "i|23$2", "w|24$2", "c|0x09cd"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
