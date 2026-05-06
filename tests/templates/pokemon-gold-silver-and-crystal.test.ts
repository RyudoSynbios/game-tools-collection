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

  // prettier-ignore
  const tests: Test[] = [
    // Game Boy Color
    ["should load a standard Gold Version save (Europe, USA)"           , "game-boy-color/gold-europeusa.sav"        , ["c|0xc408$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc409$1", "s|2", "i|CYNDAQUIL" ]],
    ["should load a standard Gold Version save (Japan)"                 , "game-boy-color/gold-japan.sav"            , ["c|0xaa99$1", "i|ごうかく$1", "w|ざうかく$1", "i|3000$2", "c|0xaa9a$1", "s|2", "i|ヒノアラシ" ]],
    ["should load a standard Gold Version save (Japan) (Rev 1)"         , "game-boy-color/gold-japan-rev1.sav"       , ["c|0xaa28$1", "i|ごうかく$1", "w|ざうかく$1", "i|3000$2", "c|0xaa29$1", "s|2", "i|チコリータ" ]],
    ["should load a standard Gold Version save (France)"                , "game-boy-color/gold-france.sav"           , ["c|0xd516$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd517$1", "s|2", "i|KAIMINUS"  ]],
    ["should load a standard Gold Version save (Germany)"               , "game-boy-color/gold-germany.sav"          , ["c|0xc746$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc747$1", "s|2", "i|KARNIMANI" ]],
    ["should load a standard Gold Version save (Italy)"                 , "game-boy-color/gold-italy.sav"            , ["c|0xc795$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc796$1", "s|2", "i|CHIKORITA" ]],
    ["should load a standard Gold Version save (Spain)"                 , "game-boy-color/gold-spain.sav"            , ["c|0xd2be$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd2bf$1", "s|2", "i|CYNDAQUIL" ]],
    ["should load a standard Silver Version save (Europe, USA)"         , "game-boy-color/silver-europeusa.sav"      , ["c|0xc4a9$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc4aa$1", "s|2", "i|TOTODILE"  ]],
    ["should load a standard Silver Version save (Japan)"               , "game-boy-color/silver-japan.sav"          , ["c|0xab88$1", "i|ごうかく$1", "w|ざうかく$1", "i|3000$2", "c|0xab89$1", "s|2", "i|ワニノコ"   ]],
    ["should load a standard Silver Version save (Japan) (Rev 1)"       , "game-boy-color/silver-japan-rev1.sav"     , ["c|0xacab$1", "i|ごうかく$1", "w|ざうかく$1", "i|3000$2", "c|0xacac$1", "s|2", "i|ヒノアラシ" ]],
    ["should load a standard Silver Version save (France)"              , "game-boy-color/silver-france.sav"         , ["c|0xd4b3$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd4b4$1", "s|2", "i|HERICENDRE"]],
    ["should load a standard Silver Version save (Germany)"             , "game-boy-color/silver-germany.sav"        , ["c|0xc505$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc506$1", "s|2", "i|KARNIMANI" ]],
    ["should load a standard Silver Version save (Italy)"               , "game-boy-color/silver-italy.sav"          , ["c|0xc67e$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xc67f$1", "s|2", "i|TOTODILE"  ]],
    ["should load a standard Silver Version save (Spain)"               , "game-boy-color/silver-spain.sav"          , ["c|0xd53d$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd53e$1", "s|2", "i|CHIKORITA" ]],
    ["should load a standard Crystal Version save (Europe, USA) (Rev 1)", "game-boy-color/crystal-europeusa-rev1.sav", ["c|0xcbac$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xcbad$1", "s|2", "i|CYNDAQUIL" ]],
    ["should load a standard Crystal Version save (USA)"                , "game-boy-color/crystal-usa.sav"           , ["c|0xcd26$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xcd27$1", "s|2", "i|TOTODILE"  ]],
    ["should load a standard Crystal Version save (Japan)"              , "game-boy-color/crystal-japan.sav"         , ["c|0xae48$1", "i|ごうかく$1", "w|ざうかく$1", "i|3000$2", "c|0xae49$1", "s|2", "i|ワニノコ"   ]],
    ["should load a standard Crystal Version save (France)"             , "game-boy-color/crystal-france.sav"        , ["c|0xd8f3$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd8f4$1", "s|2", "i|GERMIGNON" ]],
    ["should load a standard Crystal Version save (Germany)"            , "game-boy-color/crystal-germany.sav"       , ["c|0xce02$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xce03$1", "s|2", "i|KARNIMANI" ]],
    ["should load a standard Crystal Version save (Italy)"              , "game-boy-color/crystal-italy.sav"         , ["c|0xca0d$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xca0e$1", "s|2", "i|CYNDAQUIL" ]],
    ["should load a standard Crystal Version save (Spain)"              , "game-boy-color/crystal-spain.sav"         , ["c|0xd810$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xd811$1", "s|2", "i|CHIKORITA" ]],
    ["should load a standard Crystal Version save (Australia)"          , "game-boy-color/crystal-australia.sav"     , ["c|0xcb3b$1", "i|PASS$1"   , "w|QASS$1"  , "i|3000$2", "c|0xcb3c$1", "s|2", "i|CHIKORITA" ]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
