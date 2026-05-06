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
  defaultTests(game, ["nintendo-ds"]);

  test("should not load an empty standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-ds/empty.dsv`);
  });

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/nintendo-ds/deleted.dsv`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo DS
    ["should load a standard save (Europe)"            , "nintendo-ds/europe.dsv", ["c|0xab$1", "c|0x02$2", "c|0xab$3", "i|15$1", "i|56$2", "w|57$2", "c|0x97$1", "c|0x3e$2", "c|0x97$3"]],
    ["should load a standard save (USA)"               , "nintendo-ds/usa.dsv"   , ["c|0x47$1", "c|0x2a$2", "c|0x47$3", "i|15$1", "i|57$2", "w|58$2", "c|0x7b$1", "c|0x16$2", "c|0x7b$3"]],
    ["should load a standard save (Japan)"             , "nintendo-ds/japan.dsv" , ["c|0xba$1", "c|0x27$2", "c|0xba$3", "i|15$1", "i|40$2", "w|41$2", "c|0x7e$1", "c|0xe3$2", "c|0x7e$3"]],
    ["should load a Action Replay Max DS save (Europe)", "nintendo-ds/europe.duc", ["c|0xab$1", "c|0x02$2", "c|0xab$3", "i|15$1", "i|56$2", "w|57$2", "c|0x97$1", "c|0x3e$2", "c|0x97$3"]],
    ["should load a Action Replay Max DS save (USA)"   , "nintendo-ds/usa.duc"   , ["c|0x47$1", "c|0x2a$2", "c|0x47$3", "i|15$1", "i|57$2", "w|58$2", "c|0x7b$1", "c|0x16$2", "c|0x7b$3"]],
    ["should load a Action Replay Max DS save (Japan)" , "nintendo-ds/japan.duc" , ["c|0xba$1", "c|0x27$2", "c|0xba$3", "i|15$1", "i|40$2", "w|41$2", "c|0x7e$1", "c|0xe3$2", "c|0x7e$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
