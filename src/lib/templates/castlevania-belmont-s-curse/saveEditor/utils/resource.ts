import type { Resource, ResourceGroups } from "$lib/types";

export const arcanaList = [
  {
    id: "CursedFireBall",
    name: "Cursed Flame",
    blessings: [
      {
        id: "36fec1e5ae091bd479861e34f3940c3e",
        name: "Fires a bigger fireball that slightly pushes back its target.",
      },
    ],
    tasks: [
      {
        id: "1c26d19acd6d910448748388f5f044be",
        name: "Hit 20 time with this spell.",
      },
      { id: "a96860c17952b15458739e186029b33f", name: "???" },
    ],
  },
  {
    id: "BoomerangCross",
    name: "Holy Cross",
    blessings: [
      {
        id: "ed8d72a5c9eb81849b58bf3a50f6f556",
        name: "You can throw a second cross.",
      },
      {
        id: "7ac0837d721f75f49b54bde40d157aa3",
        name: "The cross inflicts more damage the farther away it is from Rose.",
      },
      {
        id: "14c7a54344f19094db1daa938b0e6dac",
        name: "Catching the returning cross lets Rose regain 10% of the spell's mana cost for each time an enemy was hit, up to a maximum of 60% .",
      },
    ],
    tasks: [
      {
        id: "59d04ac0868a2ca4781268efaf054024",
        name: "Find 3 different whip-type weapons.",
      },
      {
        id: "cf586d0902bdb784db7a061351979bcf",
        name: "Kill 5 enemies with the same cross (not necessarily at the same time).",
      },
      {
        id: "5a1c97ee47764cf44a9ff4f8ce0c7370",
        name: "Kill 10 enemies with a whip attack.",
      },
    ],
  },
  {
    id: "FireSeismicWave",
    name: "Infernal Pyre",
    blessings: [
      {
        id: "07568814b647cbc4ab74ad4562453dca",
        name: "Regain 25% of the spell's mana cost for each enemy hit by the central explosion, starting with the second enemy.",
      },
      {
        id: "aecbaf1f675a42e4f800051981844b39",
        name: "Enemies hit by Joan's spell are thrown high in the air.",
      },
      {
        id: "6b53d5052c9ad6f4ebaab98e746dce97",
        name: "Hitting an enemy with a weapon prolongs the fire on them.",
      },
    ],
    tasks: [
      {
        id: "f2c497d34c5eabe4988d891a35a93ba8",
        name: "Successfully parry 15 attacks with the Holy Light.",
      },
      {
        id: "8e65503567065954b95eab71a4d7965b",
        name: "Reach a sacred place so Joan can pray.",
      },
      {
        id: "6ceb76eab60dc964f8dac40c76f39023",
        name: "Set 5 enemies on fire at the same time.",
      },
    ],
  },
  {
    id: "PetrifyingRay",
    name: "Petrifying Gaze",
    blessings: [
      {
        id: "e9517c6b7693f174a880eba310dfc9ae",
        name: "Killing a petrified enemy restores a quantity of mana equivalent to half the cost of Medusa's spell.",
      },
      {
        id: "13468740adb68df4a8792b9c45cd9685",
        name: "The closer the targets affected by this spell are to Rose, the longer they remain petrified, and the more hits it takes to break the petrification.",
      },
    ],
    tasks: [
      {
        id: "862dd7b84a2033e46b87aab31a6a4916",
        name: "Petrify an enemy carrying a shield with Medusa's Spell. Not again, Perseus!",
      },
      {
        id: "b298c3fe842c7d34bba95e3fd64ae88f",
        name: "Kill 25 enemies from fall damage directly after petrifying them in the air.",
      },
    ],
  },

  {
    id: "GiantFist",
    name: "Fist of Talos",
    blessings: [
      {
        id: "054ed4e8390ebcd45bdaa7b2b5bb05b2",
        name: "The fist deals 75% more damage to enemies suffering from control effects.",
      },
      {
        id: "dc09f106ce0b3ab4c84aa4e8d115cd32",
        name: "The earthquake is more powerful and unleashes 1 second later.",
      },
      {
        id: "cf88a7b03457b1e40bf684b6a57cec60",
        name: "The fist is covered in damage-dealing spikes that hit enemies even after hitting the ground.",
      },
    ],
    tasks: [
      {
        id: "61af9bd8957c082489bc2b5fd061e379",
        name: "Kill 3 enemies with one fist.",
      },
      {
        id: "c07c4dff0f114aa428eb1189e40567a9",
        name: "Kill 10 airborne enemy with a fist as it falls down.",
      },
      {
        id: "28195e676518fc3448c7eb0062821b49",
        name: "Kill 15 enemies with the smash.",
      },
    ],
  },
  {
    id: "InvocationStone",
    name: "Masterpiece",
    blessings: [
      {
        id: "df078384c9c943a4ab3f9e39a6ef311e",
        name: "Summons an additional Gargoyle",
      },
      {
        id: "aa829f8f48941ae469fc64610e2be07b",
        name: "Rose heals every time the Gargoyle's fire ball hits an enemy.",
      },
      {
        id: "832ad780c5aca6642b9e03f0fdc52fe2",
        name: "Killing at least one enemy with the Gargoyle Dive prevents the Gargoyle's destruction.",
      },
    ],
    tasks: [
      {
        id: "8d1fdecc1e4e2dd49a1d5e2329c0343f",
        name: "Kill 30 enemies with the Gargoyle Dive.",
      },
      {
        id: "0f6658a45480b224ea4dee66e3681838",
        name: "Cause 5 enemies to fall to their death with the Gargoyle Summoning Stone.",
      },
      {
        id: "9047ced99b419ef4fbf0619f8c48cc21",
        name: "Find all the secret zones in the Main Hall.",
      },
    ],
  },
  {
    id: "BloodSpikes",
    name: "Blood Spikes",
    blessings: [
      {
        id: "973815755c510a0488f075e6954a5c77",
        name: "Applying the bleeding effect to an already bleeding enemy deals instant damage to it.​",
      },
      {
        id: "5453444e3715f984a8155f873c47b90d",
        name: "Heals Rose 2% of her max health every time an enemy dies from bleeding.",
      },
      {
        id: "fdb91094c0010a24e82a62823c561ab6",
        name: "Bleeding enemies are slower and deal 25% less damage to Rose.",
      },
    ],
    tasks: [
      {
        id: "3d75694d9a9eca748a17cdcc8c4012e9",
        name: "Kill 25 enemies from bleed-effect damage.",
      },
      {
        id: "9878548b8c3aa5048b45f8e7ec702e2c",
        name: "Find 2 different dual blade-type weapons.",
      },
      {
        id: "f736a228c4c47c442bf92e2350fabf2c",
        name: "Cause an enemy to bleed continuously for 10 seconds.",
      },
    ],
  },
  {
    id: "LaserScytheSlash",
    name: "Soul Harvest",
    blessings: [
      {
        id: "ec88c83b40a56734da9fa1299b333d04",
        name: "If this spell only hits one enemy, Rose heals 4% of her maximum health.",
      },
      {
        id: "fab2657df02676e40ae9796ee4ea7a55",
        name: "If a sickle kills an enemy, it splits into 4 new sickles.",
      },
      {
        id: "35fe8503662a7dd469ad4fbd5362ec97",
        name: "Each sickle that hits an enemy restores 25% of the spell's mana cost.",
      },
    ],
    tasks: [
      {
        id: "2a3f2c8d9a534e647b2b9430d7c54a14",
        name: "Complete the hidden puzzle in Notre Dame.",
      },
      {
        id: "bac9a8b71483d514d9ad273e3f37f008",
        name: "Kill 44 skeletons (of any sort).",
      },
      {
        id: "9bceaaf310bae9448a666817bbca77e3",
        name: "Kill 4 enemies with the same cast of Death's spell.",
      },
    ],
  },
  {
    id: "TargetingChargingWheels",
    name: "Wheel of Chaos",
    blessings: [
      {
        id: "aca3afadc56a0ed43a0e270453595857",
        name: "This spell can be cast using health if Rose does not have enough mana and will deal 50% more damage.",
      },
      {
        id: "4ae3114f63f7b4849a52af3ed6346403",
        name: "Mammon's spell deals increased damage each time it is cast. This bonus resets if the spell is not recast while active.",
      },
      {
        id: "b66fc4d2e5106514c9d32d019ab4ee87",
        name: "Every time the player recasts the spell, there is a 1/ 8 chance of triggering a random effect.",
      },
    ],
    tasks: [
      {
        id: "e649519df0f00a34fb27e9cfc66a49a7",
        name: "Have the wheel spin for 15 seconds without interruption.",
      },
      {
        id: "5c66aafa82cab4041bc7b81a2b552159",
        name: "Kill 5 different enemies with one wheel.",
      },
      {
        id: "2f8b22964f26d564aa1cc85b1a20d08c",
        name: "Spend 1000 mana points on recasts of this spell.",
      },
    ],
  },
  {
    id: "FreezingMist",
    name: "Freezing Path",
    blessings: [
      {
        id: "64ffb5bbb69ce214ea2dca591cff7df3",
        name: "At the end of the spell effect, a wave of frost bursts around Rose that freezes enemies within a radius of 5 meters.",
      },
      {
        id: "323a4a9d44ff6eb4ebfe8b867125ecc6",
        name: "Passing through an enemy increases your speed by 10% for a maximum of 5 times. Can only trigger once on the same enemy.",
      },
    ],
    tasks: [
      {
        id: "e587e7c596de40f4aa9cb5d17eb956c7",
        name: "Kill 25 enemies by breaking them out of freeze.",
      },
      {
        id: "9252cd70e18ac204f89444c671ffd816",
        name: "Pass through 5 enemies in 3 seconds.",
      },
    ],
  },
  {
    id: "RiseAndFall",
    name: "Chronomantic Dive",
    blessings: [
      {
        id: "7196d92f748580f4cb9d699908227b65",
        name: "The time slow effect is longer.​",
      },
      {
        id: "ec79a6122bc2cb6459428597657fad95",
        name: "Creates a bigger explosion if Rose dives from a high enough position.​",
      },
    ],
    tasks: [
      {
        id: "d3519383b44f03248bbdd21f9508bae6",
        name: "Kill 20 enemies while in slow motion.",
      },
      {
        id: "f458bad117b9c784aafb5098ea039daa",
        name: "Explore all rooms of Clock Tower.",
      },
    ],
  },
  {
    id: "LifeDrain",
    name: "Life Drain",
    blessings: [
      {
        id: "d06b08991403c0342a6ae6e5dbfbf8f0",
        name: "The drain deals bonus damage if Rose is at full health when it ticks.",
      },
      {
        id: "f4cebfc93e60a0445bbe38e9559b0bc2",
        name: "Getting hit while holding this spell doesn't interrupt it.​",
      },
      {
        id: "a5b4abdba9780c64a8d193b4a21d5f42",
        name: "The spell targets the 2 nearest enemies instead of just one.​",
      },
    ],
    tasks: [
      {
        id: "3411973f6dcba2d4cb19191582ae48ba",
        name: "Drain an enemy for 5 seconds straight without interruption.",
      },
      {
        id: "670c95b801ea1d546947236606321a4e",
        name: "Explore all rooms of Hall of Mirrors.",
      },
      {
        id: "200c35ff386b15d4888ab1a29c24af44",
        name: "Kill 25 enemies with the life drain.",
      },
    ],
  },
  {
    id: "GlassArmor",
    name: "Stained-Glass Shield",
    blessings: [
      {
        id: "8e9df52a991cefa4d9584b51926d746d",
        name: "The spell's magic shield can absorb 1 additional attacks before it breaks.",
      },
      {
        id: "c361222cbc6dc0e4f80e50244ceabe57",
        name: "Each time Rose takes damage (with or without an active magic shield), a shard of glass is launched at the nearest enemy.",
      },
      {
        id: "3db425c348e217145b0fee9c8612a09d",
        name: "When Rose is struck during an attack, damage received is reduced by 50% and her attack continues uninterrupteds she passes through them while this spell is active.after 15 seconds or when Rose teleports to it.",
      },
    ],
    tasks: [
      {
        id: "7eb73d5f26825764aa991bfdf3454497",
        name: "Absorb an attack that would otherwise be fatal thanks to Arthur's spell.",
      },
      {
        id: "c8716f87b125d4341b2b47fb4462319b",
        name: "Kill 25 Haunted Armor.",
      },
      {
        id: "60765778caa388943b486c3347068e84",
        name: "Kill 3 enemies with a single attack.",
      },
    ],
  },
  {
    id: "Detainment",
    name: "Chains of Justice",
    blessings: [
      {
        id: "97c453cf3beb15040be3a5a7844c1b2b",
        name: "Chained enemies are also rendered incapable of performing any action.",
      },
      {
        id: "9a4e50dc21a418e4f8a52975d4aaa609",
        name: "Killing a chained target chains a nearby enemy. ​",
      },
      {
        id: "2db626072b045564bb12de787dc6cb18",
        name: "Chaining an enemy with less than 20% of their maximum health instantly kills them.",
      },
    ],
    tasks: [
      {
        id: "359078c57388f7544815f930aa6116d2",
        name: "Chain 4 enemies at once.",
      },
      {
        id: "7e2866036f07c854b836c9f540379b01",
        name: "Kill 25 chained enemies.",
      },
      {
        id: "0e6672336301e984c80f18777d0e2243",
        name: "Upgrade your maximum health and mana 5 times each.",
      },
    ],
  },
  {
    id: "PocketMirror",
    name: "Mirror Walk",
    blessings: [
      {
        id: "5a4ec3aa7982c8e4093b8e182aa34f6c",
        name: "If Rose uses teleportation without losing life since the mirror is placed, she regains 80% of the consumed mana.",
      },
      {
        id: "ee6d0c85ed77d3247852d8ab2bb2912b",
        name: "Rose deals significant damage to enemies in the path of the teleportation.",
      },
      {
        id: "e96e85081d8dedd4f901559933e43499",
        name: "Receiving a fatal blow while a mirror is active prevents death and activates teleportation. Can only be activated once but can be recharged when Rose interacts with a Save room.",
      },
    ],
    tasks: [
      { id: "42cc4d2bdabd3084fb9302ed6c2dec2b", name: "Use 34 Save Rooms." },
      {
        id: "6f98fa9fff5b67e468d918fd31ee1c50",
        name: "Heal 1000 of health with this spell.",
      },
      {
        id: "d679013200fb648419def3ca63d99891",
        name: "Kill 5 enemies within 3 seconds of dodging their attacks with teleportation.",
      },
    ],
  },
  {
    id: "RageIncarnation",
    name: "Absolution",
    blessings: [
      {
        id: "1eec585dfe6f10c4dbd269abd3e9c282",
        name: "If the spell is cast while Rose is at full health, deals 50% more damage.",
      },
      {
        id: "badb7ce5c8249574dbf0821c4d7a672c",
        name: "If the spell hits only one target, ignites it.",
      },
      {
        id: "56d6d74dc2381d54c92cdb3f101f99f0",
        name: "If the spell kills at least 4 enemies, heals Rose back to full health.​",
      },
    ],
    tasks: [
      {
        id: "89ee2507a0e54c3418ca494e6027e5cd",
        name: "Kill 4 enemies with one cast of this spell, 5 times.",
      },
      {
        id: "1ff5e2143642ab040bd6219c1cf8ae55",
        name: "Explore 85% of the whole map.",
      },
      {
        id: "fbb8c7e13f6eb774e92d8a25ec574164",
        name: "Heal back to full life using this spell 10 times.",
      },
    ],
  },
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
  { id: "Clue_Medusa_CemeteryLocation"  , type: 0x3, name: "The roots of the Hollow Tree" },
  { id: "Clue_Medusa_CanalShortcut"     , type: 0x3, name: "Cemetary Fountain" },
  { id: "Clue_Medusa_SpecialAttack"     , type: 0x3, name: "Guardian's Gaze" },
  { id: "Clue_Medusa_RomanBath"         , type: 0x3, name: "Roman Baths" },
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

export const areaList = [
  { id: "946565bcb5d5f244e991e1790575a67c", name: "Paris Streets" },
  { id: "e18ccfe651d904147ba60f4c72f9b146", name: "Holy Innocents' Cemetery" },
  { id: "afeda68d5a0c4204da3488bbf7f04900", name: "Catacombs of Paris" },
  { id: "4f7ce84e4688e534aa656a76e6bd9416", name: "Main Hall" },
  { id: "226c20eca175b104e8fe1a8f4fc2c879", name: "Library" },
  { id: "c912f1bff8fc06740902f1f67666ae86", name: "Clock Tower" },
  { id: "57cb4e79eb2c4e943821705d39709461", name: "Notre-Dame" },
  { id: "b76c5d815e88a8442ad46b1c869efd5f", name: "Hall of Mirrors" },
  { id: "794afe09823b0e04dac2044bf092cff2", name: "Master's Quarters" },
];

export const locationList = [
  {
    id: "World_Biome_01_Streets_Poor_StreetsPoor_SaveRoom02_uid78",
    area: "946565bcb5d5f244e991e1790575a67c",
    district: "9766b0fbf241fb34c9c566c286814916",
    name: "Paris Streets: Central Sewer Drain",
    coordinates: [36, -10.989999771118164],
  },
  {
    id: "World_Biome_01_Streets_Poor_StreetsPoor_SaveRoom07_uid126",
    area: "946565bcb5d5f244e991e1790575a67c",
    district: "d93fac4970f971c4fae58ada42e6abf5",
    name: "Paris Streets: Burned District",
    coordinates: [228, 41.01000214],
  },
  {
    id: "World_Biome_01_Streets_Poor_StreetsPoor_SaveRoom04_uid87",
    area: "946565bcb5d5f244e991e1790575a67c",
    district: "6958c12f2a9ccd24e9b4b82e1a026a0c",
    name: "Paris Streets: Prison Tower",
    coordinates: [132, 67.01000214],
  },
  {
    id: "World_Biome_01_Streets_Poor_StreetsPoor_SaveRoom08_uid140",
    area: "946565bcb5d5f244e991e1790575a67c",
    district: "2e77bb34ede6bbb4c8bbf70742afcc81",
    name: "Paris Streets: Undercity",
    coordinates: [-132, 28.00999832],
  },
  {
    id: "World_Biome_01_Streets_Poor_StreetsPoor_SaveRoom05_uid107",
    area: "946565bcb5d5f244e991e1790575a67c",
    district: "33b84dec2d6cb9c4aa1880846b86b241",
    name: "Paris Streets: Gate to the Stone Bridge",
    coordinates: [516, 28.00999832],
  },
  {
    id: "World_Biome_02_InnocentsCemetery_Cemetery_SaveRoom050_uid123",
    area: "e18ccfe651d904147ba60f4c72f9b146",
    district: "ffe06bf5afe78e241bedb4d2d29bc1f9",
    name: "Holy Innocents' Cemetery: Cloister",
    coordinates: [396, 262.0099792],
  },
  {
    id: "World_Biome_02_InnocentsCemetery_Cemetery_SaveRoom020_uid70",
    area: "e18ccfe651d904147ba60f4c72f9b146",
    district: "5a6460c78d8478641a09b377ae227794",
    name: "Holy Innocents' Cemetery: Pauper's Grave",
    coordinates: [-60, 262.0099792],
  },
  {
    id: "World_Biome_02_InnocentsCemetery_Cemetery_SaveRoom040_uid99",
    area: "e18ccfe651d904147ba60f4c72f9b146",
    district: "823b40c612cc53443b77effda9aa052c",
    name: "Holy Innocents' Cemetery: Ancient Sewers",
    coordinates: [228, 184.0099945],
  },
  {
    id: "World_Biome_02_InnocentsCemetery_Cemetery_SaveRoom_060_uid142",
    area: "e18ccfe651d904147ba60f4c72f9b146",
    district: "4c397d1ca6aa4354fad002058dcef6b8",
    name: "Holy Innocents' Cemetery: Overgrown Crypt",
    coordinates: [-108, 210.0099945],
  },
  {
    id: "World_Biome_03_Catacombs_Catacombs_SaveRoom02_uid68",
    area: "afeda68d5a0c4204da3488bbf7f04900",
    district: "f000481461c3e3f4595c2c900957fcfa",
    name: "Catacombs of Paris: Quarry Elevator",
    coordinates: [204, 145.0099945],
  },
  {
    id: "World_Biome_03_Catacombs_Catacombs_SaveRoom03_uid92",
    area: "afeda68d5a0c4204da3488bbf7f04900",
    district: "5b046b1c8ac019440bb166b9eebe2ec1",
    name: "Catacombs of Paris: Realm of Old Night",
    coordinates: [84, 28.00999832],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_080_uid268",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "e24ec65451be6f9448bb05d27ebc9cf6",
    name: "Main Hall: Entrance Corridor",
    coordinates: [348, 54.01000214],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_030_uid221",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "0418c634ea0a2094aba9a896961fa123",
    name: "Main Hall: Boudoirs",
    coordinates: [420, 28.00999832],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_010_uid91",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "f3521b2fd5933464eae60a820c3ff94c",
    name: "Main Hall: Ballrooms",
    coordinates: [540, 54.01000214],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_020_uid132",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "ade3047fc119b884bb741f8067ec86b1",
    name: "Main Hall: Elevator Tower",
    coordinates: [444, 106.0100021],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_040_uid223",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "fcd5b1cae013e7b4d8f23588c4824c4c",
    name: "Main Hall: Waterworks",
    coordinates: [420, -127.9899979],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_070_uid264",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "77bafe934c6dbf840ba74b01748731a7",
    name: "Main Hall: Torture Chambers",
    coordinates: [540, -127.9899979],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_060_uid167",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "d7a913f2ccd9e00429bcdf2c5b73fd3c",
    name: "Main Hall: Servants' Quarters",
    coordinates: [540, -101.9899979],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_090_uid269",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "e07ea1f8e98c19244869e6a3df6e510c",
    name: "Main Hall: Storerooms",
    coordinates: [348, -101.9899979],
  },
  {
    id: "World_Biome_06_MainHall_MainHall_SaveRoom_050_uid149",
    area: "4f7ce84e4688e534aa656a76e6bd9416",
    district: "71be74fb4cb8ccb43aca3adc81afeee2",
    name: "Main Hall: Archives",
    coordinates: [444, -49.98999786],
  },
  {
    id: "World_Biome_09_ClockTower_ClockTower02_SaveRoom01_uid52",
    area: "c912f1bff8fc06740902f1f67666ae86",
    district: "ab19f742c1c210346ae868d5f41ca92a",
    name: "Clock Tower: Foundry Apex",
    coordinates: [348, 158.0099945],
  },
  {
    id: "World_Biome_09_ClockTower_ClockTower02_SaveRoom04_uid83",
    area: "c912f1bff8fc06740902f1f67666ae86",
    district: "663268b4e696b6f41b763ccc9ca95840",
    name: "Clock Tower: Mechanic's Ascent",
    coordinates: [108, 184.0099945],
  },
  {
    id: "World_Biome_09_ClockTower_ClockTower_MVP_SaveRoom01_uid149",
    area: "c912f1bff8fc06740902f1f67666ae86",
    district: "5a61b6d4c732fe14ba3b78e60e82a1af",
    name: "Clock Tower: Eastern Summit",
    coordinates: [348, 379.0099792],
  },
  {
    id: "World_Biome_08_Library_Library_SaveRoom_01_uid140",
    area: "226c20eca175b104e8fe1a8f4fc2c879",
    district: "70e226ec6a3a6004ca5766b8d63eec93",
    name: "Library: Rhetoric Shelves",
    coordinates: [132, 93.01000214],
  },
  {
    id: "World_Biome_08_Library_Library_SaveRoom_02_uid141",
    area: "226c20eca175b104e8fe1a8f4fc2c879",
    district: "de51ab05641b5fe4a9de43e464aa9471",
    name: "Library: Exhibition Room",
    coordinates: [228, 119.0100021],
  },
  {
    id: "World_Biome_05_NotreDame_NotreDame_MVP_SaveRoom_010_uid140",
    area: "57cb4e79eb2c4e943821705d39709461",
    district: "2c4d07c74eaeff84ebb3a1e00233e138",
    name: "Notre-Dame: Notre-Dame Undercroft",
    coordinates: [420, -23.99000168],
  },
  {
    id: "World_Biome_05_NotreDame_NotreDame_MVP_SaveRoom_020_uid141",
    area: "57cb4e79eb2c4e943821705d39709461",
    district: "ee9c6a0e800b6364990e68502e6d47fc",
    name: "Notre-Dame: West Triforium",
    coordinates: [324, 67.01000214],
  },
  {
    id: "World_Biome_05_NotreDame_NotreDame_MVP_SaveRoom_030_uid142",
    area: "57cb4e79eb2c4e943821705d39709461",
    district: "aa23ad742c4e1364ab6259039fd1a1c6",
    name: "Notre-Dame: East Gallery",
    coordinates: [492, 41.01000214],
  },
  {
    id: "World_Biome_10_HallOfMirrors_HallOfMirrors_MVP_SaveRoom_03_uid132",
    area: "b76c5d815e88a8442ad46b1c869efd5f",
    district: "aadb42b4436ff034c8172a7e22e14034",
    name: "Hall of Mirrors: Nightmare Atrium",
    coordinates: [252, 184.0099945],
  },
  {
    id: "World_Biome_10_HallOfMirrors_HallOfMirrorsV2_SaveRoom01_uid58",
    area: "b76c5d815e88a8442ad46b1c869efd5f",
    district: "e36a2882106aba948ae49e6af757c47e",
    name: "Hall of Mirrors: Threshold of Vision",
    coordinates: [156, 197.0099945],
  },
  {
    id: "World_Biome_10_HallOfMirrors_HallOfMirrors_MVP_SaveRoom_02_uid118",
    area: "b76c5d815e88a8442ad46b1c869efd5f",
    district: "1be0cebe1c1fca044ac528f59273dd94",
    name: "Hall of Mirrors: Familiar Way",
    coordinates: [156, 2.00999999],
  },
  {
    id: "World_Biome_10_HallOfMirrors_HallOfMirrorsV2_SaveRoom04_uid87",
    area: "b76c5d815e88a8442ad46b1c869efd5f",
    district: "1b14ba9506ad34f49aa84afb9ea546b1",
    name: "Hall of Mirrors: The Descent Into Memory",
    coordinates: [156, 106.01000213623047],
  },
  {
    id: "World_Biome_10_HallOfMirrors_HallOfMirrors_MVP_SaveRoom_04_uid136",
    area: "b76c5d815e88a8442ad46b1c869efd5f",
    district: "dafa393f3276c1242b7710eea8c3333a",
    name: "Hall of Mirrors: Heart of the Maze",
    coordinates: [156, 67.01000214],
  },
  {
    id: "World_Biome_11_MasterQuarter_MastersQuarters_SaveRoom_uid4",
    area: "794afe09823b0e04dac2044bf092cff2",
    district: "9bef70d037436004a95ea3e35d417afc",
    name: "Master's Quarters: Sanctuary of Solitude",
    coordinates: [-60, 2.010000228881836],
  },
];

export const locations: Resource = {};

export const locationsGroups: ResourceGroups = areaList.map((area) => ({
  name: area.name,
  options: [],
}));

locationList.forEach((location, index) => {
  const area = areaList.findIndex((area) => area.id === location.area);

  locations[index] = location.name;
  locationsGroups[area].options.push(index);
});

// prettier-ignore
export const moveList = [
  { id: "WhipPendulum", moveId: "71276b8978cebc848aaf094a91bee40e", name: "Arcane Whip" },
  { id: "VaniaLight"  , moveId: "de8186906ea0812439ed17a8a49f813a", name: "Holy Light" },
  { id: "LightCrash"  , moveId: "2090f3e7a84872b41a57081bc0090cf0", name: "Smash" },
  { id: "AerialDash"  , moveId: "6f258a566021a4442839fbe32b2b10a5", name: "Aerial Rush" },
  { id: "DoubleJump"  , moveId: "15b5c745d645ff7418900e6df0670fd6", name: "Double Jump" },
];

// prettier-ignore
export const relicList = [
  { id: "Charm_ChestRecover"                    , name: "Crypt Key"          },
  { id: "Charm_BoostDamageAfterSpell"           , name: "Twilight Gem"       },
  { id: "Charm_BoostDamageOnControlledMob"      , name: "Abyssal Eye"        },
  { id: "Charm_PotionGiveMana"                  , name: "Nightshade"         },
  { id: "Charm_BoostDamageWhenUnGrounded"       , name: "Raven's Feather"    },
  { id: "Charm_KillMobBoostDamageInflicted"     , name: "Necro Charm"        },
  { id: "Charm_BoostDamageAfterBreak"           , name: "Obsidian Fang"      },
  { id: "Charm_BoostDefenseOnLowLife"           , name: "Shadow Veil"        },
  { id: "Charm_KillMobBoostSpeed"               , name: "Mourning Bead"      },
  { id: "Charm_BoostDamageOnLowLife"            , name: "Specter's Whisper"  },
  { id: "Charm_BoostDamageFullLife"             , name: "Forsaken Ring"      },
  { id: "Charm_LongerMobStagger"                , name: "Ebony Claw"         },
  { id: "Charm_HealthPotionHealFullLife"        , name: "Witch's Knot"       },
  { id: "Charm_BoostDefenseForTrap"             , name: "Ghostly Pendant"    },
  { id: "Charm_BoostDamageOnMobFullLife"        , name: "Sinister Rune"      },
  { id: "Charm_NerfDmgOnLowMana"                , name: "Midnight Tear"      },
  { id: "Charm_ParryGiveMana"                   , name: "Grim Token"         },
  { id: "Charm_BoostDamageAfterParry"           , name: "Cursed Coin"        },
  { id: "Charm_ExtraPotionAfterSave"            , name: "Blood Vial"         },
  { id: "Charm_GetManaFromDmgReceived"          , name: "Banshee's Wail"     },
  { id: "Charm_RoomChangeResetMobSpawner"       , name: "Phantom Ring"       },
  { id: "Charm_BoostXPKillMobFullLife"          , name: "Moonlit Shard"      },
  { id: "Charm_BoostDamageBackHit"              , name: "Vile Trinket"       },
  { id: "Charm_BoostManaKillMob"                , name: "Revenant's Charm"   },
  { id: "Charm_KillMobRevengeHeal"              , name: "Wraith's Tear"      },
  { id: "Charm_ReduceSpellManaCostSpam"         , name: "Lich's Mark"        },
  { id: "Charm_BoostDamageBackReduceDamageFront", name: "Pale Thorn"         },
  { id: "Charm_BoostDamageButReduceLife"        , name: "Beelzebub's Seal"   },
  { id: "DEPRECATED_Charm_BoostManaOnDmgLowLife", name: "Soul Fragment"      },
  { id: "Charm_BoostDamagePerEmptyPotion"       , name: "Witch's Brew"       },
  { id: "Charm_InvulnerabilityAfterSave"        , name: "Eldritch Talisman"  },
  { id: "Charm_ClampMCMana"                     , name: "Infernal Medallion" },
  { id: "Charm_BatPet"                          , name: "Vampire's Fang"     },
  { id: "MammonKeyMines"                        , name: "Thrilling Eye"      },
  { id: "MammonKeyCrossFire"                    , name: "Oozing Eye"         },
  { id: "MammonKeyHoming"                       , name: "Trembling Eye"      },
  { id: "Charm_BoostDefenseOnFullLife"          , name: "Dark Sigil"         },
  { id: "Charm_RevealSecret"                    , name: "Gloomstone"         },
  { id: "Charm_GainHPHitMobNoPotion"            , name: "Blackened Heart"    },
  { id: "Charm_BoostSpeedAfterWhip"             , name: "Hollow Bone"        },
  { id: "Charm_BoostSpeedLowMana"               , name: "Dusk Amulet"        },
  { id: "Charm_ConsummableChanceBoost"          , name: "Crystallized Blood" },
  { id: "Charm_BoostSpeedAfterSave"             , name: "Sand Charm"         },
  { id: "Charm_BoostDefenseAfterGettingHit"     , name: "Haunting Relic"     },
  { id: "Charm_TankOneHit"                      , name: "Family's Grace"    , disabled: true },
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
