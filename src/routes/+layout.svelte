<script lang="ts">
  import { onMount } from "svelte";

  import { isDebug, isDirty } from "$lib/stores";
  import "$lib/utils/prototype";

  import "../app.css";

  import DebugBar from "$lib/components/DebugBar.svelte";

  function handleBeforeUnload(event: Event): string | void {
    if ($isDirty) {
      event.returnValue = true;
    }
  }

  onMount(() => {
    if (import.meta.env.MODE === "production") {
      console.log(
        "%cHey fellow developer! If you enter `window.localStorage.setItem('debug', 'true')` on the console, you'll have access to hidden properties like checksum, file visualizer and other debugging features!",
        "font-family:monospace;color:#1976d2;font-size:12px;",
      );
    }
  });
</script>

<svelte:window on:beforeunload={handleBeforeUnload} />

<div class="gtc-app">
  <div class="gtc-header">
    <div class="gtc-header-inner">
      <a class="gtc-header-logo" href="/">Game Tools Collection</a>
      <div>
        <a href="https://discord.gg/3UJeXtsryS" target="_blank">
          <img src="/img/discord-mark-white.svg" alt="Discord Logo" />
        </a>
        <a
          href="https://github.com/RyudoSynbios/game-tools-collection"
          target="_blank"
        >
          <img src="/img/github-mark-white.svg" alt="GitHub Logo" />
        </a>
        <a href="/">Home</a>
        <a href="/faq">FAQ</a>
        <a href="/about">About</a>
      </div>
    </div>
  </div>
  <div class="gtc-body">
    <div class="gtc-body-inner">
      <slot />
    </div>
  </div>
  {#if $isDebug}
    <DebugBar />
  {/if}
</div>

<style lang="postcss">
  .gtc-app {
    @apply flex h-screen flex-col;

    & .gtc-header {
      @apply fixed inset-x-0 top-0 z-10 flex bg-primary-900 p-4 text-white;

      & .gtc-header-inner {
        @apply relative mx-auto flex w-full max-w-7xl justify-between;

        .gtc-header-logo {
          @apply font-bold;
        }

        & div {
          @apply flex;

          & a {
            @apply flex items-center;

            &:not(:last-child) {
              @apply mr-4;
            }

            & img {
              @apply mr-1 h-5;
            }
          }
        }
      }
    }

    & .gtc-body {
      @apply flex flex-1 flex-col p-4;

      padding-top: 72px;

      & .gtc-body-inner {
        @apply mx-auto flex w-full max-w-7xl flex-1 flex-col;
      }
    }
  }
</style>
