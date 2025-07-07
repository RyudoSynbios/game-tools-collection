<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Canvas from "$lib/utils/canvas";

  interface Props {
    spriteIndex: number;
    spriteWidth: number;
    spriteHeight: number;
    mainScale?: number;
    dropdownScale?: number;
    spritesPerRow?: number;
    sprites: (Uint8Array | null)[];
    onSpriteChange: (index: number) => void;
  }

  let {
    spriteIndex,
    spriteWidth,
    spriteHeight,
    mainScale = 1,
    dropdownScale = 1,
    spritesPerRow = 8,
    sprites,
    onSpriteChange,
  }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;
  let canvasDropdownEl = $state<HTMLDivElement>()!;

  let canvas = $state<Canvas>()!;
  let canvasDropdown: Canvas;

  let isDropdownOpen = $state(false);

  function handleDropdownClose(): void {
    isDropdownOpen = false;
  }

  function handleDropdownToggle(event: Event): void {
    event.stopPropagation();

    if (spriteIndex !== undefined) {
      isDropdownOpen = !isDropdownOpen;
    }
  }

  function handleSpriteChange(index: number): void {
    onSpriteChange(index);

    handleDropdownClose();
  }

  function updateCanvas(): void {
    canvas.reset();

    if (spriteIndex === undefined || !sprites[spriteIndex]) {
      canvas.render();

      return;
    }

    const sprite = sprites[spriteIndex] as Uint8Array;

    canvas.addGraphic("background", sprite, spriteWidth, spriteHeight);

    canvas.render();
  }

  onMount(() => {
    // Main

    canvas = new Canvas({
      canvasEl,
      width: spriteWidth,
      height: spriteHeight,
      scale: mainScale,
    });

    canvas.addLayer("background", "image");

    // Dropdown

    canvasDropdown = new Canvas({
      canvasEl: canvasDropdownEl,
      scale: dropdownScale,
    });

    canvasDropdown.addLayer("background", "sprites");

    canvasDropdown.resize(
      spritesPerRow * spriteWidth,
      (sprites.length / spritesPerRow) * spriteHeight,
    );

    let spriteCount = 0;

    sprites.forEach((sprite, index) => {
      if (sprite) {
        const x = (index % 8) * spriteWidth;
        const y = Math.floor(index / 8) * spriteHeight;

        canvasDropdown.addSprite(
          "background",
          spriteWidth,
          spriteHeight,
          x,
          y,
          {
            pointerdown: () => handleSpriteChange(index),
          },
        );

        canvasDropdown.addGraphic(
          `background.${spriteCount}`,
          sprite,
          spriteWidth,
          spriteHeight,
        );

        spriteCount += 1;
      }
    });

    canvasDropdown.render();
  });

  onDestroy(() => {
    canvas.destroy();
    canvasDropdown.destroy();
  });

  $effect(() => {
    if (canvas) {
      updateCanvas();
    }
  });
</script>

<svelte:window onclick={handleDropdownClose} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="gtc-spriteselector">
  <div
    class="gtc-spriteselector-main"
    class:gtc-spriteselector-nopointer={spriteIndex === undefined}
    bind:this={canvasEl}
    onclick={handleDropdownToggle}
  ></div>
  <div
    class="gtc-spriteselector-dropdown"
    class:gtc-spriteselector-dropdown-show={isDropdownOpen}
    bind:this={canvasDropdownEl}
    onclick={(event: Event) => event.stopPropagation()}
  ></div>
</div>

<style lang="postcss">
  @reference "../../app.css";

  .gtc-spriteselector {
    @apply bg-primary-700 relative z-20 mr-4 mb-4 self-start rounded p-2;

    & .gtc-spriteselector-main {
      @apply cursor-pointer;

      &.gtc-spriteselector-nopointer {
        @apply cursor-default;
      }
    }

    & .gtc-spriteselector-dropdown {
      @apply bg-primary-700 absolute top-0 left-full hidden overflow-auto rounded p-2 shadow-xl;

      max-height: 40vh;

      &.gtc-spriteselector-dropdown-show {
        @apply flex;
      }

      & :global(canvas) {
        @apply h-fit;
      }
    }
  }
</style>
