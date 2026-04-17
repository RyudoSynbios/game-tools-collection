<script lang="ts">
  import SpriteSelector from "$lib/components/SpriteSelector.svelte";
  import { getInt, setInt } from "$lib/utils/bytes";
  import { getRegionArray } from "$lib/utils/format";
  import { getPalette } from "$lib/utils/graphics";

  import { getSprite } from "../utils";
  import {
    ITEM_TILESET_TABLE_POINTER,
    ITEMS_POINTER,
    PALETTES_POINTER,
  } from "../utils/constants";

  export let itemIndex: number;

  let iconIndex: number;

  function handleSpriteChange(index: number): void {
    iconIndex = index;

    setInt(offset + itemIndex * 0x2c + 0x6, "uint8", index);
  }

  // Sprites

  const tilesetPointer = getRegionArray(ITEM_TILESET_TABLE_POINTER);
  const tilesetOffset = getInt(tilesetPointer, "uint24");

  let iconsCount = 0;

  while (true) {
    const offset = getInt(tilesetOffset + iconsCount * 0x4, "uint24");

    if (offset === 0xffffff) {
      break;
    }

    iconsCount += 1;
  }

  const sprites: (Uint8Array | null)[] = [];

  const palettesPointers = getRegionArray(PALETTES_POINTER);
  const palettesOffset = getInt(palettesPointers, "uint24");

  const palette = getPalette("BGR555", palettesOffset, 0x10, {
    firstTransparent: true,
  });

  for (let i = 0; i < iconsCount; i += 1) {
    const compressedDataOffset = getInt(tilesetOffset + i * 0x4, "uint24");

    sprites.push(getSprite(compressedDataOffset, palette));
  }

  // Main Sprite

  const pointer = getRegionArray(ITEMS_POINTER);
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
