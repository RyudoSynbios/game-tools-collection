<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Modal from "$lib/components/Modal.svelte";
  import { isFileVisualizerOpen } from "$lib/stores";
  import { highlightsTemplate } from "$lib/stores/fileVisualizer";
  import { parseGameJson } from "$lib/utils/fileVisualizer";

  import DataView from "./DataView/DataView.svelte";
  import Inspector from "./Inspector/Inspector.svelte";

  function handleClose(): void {
    $isFileVisualizerOpen = false;
  }

  onMount(() => {
    parseGameJson();
  });

  onDestroy(() => {
    $highlightsTemplate = {};
  });
</script>

<Modal onClose={handleClose}>
  <div class="gtc-filevisualizer">
    <Inspector />
    <DataView />
  </div>
</Modal>

<style lang="postcss">
  .gtc-filevisualizer {
    @apply flex;
  }
</style>
