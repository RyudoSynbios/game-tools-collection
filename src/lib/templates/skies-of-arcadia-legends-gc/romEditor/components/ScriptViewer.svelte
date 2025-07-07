<script lang="ts">
  import { untrack } from "svelte";

  import { dataViewAlt, isDebug } from "$lib/stores";
  import { getInt } from "$lib/utils/bytes";

  import type { DataViewABL } from "$lib/types";

  import { getFileData } from "../utils";
  import Script, { type ScriptEvent } from "../utils/script";

  interface Props {
    assetIndex: number;
    entityId: number;
    debug?: boolean;
  }

  let { assetIndex, entityId, debug = false }: Props = $props();

  let rootEl = $state<HTMLDivElement>();

  let dataView: DataViewABL = $state(new DataView(new ArrayBuffer(0)));
  let script = $state<Script>();

  let tabIndex = $state(0);
  let events: ScriptEvent[] = $state([]);
  let eventIndex = $state(-1);
  let related: number[] = $state([]);

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
    events = script!.expandAction(eventIndex, actionIndex);
  }

  function handleScriptClick(index: number): void {
    eventIndex = index;
    tabIndex = 2;
  }

  function handleScriptToggle(index: number): void {
    events = script!.expandEvent(index);
  }

  $effect(() => {
    if (debug || script === undefined) {
      dataView = getFileData("map", assetIndex);

      untrack(() => {
        $dataViewAlt.sct = dataView;

        script = new Script(dataView);

        events = script.getEvents();

        const entityEvents = script.getEntityEvents(entityId);

        if (entityEvents) {
          eventIndex = entityEvents.main;
          related = entityEvents.related;
          tabIndex = 1;
        }
      });

      if (eventIndex !== -1) {
        tabIndex = 2;
      }
    }

    if (rootEl) {
      rootEl.scrollTo({ top: 0 });
    }
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
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
          onclick={() => handleScriptToggle(eventIndex)}
        >
          {event.offset.toHex(8)}: {event.name} ({event.status})
        </p>
        {#if event.expanded}
          <div class="gtc-scriptviewer-actions">
            {#each event.actions as action, actionIndex}
              <p
                style={`color: ${action.color}`}
                onclick={() => handleActionToggle(eventIndex, actionIndex)}
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
          onclick={() => (tabIndex = 0)}
        >
          All
        </li>
        {#if related.length > 0}
          <li
            class:gtc-scriptviewer-tab-highlight={tabIndex === 1}
            onclick={() => (tabIndex = 1)}
          >
            Related to {entityId}
          </li>
        {/if}
        {#if eventIndex !== -1}
          <li
            class:gtc-scriptviewer-tab-highlight={tabIndex === 2}
            onclick={() => (tabIndex = 2)}
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
              onclick={() => handleScriptClick(eventIndex)}
            >
              {event.name}
            </p>
          {/if}
        {/each}
      {:else if tabIndex === 1}
        {#each related as index}
          <p
            style="color: {getColor(events[index])};"
            onclick={() => handleScriptClick(index)}
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
              {@html script!.printInstruction(action)}
            </p>
          {/if}
        {/each}
      {/if}
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-scriptviewer {
    @apply flex h-full w-screen overflow-auto text-xs lg:w-[50vw];

    &.gtc-scriptviewer-debug {
      @apply bg-primary-700 w-full rounded p-2 text-xs;
    }

    & > div {
      @apply flex-1 basis-2/4;

      &:nth-child(2) {
        @apply mt-4 basis-2/4 overflow-auto;
      }

      & :global(p),
      & :global(span) {
        @apply font-source whitespace-pre-line;
      }

      & .gtc-scriptviewer-tabs {
        @apply mb-2 flex;

        & li {
          @apply px-2;
        }

        & li.gtc-scriptviewer-tab-highlight {
          @apply bg-primary-400 rounded;
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
