import {
  defaultTests,
  ejectFile,
  initPage,
  saveShouldBeRejected,
  snippet,
} from "../";

const game = "marvel-vs-capcom-2-new-age-of-heroes-dc";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load a filled standard save (Europe)"      , "filled.bin", ["r|europe", "c|2f7a5b30$1", "c|b3a3$2", "i|49$1", "i|20$2" , "w|50$1", "c|2f7b5c30$1", "c|9859$2"]],
    ["should load a filled standard save (Japan)"       , "filled.bin", ["r|japan" , "c|2fc34f85$1", "c|e474$2", "i|31$1", "i|100$2", "w|32$1", "c|2fc45085$1", "c|9e5d$2"]],
    ["should load a standard save (Europe)"             , "europe.bin", [            "c|2f6e730c$1", "c|1738$2", "i|31$1", "i|10$2" , "w|32$1", "c|2f6f740c$1", "c|2d75$2"]],
    ["should load a standard save (USA)"                ,    "usa.bin", [            "c|2fcf6977$1", "c|3cdb$2", "i|11$1", "i|100$2", "w|12$1", "c|2fd06a77$1", "c|d887$2"]],
    ["should load a standard save (Japan)"              ,  "japan.bin", [            "c|2f74671e$1", "c|1fe0$2", "i|16$1", "i|20$2" , "w|17$1", "c|2f75681e$1", "c|8436$2"]],
    ["should load a DCI save (Europe)"                  , "europe.dci", [            "c|2fdf737d$1", "c|8555$2", "i|50$1", "i|100$2", "w|51$1", "c|2fe0747d$1", "c|91b8$2"]],
    ["should load a DCI save (USA)"                     ,    "usa.dci", [            "c|2f866136$1", "c|0fb0$2", "i|39$1", "i|10$2" , "w|40$1", "c|2f876236$1", "c|ada4$2"]],
    ["should load a DCI save (Japan)"                   ,  "japan.dci", [            "c|2fa74276$1", "c|6b1a$2", "i|00$1", "i|100$2", "w|01$1", "c|2fa84376$1", "c|c8c2$2"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
