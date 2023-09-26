import consoleManufacturersDb from "$lib/db/consoleManufacturers.json";
import consolesDb from "$lib/db/consoles.json";
import gamesDb from "$lib/db/games.json";

import type { Console, EditorType, Game, Manufacturer } from "$lib/types";

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

interface GameOptions {
  title?: string;
  console?: string;
  editorType?: EditorType;
}

export function getGames(options: GameOptions = {}): Game[] {
  const games = gamesDb.reduce((results: Game[], game) => {
    if (
      (options.title &&
        !game.name.toLowerCase().match(options.title.toLowerCase())) ||
      (options.console && game.consoleId !== options.console) ||
      (options.editorType && !game[options.editorType])
    ) {
      return results;
    }

    if (game.romEditor || game.saveEditor) {
      const console = getConsole(game.consoleId) as Console;

      results.push({
        id: game.id,
        name: game.name,
        console,
        romEditor: game.romEditor,
        saveEditor: game.saveEditor,
      });
    }

    return results;
  }, []);

  return games;
}
