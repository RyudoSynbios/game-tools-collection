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
    ["should load a filled standard save (Europe)",     "filled.mcr", ["r|europe", "s|3", "i|PAS"]],
    ["should load a filled standard save (Japan)" ,     "filled.mcr", ["r|japan" , "s|3", "i|PAS"]],
    ["should load a standard save (Europe)"       ,     "europe.mcr", [            "s|3", "i|PAS"]],
    ["should load a standard save (USA)"          ,        "usa.mcr", [            "s|3", "i|PAS"]],
    ["should load a standard save (Japan)"        ,      "japan.mcr", [            "s|3", "i|PAS"]],
    ["should load a standard save (Japan) (Rev 1)", "japan-rev1.mcr", [            "s|3", "i|PAS"]],
    ["should load a PSV save (Europe)"            ,     "europe.psv", [            "s|3", "i|PAS"]],
    ["should load a PSV save (USA)"               ,        "usa.psv", [            "s|3", "i|PAS"]],
    ["should load a PSV save (Japan)"             ,      "japan.psv", [            "s|3", "i|PAS"]],
    ["should load a PSV save (Japan) (Rev 1)"     , "japan-rev1.psv", [            "s|3", "i|PAS"]],
    ["should load a VMP save (Europe)"            ,     "europe.vmp", [            "s|3", "i|PAS"]],
    ["should load a VMP save (USA)"               ,        "usa.vmp", [            "s|3", "i|PAS"]],
    ["should load a VMP save (Japan)"             ,      "japan.vmp", [            "s|3", "i|PAS"]],
    ["should load a VMP save (Japan) (Rev 1)"     , "japan-rev1.vmp", [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Europe)"       ,     "europe.gme", [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (USA)"          ,        "usa.gme", [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Japan)"        ,      "japan.gme", [            "s|3", "i|PAS"]],
    ["should load a DexDrive save (Japan) (Rev 1)", "japan-rev1.gme", [            "s|3", "i|PAS"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
