<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import GVAS from "$lib/utils/gvas";

  export let fileName = "";
  export let dataView: DataView;

  const gvas = new GVAS(dataView);

  let json = {};

  onMount(() => {
    json = gvas.parseToJson();
  });

  onDestroy(() => {
    gvas.destroy();
  });
</script>

{#if gvas.header.saveType}
  <div class="gtc-gvas">
    <h2>{fileName}</h2>
    <code>{JSON.stringify(json)}</code>
  </div>
{/if}

<style lang="postcss">
  .gtc-gvas {
    @apply w-full overflow-auto rounded bg-primary-700 p-2;

    & code {
      @apply select-text text-xs;
    }
  }
</style>
