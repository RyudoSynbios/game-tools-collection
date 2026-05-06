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
    ["should load an empty standard save"                        , "nintendo-ds/empty.dsv"                    , ["r|europe", 't|["System","Records"]']],
    ["should load a deleted standard save"                       , "nintendo-ds/deleted.dsv"                  , ["r|usa"   , 't|["System","Records"]']],
    ["should load a deleted standard save (Slot 1)"              , "nintendo-ds/deleted-slot1.dsv"            , ["r|korea" , 't|["System","Slot 1","Records"]'         , "s|2$1", "c|0x84d1$1", "c|0x11ba$2", "c|0x12f0$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x61b7$3", "c|0x2697$4"]],
    ["should load a standard save (Europe)"                      , "nintendo-ds/europe.dsv"                   , ["r|europe", 't|["System","Slot 1","Slot 3","Records"]', "s|4$1", "c|0x82d7$1", "c|0x84e9$2", "c|0xb4ea$3", "c|0xd9ac$4", "i|PASS", "w|QASS", "c|0x87a5$3", "c|0x581f$4"]],
    ["should load a standard save (USA)"                         , "nintendo-ds/usa.dsv"                      , ["r|usa"   , 't|["System","Slot 3","Records"]'         , "s|4$1", "c|0x82d7$1", "c|0x02c2$2", "c|0x2a4d$3", "c|0xdcd4$4", "i|PASS", "w|QASS", "c|0x1902$3", "c|0x5d67$4"]],
    ["should load a standard save (Japan)"                       , "nintendo-ds/japan.dsv"                    , ["r|japan" , 't|["System","Slot 2","Records"]'         , "s|3$1", "c|0x43d7$1", "c|0x5ac6$2", "c|0x18ea$3", "c|0xb848$4", "i|PASS", "w|QASS", "c|0xc30c$3", "c|0x39fb$4"]],
    ["should load a standard save (Korea)"                       , "nintendo-ds/korea.dsv"                    , ["r|korea" , 't|["System","Slot 1","Slot 2","Records"]', "s|2$1", "c|0x84d1$1", "c|0xe8c8$2", "c|0x4cc9$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x3f8e$3", "c|0x2697$4"]],
    ["should load a Action Replay Max DS save (Europe)"          , "nintendo-ds/europe.duc"                   , ["r|europe", 't|["System","Slot 1","Slot 3","Records"]', "s|4$1", "c|0x82d7$1", "c|0x84e9$2", "c|0xb4ea$3", "c|0xd9ac$4", "i|PASS", "w|QASS", "c|0x87a5$3", "c|0x581f$4"]],
    ["should load a Action Replay Max DS save (USA)"             , "nintendo-ds/usa.duc"                      , ["r|usa"   , 't|["System","Slot 3","Records"]'         , "s|4$1", "c|0x82d7$1", "c|0x02c2$2", "c|0x2a4d$3", "c|0xdcd4$4", "i|PASS", "w|QASS", "c|0x1902$3", "c|0x5d67$4"]],
    ["should load a Action Replay Max DS save (Japan)"           , "nintendo-ds/japan.duc"                    , ["r|japan" , 't|["System","Slot 2","Records"]'         , "s|3$1", "c|0x43d7$1", "c|0x5ac6$2", "c|0x18ea$3", "c|0xb848$4", "i|PASS", "w|QASS", "c|0xc30c$3", "c|0x39fb$4"]],
    ["should load a Action Replay Max DS save (Korea)"           , "nintendo-ds/korea.duc"                    , ["r|korea" , 't|["System","Slot 1","Slot 2","Records"]', "s|2$1", "c|0x84d1$1", "c|0xe8c8$2", "c|0x4cc9$3", "c|0xa724$4", "i|PASS", "w|QASS", "c|0x3f8e$3", "c|0x2697$4"]],
    // Castlevania Dominus Collection
    ["should load a filled Castlevania Dominus Collection save"  , "castlevania-dominus-collection/filled.bin", ["r|korea" , 't|["System","Slot 1","Records"]'         , "s|2$1", "c|0x0000$1", "c|0x0000$2", "c|0x0000$3", "c|0x0000$4", "i|PASS", "w|QASS", "c|0x0000$3", "c|0x0000$4"]],
    ["should load a Castlevania Dominus Collection save (Europe)", "castlevania-dominus-collection/europe.bin", [            't|["System","Slot 2","Records"]'         , "s|3$1", "c|0x0000$1", "c|0x0000$2", "c|0x0000$3", "c|0x0000$4", "i|PASS", "w|QASS", "c|0x0000$3", "c|0x0000$4"]],
    ["should load a Castlevania Dominus Collection save (USA)"   , "castlevania-dominus-collection/usa.bin"   , [            't|["System","Slot 3","Records"]'         , "s|4$1", "c|0x0000$1", "c|0x0000$2", "c|0x0000$3", "c|0x0000$4", "i|PASS", "w|QASS", "c|0x0000$3", "c|0x0000$4"]],
    ["should load a Castlevania Dominus Collection save (Japan)" , "castlevania-dominus-collection/japan.bin" , [            't|["System","Slot 1","Records"]'         , "s|2$1", "c|0x0000$1", "c|0x0000$2", "c|0x0000$3", "c|0x0000$4", "i|PASS", "w|QASS", "c|0x0000$3", "c|0x0000$4"]],
    ["should load a Castlevania Dominus Collection save (Korea)" , "castlevania-dominus-collection/korea.bin" , [            't|["System","Slot 1","Records"]'         , "s|2$1", "c|0x0000$1", "c|0x0000$2", "c|0x0000$3", "c|0x0000$4", "i|PASS", "w|QASS", "c|0x0000$3", "c|0x0000$4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
