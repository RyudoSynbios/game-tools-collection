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

  test("should not load a wrong DexDrive save", async () => {
    await saveShouldBeRejected(`${game}/bad.n64`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load an empty standard save"          ,         "empty.mpk", [            't|[]']],
    ["should load a deleted standard save"         ,       "deleted.mpk", [            't|[]']],
    ["should load a deleted standard save (Slot 4)", "deleted-slot4.mpk", [            't|["Slot 4"]', "s|4$1", "c|0x00000271$1", "c|0x005839b0$2", "i|02$1", "i|13$2", "i|1000$3", "w|1001$3", "c|0x00000272$1", "c|0x005839b1$2"]],
    ["should load a filled standard save (Europe)" ,        "filled.mpk", ["r|europe", 't|["Slot 3"]', "s|3$1", "c|0x00000269$1", "c|0x007434b7$2", "i|01$1", "i|54$2", "i|700$3" , "w|701$3" , "c|0x0000026a$1", "c|0x007434b6$2"]],
    ["should load a filled standard save (USA)"    ,        "filled.mpk", ["r|usa"   , 't|["Slot 2"]', "s|2$1", "c|0x00000364$1", "c|0x007b3db2$2", "i|02$1", "i|11$2", "i|900$3" , "w|901$3" , "c|0x00000365$1", "c|0x007b3db3$2"]],
    ["should load a standard save (Europe)"        ,        "europe.mpk", [            't|["Slot 2"]', "s|2$1", "c|0x0000023b$1", "c|0x005f3894$2", "i|02$1", "i|34$2", "i|1700$3", "w|1701$3", "c|0x0000023c$1", "c|0x005f3895$2"]],
    ["should load a standard save (USA)"           ,           "usa.mpk", [            't|["Slot 4"]', "s|4$1", "c|0x000002f0$1", "c|0x00483921$2", "i|02$1", "i|07$2", "i|1300$3", "w|1301$3", "c|0x000002f1$1", "c|0x00483920$2"]],
    ["should load a standard save (USA) (Rev 1)"   ,      "usa-rev1.mpk", [            't|["Slot 1"]', "s|1$1", "c|0x000002f5$1", "c|0x00593e12$2", "i|01$1", "i|58$2", "i|1300$3", "w|1301$3", "c|0x000002f6$1", "c|0x00593e13$2"]],
    ["should load a standard save (USA) (Rev 2)"   ,      "usa-rev2.mpk", [            't|["Slot 2"]', "s|2$1", "c|0x00000364$1", "c|0x007b3db2$2", "i|02$1", "i|11$2", "i|900$3" , "w|901$3" , "c|0x00000365$1", "c|0x007b3db3$2"]],
    ["should load a standard save (Japan)"         ,         "japan.eep", [            't|["Slot 1"]', "s|1$1", "c|0x0000029c$1", "c|0x00500d21$2", "i|03$1", "i|10$2", "i|400$3" , "w|401$3" , "c|0x0000029d$1", "c|0x00500d20$2"]],
    ["should load a SRM save (Europe)"             ,        "europe.srm", [            't|["Slot 4"]', "s|4$1", "c|0x00000215$1", "c|0x007b3ae0$2", "i|02$1", "i|34$2", "i|1200$3", "w|1201$3", "c|0x00000216$1", "c|0x007b3ae1$2"]],
    ["should load a SRM save (USA)"                ,           "usa.srm", [            't|["Slot 4"]', "s|4$1", "c|0x000002d0$1", "c|0x00530269$2", "i|02$1", "i|25$2", "i|500$3" , "w|501$3" , "c|0x000002d1$1", "c|0x00530268$2"]],
    ["should load a SRM save (USA) (Rev 1)"        ,      "usa-rev1.srm", [            't|["Slot 1"]', "s|1$1", "c|0x00000338$1", "c|0x00670231$2", "i|02$1", "i|18$2", "i|700$3" , "w|701$3" , "c|0x00000339$1", "c|0x00670230$2"]],
    ["should load a SRM save (USA) (Rev 2)"        ,      "usa-rev2.srm", [            't|["Slot 2"]', "s|2$1", "c|0x000001f5$1", "c|0x006905bf$2", "i|02$1", "i|36$2", "i|300$3" , "w|301$3" , "c|0x000001f6$1", "c|0x006905be$2"]],
    ["should load a SRM save (Japan)"              ,         "japan.srm", [            't|["Slot 1"]', "s|1$1", "c|0x0000030a$1", "c|0x00790520$2", "i|02$1", "i|35$2", "i|200$3" , "w|201$3" , "c|0x0000030b$1", "c|0x00790521$2"]],
    ["should load a DexDrive save (Europe)"        ,        "europe.n64", [            't|["Slot 2"]', "s|2$1", "c|0x0000023b$1", "c|0x005f3894$2", "i|02$1", "i|34$2", "i|1700$3", "w|1701$3", "c|0x0000023c$1", "c|0x005f3895$2"]],
    ["should load a DexDrive save (USA)"           ,           "usa.n64", [            't|["Slot 4"]', "s|4$1", "c|0x000002f0$1", "c|0x00483921$2", "i|02$1", "i|07$2", "i|1300$3", "w|1301$3", "c|0x000002f1$1", "c|0x00483920$2"]],
    ["should load a DexDrive save (USA) (Rev 1)"   ,      "usa-rev1.n64", [            't|["Slot 1"]', "s|1$1", "c|0x000002f5$1", "c|0x00593e12$2", "i|01$1", "i|58$2", "i|1300$3", "w|1301$3", "c|0x000002f6$1", "c|0x00593e13$2"]],
    ["should load a DexDrive save (USA) (Rev 2)"   ,      "usa-rev2.n64", [            't|["Slot 2"]', "s|2$1", "c|0x00000364$1", "c|0x007b3db2$2", "i|02$1", "i|11$2", "i|900$3" , "w|901$3" , "c|0x00000365$1", "c|0x007b3db3$2"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
