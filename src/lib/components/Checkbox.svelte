<script lang="ts">
  export let label = "";
  export let checked: boolean;
  export let disabled = false;
  export let onChange: (event: Event) => void;
</script>

<label class="gtc-checkbox">
  <input type="checkbox" {checked} {disabled} on:change={onChange} />
  {#if label}
    <span>{label}</span>
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
