import { get } from "svelte/store";

import { gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import { getRegionArray } from "$lib/utils/format";

import { EVENT_TABLE_OFFSET } from "./constants";

export enum SpriteType {
  Devil = 0x86,
  FlameDemon = 0x94,
  IceDemon = 0x98,
  ThunderDemon = 0x9b,
  WindDemon = 0x9e,
  EeathDemon = 0xa1,
  BeastDemon = 0xa4,
  ArchDemon = 0xa5,
  DemonLord = 0xa6,
  Succubus = 0xa9,
  FallenAngel = 0xac,
  Nightmare = 0xad,
  Lilim = 0xae,
  Lilith = 0xaf,
  Witch = 0xb3,
  MedusaHead = 0xb8,
  Imp = 0xb9,
  Zombie = 0xbe,
  Ghoul = 0xbf,
  Wight = 0xc0,
  ClinkingMan = 0xc1,
  ZombieThief = 0xc2,
  Skeleton = 0xc3,
  SkeletonBomber = 0xc6,
  ElectricSkeleton = 0xc9,
  SkeletonSpear = 0xcc,
  SkeletonAthlete = 0xcf,
  SkeletonMedalist = 0xd2,
  SkeletonBoomerang = 0xd5,
  SkeletonSoldier = 0xd7,
  SkeletonKnight = 0xd8,
  BoneTower = 0xd9,
  BoneHead = 0xda,
  AxeArmor = 0xde,
  FlameArmor = 0xe0,
  IceArmor = 0xe2,
  ThunderArmor = 0xe4,
  WindArmor = 0xe6,
  EarthArmor = 0xe8,
  PoisonArmor = 0xea,
  ForestArmor = 0xec,
  StoneArmor = 0xed,
  HolyArmor = 0xef,
  DarkArmor = 0xf2,
  Dullahan = 0xf9,
  Golem = 0xfa,
  Mudman = 0xfe,
  Fleaman = 0xff,
  Hopper = 0x100,
  Franken = 0x101,
  Mummy = 0x103,
  FrozenShade = 0x105,
  HeatShade = 0x107,
  WereWolf = 0x109,
  WerePanther = 0x10c,
  WereJaguar = 0x10d,
  WereBear = 0x10f,
  Hyena = 0x110,
  Grizzly = 0x115,
  FoxArcher = 0x116,
  FoxHunter = 0x117,
  Merman = 0x11c,
  Lizardman = 0x11d,
  Minotaur = 0x11e,
  WereHorse = 0x120,
  Arachne = 0x124,
  Harpy = 0x127,
  Siren = 0x128,
  Gargoyle = 0x12c,
  Gremlin = 0x12f,
  Bat = 0x131,
  Gorgon = 0x132,
  Catoblepas = 0x133,
  Hipogriff = 0x136,
  Spearfish = 0x139,
  Fishhead = 0x13a,
  DeathMantis = 0x13c,
  KingMoth = 0x13d,
  KillerBee = 0x13f,
  Alraune = 0x140,
  ManEater = 0x143,
  Myconid = 0x149,
  Dryad = 0x14a,
  MimicCandle = 0x14c,
  ScaryCandle = 0x14d,
  TrickCandle = 0x14e,
  DevilTower = 0x14f,
  EvilPillar = 0x150,
  Marionette = 0x155,
  Poltergeist = 0x158,
  BloodySword = 0x15c,
  PoisonWorm = 0x160,
  Abiondarg = 0x163,
  Slime = 0x165,
  EvilHand = 0x168,
  BrainFloat = 0x169,
  Spirit = 0x16e,
  Ectoplasm = 0x16f,
  Specter = 0x170,
  WillOWisp = 0x171,
  Legion = 0x172,
  // Cerberus = 0x174,
  // Necromancer = 0x17f,
  // IronGolem = 0x18a,
  // Adramelech = 0x191,
  // DragonZombie = 0x199,
  // Death = 0x1a6,
  // Camilla = 0x1b7,
  // Hugh = 0x1bf,
  Dracula1stform = 0x1ca,
  MorrisBaldwin = 0x1d0,
  Chandelier = 0x1de,
  Torch = 0x1df,
  StatsContainer = 0x1e4,
  DSSCard = 0x1e6,
  ShiningArmor = 0x1e7,
  MagicItem = 0x1e8,
  MovingBox = 0x1ea,
  DestructibleBlock = 0x1eb,
  Door = 0x1ec,
  Switch1 = 0x1ed,
  BlueBlock = 0x1ee,
  Switch2 = 0x1f1,
  BossDoor = 0x1f4,
  DestructiblePlatform1 = 0x1f5,
  DestructiblePlatform2 = 0x1f6,
  CollapsingPlatform = 0x1f7,
  HorizontalMovingPlatform = 0x1f9,
  VerticalMovingPlatform = 0x1fa,
  LastDoor = 0x1fd,
}

interface EnemySprite {
  index: number;
  isBoss: boolean;
  frameSkip: number;
}

export function getEnemySpriteInfos(type: number): EnemySprite | undefined {
  let index = -1;
  let isBoss = false;
  let frameSkip = 0;

  switch (type) {
    case SpriteType.Devil:
      index = 0x55;
      break;
    case SpriteType.FlameDemon:
      index = 0x16;
      break;
    case SpriteType.IceDemon:
      index = 0x1e;
      break;
    case SpriteType.ThunderDemon:
      index = 0x20;
      break;
    case SpriteType.WindDemon:
      index = 0x22;
      break;
    case SpriteType.EeathDemon:
      index = 0x25;
      break;
    case SpriteType.BeastDemon:
      index = 0x45;
      break;
    case SpriteType.ArchDemon:
      index = 0x46;
      break;
    case SpriteType.DemonLord:
      index = 0x47;
      break;
    case SpriteType.Succubus:
      index = 0x4a;
      break;
    case SpriteType.FallenAngel:
      index = 0x4b;
      break;
    case SpriteType.Nightmare:
      index = 0x8a;
      break;
    case SpriteType.Lilim:
      index = 0x8b;
      break;
    case SpriteType.Lilith:
      index = 0x8c;
      break;
    case SpriteType.Witch:
      index = 0x56;
      break;
    case SpriteType.MedusaHead:
      index = 0x0;
      break;
    case SpriteType.Imp:
      index = 0x2c;
      break;
    case SpriteType.Zombie:
      index = 0x1;
      break;
    case SpriteType.Ghoul:
      index = 0x2;
      break;
    case SpriteType.Wight:
      index = 0x3;
      break;
    case SpriteType.ClinkingMan:
      index = 0x4;
      break;
    case SpriteType.ZombieThief:
      index = 0x5;
      break;
    case SpriteType.Skeleton:
      index = 0x6;
      break;
    case SpriteType.SkeletonBomber:
      index = 0x7;
      break;
    case SpriteType.ElectricSkeleton:
      index = 0x8;
      break;
    case SpriteType.SkeletonSpear:
      index = 0x9;
      break;
    case SpriteType.SkeletonAthlete:
      index = 0x29;
      break;
    case SpriteType.SkeletonMedalist:
      index = 0x69;
      break;
    case SpriteType.SkeletonBoomerang:
      index = 0xa;
      break;
    case SpriteType.SkeletonSoldier:
      index = 0xb;
      break;
    case SpriteType.SkeletonKnight:
      index = 0xc;
      break;
    case SpriteType.BoneTower:
      index = 0xd;
      break;
    case SpriteType.BoneHead:
      index = 0x3f;
      break;
    case SpriteType.AxeArmor:
      index = 0x14;
      break;
    case SpriteType.FlameArmor:
      index = 0x15;
      break;
    case SpriteType.IceArmor:
      index = 0x17;
      break;
    case SpriteType.ThunderArmor:
      index = 0x18;
      break;
    case SpriteType.WindArmor:
      index = 0x19;
      break;
    case SpriteType.EarthArmor:
      index = 0x1a;
      break;
    case SpriteType.PoisonArmor:
      index = 0x1b;
      break;
    case SpriteType.ForestArmor:
      index = 0x1c;
      break;
    case SpriteType.StoneArmor:
      index = 0x1d;
      break;
    case SpriteType.HolyArmor:
      index = 0x1f;
      break;
    case SpriteType.DarkArmor:
      index = 0x21;
      break;
    case SpriteType.Dullahan:
      index = 0x63;
      break;
    case SpriteType.Golem:
      index = 0x24;
      break;
    case SpriteType.Mudman:
      index = 0x2d;
      break;
    case SpriteType.Fleaman:
      index = 0xe;
      break;
    case SpriteType.Hopper:
      index = 0x3b;
      break;
    case SpriteType.Franken:
      index = 0x61;
      break;
    case SpriteType.Mummy:
      index = 0x57;
      frameSkip = 3;
      break;
    case SpriteType.FrozenShade:
      index = 0x30;
      break;
    case SpriteType.HeatShade:
      index = 0x31;
      break;
    case SpriteType.WereWolf:
      index = 0x26;
      break;
    case SpriteType.WerePanther:
      index = 0x3d;
      break;
    case SpriteType.WereJaguar:
      index = 0x3e;
      break;
    case SpriteType.WereBear:
      index = 0x42;
      break;
    case SpriteType.Hyena:
      index = 0x4d;
      break;
    case SpriteType.Grizzly:
      index = 0x43;
      break;
    case SpriteType.FoxArcher:
      index = 0x40;
      break;
    case SpriteType.FoxHunter:
      index = 0x41;
      break;
    case SpriteType.Merman:
      index = 0x36;
      break;
    case SpriteType.Lizardman:
      index = 0x60;
      break;
    case SpriteType.Minotaur:
      index = 0x37;
      break;
    case SpriteType.WereHorse:
      index = 0x38;
      break;
    case SpriteType.Arachne:
      index = 0x5a;
      break;
    case SpriteType.Harpy:
      index = 0x2a;
      break;
    case SpriteType.Siren:
      index = 0x2b;
      break;
    case SpriteType.Gargoyle:
      index = 0x2e;
      break;
    case SpriteType.Gremlin:
      index = 0x3a;
      break;
    case SpriteType.Bat:
      index = 0x10;
      break;
    case SpriteType.Gorgon:
      index = 0x48;
      break;
    case SpriteType.Catoblepas:
      index = 0x49;
      break;
    case SpriteType.Hipogriff:
      index = 0x58;
      break;
    case SpriteType.Spearfish:
      index = 0x35;
      break;
    case SpriteType.Fishhead:
      index = 0x4e;
      break;
    case SpriteType.DeathMantis:
      index = 0x5b;
      break;
    case SpriteType.KingMoth:
      index = 0x5d;
      break;
    case SpriteType.KillerBee:
      index = 0x5e;
      break;
    case SpriteType.Alraune:
      index = 0x5c;
      frameSkip = 5;
      break;
    case SpriteType.ManEater:
      index = 0x27;
      break;
    case SpriteType.Myconid:
      index = 0x33;
      frameSkip = 2;
      break;
    case SpriteType.Dryad:
      index = 0x4f;
      break;
    case SpriteType.MimicCandle:
      index = 0x50;
      break;
    case SpriteType.ScaryCandle:
      index = 0x88;
      break;
    case SpriteType.TrickCandle:
      index = 0x89;
      break;
    case SpriteType.DevilTower:
      index = 0x28;
      break;
    case SpriteType.EvilPillar:
      index = 0x3c;
      break;
    case SpriteType.Marionette:
      index = 0x39;
      break;
    case SpriteType.Poltergeist:
      index = 0xf;
      frameSkip = 3;
      break;
    case SpriteType.BloodySword:
      index = 0x23;
      break;
    case SpriteType.PoisonWorm:
      index = 0x32;
      break;
    case SpriteType.Abiondarg:
      index = 0x53;
      break;
    case SpriteType.Slime:
      index = 0x2f;
      break;
    case SpriteType.EvilHand:
      index = 0x52;
      break;
    case SpriteType.BrainFloat:
      index = 0x51;
      break;
    case SpriteType.Spirit:
      index = 0x11;
      frameSkip = 4;
      break;
    case SpriteType.Ectoplasm:
      index = 0x12;
      frameSkip = 4;
      break;
    case SpriteType.Specter:
      index = 0x13;
      frameSkip = 4;
      break;
    case SpriteType.WillOWisp:
      index = 0x34;
      break;
    case SpriteType.Legion:
      index = 0x62;
      break;

    // Battle Arena
    // case 0x: index = 0x6a; break; // Were-jaguar
    // case 0x: index = 0x6b; break; // Were-wolf
    // case 0x: index = 0x6c; break; // Catoblepas
    // case 0x: index = 0x6d; break; // Hipogriff
    // case 0x: index = 0x6e; break; // Wind Demon
    // case 0x: index = 0x6f; break; // Witch
    // case 0x: index = 0x70; break; // Stone Armor
    // case 0x: index = 0x71; break; // Devil Tower
    // case 0x: index = 0x72; break; // Skeleton
    // case 0x: index = 0x73; break; // Skeleton Bomber
    // case 0x: index = 0x74; break; // Electric Skeleton
    // case 0x: index = 0x75; break; // Skeleton Spear
    // case 0x: index = 0x76; break; // Flame Demon
    // case 0x: index = 0x77; break; // Bone Tower
    // case 0x: index = 0x78; break; // Fox Hunter
    // case 0x: index = 0x79; break; // Poison Armor
    // case 0x: index = 0x7a; break; // Bloody Sword
    // case 0x: index = 0x7b; break; // Abiondarg
    // case 0x: index = 0x7c; break; // Legion
    // case 0x: index = 0x7d; break; // Marionette
    // case 0x: index = 0x7e; break; // Minotaur
    // case 0x: index = 0x7f; break; // Arachne
    // case 0x: index = 0x80; break; // Succubus
    // case 0x: index = 0x81; break; // Demon Lord
    // case 0x: index = 0x82; break; // Alraune
    // case 0x: index = 0x83; break; // Hyena
    // case 0x: index = 0x84; break; // Devil Armor
    // case 0x: index = 0x85; break; // Evil Pillar
    // case 0x: index = 0x86; break; // White Armor
    // case 0x: index = 0x87; break; // Devil

    // Bosses
    // case SpriteType.Cerberus: index = 0x44; isBoss = true; break; // Cerberus
    // case SpriteType.Necromancer: index = 0x4c; isBoss = true; break; // Necromancer
    // case SpriteType.IronGolem: index = 0x54; isBoss = true; break; // Iron Golem
    // case SpriteType.Adramelech: index = 0x59; isBoss = true; break; // Adramelech
    // case SpriteType.DragonZombie: index = 0x5f; isBoss = true; break; // Dragon Zombie
    // case SpriteType.Death: index = 0x64; isBoss = true; break; // Death
    // case SpriteType.Camilla: index = 0x65; isBoss = true; break; // Camilla
    // case SpriteType.Hugh: index = 0x66; isBoss = true; break; // Hugh
    // case 0x: index = 0x68; break; // Dracula 2nd form

    case SpriteType.Dracula1stform:
      index = 0x67;
      isBoss = true;
      break;
    case SpriteType.MorrisBaldwin:
      index = 0x67;
      isBoss = true;
      frameSkip = 22;
      break;
  }

  if (index !== -1) {
    return { index, isBoss, frameSkip };
  }
}

export function getSpriteFrameOffset(
  type: number,
  subtype: number,
  objectSetIndex: number,
  enemy?: EnemySprite,
): number {
  const $gameRegion = get(gameRegion);

  const eventsTableOffset = getRegionArray(EVENT_TABLE_OFFSET);
  const eventPointer = getInt(eventsTableOffset + type * 0x4, "uint24");

  let offset = 0x0;

  if (enemy) {
    const eventPointer = getInt(eventsTableOffset + 0x86 * 0x4, "uint24");
    const pointer = eventPointer + 0xf3 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesTable = getInt(
      framesInfosPointer + enemy.index * 0xc + 0x4,
      "uint24",
    );

    offset = framesTable;
  } else if (type === SpriteType.Chandelier) {
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
  } else if (type === SpriteType.Torch) {
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
  } else if (type === SpriteType.StatsContainer) {
    const pointer = eventPointer + 0xdb - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const spriteIndex = getInt(spriteIndexTable + subtype * 0x2, "uint16");
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.DSSCard) {
    const framesInfosPointer = getInt(eventPointer + 0xbf, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const spriteIndex = 0x3b;
    const frameIndex = getInt(
      framesIndexTable + spriteIndex * 0x4 + 0x2,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.ShiningArmor) {
    const framesTable = getInt(eventPointer + 0x1f7, "uint24");
    const spriteIndexTable = getInt(eventPointer + 0x1f3, "uint24");
    const spriteIndex = 0xa;
    const frameIndex = getInt(
      spriteIndexTable + spriteIndex * 0x4 + 0x4,
      "uint16",
    );

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.MagicItem) {
    const pointer = eventPointer + 0x1cb - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesTable = getInt(pointer, "uint24");
    const spriteIndexTable = getInt(pointer + 0x4, "uint24");
    const spriteIndex = spriteIndexTable + subtype * 0x2;
    const frameIndex = getInt(spriteIndex, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.MovingBox) {
    let spriteIndex = 0x0;

    switch (objectSetIndex) {
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
  } else if (type === SpriteType.DestructibleBlock) {
    let spriteIndex = 0x0;

    switch (objectSetIndex) {
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
  } else if (type === SpriteType.Door) {
    let spriteIndex = 0x0;

    switch (objectSetIndex) {
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
  } else if (type === SpriteType.Switch1) {
    const pointer = eventPointer + 0x153 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer + 0xc, "uint24");
    const framesTable = getInt(framesInfosPointer + 0xc + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable + 0xd * 0x4 + 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.BlueBlock) {
    const framesInfosPointer = getInt(eventPointer + 0x157, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");

    offset = framesTable + 0x9db * 0x8;
  } else if (type === SpriteType.Switch2) {
    const framesInfosPointer = getInt(eventPointer + 0x1ff, "uint24");
    const framesIndexTable = getInt(eventPointer + 0x203, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.BossDoor) {
    let spriteIndex = 0x0;

    switch (objectSetIndex - 0x3) {
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
  } else if (type === SpriteType.DestructiblePlatform1) {
    const pointer = eventPointer + 0x1e7 - ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.DestructiblePlatform2) {
    const pointer = eventPointer + 0x1e3 - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.CollapsingPlatform) {
    // Collapsing Platform
    const pointer = eventPointer + 0x1e3 - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.HorizontalMovingPlatform) {
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
  } else if (type === SpriteType.VerticalMovingPlatform) {
    const pointer = eventPointer + 0x20f - ($gameRegion === 0x2 ? 0x8 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(pointer + 0x4, "uint24");
    const framesTable = getInt(framesInfosPointer, "uint24");
    const frameIndex = getInt(framesIndexTable, "uint16");

    offset = framesTable + frameIndex * 0x8;
  } else if (type === SpriteType.LastDoor) {
    const pointer = eventPointer + 0x13b + ($gameRegion === 0x2 ? 0x4 : 0x0);
    const framesInfosPointer = getInt(pointer, "uint24");
    const framesIndexTable = getInt(framesInfosPointer, "uint24");
    const framesTable = getInt(framesInfosPointer + 0x4, "uint24");
    const frameIndex = getInt(framesIndexTable + 0x2, "uint16");

    offset = framesTable + frameIndex * 0x8;
  }

  return offset;
}
