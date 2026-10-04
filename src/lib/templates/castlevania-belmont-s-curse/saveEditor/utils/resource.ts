import type { Resource, ResourceGroups } from "$lib/types";

// prettier-ignore
export const arcanaList = [
  { id: "CursedFireBall"         , name: "Cursed Flame" },
  { id: "BoomerangCross"         , name: "Holy Cross" },
  { id: "FireSeismicWave"        , name: "Infernal Pyre" },
  { id: "PetrifyingRay"          , name: "Petrifying Gaze" },
  { id: "GiantFist"              , name: "Fist of Talos" },
  { id: "InvocationStone"        , name: "Masterpiece" },
  { id: "BloodSpikes"            , name: "Blood Spikes" },
  { id: "LaserScytheSlash"       , name: "Soul Harvest" },
  { id: "TargetingChargingWheels", name: "Wheel of Chaos" },
  { id: "FreezingMist"           , name: "Freezing Path" },
  { id: "RiseAndFall"            , name: "Chronomantic Dive" },
  { id: "LifeDrain"              , name: "Life Drain" },
  { id: "GlassArmor"             , name: "Stained-Glass Shield" },
  { id: "Detainment"             , name: "Chains of Justice" },
  { id: "PocketMirror"           , name: "Mirror Walk" },
];

export const arcanas = arcanaList.reduce((arcanas: Resource, arcana, index) => {
  arcanas[index] = arcana.name;

  return arcanas;
}, {});

export const cardTypes = [
  { index: 0x0, name: "The Cursed" },
  { index: 0x1, name: "The Fallen" },
  { index: 0x2, name: "The Warrior" },
  { index: 0x3, name: "The Prophetess" },
  { index: 0x4, name: "The Builder" },
  { index: 0x5, name: "The Artist" },
  { index: 0x6, name: "The Occultist" },
  { index: 0x7, name: "The Shadow" },
  { index: 0x8, name: "The Miser" },
  { index: 0x9, name: "The Whisperer" },
  { index: 0xa, name: "The Zealot" },
  { index: 0xb, name: "The Temptress" },
  { index: 0xc, name: "The Brittle King" },
  { index: 0xd, name: "The Judge" },
  { index: 0xe, name: "The Sage" },
];

// prettier-ignore
export const cardList = [
  { id: "Clue_Doppelganger_FirstCard"   , type: 0x0, name: "The First Card" },
  { id: "Clue_Doppelganger_Prophecy"    , type: 0x0, name: "The Prophecy" },
  { id: "Clue_Leon_HiddenLever"         , type: 0x1, name: "A Lever for the Well" },
  { id: "Clue_Leon_BossDoor"            , type: 0x1, name: "A Monster terrorizes Paris" },
  { id: "Clue_JoanArc_TowerLocation"    , type: 0x2, name: "The Warrior is at the top of the Tower" },
  { id: "Clue_JoanArc_TowerShortcut"    , type: 0x2, name: "Carpenter's Crane Sketch" },
  { id: "Clue_Medusa_CemetaryFountain"  , type: 0x3, name: "???" }, // TODO:
  { id: "Clue_Medusa_HollowTree"        , type: 0x3, name: "???" }, // TODO:
  { id: "Clue_Medusa_SpecialAttack"     , type: 0x3, name: "Guardian's Gaze" },
  { id: "Clue_Medusa_RomanBaths"        , type: 0x3, name: "???" }, // TODO:
  { id: "Clue_Talos_ArchitectLocation"  , type: 0x4, name: "Builder flees to the Clock Tower" },
  { id: "Clue_Talos_ArchitectShortcut"  , type: 0x4, name: "Blueprints for the Clock Tower" },
  { id: "Clue_Brauner_NotreDamePainting", type: 0x5, name: "A Strange Painting of Notre-Dame" },
  { id: "Clue_Brauner_MainHallLocation" , type: 0x5, name: "Artist hides in the Main Hall" },
  { id: "Clue_Brauner_AlucardPainting"  , type: 0x5, name: "Alucard Guides" },
  { id: "Clue_Brauner_StatueInstruction", type: 0x5, name: 'Brauner\'s "Masterpiece"' },
  { id: "Clue_Carmilla_BraunerNote"     , type: 0x6, name: "Carmilla in the Library" },
  { id: "Clue_Carmilla_ToolSTheft"      , type: 0x6, name: "Magical Brush" },
  { id: "Clue_Carmilla_DiaryRequest"    , type: 0x6, name: "Star Chart" },
  { id: "Clue_Carmilla_PlanetList"      , type: 0x6, name: "Organic Astrology" },
  { id: "Clue_Carmilla_BloodPoem"       , type: 0x6, name: "Blood Poem" },
  { id: "Clue_Death_Catacombs"          , type: 0x7, name: "Death Mark" },
  { id: "Clue_Death_MaestrosLocations"  , type: 0x7, name: "The Masters of Music hide from Death" },
  { id: "Clue_Death_OrganPipes"         , type: 0x7, name: "The Corrupted Pipes of the Notre-Dame Organ" },
  { id: "Clue_Death_Concerto"           , type: 0x7, name: "Melody Sheet for the Concerto of Notre-Dame" },
  { id: "Clue_Death_Sonata"             , type: 0x7, name: "Melody Sheet for the Sonata of Notre-Dame" },
  { id: "Clue_Death_MelodiesNumber"     , type: 0x7, name: "Melody Sheet for the Fugue of Notre-Dame" },
  { id: "Clue_Mammon_DiaryJanuary"      , type: 0x8, name: "Tomb Relic" },
  { id: "Clue_Mammon_DiaryFebruary"     , type: 0x8, name: "Hospital Relic" },
  { id: "Clue_Mammon_DiaryMarch"        , type: 0x8, name: "Catacomb Relic" },
  { id: "Clue_Mammon_EyesDoor"          , type: 0x8, name: "A Door made of Flesh and Eyes" },
  { id: "Clue_Ferryman_MissingCoins"    , type: 0x9, name: "Stolen Oboles" },
  { id: "Clue_Isaac_BossLocation"       , type: 0xa, name: "Isaac waits in the Clock Tower" },
  { id: "Clue_Succubus_HoMLocation"     , type: 0xb, name: "The Temptress guards the Hall of Mirrors" },
  { id: "Clue_Arthur_ExcaliburStele"    , type: 0xc, name: "Feat of Strength" },
  { id: "Clue_SaintLouis_ScaleText"     , type: 0xd, name: "Balancing the Scales of Justice" },
  { id: "Clue_Eleanor_SealsLocation"    , type: 0xe, name: "A Sketch from Talos" },
  { id: "Clue_Eleanor_KneelDown"        , type: 0xe, name: "Kneeling is the Way" },
  { id: "Clue_Eleanor_TrueWay"          , type: 0xe, name: "The Reflection Deceives" },
  { id: "Clue_Eleanor_Escaping"         , type: 0xe, name: "Eleanor flees to the cemetary" },
];

// prettier-ignore
export const keyItemList = [
  { id: "CatacombsGateKeyLeon"  , name: "The Fallen's Key" },
  { id: "CatacombsGateKeyJeanne", name: "The Warrior's Key" },
  { id: "CatacombsGateKeyMedusa", name: "The Prophetess's Key" },
  { id: "FerrymanCompletionKey" , name: "Ferryman's Obol" },
  { id: "NotreDameKey"          , name: "Brauner's Paintbrush" },
];

// prettier-ignore
export const moveList = [
  { id: "WhipPendulum", moveId: "71276b8978cebc848aaf094a91bee40e", name: "Arcane Whip" },
  { id: "VaniaLight"  , moveId: "de8186906ea0812439ed17a8a49f813a", name: "Holy Light" },
  { id: "AerialDash"  , moveId: "6f258a566021a4442839fbe32b2b10a5", name: "Aerial Rush" },
  { id: "DoubleJump"  , moveId: "15b5c745d645ff7418900e6df0670fd6", name: "Double Jump" },
];

// prettier-ignore
export const relicList = [
  { id: "Charm_ChestRecover"                    , name: "Crypt Key" },
  { id: "Charm_BoostDamageAfterSpell"           , name: "Twilight Gem" },
  { id: "Charm_BoostDamageOnControlledMob"      , name: "Abyssal Eye" },
  { id: "Charm_PotionGiveMana"                  , name: "Nightshade" },
  { id: "Charm_BoostDamageWhenUnGrounded"       , name: "Raven's Feather" },
  { id: "Charm_KillMobBoostDamageInflicted"     , name: "Necro Charm" },
  { id: "Charm_BoostDamageAfterBreak"           , name: "Obsidian Fang" },
  { id: "Charm_BoostDefenseOnLowLife"           , name: "Shadow Veil" },
  { id: "Charm_KillMobBoostSpeed"               , name: "Mourning Bead" },
  { id: "Charm_BoostDamageOnLowLife"            , name: "Specter's Whisper" },
  { id: "Charm_BoostDamageFullLife"             , name: "Forsaken Ring" },
  { id: "Charm_LongerMobStagger"                , name: "Ebony Claw" },
  { id: "Charm_HealthPotionHealFullLife"        , name: "Witch's Knot" },
  { id: "Charm_BoostDefenseForTrap"             , name: "Ghostly Pendant" },
  { id: "Charm_BoostDamageOnMobFullLife"        , name: "Sinister Rune" },
  { id: "Charm_NerfDmgOnLowMana"                , name: "Midnight Tear" },
  { id: "Charm_ParryGiveMana"                   , name: "Grim Token" },
  { id: "Charm_BoostDamageAfterParry"           , name: "Cursed Coin" },
  { id: "Charm_ExtraPotionAfterSave"            , name: "Blood Vial" },
  { id: "Charm_GetManaFromDmgReceived"          , name: "Banshee's Wail" },
  { id: "Charm_RoomChangeResetMobSpawner"       , name: "Phantom Ring" },
  { id: "Charm_BoostXPKillMobFullLife"          , name: "Moonlit Shard" },
  { id: "Charm_BoostDamageBackHit"              , name: "Vile Trinket" },
  { id: "Charm_BoostManaKillMob"                , name: "Revenant's Charm" },
  { id: "Charm_KillMobRevengeHeal"              , name: "Wraith's Tear" },
  { id: "Charm_ReduceSpellManaCostSpam"         , name: "Lich's Mark" },
  { id: "Charm_BoostDamageBackReduceDamageFront", name: "Pale Thorn" },
  { id: "Charm_BoostDamageButReduceLife"        , name: "Beelzebub's Seal" },
  { id: "Charm_BoostManaOnDmgLowLife"           , name: "???" }, // TODO:
  { id: "Charm_BoostDamagePerEmptyPotion"       , name: "Witch's Brew" },
  { id: "Charm_InvulnerabilityAfterSave"        , name: "Eldritch Talisman" },
  { id: "Charm_ClampMCMana"                     , name: "Infernal Medallion" },
  { id: "Charm_BatPet"                          , name: "Vampire's Fang" },
  { id: "MammonKeyMines"                        , name: "Thrilling Eye" },
  { id: "MammonKeyCrossFire"                    , name: "Oozing Eye" },
  { id: "MammonKeyHoming"                       , name: "Trembling Eye" },
  { id: "Charm_BoostDefenseOnFullLife"          , name: "Dark Sigil" },
  { id: "Charm_RevealSecret"                    , name: "Gloomstone" },
  { id: "Charm_GainHPHitMobNoPotion"            , name: "Blackened Heart" },
  { id: "Charm_BoostSpeedAfterWhip"             , name: "Hollow Bone" },
  { id: "Charm_BoostSpeedLowMana"               , name: "Dusk Amulet" },
  { id: "Charm_ConsummableChanceBoost"          , name: "Crystallized Blood" },
  { id: "Charm_BoostSpeedAfterSave"             , name: "Sand Charm" },
  { id: "Charm_BoostDefenseAfterGettingHit"     , name: "Haunting Relic" },
  { id: "Charm_TankOneHit"                      , name: "Family's Grace" },
];

export const relics = relicList.reduce((relics: Resource, relic, index) => {
  relics[index] = relic.name;

  return relics;
}, {});

// prettier-ignore
export const skinList = [
  { id: "Skin_MC_Base"        , name: "Rose's Outfit" },
  { id: "Skin_MC_Trevor"      , name: "Trevor Style Costume" },
  { id: "Skin_MC_Sypha"       , name: "Sypha Style Costume" },
  { id: "Skin_MC_Sonia"       , name: "Sonia Style Costume" },
  { id: "Skin_MC_FullCurse"   , name: "Cursed's Outfit" },
  { id: "Skin_MC_Alucard"     , name: "Alucard Style Costume" },
  { id: "Skin_MC_Doppleganger", name: "Doppleganger Style Costume" },
];

export const skins = skinList.reduce((skins: Resource, skin, index) => {
  skins[index] = skin.name;

  return skins;
}, {});

export const weaponTypes = [
  { index: 0x0, name: "Swords" },
  { index: 0x1, name: "Swords & Shields" },
  { index: 0x2, name: "Spears" },
  { index: 0x3, name: "Fists" },
  { index: 0x4, name: "Two-Handed Swords" },
  { index: 0x5, name: "Dual Swords" },
  { index: 0x6, name: "Whips" },
];

// prettier-ignore
export const weaponList = [
  { id: "WeaponOneHandedTier1", type: 0x0, name: "Longsword" },
  { id: "WeaponOneHandedTier2", type: 0x0, name: "Bastard Sword" },
  { id: "WeaponOneHandedTier3", type: 0x0, name: "Joyeuse" },
  { id: "WeaponOneHandedTier4", type: 0x0, name: "Valmanway" },
  { id: "WeaponAndShieldTier1", type: 0x1, name: "Rusted Harpè and Aegis" },
  { id: "WeaponAndShieldTier2", type: 0x1, name: "Fleuret and Tower Shield" },
  { id: "WeaponAndShieldTier3", type: 0x1, name: "Arondight and Lancelot's Shield" },
  { id: "WeaponAndShieldTier4", type: 0x1, name: "Alucard's Sword and Shield" },
  { id: "WeaponSpearTier1"    , type: 0x2, name: "Lance" },
  { id: "WeaponSpearTier2"    , type: 0x2, name: "Halberd" },
  { id: "WeaponSpearTier3"    , type: 0x2, name: "Gungnir" },
  { id: "WeaponSpearTier4"    , type: 0x2, name: "Chauve-Souris" },
  { id: "WeaponFistTier1"     , type: 0x3, name: "Cestus" },
  { id: "WeaponFistTier2"     , type: 0x3, name: "Jewel Knuckles" },
  { id: "WeaponFistTier3"     , type: 0x3, name: "Fists of Talos" },
  { id: "WeaponFistTier4"     , type: 0x3, name: "Bernhard's Wrath" },
  { id: "WeaponTwoHandedTier1", type: 0x4, name: "Burnt Sword of Fierbois" },
  { id: "WeaponTwoHandedTier2", type: 0x4, name: "Claymore" },
  { id: "WeaponTwoHandedTier3", type: 0x4, name: "Durandal" },
  { id: "WeaponTwoHandedTier4", type: 0x4, name: "Excalibur" },
  { id: "WeaponDualWieldTier1", type: 0x5, name: "Pair of Longswords" },
  { id: "WeaponDualWieldTier2", type: 0x5, name: "Rapiers" },
  { id: "WeaponDualWieldTier3", type: 0x5, name: "Almace and Hauteclaire" },
  { id: "WeaponDualWieldTier4", type: 0x5, name: "War and Famine" },
  { id: "WeaponWhipTier1"     , type: 0x6, name: "Whip" },
  { id: "WeaponWhipTier2"     , type: 0x6, name: "Thorn Whip" },
  { id: "WeaponWhipTier3"     , type: 0x6, name: "Morning Star" },
  { id: "WeaponWhipTier4"     , type: 0x6, name: "Vampire Killer" },
];

export const weapons: Resource = {};

export const weaponsGroups: ResourceGroups = weaponTypes.map((type) => ({
  name: type.name,
  options: [],
}));

weaponList.forEach((weapon, index) => {
  weapons[index] = weapon.name;
  weaponsGroups[weapon.type].options.push(index);
});
