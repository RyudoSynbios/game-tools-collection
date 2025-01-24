<script lang="ts">
  import { getFileData, readTxt } from "../utils";

  export let assetIndex: number;

  let text = "";

  $: {
    const dataView = getFileData("txt", assetIndex);

    text = readTxt(dataView);
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
