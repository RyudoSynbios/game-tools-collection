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

  test("should not load a standard Level save (World)", async () => {
    await saveShouldBeRejected(`${game}/game-boy-color/world-level.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Color
    ["should load a standard World Map save (World)", "game-boy-color/world-worldmap.sav", ["c|0x257f", "i|4$1", "i|2$2", "w|3$2", "c|0x2580"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
