<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import { getString } from "$lib/utils/bytes";
  import Canvas from "$lib/utils/canvas";
  import { getGvrTexture, type GvrTexture } from "$lib/utils/common/gamecube";
  import { generateGraphicsSheet } from "$lib/utils/graphics";

  import { getFileData } from "../utils";
  import { unpackNmld } from "../utils/nmld";

  interface Props {
    assetIndex: number;
  }

  let { assetIndex }: Props = $props();

  let canvasEl = $state<HTMLDivElement>()!;

  let canvas = $state<Canvas>()!;

  async function updateCanvas(): Promise<void> {
    let dataView = getFileData("image", assetIndex);

    const textures: GvrTexture[] = [];

    const magic = getString(0x0, 0x4, "uint8", {}, dataView);

    if (magic === "GCIX") {
      textures.push(getGvrTexture(canvas, dataView));
    } else {
      const nmld = unpackNmld(dataView);

      Object.values(nmld.textures).forEach((dataView) => {
        textures.push(getGvrTexture(canvas, dataView));
      });
    }

    if (textures.length > 1) {
      const sheet = generateGraphicsSheet(640, textures);

      canvas.resize(sheet.width, sheet.height);

      textures.forEach((texture, index) => {
        canvas.addGraphic(
          "texture",
          texture.data,
          texture.width,
          texture.height,
          sheet.coordinates[index].x,
          sheet.coordinates[index].y,
        );
      });
    } else {
      const texture = textures[0];

      canvas.resize(texture.width, texture.height);

      canvas.addGraphic("texture", texture.data, texture.width, texture.height);
    }

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("texture", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
  });

  $effect(() => {
    if (canvas) {
      updateCanvas();
    }
  });
</script>

<div class="gtc-imageviewer">
  <div bind:this={canvasEl}></div>
</div>

<style lang="postcss">
  @reference "../../../../../app.css";

  .gtc-imageviewer {
    @apply bg-primary-700 w-fit self-start rounded p-2;
  }
</style>
