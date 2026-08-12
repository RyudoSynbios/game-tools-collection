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
  defaultTests(game, ["game-boy-color"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-color/empty.sav`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/game-boy-color/deleted.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Color
    ["should load a standard save (Japan)", "game-boy-color/japan.sav", ["c|0x98f8", "i|YOU$1", "i|0$2", "w|150$2", "c|0x0e8e"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
