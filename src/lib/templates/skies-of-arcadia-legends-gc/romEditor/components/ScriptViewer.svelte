<script lang="ts">
  import { dataViewAlt, isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";

  import type { DataViewABL } from "$lib/types";

  import { getFileData } from "../utils";
  import Script, { type ScriptEvent } from "../utils/script";

  export let assetIndex: number;
  export let entityId = -1;
  export let debug = false;

  let rootEl: HTMLDivElement;

  let dataView: DataViewABL = new DataView(new ArrayBuffer(0));
  let script: Script;

  let tabIndex = 0;
  let events: ScriptEvent[] = [];
  let eventIndex = -1;
  let related: number[] = [];

  function getColor(event: ScriptEvent): string {
    if (event.status === "hasError") {
      return "orange";
    } else if (event.status === "hasUnknownInstruction") {
      return "mediumorchid";
    } else if (event.status === "hasUnparsedInstruction") {
      return "red";
    }

    return "limegreen";
  }

  function handleActionToggle(eventIndex: number, actionIndex: number): void {
    events = script.expandAction(eventIndex, actionIndex);
  }

  function handleScriptClick(index: number): void {
    eventIndex = index;
    tabIndex = 2;
  }

  function handleScriptToggle(index: number): void {
    events = script.expandEvent(index);
  }

  $: {
    if (debug || script === undefined) {
      dataView = getFileData("map", assetIndex);

      $dataViewAlt.sct = dataView;

      script = new Script(dataView);

      events = script.getEvents();

      const entityEvents = script.getEntityEvents(entityId);

      if (entityEvents) {
        eventIndex = entityEvents.main;
        related = entityEvents.related;
        tabIndex = 1;
      }

      if (eventIndex !== -1) {
        tabIndex = 2;
      }
    }

    if (rootEl) {
      rootEl.scrollTo({ top: 0 });
    }
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- prettier-ignore -->
<div
  class="gtc-scriptviewer"
  class:gtc-scriptviewer-debug={debug && $isDebug}
  bind:this={rootEl}
>
  {#if debug && $isDebug}
    <div>
      {#each events as event, eventIndex}
        <p
          style="color: {getColor(event)};"
          on:click={() => handleScriptToggle(eventIndex)}
        >
          {event.offset.toHex(8)}: {event.name} ({event.status})
        </p>
        {#if event.expanded}
          <div class="gtc-scriptviewer-actions">
            {#each event.actions as action, actionIndex}
              <p
                style={`color: ${action.color}`}
                on:click={() => handleActionToggle(eventIndex, actionIndex)}
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
  {:else}
    <div>
      <ul class="gtc-scriptviewer-tabs">
        <li
          class:gtc-scriptviewer-tab-highlight={tabIndex === 0}
          on:click={() => (tabIndex = 0)}
        >
          All
        </li>
        {#if related.length > 0}
          <li
            class:gtc-scriptviewer-tab-highlight={tabIndex === 1}
            on:click={() => (tabIndex = 1)}
          >
            Related to {entityId}
          </li>
        {/if}
        {#if eventIndex !== -1}
          <li
            class:gtc-scriptviewer-tab-highlight={tabIndex === 2}
            on:click={() => (tabIndex = 2)}
          >
            View
          </li>
        {/if}
      </ul>
      {#if tabIndex === 0}
        {#each events as event, eventIndex}
          {#if !["hidden", "text"].includes(event.status)}
            <p
              style="color: {getColor(event)};"
              on:click={() => handleScriptClick(eventIndex)}
            >
              {event.name}
            </p>
          {/if}
        {/each}
      {:else if tabIndex === 1}
        {#each related as index}
          <p
            style="color: {getColor(events[index])};"
            on:click={() => handleScriptClick(index)}
          >
            {events[index].name}
          </p>
        {/each}
      {:else if tabIndex === 2}
        <p
          class="gtc-scriptviewer-eventname"
          style="color: {getColor(events[eventIndex])};"
        >
          [{events[eventIndex].name}]
        </p>
        {#each events[eventIndex].actions as action}
          {#if ![""].includes(action.type)}
            <p
              style={`margin-left: ${action.indent * 12}px; color: ${action.color};`}
            >
              {action.type === "dummy" ||
              (action.type === "jump" &&
                action.subtype &&
                ["else", "endcase", "endif", "while"].includes(action.subtype))
                ? ":"
                : "⬪"}
              {@html script.printInstruction(action)}
            </p>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  .gtc-scriptviewer {
    @apply flex h-full w-screen overflow-auto text-xs lg:w-[50vw];

    &.gtc-scriptviewer-debug {
      @apply w-full rounded bg-primary-700 p-2 text-xs;
    }

    & > div {
      @apply flex-1 basis-2/4;

      &:nth-child(2) {
        @apply mt-4 basis-2/4 overflow-auto;
      }

      & :global(p),
      & :global(span) {
        @apply whitespace-pre-line font-source;
      }

      & .gtc-scriptviewer-tabs {
        @apply mb-2 flex;

        & li {
          @apply px-2;
        }

        & li.gtc-scriptviewer-tab-highlight {
          @apply rounded bg-primary-400;
        }
      }

      & .gtc-scriptviewer-actions {
        @apply ml-4;
      }

      & .gtc-scriptviewer-eventname {
        @apply mb-2;
      }
    }
  }
</style>
