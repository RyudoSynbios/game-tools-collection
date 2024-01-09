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
    <div class="gtc-tile-editors">
      {#if game.saveEditor}
        <a href="/{game.id}/save-editor" class="gtc-tile-editorlink">
          Save Editor
          <div>
            {#each game.saveEditor.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-editordisabled"> Save Editor</span>
      {/if}
      {#if game.romEditor}
        <a href="/{game.id}/rom-editor" class="gtc-tile-editorlink">
          Rom Editor
          <div>
            {#each game.romEditor.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-editordisabled"> Rom Editor</span>
      {/if}
      {#if game.randomizer}
        <a href="/{game.id}/randomizer" class="gtc-tile-editorlink">
          Randomizer
          <div>
            {#each game.randomizer.regions as region}
              <span>{region}</span>
            {/each}
          </div>
        </a>
      {:else}
        <span class="gtc-tile-editordisabled"> Randomizer</span>
      {/if}
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-tile {
    @apply mr-4 mb-4 shadow-xl;

    width: 308px;

    @media (max-width: 987px) {
      &:nth-child(2n) {
        @apply mr-0;
      }
    }

    @media (min-width: 988px) and (max-width: 1311px) {
      &:nth-child(3n) {
        @apply mr-0;
      }
    }

    @media (min-width: 1312px) {
      &:nth-child(4n) {
        @apply mr-0;
      }
    }

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

      & .gtc-tile-editors {
        @apply flex mt-2 border-t border-primary-600;

        & .gtc-tile-editorlink,
        & .gtc-tile-editordisabled {
          @apply flex-1 px-2 py-1  text-xs text-center rounded;
        }

        & .gtc-tile-editorlink {
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
