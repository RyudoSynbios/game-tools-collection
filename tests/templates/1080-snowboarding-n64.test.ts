import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "1080-snowboarding-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region", "usajapan.sra", ["r|europe", "s|4$1", "s|2$2", "n|Japanese"]],
    ["should load a standard save (Europe)"           ,   "europe.sra", ["r|europe", "s|3$1", "s|2$2", "s|1$3", "c|6cccfab8$7", "c|e9de4e9a$8", "i|PAS$1", "i|2100$2", "w|QAS$1", "c|6ccbfab8$7", "c|e9e04e9a$8"]],
    ["should load a standard save (USA, Japan)"       , "usajapan.sra", ["r|japan" , "s|3$1", "s|2$2", "s|2$3", "c|82d8e49e$7", "c|bdc67ace$8", "i|PAS$1", "i|9157$2", "w|QAS$1", "c|82d7e49e$7", "c|bdc87ace$8"]],
    ["should load a SRM save (Europe)"                ,   "europe.srm", ["r|europe", "s|3$1", "s|1$2", "s|3$3", "c|4de90f49$7", "c|27a62578$8", "i|PAS$1", "i|91$2"  , "w|QAS$1", "c|4de90e49$7", "c|27a62778$8"]],
    ["should load a SRM save (USA, Japan)"            , "usajapan.srm", ["r|usa"   , "s|3$1", "s|2$2", "s|2$3", "c|8adcfc96$7", "c|adbe4ade$8", "i|PAS$3", "i|3023$4", "w|QAS$3", "c|8adbfc96$7", "c|adc04ade$8"]],
    ["should load a DexDrive save (Europe)"           ,   "europe.n64", ["r|europe", "s|3$1", "s|2$2", "s|2$3", "c|82c4eabb$7", "c|bdee6e94$8", "i|PAS$1", "i|7592$2", "w|QAS$1", "c|82c3eabb$7", "c|bdf06e94$8"]],
    ["should load a DexDrive save (USA, Japan)"       , "usajapan.n64", ["r|usa"   , "s|3$1", "s|1$2", "s|4$3", "c|6be9d267$7", "c|eba49f3c$8", "i|PAS$1", "i|61$2"  , "w|QAS$1", "c|6be9d167$7", "c|eba4a13c$8"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
