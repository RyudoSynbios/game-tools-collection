<script lang="ts">
  import { beforeUpdate } from "svelte";

  import AccessTimeIcon from "$lib/assets/AccessTime.svelte";
  import Content from "$lib/components/Items/Content.svelte";
  import { isDebug } from "$lib/stores";
  import { getBigInt, getInt } from "$lib/utils/bytes";
  import { generateIdFromArray, getUtils } from "$lib/utils/format";
  import { getResource } from "$lib/utils/parser";
  import { scrollIntoViewIfNecessary } from "$lib/utils/ui";
  import { checkConditions } from "$lib/utils/validator";

  import type { ItemIntCondition, ItemTab, ItemTabs } from "$lib/types";

  export let item: ItemTabs;

  type ItemTabtWithIndex = ItemTab & { index: number };

  let rootEl: HTMLDivElement;
  let ulEl: HTMLUListElement;
  let innerHeight = 0;
  let isFocused = false;
  let selectedTab = 0;
  let tabs: ItemTabtWithIndex[];
  let previousId = "";
  let previousSelectedTab = 0;

  beforeUpdate(() => {
    if (previousSelectedTab === selectedTab) {
      const componentId = item.id || generateIdFromArray(tabs, "name");

      if (componentId !== previousId) {
        selectedTab = 0;

        checkTab();
      }

      previousId = componentId;
    }

    previousSelectedTab = selectedTab;
  });

  function checkTab(): void {
    if (selectedTab > tabs.length - 1) {
      selectedTab = 0;
    }

    const firstTabAvailable = tabs.findIndex((tab) => !tab.disabled);

    if (tabs[selectedTab].disabled && firstTabAvailable !== -1) {
      selectedTab = firstTabAvailable;
    }
  }

  function getNextEnabledTab(): number {
    for (let i = selectedTab + 1; i < tabs.length; i += 1) {
      if (!tabs[i].disabled) {
        return i;
      }
    }

    return selectedTab;
  }

  function getPreviousEnabledTab(): number {
    for (let i = selectedTab - 1; i >= 0; i -= 1) {
      if (!tabs[i].disabled) {
        return i;
      }
    }

    return selectedTab;
  }

  function handleTabClick(index: number): void {
    if (tabs[index] && !tabs[index].disabled) {
      selectedTab = index;
    }
  }

  function handleFocusOff(event: Event): void {
    if (!ulEl.contains(event.target as Element)) {
      isFocused = false;
    }
  }

  function handleFocusOn(): void {
    isFocused = true;
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isFocused) {
      return;
    }

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft"
    ) {
      event.preventDefault();

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        handleTabClick(getPreviousEnabledTab());
      } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        handleTabClick(getNextEnabledTab());
      }

      const selectedTabEl = ulEl?.children[selectedTab] as HTMLLIElement;

      if (ulEl && selectedTabEl) {
        scrollIntoViewIfNecessary(ulEl, selectedTabEl);
      }
    } else {
      handleFocusOff(event);
    }
  }

  $: {
    if (rootEl && item.vertical) {
      const rootY = rootEl.getBoundingClientRect().y;
      const rootHeight = innerHeight - rootY - 16;

      rootEl.style.height = `${rootHeight}px`;
    }

    let enumerationCount = 0;

    tabs = item.items.reduce((tabs: ItemTabtWithIndex[], tab, index) => {
      let newTab = { ...tab, index };

      if (newTab.name === undefined) {
        newTab.name = "";

        const enumeratedName =
          item.enumeration?.replace("%d", `${enumerationCount + 1}`) || "";

        let resource = getResource(item.resource, false);

        if (resource) {
          const name = resource[enumerationCount] as string;

          if (name) {
            newTab.name = name;
          } else if (item.enumeration) {
            newTab.name = enumeratedName;
          } else {
            newTab.name = "???";
          }
        } else if (item.enumeration) {
          newTab.name = enumeratedName;
        }

        enumerationCount += 1;
      }

      if (newTab.disableTabIf) {
        if (typeof newTab.disableTabIf === "string") {
          newTab.disabled = getUtils(newTab.disableTabIf, index);
        } else {
          newTab.disabled = checkConditions(
            newTab.disableTabIf,
            (condition: ItemIntCondition) => {
              let int;

              if (
                condition.dataType !== "int64" &&
                condition.dataType !== "uint64"
              ) {
                int = getInt(condition.offset, condition.dataType, {
                  bigEndian: condition.bigEndian,
                });
              } else {
                int = getBigInt(condition.offset, condition.dataType, {
                  bigEndian: condition.bigEndian,
                });
              }

              return int === condition.value;
            },
          );
        }
      }

      if ((newTab.hidden || newTab.planned) && !$isDebug) {
        newTab.disabled = true;
      }

      tabs.push(newTab);

      return tabs;
    }, []);

    if (item.enumerationOrder) {
      tabs.sort((a, b) => {
        const indexA = item.enumerationOrder?.indexOf(a.index) || -2;
        const indexB = item.enumerationOrder?.indexOf(b.index) || -2;

        return indexA - indexB;
      });
    }

    checkTab();
  }
</script>

<svelte:window
  bind:innerHeight
  on:click={handleFocusOff}
  on:keydown={handleKeyDown}
/>

<div
  class="gtc-tabs"
  class:gtc-tabs-vertical={item.vertical}
  bind:this={rootEl}
>
  <ul bind:this={ulEl} on:click={handleFocusOn}>
    {#each tabs as tab, index}
      {#if !tab.hidden || $isDebug}
        <li
          class="gtc-tab"
          class:gtc-tab-debug={tab.hidden}
          class:gtc-tab-disabled={tab.disabled}
          class:gtc-tab-highlight={index === selectedTab}
          title={tab.planned ? "This feature is not yet available" : ""}
          on:click={() => handleTabClick(index)}
        >
          {tab.name}
          {#if tab.planned}
            <AccessTimeIcon />
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
  <div class="gtc-tabs-content">
    {#if !tabs[selectedTab].disabled}
      <Content items={tabs[selectedTab].items} flex={tabs[selectedTab].flex} />
    {:else}
      <p>Content is disabled</p>
    {/if}
  </div>
</div>

<style lang="postcss">
  .gtc-tabs {
    @apply flex-1;

    & > ul {
      @apply flex flex-wrap bg-primary-700 rounded overflow-hidden;

      & > .gtc-tab {
        @apply flex items-center px-4 py-2 h-9 text-sm cursor-pointer;

        &:hover:not(.gtc-tab-debug):not(.gtc-tab-disabled):not(
            .gtc-tab-highlight
          ) {
          @apply bg-primary-400 rounded;
        }

        &.gtc-tab-debug {
          @apply text-orange-800 bg-orange-950;
        }

        &.gtc-tab-disabled {
          @apply cursor-not-allowed bg-primary-400;
        }

        &.gtc-tab-highlight:not(.gtc-tab-disabled) {
          @apply text-white bg-primary-300 rounded;

          &.gtc-tab-debug {
            @apply text-orange-100 bg-orange-900;
          }
        }

        & > :global(svg) {
          @apply ml-1 w-4;
        }
      }
    }

    & > .gtc-tabs-content {
      @apply pt-4;
    }

    &.gtc-tabs-vertical {
      @apply flex;

      & > ul {
        @apply block mr-4 no-scrollbar overflow-scroll;

        min-width: 200px;
      }

      & > .gtc-tabs-content {
        @apply flex-1 pt-0 overflow-scroll;
      }
    }
  }
</style>
