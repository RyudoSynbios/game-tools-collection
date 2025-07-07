<script lang="ts">
  import { dataView, debugOptions, isDebug } from "$lib/stores";

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
      $debugOptions.showInputValues &&
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
        {#if $isDebug && $debugOptions.showInputValues}
          {parseInt(option.key).toHex()}:
        {/if}
        {option.value}
      </option>
    {/each}
  </select>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-select {
    @apply bg-primary-700 mr-4 mb-4 w-fit rounded p-2;

    &.gtc-select-debug {
      @apply bg-orange-950 text-orange-800;
    }

    &.gtc-select-disabled select {
      @apply bg-gray-100/30;
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
        @apply bg-primary-400 w-5 cursor-pointer rounded text-center text-sm font-bold;
      }
    }
  }
</style>
