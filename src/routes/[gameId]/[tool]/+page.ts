import { error } from "@sveltejs/kit";

import { gameTemplate, gameUtils } from "$lib/stores.js";
import { getGame } from "$lib/utils/db.js";

import type { Game } from "$lib/types.js";

export interface Data {
  game: Game;
}

export async function load({ params }): Promise<void> {
  let tool = "";

  if (params.tool === "randomizer") {
    tool = "randomizer";
  } else if (params.tool === "rom-editor") {
    tool = "romEditor";
  } else if (params.tool === "save-editor") {
    tool = "saveEditor";
  } else {
    throw error(404, {
      message: "Not found",
    });
  }

  const game = getGame(params.gameId);

  if (!game || !game[tool]) {
    throw error(404, {
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
  } catch (err) {}

  gameTemplate.set(template);
}
