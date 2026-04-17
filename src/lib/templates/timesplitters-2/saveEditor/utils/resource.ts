export const arcadeLeagues = [
  {
    name: "Amateur League",
    series: [
      {
        name: "Beginners Series",
        matchs: [
          { index: 0x0, name: "Adios Amigos!", fields: ["Kills", "Time"] },
          { index: 0x1, name: "Casualty", fields: ["Kills", "Time"] },
          { index: 0x2, name: "Top Shot", fields: ["Time", "Lives"] },
        ],
      },
      {
        name: "Mode Madness",
        matchs: [
          { index: 0x4, name: "Chastity Chased", fields: ["Kills", "Time"] },
          { index: 0x3, name: "Shrinking from the Cold", fields: ["Kills", "Time"] },
          { index: 0x5, name: "Scrap Metal", fields: ["Kills", "Time"] },
        ],
      },
      {
        name: "It's a Blast",
        matchs: [
          { index: 0x6, name: "Night Shift", fields: ["Rank", "Kills"] },
          { index: 0x7, name: "Spoils of War", fields: ["Score", "Time"] },
          { index: 0x8, name: "Demolition Derby", fields: ["Rank", "Kills"] },
        ],
      },
      {
        name: "Too Hot to Handle",
        matchs: [
          { index: 0x9, name: "Monkey Immolation", fields: ["Time"] },
          { index: 0xb, name: "Disco Inferno", fields: ["Time"] },
          { index: 0xa, name: "Burns Department", fields: ["Time"] },
        ],
      },
      {
        name: "Team Series A",
        matchs: [
          { index: 0xc, name: "Club Soda", fields: ["Kills", "Time"] },
          { index: 0xd, name: "Station Stand", fields: ["Score", "Time"] },
          { index: 0xe, name: "Men in Grey", fields: ["Time"] },
        ],
      },
    ],
  },
  {
    name: "Honorary League",
    series: [
      {
        name: "Maximus",
        matchs: [
          { index: 0x14, name: "Cold Corpse Caper", fields: ["Rank", "Kills"] },
          { index: 0x13, name: "Killer Queen", fields: ["Kills", "Time"] },
          { index: 0x12, name: "R109 Beta", fields: ["Rank", "Kills"] },
        ],
      },
      {
        name: "Elimination Series",
        matchs: [
          {
            index: 0x15,
            name: "Baking for the Taking",
            fields: ["Time", "Lives"],
          },
          { index: 0x16, name: "Brace Yourself", fields: ["Time", "Lives"] },
          { index: 0x17, name: "Starship Whoopers", fields: ["Rank", "Kills"] },
        ],
      },
      {
        name: "Burns 'n' Bangs",
        matchs: [
          { index: 0x19, name: "Chinese Burns", fields: ["Kills", "Time"] },
          { index: 0x18, name: "Snow Business", fields: ["Kills", "Time"] },
          { index: 0x1a, name: "Rocket Man", fields: ["Kills", "Time"] },
        ],
      },
      {
        name: "Outnumbered but Never...",
        matchs: [
          { index: 0x1b, name: "Someone Has Got to Pay...", fields: ["Kills"] },
          { index: 0x1c, name: "Time to Split", fields: ["Kills", "Time"] },
          { index: 0x1d, name: "Can't Handle This", fields: ["Kills", "Time"] },
        ],
      },
      {
        name: "Team Series B",
        matchs: [
          { index: 0xf, name: "Hack a Hacker", fields: ["Kills", "Time"] },
          { index: 0x10, name: "Rice Cracker Rush", fields: ["Bags", "Time"] },
          { index: 0x11, name: "Superfly Lady", fields: ["Time"] },
        ],
      },
    ],
  },
  {
    name: "Elite League",
    series: [
      {
        name: "One Shot Thrills",
        matchs: [
          { index: 0x1e, name: "Babes in the Woods", fields: ["Rank", "Kills"] },
          { index: 0x1f, name: "Double Bill", fields: ["Score", "Time"] },
          { index: 0x20, name: "Nikki Jinki Bricky", fields: ["Kills", "Time"] },
        ],
      },
      {
        name: "Duel Meaning",
        matchs: [
          { index: 0x25, name: "If I'm Ugly - You Smell!", fields: ["Lives", "Time"] },
          { index: 0x26, name: "Golem Guru", fields: ["Lives", "Time"] },
          { index: 0x24, name: "Golden Thights", fields: ["Kills", "Time"] },
        ],
      },
      {
        name: "Frantic Series",
        matchs: [
          { index: 0x28, name: "Hangar Hat's Off!", fields: ["Kills", "Time"] },
          { index: 0x27, name: "Can't Please Everyone...", fields: ["Score", "Time"] },
          { index: 0x29, name: "Big Top Blowout", fields: ["Rank", "Kills"] },
        ],
      },
      {
        name: "Team Series C",
        matchs: [
          { index: 0x21, name: "Bags of Fun", fields: ["Bags"] },
          { index: 0x22, name: "They're Not Pets!", fields: ["Rank", "Kills"] },
          { index: 0x23, name: "Nice Threads", fields: ["Time"] },
        ],
      },
      {
        name: "Sincerest Form of Flattery",
        matchs: [
          { index: 0x2a, name: "Aztec the Dino Hunter", fields: ["Kills"] },
          { index: 0x2b, name: "Half Death", fields: ["Kills", "Time"] },
          { index: 0x2c, name: "Dead Fractioon", fields: ["Kills", "Time"] },
        ],
      },
    ],
  },
];

export const challengeSets = [
  {
    name: "Glass Smash",
    challenges: [
      { index: 0x0, name: "Plane in the Neck", fields: ["Time"] },
      { index: 0x1, name: "Bricking it", fields: ["Time"] },
      { index: 0x2, name: "Stain Removal", fields: ["Panes", "Time"] },
    ],
  },
  {
    name: "Behead The Undead",
    challenges: [
      { index: 0xf, name: "Fight Off The Living Dead", fields: ["Score"] },
      { index: 0x11, name: "Sergio's Last Stand", fields: ["Score"] },
      { index: 0x10, name: "Day of the Dammed", fields: ["Score"] },
    ],
  },
  {
    name: "Infiltration",
    challenges: [
      { index: 0x3, name: "Silent but Deadly", fields: ["Score", "Time"] },
      { index: 0x4, name: "Trouble at the Docks", fields: ["Score", "Time"] },
      { index: 0x5, name: "Escape from NeoTokyo", fields: ["Score", "Time"] },
    ],
  },
  {
    name: "Banana Chomp",
    challenges: [
      { index: 0x6, name: "Gone Bananas", fields: ["Time"] },
      { index: 0x7, name: "Monkey Business", fields: ["Time"] },
      { index: 0x8, name: "Playing With Fire", fields: ["Bananas"] },
    ],
  },
  {
    name: "Cut-out Shoot-out",
    challenges: [
      { index: 0x9, name: "Take 'em Down", fields: ["Score"] },
      { index: 0xa, name: "Fall Out", fields: ["Score"] },
      { index: 0xb, name: "Pick Yer Piece", fields: ["Score"] },
    ],
  },
  {
    name: "TimeSplitters 'Story' Classic",
    challenges: [
      { index: 0xd, name: "Badass Buspass Impass", fields: ["Time"] },
      { index: 0xe, name: "But Where do the Batteries Go?", fields: ["Time"] },
      { index: 0xc, name: "Hit Me Baby One Morgue Time", fields: ["Time"] },
    ],
  },
  {
    name: "Monkeying Around",
    challenges: [
      { index: 0x12, name: "Simian Shootout", fields: ["Score"] },
      { index: 0x13, name: "Monkey Mayhem", fields: ["Score"] },
      { index: 0x14, name: "Dam Bursters", fields: ["Score"] },
    ],
  },
];

export const weapons = {
  0x0: "Unarmed",
  0x1: "Silenced Pistol",
  0x2: "Silenced Pistol (x2)",
  0x3: "Silenced Luger",
  0x4: "Silenced Luger (x2)",
  0x5: "Luger Pistol",
  0x6: "Luger Pistol (x2)",
  0x7: "Garrett Revolver",
  0x8: "Garrett Revolver (x2)",
  0x9: "Tactical 12-Gauge",
  0xa: "Minigun",
  0xb: "Sniper Rifle",
  0xc: "Vintage Rifle",
  0xd: "Flamethrower",
  0xe: "Fire Extinguisher",
  0xf: "Soviet S47",
  0x10: "Soviet S47 (x2)",
  0x11: "ElectroTool",
  0x12: "Scifi Handgun",
  0x13: "Rocket Launcher",
  0x14: "Homing Launcher",
  0x15: "Lasergun",
  0x16: "Plasma Autorifle",
  0x17: "Grenade Launcher",
  0x18: "Proximity Mine",
  0x19: "Remote Mine",
  0x1a: "Timed Mine",
  0x1b: "TNT",
  0x1c: "Tommy Gun",
  0x1d: "Tommy Gun (x2)",
  0x1e: "SBP90 Machinegun",
  0x1f: "SBP90 Machinegun (x2)",
  0x20: "Shotgun",
  0x21: "Shotgun (x2)",
  0x22: "Brick",
  // 0x23: "Digital Camera", // Unused
  // 0x24: "Temporal Uplink", // Unused
  0x25: "Crossbow",
  // 0x26: "Gun Powder" // Unused
  // 0x26: "Scifi Handgun" // Unused
};
