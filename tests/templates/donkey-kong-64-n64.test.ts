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
    ["should load an empty standard save"          ,         "empty.eep", ["r|europe", 't|["Mystery","Options"]']],
    ["should load a deleted standard save"         ,       "deleted.eep", ["r|europe", 't|["Mystery","Options"]']],
    ["should load a deleted standard save (Slot 3)", "deleted-slot3.eep", ["r|europe", 't|["Slot 3","Mystery","Options"]', "s|3", "c|0x59555db8$2", "i|00$1", "i|02$2", "w|03$2", "c|0x7efbdc50$2", "s|4", "c|0x0918a74e$1", "i|-", "w|1", "c|0xc3cb29c1$1"]],
    ["should load a standard save (Europe)"        ,        "europe.eep", ["r|europe", 't|["Slot 1","Mystery","Options"]', "s|1", "c|0xda2e1dba$2", "i|06$1", "i|09$2", "w|10$2", "c|0xb2dd9f82$2", "s|4", "c|0x0918a74e$1", "i|-", "w|1", "c|0xc3cb29c1$1"]],
    ["should load a standard save (USA)"           ,           "usa.eep", ["r|usa"   , 't|["Slot 2","Mystery","Options"]', "s|2", "c|0x88db7691$2", "i|05$1", "i|23$2", "w|24$2", "c|0x7e92f309$2", "s|4", "c|0x0918a74e$1", "i|-", "w|1", "c|0xc3cb29c1$1"]],
    ["should load a standard save (Japan)"         ,         "japan.eep", ["r|japan" , 't|["Slot 3","Mystery","Options"]', "s|3", "c|0x9c7c8372$2", "i|05$1", "i|30$2", "w|31$2", "c|0xbbd2029a$2", "s|4", "c|0x703a20ce$1", "i|-", "w|1", "c|0xbae9ae41$1"]],
    ["should load a SRM save (Europe)"             ,        "europe.srm", ["r|europe", 't|["Slot 2","Mystery","Options"]', "s|2", "c|0x412b80d0$2", "i|03$1", "i|18$2", "w|19$2", "c|0x66850138$2", "s|4", "c|0x0918a74e$1", "i|-", "w|1", "c|0xc3cb29c1$1"]],
    ["should load a SRM save (USA)"                ,           "usa.srm", ["r|usa"   , 't|["Slot 3","Mystery","Options"]', "s|3", "c|0x8065ec97$2", "i|05$1", "i|34$2", "w|35$2", "c|0xa7cb6d7f$2", "s|4", "c|0x0918a74e$1", "i|-", "w|1", "c|0xc3cb29c1$1"]],
    ["should load a SRM save (Japan)"              ,         "japan.srm", ["r|japan" , 't|["Slot 1","Mystery","Options"]', "s|1", "c|0x00e1cc3e$2", "i|05$1", "i|37$2", "w|38$2", "c|0x68124e06$2", "s|4", "c|0x703a20ce$1", "i|-", "w|1", "c|0xbae9ae41$1"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
