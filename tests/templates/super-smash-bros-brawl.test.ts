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
  defaultTests(game, ["wii"]);

  // prettier-ignore
  const tests: Test[] = [
    // Wii
    ["should load a standard Main save (Europe)"            , "wii/europe/autosv0.bin", ["c|0x09e6ac8a", "i|64", "w|65", "c|0x84b95c64"]],
    ["should load a standard Main save (USA)"               , "wii/usa/autosv0.bin"   , ["c|0x9f499508", "i|63", "w|64", "c|0xed677409"]],
    ["should load a standard Main save (Japan)"             , "wii/japan/autosv0.bin" , ["c|0x528cdecd", "i|64", "w|65", "c|0xdfd32e23"]],
    ["should load a standard Main save (Korea)"             , "wii/korea/autosv0.bin" , ["c|0x8ba7873a", "i|63", "w|64", "c|0xf989663b"]],
    ["should load an empty standard Adventure save (Europe)", "wii/empty/advsv0.bin"  , ['t|[]$2']],
    ["should load a standard Adventure save (Europe)"       , "wii/europe/advsv0.bin" , ['t|["Previous Data","Slot 28"]$2', "c|0x1046c421", "i|20400", "w|20401", "c|0xef4aee71"]],
    ["should load a standard Adventure save (USA)"          , "wii/usa/advsv0.bin"    , ['t|["Previous Data","Slot 48"]$2', "c|0x09988e85", "i|20700", "w|20701", "c|0xf694a4d5"]],
    ["should load a standard Adventure save (Japan)"        , "wii/japan/advsv0.bin"  , ['t|["Previous Data","Slot 4"]$2' , "c|0x4331418e", "i|19900", "w|19901", "c|0xbc3d6bde"]],
    ["should load a standard Adventure save (Korea)"        , "wii/korea/advsv0.bin"  , ['t|["Previous Data","Slot 12"]$2', "c|0x48205daf", "i|21000", "w|21001", "c|0xb72c77ff"]],
  ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
