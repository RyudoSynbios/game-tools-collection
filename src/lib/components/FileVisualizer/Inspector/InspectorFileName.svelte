<script lang="ts">
  import { fileName } from "$lib/stores";

  import Toolbar from "./Toolbar.svelte";
</script>

<Toolbar class="gtc-filevisualizer-inspectorfilename">
  <p>{$fileName}</p>
</Toolbar>

<style lang="postcss">
  :global(.gtc-filevisualizer-inspectorfilename p) {
    @apply overflow-hidden overflow-ellipsis text-xs font-normal;
  }
</style>
