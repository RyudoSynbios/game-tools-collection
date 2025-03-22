<script lang="ts">
  import { onMount } from "svelte";

  import { dataViewAlt, isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";

  import { getFileData } from "../utils";
  import Script, { type Subroutine } from "../utils/script";

  export let assetIndex: number;
  export let entityId: number;

  let dataView = new DataView(new ArrayBuffer(0));
  let script: Script;

  let tabIndex = 0;
  let subroutines: Subroutine[] = [];
  let subroutineIndex = -1;
  let related: number[] = [];

  function getColor(subroutine: Subroutine): string {
    if (subroutine.status === "hasError") {
      return "orange";
    } else if (subroutine.status === "hasUnknownInstruction") {
      return "mediumorchid";
    } else if (subroutine.status === "hasUnparsedInstruction") {
      return "red";
    }

    return "limegreen";
  }

  function handleActionToggle(
    subroutineIndex: number,
    actionIndex: number,
  ): void {
    subroutines = script.expandAction(subroutineIndex, actionIndex);
  }

  function handleScriptClick(index: number): void {
    subroutineIndex = index;
    tabIndex = 2;
  }

  function handleScriptToggle(index: number): void {
    subroutines = script.expandSubroutine(index);
  }

  onMount(() => {
    dataView = getFileData("map", assetIndex);

    $dataViewAlt.sct = dataView;

    script = new Script(dataView);

    subroutines = script.getSubroutines();

    const entitySubroutines = script.getEntitySubroutines(entityId);

    if (entitySubroutines) {
      subroutineIndex = entitySubroutines.main;
      related = entitySubroutines.related;
      tabIndex = 2;
    }
  });
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- prettier-ignore -->
<div class="gtc-scriptviewer">
  <div>
    <ul class="gtc-scriptviewer-tabs">
      <li on:click={() => (tabIndex = 0)}>All</li>
      {#if related.length > 0}
        <li on:click={() => (tabIndex = 1)}>Related to {entityId}</li>
      {/if}
      {#if subroutineIndex !== -1}
        <li on:click={() => (tabIndex = 2)}>Edit</li>
      {/if}
    </ul>
    {#if tabIndex === 0}
      {#each subroutines as subroutine, subroutineIndex}
        {#if !["label", "text"].includes(subroutine.status)}
          <p
            style="color: {getColor(subroutine)};"
            on:click={() => handleScriptClick(subroutineIndex)}
          >
            {subroutine.name}
          </p>
        {/if}
      {/each}
    {:else if tabIndex === 1}
      {#each related as index}
        <p
          style="color: {getColor(subroutines[index])};"
          on:click={() => handleScriptClick(index)}
        >
          {subroutines[index].name}
        </p>
      {/each}
    {:else if tabIndex === 2}
      <p style="color: {getColor(subroutines[subroutineIndex])};">
        [{subroutines[subroutineIndex].name}]
      </p>
      {#each subroutines[subroutineIndex].actions as action}
        {#if !["label"].includes(action.type)}
          <p style={`color: ${action.color}`}>
            {action.type}
          </p>
        {/if}
      {/each}
    {/if}
  </div>
  {#if $isDebug}
  <div>
    {#each subroutines as subroutine, subroutineIndex}
      <p
        style="color: {getColor(subroutine)};"
        on:click={() => handleScriptToggle(subroutineIndex)}
      >
        {subroutine.offset.toHex(8)}: {subroutine.name} ({subroutine.status})
      </p>
      {#if subroutine.expanded}
        <div class="gtc-scriptviewer-actions">
          {#each subroutine.actions as action, actionIndex}
            <p
              style={`color: ${action.color}`}
              on:click={() => handleActionToggle(subroutineIndex, actionIndex)}
            >
              {action.offset.toHex(8)}: {@html action.debug}
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
    {/if}
  </div>

<style lang="postcss">
  .gtc-scriptviewer {
    @apply flex h-full overflow-auto text-xs;

    width: 50vw;

    & > div {
      @apply flex-1 basis-2/4;

      &:nth-child(2) {
        @apply mt-4 basis-2/4 overflow-auto;
      }

      & p,
      & :global(span) {
        @apply font-source;
      }

      & :global(span:after) {
        @apply font-normal;
      }

      & .gtc-scriptviewer-tabs {
        @apply flex;

        & li {
          @apply px-1;
        }
      }

      & .gtc-scriptviewer-actions {
        @apply ml-4;
      }
    }
  }
</style>
