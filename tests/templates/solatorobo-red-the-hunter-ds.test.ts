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

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/empty.dsv`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.dsv`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard save (Europe)"            , "europe.dsv", ["c|0xab$1", "c|0x02$2", "c|0xab$3", "i|15$1", "i|56$2", "w|57$2", "c|0x97$1", "c|0x3e$2", "c|0x97$3"]],
    ["should load a standard save (USA)"               ,    "usa.dsv", ["c|0x47$1", "c|0x2a$2", "c|0x47$3", "i|15$1", "i|57$2", "w|58$2", "c|0x7b$1", "c|0x16$2", "c|0x7b$3"]],
    ["should load a standard save (Japan)"             ,  "japan.dsv", ["c|0xba$1", "c|0x27$2", "c|0xba$3", "i|15$1", "i|40$2", "w|41$2", "c|0x7e$1", "c|0xe3$2", "c|0x7e$3"]],
    ["should load a Action Replay Max DS save (Europe)", "europe.duc", ["c|0xab$1", "c|0x02$2", "c|0xab$3", "i|15$1", "i|56$2", "w|57$2", "c|0x97$1", "c|0x3e$2", "c|0x97$3"]],
    ["should load a Action Replay Max DS save (USA)"   ,    "usa.duc", ["c|0x47$1", "c|0x2a$2", "c|0x47$3", "i|15$1", "i|57$2", "w|58$2", "c|0x7b$1", "c|0x16$2", "c|0x7b$3"]],
    ["should load a Action Replay Max DS save (Japan)" ,  "japan.duc", ["c|0xba$1", "c|0x27$2", "c|0xba$3", "i|15$1", "i|40$2", "w|41$2", "c|0x7e$1", "c|0xe3$2", "c|0x7e$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
