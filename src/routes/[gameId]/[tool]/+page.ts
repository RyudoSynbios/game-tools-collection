import { error, redirect } from "@sveltejs/kit";

import { gameTemplate, gameUtils } from "$lib/stores.js";
import { getGame } from "$lib/utils/db.js";
import debug from "$lib/utils/debug";

import type { Game } from "$lib/types.js";

export interface Data {
  game: Game;
}

export async function load({ params }): Promise<void> {
  let tool = "";

  if (params.gameId === "shining-force-3-scenario-1-saturn") {
    redirect(301, `/shining-force-3-saturn/${params.tool}`);
  }

  if (params.tool === "randomizer") {
    tool = "randomizer";
  } else if (params.tool === "rom-editor") {
    tool = "romEditor";
  } else if (params.tool === "save-editor") {
    tool = "saveEditor";
  } else {
    error(404, {
      message: "Not found",
    });
  }

  const game = getGame(params.gameId);

  if (!game || !game[tool]) {
    error(404, {
      message: "Not found",
    });
  }

  const template = (
    await import(`../../../lib/templates/${params.gameId}/${tool}/template.ts`)
  ).default;

  try {
    const utils = await import(
      `../../../lib/templates/${params.gameId}/${tool}/utils.ts`
    );

    gameUtils.set(utils);
  } catch (err) {
    debug.error(
      `Couldn't load utils "templates/${params.gameId}/${tool}/utils.ts"`,
    );
  }

  gameTemplate.set(template);
}
