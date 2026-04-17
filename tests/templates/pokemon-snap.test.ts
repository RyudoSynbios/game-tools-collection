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
  defaultTests(game, ["nintendo-64"]);

  // prettier-ignore
  const tests: Test[] = [
    ["should not load a standard save with bad region",      "japan.fla", ["r|europe"   , "n|PASS"]],
    ["should load a standard save (Europe)"           ,     "europe.fla", ["r|europe"   , "c|0xe966136a$1", "c|0x001bbeac$2", "c|0x42aeec82$3", "c|0x75d6a401$4", "i|PASS", "w|QASS", "c|0x3cadcfda$1", "c|0x3ff3578d$2", "c|0x49531f8d$3", "c|0x3214ac60$4"]],
    ["should load a standard save (USA)"              ,        "usa.fla", ["r|usa"      , "c|0x86376182$1", "c|0x334bab9a$2", "c|0x481c8d88$3", "c|0xc94a7e92$4", "i|PASS", "w|QASS", "c|0xb40ca289$1", "c|0xfe91a85d$2", "c|0xf7e8c94c$3", "c|0x37fcdcb9$4"]],
    ["should load a standard save (Japan)"            ,      "japan.fla", ["r|japan"    , "c|0xb99083cb$1", "c|0x74c13e63$2", "c|0x5ababb27$3", "c|0xbef5f32f$4", "i|PASS", "w|QASS", "c|0xdaebbbf9$1", "c|0x8d50e3d8$2", "c|0x74e67cf2$3", "c|0x9764f6b4$4"]],
    ["should load a standard save (France)"           ,     "france.fla", ["r|france"   , "c|0xd9fb21b5$1", "c|0x21647ef3$2", "c|0xc9b64144$3", "c|0x3e4447cb$4", "i|PASS", "w|QASS", "c|0xb7fbb702$1", "c|0xc3109b45$2", "c|0xbe5dd3ad$3", "c|0x37c098e5$4"]],
    ["should load a standard save (Germany)"          ,    "germany.fla", ["r|germany"  , "c|0x09c25a58$1", "c|0x5b6caed4$2", "c|0x86dc1e0a$3", "c|0x437eeab0$4", "i|PASS", "w|QASS", "c|0xf537830b$1", "c|0xe0abee76$2", "c|0x6d9b257b$3", "c|0x35ee41c3$4"]],
    ["should load a standard save (Italy)"            ,      "italy.fla", ["r|italy"    , "c|0x79e33c83$1", "c|0x9e123217$2", "c|0xb035cdd1$3", "c|0x10c01823$4", "i|PASS", "w|QASS", "c|0xed0d396b$1", "c|0x6566a901$2", "c|0x4ec50cba$3", "c|0xce966571$4"]],
    ["should load a standard save (Spain)"            ,      "spain.fla", ["r|spain"    , "c|0xb6eb79aa$1", "c|0xc808e517$2", "c|0xc9ab9e3e$3", "c|0xfba7458a$4", "i|PASS", "w|QASS", "c|0x41dd790b$1", "c|0x6264ff3c$2", "c|0xdcdc725d$3", "c|0xef648c4c$4"]],
    ["should load a standard save (Australia)"        ,  "australia.fla", ["r|australia", "c|0xe34dc4ca$1", "c|0x63690fb2$2", "c|0x6b1d8f84$3", "c|0x3189b1e2$4", "i|PASS", "w|QASS", "c|0xef4edf29$1", "c|0x6e0abe91$2", "c|0x63ea5156$3", "c|0x10f37893$4"]],
    ["should load a SRM save (Europe)"                ,     "europe.srm", ["r|europe"   , "c|0x3119720a$1", "c|0x38a8f926$2", "c|0x4a25c83e$3", "c|0x596eb6dd$4", "i|PASS", "w|QASS", "c|0xc2aa5734$1", "c|0x2c988ed7$2", "c|0x010f3d72$3", "c|0xbc44bc2a$4"]],
    ["should load a SRM save (USA)"                   ,        "usa.srm", ["r|usa"      , "c|0x0bcc7198$1", "c|0x2128d25d$2", "c|0x9eba18b4$3", "c|0x345b3cb6$4", "i|PASS", "w|QASS", "c|0xca430a24$1", "c|0xe0461af0$2", "c|0x86b3ebca$3", "c|0x5e8be6bc$4"]],
    ["should load a SRM save (Japan)"                 ,      "japan.srm", ["r|japan"    , "c|0x620e6612$1", "c|0xd92ae5d0$2", "c|0xa97cbaad$3", "c|0x67f112a2$4", "i|PASS", "w|QASS", "c|0xdaa6ce71$1", "c|0xe4c014c3$2", "c|0x18e777fa$3", "c|0x26f7dd6a$4"]],
    ["should load a SRM save (France)"                ,     "france.srm", ["r|france"   , "c|0x43ebf68b$1", "c|0xb4e639b6$2", "c|0x16da70bd$3", "c|0x1ef93133$4", "i|PASS", "w|QASS", "c|0x33356362$1", "c|0xc43777fe$2", "c|0x1bf61962$3", "c|0x942957b4$4"]],
    ["should load a SRM save (Germany)"               ,    "germany.srm", ["r|germany"  , "c|0xc469f63d$1", "c|0xe229bf24$2", "c|0xb52fa22a$3", "c|0x0ab3c2a2$4", "i|PASS", "w|QASS", "c|0x8c4b72e2$1", "c|0x14d9cba3$2", "c|0xf1bc1a54$3", "c|0x84b8da5d$4"]],
    ["should load a SRM save (Italy)"                 ,      "italy.srm", ["r|italy"    , "c|0xbb382bef$1", "c|0xbe36e41e$2", "c|0x89641390$3", "c|0x4464a1ed$4", "i|PASS", "w|QASS", "c|0x43b23d8f$1", "c|0xe05b7fdb$2", "c|0x86435e3d$3", "c|0xe6035149$4"]],
    ["should load a SRM save (Spain)"                 ,      "spain.srm", ["r|spain"    , "c|0x862e1cea$1", "c|0x0f437f33$2", "c|0xcb22ac5d$3", "c|0xd39a188a$4", "i|PASS", "w|QASS", "c|0xa5761c50$1", "c|0x99a9511c$2", "c|0x71fc8f8d$3", "c|0x96dc1113$4"]],
    ["should load a SRM save (Australia)"             ,  "australia.srm", ["r|australia", "c|0xaf3479fe$1", "c|0x1e51813e$2", "c|0x97a894d1$3", "c|0xea6488df$4", "i|PASS", "w|QASS", "c|0x69dd9358$1", "c|0x6cd3f5a5$2", "c|0xcc056af8$3", "c|0xe1ff3e91$4"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
