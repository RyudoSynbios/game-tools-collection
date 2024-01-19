import { defaultTests, ejectFile, initPage, snippet } from "../";

const game = "akumajou-dracula-x-chi-no-rondo-pcecd";

beforeAll(async () => initPage(`${game}/save-editor`));

beforeEach(async () => ejectFile());

describe(game, () => {
  defaultTests(game);

  // prettier-ignore
  test.each([
    ["should load an empty standard save"              , "empty.sav"        , ['t|[]']],
    ["should load a deleted standard save (Slot 3)"    , "deleted-slot3.sav", ['t|["Slot 3"]', "c|fbbb", "i|PASS", "w|QASS", "c|fbba"]],
    ["should load a standard save (Japan)"             , "japan.sav"        , ['t|["Slot 2"]', "c|fbbb", "i|PASS", "w|QASS", "c|fbba"]],
  ])("%s", async (...args) =>
    await snippet(`${game}/${args[1]}`, args[2]),
  );
});
