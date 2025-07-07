<script lang="ts">
  import { getFileData, readTxt } from "../utils";

  interface Props {
    assetIndex: number;
  }

  let { assetIndex }: Props = $props();

  const text = $derived.by(() => {
    const dataView = getFileData("txt", assetIndex);

    return readTxt(dataView);
  });
</script>

<div class="gtc-txtviewer">
  {text}
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-txtviewer {
    @apply bg-primary-700 h-fit rounded p-2 whitespace-pre-line;
  }
</style>
