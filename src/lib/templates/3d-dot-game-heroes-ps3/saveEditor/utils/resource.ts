import { Resource } from "$lib/types";

export const swords = {
  0x0: "Ancient Sword",
  0x1: "Holy Sword",
  0x2: "Hero Sword",
  0x3: "Luck Mallet",
  0x4: "Gorgon Sword",
  0x5: "Luck Sword",
  0x6: "Wing Sword",
  0x7: "Star Sword",
  0x8: "Mage Sword",
  0x9: "Rare Fish",
  0xa: "Sword",
  0xb: "Excalibur",
  0xc: "Katana",
  0xd: "Moon Sword",
  0xe: "Wyrm Sword",
  0xf: "Orihalcon",
  0x10: "Karasawa",
  0x11: "Wood Bat",
  0x12: "Home Run Bat",
  0x13: "Giga Sword",
  0x14: "Claymore",
  0x15: "Beam Sword",
  0x16: "Gungnir",
  0x17: "Gladius",
};

export const equipSwords: Resource = {};

Object.entries(swords).forEach(([key, value]) => {
  equipSwords[parseInt(key) + 0x1] = value;
});
