<script lang="ts">
  import { dataView } from "$lib/stores";

  export let label = "";
  export let checked: boolean;
  export let disabled = false;
  export let onChange: (event: Event) => void;

  // We export input element to allow prop binding
  export let inputEl: HTMLInputElement | undefined = undefined;

  $: {
    $dataView;

    if (inputEl) {
      inputEl.checked = checked;
    }
  }
</script>

<label class="gtc-checkbox">
  <input type="checkbox" {disabled} bind:this={inputEl} on:change={onChange} />
  {#if label}
    <span>{@html label}</span>
  {/if}
</label>

<style lang="postcss">
  .gtc-checkbox {
    display: block;

    & span {
      @apply text-sm;
    }

    & input:disabled + span {
      @apply text-primary-400;
    }
  }
</style>
