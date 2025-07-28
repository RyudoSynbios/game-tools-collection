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
    ["should load a standard save (Europe)", "europe.gci", ["c|0x3f24cd9788ab9153$1", "c|0x01f610a1b675a510$2", "i|5", "w|6", "c|0x3f24cda188ab9153$1", "c|0x01f610a1b675a510$2"]],
    ["should load a standard save (USA)"   ,    "usa.gci", ["c|0xff248d9888ab5153$1", "c|0xc1f610a07675e410$2", "i|5", "w|6", "c|0xff248da288ab5153$1", "c|0xc1f610a07675e410$2"]],
    ["should load a standard save (Japan)" ,  "japan.gci", ["c|0xff22849888aa4c53$1", "c|0xc1f50ba07674de2f$2", "i|5", "w|6", "c|0xff2284a288aa4c53$1", "c|0xc1f50ba07674de2f$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
