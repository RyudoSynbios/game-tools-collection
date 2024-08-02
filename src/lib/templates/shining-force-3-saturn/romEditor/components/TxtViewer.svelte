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
    @apply p-2 whitespace-pre-line bg-primary-700 rounded;
  }
</style>
