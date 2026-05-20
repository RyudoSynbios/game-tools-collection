import type { ItemSection } from "$lib/types";

export function materiaFragment(
  offset: number,
  index: number | string,
): ItemSection {
  return {
    type: "section",
    flex: true,
    noMargin: true,
    items: [
      {
        id: "materia",
        name: `Materia ${index}`,
        offset: offset,
        type: "variable",
        dataType: "uint8",
        resource: "materias",
        autocomplete: true,
      },
      {
        id: "materiaLevel",
        name: "Level",
        offset: offset + 0x1,
        type: "variable",
        dataType: "uint8",
        min: 1,
      },
      {
        id: "materiaAp",
        name: "AP",
        offset: offset + 0x1,
        type: "variable",
        dataType: "uint24",
      },
      {
        type: "component",
        component: "EnemySkill",
        props: { offset },
      },
    ],
  };
}
