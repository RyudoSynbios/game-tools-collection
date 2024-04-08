<script lang="ts">
  import SpriteSelector from "$lib/components/SpriteSelector.svelte";
  import { getInt, setInt } from "$lib/utils/bytes";
  import { getRegionArray } from "$lib/utils/format";
  import { getPalette24Bit } from "$lib/utils/graphics";

  import {
    pointerToItems,
    pointerToItemGraphicsPointers,
    pointerToPalettes,
  } from "../template";
  import { getSprite } from "../utils";

  export let itemIndex: number;

  let iconIndex: number;

  function handleSpriteChange(index: number): void {
    iconIndex = index;

    setInt(offset + itemIndex * 0x2c + 0x6, "uint8", index);
  }

  // Sprites

  const graphicsPointer = getRegionArray(pointerToItemGraphicsPointers);
  const graphicsOffset = getInt(graphicsPointer, "uint24");

  let iconsCount = 0;

  while (true) {
    const offset = getInt(graphicsOffset + iconsCount * 0x4, "uint24");

    if (offset === 0xffffff) {
      break;
    }

    iconsCount += 1;
  }

  const sprites: (Uint8Array | null)[] = [];

  const palettesPointers = getRegionArray(pointerToPalettes);
  const palettesOffset = getInt(palettesPointers, "uint24");

  const palette = getPalette24Bit(palettesOffset, 0x10, true);

  for (let i = 0; i < iconsCount; i += 1) {
    const compressedDataOffset = getInt(graphicsOffset + i * 0x4, "uint24");

    sprites.push(getSprite(compressedDataOffset, palette));
  }

  // Main Sprite

  const pointer = getRegionArray(pointerToItems);
  const offset = getInt(pointer, "uint24");

  $: {
    iconIndex = getInt(offset + itemIndex * 0x2c + 0x6, "uint8");
  }
</script>

<SpriteSelector
  spriteIndex={iconIndex}
  spriteWidth={16}
  spriteHeight={16}
  mainScale={2}
  {sprites}
  onSpriteChange={handleSpriteChange}
/>

<style lang="postcss">
</style>
