<script lang="ts">
  import Section from "$lib/components/Items/Section.svelte";
  import { getInt } from "$lib/utils/bytes";
  import { getItem, getResource } from "$lib/utils/parser";

  import type { Item, ItemSection, ItemString, Resource } from "$lib/types";

  import { abilities } from "../utils/resource";

  interface Props {
    slotIndex: number;
    characterIndex: number;
  }

  let { slotIndex, characterIndex }: Props = $props();

  const item: ItemSection = $derived.by(() => {
    const itemString = getItem(
      `slot-${slotIndex}-characterName-${characterIndex}`,
    ) as ItemString;

    const characterId = getInt(itemString.offset + 0x34, "lower4");

    const characterAbilities = abilities[characterId];

    const items: Item[] = [];

    if (characterAbilities) {
      const names = getResource("abilities") as Resource;
      const offset = itemString.offset + 0x58;

      items.push(
        {
          name: "Command Abilities",
          type: "section",
          flex: true,
          items: characterAbilities.command.map((ability, index) => ({
            name: ability.name,
            offset: offset + index,
            type: "variable",
            dataType: "uint8",
            max: ability.max,
          })),
        },
        {
          name: "Support Abilities",
          type: "section",
          flex: true,
          items: characterAbilities.support.map((ability, index) => ({
            name: names[ability.index] as string,
            offset: offset + characterAbilities.support.length + index,
            type: "variable",
            dataType: "uint8",
            max: ability.max,
          })),
        },
      );
    }

    return {
      type: "section",
      items,
    };
  });
</script>

<div class="gtc-abilities">
  <Section {item} />
</div>
