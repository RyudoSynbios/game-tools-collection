import consoleManufacturersDb from "$lib/db/consoleManufacturers.json";
import consolesDb from "$lib/db/consoles.json";
import gamesDb from "$lib/db/games.json";

import type { Console, Game, Manufacturer } from "$lib/types";

export function getConsole(consoleId: string): Console | undefined {
  const consoles = getConsoles();

  return consoles.find((console) => console.id === consoleId);
}

export function getConsoles(): Console[] {
  const consoles = consolesDb.reduce((consoles: Console[], console) => {
    consoles.push({
      id: console.id,
      name: console.name,
      manufacturer: consoleManufacturersDb.find(
        (manufacturer) => manufacturer.id === console.manufacturerId,
      ) as Manufacturer,
    });

    return consoles;
  }, []);

  return consoles;
}

export function getGame(gameId: string): Game | undefined {
  const games = getGames();

  return games.find((game) => game.id === gameId);
}

export type Tool = "saveEditor" | "romEditor" | "randomizer";

interface GameOptions {
  title?: string;
  console?: string;
  tool?: Tool;
}

export function getGames(options: GameOptions = {}): Game[] {
  const games = gamesDb.reduce((results: Game[], game) => {
    if (
      (options.title &&
        !game.name.toLowerCase().match(options.title.toLowerCase())) ||
      (options.console && game.consoleId !== options.console) ||
      (options.tool && !game.tools[options.tool])
    ) {
      return results;
    }

    if (game.tools.saveEditor || game.tools.romEditor) {
      const console = getConsole(game.consoleId) as Console;

      results.push({
        id: game.id,
        name: game.name,
        console,
        tools: {
          saveEditor: game.tools.saveEditor,
          romEditor: game.tools.romEditor,
        },
      });
    }

    return results;
  }, []);

  return games;
}
