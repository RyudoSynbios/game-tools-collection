<script lang="ts">
  import { SvelteComponent } from "svelte";

  import { gameUtils } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemComponent } from "$lib/types";
  import debug from "$lib/utils/debug";

  export let item: ItemComponent;

  let component: SvelteComponent;

  $: {
    if (utilsExists("getComponent")) {
      const tmp = $gameUtils.getComponent(item.component);

      if (tmp) {
        component = tmp;
      } else {
        debug.warn(`Component '${item.component}' not found`);
      }
    }
  }
</script>

<svelte:component this={component} {...item.props} />

<style lang="postcss">
</style>
