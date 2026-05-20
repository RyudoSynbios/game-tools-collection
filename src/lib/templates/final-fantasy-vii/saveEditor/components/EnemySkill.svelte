<script lang="ts">
  import ExpandMoreIcon from "$lib/assets/ExpandMore.svelte";
  import Checkbox from "$lib/components/Checkbox.svelte";
  import { dataView } from "$lib/stores";
  import { extractBit, getInt, setInt } from "$lib/utils/bytes";

  import { enemySkills } from "../utils/resource";

  export let offset: number;

  let containerEl: HTMLDivElement;

  let materiaIndex = -1;
  let flags = 0x0;
  let count = 0;

  let isDropdownOpen = false;

  function handleDropdownClose(event?: Event): void {
    if (!event || !containerEl?.contains(event.target as Element)) {
      isDropdownOpen = false;
    }
  }

  function handleEnemySkillToggle(index: number): void {
    setInt(offset + 0x1, "uint24", flags ^ (0x1 << index));
  }

  function handleSelectClick(): void {
    isDropdownOpen = true;
  }

  $: {
    ($dataView, offset);

    materiaIndex = getInt(offset, "int8");
    count = 0;

    if (materiaIndex === 0x2c) {
      flags = getInt(offset + 0x1, "uint24");
      count = flags.toBitCount();
    }
  }
</script>

<svelte:window on:click={handleDropdownClose} />

{#if materiaIndex === 0x2c}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="gtc-enemyskill">
    <div class="gtc-enemyskill-label">
      <p>Enemy Skill</p>
    </div>
    <div bind:this={containerEl}>
      <div class="gtc-enemyskill-select" on:click={handleSelectClick}>
        <p>{count} / 24</p>
        <ExpandMoreIcon />
      </div>
      {#if isDropdownOpen}
        <ul class="gtc-enemyskill-dropdown">
          {#each enemySkills as enemySkill}
            <li>
              <Checkbox
                label={enemySkill.name}
                checked={extractBit(flags, enemySkill.index)}
                onChange={() => handleEnemySkillToggle(enemySkill.index)}
              />
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  .gtc-enemyskill {
    @apply relative mb-4 mr-4 w-fit rounded bg-primary-700 p-2;

    & .gtc-enemyskill-label {
      @apply mb-2 flex items-center justify-between;

      & p {
        @apply text-sm font-bold;
      }
    }

    & .gtc-enemyskill-select {
      @apply flex h-8 cursor-text items-center bg-white text-primary-900;

      & p {
        @apply px-2 py-1 text-sm;

        width: 164px;
      }

      & :global(svg) {
        @apply h-8 w-4 bg-white;
      }
    }

    & .gtc-enemyskill-dropdown {
      @apply absolute z-10 overflow-auto bg-white text-sm text-primary-900;

      width: calc(100% - 1rem);
      max-height: 40vh;

      & li {
        @apply px-2;
      }
    }
  }
</style>
