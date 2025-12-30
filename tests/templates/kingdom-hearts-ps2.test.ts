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

  test("should not load a deleted standard save", async () => {
    await saveShouldBeRejected(`${game}/deleted.ps2`);
  });

  // prettier-ignore
  const tests: Test[] = [
    ["should load a filled standard save (Europe, Australia)",          "filled.ps2", ["r|australia" , 't|["Slot 76"]'           , "s|1$1", "i|31$1", "i|55$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a filled standard save (Japan)"            ,          "filled.ps2", ["r|japan"     , 't|["Slot 98"]'           , "s|1$1", "i|29$1", "i|39$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a filled standard save (Final Mix)"        ,          "filled.ps2", ["r|final mix" , 't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a deleted standard save (Slot 13)"         ,  "deleted-slot13.ps2", [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Europe, Australia)"       , "europeaustralia.ps2", [                't|["Slot 1","Slot 13"]'  , "s|2$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (USA)"                     ,             "usa.ps2", [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Japan)"                   ,           "japan.ps2", [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (France)"                  ,          "france.ps2", [                't|["Slot 94","Slot 97"]' , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Germany)"                 ,         "germany.ps2", [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Italy)"                   ,           "italy.ps2", [                't|["Slot 3","Slot 5"]'   , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Spain)"                   ,           "spain.ps2", [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a standard save (Final Mix)"               ,        "finalmix.ps2", [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Europe, Australia)"            , "europeaustralia.psv", [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (USA)"                          ,             "usa.psv", [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Japan)"                        ,           "japan.psv", [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (France)"                       ,          "france.psv", [                't|["Slot 94"]'           , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Germany)"                      ,         "germany.psv", [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Italy)"                        ,           "italy.psv", [                't|["Slot 3"]'            , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Spain)"                        ,           "spain.psv", [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSV save (Final Mix)"                    ,        "finalmix.psv", [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Europe, Australia)"            , "europeaustralia.psu", [                't|["Slot 13"]'           , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (USA)"                          ,             "usa.psu", [                't|["Slot 37"]'           , "s|1$1", "i|35$1", "i|37$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Japan)"                        ,           "japan.psu", [                't|["Slot 1"]'            , "s|1$1", "i|27$1", "i|10$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (France)"                       ,          "france.psu", [                't|["Slot 94"]'           , "s|1$1", "i|30$1", "i|35$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Germany)"                      ,         "germany.psu", [                't|["Slot 21"]'           , "s|1$1", "i|33$1", "i|30$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Italy)"                        ,           "italy.psu", [                't|["Slot 3"]'            , "s|1$1", "i|33$1", "i|22$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Spain)"                        ,           "spain.psu", [                't|["Slot 1"]'            , "s|1$1", "i|30$1", "i|45$2" , "s|6$2", "s|2$3", "i|PASS"]],
    ["should load a PSU save (Final Mix)"                    ,        "finalmix.psu", [                't|["Slot 1"]'            , "s|1$1", "i|14$1", "i|44$2" , "s|6$2", "s|2$3", "i|PASS"]],
   ];

  tests.forEach(([title, saveFilePath, args]) => {
    test(title, async () => {
      await snippet(`${game}/${saveFilePath}`, args);
    });
  });
});
