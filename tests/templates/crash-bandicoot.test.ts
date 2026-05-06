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
  defaultTests(game, ["playstation"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation/deleted.mcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (Europe, Australia)", "playstation/filled.mcr"         , ["r|australia", 't|["Slot 1"]'         , "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a filled standard save (Japan)"            , "playstation/filled.mcr"         , ["r|japan"    , 't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a deleted standard save (Slot 1)"          , "playstation/deleted-slot1.mcr"  , [               't|["Slot 1"]'         , "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a standard save (Europe, Australia)"       , "playstation/europeaustralia.mcr", [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a standard save (USA)"                     , "playstation/usa.mcr"            , [               't|["Slot 1","Slot 2"]', "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a standard save (Japan)"                   , "playstation/japan.mcr"          , [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a PSV save (Europe, Australia)"            , "playstation/europeaustralia.psv", [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a PSV save (USA)"                          , "playstation/usa.psv"            , [               't|["Slot 1"]', "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a PSV save (Japan)"                        , "playstation/japan.psv"          , [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a VMP save (Europe, Australia)"            , "playstation/europeaustralia.vmp", [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a VMP save (USA)"                          , "playstation/usa.vmp"            , [               't|["Slot 1","Slot 2"]', "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a VMP save (Japan)"                        , "playstation/japan.vmp"          , [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a DexDrive save (Europe, Australia)"       , "playstation/europeaustralia.gme", [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
    ["should load a DexDrive save (USA)"                     , "playstation/usa.gme"            , [               't|["Slot 1","Slot 2"]', "s|2$1", "c|0x115466eb", "i|2", "w|3", "c|0x116466eb"]],
    ["should load a DexDrive save (Japan)"                   , "playstation/japan.gme"          , [               't|["Slot 1"]'         , "s|2$1", "c|0x1144870a", "i|1", "w|2", "c|0x1154870a"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
