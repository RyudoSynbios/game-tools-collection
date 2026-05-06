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
  defaultTests(game, ["mega-drive"]);

  // prettier-ignore
  const tests: Test[] = [
    // Mega Drive
    ["should load an empty standard save"             , "mega-drive/empty.sav"          , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|[]$2']],
    ["should load a deleted standard save"            , "mega-drive/deleted.sav"        , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|[]$2']],
    ["should load a standard save (Europe)"           , "mega-drive/europe.sav"         , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 6"]$2', "s|6$2", "c|0xf0f9", "i|Sonic & Tails$1", "i|1$2", "w|2$2", "c|0xc3ff"]],
    ["should load a standard save (USA)"              , "mega-drive/usa.sav"            , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 4"]$2', "s|4$2", "c|0xc7fb", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x81c2"]],
    ["should load a standard save (Japan)"            , "mega-drive/japan.sav"          , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 5"]$2', "s|5$2", "c|0x4afe", "i|Sonic$1"        , "i|5$2", "w|6$2", "c|0x2fc2"]],
    ["should load a standard save (Europe) (Knuckles)", "mega-drive/europe-knuckles.sav", ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 3"]$2', "s|3$2", "c|0x8ed1", "i|Sonic$1"        , "i|0$2", "w|1$2", "c|0x1a50"]],
    ["should load a standard save (USA) (Knuckles)"   , "mega-drive/usa-knuckles.sav"   , ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 2"]$2', "s|2$2", "c|0x1fbd", "i|Knuckles$1"     , "i|0$2", "w|1$2", "c|0x1398"]],
    ["should load a standard save (Japan) (Knuckles)" , "mega-drive/japan-knuckles.sav" , ['t|["Sonic 3 & Knuckles","Competition"]$1'          , 't|["Slot 8"]$2', "s|8$2", "c|0x73f4", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x7b75"]],
    ["should load a standard save (Japan) (Both)"     , "mega-drive/both.sav"           , ['t|["Sonic 3","Sonic 3 & Knuckles","Competition"]$1', 't|["Slot 4"]$2', "s|4$2", "c|0xc7fb", "i|Tails$1"        , "i|0$2", "w|1$2", "c|0x81c2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
