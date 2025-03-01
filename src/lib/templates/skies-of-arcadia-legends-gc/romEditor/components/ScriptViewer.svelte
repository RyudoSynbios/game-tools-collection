<script lang="ts">
  import { dataViewAlt } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";
  import debug from "$lib/utils/debug";

  import { getFileData } from "../utils";
  import Script, { type Subroutine } from "../utils/script";

  export let assetIndex: number;

  let previousAssetIndex = -1;

  let dataView = new DataView(new ArrayBuffer(0));
  let script: Script;
  let subroutines: Subroutine[] = [];

  function handleActionToggle(
    subroutineIndex: number,
    actionIndex: number,
  ): void {
    subroutines = script.expandAction(subroutineIndex, actionIndex);
  }

  function handleScriptToggle(index: number): void {
    subroutines = script.expandSubroutine(index);
  }

  $: {
    if (assetIndex !== previousAssetIndex) {
      debug.clear();

      dataView = getFileData("script", assetIndex);

      $dataViewAlt.debug = dataView;

      script = new Script(dataView);

      subroutines = script.getSubroutines();
    }

    previousAssetIndex = assetIndex;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- prettier-ignore -->
<div class="gtc-scriptviewer">
  {#each subroutines as subroutine, subroutineIndex}
    <p style="color: gold;" on:click={() => handleScriptToggle(subroutineIndex)}>
      {subroutine.offset.toHex(8)}: {subroutine.name}
    </p>
    {#if subroutine.expanded}
      <div class="gtc-scriptviewer-actions">
        {#each subroutine.actions as action, actionIndex}
          <p
            style={`color: ${action.color}`}
            on:click={() => handleActionToggle(subroutineIndex, actionIndex)}
          >
            {action.offset.toHex(8)}: {action.text}
          </p>
          {#if action.expanded && (action.color !== "red" || action.length > 1)}
            <div>
              {#each Array(action.length) as _, index (index)}
                {@const offset = action.offset + index * 0x4}
                <p style="color: white;">
                  {offset.toHex(8)}: {getInt(offset, "uint32", { bigEndian: true }, dataView).toHex(8)}
                </p>
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    {/if}
  {/each}
</div>

<style lang="postcss">
  .gtc-scriptviewer {
    @apply w-full whitespace-pre-line rounded bg-primary-700 p-2 text-xs;

    & p {
      @apply font-source;
    }

    & .gtc-scriptviewer-actions {
      @apply ml-4;
    }
  }
</style>
