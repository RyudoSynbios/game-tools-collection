import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import test, { Browser, type Page } from "@playwright/test";

import { expectChecksum } from "./modules/checksum";
import { expectInput, writeInput } from "./modules/input";
import { selectRegion } from "./modules/region";
import { expectTabs, selectTab } from "./modules/tabs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = `${__dirname}/saves`;

export function extractGameName(filePath: string): string {
  const fileName = filePath.split("/").pop();

  return fileName?.replace(".test.ts", "") || "";
}

export function getRandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getRandomSave(exclude: string): string {
  const games = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== exclude);
  const game = games[getRandomNumber(0, games.length - 1)];

  const saves = fs
    .readdirSync(`${path}/${game.name}`, {
      recursive: true,
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isFile())
    .map((file) => {
      const split = file.parentPath.split("/");

      if (split.at(-2) === game.name) {
        return `${split.at(-1)}/${file.name}`;
      }

      return file.name;
    });

  const save = saves[getRandomNumber(0, saves.length - 1)];

  return `${game.name}/${save}`;
}

let page: Page;

export async function initPage(browser: Browser, url: string): Promise<void> {
  if (!page) {
    page = await browser.newPage();
  }

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.addInitScript(() => {
    localStorage.setItem("debug", "true");
    localStorage.setItem("debugOptions", '{"showHiddenItems":true}');
  });

  await page.goto(url, {
    waitUntil: "networkidle",
  });
}

export async function ejectFile(): Promise<void> {
  const contentEl = await page.$(".gtc-tool > .gtc-content");

  if (contentEl) {
    await page.locator(".gtc-tool-eject").click();
  }
}

export async function saveShouldBeRejected(
  saveFilePath: string,
): Promise<void> {
  const isFileExists = fs.existsSync(`${path}/${saveFilePath}`);

  test.expect(isFileExists).toBeTruthy();

  await page
    .locator('input[type="file"]')
    .setInputFiles(`${path}/${saveFilePath}`);

  const dropzoneErrorEl = await page.$(".gtc-dropzone-error");

  if (!dropzoneErrorEl) {
    console.log(`Tested file: "${`${path}/${saveFilePath}`}"`);
  }

  test.expect(dropzoneErrorEl).toBeTruthy();
}

export function defaultTests(game: string): void {
  test("should not load an empty file", async () => {
    await saveShouldBeRejected("common/empty");
  });

  test("should not load a wrong save", async () => {
    await saveShouldBeRejected(getRandomSave(game));
  });

  if (game.match(/-dc$/)) {
    test("should not load an empty standard save", async () => {
      await saveShouldBeRejected("common/dreamcast/empty.bin");
    });

    test("should not load a deleted standard save", async () => {
      await saveShouldBeRejected(`${game}/deleted.bin`);
    });
  } else if (game.match(/-gba$/)) {
    test("should not load a wrong GameShark save", async () => {
      await saveShouldBeRejected(`${game}/bad.sps`);
    });
  } else if (game.match(/-ds$/)) {
    test("should not load a wrong Action Replay Max DS save", async () => {
      await saveShouldBeRejected(`${game}/bad.duc`);
    });
  } else if (game.match(/-ps$/)) {
    test("should not load an empty standard save", async () => {
      await saveShouldBeRejected("common/playstation/empty.mcr");
    });

    test("should not load a wrong DexDrive save", async () => {
      await saveShouldBeRejected(`${game}/bad.gme`);
    });
  } else if (game.match(/-ps2$/)) {
    test("should not load an empty standard save", async () => {
      await saveShouldBeRejected("common/playstation2/empty.ps2");
    });

    test("should not load an unformatted standard save", async () => {
      await saveShouldBeRejected("common/playstation2/unformated.ps2");
    });
  }
}

export type Test = [string, string, string[]];

export async function snippet(
  saveFilePath: string,
  actions: string[] | null,
): Promise<void> {
  const isFileExists = fs.existsSync(`${path}/${saveFilePath}`);

  test.expect(isFileExists).toBeTruthy();

  await page
    .locator('input[type="file"]')
    .setInputFiles(`${path}/${saveFilePath}`);

  if (actions !== null) {
    await actions.reduce(async (previousAction, action) => {
      await previousAction;

      test.expect(action).toContain("|");

      const [type, value, index] = action.split(/[|$]/);

      const elIndex = index ? parseInt(index) - 1 : 0;

      if (!["c", "i", "n", "r", "s", "t", "w"].includes(type)) {
        test.expect(false).toBeTruthy();

        return;
      }

      if (type === "c") {
        await expectChecksum(page, value, elIndex);
      }

      if (type === "i") {
        await expectInput(page, value, elIndex);
      }

      if (type === "n") {
        await expectInput(page, value, elIndex, false);
      }

      if (type === "r") {
        await selectRegion(page, value);
      }

      if (type === "s") {
        await selectTab(page, value, elIndex);
      }

      if (type === "t") {
        await expectTabs(page, value, elIndex);
      }

      if (type === "w") {
        await writeInput(page, value, elIndex);
      }
    }, Promise.resolve());
  }
}
