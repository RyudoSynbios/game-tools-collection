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
  defaultTests(game, ["gamecube", "playstation-2"]);

  test("should not load a deleted standard PS2 save", async () => {
    await saveShouldBeRejected(`${game}/playstation-2/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    // GameCube
    ["should load a standard GC save (Europe)"        , "gamecube/europe.gci"     , [            "c|0x3ade$1", "c|0x81a8da1c10bd6a9c$2", "s|2", "i|PASS", "w|QASS", "c|0x3a86$1", "c|0xb294521400bd60c4$2"]],
    ["should load a standard GC save (USA)"           , "gamecube/usa.gci"        , [            "c|0x03ee$1", "c|0xf445268179c6d9ac$2", "s|2", "i|PASS", "w|QASS", "c|0x03d6$1", "c|0xd7ffe92729c6d294$2"]],
    ["should load a standard GC save (Japan)"         , "gamecube/japan.gci"      , [            "c|0x0a0e$1", "c|0xf7fd3ccf26eed44c$2", "s|2", "i|PASS", "w|QASS", "c|0x09f6$1", "c|0x3e17ff6096eec9b4$2"]],
    // PlayStation 2
    ["should load a filled standard PS2 save (Europe)", "playstation-2/filled.ps2", ["r|europe", "c|0x1d6e$1", "c|0x2a8c47641266dd2c$2", "s|2", "i|PASS", "w|QASS", "c|0x1d56$1", "c|0x8e0e093ac266d614$2"]],
    ["should load a filled standard PS2 save (Korea)" , "playstation-2/filled.ps2", ["r|korea" , "c|0x12b6$1", "c|0xf53d25b418a7aff4$2", "s|2", "i|PASS", "w|QASS", "c|0x127e$1", "c|0x1b71a3ec08a7a53c$2"]],
    ["should load a standard PS2 save (Europe)"       , "playstation-2/europe.ps2", [            "c|0x1656$1", "c|0xe7ec568ac55b3e14$2", "s|2", "i|PASS", "w|QASS", "c|0x161e$1", "c|0x3298ce8df55b345c$2"]],
    ["should load a standard PS2 save (USA)"          , "playstation-2/usa.ps2"   , [            "c|0x135e$1", "c|0xa8c3769e48aa461c$2", "s|2", "i|PASS", "w|QASS", "c|0x1306$1", "c|0x1c5a921178a7bc44$2"]],
    ["should load a standard PS2 save (Japan)"        , "playstation-2/japan.ps2" , [            "c|0x0aee$1", "c|0x18ca99316391f1ac$2", "s|2", "i|PASS", "w|QASS", "c|0x0ad6$1", "c|0x637c5852d391ea94$2"]],
    ["should load a standard PS2 save (Korea)"        , "playstation-2/korea.ps2" , [            "c|0x0e3e$1", "c|0x79b445a08385737c$2", "s|2", "i|PASS", "w|QASS", "c|0x0de6$1", "c|0xd448c3e3b38569a4$2"]],
    ["should load a PSV save (Europe)"                , "playstation-2/europe.psv", [            "c|0x1656$1", "c|0xe7ec568ac55b3e14$2", "s|2", "i|PASS", "w|QASS", "c|0x161e$1", "c|0x3298ce8df55b345c$2"]],
    ["should load a PSV save (USA)"                   , "playstation-2/usa.psv"   , [            "c|0x135e$1", "c|0xa8c3769e48aa461c$2", "s|2", "i|PASS", "w|QASS", "c|0x1306$1", "c|0x1c5a921178a7bc44$2"]],
    ["should load a PSV save (Japan)"                 , "playstation-2/japan.psv" , [            "c|0x0aee$1", "c|0x18ca99316391f1ac$2", "s|2", "i|PASS", "w|QASS", "c|0x0ad6$1", "c|0x637c5852d391ea94$2"]],
    ["should load a PSV save (Korea)"                 , "playstation-2/korea.psv" , [            "c|0x0e3e$1", "c|0x79b445a08385737c$2", "s|2", "i|PASS", "w|QASS", "c|0x0de6$1", "c|0xd448c3e3b38569a4$2"]],
    ["should load a PSU save (Europe)"                , "playstation-2/europe.psu", [            "c|0x1656$1", "c|0xe7ec568ac55b3e14$2", "s|2", "i|PASS", "w|QASS", "c|0x161e$1", "c|0x3298ce8df55b345c$2"]],
    ["should load a PSU save (USA)"                   , "playstation-2/usa.psu"   , [            "c|0x135e$1", "c|0xa8c3769e48aa461c$2", "s|2", "i|PASS", "w|QASS", "c|0x1306$1", "c|0x1c5a921178a7bc44$2"]],
    ["should load a PSU save (Japan)"                 , "playstation-2/japan.psu" , [            "c|0x0aee$1", "c|0x18ca99316391f1ac$2", "s|2", "i|PASS", "w|QASS", "c|0x0ad6$1", "c|0x637c5852d391ea94$2"]],
    ["should load a PSU save (Korea)"                 , "playstation-2/korea.psu" , [            "c|0x0e3e$1", "c|0x79b445a08385737c$2", "s|2", "i|PASS", "w|QASS", "c|0x0de6$1", "c|0xd448c3e3b38569a4$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
