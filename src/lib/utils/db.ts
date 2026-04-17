import moment from "moment";

import gamesDb from "$lib/db/games.json";
import platformsDb from "$lib/db/platforms.json";
import platformManufacturersDb from "$lib/db/platformsManufacturers.json";

import type { Game, Manufacturer, Platform } from "$lib/types";

export function getPlatform(platformId: string): Platform | undefined {
  const platforms = getPlatforms();

  return platforms.find((platform) => platform.id === platformId);
}

export function getPlatforms(): Platform[] {
  const platforms = platformsDb.reduce((platforms: Platform[], platform) => {
    platforms.push({
      id: platform.id,
      name: platform.name,
      manufacturer: platformManufacturersDb.find(
        (manufacturer) => manufacturer.id === platform.manufacturerId,
      ) as Manufacturer,
    });

    return platforms;
  }, []);

  return platforms;
}

export function getGame(gameId: string): Game | undefined {
  const games = getGames();

  return games.find((game) => game.id === gameId);
}

export type Tool = "saveEditor" | "romEditor" | "randomizer";

export type Order = "createdAt";

interface GameOptions {
  title?: string;
  platform?: string;
  tool?: Tool;
  order?: Order;
}

export function getGames(options: GameOptions = {}): Game[] {
  const games = gamesDb.reduce((results: Game[], game) => {
    if (
      (options.title &&
        !game.name.toLowerCase().match(options.title.toLowerCase())) ||
      (options.platform && !game.platformIds.includes(options.platform)) ||
      (options.tool && !game.tools[options.tool])
    ) {
      return results;
    }

    if (game.tools.saveEditor || game.tools.romEditor) {
      const platforms: Platform[] = [];

      game.platformIds.forEach((platformId) => {
        const platform = getPlatform(platformId);

        if (platform) {
          platforms.push(platform);
        }
      });

      let createdAt = "";

      if (options.tool) {
        createdAt = game.tools[options.tool]?.createdAt || "";
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
        metaName: game.metaName || game.name,
        platforms,
        createdAt,
        tools: {
          saveEditor: game.tools.saveEditor,
          romEditor: game.tools.romEditor,
          randomizer: game.tools.randomizer,
        },
      });
    }

    return results;
  }, []);

  if (options.order) {
    games.sort((a, b) => {
      if (options.order === "createdAt") {
        return moment(b.createdAt).unix() - moment(a.createdAt).unix();
      }

      return a.name.localeCompare(b.name, "en", { numeric: true });
    });
  }

  return games;
}

export function formatPlatforms(
  platforms: { id: string; name: string }[],
): string {
  return platforms.reduce(
    (platforms, platform) =>
      (platforms += `${platforms ? ", " : ""}${platform.name}`),
    "",
  );
}
