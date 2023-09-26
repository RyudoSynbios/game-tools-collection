<script lang="ts">
  import { gameUtils } from "$lib/stores";
  import { utilsExists } from "$lib/utils/format";

  import type { ItemComponent } from "$lib/types";

  export let item: ItemComponent;

  let component: any;

  $: {
    if (utilsExists("getComponent")) {
      component = $gameUtils.getComponent(item.component);
    }
  }
</script>

<svelte:component this={component} {...item.props} />

<style lang="postcss">
</style>
