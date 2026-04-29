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
  defaultTests(game, ["playstation"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe, Australia)",          "filled.mcr", ["r|australia", "c|0x6c", "s|4", "i|PAS", "w|QAS", "c|0x6b"]],
    ["should load a filled standard save (USA)"              ,          "filled.mcr", ["r|usa"      , "c|0x4f", "s|4", "i|PAS", "w|QAS", "c|0x4e"]],
    ["should load a standard save (Europe, Australia)"       , "europeaustralia.mcr", [               "c|0x32", "s|4", "i|PAS", "w|QAS", "c|0x31"]],
    ["should load a standard save (Europe) (Alt)"            ,      "europe-alt.mcr", [               "c|0x51", "s|4", "i|PAS", "w|QAS", "c|0x50"]],
    ["should load a standard save (USA)"                     ,             "usa.mcr", [               "c|0x02", "s|4", "i|PAS", "w|QAS", "c|0x01"]],
    ["should load a standard save (Japan, Asia)"             ,       "japanasia.mcr", [               "c|0xab", "s|4", "i|PAS", "w|QAS", "c|0xaa"]],
    ["should load a standard save (Japan) (Rev 1)"           ,      "japan-rev1.mcr", [               "c|0xc9", "s|4", "i|PAS", "w|QAS", "c|0xc8"]],
    ["should load a PSV save (Europe, Australia)"            , "europeaustralia.psv", [               "c|0x32", "s|4", "i|PAS", "w|QAS", "c|0x31"]],
    ["should load a PSV save (Europe) (Alt)"                 ,      "europe-alt.psv", [               "c|0x51", "s|4", "i|PAS", "w|QAS", "c|0x50"]],
    ["should load a PSV save (USA)"                          ,             "usa.psv", [               "c|0x02", "s|4", "i|PAS", "w|QAS", "c|0x01"]],
    ["should load a PSV save (Japan, Asia)"                  ,       "japanasia.psv", [               "c|0xab", "s|4", "i|PAS", "w|QAS", "c|0xaa"]],
    ["should load a PSV save (Japan) (Rev 1)"                ,      "japan-rev1.psv", [               "c|0xc9", "s|4", "i|PAS", "w|QAS", "c|0xc8"]],
    ["should load a VMP save (Europe, Australia)"            , "europeaustralia.vmp", [               "c|0x32", "s|4", "i|PAS", "w|QAS", "c|0x31"]],
    ["should load a VMP save (Europe) (Alt)"                 ,      "europe-alt.vmp", [               "c|0x51", "s|4", "i|PAS", "w|QAS", "c|0x50"]],
    ["should load a VMP save (USA)"                          ,             "usa.vmp", [               "c|0x02", "s|4", "i|PAS", "w|QAS", "c|0x01"]],
    ["should load a VMP save (Japan, Asia)"                  ,       "japanasia.vmp", [               "c|0xab", "s|4", "i|PAS", "w|QAS", "c|0xaa"]],
    ["should load a VMP save (Japan) (Rev 1)"                ,      "japan-rev1.vmp", [               "c|0xc9", "s|4", "i|PAS", "w|QAS", "c|0xc8"]],
    ["should load a DexDrive save (Europe, Australia)"       , "europeaustralia.gme", [               "c|0x32", "s|4", "i|PAS", "w|QAS", "c|0x31"]],
    ["should load a DexDrive save (Europe) (Alt)"            ,      "europe-alt.gme", [               "c|0x51", "s|4", "i|PAS", "w|QAS", "c|0x50"]],
    ["should load a DexDrive save (USA)"                     ,             "usa.gme", [               "c|0x02", "s|4", "i|PAS", "w|QAS", "c|0x01"]],
    ["should load a DexDrive save (Japan, Asia)"             ,       "japanasia.gme", [               "c|0xab", "s|4", "i|PAS", "w|QAS", "c|0xaa"]],
    ["should load a DexDrive save (Japan) (Rev 1)"           ,      "japan-rev1.gme", [               "c|0xc9", "s|4", "i|PAS", "w|QAS", "c|0xc8"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
