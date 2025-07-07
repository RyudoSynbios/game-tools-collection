<script lang="ts">
  import type { Component } from "svelte";

  import { gameUtils } from "$lib/stores";
  import debug from "$lib/utils/debug";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemComponent } from "$lib/types";

  interface Props {
    item: ItemComponent;
  }

  let { item }: Props = $props();

  const SvelteComponent: Component = $derived.by(() => {
    if (utilsExists("getComponent")) {
      const component = $gameUtils.getComponent(item.component);

      if (!component) {
        debug.warn(`Component '${item.component}' not found`);
      }

      return component;
    }
  });
</script>

{#if SvelteComponent}
  <SvelteComponent {...item.props} />
{/if}
