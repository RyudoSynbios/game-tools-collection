<script lang="ts">
  import { getString } from "$lib/utils/bytes";

  import { getFileData } from "../utils";

  export let assetIndex: number;

  let text = "";

  $: {
    const dataView = getFileData("txt", assetIndex);

    // prettier-ignore
    text = getString(0x0, -1, "uint8", {
      encoding: "windows31J",
    }, dataView);
  }
</script>

<div class="gtc-txtviewer">
  {text}
</div>

<style lang="postcss">
  .gtc-txtviewer {
    @apply h-fit whitespace-pre-line rounded bg-primary-700 p-2;
  }
</style>
