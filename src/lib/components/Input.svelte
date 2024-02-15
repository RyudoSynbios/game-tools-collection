<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  import { dataView } from "$lib/stores";
  import { isDebug } from "$lib/stores";

  export let label = "";
  export let type: HTMLInputTypeAttribute;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let maxlength: number | undefined = undefined;
  export let step = 1;
  export let leadingZeros = 0;
  export let value: bigint | number | string;
  export let debug = false;
  export let disabled = false;
  export let checksum: boolean | null = null;
  export let test = false;
  export let onChange: (event: Event) => void;

  let inputEl: HTMLInputElement;

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const numberType = step % 1 === 0 ? "int" : "float";
    const isDecimalPressed =
      (event as InputEvent).data === "." || (event as InputEvent).data === ",";

    let value = target.value;

    if (type === "number") {
      let int = 0;

      if (numberType === "int") {
        int = parseInt(value);
      } else {
        int = parseFloat(value);
      }

      if (isNaN(int)) {
        int = 0;
      }

      if (min !== undefined) {
        int = Math.max(min || 0, int);
      }

      if (max !== undefined && int > max) {
        int = Math.min(int, max);
      }

      value = int.toString();
    }

    if (leadingZeros) {
      value = value.padStart(leadingZeros + 1, "0");
    }

    if (numberType !== "float" || !isDecimalPressed) {
      target.value = value;
    }
  }

  $: {
    $dataView;

    if (inputEl) {
      inputEl.value = value.toString();
    }
  }
</script>

<div class="gtc-input" class:gtc-input-debug={debug}>
  {#if label}
    <p>{label}</p>
  {/if}
  <input
    {type}
    {value}
    {min}
    {max}
    {maxlength}
    {step}
    {disabled}
    data-checksum={checksum}
    data-test={$isDebug && test ? true : null}
    bind:this={inputEl}
    on:change={onChange}
    on:input={handleInput}
  />
</div>

<style lang="postcss">
  .gtc-input {
    @apply mr-4 mb-4 p-2 w-fit bg-primary-700 rounded;

    &.gtc-input-debug {
      @apply text-orange-800 bg-orange-950;
    }

    & p {
      @apply mb-2 text-sm font-bold;
    }
  }
</style>
