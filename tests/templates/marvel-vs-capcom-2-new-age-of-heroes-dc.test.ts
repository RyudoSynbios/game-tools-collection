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
    ["should load a filled standard save (Europe)", "filled.bin", ["r|europe", "c|0x2f7a5b30", "i|49$1", "i|20$2" , "w|50$1", "c|0x2f7b5c30"]],
    ["should load a filled standard save (Japan)" , "filled.bin", ["r|japan" , "c|0x2fc34f85", "i|31$1", "i|100$2", "w|32$1", "c|0x2fc45085"]],
    ["should load a standard save (Europe)"       , "europe.bin", [            "c|0x2f6e730c", "i|31$1", "i|10$2" , "w|32$1", "c|0x2f6f740c"]],
    ["should load a standard save (USA)"          ,    "usa.bin", [            "c|0x2fcf6977", "i|11$1", "i|100$2", "w|12$1", "c|0x2fd06a77"]],
    ["should load a standard save (Japan)"        ,  "japan.bin", [            "c|0x2f74671e", "i|16$1", "i|20$2" , "w|17$1", "c|0x2f75681e"]],
    ["should load a DCI save (Europe)"            , "europe.dci", [            "c|0x2fdf737d", "i|50$1", "i|100$2", "w|51$1", "c|0x2fe0747d"]],
    ["should load a DCI save (USA)"               ,    "usa.dci", [            "c|0x2f866136", "i|39$1", "i|10$2" , "w|40$1", "c|0x2f876236"]],
    ["should load a DCI save (Japan)"             ,  "japan.dci", [            "c|0x2fa74276", "i|00$1", "i|100$2", "w|01$1", "c|0x2fa84376"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
