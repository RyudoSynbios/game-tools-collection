<script lang="ts">
  import GameTile from "$lib/components/GameTile.svelte";
  import { type Order, type Tool, getConsoles, getGames } from "$lib/utils/db";

  let consoles = getConsoles();
  let games = getGames();

  let titleEl: HTMLInputElement;
  let consoleEl: HTMLSelectElement;
  let toolEl: HTMLSelectElement;
  let orderEl: HTMLSelectElement;

  let searchConsole = "";
  let searchTool = "";
  let order = "";

  function handleFilter(): void {
    games = getGames({
      title: titleEl.value,
      console: consoleEl.value,
      tool: toolEl.value as Tool,
      order: orderEl.value as Order,
    });

    searchConsole = consoleEl.value;
    searchTool = toolEl.value;
    order = orderEl.value;
  }
</script>

<svelte:head>
  <title>Game Tools Collection: Customize your games!</title>
</svelte:head>

<div class="gtc-home">
  <div class="gtc-home-filters">
    <input
      type="text"
      placeholder="Search a game..."
      bind:this={titleEl}
      on:change={handleFilter}
      on:keyup={handleFilter}
    />
    <select
      class:gtc-home-select-filled={searchConsole}
      bind:this={consoleEl}
      on:change={handleFilter}
    >
      <option value="">Console</option>
      {#each consoles as console}
        <option value={console.id}>{console.name}</option>
      {/each}
    </select>
    <select
      class:gtc-home-select-filled={searchTool}
      bind:this={toolEl}
      on:change={handleFilter}
    >
      <option value="">Tool</option>
      <option value="saveEditor">Save Editor</option>
      <option value="romEditor">Rom Editor</option>
      <option value="randomizer">Randomizer</option>
    </select>
    <select
      class:gtc-home-select-filled={order}
      bind:this={orderEl}
      on:change={handleFilter}
    >
      <option value="">Order</option>
      <option value="createdAt">New</option>
    </select>
  </div>
  <div class="gtc-home-games">
    {#if games.length > 0}
      {#each games as game}
        <GameTile {game} />
      {/each}
    {:else}
      <p>No games found</p>
    {/if}
  </div>
  <div class="gtc-home-description">
    <h1>Game Tools Collection</h1>
    <h2>Customize your games with a collection of tools!</h2>
    <p>This website offers various tools for many games.</p>
    <p>
      <strong>Save Editors</strong> allow you to edit your save files to customize
      your adventure by changing various stats or to unlock certain items/modes.
      They can also repair corrupted save files. Be aware that most editors were
      developped with saves generated with Retroarch cores. If you use other emulators,
      your file may not be recognized.
    </p>
    <p>
      <strong>Rom Editors</strong> are more complex as you can modify the game itself
      by manipulating enemy behavior, change item stats, customize maps, rewrite
      dialogs, etc.
    </p>
    <p>
      <strong>Randomizers</strong>, as their name suggests, can randomize
      elements of gameplay like items in chests, loot from enemies, etc. A new
      way to rediscover your favorite games!
    </p>
    <p>
      Not all tools already available are necessarily complete, they can be
      improved and more regions may be added in the near future.
    </p>
    <p>
      The list of games covered by the site will be updated often, so check back
      anytime!
    </p>
    <p class="font-bold">
      Be sure to always make a copy of your files in case something goes wrong
      with the tools, the website is not responsible for any damage to your
      files.
    </p>
    <p>
      If a tool doesn't work as it should, if a game you love is missing or if
      you any questions, you can contact me at <a
        href="mailto:contact@game-tools-collection.com"
      >
        contact@game-tools-collection.com
      </a>.
    </p>
  </div>
</div>

<style lang="postcss">
  .gtc-home {
    & .gtc-home-filters {
      @apply flex mb-4;

      & input,
      & select {
        @apply mr-2;
      }
    }

    .gtc-home-games {
      @apply flex flex-wrap;

      & > p {
        @apply my-12 text-white;
      }
    }

    & .gtc-home-description {
      @apply mt-4 p-4 text-white bg-primary-900 rounded;

      & a {
        @apply font-bold;
      }

      & p {
        @apply mb-4 text-sm;
      }

      & p:last-of-type {
        @apply m-0;
      }
    }

    & input,
    & select {
      @apply text-xs rounded bg-primary-600;
    }

    & input {
      @apply text-white;
    }

    & input::placeholder,
    & select {
      @apply text-primary-300;
    }

    & select.gtc-home-select-filled {
      @apply text-white;
    }
  }
</style>
