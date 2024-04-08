<script lang="ts">
  import ExpandMoreIcon from "$lib/assets/ExpandMore.svelte";
  import { isDebug } from "$lib/stores";
  import { scrollIntoViewIfNecessary } from "$lib/utils/ui";

  export let label = "";
  export let value: bigint | number | string;
  export let options: { key: string; value: string }[];
  export let size: "md" | "lg" = "md";
  export let debug = false;
  export let disabled = false;
  export let test = false;
  export let onChange: (event: Event) => void;

  let rootEl: HTMLDivElement;
  let inputEl: HTMLInputElement;
  let inputHiddenEl: HTMLInputElement;
  let dropdownEl: HTMLUListElement;
  let isFocused = false;
  let isDropdownOpen = false;
  let filteredOptions: { key: string; value: string }[] = [];
  let valueDisplayed = "";
  let lastValueDisplayed = "";

  function handleChange(option: { key: string; value: string }): void {
    inputHiddenEl.value = option.key;

    inputHiddenEl.dispatchEvent(new Event("change"));

    valueDisplayed = option.value;
    lastValueDisplayed = valueDisplayed;

    isDropdownOpen = false;
  }

  function handleDropdownOpen(): void {
    if (!isDropdownOpen) {
      filteredOptions = options;
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

    const words = search.split(/\s+/g).filter((word) => word !== "");

    if (search !== "") {
      filteredOptions = options.filter((option) =>
        words.every((word) =>
          option.value.toLowerCase().match(word.toLowerCase()),
        ),
      );
    } else {
      filteredOptions = options;
    }
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

  function handleKeyDown(event: any): void {
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

      if (!hoverElementEl) {
        hoverElementEl = dropdownEl.querySelector(
          "li:first-child",
        ) as HTMLLIElement;
      } else {
        index = [...dropdownEl.childNodes].indexOf(hoverElementEl);
      }

      removeAllHover();

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (event.key === "ArrowUp") {
          index -= 1;

          if (index < 0) {
            index = dropdownEl.childNodes.length - 2;
          }
        } else if (event.key === "ArrowDown") {
          index += 1;

          if (index > dropdownEl.childNodes.length - 2) {
            index = 0;
          }
        }

        let newHoverElementEl = dropdownEl.childNodes[index] as HTMLLIElement;

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

<div
  class="gtc-autocomplete"
  class:gtc-autocomplete-debug={debug}
  bind:this={rootEl}
>
  {#if label}
    <p>{label}</p>
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
      {#if filteredOptions.length > 0}
        {#each filteredOptions as option}
          <li
            class:gtc-autocomplete-highlight={option.key === `${value}`}
            on:click={() => handleChange(option)}
            on:mousemove={handleHover}
          >
            {option.value}
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

    & p {
      @apply mb-2 text-sm font-bold;
    }

    & .gtc-autocomplete-input {
      @apply flex items-center text-primary-900 bg-white;

      & input {
        @apply flex-1 pr-1;

        width: 164px;
      }

      & :global(svg) {
        @apply w-4;
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

      & li {
        @apply px-2;

        &:not(.gtc-autocomplete-nohover):global(.gtc-autocomplete-hover) {
          @apply bg-sky-400;
        }

        &.gtc-autocomplete-highlight {
          @apply bg-sky-600;
        }

        &.gtc-autocomplete-nohover {
          @apply text-primary-300;
        }
      }

      &::-webkit-scrollbar-corner,
      &::-webkit-scrollbar-track {
        @apply bg-white;
      }
    }
  }
</style>
