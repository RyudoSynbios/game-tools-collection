<script lang="ts">
  import FolderIcon from "$lib/assets/Folder.svelte";

  import File from "./File.svelte";

  interface Entry {
    type: "directory" | "file";
    name: string;
    content?: Entry[];
  }

  export let content: Entry[] = [];
  export let expanded = false;
  export let indented = false;
  export let onFileClick: (entry: Entry) => void;

  function handleDirectoryClick(): void {
    expanded = !expanded;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="gtc-directory" class:ml-4={indented}>
  <div class="gtc-directory-name" on:click={handleDirectoryClick}>
    <FolderIcon /><slot />
  </div>
  <div class="gtc-directory-content" class:gtc-expanded={expanded}>
    {#each content as entry}
      {#if entry.type === "directory"}
        <svelte:self content={entry.content} indented {onFileClick}>
          {entry.name}
        </svelte:self>
      {:else if entry.type === "file"}
        <File indented onClick={() => onFileClick(entry)}>
          {entry.name}
        </File>
      {/if}
    {/each}
  </div>
</div>

<style lang="postcss">
  .gtc-directory {
    & .gtc-directory-name {
      @apply flex cursor-pointer items-end text-sm;

      & :global(svg) {
        @apply mr-1;
      }
    }

    & .gtc-directory-content {
      @apply hidden;

      &.gtc-expanded {
        @apply block;
      }
    }
  }
</style>
