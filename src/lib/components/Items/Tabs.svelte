<script lang="ts">
  import { beforeUpdate } from "svelte";

  import AccessTimeIcon from "$lib/assets/AccessTime.svelte";
  import Content from "$lib/components/Items/Content.svelte";
  import { debugTools, gameJson, gameUtils, isDebug } from "$lib/stores";
  import {
    generateIdFromArray,
    getUtils,
    utilsExists,
  } from "$lib/utils/format";
  import { getResource } from "$lib/utils/parser";
  import { scrollIntoViewIfNecessary } from "$lib/utils/ui";
  import { checkIntConditions } from "$lib/utils/validator";

  import type { ItemTab, ItemTabs } from "$lib/types";

  export let item: ItemTabs;

  type ItemTabtWithIndex = ItemTab & { index: number };

  let rootEl: HTMLDivElement;
  let ulEl: HTMLUListElement;
  let innerHeight = 0;
  let isFocused = false;
  let selectedTab = 0;
  let tabs: ItemTabtWithIndex[];
  let previousId = "";
  let previousSelectedTab = -1;

  beforeUpdate(() => {
    const componentId = item.id || generateIdFromArray(tabs, "name");

    if (componentId !== previousId) {
      selectedTab = 0;

      checkTab();
    }

    previousId = componentId;
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

  if (utilsExists("overrideItem")) {
    item = $gameUtils.overrideItem(item);
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

        const enumeratedName = (item.enumeration || "").format(
          enumerationCount + 1,
        );

        let resource = getResource(item.resource);

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
          newTab.disabled = checkIntConditions(newTab.disableTabIf);
        }
      }

      if ((newTab.hidden || newTab.planned) && !$isDebug) {
        newTab.disabled = true;
      }

      tabs.push(newTab);

      return tabs;
    }, []);

    if (
      item.resource &&
      item.resourceOrder &&
      $gameJson.resourcesOrder?.[item.resource]
    ) {
      const resourceOrder = $gameJson.resourcesOrder?.[item.resource];

      tabs.sort((a, b) => {
        const indexA = resourceOrder.indexOf(a.index) || -2;
        const indexB = resourceOrder.indexOf(b.index) || -2;

        return indexA - indexB;
      });
    }

    checkTab();
  }

  $: {
    if (item.onTabChange && selectedTab !== previousSelectedTab) {
      getUtils(item.onTabChange.format(selectedTab));
    }
  }
</script>

<svelte:window
  bind:innerHeight
  on:click={handleFocusOff}
  on:keydown={handleKeyDown}
/>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if !item.hidden || $isDebug}
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
            class:gtc-tab-debug={item.hidden || tab.hidden}
            class:gtc-tab-disabled={tab.disabled}
            class:gtc-tab-highlight={index === selectedTab}
            title={tab.planned ? "This feature is not yet available" : ""}
            on:click={() => handleTabClick(index)}
          >
            {#if item.indexes && $isDebug && $debugTools.showTabIndexes}
              <span class="gtc-tab-index">{tab.index.toHex()}</span>
            {/if}
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
        <Content
          items={tabs[selectedTab].items}
          flex={tabs[selectedTab].flex}
        />
      {:else}
        <p>Content is disabled</p>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  .gtc-tabs {
    @apply flex-1;

    min-height: 50vh;

    & > ul {
      @apply flex flex-wrap overflow-hidden rounded bg-primary-700;

      & > .gtc-tab {
        @apply flex h-9 cursor-pointer items-center px-4 py-2 text-sm;

        &:hover:not(.gtc-tab-debug):not(.gtc-tab-disabled):not(
            .gtc-tab-highlight
          ) {
          @apply rounded bg-primary-400;
        }

        &.gtc-tab-debug {
          @apply bg-orange-950 text-orange-800;
        }

        &.gtc-tab-disabled {
          @apply cursor-not-allowed bg-primary-400;
        }

        &.gtc-tab-highlight:not(.gtc-tab-disabled) {
          @apply rounded bg-primary-300 text-white;

          &.gtc-tab-debug {
            @apply bg-orange-900 text-orange-100;
          }
        }

        & .gtc-tab-index {
          @apply mr-1 text-xs text-gray-600;
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
      @apply md:flex;

      & > ul {
        @apply mb-4 mr-4 block overflow-scroll no-scrollbar md:mb-0;

        min-width: 200px;
      }

      & > .gtc-tabs-content {
        @apply flex-1 overflow-scroll pt-0;
      }
    }
  }
</style>
