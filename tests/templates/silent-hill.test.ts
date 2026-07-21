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
  defaultTests(game, ["playstation"]);

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/playstation/deleted.mcr`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // PlayStation
    ["should load a filled standard save (USA)"    , "playstation/filled.mcr"       , ["r|usa"  , "s|2$2", "c|0x8a8a$1", "c|0xebeb$2"              , "c|0x8484$3", "i|3", "w|4", "s|13$1", "c|0x7f7f$3", "i|160", "w|162", "s|3$2", "i|13$1", "i|13$2", "w|14$1", "i|14$2", "c|0x7e7e$3", "s|1$1", "c|0x8a8a$1", "c|0xe8e8$2"              , "c|0x8383$3"]],
    ["should load a filled standard save (Japan)"  , "playstation/filled.mcr"       , ["r|japan", "s|2$2", "c|0x8787$1"                            , "c|0x1414$2", "i|3", "w|4", "s|6$1" , "c|0x4949$2", "i|160", "w|162", "s|3$2", "i|10$1", "i|10$2", "w|11$1", "i|11$2", "c|0x4a4a$2", "s|1$1", "c|0x8686$1"                            , "c|0x1313$2"]],
    ["should load a deleted standard save (Slot 2)", "playstation/deleted-slot2.mcr", [           "s|2$2", "c|0x4747$1"                            , "c|0x8484$2", "i|3", "w|4", "s|3$1" , "c|0x3c3c$2", "i|160", "w|162", "s|3$2", "i|14$1", "i|14$2", "w|15$1", "i|15$2", "c|0x3f3f$2", "s|1$1", "c|0x4646$1"                            , "c|0x8383$2"]],
    ["should load a standard save (Europe)"        , "playstation/europe.mcr"       , [           "s|2$2", "c|0x5555$1"                            , "c|0x8585$2", "i|3", "w|4", "s|2$1" , "c|0xc3c3$2", "i|160", "w|162", "s|3$2", "i|2$1" , "i|2$2" , "w|3$1" , "i|3$2" , "c|0xc0c0$2", "s|1$1", "c|0x5454$1"                            , "c|0x8282$2"]],
    ["should load a standard save (USA)"           , "playstation/usa.mcr"          , [           "s|2$2", "c|0x8585$1", "c|0x4747$2"              , "c|0x8484$3", "i|3", "w|4", "s|14$1", "c|0x3c3c$3", "i|160", "w|162", "s|3$2", "i|14$1", "i|14$2", "w|15$1", "i|15$2", "c|0x3f3f$3", "s|1$1", "c|0x8585$1", "c|0x4646$2"              , "c|0x8383$3"]],
    ["should load a standard save (Japan)"         , "playstation/japan.mcr"        , [           "s|2$2", "c|0x8888$1", "c|0x8888$2", "c|0xe2e2$3", "c|0x1414$4", "i|3", "w|4", "s|26$1", "c|0xe4e4$4", "i|160", "w|162", "s|3$2", "i|26$1", "i|26$2", "w|27$1", "i|27$2", "c|0xe7e7$4", "s|1$1", "c|0x8888$1", "c|0x8888$2", "c|0xe3e3$3", "c|0x1313$4"]],
    ["should load a standard save (Japan) (Rev 1)" , "playstation/japan-rev1.mcr"   , [           "s|2$2", "c|0x6e6e$1"                            , "c|0x1414$2", "i|3", "w|4", "s|3$1" , "c|0xa0a0$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0xa3a3$2", "s|1$1", "c|0x6f6f$1"                            , "c|0x1313$2"]],
    ["should load a standard save (Japan) (Rev 2)" , "playstation/japan-rev2.mcr"   , [           "s|2$2", "c|0xfdfd$1"                            , "c|0x1414$2", "i|3", "w|4", "s|2$1" , "c|0x1717$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0x1414$2", "s|1$1", "c|0xfcfc$1"                            , "c|0x1313$2"]],
    ["should load a PSV save (Europe)"             , "playstation/europe.psv"       , [           "s|2$2", "c|0x5555$1"                            , "c|0x8585$2", "i|3", "w|4", "s|2$1" , "c|0xc3c3$2", "i|160", "w|162", "s|3$2", "i|2$1" , "i|2$2" , "w|3$1" , "i|3$2" , "c|0xc0c0$2", "s|1$1", "c|0x5454$1"                            , "c|0x8282$2"]],
    ["should load a PSV save (USA)"                , "playstation/usa.psv"          , [           "s|2$2", "c|0x4747$1"                            , "c|0x8484$2", "i|3", "w|4", "s|3$1" , "c|0x3c3c$2", "i|160", "w|162", "s|3$2", "i|14$1", "i|14$2", "w|15$1", "i|15$2", "c|0x3f3f$2", "s|1$1", "c|0x4646$1"                            , "c|0x8383$2"]],
    ["should load a PSV save (Japan)"              , "playstation/japan.psv"        , [           "s|2$2", "c|0xe2e2$1"                            , "c|0x1414$2", "i|3", "w|4", "s|4$1" , "c|0xe4e4$2", "i|160", "w|162", "s|3$2", "i|26$1", "i|26$2", "w|27$1", "i|27$2", "c|0xe7e7$2", "s|1$1", "c|0xe3e3$1"                            , "c|0x1313$2"]],
    ["should load a PSV save (Japan) (Rev 1)"      , "playstation/japan-rev1.psv"   , [           "s|2$2", "c|0x6e6e$1"                            , "c|0x1414$2", "i|3", "w|4", "s|3$1" , "c|0xa0a0$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0xa3a3$2", "s|1$1", "c|0x6f6f$1"                            , "c|0x1313$2"]],
    ["should load a PSV save (Japan) (Rev 2)"      , "playstation/japan-rev2.psv"   , [           "s|2$2", "c|0xfdfd$1"                            , "c|0x1414$2", "i|3", "w|4", "s|2$1" , "c|0x1717$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0x1414$2", "s|1$1", "c|0xfcfc$1"                            , "c|0x1313$2"]],
    ["should load a VMP save (Europe)"             , "playstation/europe.vmp"       , [           "s|2$2", "c|0x5555$1"                            , "c|0x8585$2", "i|3", "w|4", "s|2$1" , "c|0xc3c3$2", "i|160", "w|162", "s|3$2", "i|2$1" , "i|2$2" , "w|3$1" , "i|3$2" , "c|0xc0c0$2", "s|1$1", "c|0x5454$1"                            , "c|0x8282$2"]],
    ["should load a VMP save (USA)"                , "playstation/usa.vmp"          , [           "s|2$2", "c|0x8585$1", "c|0x4747$2"              , "c|0x8484$3", "i|3", "w|4", "s|14$1", "c|0x3c3c$3", "i|160", "w|162", "s|3$2", "i|14$1", "i|14$2", "w|15$1", "i|15$2", "c|0x3f3f$3", "s|1$1", "c|0x8585$1", "c|0x4646$2"              , "c|0x8383$3"]],
    ["should load a VMP save (Japan)"              , "playstation/japan.vmp"        , [           "s|2$2", "c|0x8888$1", "c|0x8888$2", "c|0xe2e2$3", "c|0x1414$4", "i|3", "w|4", "s|26$1", "c|0xe4e4$4", "i|160", "w|162", "s|3$2", "i|26$1", "i|26$2", "w|27$1", "i|27$2", "c|0xe7e7$4", "s|1$1", "c|0x8888$1", "c|0x8888$2", "c|0xe3e3$3", "c|0x1313$4"]],
    ["should load a VMP save (Japan) (Rev 1)"      , "playstation/japan-rev1.vmp"   , [           "s|2$2", "c|0x6e6e$1"                            , "c|0x1414$2", "i|3", "w|4", "s|3$1" , "c|0xa0a0$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0xa3a3$2", "s|1$1", "c|0x6f6f$1"                            , "c|0x1313$2"]],
    ["should load a VMP save (Japan) (Rev 2)"      , "playstation/japan-rev2.vmp"   , [           "s|2$2", "c|0xfdfd$1"                            , "c|0x1414$2", "i|3", "w|4", "s|2$1" , "c|0x1717$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0x1414$2", "s|1$1", "c|0xfcfc$1"                            , "c|0x1313$2"]],
    ["should load a DexDrive save (Europe)"        , "playstation/europe.gme"       , [           "s|2$2", "c|0x5555$1"                            , "c|0x8585$2", "i|3", "w|4", "s|2$1" , "c|0xc3c3$2", "i|160", "w|162", "s|3$2", "i|2$1" , "i|2$2" , "w|3$1" , "i|3$2" , "c|0xc0c0$2", "s|1$1", "c|0x5454$1"                            , "c|0x8282$2"]],
    ["should load a DexDrive save (USA)"           , "playstation/usa.gme"          , [           "s|2$2", "c|0x8585$1", "c|0x4747$2"              , "c|0x8484$3", "i|3", "w|4", "s|14$1", "c|0x3c3c$3", "i|160", "w|162", "s|3$2", "i|14$1", "i|14$2", "w|15$1", "i|15$2", "c|0x3f3f$3", "s|1$1", "c|0x8585$1", "c|0x4646$2"              , "c|0x8383$3"]],
    ["should load a DexDrive save (Japan)"         , "playstation/japan.gme"        , [           "s|2$2", "c|0x8888$1", "c|0x8888$2", "c|0xe2e2$3", "c|0x1414$4", "i|3", "w|4", "s|26$1", "c|0xe4e4$4", "i|160", "w|162", "s|3$2", "i|26$1", "i|26$2", "w|27$1", "i|27$2", "c|0xe7e7$4", "s|1$1", "c|0x8888$1", "c|0x8888$2", "c|0xe3e3$3", "c|0x1313$4"]],
    ["should load a DexDrive save (Japan) (Rev 1)" , "playstation/japan-rev1.gme"   , [           "s|2$2", "c|0x6e6e$1"                            , "c|0x1414$2", "i|3", "w|4", "s|3$1" , "c|0xa0a0$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0xa3a3$2", "s|1$1", "c|0x6f6f$1"                            , "c|0x1313$2"]],
    ["should load a DexDrive save (Japan) (Rev 2)" , "playstation/japan-rev2.gme"   , [           "s|2$2", "c|0xfdfd$1"                            , "c|0x1414$2", "i|3", "w|4", "s|2$1" , "c|0x1717$2", "i|160", "w|162", "s|3$2", "i|4$1" , "i|4$2" , "w|5$1" , "i|5$2" , "c|0x1414$2", "s|1$1", "c|0xfcfc$1"                            , "c|0x1313$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
