import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "super-smash-bros-n64";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should not load a standard save with bad region",    "europe.sra", ["r|japan"    , "s|4$1", "n|French"]],
    ["should load a standard save (Europe)"           ,    "europe.sra", ["r|europe"   , "s|2$1", "s|2$2", "s|1$3" , "c|0x0083f09a", "i|45$1", "i|10$2", "w|46$1", "c|0x0084fada"]],
    ["should load a standard save (USA)"              ,       "usa.sra", ["r|usa"      , "s|2$1", "s|3$2", "s|9$3" , "c|0x0085f730", "i|00$1", "i|8$2" , "w|01$1", "c|0x00873f50"]],
    ["should load a standard save (Japan)"            ,     "japan.sra", ["r|japan"    , "s|2$1", "s|2$2", "s|2$3" , "c|0x0085e57b", "i|00$1", "i|7$2" , "w|01$1", "c|0x0086f73b"]],
    ["should load a standard save (Australia)"        , "australia.sra", ["r|australia", "s|2$1", "s|2$2", "s|6$3" , "c|0x0085f901", "i|00$1", "i|9$2" , "w|01$1", "c|0x008728c1"]],
    ["should load a SRM save (Europe)"                ,    "europe.srm", ["r|europe"   , "s|2$1", "s|2$2", "s|10$3", "c|0x0085e876", "i|00$1", "i|5$2" , "w|01$1", "c|0x00873636"]],
    ["should load a SRM save (USA)"                   ,       "usa.srm", ["r|usa"      , "s|2$1", "s|2$2", "s|7$3" , "c|0x0085ea8e", "i|00$1", "i|6$2" , "w|01$1", "c|0x008721ce"]],
    ["should load a SRM save (Japan)"                 ,     "japan.srm", ["r|japan"    , "s|2$1", "s|3$2", "s|4$3" , "c|0x0085decc", "i|00$1", "i|4$2" , "w|01$1", "c|0x0087016c"]],
    ["should load a SRM save (Australia)"             , "australia.srm", ["r|australia", "s|2$1", "s|3$2", "s|6$3" , "c|0x0085f4fb", "i|00$1", "i|7$2" , "w|01$1", "c|0x0087269b"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
