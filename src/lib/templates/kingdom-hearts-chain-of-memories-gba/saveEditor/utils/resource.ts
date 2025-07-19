import type { Resource, ResourceGroups } from "$lib/types";

export const cardTypes = [
  {
    name: "Attack Cards",
    values: 10,
    cards: [
      { index: 0x0, name: "Kingdom Key" },
      { index: 0xa, name: "Three Wishes" },
      { index: 0x14, name: "Crabclaw" },
      { index: 0x1e, name: "Pumpkinhead" },
      { index: 0x28, name: "Fairy Harp" },
      { index: 0x32, name: "Wishing Star" },
      { index: 0x3c, name: "Spellbinder" },
      { index: 0x46, name: "Metal Chocobo" },
      { index: 0x50, name: "Olympia" },
      { index: 0x5a, name: "Lionheart" },
      { index: 0x64, name: "Lady Luck" },
      { index: 0x6e, name: "Divine Rose" },
      { index: 0x78, name: "Oathkeeper" },
      { index: 0x82, name: "Oblivion" },
      { index: 0x8c, name: "Diamond Dust" },
      { index: 0x96, name: "One-Winged Angel" },
      { index: 0xa0, name: "Ultima Weapon" },
    ],
  },
  {
    name: "Magic Cards",
    values: 10,
    cards: [
      { index: 0xaa, name: "Fire" },
      { index: 0xb4, name: "Blizzard" },
      { index: 0xbe, name: "Thunder" },
      { index: 0xc8, name: "Cure" },
      { index: 0xd2, name: "Gravity" },
      { index: 0xdc, name: "Stop" },
      { index: 0xe6, name: "Aero" },
      { index: 0x104, name: "Simba" },
      { index: 0x10e, name: "Genie" },
      { index: 0x118, name: "Bambi" },
      { index: 0x122, name: "Dumbo" },
      { index: 0x12c, name: "Tinker Bell" },
      { index: 0x136, name: "Mushu" },
      { index: 0x140, name: "Cloud" },
    ],
  },
  {
    name: "Item Cards",
    values: 10,
    cards: [
      { index: 0x17c, name: "Potion" },
      { index: 0x186, name: "Hi-Potion" },
      { index: 0x190, name: "Mega-Potion" },
      { index: 0x19a, name: "Ether" },
      { index: 0x1a4, name: "Mega-Ether" },
      { index: 0x1ae, name: "Elixir" },
      { index: 0x1b8, name: "Megalixir" },
    ],
  },
  // Unused
  // {
  //   name: "Friend Cards",
  //   values: 10,
  //   cards: [
  //     { index: 0xf0, name: "Donald Duck" },
  //     { index: 0xfa, name: "Goofy" },
  //     { index: 0x14a, name: "Aladdin" },
  //     { index: 0x154, name: "Ariel" },
  //     { index: 0x15e, name: "Jack" },
  //     { index: 0x168, name: "Peter Pan" },
  //     { index: 0x172, name: "The Beast" },
  //   ],
  // },
  {
    name: "Enemy Cards",
    values: 1,
    cards: [
      { index: 0x1c2, name: "Shadow" },
      { index: 0x1c5, name: "Soldier" },
      { index: 0x1c8, name: "Large Body" },
      { index: 0x1cb, name: "Red Nocturne" },
      { index: 0x1ce, name: "Blue Rhapsody" },
      { index: 0x1d1, name: "Yellow Opera" },
      { index: 0x1d4, name: "Green Requiem" },
      { index: 0x1d7, name: "Powerwild" },
      { index: 0x1da, name: "Bouncywild" },
      { index: 0x1dd, name: "Air Soldier" },
      { index: 0x1e0, name: "Bandit" },
      { index: 0x1e3, name: "Fat Bandit" },
      { index: 0x1e6, name: "Barrel Spider" },
      { index: 0x1e9, name: "Search Ghost" },
      { index: 0x1ec, name: "Sea Neon" },
      { index: 0x1ef, name: "Screwdiver" },
      { index: 0x1f2, name: "Aquatank" },
      { index: 0x1f5, name: "Wight Knight" },
      { index: 0x1f8, name: "Gargoyle" },
      { index: 0x1fb, name: "Pirate" },
      { index: 0x1fe, name: "Air Pirate" },
      { index: 0x201, name: "Darkball" },
      { index: 0x204, name: "Defender" },
      { index: 0x207, name: "Wyvern" },
      { index: 0x20a, name: "Wizard" },
      { index: 0x20d, name: "Neoshadow" },
      { index: 0x210, name: "White Mushroom" },
      { index: 0x211, name: "Black Fungus" },
      { index: 0x214, name: "Creeper Plant" },
      { index: 0x217, name: "Tornado Step" },
      { index: 0x21a, name: "Crescendo" },
      { index: 0x21d, name: "Guard Armor" },
      { index: 0x21e, name: "Parasite Cage" },
      { index: 0x21f, name: "Trickmaster" },
      { index: 0x220, name: "Darkside" },
      { index: 0x221, name: "Card Soldier (Heart)" },
      { index: 0x224, name: "Card Soldier (Spade)" },
      { index: 0x227, name: "Hades" },
      { index: 0x228, name: "Jafar" },
      { index: 0x229, name: "Oogie Boogie" },
      { index: 0x22a, name: "Ursula" },
      { index: 0x22b, name: "Hook" },
      { index: 0x22c, name: "Dragon Maleficent" },
      { index: 0x22d, name: "Riku" },
      { index: 0x22e, name: "Axel" },
      { index: 0x22f, name: "Larxene" },
      { index: 0x230, name: "Vexen" },
      { index: 0x231, name: "Marluxia (1)" },
      { index: 0x232, name: "Marluxia (2)" },
      { index: 0x233, name: "Lexaeus" },
      { index: 0x234, name: "Ansem" },
    ],
  },
];

export const cards: Resource = {};
export const cardsGroups: ResourceGroups = [];

cardTypes.forEach((type) => {
  const typeGroup: { name: string; options: number[] } = {
    name: type.name,
    options: [],
  };

  type.cards.forEach((card) => {
    const group: { name: string; options: number[] } = {
      name: card.name,
      options: [],
    };

    for (let i = 0; i < type.values; i += 1) {
      for (let j = 0; j < 2; j += 1) {
        const cardIndex = (j << 0xc) | (card.index + i);

        cards[cardIndex] = card.name;

        if (type.values > 1) {
          cards[cardIndex] =
            `${j === 1 ? "* " : ""}${cards[cardIndex]} (${i}) ${j === 1 ? " *" : ""}`;
        }

        group.options.push(cardIndex);
        typeGroup.options.push(cardIndex);
      }
    }

    if (type.values === 10) {
      cardsGroups.push(group);
    }
  });

  if (type.values === 1) {
    cardsGroups.push(typeGroup);
  }
});

export const mapCards = [
  {
    name: "Red Cards",
    hasSingleCards: false,
    cards: [
      { index: 0x0, name: "Tranquil Darkness" },
      { index: 0x1, name: "Teeming Darkness" },
      { index: 0x2, name: "Feeble Darkness" },
      { index: 0x3, name: "Almighty Darkness" },
      { index: 0x4, name: "Sleeping Darkness" },
      { index: 0x5, name: "Looming Darkness" },
      { index: 0x6, name: "Premium Room" },
      { index: 0x7, name: "White Room" },
      { index: 0x8, name: "Black Room" },
    ],
  },
  {
    name: "Green Cards",
    hasSingleCards: false,
    cards: [
      { index: 0x9, name: "Martial Waking" },
      { index: 0xa, name: "Sorcerous Waking" },
      { index: 0xb, name: "Alchemic Waking" },
      { index: 0xc, name: "Meeting Ground" },
      { index: 0xd, name: "Stagnant Space" },
      { index: 0xe, name: "Strong Initiative" },
      { index: 0xf, name: "Lasting Daze" },
    ],
  },
  {
    name: "Blue Cards",
    hasSingleCards: false,
    cards: [
      { index: 0x10, name: "Calm Bounty" },
      { index: 0x11, name: "Guarded Trove" },
      { index: 0x12, name: "False Bounty" },
      { index: 0x13, name: "Moment's Reprieve" },
      { index: 0x14, name: "Mingling Worlds" },
      { index: 0x15, name: "Moogle Room" },
    ],
  },
  {
    name: "Gold Cards",
    hasSingleCards: true,
    cards: [
      { index: 0x16, name: "Key of Beginnings" },
      { index: 0x17, name: "Key of Guidance" },
      { index: 0x18, name: "Key to Truth" },
      { index: 0x19, name: "Key to Rewards" },
    ],
  },
];
