<script lang="ts">
  import ExpandMoreIcon from "$lib/assets/ExpandMore.svelte";
  import { debugTools, isDebug } from "$lib/stores";
  import { scrollIntoViewIfNecessary } from "$lib/utils/ui";

  import type { ResourceGroups, ResourceLabels } from "$lib/types";

  export let label = "";
  export let value: bigint | number | string;
  export let options: { key: string; value: string }[];
  export let groups: ResourceGroups = [];
  export let labels: ResourceLabels = {};
  export let size: "md" | "lg" = "md";
  export let hint = "";
  export let debug = false;
  export let disabled = false;
  export let test = false;
  export let onChange: (event: Event) => void;

  interface GroupOptions {
    name: string;
    options: { key: string; value: string }[];
  }

  let rootEl: HTMLDivElement;
  let inputEl: HTMLInputElement;
  let inputHiddenEl: HTMLInputElement;
  let dropdownEl: HTMLUListElement;
  let isFocused = false;
  let isDropdownOpen = false;
  let filteredGroupOptions: GroupOptions[] = [];
  let valueDisplayed = "";
  let lastValueDisplayed = "";

  function handleChange(option: { key: string; value: string }): void {
    inputHiddenEl.value = option.key;

    inputHiddenEl.dispatchEvent(new Event("change"));

    valueDisplayed = option.value;
    lastValueDisplayed = valueDisplayed;

    isDropdownOpen = false;
  }

  function filterGroupOptions(search = ""): GroupOptions[] {
    let filteredOptions = options;

    if (search !== "") {
      const words = search.split(/\s+/g).filter((word) => word !== "");

      filteredOptions = options.filter((option) =>
        words.every((word) =>
          option.value.toLowerCase().match(word.toLowerCase()),
        ),
      );
    }

    const labelKeys = Object.keys(labels);

    const filteredGroupOptions = filteredOptions
      .reduce((filteredGroups: GroupOptions[], option) => {
        let groupIndex = 0;
        let groupName = "";

        if (groups.length > 0) {
          groupIndex = groups.findIndex((group) =>
            group.options.includes(parseInt(option.key)),
          );

          if (groupIndex !== -1) {
            groupName = groups[groupIndex].name;
          }

          groupIndex += 1;
        } else if (labelKeys.length > 0) {
          groupIndex = labelKeys.reduce((result, key, index) => {
            if (parseInt(key) <= parseInt(option.key)) {
              result = index + 1;
            }

            return result;
          }, 0);

          if (groupIndex > 0) {
            groupName = labels[parseInt(labelKeys[groupIndex - 1])];
          }
        }

        if (!filteredGroups[groupIndex]) {
          filteredGroups[groupIndex] = {
            name: groupName,
            options: [],
          };
        }

        filteredGroups[groupIndex].options.push(option);

        return filteredGroups;
      }, [])
      .filter((group) => group);

    return filteredGroupOptions;
  }

  function handleDropdownOpen(): void {
    if (!disabled && !isDropdownOpen) {
      filteredGroupOptions = filterGroupOptions();
      inputEl.select();

      isDropdownOpen = true;
    }
  }

  function handleDropdownClose(event?: Event): void {
    if (!event || !inputEl.parentNode?.contains(event.target as Element)) {
      isDropdownOpen = false;

      if (options.find((option) => option.key === inputHiddenEl.value)) {
        if (inputEl.value === "") {
          inputEl.value = options[0].value;
          inputHiddenEl.value = options[0].key;

          inputHiddenEl.dispatchEvent(new Event("change"));
        }

        const index = options.findIndex(
          (option) => option.value === inputEl.value,
        );

        if (index === -1) {
          inputEl.value = lastValueDisplayed;
        }
      }

      handleFocusOff();
    }
  }

  function handleFilter(event: Event): void {
    isDropdownOpen = true;

    removeAllHover();

    const search = (event.target as HTMLInputElement).value;

    filteredGroupOptions = filterGroupOptions(search);
  }

  function handleFocusOff(event?: Event): void {
    if (!event || !rootEl.contains(event.target as Element)) {
      isFocused = false;
    }
  }

  function handleFocusOn(): void {
    isFocused = true;
  }

  function handleHover(event: Event): void {
    removeAllHover();

    (event.target as HTMLLIElement).classList.add("gtc-autocomplete-hover");
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isFocused) {
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      handleDropdownClose();

      if (event.key === "Escape") {
        isFocused = true;
      }

      return;
    }

    if (!isDropdownOpen) {
      if (event.key === "ArrowDown") {
        event.preventDefault();

        handleDropdownOpen();
      }

      return;
    }

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "Enter"
    ) {
      event.preventDefault();

      let index = -1;

      let hoverElementEl: HTMLLIElement | null =
        dropdownEl.querySelector(".gtc-autocomplete-hover") ||
        dropdownEl.querySelector(".gtc-autocomplete-highlight");

      const dropdownLiNodes = dropdownEl.querySelectorAll(
        ".gtc-autocomplete-dropdown-group li",
      );

      if (!hoverElementEl) {
        hoverElementEl = dropdownEl.querySelector(
          "li:first-child",
        ) as HTMLLIElement;
      } else {
        index = [...dropdownLiNodes].indexOf(hoverElementEl);
      }

      removeAllHover();

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (event.key === "ArrowUp") {
          index -= 1;

          if (index < 0) {
            index = dropdownLiNodes.length - 1;
          }
        } else if (event.key === "ArrowDown") {
          index += 1;

          if (index > dropdownLiNodes.length - 1) {
            index = 0;
          }
        }

        let newHoverElementEl = dropdownLiNodes[index] as HTMLLIElement;

        newHoverElementEl?.classList.add("gtc-autocomplete-hover");

        scrollIntoViewIfNecessary(dropdownEl, newHoverElementEl);
      } else if (event.key === "Enter") {
        hoverElementEl.click();

        isFocused = true;
      }
    }
  }

  function removeAllHover(): void {
    dropdownEl
      ?.querySelectorAll(".gtc-autocomplete-hover")
      .forEach((el) => el.classList?.remove("gtc-autocomplete-hover"));
  }

  $: {
    const index = options.findIndex((option) => option.key === `${value}`);

    valueDisplayed = index !== -1 ? options[index].value : "";

    if ($isDebug && $debugTools.showInputValues) {
      valueDisplayed = `${parseInt(`${value}`).toHex()}: ${valueDisplayed || "???"}`;
    }

    lastValueDisplayed = valueDisplayed;

    if (dropdownEl) {
      const selectedElementEl = dropdownEl.querySelector(
        ".gtc-autocomplete-highlight",
      );

      if (selectedElementEl) {
        scrollIntoViewIfNecessary(
          dropdownEl,
          selectedElementEl as HTMLElement,
          "center",
        );
      }
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} on:click={handleDropdownClose} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="gtc-autocomplete"
  class:gtc-autocomplete-debug={debug}
  class:gtc-autocomplete-disabled={disabled}
  bind:this={rootEl}
>
  {#if label}
    <div class="gtc-autocomplete-label">
      <p>{label}</p>
      {#if hint}
        <span data-title={hint}>?</span>
      {/if}
    </div>
  {/if}
  <div
    class="gtc-autocomplete-input"
    class:gtc-autocomplete-input-lg={size === "lg"}
    on:click={handleDropdownOpen}
  >
    <input
      value={valueDisplayed}
      {disabled}
      bind:this={inputEl}
      on:input={handleFilter}
      on:focus={handleFocusOn}
    />
    <ExpandMoreIcon />
  </div>
  <input
    class="gtc-autocomplete-inputhidden"
    {value}
    data-test={$isDebug && test ? true : null}
    bind:this={inputHiddenEl}
    on:change={onChange}
  />
  {#if isDropdownOpen}
    <ul class="gtc-autocomplete-dropdown" bind:this={dropdownEl}>
      {#if filteredGroupOptions.length > 0}
        {#each filteredGroupOptions as group}
          <li class="gtc-autocomplete-dropdown-group">
            {#if group.name}
              <div class="gtc-autocomplete-dropdownlabel">{group.name}</div>
            {/if}
            <ul>
              {#each group.options as option}
                <li
                  class:gtc-autocomplete-highlight={option.key === `${value}`}
                  on:click={() => handleChange(option)}
                  on:mousemove={handleHover}
                >
                  {#if $isDebug && $debugTools.showInputValues}
                    {parseInt(option.key).toHex()}:
                  {/if}
                  {option.value}
                </li>
              {/each}
            </ul>
          </li>
        {/each}
      {:else}
        <li class="gtc-autocomplete-nohover" on:click|stopPropagation>
          No option
        </li>
      {/if}
    </ul>
  {/if}
</div>

<style lang="postcss">
  .gtc-autocomplete {
    @apply relative mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    &.gtc-autocomplete-debug {
      @apply text-orange-800 bg-orange-950;
    }

    & .gtc-autocomplete-label {
      @apply flex items-center justify-between mb-2;

      & p {
        @apply text-sm font-bold;
      }

      & span {
        @apply w-5 text-sm text-center font-bold bg-primary-400 rounded cursor-pointer;
      }
    }

    &.gtc-autocomplete-disabled .gtc-autocomplete-input {
      & input,
      & :global(svg) {
        @apply bg-gray-100 bg-opacity-30;
      }
    }

    & .gtc-autocomplete-input {
      @apply flex items-center text-primary-900;

      & input {
        @apply flex-1 pr-1;

        width: 164px;
      }

      & :global(svg) {
        @apply w-4 h-8 bg-white;
      }

      &.gtc-autocomplete-input-lg input {
        width: 244px;
      }
    }

    & .gtc-autocomplete-inputhidden {
      @apply hidden;
    }

    & .gtc-autocomplete-dropdown {
      @apply absolute text-primary-900 text-sm bg-white overflow-auto z-10;

      width: calc(100% - 1rem);
      max-height: 40vh;

      & .gtc-autocomplete-dropdown-group {
        & .gtc-autocomplete-dropdownlabel {
          @apply sticky top-0 px-2 py-2 font-bold bg-white;
        }

        & li {
          @apply px-2;

          &:global(.gtc-autocomplete-hover) {
            @apply bg-sky-400;
          }

          &.gtc-autocomplete-highlight {
            @apply bg-sky-600;
          }
        }
      }

      & .gtc-autocomplete-nohover {
        @apply px-2 text-primary-300;
      }

      &::-webkit-scrollbar-corner,
      &::-webkit-scrollbar-track {
        @apply bg-white;
      }
    }
  }
</style>
