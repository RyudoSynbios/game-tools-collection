<script lang="ts">
  import { onMount } from "svelte";

  import { isDirty } from "$lib/stores";
  import "$lib/utils/prototype";

  import "../app.css";

  function handleBeforeUnload(event: Event): string | void {
    if ($isDirty) {
      event.returnValue = true;
    }
  }

  onMount(() => {
    if (import.meta.env.MODE === "production") {
      console.log(
        "%c Hey fellow developer! If you enter `window.localStorage.setItem('debug', 'true')` on the console, you'll have access to hidden properties like checksum, file visualizer and other debugging features!",
        "font-family:monospace;color:#1976d2;font-size:12px;",
      );
    }
  });
</script>

<svelte:head>
  <meta
    name="description"
    content="Use a collection of tools to rediscover your favorite games by editing your saves or randomizing gameplay elements."
  />
</svelte:head>

<svelte:window on:beforeunload={handleBeforeUnload} />

<div class="gtc-app">
  <div class="gtc-header">
    <div class="gtc-header-inner">
      <a href="/">Game Tools Collection</a>
      <div>
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
</div>

<style lang="postcss">
  .gtc-app {
    @apply flex flex-col h-screen;

    & .gtc-header {
      @apply fixed top-0 inset-x-0 flex p-4 text-white bg-primary-900 z-10;

      & .gtc-header-inner {
        @apply relative mx-auto flex justify-between w-full max-w-7xl;

        & div a:not(:last-child) {
          @apply mr-4;
        }
      }
    }

    & .gtc-body {
      @apply flex-1 flex flex-col p-4;

      padding-top: 72px;

      & .gtc-body-inner {
        @apply flex-1 flex flex-col mx-auto w-full max-w-7xl;
      }
    }
  }
</style>
