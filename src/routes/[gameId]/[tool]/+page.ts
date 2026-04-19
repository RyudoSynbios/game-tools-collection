import { error, redirect } from "@sveltejs/kit";

import { gameTemplate, gameUtils } from "$lib/stores";
import { getGame, type Tool } from "$lib/utils/db.js";
import debug from "$lib/utils/debug";

import type { Game } from "$lib/types.js";

export interface Data {
  game: Game;
}

export async function load({ params }): Promise<void> {
  let tool: Tool;

  const redirectRoute = getRedirectRoute(params.gameId);

  if (redirectRoute) {
    redirect(301, `/${redirectRoute}/${params.tool}`);
  }

  if (params.tool === "save-editor") {
    tool = "saveEditor";
  } else if (params.tool === "rom-editor") {
    tool = "romEditor";
  } else if (params.tool === "randomizer") {
    tool = "randomizer";
  } else {
    error(404, {
      message: "Not found",
    });
  }

  const game = getGame(params.gameId);

  if (!game || !game.tools[tool]) {
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
  } catch {
    debug.error(
      `Couldn't load utils "templates/${params.gameId}/${tool}/utils.ts".`,
    );
  }

  gameTemplate.set(template);
}

function getRedirectRoute(route: string): string {
  switch (route) {
    case "dot-hack-infection-ps2":
      return "dot-hack-infection";
    case "dot-hack-mutation-ps2":
      return "dot-hack-mutation";
    case "dot-hack-outbreak-ps2":
      return "dot-hack-outbreak";
    case "dot-hack-quarantine-ps2":
      return "dot-hack-quarantine";
    case "007-agent-under-fire-ps2":
      return "007-agent-under-fire";
    case "1080-snowboarding-n64":
      return "1080-snowboarding";
    case "3d-dot-game-heroes-ps3":
      return "3d-dot-game-heroes";
    case "actraiser-snes":
      return "actraiser";
    case "akumajou-dracula-x-chi-no-rondo-pcecd":
      return "akumajou-dracula-x-chi-no-rondo";
    case "azure-dreams-gbc":
      return "azure-dreams";
    case "banjo-kazooie-n64":
      return "banjo-kazooie";
    case "banjo-tooie-n64":
      return "banjo-tooie";
    case "bloodstained-ritual-of-the-night-windows":
      return "bloodstained-ritual-of-the-night";
    case "bomberman-64-n64":
      return "bomberman-64";
    case "bouncer-the-ps2":
      return "bouncer-the";
    case "castlevania-n64":
      return "castlevania";
    case "castlevania-aria-of-sorrow-gba":
      return "castlevania-aria-of-sorrow";
    case "castlevania-circle-of-the-moon-gba":
      return "castlevania-circle-of-the-moon";
    case "castlevania-dawn-of-sorrow-ds":
      return "castlevania-dawn-of-sorrow";
    case "castlevania-harmony-of-dissonance-gba":
      return "castlevania-harmony-of-dissonance";
    case "castlevania-order-of-ecclesia-ds":
      return "castlevania-order-of-ecclesia";
    case "castlevania-portrait-of-ruin-ds":
      return "castlevania-portrait-of-ruin";
    case "castlevania-symphony-of-the-night-ps":
      return "castlevania-symphony-of-the-night";
    case "chrono-cross-ps":
      return "chrono-cross";
    case "chrono-trigger-snes":
      return "chrono-trigger";
    case "crash-bandicoot-ps":
      return "crash-bandicoot";
    case "crisis-core-final-fantasy-vii-reunion-windows":
      return "crisis-core-final-fantasy-vii-reunion";
    case "ctr-crash-team-racing-ps":
      return "ctr-crash-team-racing";
    case "dead-or-alive-2-ps2":
      return "dead-or-alive-2";
    case "diablo-ii-lord-of-destruction-windows":
      return "diablo-ii-lord-of-destruction";
    case "diddy-kong-racing-n64":
      return "diddy-kong-racing";
    case "dissidia-012-duodecim-final-fantasy-psp":
      return "dissidia-012-duodecim-final-fantasy";
    case "donkey-kong-64-n64":
      return "donkey-kong-64";
    case "donkey-kong-country-snes":
      return "donkey-kong-country";
    case "donkey-kong-country-2-diddy-s-kong-quest-snes":
      return "donkey-kong-country-2-diddy-s-kong-quest";
    case "donkey-kong-land-gb":
      return "donkey-kong-land";
    case "dragon-ball-z-budokai-tenkaichi-2-ps2":
      return "dragon-ball-z-budokai-tenkaichi-2";
    case "dragon-quest-the-journey-of-the-cursed-king-ps2":
      return "dragon-quest-the-journey-of-the-cursed-king";
    case "f-zero-snes":
      return "f-zero";
    case "f-zero-x-n64":
      return "f-zero-x";
    case "final-fantasy-nes":
      return "final-fantasy";
    case "final-fantasy-iv-pixel-remaster-windows":
      return "final-fantasy-iv-pixel-remaster";
    case "final-fantasy-vi-snes":
      return "final-fantasy-vi";
    case "final-fantasy-vii-remake-windows":
      return "final-fantasy-vii-remake";
    case "final-fantasy-vii-rebirth-windows":
      return "final-fantasy-vii-rebirth";
    case "final-fantasy-viii-ps":
      return "final-fantasy-viii";
    case "final-fantasy-ix-ps":
      return "final-fantasy-ix";
    case "final-fantasy-tactics-ps":
      return "final-fantasy-tactics";
    case "final-fight-one-gba":
      return "final-fight-one";
    case "fire-emblem":
    case "fire-emblem-gba":
      return "fire-emblem-the-blazing-blade";
    case "game-and-watch-gallery-3-gbc":
      return "game-and-watch-gallery-3";
    case "game-boy-camera-gb":
      return "game-boy-camera";
    case "gex-64-enter-the-gecko-n64":
      return "gex-64-enter-the-gecko";
    case "golden-sun-gba":
      return "golden-sun";
    case "golden-sun-the-lost-age-gba":
      return "golden-sun-the-lost-age";
    case "goldeneye-007-n64":
      return "goldeneye-007";
    case "grandia-ps":
      return "grandia";
    case "grandia-ii-ps2":
      return "grandia-ii";
    case "half-minute-hero-psp":
      return "half-minute-hero";
    case "holy-magic-century-n64":
      return "holy-magic-century";
    case "kingdom-hearts-ps2":
      return "kingdom-hearts";
    case "kingdom-hearts-chain-of-memories-gba":
      return "kingdom-hearts-chain-of-memories";
    case "kirby-s-adventure-nes":
      return "kirby-s-adventure";
    case "konami-krazy-racers-gba":
      return "konami-krazy-racers";
    case "kurukuru-kururin-gba":
      return "kurukuru-kururin";
    case "legend-of-zelda-the-a-link-to-the-past-snes":
      return "legend-of-zelda-the-a-link-to-the-past";
    case "legend-of-zelda-the-link-s-awakening-dx":
    case "legend-of-zelda-the-link-s-awakening-dx-gbc":
      return "legend-of-zelda-the-link-s-awakening";
    case "legend-of-zelda-the-majora-s-mask-n64":
      return "legend-of-zelda-the-majora-s-mask";
    case "legend-of-zelda-the-ocarina-of-time-n64":
      return "legend-of-zelda-the-ocarina-of-time";
    case "legend-of-zelda-the-oracle-of-ages-gbc":
      return "legend-of-zelda-the-oracle-of-ages";
    case "legend-of-zelda-the-oracle-of-seasons-gbc":
      return "legend-of-zelda-the-oracle-of-seasons";
    case "legend-of-zelda-the-the-minish-cap-gba":
      return "legend-of-zelda-the-the-minish-cap";
    case "luigi-s-mansion-gc":
      return "luigi-s-mansion";
    case "lylat-wars-n64":
      return "lylat-wars";
    case "mario-kart-64-n64":
      return "mario-kart-64";
    case "mario-party-n64":
      return "mario-party";
    case "mario-party-2-n64":
      return "mario-party-2";
    case "marvel-vs-capcom-2-new-age-of-heroes-dc":
      return "marvel-vs-capcom-2-new-age-of-heroes";
    case "mission-impossible-n64":
      return "mission-impossible";
    case "muramasa-the-demon-blade-wii":
      return "muramasa-the-demon-blade";
    case "mystic-quest-legend-snes":
      return "mystic-quest-legend";
    case "mystical-ninja-starring-goemon-n64":
      return "mystical-ninja-starring-goemon";
    case "mystical-ninja-2-starring-goemon-n64":
      return "mystical-ninja-2-starring-goemon";
    case "octopath-traveler-windows":
      return "octopath-traveler";
    case "octopath-traveler-ii-windows":
      return "octopath-traveler-ii";
    case "paper-mario-n64":
      return "paper-mario";
    case "paper-mario-the-thousand-year-door-gc":
      return "paper-mario-the-thousand-year-door";
    case "pokemon-red-blue-and-yellow-gb":
      return "pokemon-red-blue-and-yellow";
    case "pokemon-gold-silver-and-crystal-gbc":
      return "pokemon-gold-silver-and-crystal";
    case "pokemon-snap-n64":
      return "pokemon-snap";
    case "pokemon-trading-card-game-gbc":
      return "pokemon-trading-card-game";
    case "rayman-ps":
      return "rayman";
    case "rayman-2-the-great-escape-n64":
      return "rayman-2-the-great-escape";
    case "resident-evil-ps":
      return "resident-evil";
    case "rogue-legacy-windows":
      return "rogue-legacy";
    case "shining-force-3-saturn":
    case "shining-force-3-scenario-1-saturn":
      return "shining-force-3";
    case "shining-the-holy-ark-saturn":
      return "shining-the-holy-ark";
    case "skies-of-arcadia-legends-gc":
      return "skies-of-arcadia-legends";
    case "solatorobo-red-the-hunter-ds":
      return "solatorobo-red-the-hunter";
    case "soleil-md":
      return "soleil";
    case "sonic-3-md":
      return "sonic-3";
    case "sonic-advance-gba":
      return "sonic-advance";
    case "sonic-advance-2-gba":
      return "sonic-advance-2";
    case "sonic-advance-3-gba":
      return "sonic-advance-3";
    case "sonic-adventure-2-battle-gc":
      return "sonic-adventure-2-battle";
    case "sonic-rush-ds":
      return "sonic-rush";
    case "super-mario-64-n64":
      return "super-mario-64";
    case "super-mario-galaxy-wii":
      return "super-mario-galaxy";
    case "super-mario-galaxy-2-wii":
      return "super-mario-galaxy-2";
    case "super-mario-kart-snes":
      return "super-mario-kart";
    case "super-mario-sunshine-gc":
      return "super-mario-sunshine";
    case "super-metroid-snes":
      return "super-metroid";
    case "super-punch-out-snes":
      return "super-punch-out";
    case "super-smash-bros-n64":
      return "super-smash-bros";
    case "super-smash-bros-melee-gc":
      return "super-smash-bros-melee";
    case "super-street-fighter-ii-turbo-revival-gba":
      return "super-street-fighter-ii-turbo-revival";
    case "theatrhythm-final-fantasy-curtain-call-3ds":
      return "theatrhythm-final-fantasy-curtain-call";
    case "timesplitters-2-ps2":
      return "timesplitters-2";
    case "tomb-raider-ii-starring-lara-croft-ps":
      return "tomb-raider-ii-starring-lara-croft";
    case "tony-hawk-s-skateboarding-ps":
      return "tony-hawk-s-skateboarding";
    case "wario-land-super-mario-land-3-gb":
      return "wario-land-super-mario-land-3";
    case "wario-land-3-gbc":
      return "wario-land-3";
    case "wario-land-4-gba":
      return "wario-land-4";
  }

  return "";
}
