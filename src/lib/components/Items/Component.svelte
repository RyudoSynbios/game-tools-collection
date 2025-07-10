<script lang="ts">
  import { SvelteComponent } from "svelte";

  import { gameUtils } from "$lib/stores";
  import debug from "$lib/utils/debug";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemComponent } from "$lib/types";

  export let item: ItemComponent;

  let component: SvelteComponent;

  $: {
    if (utilsExists("getComponent")) {
      component = $gameUtils.getComponent(item.component);

      if (!component) {
        debug.warn(`Component '${item.component}' not found`);
      }
    }
  }
</script>

<svelte:component this={component} {...item.props} />
