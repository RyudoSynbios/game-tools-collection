<script lang="ts">
  import InsertDriveFileIcon from "$lib/assets/InsertDriveFile.svelte";

  export let indented = false;
  export let onClick: () => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-file{indented ? ' ml-4' : ''}" on:click={onClick}>
  <InsertDriveFileIcon /><slot />
</div>

<style lang="postcss">
  .gtc-file {
    @apply flex cursor-pointer items-end text-sm text-white;

    & :global(svg) {
      @apply mr-1;
    }
  }
</style>
