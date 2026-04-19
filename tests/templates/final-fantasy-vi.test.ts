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
  defaultTests(game, ["super-nintendo", "game-boy-advance"]);

  test("should not load an empty SNES standard save", async () => {
    await saveShouldBeRejected(`${game}/snes-empty.sav`);
  });

  test("should not load an empty GBA standard save", async () => {
    await saveShouldBeRejected(`${game}/gba-empty.sav`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a standard SNES save (USA)"        ,      "snes-usa.sav", ["r|usa"   , 't|["Slot 1","Slot 2"]', "s|2$1", "c|0xd4ba$1", "s|2$2", "i|PASS"  , "w|QASS"   , "c|0xd4bb$1"]],
    ["should load a standard SNES save (USA) (Rev 1)", "snes-usa-rev1.sav", ["r|usa"   , 't|["Slot 2","Slot 3"]', "s|2$1", "c|0xd479$1", "s|2$2", "i|PASS"  , "w|QASS"   , "c|0xd47a$1"]],
    ["should load a standard SNES save (Japan)"      ,    "snes-japan.sav", ["r|japan" , 't|["Slot 1","Slot 3"]', "s|3$1", "c|0xd5a7$1", "s|2$2", "i|ごうかく", "w|ざうかく", "c|0xd5a9$1"]],
    ["should load a standard GBA save (Europe)"      ,    "gba-europe.sav", ["r|europe", 't|["Slot 1","Slot 2"]', "s|2$1", "c|0xaed4$1", "c|0x1f5f$2", "c|0x000e$3", "s|2$2", "i|PASS"  , "w|QASS"   , "s|3$2", "s|8$3", "i|1$2", "w|2$2", "s|5$2", "i|8$1", "w|9$1", "c|0xaed5$1", "c|0x1f60$2", "c|0x000f$3"]],
    ["should load a standard GBA save (USA)"         ,       "gba-usa.sav", ["r|usa"   , 't|["Slot 1","Slot 3"]', "s|1$1", "c|0xad61$1", "c|0x1f61$2", "c|0x0011$3", "s|2$2", "i|PASS"  , "w|QASS"   , "s|3$2", "s|8$3", "i|3$2", "w|4$2", "s|5$2", "i|8$1", "w|9$1", "c|0xad62$1", "c|0x1f62$2", "c|0x0012$3"]],
    ["should load a standard GBA save (Japan)"       ,     "gba-japan.sav", ["r|japan" , 't|["Slot 2","Slot 3"]', "s|3$1", "c|0xb151$1", "c|0x1f60$2", "c|0x000e$3", "s|2$2", "i|ごうかく", "w|ざうかく", "s|3$2", "s|8$3", "i|1$2", "w|2$2", "s|5$2", "i|8$1", "w|9$1", "c|0xb153$1", "c|0x1f61$2", "c|0x000f$3"]],
    ["should load a GameShark GBA save (Europe)"     ,    "gba-europe.sps", ["r|europe", 't|["Slot 1","Slot 2"]', "s|2$1", "c|0xaed4$1", "c|0x1f5f$2", "c|0x000e$3", "s|2$2", "i|PASS"  , "w|QASS"   , "s|3$2", "s|8$3", "i|1$2", "w|2$2", "s|5$2", "i|8$1", "w|9$1", "c|0xaed5$1", "c|0x1f60$2", "c|0x000f$3"]],
    ["should load a GameShark GBA save (USA)"        ,       "gba-usa.sps", ["r|usa"   , 't|["Slot 1","Slot 3"]', "s|1$1", "c|0xad61$1", "c|0x1f61$2", "c|0x0011$3", "s|2$2", "i|PASS"  , "w|QASS"   , "s|3$2", "s|8$3", "i|3$2", "w|4$2", "s|5$2", "i|8$1", "w|9$1", "c|0xad62$1", "c|0x1f62$2", "c|0x0012$3"]],
    ["should load a GameShark GBA save (Japan)"      ,     "gba-japan.sps", ["r|japan" , 't|["Slot 2","Slot 3"]', "s|3$1", "c|0xb151$1", "c|0x1f60$2", "c|0x000e$3", "s|2$2", "i|ごうかく", "w|ざうかく", "s|3$2", "s|8$3", "i|1$2", "w|2$2", "s|5$2", "i|8$1", "w|9$1", "c|0xb153$1", "c|0x1f61$2", "c|0x000f$3"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
