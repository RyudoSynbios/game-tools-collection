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
  defaultTests(game, ["windows"]);

  test("should not load an uninitialized standard save", async () => {
    await saveShouldBeRejected(`${game}/windows/uninitialized.d2s`);
  });

  test("should not load a standard save with version below 1.10", async () => {
    await saveShouldBeRejected(`${game}/windows/badversion.d2s`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Windows
    ["should load a standard save (World)", "windows/world.d2s", ["c|0x52bc02bd", "s|2$1", "i|PASS$1", "i|1$2", "w|QASS$1", "c|0x52bc02be"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
