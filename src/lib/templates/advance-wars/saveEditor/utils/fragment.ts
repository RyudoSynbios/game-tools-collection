import type { ItemSection } from "$lib/types";

import type { Mission } from "./resource";

export function missionFragment(mission: Mission, offset: number): ItemSection {
  const andy = mission.cos[0] !== "-" ? parseInt(mission.cos[0]) : 0x0;
  const max = mission.cos[1] !== "-" ? parseInt(mission.cos[1]) : 0x0;
  const sami = mission.cos[2] !== "-" ? parseInt(mission.cos[2]) : 0x0;

  offset += mission.index * 0x4;

  return {
    name: mission.name,
    type: "section",
    flex: true,
    hidden: mission.hidden,
    items: [
      {
        name: "Andy",
        offset: offset + andy * 0x4,
        type: "variable",
        dataType: "uint8",
        resource: "missionRanks",
        disabled: mission.cos[0] === "-",
      },
      {
        name: "Max",
        offset: offset + 0x1 + max * 0x4,
        type: "variable",
        dataType: "uint8",
        resource: "missionRanks",
        disabled: mission.cos[1] === "-",
      },
      {
        name: "Sami",
        offset: offset + 0x2 + sami * 0x4,
        type: "variable",
        dataType: "uint8",
        resource: "missionRanks",
        disabled: mission.cos[2] === "-",
      },
    ],
  };
}
