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
    await saveShouldBeRejected(`${game}/empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard Blue Version save (Europe, USA)"    ,    "blue-europeusa.sav", ["c|0x5e$1", "i|PASS"   , "w|QASS"  , "c|0x0d$1", "s|2$1", "s|1$2", "s|1$3", "i|SQUIRTLE", "s|4$2", "s|2$3", "i|RATTATA"  , "s|8$2" , "s|2$3", "i|PIDGEY" , "s|3$1", "i|PIDGEY" ]],
    ["should load a standard Blue Version save (Japan)"          ,        "blue-japan.sav", ["c|0x6a$1", "i|ごうかく", "w|ざうかく", "c|0x19$1", "s|2$1", "s|1$2", "s|2$3", "i|コラッタ" , "s|2$2", "s|2$3", "i|ポッポ"    , "s|6$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|"       ]],
    ["should load a standard Blue Version save (France)"         ,       "blue-france.sav", ["c|0xd6$1", "i|PASS"   , "w|QASS"  , "c|0x85$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|2$2", "s|2$3", "i|ROUCOOL"  , "s|7$2" , "s|2$3", "i|ROUCOOL", "s|3$1", "i|"       ]],
    ["should load a standard Blue Version save (Germany)"        ,      "blue-germany.sav", ["c|0x50$1", "i|PASS"   , "w|QASS"  , "c|0xff$1", "s|2$1", "s|1$2", "s|2$3", "i|TAUBSI"  , "s|7$2", "s|2$3", "i|RATTFRATZ", "s|8$2" , "s|2$3", "i|TAUBSI" , "s|3$1", "i|"       ]],
    ["should load a standard Blue Version save (Italy)"          ,        "blue-italy.sav", ["c|0xdb$1", "i|PASS"   , "w|QASS"  , "c|0x8a$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|6$2", "s|2$3", "i|RATTATA"  , "s|12$2", "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Blue Version save (Spain)"          ,        "blue-spain.sav", ["c|0x93$1", "i|PASS"   , "w|QASS"  , "c|0x42$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|3$2", "s|2$3", "i|RATTATA"  , "s|11$2", "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Green Version save (Japan)"         ,       "green-japan.sav", ["c|0xdb$1", "i|ごうかく", "w|ざうかく", "c|0xda$1", "s|2$1", "s|1$2", "s|1$3", "i|ゼニガメ" , "s|3$2", "s|2$3", "i|コラッタ"  , "s|9$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|ポッポ"  ]],
    ["should load a standard Green Version save (Japan) (Rev 1)" ,  "green-japan-rev1.sav", ["c|0x08$1", "i|ごうかく", "w|ざうかく", "c|0xb7$1", "s|2$1", "s|1$2", "s|2$3", "i|ポッポ"   , "s|3$2", "s|2$3", "i|コラッタ"  , "s|8$2" , "s|2$3", "i|コラッタ", "s|3$1", "i|"       ]],
    ["should load a standard Red Version save (Europe, USA)"     ,     "red-europeusa.sav", ["c|0x7d$1", "i|PASS"   , "w|QASS"  , "c|0x2c$1", "s|2$1", "s|1$2", "s|2$3", "i|PIDGEY"  , "s|6$2", "s|2$3", "i|RATTATA"  , "s|7$2" , "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Red Version save (Japan)"           ,         "red-japan.sav", ["c|0x7f$1", "i|ごうかく", "w|ざうかく", "c|0x2e$1", "s|2$1", "s|1$2", "s|2$3", "i|コラッタ" , "s|2$2", "s|2$3", "i|コラッタ"  , "s|9$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|"       ]],
    ["should load a standard Red Version save (Japan) (Rev 1)"   ,    "red-japan-rev1.sav", ["c|0x64$1", "i|ごうかく", "w|ざうかく", "c|0x13$1", "s|2$1", "s|1$2", "s|1$3", "i|ゼニガメ" , "s|4$2", "s|2$3", "i|コラッタ"  , "s|7$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|ポッポ"  ]],
    ["should load a standard Red Version save (France)"          ,        "red-france.sav", ["c|0x4b$1", "i|PASS"   , "w|QASS"  , "c|0xfa$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|5$2", "s|2$3", "i|ROUCOOL"  , "s|8$2" , "s|2$3", "i|ROUCOOL", "s|3$1", "i|"       ]],
    ["should load a standard Red Version save (Germany)"         ,       "red-germany.sav", ["c|0x0f$1", "i|PASS"   , "w|QASS"  , "c|0xbe$1", "s|2$1", "s|1$2", "s|1$3", "i|SCHIGGY" , "s|2$2", "s|2$3", "i|TAUBSI"   , "s|13$2", "s|2$3", "i|TAUBSI" , "s|3$1", "i|TAUBSI" ]],
    ["should load a standard Red Version save (Italy)"           ,         "red-italy.sav", ["c|0x7f$1", "i|PASS"   , "w|QASS"  , "c|0x2e$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|3$2", "s|2$3", "i|PIDGEY"   , "s|10$2", "s|2$3", "i|RATTATA", "s|3$1", "i|"       ]],
    ["should load a standard Red Version save (Spain)"           ,         "red-spain.sav", ["c|0x3e$1", "i|PASS"   , "w|QASS"  , "c|0xed$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|4$2", "s|2$3", "i|PIDGEY"   , "s|9$2" , "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Europe, USA)"  ,  "yellow-europeusa.sav", ["c|0xd4$1", "i|PASS"   , "w|QASS"  , "c|0x83$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|2$2", "s|2$3", "i|PIDGEY"   , "s|10$2", "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Japan)"        ,      "yellow-japan.sav", ["c|0x1d$1", "i|ごうかく", "w|ざうかく", "c|0xcc$1", "s|2$1", "s|1$2", "s|2$3", "i|コラッタ" , "s|4$2", "s|2$3", "i|コラッタ"  , "s|7$2" , "s|2$3", "i|コラッタ" , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Japan) (Rev 1)", "yellow-japan-rev1.sav", ["c|0x41$1", "i|ごうかく", "w|ざうかく", "c|0xf0$1", "s|2$1", "s|1$2", "s|1$3", "i|ピカチュウ", "s|3$2", "s|2$3", "i|コラッタ"  , "s|9$2" , "s|2$3", "i|コラッタ", "s|3$1", "i|ポッポ"  ]],
    ["should load a standard Yellow Version save (Japan) (Rev 2)", "yellow-japan-rev2.sav", ["c|0xe5$1", "i|ごうかく", "w|ざうかく", "c|0x94$1", "s|2$1", "s|1$2", "s|2$3", "i|ポッポ"   , "s|2$2", "s|2$3", "i|ポッポ"    , "s|6$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Japan) (Rev 3)", "yellow-japan-rev3.sav", ["c|0x8a$1", "i|ごうかく", "w|ざうかく", "c|0x39$1", "s|2$1", "s|1$2", "s|1$3", "i|ピカチュウ", "s|5$2", "s|2$3", "i|コラッタ"  , "s|9$2" , "s|2$3", "i|ポッポ"  , "s|3$1", "i|コラッタ"]],
    ["should load a standard Yellow Version save (France)"       ,     "yellow-france.sav", ["c|0x68$1", "i|PASS"   , "w|QASS"  , "c|0x17$1", "s|2$1", "s|1$2", "s|1$3", "i|PIKACHU" , "s|6$2", "s|2$3", "i|RATTATA"  , "s|9$2" , "s|2$3", "i|ROUCOOL", "s|3$1", "i|ROUCOOL"]],
    ["should load a standard Yellow Version save (Germany)"      ,    "yellow-germany.sav", ["c|0x3c$1", "i|PASS"   , "w|QASS"  , "c|0xeb$1", "s|2$1", "s|1$2", "s|2$3", "i|TAUBSI"  , "s|4$2", "s|2$3", "i|RATTFRATZ", "s|12$2", "s|2$3", "i|TAUBSI" , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Italy)"        ,      "yellow-italy.sav", ["c|0x0e$1", "i|PASS"   , "w|QASS"  , "c|0xbd$1", "s|2$1", "s|1$2", "s|2$3", "i|PIDGEY"  , "s|4$2", "s|2$3", "i|PIDGEY"   , "s|11$2", "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
    ["should load a standard Yellow Version save (Spain)"        ,      "yellow-spain.sav", ["c|0x5a$1", "i|PASS"   , "w|QASS"  , "c|0x09$1", "s|2$1", "s|1$2", "s|2$3", "i|RATTATA" , "s|2$2", "s|2$3", "i|PIDGEY"   , "s|8$2" , "s|2$3", "i|PIDGEY" , "s|3$1", "i|"       ]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
