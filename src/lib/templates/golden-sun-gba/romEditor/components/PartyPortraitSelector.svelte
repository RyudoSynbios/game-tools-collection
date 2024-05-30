<script lang="ts">
  import SpriteSelector from "$lib/components/SpriteSelector.svelte";
  import { getInt, setInt } from "$lib/utils/bytes";
  import { getRegionArray } from "$lib/utils/format";
  import { getPalette } from "$lib/utils/graphics";

  import {
    pointerToCharacterGraphics,
    pointerToCharacterPortraits,
  } from "../template";
  import { getSprite } from "../utils";

  export let characterIndex: number;

  let portraitIndex: number;

  function handleSpriteChange(index: number): void {
    portraits[characterIndex].portrait = index;

    setInt(portraits[characterIndex].offset + 0x2, "uint16", index);
  }

  // Sprites

  const graphicsPointer = getRegionArray(pointerToCharacterGraphics);
  const graphicsOffset = getInt(graphicsPointer, "uint24");

  const portraitsCount = getInt(graphicsOffset, "uint16") / 2;

  const sprites: (Uint8Array | null)[] = [];

  for (let i = 0; i < portraitsCount; i += 1) {
    const offset = getInt(graphicsOffset + i * 2, "uint16");

    if (offset !== 0x0) {
      const palette = getPalette("BGR555", graphicsOffset + offset, 0x10);
      const compressedDataOffset = graphicsOffset + offset + 0x20;

      sprites.push(getSprite(compressedDataOffset, palette));
    } else {
      sprites.push(null);
    }
  }

  // Portraits

  const portraitsPointer = getRegionArray(pointerToCharacterPortraits);
  const portraitsOffset = getInt(portraitsPointer, "uint24");

  const portraits: {
    [key: string]: {
      offset: number;
      portrait: number;
    };
  } = {};

  for (let i = 0x0; i < 0x9; i += 0x1) {
    const offset = portraitsOffset + i * 0x4;

    const character = getInt(offset, "uint16");
    const portrait = getInt(offset + 0x2, "uint16");

    portraits[character] = {
      offset,
      portrait,
    };
  }

  $: {
    portraitIndex = portraits[characterIndex]?.portrait;
  }
</script>

<SpriteSelector
  spriteIndex={portraitIndex}
  spriteWidth={32}
  spriteHeight={32}
  mainScale={2}
  {sprites}
  onSpriteChange={handleSpriteChange}
/>

<style lang="postcss">
</style>
