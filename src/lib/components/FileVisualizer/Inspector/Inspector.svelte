<script lang="ts">
  import { selectedView } from "$lib/stores/fileVisualizer";

  import InspectorDataView from "./InspectorDataView.svelte";
  import InspectorFileName from "./InspectorFileName.svelte";
  import InspectorSearch from "./InspectorSearch.svelte";

  function handleViewClick() {
    $selectedView = null;
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-filevisualizer-inspector" on:mousedown={handleViewClick}>
  <InspectorFileName />
  <InspectorDataView />
  <InspectorSearch />
</div>

<style lang="postcss">
  .gtc-filevisualizer-inspector {
    @apply mr-4 hidden w-72 lg:block;
  }
</style>
