import fs from "fs";

import { expectChecksums } from "./modules/checksums";
import { expectInput, writeInput } from "./modules/input";
import { selectRegion } from "./modules/region";
import { expectTabs, selectTab } from "./modules/tabs";

const path = `${__dirname}/saves`;

export function getRandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function getRandomSave(exclude: string): string {
  const games = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((folder) => folder.isDirectory() && folder.name !== exclude);
  const game = games[getRandomNumber(0, games.length - 1)];

  const saves = fs.readdirSync(`${path}/${game.name}`);
  const save = saves[getRandomNumber(0, saves.length - 1)];

  return `${game.name}/${save}`;
}

export async function initPage(url: string): Promise<void> {
  await page.goto(`${URL}`, { waitUntil: "domcontentloaded" });

  await page.evaluateOnNewDocument(() => {
    localStorage.setItem("debug", "true");
  });

  await page.goto(`${URL}/${url}`, {
    waitUntil: "domcontentloaded",
  });

  await page.waitForTimeout(500);
}

export async function ejectFile(): Promise<void> {
  const contentEl = await page.$(".gtc-editor > .gtc-content");

  if (contentEl) {
    await page.click(".gtc-editor-eject");
  }
}

export async function saveShouldBeRejected(saveFile: string) {
  const isFileExists = fs.existsSync(`${path}/${saveFile}`);

  if (!isFileExists) {
    console.log(`File doesn't exists: "${`${path}/${saveFile}`}"`);
  }

  expect(isFileExists).toBeTruthy();

  const inputFileEl = await page.$('input[type="file"]');

  await inputFileEl?.uploadFile(`${path}/${saveFile}`);

  const dropzoneErrorEl = await page.$(".gtc-dropzone-error");

  if (!dropzoneErrorEl) {
    console.log(`Tested file: "${`${path}/${saveFile}`}"`);
  }

  expect(dropzoneErrorEl).toBeTruthy();
}

export function defaultTests(game: string): void {
  it("should not load an empty file", async () => {
    await saveShouldBeRejected("empty");
  });

  it("should not load a wrong save", async () => {
    await saveShouldBeRejected(getRandomSave(game));
  });

  if (game.match(/-dc$/)) {
    it("should not load an empty standard save", async () => {
      await saveShouldBeRejected(`${game}/empty.bin`);
    });

    it("should not load a deleted standard save", async () => {
      await saveShouldBeRejected(`${game}/deleted.bin`);
    });
  } else if (game.match(/-gba$/)) {
    it("should not load a wrong GameShark save", async () => {
      await saveShouldBeRejected(`${game}/bad.sps`);
    });
  } else if (game.match(/-ps$/)) {
    it("should not load an empty standard save", async () => {
      await saveShouldBeRejected(`${game}/empty.mcr`);
    });

    it("should not load a wrong DexDrive save", async () => {
      await saveShouldBeRejected(`${game}/bad.gme`);
    });
  }
}

export async function snippet(
  saveFilePath: string,
  actions: string[] | null,
): Promise<void> {
  const isFileExists = fs.existsSync(`${path}/${saveFilePath}`);

  expect(isFileExists).toBeTruthy();

  const inputFileEl = await page.$('input[type="file"]');

  await inputFileEl?.uploadFile(`${path}/${saveFilePath}`);

  if (actions !== null) {
    await actions.reduce(async (previousAction, action) => {
      await previousAction;

      expect(action).toContain("|");

      const [type, value, index] = action.split(/[|$]/);

      const elIndex = index ? parseInt(index) - 1 : 0;

      if (!["c", "i", "n", "r", "s", "t", "w"].includes(type)) {
        expect(false).toBeTruthy();

        return;
      }

      if (type === "c") {
        await expectChecksums(value, elIndex);
      }

      if (type === "i") {
        await expectInput(value, elIndex);
      }

      if (type === "n") {
        await expectInput(value, elIndex, false);
      }
      if (type === "r") {
        await selectRegion(value);
      }

      if (type === "s") {
        await selectTab(value, elIndex);
      }

      if (type === "t") {
        await expectTabs(value, elIndex);
      }

      if (type === "w") {
        await writeInput(value, elIndex);
      }
    }, Promise.resolve());
  }
}