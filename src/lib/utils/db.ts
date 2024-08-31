import moment from "moment";

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

export type Order = "createdAt";

interface GameOptions {
  title?: string;
  console?: string;
  tool?: Tool;
  order?: Order;
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

      let createdAt = "";

      if (options.tool) {
        createdAt = game.tools[options.tool].createdAt;
      } else {
        Object.values(game.tools).forEach((tool) => {
          if (!createdAt || moment(tool.createdAt) > moment(createdAt)) {
            createdAt = tool.createdAt;
          }
        });
      }

      results.push({
        id: game.id,
        name: game.name,
        console,
        createdAt,
        tools: {
          saveEditor: game.tools.saveEditor,
          romEditor: game.tools.romEditor,
        },
      });
    }

    return results;
  }, []);

  games.sort((a, b) => {
    if (options.order && options.order === "createdAt") {
      return moment(b.createdAt).unix() - moment(a.createdAt).unix();
    }

    return a.name.localeCompare(b.name);
  });

  return games;
}
