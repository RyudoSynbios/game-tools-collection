<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { Canvas } from "$lib/utils/canvas";

  export let spriteIndex: number;
  export let spriteWidth: number;
  export let spriteHeight: number;
  export let mainScale = 1;
  export let dropdownScale = 1;
  export let spritesPerRow = 8;
  export let sprites: (Uint8Array | null)[];
  export let onSpriteChange: (index: number) => void;

  let canvasEl: HTMLDivElement;
  let canvasDropdownEl: HTMLDivElement;

  let canvas: Canvas;
  let canvasDropdown: Canvas;

  let isDropdownOpen = false;

  function handleDropdownClose(): void {
    isDropdownOpen = false;
  }

  function handleDropdownToggle(): void {
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

  $: {
    spriteIndex;

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<svelte:window on:click={handleDropdownClose} />

<div class="gtc-spriteselector">
  <div
    class="gtc-spriteselector-main"
    class:gtc-spriteselector-nopointer={spriteIndex === undefined}
    bind:this={canvasEl}
    on:click|stopPropagation={handleDropdownToggle}
  />
  <div
    class="gtc-spriteselector-dropdown"
    class:gtc-spriteselector-dropdown-show={isDropdownOpen}
    bind:this={canvasDropdownEl}
    on:click|stopPropagation
  />
</div>

<style lang="postcss">
  .gtc-spriteselector {
    @apply relative self-start mr-4 mb-4 p-2 bg-primary-700 rounded z-20;

    & .gtc-spriteselector-main {
      @apply cursor-pointer;

      &.gtc-spriteselector-nopointer {
        @apply cursor-default;
      }
    }

    & .gtc-spriteselector-dropdown {
      @apply absolute top-0 left-full hidden p-2 bg-primary-700 rounded overflow-auto shadow-xl;

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
