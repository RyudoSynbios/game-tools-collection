import type { Resource } from "$lib/types";

// prettier-ignore
export const chapterList = [
  { index: 0x01, number:  1, alt:  "", name: "An Innocent Girl" },
  { index: 0x02, number:  2, alt: "a", name: "Castle of Doom" },
  { index: 0x1b, number:  2, alt: "b", name: "Fool's Fortune" },
  { index: 0x03, number:  3, alt: "a", name: "A Friendship Oath" },
  { index: 0x1c, number:  3, alt: "b", name: "Pursuit of Friends" },
  { index: 0x04, number:  4, alt:  "", name: "Tangled Thoughts" },
  { index: 0x05, number:  5, alt: "a", name: "Vengeance" },
  { index: 0x1e, number:  5, alt: "b", name: "Ordeal of the Young" },
  { index: 0x06, number:  6, alt:  "", name: "Castle of Illusion" },
  { index: 0x07, number:  7, alt: "a", name: "Countdown to Ruin" },
  { index: 0x27, number:  7, alt: "b", name: "Deception" },
  { index: 0x08, number:  8, alt: "a", name: "Loyal Soldiers" },
  { index: 0x1d, number:  8, alt: "b", name: "Test of Loyalty" },
  { index: 0x09, number:  9, alt:  "", name: "Ignorant Greed" },
  { index: 0x0a, number: 10, alt: "a", name: "Invitation to Evil" },
  { index: 0x2b, number: 10, alt: "b", name: "Darkness Falls" },
  { index: 0x0b, number: 11, alt: "a", name: "Corruption" },
  { index: 0x28, number: 11, alt: "b", name: "Prison of Time" },
  { index: 0x0c, number: 12, alt:  "", name: "Fading Souls" },
  { index: 0x0d, number: 13, alt: "a", name: "Lingering Thoughts" },
  { index: 0x29, number: 13, alt: "b", name: "Sympathy's Price" },
  { index: 0x0e, number: 14, alt:  "", name: "Small Sacrifice" },
  { index: 0x0f, number: 15, alt:  "", name: "Brave Promise" },
  { index: 0x10, number: 16, alt:  "", name: "The Ruins Defiled" },
  { index: 0x11, number: 17, alt: "a", name: "Red Blood Oath" },
  { index: 0x2c, number: 17, alt: "b", name: "Call of Blood" },
  { index: 0x12, number: 18, alt:  "", name: "Timenoid Shadows" },
  { index: 0x13, number: 19, alt: "a", name: "The Indelible Mark" },
  { index: 0x1f, number: 19, alt: "b", name: "Final Gamble" },
  { index: 0x14, number: 20, alt: "a", name: "Replicas Destroyed" },
  { index: 0x20, number: 20, alt: "b", name: "Master's Strings" },
  { index: 0x15, number: 21, alt: "a", name: "2 Wrongs = 1 Right" },
  { index: 0x21, number: 21, alt: "b", name: "Road to Ruin" },
  { index: 0x16, number: 22, alt: "a", name: "Ancestors Shadows" },
  { index: 0x22, number: 22, alt: "b", name: "Bloody Hands" },
  { index: 0x17, number: 23, alt: "a", name: "Unquenched Thirst" },
  { index: 0x23, number: 23, alt: "b", name: "Scarred Memories" },
  { index: 0x18, number: 24, alt: "a", name: "Broken Bonds" },
  { index: 0x24, number: 24, alt: "b", name: "Shared Wounds" },
  { index: 0x19, number: 25, alt: "a", name: "Torn Thoughts" },
  { index: 0x25, number: 25, alt: "b", name: "Anguish" },
  { index: 0x1a, number: 26, alt: "a", name: "Eve of Destruction" },
  { index: 0x26, number: 26, alt: "b", name: "Outcasts" },
  { index: 0x2a, number: 26, alt: "c", name: "Deliverance" },
];

export const chapters: Resource = {};
export const chaptersOrder: number[] = [];

// prettier-ignore
chapterList.forEach((chapter) => {
  chapters[chapter.index] = `Chapter ${chapter.number}${chapter.alt}: ${chapter.name}`;
  chaptersOrder.push(chapter.index);
});

export const trapTypes = [
  { index: 0x0, name: "Ceil" },
  { index: 0x1, name: "Wall" },
  { index: 0x2, name: "Floor" },
];

export const trapList = [
  { index: 0x22, type: 0x0, name: "Mega Rock" },
  { index: 0x23, type: 0x0, name: "Spike Rock" },
  { index: 0x24, type: 0x0, name: "Iron Ball" },
  { index: 0x25, type: 0x0, name: "Flare Rock" },
  { index: 0x26, type: 0x0, name: "Volt Rock" },
  { index: 0x28, type: 0x0, name: "Slow Gas" },
  { index: 0x27, type: 0x0, name: "Confuse Gas" },
  { index: 0x29, type: 0x0, name: "Evil Breath" },
  { index: 0x2a, type: 0x0, name: "Berserk Gas" },
  { index: 0x2b, type: 0x0, name: "Heat Breath" },
  { index: 0x2c, type: 0x0, name: "Vase" },
  { index: 0x2d, type: 0x0, name: "Oil Vase" },
  { index: 0x2e, type: 0x0, name: "Lava Vase" },
  { index: 0x2f, type: 0x0, name: "Basin" },
  { index: 0x30, type: 0x0, name: "Vat" },
  { index: 0x31, type: 0x0, name: "Suezo" },
  { index: 0x33, type: 0x0, name: "Ardebaran" },
  { index: 0x32, type: 0x0, name: "Evil Stomp" },
  { index: 0x00, type: 0x1, name: "Press Wall" },
  { index: 0x01, type: 0x1, name: "Attack Wall" },
  { index: 0x02, type: 0x1, name: "Spike Wall" },
  { index: 0x06, type: 0x1, name: "Arrow Slit" },
  { index: 0x09, type: 0x1, name: "Fire Arrow" },
  { index: 0x07, type: 0x1, name: "Triple Arrow" },
  { index: 0x0d, type: 0x1, name: "Rolling Bomb" },
  { index: 0x08, type: 0x1, name: "Chain Needle" },
  { index: 0x0a, type: 0x1, name: "Fire Ball" },
  { index: 0x35, type: 0x1, name: "Cold Arrow" },
  { index: 0x0b, type: 0x1, name: "Buzz Saw" },
  { index: 0x0c, type: 0x1, name: "Laser Arrow" },
  { index: 0x03, type: 0x1, name: "Magnet" },
  { index: 0x04, type: 0x1, name: "Power Magnet" },
  { index: 0x05, type: 0x1, name: "Volt Magnet" },
  { index: 0x34, type: 0x1, name: "Evil Kick" },
  { index: 0x14, type: 0x2, name: "Small Bomb" },
  { index: 0x17, type: 0x2, name: "Flash Bomb" },
  { index: 0x18, type: 0x2, name: "Land Mine" },
  { index: 0x15, type: 0x2, name: "Blast Bomb" },
  { index: 0x19, type: 0x2, name: "Quake Bomb" },
  { index: 0x1a, type: 0x2, name: "Catastrophe" },
  { index: 0x16, type: 0x2, name: "Hell Fire" },
  { index: 0x1b, type: 0x2, name: "Bear Trap" },
  { index: 0x1c, type: 0x2, name: "Heavy Claw" },
  { index: 0x1d, type: 0x2, name: "Cold Claw" },
  { index: 0x0e, type: 0x2, name: "Lift Floor" },
  { index: 0x0f, type: 0x2, name: "Rising Floor" },
  { index: 0x10, type: 0x2, name: "Spring Floor" },
  { index: 0x11, type: 0x2, name: "Smash Floor" },
  { index: 0x1e, type: 0x2, name: "Spark Rod" },
  { index: 0x1f, type: 0x2, name: "Thunder Volt" },
  { index: 0x20, type: 0x2, name: "Judgement" },
  { index: 0x12, type: 0x2, name: "Magnet Floor" },
  { index: 0x13, type: 0x2, name: "Vacuum Floor" },
  { index: 0x21, type: 0x2, name: "Magic Sac" },
  { index: 0x36, type: 0x2, name: "Evil Upper" },
];

export const ceilTraps: Resource = {};
export const floorTraps: Resource = {};
export const wallTraps: Resource = {};

export const ceilTrapsOrder: number[] = [0xff];
export const floorTrapsOrder: number[] = [0xff];
export const wallTrapsOrder: number[] = [0xff];

trapList.forEach((trap) => {
  switch (trap.type) {
    case 0x0:
      ceilTraps[trap.index] = trap.name;
      ceilTrapsOrder.push(trap.index);
      break;
    case 0x1:
      wallTraps[trap.index] = trap.name;
      wallTrapsOrder.push(trap.index);
      break;
    case 0x2:
      floorTraps[trap.index] = trap.name;
      floorTrapsOrder.push(trap.index);
      break;
  }
});
