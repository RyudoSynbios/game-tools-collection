<script lang="ts">
  import { isDebug } from "$lib/stores";

  export let label = "";
  export let type: "number" | "string" = "string";
  export let value: bigint | number | string;
  export let options: { key: string; value: string }[];
  export let size: "md" | "lg" = "md";
  export let debug = false;
  export let disabled = false;
  export let test = false;
  export let onChange: (event: Event) => void;
</script>

<div
  class="gtc-select"
  class:gtc-select-debug={debug}
  class:gtc-select-disabled={disabled}
  class:gtc-select-lg={size === "lg"}
>
  {#if label}
    <p>{label}</p>
  {/if}
  <select
    {value}
    {disabled}
    data-test={$isDebug && test ? true : null}
    on:change={onChange}
  >
    {#each options as option}
      <option value={type === "number" ? parseInt(option.key) : option.key}>
        {option.value}
      </option>
    {/each}
  </select>
</div>

<style lang="postcss">
  .gtc-select {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    &.gtc-select-debug {
      @apply text-orange-800 bg-orange-950;
    }

    &.gtc-select-disabled select {
      @apply bg-gray-100 bg-opacity-30;
    }

    &.gtc-select-lg select {
      width: 260px;
    }

    & p {
      @apply mb-2 text-sm font-bold;
    }
  }
</style>
