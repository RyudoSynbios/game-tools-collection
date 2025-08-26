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
    ["should load a standard Slot save (World)"    , "ookrbATYovG3tEOXIH4HqWnsv8TrUlRWzM8AlCmW2mk=", ['t|["General","Party","Items"]', "i|09$1", "i|00$2"]],
    ["should load a standard Bestiary save (World)", "dp3fS2vqP7GDj8eF72YKqbT7FIAF=e7Shy2CsTITm2E=", ['t|["Bestiary"]', "s|4", "i|3$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
