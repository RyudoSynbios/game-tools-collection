<script lang="ts">
  import { isDebug } from "$lib/stores";

  export let label = "";
  export let value: bigint | number | string;
  export let options: { key: string; value: string }[];
  export let disabled = false;
  export let test = false;
  export let onChange: (event: Event) => void;
</script>

<div class="gtc-select">
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
      <option value={parseInt(option.key)}>
        {option.value}
      </option>
    {/each}
  </select>
</div>

<style lang="postcss">
  .gtc-select {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    & p {
      @apply mb-2 text-sm font-bold;
    }
  }
</style>
