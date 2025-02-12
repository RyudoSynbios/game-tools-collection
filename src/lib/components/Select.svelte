<script lang="ts">
  import { dataView, debugTools, isDebug } from "$lib/stores";

  export let label = "";
  export let type: "number" | "string" = "string";
  export let value: bigint | number | string;
  export let options: { key: string; value: string }[];
  export let size: "md" | "lg" = "md";
  export let hint = "";
  export let debug = false;
  export let disabled = false;
  export let test = false;
  export let onChange: (event: Event) => void;

  // We export select element to allow prop binding
  export let selectEl: HTMLSelectElement | undefined = undefined;

  $: {
    $dataView;

    if (selectEl) {
      selectEl.value = value.toString();
    }

    if (
      $isDebug &&
      $debugTools.showInputValues &&
      !options.find((option) => option.key === `${value}`)
    ) {
      options.push({ key: `${value}`, value: "???" });
    }
  }
</script>

<div
  class="gtc-select"
  class:gtc-select-debug={debug}
  class:gtc-select-disabled={disabled}
  class:gtc-select-lg={size === "lg"}
>
  {#if label}
    <div class="gtc-select-label">
      <p>{label}</p>
      {#if hint}
        <span data-title={hint}>?</span>
      {/if}
    </div>
  {/if}
  <select
    {value}
    disabled={disabled && !$isDebug}
    data-test={$isDebug && test ? true : null}
    bind:this={selectEl}
    on:change={onChange}
  >
    {#each options as option}
      <option value={type === "number" ? parseInt(option.key) : option.key}>
        {#if $isDebug && $debugTools.showInputValues}
          {parseInt(option.key).toHex()}:
        {/if}
        {option.value}
      </option>
    {/each}
  </select>
</div>

<style lang="postcss">
  .gtc-select {
    @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;

    &.gtc-select-debug {
      @apply bg-orange-950 text-orange-800;
    }

    &.gtc-select-disabled select {
      @apply bg-gray-100 bg-opacity-30;
    }

    &.gtc-select-lg select {
      width: 260px;
    }

    & .gtc-select-label {
      @apply mb-2 flex items-center justify-between;

      & p {
        @apply text-sm font-bold;
      }

      & span {
        @apply w-5 cursor-pointer rounded bg-primary-400 text-center text-sm font-bold;
      }
    }
  }
</style>
