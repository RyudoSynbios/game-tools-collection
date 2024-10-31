<script lang="ts">
  import type { Game } from "$lib/types";

  export let game: Game;
</script>

<div class="gtc-tile">
  <div class="gtc-tile-image">
    <img
      src="/img/games/{game.id}/background.png"
      alt="{game.name} ({game.console.name})"
    />
    <img
      class="gtc-tile-logo"
      src="/img/games/{game.id}/logo.png"
      alt="{game.name} ({game.console.name})"
    />
  </div>
  <div class="gtc-tile-content">
    <p>{game.name}</p>
    <p>{game.console.name}</p>
    <div class="gtc-tile-tools">
      {#if game.tools.saveEditor}
        <a href="/{game.id}/save-editor" class="gtc-tile-toollink">
          Save Editor
          <div>
            {#each game.tools.saveEditor.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-tooldisabled">Save Editor</span>
      {/if}
      {#if game.tools.romEditor}
        <a href="/{game.id}/rom-editor" class="gtc-tile-toollink">
          Rom Editor
          <div>
            {#each game.tools.romEditor.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-tooldisabled">Rom Editor</span>
      {/if}
      {#if game.tools.randomizer}
        <a href="/{game.id}/randomizer" class="gtc-tile-toollink">
          Randomizer
          <div>
            {#each game.tools.randomizer.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-tooldisabled">Randomizer</span>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-tile {
    @apply mr-4 mb-4 shadow-xl;

    width: 308px;

    & .gtc-tile-image {
      @apply relative;

      width: 308px;
      height: 200px;

      & img {
        @apply absolute;
      }

      & .gtc-tile-logo {
        @apply scale-100 transition-transform duration-300;
      }
    }

    & img:first-of-type {
      @apply rounded-t-xl;
    }

    & .gtc-tile-content {
      @apply pt-2 bg-primary-900 rounded-b;

      & p:first-of-type {
        @apply text-white text-ellipsis overflow-hidden whitespace-nowrap;
      }

      & p {
        @apply px-4;
      }

      & p:last-of-type {
        @apply text-sm;
      }

      & .gtc-tile-tools {
        @apply flex mt-2 border-t border-primary-600;

        & .gtc-tile-toollink,
        & .gtc-tile-tooldisabled {
          @apply flex-1 px-2 py-1  text-xs text-center rounded;
        }

        & .gtc-tile-toollink {
          @apply text-white;

          & div {
            @apply flex items-center justify-center flex-wrap h-8;
          }

          &:hover {
            @apply bg-primary-600;
          }

          & span {
            @apply mr-1;
          }
        }
      }
    }

    &:hover {
      .gtc-tile-image {
        .gtc-tile-logo {
          @apply scale-105 transition-transform duration-300;
        }
      }
    }
  }
</style>
