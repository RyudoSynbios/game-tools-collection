<script lang="ts">
  import SpriteSelector from "$lib/components/SpriteSelector.svelte";
  import { getInt, setInt } from "$lib/utils/bytes";
  import { getRegionArray } from "$lib/utils/format";
  import { getPalette } from "$lib/utils/graphics";

  import { getPortrait } from "../utils";
  import {
    PORTRAITS_PALETTE_POINTER,
    PORTRAITS_TILESET_OFFSET,
  } from "../utils/constants";

  export let characterIndex: number;

  let portraitIndex: number;

  function handleSpriteChange(index: number): void {
    portraits[characterIndex].portrait = index;

    setInt(portraits[characterIndex].offset, "uint8", index);
  }

  // Sprites

  const sprites: (Uint8Array | null)[] = [];

  for (let i = 0; i < 0x7; i += 1) {
    const pointer = getRegionArray(PORTRAITS_PALETTE_POINTER);
    const paletteOffset =
      PORTRAITS_TILESET_OFFSET + getInt(pointer + i * 0x2, "uint16");

    const palette = getPalette("BGR555", paletteOffset, 0x10);
    const sprite = getPortrait(PORTRAITS_TILESET_OFFSET + i * 0x480, palette);

    sprites.push(sprite);
  }

  // Portraits

  const portraits: {
    [key: string]: {
      offset: number;
      portrait: number;
    };
  } = {};

  for (let i = 0x0; i < 0x7; i += 0x1) {
    const offset = 0xc0000 + i * 0x50;

    portraits[i] = {
      offset,
      portrait: getInt(offset, "uint8"),
    };
  }

  $: {
    portraitIndex = portraits[characterIndex]?.portrait;
  }
</script>

<SpriteSelector
  spriteIndex={portraitIndex}
  spriteWidth={48}
  spriteHeight={48}
  spritesPerRow={7}
  {sprites}
  onSpriteChange={handleSpriteChange}
/>
