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
  defaultTests(game, ["playstation-2"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation-2/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation 2
    ["should load a filled standard save (Europe)", "playstation-2/filled.ps2", ["c|0x16", "i|54$1", "i|10$2" , "w|55$1", "c|0x17"]],
    ["should load a standard save (Europe)"       , "playstation-2/europe.ps2", ["c|0xc9", "i|21$1", "i|30$2" , "w|22$1", "c|0xca"]],
    ["should load a PSV save (Europe)"            , "playstation-2/europe.psv", ["c|0xc9", "i|21$1", "i|30$2" , "w|22$1", "c|0xca"]],
    ["should load a PSU save (Europe)"            , "playstation-2/europe.psu", ["c|0xc9", "i|21$1", "i|30$2" , "w|22$1", "c|0xca"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
