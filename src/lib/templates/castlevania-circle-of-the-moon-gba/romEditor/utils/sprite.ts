import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getRegionArray } from "$lib/utils/format";

import { EVENT_TABLE_OFFSET } from "./constants";

interface MonsterSprite {
  index: number;
  firstTile: number;
  isBoss: boolean;
  frameSkip: number;
}

export function getMonsterSpriteInfos(
  type: number,
  monsters: { index: number; firstTile: number }[],
): MonsterSprite | false {
  let monsterId = -1;
  let isBoss = false;
  let frameSkip = 0;

  switch (type) {
    case 0x86: // Devil
      monsterId = 0x55;
      break;
    case 0x94: // Flame Demon
      monsterId = 0x16;
      break;
    case 0x98: // Ice Demon
      monsterId = 0x1e;
      break;
    case 0x9b: // Thunder Demon
      monsterId = 0x20;
      break;
    case 0x9e: // Wind Demon
      monsterId = 0x22;
      break;
    case 0xa1: // Eeath Demon
      monsterId = 0x25;
      break;
    case 0xa4: // Beast Demon
      monsterId = 0x45;
      break;
    case 0xa5: // Arch Demon
      monsterId = 0x46;
      break;
    case 0xa6: // Demon Lord
      monsterId = 0x47;
      break;
    case 0xa9: // Succubus
      monsterId = 0x4a;
      break;
    case 0xac: // Fallen Angel
      monsterId = 0x4b;
      break;
    case 0xad: // Nightmare
      monsterId = 0x8a;
      break;
    case 0xae: // Lilim
      monsterId = 0x8b;
      break;
    case 0xaf: // Lilith
      monsterId = 0x8c;
      break;
    case 0xb3: // Witch
      monsterId = 0x56;
      break;
    case 0xb8: // Medusa Head
      monsterId = 0x0;
      break;
    case 0xb9: // Imp
      monsterId = 0x2c;
      break;
    case 0xbe: // Zombie
      monsterId = 0x1;
      break;
    case 0xbf: // Ghoul
      monsterId = 0x2;
      break;
    case 0xc0: // Wight
      monsterId = 0x3;
      break;
    case 0xc1: // Clinking Man
      monsterId = 0x4;
      break;
    case 0xc2: // Zombie Thief
      monsterId = 0x5;
      break;
    case 0xc3: // Skeleton
      monsterId = 0x6;
      break;
    case 0xc6: // Skeleton Bomber
      monsterId = 0x7;
      break;
    case 0xc9: // Electric Skeleton
      monsterId = 0x8;
      break;
    case 0xcc: // Skeleton Spear
      monsterId = 0x9;
      break;
    case 0xcf: // Skeleton Athlete
      monsterId = 0x29;
      break;
    case 0xd2: // Skeleton Medalist
      monsterId = 0x69;
      break;
    case 0xd5: // Skeleton Boomerang
      monsterId = 0xa;
      break;
    case 0xd7: // Skeleton Soldier
      monsterId = 0xb;
      break;
    case 0xd8: // Skeleton Knight
      monsterId = 0xc;
      break;
    case 0xd9: // Bone Tower
      monsterId = 0xd;
      break;
    case 0xda: // Bone Head
      monsterId = 0x3f;
      break;
    case 0xde: // Axe Armor
      monsterId = 0x14;
      break;
    case 0xe0: // Flame Armor
      monsterId = 0x15;
      break;
    case 0xe2: // Ice Armor
      monsterId = 0x17;
      break;
    case 0xe4: // Thunder Armor
      monsterId = 0x18;
      break;
    case 0xe6: // Wind Armor
      monsterId = 0x19;
      break;
    case 0xe8: // Earth Armor
      monsterId = 0x1a;
      break;
    case 0xea: // Poison Armor
      monsterId = 0x1b;
      break;
    case 0xec: // Forest Armor
      monsterId = 0x1c;
      break;
    case 0xed: // Stone Armor
      monsterId = 0x1d;
      break;
    case 0xef: // Holy Armor
      monsterId = 0x1f;
      break;
    case 0xf2: // Dark Armor
      monsterId = 0x21;
      break;
    case 0xf9: // Dullahan
      monsterId = 0x63;
      break;
    case 0xfa: // Golem
      monsterId = 0x24;
      break;
    case 0xfe: // Mudman
      monsterId = 0x2d;
      break;
    case 0xff: // Fleaman
      monsterId = 0xe;
      break;
    case 0x100: // Hopper
      monsterId = 0x3b;
      break;
    case 0x101: // Franken
      monsterId = 0x61;
      break;
    case 0x103: // Mummy
      monsterId = 0x57;
      frameSkip = 3;
      break;
    case 0x105: // Frozen Shade
      monsterId = 0x30;
      break;
    case 0x107: // Heat Shade
      monsterId = 0x31;
      break;
    case 0x109: // Were-wolf
      monsterId = 0x26;
      break;
    case 0x10c: // Were-panther
      monsterId = 0x3d;
      break;
    case 0x10d: // Were-jaguar
      monsterId = 0x3e;
      break;
    case 0x10f: // Were-bear
      monsterId = 0x42;
      break;
    case 0x110: // Hyena
      monsterId = 0x4d;
      break;
    case 0x115: // Grizzly
      monsterId = 0x43;
      break;
    case 0x116: // Fox Archer
      monsterId = 0x40;
      break;
    case 0x117: // Fox Hunter
      monsterId = 0x41;
      break;
    case 0x11c: // Merman
      monsterId = 0x36;
      break;
    case 0x11d: // Lizardman
      monsterId = 0x60;
      break;
    case 0x11e: // Minotaur
      monsterId = 0x37;
      break;
    case 0x120: // Were-horse
      monsterId = 0x38;
      break;
    case 0x124: // Arachne
      monsterId = 0x5a;
      break;
    case 0x127: // Harpy
      monsterId = 0x2a;
      break;
    case 0x128: // Siren
      monsterId = 0x2b;
      break;
    case 0x12c: // Gargoyle
      monsterId = 0x2e;
      break;
    case 0x12f: // Gremlin
      monsterId = 0x3a;
      break;
    case 0x131: // Bat
      monsterId = 0x10;
      break;
    case 0x132: // Gorgon
      monsterId = 0x48;
      break;
    case 0x133: // Catoblepas
      monsterId = 0x49;
      break;
    case 0x136: // Hipogriff
      monsterId = 0x58;
      break;
    case 0x139: // Spearfish
      monsterId = 0x35;
      break;
    case 0x13a: // Fishhead
      monsterId = 0x4e;
      break;
    case 0x13c: // Death Mantis
      monsterId = 0x5b;
      break;
    case 0x13d: // King Moth
      monsterId = 0x5d;
      break;
    case 0x13f: // Killer Bee
      monsterId = 0x5e;
      break;
    case 0x140: // Alraune
      monsterId = 0x5c;
      frameSkip = 5;
      break;
    case 0x143: // Man Eater
      monsterId = 0x27;
      break;
    case 0x149: // Myconid
      monsterId = 0x33;
      frameSkip = 2;
      break;
    case 0x14a: // Dryad
      monsterId = 0x4f;
      break;
    case 0x14c: // Mimic Candle
      monsterId = 0x50;
      break;
    case 0x14d: // Scary Candle
      monsterId = 0x88;
      break;
    case 0x14e: // Trick Candle
      monsterId = 0x89;
      break;
    case 0x14f: // Devil Tower
      monsterId = 0x28;
      break;
    case 0x150: // Evil Pillar
      monsterId = 0x3c;
      break;
    case 0x155: // Marionette
      monsterId = 0x39;
      break;
    case 0x158: // Poltergeist
      monsterId = 0xf;
      frameSkip = 3;
      break;
    case 0x15c: // Bloody Sword
      monsterId = 0x23;
      break;
    case 0x160: // Poison Worm
      monsterId = 0x32;
      break;
    case 0x163: // Abiondarg
      monsterId = 0x53;
      break;
    case 0x165: // Slime
      monsterId = 0x2f;
      break;
    case 0x168: // Evil Hand
      monsterId = 0x52;
      break;
    case 0x169: // Brain Float
      monsterId = 0x51;
      break;
    case 0x16e: // Spirit
      monsterId = 0x11;
      frameSkip = 4;
      break;
    case 0x16f: // Ectoplasm
      monsterId = 0x12;
      frameSkip = 4;
      break;
    case 0x170: // Specter
      monsterId = 0x13;
      frameSkip = 4;
      break;
    case 0x171: // Will O'Wisp
      monsterId = 0x34;
      break;
    case 0x172: // Legion
      monsterId = 0x62;
      break;

    // Battle Arena
    // case 0x: monsterId = 0x6a; break; // Were-jaguar
    // case 0x: monsterId = 0x6b; break; // Were-wolf
    // case 0x: monsterId = 0x6c; break; // Catoblepas
    // case 0x: monsterId = 0x6d; break; // Hipogriff
    // case 0x: monsterId = 0x6e; break; // Wind Demon
    // case 0x: monsterId = 0x6f; break; // Witch
    // case 0x: monsterId = 0x70; break; // Stone Armor
    // case 0x: monsterId = 0x71; break; // Devil Tower
    // case 0x: monsterId = 0x72; break; // Skeleton
    // case 0x: monsterId = 0x73; break; // Skeleton Bomber
    // case 0x: monsterId = 0x74; break; // Electric Skeleton
    // case 0x: monsterId = 0x75; break; // Skeleton Spear
    // case 0x: monsterId = 0x76; break; // Flame Demon
    // case 0x: monsterId = 0x77; break; // Bone Tower
    // case 0x: monsterId = 0x78; break; // Fox Hunter
    // case 0x: monsterId = 0x79; break; // Poison Armor
    // case 0x: monsterId = 0x7a; break; // Bloody Sword
    // case 0x: monsterId = 0x7b; break; // Abiondarg
    // case 0x: monsterId = 0x7c; break; // Legion
    // case 0x: monsterId = 0x7d; break; // Marionette
    // case 0x: monsterId = 0x7e; break; // Minotaur
    // case 0x: monsterId = 0x7f; break; // Arachne
    // case 0x: monsterId = 0x80; break; // Succubus
    // case 0x: monsterId = 0x81; break; // Demon Lord
    // case 0x: monsterId = 0x82; break; // Alraune
    // case 0x: monsterId = 0x83; break; // Hyena
    // case 0x: monsterId = 0x84; break; // Devil Armor
    // case 0x: monsterId = 0x85; break; // Evil Pillar
    // case 0x: monsterId = 0x86; break; // White Armor
    // case 0x: monsterId = 0x87; break; // Devil

    // Bosses
    // case 0x174: monsterId = 0x44; isBoss = true; break; // Cerberus
    // case 0x17f: monsterId = 0x4c; isBoss = true; break; // Necromancer
    // case 0x18a: monsterId = 0x54; isBoss = true; break; // Iron Golem
    // case 0x191: monsterId = 0x59; isBoss = true; break; // Adramelech
    // case 0x199: monsterId = 0x5f; isBoss = true; break; // Dragon Zombie
    // case 0x1a6: monsterId = 0x64; isBoss = true; break; // Death
    // case 0x1b7: monsterId = 0x65; isBoss = true; break; // Camilla
    // case 0x1bf: monsterId = 0x66; isBoss = true; break; // Hugh
    // case 0x: monsterId = 0x68; break; // Dracula 2nd form

    case 0x1ca: // Dracula 1st form
      monsterId = 0x67;
      isBoss = true;
      break;
    case 0x1d0: // Morris Baldwin
      monsterId = 0x67;
      isBoss = true;
      frameSkip = 22;
      break;
  }

  const monsterIndex = monsters.findIndex(
    (monster) => monster.index === monsterId,
  );

  const monster = monsterId !== -1 && monsters[monsterIndex];

  if (monster) {
    return { ...monster, isBoss, frameSkip };
  }

  return false;
}

export function getSpriteFrameOffset(
  type: number,
  spriteId: number,
  spriteSpecial: number,
  monster: MonsterSprite | false,
): number {
  const $gameRegion = get(gameRegion);

  const eventsTableOffset = getRegionArray(EVENT_TABLE_OFFSET);
  const eventPointer = getInt(eventsTableOffset + type * 0x4, "uint24");

  let offset = 0x0;

  if (monster) {
    const pointer =
      getInt(eventsTableOffset + 0x86 * 0x4, "uint24") +
      0xf3 -
      ($gameRegion === 0x2 ? 0x4 : 0x0);

    const framesInfosPointer = getInt(pointer, "uint24");
    const framesTable = getInt(
      framesInfosPointer + monster.index * 0xc + 0x4,
      "uint24",
    );

    offset = framesTable;
  } else if (type === 0x1de) {
    // Chandelier
    const pointer = eventPointer + 0x103 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndex = getInt(pointer + 0xc, "uint8");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1df) {
    // Torch
    const pointer = eventPointer + 0xbb - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndex = getInt(pointer + 0x1a, "uint8");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1e4) {
    // Stats Container
    const pointer = eventPointer + 0xdb - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const spriteIndex = getInt(spriteIndexTable + spriteId * 0x2, "uint16");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1e6) {
    // DSS Card
    const framesInfosPointer = getInt(eventPointer + 0xbf, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndex = 0x3b;
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1e7) {
    // Shining Armor
    const framesTable = getInt(eventPointer + 0x1f7, "uint24");
    const spriteIndexTable = getInt(eventPointer + 0x1f3, "uint24");
    const spriteIndex = 0xa;
    const frameIndex = getInt(
      spriteIndexTable + spriteIndex * 0x4 + 0x4,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1e8) {
    // Magic Item
    const pointer = eventPointer + 0x1cb - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesTable = getInt(pointer, "uint24");
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const spriteIndex = spriteIndexTable + spriteId * 0x2;
    const frameIndex = getInt(spriteIndex, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1ea) {
    // Moving Box
    let spriteIndex = 0x0;

    switch (spriteSpecial) {
      case 0x0:
      case 0x1:
        spriteIndex = 0x0;
        break;
      case 0x2:
        spriteIndex = 0x1;
        break;
      case 0x6:
        spriteIndex = 0x2;
        break;
      case 0xc:
        spriteIndex = 0x3;
        break;
    }

    const pointer = eventPointer + 0x233 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesTable = getInt(
      framesInfosPointer + spriteIndex * 0x4,
      "uint24",
    );
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const frameIndex = getInt(spriteIndexTable + spriteIndex * 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1eb) {
    // Destructible Block
    let spriteIndex = 0x0;

    switch (spriteSpecial) {
      case 0x0:
      case 0x1:
      case 0x2:
      case 0x3:
      case 0x4:
      case 0x5:
        spriteIndex = 0x0;
        break;
      case 0x6:
        spriteIndex = 0x1;
        break;
      case 0x9:
        spriteIndex = 0x2;
        break;
    }

    const pointer = eventPointer + 0x237 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesTable = getInt(
      framesInfosPointer + spriteIndex * 0x4,
      "uint24",
    );
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const frameIndex = getInt(spriteIndexTable + spriteIndex * 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1ec) {
    // Door
    let spriteIndex = 0x0;

    switch (spriteSpecial) {
      case 0x0:
        spriteIndex = 0x0;
        break;
      case 0x1:
        spriteIndex = 0x1;
        break;
      case 0x2:
        spriteIndex = 0x2;
        break;
      case 0x4:
      case 0x5:
        spriteIndex = 0x3;
        break;
      case 0x6:
        spriteIndex = 0x4;
        break;
      case 0xa:
        spriteIndex = 0x5;
        break;
      case 0xc:
        spriteIndex = 0x6;
        break;
      case 0xd:
        spriteIndex = 0x7;
        break;
      case 0xe:
        spriteIndex = 0x8;
        break;
    }

    const pointer = eventPointer + 0x143 + ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(
      framesInfosPointer + spriteIndex * 0xc,
      "uint24",
    );
    const framesTable = getInt(
      framesInfosPointer + spriteIndex * 0xc + 0x4,
      "uint24",
    );
    const frameIndex = getInt(framesIndexTable + 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1ed) {
    // Switch
    const pointer = eventPointer + 0x153 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer + 0xc, "uint24");
    const framesTable = getInt(framesInfosPointer + 0xc + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable + 0xd * 0x4 + 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1ee) {
    // Blue Block
    const framesInfosPointer = getInt(eventPointer + 0x157, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");

    offset = framesTable + 0x9db * 0x8;
  } else if (type === 0x1f1) {
    // Switch
    const framesInfosPointer = getInt(eventPointer + 0x1ff, "uint24");
    const framesIndexTable = getInt(eventPointer + 0x203, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1f4) {
    // Boss Door
    let spriteIndex = 0x0;

    switch (spriteSpecial - 0x3) {
      case 0x0:
        spriteIndex = 0x0;
        break;
      case 0x1:
      case 0x2:
        spriteIndex = 0x2;
        break;
      case 0x4:
        spriteIndex = 0x1;
        break;
      case 0x6:
        spriteIndex = 0x3;
        break;
      case 0xc:
        spriteIndex = 0x4;
        break;
    }

    const pointer = eventPointer + 0x15b + ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(
      framesInfosPointer + spriteIndex * 0xc,
      "uint24",
    );
    const framesTable = getInt(
      framesInfosPointer + spriteIndex * 0xc + 0x4,
      "uint24",
    );
    const spriteIndexTable = framesInfosPointer + 0x3e;
    spriteIndex = getInt(spriteIndexTable + spriteIndex * 0x4, "uint16");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1f5) {
    // Destructible Platform
    const pointer = eventPointer + 0x1e7 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1f6) {
    // Destructible Platform
    const pointer = eventPointer + 0x1e3 - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1f7) {
    // Collapsing Platform
    const pointer = eventPointer + 0x1e3 - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1f9) {
    // Horizontal Moving Platform
    const pointer = eventPointer + 0xff - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndexTable = getInt(
      pointer + 0x138 - ($gameRegion === 0x2 ? 0x4 : 0x0),
      "uint24",
    );
    const spriteIndex = getInt(spriteIndexTable, "uint16");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1fa) {
    // Vertical Moving Platform
    const pointer = eventPointer + 0x20f - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === 0x1fd) {
    // Last Door
    const pointer = eventPointer + 0x13b + ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable + 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  }

  return offset;
}
