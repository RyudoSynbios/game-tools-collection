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
    ["should load an empty standard save"                      ,         "empty.dsv", ["r|japan" , 't|["General","Ranking"]']],
    ["should load a deleted standard save"                     ,       "deleted.dsv", ["r|europe", 't|["General","Ranking"]']],
    ["should load a deleted standard save (Slot 1)"            , "deleted-slot2.dsv", ["r|europe", 't|["General","Slot 2","Ranking"]'         , "s|3$1", "c|0x0c0338ac$1", "c|0x7d96d96f$2", "c|0x1c4aff40$3", "c|0xba192d3d$4", "c|0x24456662$5", "c|0x0ca6585d$6", "c|0x149c9ee3$7", "c|0xc253da8e$8", "c|0xff839a55$9", "c|0x0ab107ce$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xc7c1d710$1", "c|0xba5900df$2", "c|0x9f39810d$3", "c|0xc8fd3425$4", "c|0x476fcc29$5", "c|0x76fb9f58$6", "c|0x28c211e0$7", "c|0xb25dca9b$8", "c|0x5a071768$9", "c|0xbacabd5c$10"]],
    ["should load a standard save (Europe)"                    ,        "europe.dsv", ["r|europe", 't|["General","Slot 1","Slot 2","Ranking"]', "s|3$1", "c|0x5ac37c1b$1", "c|0x4b109e44$2", "c|0x655581ae$3", "c|0x908c5691$4", "c|0x3a4896a7$5", "c|0x0ca6585d$6", "c|0x149c9ee3$7", "c|0xc253da8e$8", "c|0xff839a55$9", "c|0x0ab107ce$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xd071fc27$1", "c|0x3803833f$2", "c|0xecf08513$3", "c|0x09c09c22$4", "c|0x5d366c44$5", "c|0x76fb9f58$6", "c|0x28c211e0$7", "c|0xb25dca9b$8", "c|0x5a071768$9", "c|0xbacabd5c$10"]],
    ["should load a standard save (USA)"                       ,           "usa.dsv", ["r|usa"   , 't|["General","Slot 4","Slot 5","Ranking"]', "s|5$1", "c|0xcab383a1$1", "c|0x91e6fea6$2", "c|0xfd59d8db$3", "c|0x630cb9b8$4", "c|0xc0d2b607$5", "c|0x5bf68181$6", "c|0xe672e6b8$7", "c|0x47c56ce1$8", "c|0xcf98e048$9", "c|0x426f77a7$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xab0e0160$1", "c|0xc9e12670$2", "c|0xc23dc2af$3", "c|0x497c3ba1$4", "c|0x87ed97e4$5", "c|0x947ab923$6", "c|0xa728af31$7", "c|0x24b617fd$8", "c|0xe79054f0$9", "c|0xb925d738$10"]],
    ["should load a standard save (Japan)"                     ,         "japan.dsv", ["r|japan" , 't|["General","Slot 5","Slot 6","Ranking"]', "s|7$1", "c|0x4eca533f$1", "c|0x50923d85$2", "c|0x6b093ad2$3", "c|0x11d267cf$4", "c|0x3125191e$5", "c|0x006d083b$6", "c|0x4d597582$7", "c|0xcec31e3a$8", "c|0x0f181e26$9", "c|0x31baa9f6$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xa08ddb39$1", "c|0xbfac6351$2", "c|0xdfa6ce32$3", "c|0x00611856$4", "c|0xd79f8616$5", "c|0x895fec82$6", "c|0x38765002$7", "c|0xaab8a55c$8", "c|0xcb831b37$9", "c|0xb7575b70$10"]],
    ["should load a standard save (Japan) (Rev 1)"             ,    "japan-rev1.dsv", ["r|japan" , 't|["General","Slot 1","Slot 3","Ranking"]', "s|2$1", "c|0xb32768a1$1", "c|0x2af8fee2$2", "c|0x76c0a90f$3", "c|0x422af543$4", "c|0xb6180575$5", "c|0x073301d3$6", "c|0xdea23c9f$7", "c|0xfdc9008c$8", "c|0x5c775071$9", "c|0xeae1a9a6$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xf0f2de95$1", "c|0xcc27dfb7$2", "c|0xf8e9654c$3", "c|0x8be9b90e$4", "c|0x4f731470$5", "c|0x6179a805$6", "c|0x45dfcb38$7", "c|0x01c17c58$8", "c|0x70badfd0$9", "c|0x3aab15e3$10"]],
    ["should load a Action Replay Max DS save (Europe)"        ,        "europe.duc", ["r|europe", 't|["General","Slot 1","Slot 2","Ranking"]', "s|3$1", "c|0x5ac37c1b$1", "c|0x4b109e44$2", "c|0x655581ae$3", "c|0x908c5691$4", "c|0x3a4896a7$5", "c|0x0ca6585d$6", "c|0x149c9ee3$7", "c|0xc253da8e$8", "c|0xff839a55$9", "c|0x0ab107ce$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xd071fc27$1", "c|0x3803833f$2", "c|0xecf08513$3", "c|0x09c09c22$4", "c|0x5d366c44$5", "c|0x76fb9f58$6", "c|0x28c211e0$7", "c|0xb25dca9b$8", "c|0x5a071768$9", "c|0xbacabd5c$10"]],
    ["should load a Action Replay Max DS save (USA)"           ,           "usa.duc", ["r|usa"   , 't|["General","Slot 4","Slot 5","Ranking"]', "s|5$1", "c|0xcab383a1$1", "c|0x91e6fea6$2", "c|0xfd59d8db$3", "c|0x630cb9b8$4", "c|0xc0d2b607$5", "c|0x5bf68181$6", "c|0xe672e6b8$7", "c|0x47c56ce1$8", "c|0xcf98e048$9", "c|0x426f77a7$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xab0e0160$1", "c|0xc9e12670$2", "c|0xc23dc2af$3", "c|0x497c3ba1$4", "c|0x87ed97e4$5", "c|0x947ab923$6", "c|0xa728af31$7", "c|0x24b617fd$8", "c|0xe79054f0$9", "c|0xb925d738$10"]],
    ["should load a Action Replay Max DS save (Japan)"         ,         "japan.duc", ["r|japan" , 't|["General","Slot 5","Slot 6","Ranking"]', "s|7$1", "c|0x4eca533f$1", "c|0x50923d85$2", "c|0x6b093ad2$3", "c|0x11d267cf$4", "c|0x3125191e$5", "c|0x006d083b$6", "c|0x4d597582$7", "c|0xcec31e3a$8", "c|0x0f181e26$9", "c|0x31baa9f6$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xa08ddb39$1", "c|0xbfac6351$2", "c|0xdfa6ce32$3", "c|0x00611856$4", "c|0xd79f8616$5", "c|0x895fec82$6", "c|0x38765002$7", "c|0xaab8a55c$8", "c|0xcb831b37$9", "c|0xb7575b70$10"]],
    ["should load a Action Replay Max DS save (Japan) (Rev 1)" ,    "japan-rev1.duc", ["r|japan" , 't|["General","Slot 1","Slot 3","Ranking"]', "s|2$1", "c|0xb32768a1$1", "c|0x2af8fee2$2", "c|0x76c0a90f$3", "c|0x422af543$4", "c|0xb6180575$5", "c|0x073301d3$6", "c|0xdea23c9f$7", "c|0xfdc9008c$8", "c|0x5c775071$9", "c|0xeae1a9a6$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0xf0f2de95$1", "c|0xcc27dfb7$2", "c|0xf8e9654c$3", "c|0x8be9b90e$4", "c|0x4f731470$5", "c|0x6179a805$6", "c|0x45dfcb38$7", "c|0x01c17c58$8", "c|0x70badfd0$9", "c|0x3aab15e3$10"]],
    ["should load a filled Collection save"                    ,        "filled.bin", ["r|japan" , 't|["General","Slot 3","Ranking"]'         , "s|4$1", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10"]],
    ["should load a Collection save (Europe)"                  ,        "europe.bin", [            't|["General","Slot 4","Ranking"]'         , "s|5$1", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10"]],
    ["should load a Collection save (USA)"                     ,           "usa.bin", [            't|["General","Slot 6","Ranking"]'         , "s|7$1", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10"]],
    ["should load a Collection save (Japan)"                   ,         "japan.bin", [            't|["General","Slot 3","Ranking"]'         , "s|4$1", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10", "i|PASS$1", "w|QASS$1", "i|1500$2", "w|1501$2", "c|0x00000000$1", "c|0x00000000$2", "c|0x00000000$3", "c|0x00000000$4", "c|0x00000000$5", "c|0x00000000$6", "c|0x00000000$7", "c|0x00000000$8", "c|0x00000000$9", "c|0x00000000$10"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
