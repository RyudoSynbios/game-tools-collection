<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  import Modal from "$lib/components/Modal.svelte";
  import ModelViewer from "$lib/components/ModelViewer.svelte";
  import Canvas from "$lib/utils/canvas";
  import type { Texture } from "$lib/utils/common/saturn/shining";
  import debug from "$lib/utils/debug";
  import Three from "$lib/utils/three";

  import { getFileData, getFilteredFiles } from "../utils";
  import MDX from "../utils/mdx";
  import TextureViewer from "./TextureViewer.svelte";

  export let assetIndex: number;
  export let type: string;

  let canvas: Canvas;
  let three: Three;

  let threeEl: HTMLDivElement;

  let textures: Texture[] = [];
  let isTextureViewerOpen = false;

  function handleTextureViewerClose(): void {
    isTextureViewerOpen = false;
  }

  function handleTextureViewerOpen(): void {
    isTextureViewerOpen = true;
  }

  async function updateCanvas(): Promise<void> {
    debug.clear();

    three.reset();

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    const file = getFilteredFiles(type)[assetIndex];
    const dataView = getFileData(type, assetIndex);

    const mdx = new MDX(file, dataView, three);

    if (mdx.floor) {
      await mdx.addMesh(mdx.floor, three, instanceId, canvas);
    }

    await mdx.objects.reduce(async (previousObject, object, index) => {
      await previousObject;

      if (instanceId !== three.getInstanceId()) {
        return;
      }

      await mdx.addMesh(object, three, instanceId, canvas);

      if (instanceId === three.getInstanceId()) {
        three.updateLoadingProgression(
          (index + 1) / mdx.objects.length,
          instanceId,
        );
      }
    }, Promise.resolve());
    textures = mdx.textures.filter((texture) => texture);

    if (instanceId !== three.getInstanceId()) {
      return;
    }

    three.setTextureListCallback(
      textures.length > 0 ? handleTextureViewerOpen : undefined,
    );

    three.setLoading(false);
  }

  onMount(async () => {
    canvas = new Canvas({
      width: 32,
      height: 32,
    });

    canvas.addLayer("texture", "image");

    three = new Three(threeEl);

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
    three.destroy();
  });

  $: {
    (assetIndex, type);

    if (canvas) {
      updateCanvas();
    }
  }
</script>

<ModelViewer {three} bind:threeEl />

{#if isTextureViewerOpen}
  <Modal onClose={handleTextureViewerClose}>
    <TextureViewer {textures} />
  </Modal>
{/if}
