<script lang="ts">
  import { beforeUpdate } from "svelte";

  import Content from "$lib/components/Items/Content.svelte";
  import { gameJson, isDebug } from "$lib/stores";
  import { getBigInt, getInt } from "$lib/utils/bytes";
  import { generateIdFromArray, getUtils } from "$lib/utils/format";
  import { scrollIntoViewIfNecessary } from "$lib/utils/ui";
  import { checkConditions } from "$lib/utils/validator";

  import type { ItemIntCondition, ItemList, ItemListElement } from "$lib/types";

  export let item: ItemList;

  type ItemListElementWithIndex = ItemListElement & { index: number };

  let rootEl: HTMLDivElement;
  let ulEl: HTMLUListElement;
  let innerHeight = 0;
  let isFocused = false;
  let selectedElement = 0;
  let elements: ItemListElementWithIndex[];
  let previousId = "";
  let previousSelectedElement = 0;

  beforeUpdate(() => {
    if (previousSelectedElement === selectedElement) {
      const componentId = item.id || generateIdFromArray(elements, "name");

      if (componentId !== previousId) {
        selectedElement = 0;

        checkElement();
      }

      previousId = componentId;
    }

    previousSelectedElement = selectedElement;
  });

  function checkElement(): void {
    if (selectedElement > elements.length - 1) {
      selectedElement = 0;
    }

    const firstElementAvailable = elements.findIndex(
      (element) => !element.disabled,
    );

    if (elements[selectedElement].disabled && firstElementAvailable !== -1) {
      selectedElement = firstElementAvailable;
    }
  }

  function handleElementClick(index: number): void {
    if (elements[index] && !elements[index].disabled) {
      selectedElement = index;
    }
  }

  function handleFocusOff(event: Event) {
    if (!ulEl.contains(event.target as Element)) {
      isFocused = false;
    }
  }

  function handleFocusOn() {
    isFocused = true;
  }

  function handleKeyDown(event: any): void {
    if (!isFocused) {
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();

      if (event.key === "ArrowUp") {
        handleElementClick(selectedElement - 1);
      } else if (event.key === "ArrowDown") {
        handleElementClick(selectedElement + 1);
      }

      const selectedElementEl = ulEl?.children[
        selectedElement
      ] as HTMLLIElement;

      if (ulEl && selectedElementEl) {
        scrollIntoViewIfNecessary(ulEl, selectedElementEl);
      }
    } else {
      handleFocusOff(event);
    }
  }

  $: {
    if (rootEl) {
      const rootY = rootEl.getBoundingClientRect().y;
      const rootHeight = innerHeight - rootY - 16;

      rootEl.style.height = `${rootHeight}px`;
    }

    let enumerationCount = 0;

    elements = item.items.reduce(
      (elements: ItemListElementWithIndex[], element, index) => {
        let newElement = { ...element, index };

        if (newElement.name === undefined) {
          newElement.name = "";

          if (item.enumeration) {
            newElement.name = item.enumeration.replace(
              "%d",
              `${enumerationCount + 1}`,
            );
          } else if (
            item.resource &&
            $gameJson.resources &&
            $gameJson.resources[item.resource]
          ) {
            newElement.name =
              ($gameJson.resources[item.resource][
                enumerationCount
              ] as string) || "???";
          }

          enumerationCount += 1;
        }

        if (newElement.disableElementIf) {
          if (typeof newElement.disableElementIf === "string") {
            newElement.disabled = getUtils(newElement.disableElementIf, index);
          } else {
            newElement.disabled = checkConditions(
              newElement.disableElementIf,
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

        if (newElement.hidden && !$isDebug) {
          newElement.disabled = true;
        }

        elements.push(newElement);

        return elements;
      },
      [],
    );

    if (item.enumerationOrder) {
      elements.sort((a, b) => {
        const indexA = item.enumerationOrder?.indexOf(a.index) || -2;
        const indexB = item.enumerationOrder?.indexOf(b.index) || -2;

        return indexA - indexB;
      });
    }

    checkElement();
  }
</script>

<svelte:window
  bind:innerHeight
  on:click={handleFocusOff}
  on:keydown={handleKeyDown}
/>

<div class="gtc-list" bind:this={rootEl}>
  <ul bind:this={ulEl} on:click={handleFocusOn}>
    {#each elements as element, index}
      {#if !element.hidden || $isDebug}
        <li
          class="gtc-element"
          class:gtc-element-debug={element.hidden}
          class:gtc-element-disabled={element.disabled}
          class:gtc-element-highlight={index === selectedElement}
          on:click={() => handleElementClick(index)}
        >
          {element.name}
        </li>
      {/if}
    {/each}
  </ul>
  <div class="gtc-list-content">
    {#if !elements[selectedElement].disabled}
      <Content
        items={elements[selectedElement].items}
        flex={elements[selectedElement].flex}
      />
    {:else}
      <p>This save slot is not active</p>
    {/if}
  </div>
</div>

<style lang="postcss">
  .gtc-list {
    @apply flex-1 flex;

    & ul {
      @apply mr-4 no-scrollbar bg-primary-700 rounded overflow-scroll;

      min-width: 200px;

      & li {
        @apply px-4 py-2 text-sm cursor-pointer;

        &:hover:not(.gtc-element-debug):not(.gtc-element-disabled):not(
            .gtc-element-highlight
          ) {
          @apply bg-primary-400 rounded;
        }

        &.gtc-element-debug {
          @apply text-orange-800 bg-orange-950;
        }

        &.gtc-element-disabled {
          @apply cursor-not-allowed bg-primary-400;
        }

        &.gtc-element-highlight {
          @apply text-white bg-primary-300 rounded;

          &.gtc-element-debug {
            @apply text-orange-100 bg-orange-900;
          }
        }
      }
    }

    & .gtc-list-content {
      @apply flex-1 overflow-scroll;
    }
  }
</style>
