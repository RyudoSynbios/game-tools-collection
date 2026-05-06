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
  defaultTests(game, ["nintendo-ds"]);

  // prettier-ignore
  const tests: Test[] = [
    // Nintendo DS
    ["should load an empty standard save"                        , "nintendo-ds/empty.dsv"                    , ["r|europe", 't|["System","Sound Config"]']],
    ["should load a deleted standard save"                       , "nintendo-ds/deleted.dsv"                  , ["r|europe", 't|["System","Sound Config"]']],
    ["should load a deleted standard save (Slot 1)"              , "nintendo-ds/deleted-slot1.dsv"            , ["r|europe", 't|["System","Slot 1","Sound Config"]', "s|2$1", "c|0xa4ea$1", "c|0x7dc7$2", "i|202", "w|203", "c|0x6247$1", "c|0xd1c6$2"]],
    ["should load a standard save (Europe)"                      , "nintendo-ds/europe.dsv"                   , ["r|europe", 't|["System","Slot 2","Sound Config"]', "s|3$1", "c|0xae13$1", "c|0xb198$2", "i|202", "w|203", "c|0x73d2$1", "c|0x1d99$2"]],
    ["should load a standard save (USA)"                         , "nintendo-ds/usa.dsv"                      , ["r|usa"   , 't|["System","Slot 3","Sound Config"]', "s|4$1", "c|0x76c5$1", "c|0xdf01$2", "i|50" , "w|51" , "c|0xdac4$1", "c|0x7300$2"]],
    ["should load a standard save (Japan)"                       , "nintendo-ds/japan.dsv"                    , ["r|japan" , 't|["System","Slot 1","Sound Config"]', "s|2$1", "c|0x7d93$1", "c|0xa439$2", "i|160", "w|161", "c|0xbb3e$1", "c|0x0838$2"]],
    ["should load a Action Replay Max DS save (Europe)"          , "nintendo-ds/europe.duc"                   , ["r|europe", 't|["System","Slot 3","Sound Config"]', "s|4$1", "c|0xdd14$1", "c|0x0bdb$2", "i|150", "w|151", "c|0x7115$1", "c|0xa7da$2"]],
    ["should load a Action Replay Max DS save (USA)"             , "nintendo-ds/usa.duc"                      , ["r|usa"   , 't|["System","Slot 2","Sound Config"]', "s|3$1", "c|0x9db1$1", "c|0xfc6c$2", "i|50" , "w|51" , "c|0x4070$1", "c|0x506d$2"]],
    ["should load a Action Replay Max DS save (Japan)"           , "nintendo-ds/japan.duc"                    , ["r|japan" , 't|["System","Slot 2","Sound Config"]', "s|3$1", "c|0x554f$1", "c|0x2122$2", "i|100", "w|101", "c|0x888e$1", "c|0x8d23$2"]],
    // Castlevania Dominus Collection
    ["should load a filled Castlevania Dominus Collection save"  , "castlevania-dominus-collection/filled.bin", ["r|europe", 't|["System","Slot 3","Sound Config"]', "s|4$1", "c|0x0000$1", "c|0x0000$2", "i|1"  , "w|2"  , "c|0x0000$1", "c|0x0000$2"]],
    ["should load a Castlevania Dominus Collection save (Europe)", "castlevania-dominus-collection/europe.bin", [            't|["System","Slot 3","Sound Config"]', "s|4$1", "c|0x0000$1", "c|0x0000$2", "i|1"  , "w|2"  , "c|0x0000$1", "c|0x0000$2"]],
    ["should load a Castlevania Dominus Collection save (USA)"   , "castlevania-dominus-collection/usa.bin"   , [            't|["System","Slot 2","Sound Config"]', "s|3$1", "c|0x0000$1", "c|0x0000$2", "i|0"  , "w|1"  , "c|0x0000$1", "c|0x0000$2"]],
    ["should load a Castlevania Dominus Collection save (Japan)" , "castlevania-dominus-collection/japan.bin" , [            't|["System","Slot 1","Sound Config"]', "s|2$1", "c|0x0000$1", "c|0x0000$2", "i|0"  , "w|1"  , "c|0x0000$1", "c|0x0000$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
