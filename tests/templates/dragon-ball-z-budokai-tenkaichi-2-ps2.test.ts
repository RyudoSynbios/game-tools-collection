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
  defaultTests(game);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Japan)", "filled.ps2", ["r|japan" , "c|0x000000290000000f", "s|6$1", "s|50$2", "i|49", "w|50", "c|0x0000002a0000000f"]],
    ["should load a filled standard save (Korea)", "filled.ps2", ["r|korea" , "c|0x000000290000000f", "s|6$1", "s|11$2", "i|10", "w|11", "c|0x0000002a0000000f"]],
    ["should load a standard save (Europe)"      , "europe.ps2", [            "c|0x000000300000000f", "s|6$1", "s|42$2", "i|41", "w|42", "c|0x000000310000000f"]],
    ["should load a standard save (USA)"         ,    "usa.ps2", [            "c|0x0000002a0000000f", "s|6$1", "s|14$2", "i|13", "w|14", "c|0x0000002b0000000f"]],
    ["should load a standard save (Japan)"       ,  "japan.ps2", [            "c|0x000000290000000f", "s|6$1", "s|67$2", "i|66", "w|67", "c|0x0000002a0000000f"]],
    ["should load a standard save (Korea)"       ,  "korea.ps2", [            "c|0x000000290000000f", "s|6$1", "s|31$2", "i|30", "w|31", "c|0x0000002a0000000f"]],
    ["should load a PSV save (Europe)"           , "europe.psv", [            "c|0x000000300000000f", "s|6$1", "s|53$2", "i|52", "w|53", "c|0x000000310000000f"]],
    ["should load a PSV save (USA)"              ,    "usa.psv", [            "c|0x0000002a0000000f", "s|6$1", "s|62$2", "i|61", "w|62", "c|0x0000002b0000000f"]],
    ["should load a PSV save (Japan)"            ,  "japan.psv", [            "c|0x000000290000000f", "s|6$1", "s|46$2", "i|45", "w|46", "c|0x0000002a0000000f"]],
    ["should load a PSV save (Korea)"            ,  "korea.psv", [            "c|0x000000290000000f", "s|6$1", "s|22$2", "i|21", "w|22", "c|0x0000002a0000000f"]],
    ["should load a PSU save (Europe)"           , "europe.psu", [            "c|0x000000300000000f", "s|6$1", "s|19$2", "i|18", "w|19", "c|0x000000310000000f"]],
    ["should load a PSU save (USA)"              ,    "usa.psu", [            "c|0x0000002a0000000f", "s|6$1", "s|30$2", "i|29", "w|30", "c|0x0000002b0000000f"]],
    ["should load a PSU save (Japan)"            ,  "japan.psu", [            "c|0x000000290000000f", "s|6$1", "s|63$2", "i|62", "w|63", "c|0x0000002a0000000f"]],
    ["should load a PSU save (Korea)"            ,  "korea.psu", [            "c|0x000000290000000f", "s|6$1", "s|73$2", "i|72", "w|73", "c|0x0000002a0000000f"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
