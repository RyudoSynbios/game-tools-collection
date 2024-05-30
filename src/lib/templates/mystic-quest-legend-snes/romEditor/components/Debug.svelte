<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Input from "$lib/components/Input.svelte";
  import Canvas from "$lib/utils/canvas";
  import { getPalette } from "$lib/utils/graphics";

  import { generateMonsterCanvas } from "../utils";

  let canvasEl: HTMLDivElement;

  let canvas: Canvas;

  let viewWidth = 128;
  let viewHeight = 512;

  let spriteOffset = 0x28d77; // 0x20000
  let paletteOffset = 0x48000; // 0x3daf0

  let shiftPressed = false;
  let ctrlPressed = false;

  function handleKeyDown(event: any): void {
    if (event.key === "Shift") {
      shiftPressed = true;
    }

    if (event.key === "Meta") {
      ctrlPressed = true;
    }
  }

  function handleKeyUp(event: any): void {
    if (event.key === "Shift") {
      shiftPressed = false;
    }

    if (event.key === "Meta") {
      ctrlPressed = false;
    }
  }

  function handlePaletteOffsetChange(event: Event): void {
    paletteOffset = parseInt((event.target as HTMLInputElement).value);

    updateCanvas();
  }

  function handleSpriteOffsetChange(event: Event): void {
    let value = parseInt((event.target as HTMLInputElement).value);

    if (shiftPressed && ctrlPressed) {
      value = spriteOffset + (value > spriteOffset ? 0x180 : -0x180);
    } else if (shiftPressed) {
      value = spriteOffset + (value > spriteOffset ? 0x18 : -0x18);
    } else if (ctrlPressed) {
      value = spriteOffset + (value > spriteOffset ? 0x30 : -0x30);
    }

    spriteOffset = value;

    updateCanvas();
  }

  function handleViewWidthChange(event: any): void {
    viewWidth = parseInt((event.target as HTMLInputElement).value);

    canvas.resize(viewWidth, viewHeight);

    updateCanvas();
  }

  function handleViewHeightChange(event: any): void {
    viewHeight = parseInt((event.target as HTMLInputElement).value);

    canvas.resize(viewWidth, viewHeight);

    updateCanvas();
  }

  function updateCanvas(): void {
    const palette = getPalette("BGR555", paletteOffset, 0x8);

    generateMonsterCanvas(canvas, spriteOffset, palette, viewWidth, viewHeight);
  }

  onMount(() => {
    canvas = new Canvas({
      canvasEl,
      width: viewWidth,
      height: viewHeight,
    });

    canvas.addLayer("background", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<div class="gtc-debug">
  <div class="gtc-debug-inputs">
    <Input
      label="Sprite Offset (0x{spriteOffset.toHex()})"
      type="number"
      value={spriteOffset}
      onChange={handleSpriteOffsetChange}
    />
    <Input
      label="Palette Offset (0x{paletteOffset.toHex()})"
      type="number"
      value={paletteOffset}
      step={0x10}
      onChange={handlePaletteOffsetChange}
    />
    <Input
      label="View Width"
      type="number"
      value={viewWidth}
      step={8}
      onChange={handleViewWidthChange}
    />
    <Input
      label="View Width"
      type="number"
      value={viewHeight}
      step={8}
      onChange={handleViewHeightChange}
    />
  </div>
  <div bind:this={canvasEl} />
</div>

<style lang="postcss">
  .gtc-debug {
    & .gtc-debug-inputs {
      @apply flex;
    }
  }
</style>
