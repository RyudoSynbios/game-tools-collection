import type { Resource, ResourceLabels } from "$lib/types";

export const animals = [
  "Rat",
  "Hen",
  "Hare",
  "Cat",
  "Dog",
  "Ape",
  "Ram",
  "Topi",
  "Steed",
  "Wolf",
  "Bull",
  "Puma",
  "Bear",
  "Tiger",
  "Lion",
  "Dragon",
];

export const colors = ["Gray", "Opal", "Jade", "Ebon", "Rose", "Gold"];

export const rankings: Resource = {};
export const rankingsLabels: ResourceLabels = {};

animals.forEach((animal, animalIndex) => {
  let index = animalIndex * colors.length;

  colors.forEach((color, colorIndex) => {
    colorIndex += index;
    rankings[colorIndex] = `#${96 - colorIndex} ${color} ${animal}`;
  });

  rankingsLabels[index] = animal;
});

export const fieldTrainings = [
  "Troop Orders",
  "Terrain Intel",
  "Base Capture",
  "Unit Repair",
  "APC ABCs",
  "Tank Ops",
  "Copter Tactics",
  "Air Assault",
  "Air Defense",
  "Dogfights",
  "Naval Forces",
  "Climate Status",
  "Fog of War",
  "Special Intel",
];

export interface Mission {
  index: number;
  cos: string;
  name: string;
  description?: string;
  hidden?: boolean;
}

// prettier-ignore
export const missionList: Mission[] = [
  { index: 0x00, cos: "0--", name: "It's War!" },
  { index: 0x01, cos: "0--", name: "Gunfighter!" },
  { index: 0x02, cos: "0--", name: "Air Ace!" },
  { index: 0x03, cos: "04-", name: "Max Strikes!"     , description: "Andy" },
  { index: 0x04, cos: "-0-", name: "Max's Folly?" },
  { index: 0x05, cos: "00-", name: "Olaf's Navy" },
  { index: 0x06, cos: "00-", name: "Olaf's Sea Strike!" },
  { index: 0x07, cos: "-0-", name: "Max Strikes!"     , description: "Max", hidden: true },
  { index: 0x08, cos: "00-", name: "Sniper!" },
  { index: 0x09, cos: "00-", name: "Blizzard Battle!" },
  { index: 0x0a, cos: "-0-", name: "History Lesson!" },
  { index: 0x0b, cos: "000", name: "Sami's Debut!" },
  { index: 0x0c, cos: "000", name: "Kanbei Arrives!" },
  { index: 0x0d, cos: "000", name: "Mighty Kanbei!" },
  { index: 0x0e, cos: "000", name: "Kanbei's Error?" },
  { index: 0x0f, cos: "-0-", name: "Divide & Conquer!" },
  { index: 0x10, cos: "--0", name: "Sami Marches On!" },
  { index: 0x11, cos: "0--", name: "Sonja's Goal!" },
  { index: 0x12, cos: "012", name: "Captain Drake!"   , description: "Andy" },
  { index: 0x13, cos: "-0-", name: "Captain Drake!"   , description: "Max" , hidden: true },
  { index: 0x14, cos: "--0", name: "Captain Drake!"   , description: "Sami", hidden: true },
  { index: 0x15, cos: "012", name: "Naval Clash!"     , description: "Andy" },
  { index: 0x16, cos: "-0-", name: "Naval Clash!"     , description: "Max" , hidden: true },
  { index: 0x17, cos: "--0", name: "Naval Clash!"     , description: "Sami", hidden: true },
  { index: 0x18, cos: "012", name: "Wings of Victory!", description: "Andy" },
  { index: 0x19, cos: "-0-", name: "Wings of Victory!", description: "Max" , hidden: true },
  { index: 0x1a, cos: "--0", name: "Wings of Victory!", description: "Sami", hidden: true },
  { index: 0x1b, cos: "012", name: "Battle Mystery!"  , description: "Andy" },
  { index: 0x1c, cos: "-0-", name: "Battle Mystery!"  , description: "Max" , hidden: true },
  { index: 0x1d, cos: "--0", name: "Battle Mystery!"  , description: "Sami", hidden: true },
  { index: 0x1e, cos: "000", name: "Andy Times Two!" },
  { index: 0x1f, cos: "000", name: "Enigma" },
  { index: 0x20, cos: "0--", name: "The Final Battle!" },
  { index: 0x21, cos: "0--", name: "Rivals!" },
];

export const missions = missionList.reduce((maps: Resource, map) => {
  maps[map.index] =
    `${map.name}${map.description ? ` (${map.description})` : ""}`;

  return maps;
}, {});

export const nextMissions = missionList.reduce((maps: Resource, map) => {
  if (map.index !== 0x0 && !map.hidden) {
    maps[map.index] = map.name;
  }

  return maps;
}, {});

export const rankPoints = [249, 449, 649, 849, 949];

export const warRoomMapList = [
  "Spann Island",
  "Moji Island",
  "Duo Falls",
  "Sole Harbor",
  "Pivot Isle",
  "Land's End",
  "Kita Straight",
  "Point Stormy",
  "Ridge Island",
  "Mial's Hope",
  "Bounty River",
  "Toil Ferry",
  "Twin Isle",
  "Dire Range",
  "Egg Islands",
  "Terra Maw",
  "Stamp Islands",
  "Rivers Four",
  "Ring Islands",
  "Last Mission",
];

export const warRoomMaps = warRoomMapList.reduce(
  (maps: Resource, map, index) => {
    maps[index] = map;

    return maps;
  },
  {},
);
