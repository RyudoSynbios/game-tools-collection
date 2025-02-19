<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";

  import { dataView, isDebug } from "$lib/stores";

  export let label = "";
  export let type: HTMLInputTypeAttribute;
  export let placeholder = "";
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let maxlength: number | undefined = undefined;
  export let step = 1;
  export let leadingZeros = 0;
  export let value: bigint | number | string;
  export let size: "md" | "lg" = "md";
  export let hint = "";
  export let prefix = "";
  export let suffix = "";
  export let debug = false;
  export let disabled = false;
  export let checksum: boolean | null = null;
  export let test = false;
  export let onChange: ((event: Event) => void) | undefined = undefined;
  export let onEnter: (() => void) | undefined = undefined;

  // We export input element to allow prop binding
  export let inputEl: HTMLInputElement | undefined = undefined;

  function handleInput(event: Event): void {
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

  function handleKeyUp(event: KeyboardEvent): void {
    if (event.key === "Enter" && typeof onEnter === "function") {
      onEnter();
    }
  }

  $: {
    $dataView;

    if (inputEl) {
      inputEl.value = value.toString();
    }
  }
</script>

<div
  class="gtc-input"
  class:gtc-input-debug={debug}
  class:gtc-input-disabled={disabled}
  class:gtc-input-lg={size === "lg"}
  class:gtc-input-prefix={prefix}
  class:gtc-input-suffix={suffix}
>
  {#if label}
    <div class="gtc-input-label">
      <p>{label}</p>
      {#if hint}
        <span data-title={hint}>?</span>
      {/if}
    </div>
  {/if}
  <div class="gtc-input-content">
    {#if prefix}
      <span>{prefix}</span>
    {/if}
    <input
      {type}
      {placeholder}
      {min}
      {max}
      {maxlength}
      {step}
      disabled={disabled && !$isDebug}
      data-checksum={checksum}
      data-test={$isDebug && test ? true : null}
      bind:this={inputEl}
      on:change={onChange}
      on:input={handleInput}
      on:keypress={handleKeyUp}
    />
    {#if suffix}
      <span>{suffix}</span>
    {/if}
  </div>
</div>

<style lang="postcss">
  .gtc-input {
    @apply mb-4 mr-4 w-fit rounded bg-primary-700 p-2;

    &.gtc-input-debug {
      @apply bg-orange-950 text-orange-800;
    }

    &.gtc-input-disabled {
      & .gtc-input-content {
        & input,
        & span {
          @apply bg-gray-100 bg-opacity-30;
        }

        span {
          @apply text-primary-500;
        }
      }
    }

    &.gtc-input-lg input {
      width: 260px;
    }

    &.gtc-input-prefix input,
    &.gtc-input-suffix input {
      width: 160px;
    }

    &.gtc-input-prefix span {
      @apply pl-1.5;
    }

    &.gtc-input-suffix span {
      @apply pr-1.5;
    }

    & .gtc-input-label {
      @apply mb-2 flex items-center justify-between;

      & p {
        @apply text-sm font-bold;
      }

      & span {
        @apply w-5 cursor-pointer rounded bg-primary-400 text-center text-sm font-bold;
      }
    }

    & .gtc-input-content {
      @apply flex;

      & span {
        @apply w-5 bg-white py-1.5 text-sm;
      }
    }
  }
</style>
