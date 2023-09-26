import { error } from "@sveltejs/kit";

import { gameTemplate, gameUtils } from "$lib/stores.js";
import { getGame } from "$lib/utils/db.js";

import type { EditorType, Game } from "$lib/types.js";

export interface Data {
  game: Game;
}

export async function load({ params }): Promise<void> {
  let editor: EditorType;

  if (params.editorType === "randomizer") {
    editor = "randomizer";
  } else if (params.editorType === "rom-editor") {
    editor = "romEditor";
  } else if (params.editorType === "save-editor") {
    editor = "saveEditor";
  } else {
    throw error(404, {
      message: "Not found",
    });
  }

  const game = getGame(params.gameId);

  if (!game || !game[editor]) {
    throw error(404, {
      message: "Not found",
    });
  }

  const template = (
    await import(
      `../../../lib/templates/${params.gameId}/${editor}/template.ts`
    )
  ).default;

  try {
    const utils = await import(
      `../../../lib/templates/${params.gameId}/${editor}/utils.ts`
    );

    gameUtils.set(utils);
  } catch (err) {}

  gameTemplate.set(template);
}
