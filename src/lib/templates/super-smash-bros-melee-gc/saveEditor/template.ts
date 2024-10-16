import type { GameJson } from "$lib/types";

const template: GameJson = {
  validator: {
    regions: {
      europe: {
        0x0: [0x47, 0x41, 0x4c, 0x50, 0x30, 0x31], // "GALP01"
      },
    },
    text: "Drag 'n' drop here or click to add a save file.",
    error: "Not a valid save file.",
  },
  items: [
    {
      type: "tabs",
      items: [
        {
          name: "General",
          flex: true,
          items: [
            {
              name: "Coins",
              offset: 0x1e0,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
            },
            {
              name: "Power Count",
              offset: 0x1e8,
              type: "variable",
              dataType: "uint32",
              bigEndian: true,
            },
            {
              name: "Unlocked Challengers",
              type: "bitflags",
              flags: [
                { offset: 0x1, bit: 0, label: "Mr. Game & Watch" }, // prettier-ignore
                { offset: 0x1, bit: 1, label: "Pikatchu" }, // prettier-ignore
                { offset: 0x1, bit: 2, label: "Marth" }, // prettier-ignore
                { offset: 0x1, bit: 3, label: "Mewtwo" }, // prettier-ignore
                { offset: 0x1, bit: 4, label: "Jigglypuff" }, // prettier-ignore
                { offset: 0x1, bit: 5, label: "Falco" }, // prettier-ignore
                { offset: 0x1, bit: 6, label: "Young Link" }, // prettier-ignore
                { offset: 0x1, bit: 7, label: "Dr. Mario" }, // prettier-ignore
                { offset: 0x0, bit: 0, label: "Roy" }, // prettier-ignore
                { offset: 0x0, bit: 1, label: "Pichu" }, // prettier-ignore
                { offset: 0x0, bit: 2, label: "Ganondorf" }, // prettier-ignore
                { offset: 0x0, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x0, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            {
              name: "Unlocked Stages",
              type: "bitflags",
              flags: [
                { offset: 0x3, bit: 0, label: "Planet Zebes: Brinstar Depths" }, // prettier-ignore
                { offset: 0x3, bit: 1, label: "Kanto Skies: Poké Floats" }, // prettier-ignore
                { offset: 0x3, bit: 2, label: "F-Zero Grand Prix: Big Blue" }, // prettier-ignore
                { offset: 0x3, bit: 3, label: "Eagleland: Fourside" }, // prettier-ignore
                { offset: 0x3, bit: 4, label: "Mushroom: Kingdom II" }, // prettier-ignore
                { offset: 0x3, bit: 5, label: "Superflat World: Flat Zone" }, // prettier-ignore
                { offset: 0x3, bit: 6, label: "Special Stages: Battlefield" }, // prettier-ignore
                { offset: 0x3, bit: 7, label: "Special Stages: Final Destination" }, // prettier-ignore
                { offset: 0x2, bit: 0, label: "Past Stages: Dream Land N64" }, // prettier-ignore
                { offset: 0x2, bit: 1, label: "Past Stages: Yoshi's Island N64" }, // prettier-ignore
                { offset: 0x2, bit: 2, label: "Past Stages: Kongo Jungle N64" }, // prettier-ignore
                { offset: 0x2, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            {
              name: "Unlocked Options",
              type: "bitflags",
              flags: [
                { offset: 0x5, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x5, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 1, label: "Random Stage" }, // prettier-ignore
                { offset: 0x4, bit: 2, label: "All-Star" }, // prettier-ignore
                { offset: 0x4, bit: 3, label: "Sound Test" }, // prettier-ignore
                { offset: 0x4, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x4, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
          ],
        },
        {
          name: "Event Match",
          items: [
            {
              type: "bitflags",
              flags: [
                { offset: 0x207, bit: 0, label: "Lv. 1: Trouble King" }, // prettier-ignore
                { offset: 0x207, bit: 1, label: "Lv. 2: Lord of the Jungle" }, // prettier-ignore
                { offset: 0x207, bit: 2, label: "Lv. 3: Bomb-fest" }, // prettier-ignore
                { offset: 0x207, bit: 3, label: "Lv. 4: Dino-wrangling" }, // prettier-ignore
                { offset: 0x207, bit: 4, label: "Lv. 5: Spare Change" }, // prettier-ignore
                { offset: 0x207, bit: 5, label: "Lv. 6: Kirbys on Parade" }, // prettier-ignore
                { offset: 0x207, bit: 6, label: "Lv. 7: Pokémon Battle" }, // prettier-ignore
                { offset: 0x207, bit: 7, label: "Lv. 8: Hot Date on Brinstar" }, // prettier-ignore
                { offset: 0x206, bit: 0, label: "Lv. 9: Hide 'n' Sheik" }, // prettier-ignore
                { offset: 0x206, bit: 1, label: "Lv. 10: All-Star Match 1" }, // prettier-ignore
                { offset: 0x206, bit: 2, label: "Lv. 11: King of the Mountain" }, // prettier-ignore
                { offset: 0x206, bit: 3, label: "Lv. 12: Seconds, Anyone?" }, // prettier-ignore
                { offset: 0x206, bit: 4, label: "Lv. 13: Yoshi's Egg" }, // prettier-ignore
                { offset: 0x206, bit: 5, label: "Lv. 14: Trophy Tussle 1" }, // prettier-ignore
                { offset: 0x206, bit: 6, label: "Lv. 15: Girl Power" }, // prettier-ignore
                { offset: 0x206, bit: 7, label: "Lv. 16: Kirby's Air-raid" }, // prettier-ignore
                { offset: 0x205, bit: 0, label: "Lv. 17: Bounty Hunters" }, // prettier-ignore
                { offset: 0x205, bit: 1, label: "Lv. 18: Link's Adventure" }, // prettier-ignore
                { offset: 0x205, bit: 2, label: "Lv. 19: Peach's Peril" }, // prettier-ignore
                { offset: 0x205, bit: 3, label: "Lv. 20: All-Star Match 2" }, // prettier-ignore
                { offset: 0x205, bit: 4, label: "Lv. 21: Ice Breaker" }, // prettier-ignore
                { offset: 0x205, bit: 5, label: "Lv. 22: Super Mario 128" }, // prettier-ignore
                { offset: 0x205, bit: 6, label: "Lv. 23: Slippy's Invention" }, // prettier-ignore
                { offset: 0x205, bit: 7, label: "Lv. 24: The Yoshi Herd" }, // prettier-ignore
                { offset: 0x204, bit: 0, label: "Lv. 25: Gargantuans" }, // prettier-ignore
                { offset: 0x204, bit: 1, label: "Lv. 26: Trophy Tussle 2" }, // prettier-ignore
                { offset: 0x204, bit: 2, label: "Lv. 27: Cold Armor" }, // prettier-ignore
                { offset: 0x204, bit: 3, label: "Lv. 28: Puffballs Unite!" }, // prettier-ignore
                { offset: 0x204, bit: 4, label: "Lv. 29: Triforce Gathering" }, // prettier-ignore
                { offset: 0x204, bit: 5, label: "Lv. 30: All-Star Match 3" }, // prettier-ignore
                { offset: 0x204, bit: 6, label: "Lv. 31: Mario Bros. Madness" }, // prettier-ignore
                { offset: 0x204, bit: 7, label: "Lv. 32: Target Acquired" }, // prettier-ignore
                { offset: 0x203, bit: 0, label: "Lv. 33: Lethal Marathon" }, // prettier-ignore
                { offset: 0x203, bit: 1, label: "Lv. 34: Seven Years" }, // prettier-ignore
                { offset: 0x203, bit: 2, label: "Lv. 35: Time for a Checkup" }, // prettier-ignore
                { offset: 0x203, bit: 3, label: "Lv. 36: Space Travelers" }, // prettier-ignore
                { offset: 0x203, bit: 4, label: "Lv. 37: Legendary Pokémon" }, // prettier-ignore
                { offset: 0x203, bit: 5, label: "Lv. 38: Super Mario Bros. 2" }, // prettier-ignore
                { offset: 0x203, bit: 6, label: "Lv. 39: Jigglypuff Live!" }, // prettier-ignore
                { offset: 0x203, bit: 7, label: "Lv. 40: All-Star Match 4" }, // prettier-ignore
                { offset: 0x202, bit: 0, label: "Lv. 41: En Garde!" }, // prettier-ignore
                { offset: 0x202, bit: 1, label: "Lv. 42: Trouble King 2" }, // prettier-ignore
                { offset: 0x202, bit: 2, label: "Lv. 43: Birds of Prey" }, // prettier-ignore
                { offset: 0x202, bit: 3, label: "Lv. 44: Mewtwo Strikes!" }, // prettier-ignore
                { offset: 0x202, bit: 4, label: "Lv. 45: Game & Watch Forever" }, // prettier-ignore
                { offset: 0x202, bit: 5, label: "Lv. 46: Fire Emblem Pride" }, // prettier-ignore
                { offset: 0x202, bit: 6, label: "Lv. 47: Trophy Tussle 3" }, // prettier-ignore
                { offset: 0x202, bit: 7, label: "Lv. 48: Pikachu and Pichu" }, // prettier-ignore
                { offset: 0x201, bit: 0, label: "Lv. 49: All-Star Match Deluxe" }, // prettier-ignore
                { offset: 0x201, bit: 1, label: "Lv. 50: Final Destination Match" }, // prettier-ignore
                { offset: 0x201, bit: 2, label: "Lv. 51: The Showdown" }, // prettier-ignore
                { offset: 0x200, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x200, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x201, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x201, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x201, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x201, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x201, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            { name: "Lv. 1: Trouble King", offset: 0x208, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 2: Lord of the Jungle", offset: 0x20C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 3: Bomb-fest", offset: 0x210, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 4: Dino-wrangling", offset: 0x214, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 5: Spare Change", offset: 0x218, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 6: Kirbys on Parade", offset: 0x21C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 7: Pokémon Battle", offset: 0x220, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 8: Hot Date on Brinstar", offset: 0x224, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 9: Hide 'n' Sheik", offset: 0x228, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 10: All-Star Match 1", offset: 0x22C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 11: King of the Mountain", offset: 0x230, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 12: Seconds, Anyone?", offset: 0x234, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 13: Yoshi's Egg", offset: 0x238, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 14: Trophy Tussle 1", offset: 0x23C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 15: Girl Power", offset: 0x240, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 16: Kirby's Air-raid", offset: 0x244, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 17: Bounty Hunters", offset: 0x248, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 18: Link's Adventure", offset: 0x24C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 19: Peach's Peril", offset: 0x250, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 20: All-Star Match 2", offset: 0x254, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 21: Ice Breaker", offset: 0x258, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 22: Super Mario 128", offset: 0x25C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 23: Slippy's Invention", offset: 0x260, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 24: The Yoshi Herd", offset: 0x264, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 25: Gargantuans", offset: 0x268, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 26: Trophy Tussle 2", offset: 0x26C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 27: Cold Armor", offset: 0x270, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 28: Puffballs Unite!", offset: 0x274, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 29: Triforce Gathering", offset: 0x278, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 30: All-Star Match 3", offset: 0x27C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 31: Mario Bros. Madness", offset: 0x280, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 32: Target Acquired", offset: 0x284, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 33: Lethal Marathon", offset: 0x288, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 34: Seven Years", offset: 0x28C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 35: Time for a Checkup", offset: 0x290, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 36: Space Travelers", offset: 0x294, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 37: Legendary Pokémon", offset: 0x298, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 38: Super Mario Bros. 2", offset: 0x29C, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 39: Jigglypuff Live!", offset: 0x2A0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 40: All-Star Match 4", offset: 0x2A4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 41: En Garde!", offset: 0x2A8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 42: Trouble King 2", offset: 0x2AC, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 43: Birds of Prey", offset: 0x2B0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 44: Mewtwo Strikes!", offset: 0x2B4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 45: Game & Watch Forever", offset: 0x2B8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 46: Fire Emblem Pride", offset: 0x2BC, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 47: Trophy Tussle 3", offset: 0x2C0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 48: Pikachu and Pichu", offset: 0x2C4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 49: All-Star Match Deluxe", offset: 0x2C8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 50: Final Destination Match", offset: 0x2CC, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Lv. 51: The Showdown", offset: 0x2D0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "???", offset: 0x2D4, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
            { name: "???", offset: 0x2D8, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
            { name: "???", offset: 0x2DC, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
            { name: "???", offset: 0x2E0, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
          ],
        },
        {
          name: "Messages",
          items: [
            {
              type: "bitflags",
              flags: [
                { offset: 0x2e4, bit: 0, label: "Random Stage Select is now available in Additional Rules!" }, // prettier-ignore
                { offset: 0x2e4, bit: 1, label: "You've encountered Mew for the first time!" }, // prettier-ignore
                { offset: 0x2e4, bit: 2, label: "You've encountered Celebi for the first time!" }, // prettier-ignore
                { offset: 0x2e4, bit: 3, label: "Check out smashing sounds! Find Sound Test under Data." }, // prettier-ignore
                { offset: 0x2e4, bit: 4, label: "You've unlocked all playable characters! Get to fighting!" }, // prettier-ignore
                { offset: 0x2e4, bit: 5, label: "All stages are now open!" }, // prettier-ignore
                { offset: 0x2e4, bit: 6, label: "Congratulations! You've cleared 1-P Classic!" }, // prettier-ignore
                { offset: 0x2e4, bit: 7, label: "Congratulations! You've cleared 1-P Adventure!" }, // prettier-ignore
                { offset: 0x2e5, bit: 0, label: "Access to Flat Zone has been granted. Time to get retro!" }, // prettier-ignore
                { offset: 0x2e5, bit: 1, label: "The special stage, Battlefield, has now been unlocked!" }, // prettier-ignore
                { offset: 0x2e5, bit: 2, label: "The gateway to Final Destination has now been opened!" }, // prettier-ignore
                { offset: 0x2e5, bit: 3, label: "A blast from the past! Dream Land is yours to use." }, // prettier-ignore
                { offset: 0x2e5, bit: 4, label: "Take a step back in time to lovely Yoshi's Island!" }, // prettier-ignore
                { offset: 0x2e5, bit: 5, label: "Welcome back to DK's first locale, Kongo Jungle!" }, // prettier-ignore
                { offset: 0x2e5, bit: 6, label: "1-P All-Star mode is now open! Better practice up!" }, // prettier-ignore
                { offset: 0x2e5, bit: 7, label: "You can now set up the score display in Additional Rules!" }, // prettier-ignore
                { offset: 0x2e6, bit: 0, label: "Star Fox's surly pilot Falco is now prepped for combat!" }, // prettier-ignore
                { offset: 0x2e6, bit: 1, label: "Cute, cuddly...and a threat to itself and others! It's Pichu!" }, // prettier-ignore
                { offset: 0x2e6, bit: 2, label: "Roy from Fire Emblem has unsheathed his sword!" }, // prettier-ignore
                { offset: 0x2e6, bit: 3, label: "Welcome to Brinstar Depths! Kraid's been waiting for you!" }, // prettier-ignore
                { offset: 0x2e6, bit: 4, label: "You've unlocked an alien invasion! It's Fourside!!" }, // prettier-ignore
                { offset: 0x2e6, bit: 5, label: "It's a flotilla of Pokémon! You've unlocked Poké Floats!" }, // prettier-ignore
                { offset: 0x2e6, bit: 6, label: "Side-scrolling madness awaits on F-Zero's Big Blue!" }, // prettier-ignore
                { offset: 0x2e6, bit: 7, label: "Mushroom Kingdom II is open: it's the dream world, Subcon!" }, // prettier-ignore
                { offset: 0x2e7, bit: 0, label: "You've unlocked the singing wonder, Jigglypuff!" }, // prettier-ignore
                { offset: 0x2e7, bit: 1, label: "Mewtwo's mental powers are now yours to command!" }, // prettier-ignore
                { offset: 0x2e7, bit: 2, label: "The man in green, Luigi, is ready for action!" }, // prettier-ignore
                { offset: 0x2e7, bit: 3, label: "Direct from Fire Emblem, it's Marth, the swordsman supreme!" }, // prettier-ignore
                { offset: 0x2e7, bit: 4, label: "Mr. Game & Watch is ready to rock, old-school style!" }, // prettier-ignore
                { offset: 0x2e7, bit: 5, label: "Dr. Mario is in the house! His prescription? KOs." }, // prettier-ignore
                { offset: 0x2e7, bit: 6, label: "A great evil walks the eart... Ganondorf has been unlocked!" }, // prettier-ignore
                { offset: 0x2e7, bit: 7, label: "Fast, nimble, and ready to roll, Young Link awaits you!" }, // prettier-ignore
                { offset: 0x2e8, bit: 0, label: "You have over 100 trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 1, label: "You have over 150 trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 2, label: "You have over 200 trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 3, label: "You've collected more than 250 trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 4, label: "You have all the trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 5, label: "You have all trophies, including gift trophies!" }, // prettier-ignore
                { offset: 0x2e8, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2e8, bit: 7, label: "You got the Samus Unmasked trophy! Lucky you!" }, // prettier-ignore
                { offset: 0x2e9, bit: 0, label: "You've fought 1,000 VS. mode matches!" }, // prettier-ignore
                { offset: 0x2e9, bit: 1, label: "You've fought 10,000 VS. mode matches!" }, // prettier-ignore
                { offset: 0x2e9, bit: 2, label: "You've fought 100,000 VS. mode matches! Go outside!" }, // prettier-ignore
                { offset: 0x2e9, bit: 3, label: "1,000,000 VS. mode matches! Never thought you'd see this!" }, // prettier-ignore
                { offset: 0x2e9, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2e9, bit: 5, label: "You've played 4,995 VS. bouts! That's about a cent per bout!" }, // prettier-ignore
                { offset: 0x2e9, bit: 6, label: "You've played 50,000 VS. bouts! Enough! Take a break!" }, // prettier-ignore
                { offset: 0x2e9, bit: 7, label: "You have over 50 trophies!" }, // prettier-ignore
                { offset: 0x2ea, bit: 0, label: "For the first time, you've survived 15-Minute Melee!" }, // prettier-ignore
                { offset: 0x2ea, bit: 1, label: "You've cleared Classic Mode on Very Hard!" }, // prettier-ignore
                { offset: 0x2ea, bit: 2, label: "You've cleared Classic Mode on Very Hard with a stock of one!" }, // prettier-ignore
                { offset: 0x2ea, bit: 3, label: "You've cleared Adventure Mode on Very Hard!" }, // prettier-ignore
                { offset: 0x2ea, bit: 4, label: "You beat Adventure Mode on Very Hard with a stock of one!" }, // prettier-ignore
                { offset: 0x2ea, bit: 5, label: "You've cleared All-Star Mode on Very Hard!" }, // prettier-ignore
                { offset: 0x2ea, bit: 6, label: "You beat All-Star Mode on Very Hard with a stock of one!" }, // prettier-ignore
                { offset: 0x2ea, bit: 7, label: "You've fought 100 VS. mode matches!" }, // prettier-ignore
                { offset: 0x2eb, bit: 0, label: "Congratulations! You've cleared 1-P All-Star!" }, // prettier-ignore
                { offset: 0x2eb, bit: 1, label: "Wow! You've cleared 1-P Classic with every character!" }, // prettier-ignore
                { offset: 0x2eb, bit: 2, label: "You've cleared 1-P Adventure with every character! Great!" }, // prettier-ignore
                { offset: 0x2eb, bit: 3, label: "You've cleared 1-P All-Star with every character! Sweet!" }, // prettier-ignore
                { offset: 0x2eb, bit: 4, label: "You've cleared 30 1-P Event Matches!" }, // prettier-ignore
                { offset: 0x2eb, bit: 5, label: "You've cleared all 1-P Event Matches!" }, // prettier-ignore
                { offset: 0x2eb, bit: 6, label: "You've cleared Target Test with all characters! Great!" }, // prettier-ignore
                { offset: 0x2eb, bit: 7, label: "You've cleared 100-Man Melee for the first time!" }, // prettier-ignore
                { offset: 0x2ec, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ec, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ed, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 0, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 1, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ee, bit: 7, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 0, label: "You got the Mario and Yoshi trophy! They're pals again!" }, // prettier-ignore
                { offset: 0x2ef, bit: 1, label: "You beat Event Match 51, The Showdown, with no falls!" }, // prettier-ignore
                { offset: 0x2ef, bit: 2, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 3, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 4, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 5, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 6, label: "???", hidden: true }, // prettier-ignore
                { offset: 0x2ef, bit: 7, label: "???", hidden: true }, // prettier-ignore
              ],
            },
            { name: "Lv. 1: Trouble King", offset: 0x208, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've unlocked the singing wonder, Jigglypuff!", offset: 0x318, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Mewtwo's mental powers are now yours to command!", offset: 0x31c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "The man in green, Luigi, is ready for action!", offset: 0x320, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Direct from Fire Emblem, it's Marth, the swordsman supreme!", offset: 0x324, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Mr. Game & Watch is ready to rock, old-school style!", offset: 0x328, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Dr. Mario is in the house! His prescription? KOs.", offset: 0x32c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "A great evil walks the eart... Ganondorf has been unlocked!", offset: 0x330, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Fast, nimble, and ready to roll, Young Link awaits you!", offset: 0x334, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Star Fox's surly pilot Falco is now prepped for combat!", offset: 0x338, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Cute, cuddly...and a threat to itself and others! It's Pichu!", offset: 0x33c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Roy from Fire Emblem has unsheathed his sword!", offset: 0x340, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Welcome to Brinstar Depths! Kraid's been waiting for you!", offset: 0x344, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've unlocked an alien invasion! It's Fourside!!", offset: 0x348, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "It's a flotilla of Pokémon! You've unlocked Poké Floats!", offset: 0x34c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Side-scrolling madness awaits on F-Zero's Big Blue!", offset: 0x350, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Mushroom Kingdom II is open: it's the dream world, Subcon!", offset: 0x354, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Access to Flat Zone has been granted. Time to get retro!", offset: 0x358, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "The special stage, Battlefield, has now been unlocked!", offset: 0x35c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "The gateway to Final Destination has now been opened!", offset: 0x360, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "A blast from the past! Dream Land is yours to use.", offset: 0x364, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Take a step back in time to lovely Yoshi's Island!", offset: 0x368, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Welcome back to DK's first locale, Kongo Jungle!", offset: 0x36c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "1-P All-Star mode is now open! Better practice up!", offset: 0x370, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You can now set up the score display in Additional Rules!", offset: 0x374, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Random Stage Select is now available in Additional Rules!", offset: 0x378, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've encountered Mew for the first time!", offset: 0x37c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've encountered Celebi for the first time!", offset: 0x380, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Check out smashing sounds! Find Sound Test under Data.", offset: 0x384, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've unlocked all playable characters! Get to fighting!", offset: 0x388, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "All stages are now open!", offset: 0x38c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Congratulations! You've cleared 1-P Classic!", offset: 0x390, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Congratulations! You've cleared 1-P Adventure!", offset: 0x394, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Congratulations! You've cleared 1-P All-Star!", offset: 0x398, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "Wow! You've cleared 1-P Classic with every character!", offset: 0x39c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared 1-P Adventure with every character! Great!", offset: 0x3a0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared 1-P All-Star with every character! Sweet!", offset: 0x3a4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared 30 1-P Event Matches!", offset: 0x3a8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared all 1-P Event Matches!", offset: 0x3ac, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared Target Test with all characters! Great!", offset: 0x3b0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared 100-Man Melee for the first time!", offset: 0x3b4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "For the first time, you've survived 15-Minute Melee!", offset: 0x3b8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared Classic Mode on Very Hard!", offset: 0x3bc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared Classic Mode on Very Hard with a stock of one!", offset: 0x3c0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared Adventure Mode on Very Hard!", offset: 0x3c4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You beat Adventure Mode on Very Hard with a stock of one!", offset: 0x3c8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've cleared All-Star Mode on Very Hard!", offset: 0x3cc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You beat All-Star Mode on Very Hard with a stock of one!", offset: 0x3d0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've fought 100 VS. mode matches!", offset: 0x3d4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've fought 1,000 VS. mode matches!", offset: 0x3d8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've fought 10,000 VS. mode matches!", offset: 0x3dc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've fought 100,000 VS. mode matches! Go outside!", offset: 0x3e0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "1,000,000 VS. mode matches! Never thought you'd see this!", offset: 0x3e4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "???", offset: 0x3e8, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
            { name: "You've played 4,995 VS. bouts! That's about a cent per bout!", offset: 0x3ec, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've played 50,000 VS. bouts! Enough! Take a break!", offset: 0x3f0, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have over 50 trophies!", offset: 0x3f4, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have over 100 trophies!", offset: 0x3f8, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have over 150 trophies!", offset: 0x3fc, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have over 200 trophies!", offset: 0x400, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You've collected more than 250 trophies!", offset: 0x404, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have all the trophies!", offset: 0x408, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You have all trophies, including gift trophies!", offset: 0x40c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "???", offset: 0x410, type: "variable", dataType: "uint32", bigEndian: true, hidden: true }, // prettier-ignore
            { name: "You got the Samus Unmasked trophy! Lucky you!", offset: 0x414, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You got the Mario and Yoshi trophy! They're pals again!", offset: 0x418, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
            { name: "You beat Event Match 51, The Showdown, with no falls!", offset: 0x41c, type: "variable", dataType: "uint32", bigEndian: true }, // prettier-ignore
          ],
        },
      ],
    },
  ],
};

export default template;
