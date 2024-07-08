<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Matrix4, Mesh } from "three";

  import { isDebug } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import { generateGraphicsSheet } from "$lib/utils/graphics";
  import Three from "$lib/utils/three";

  import { getFileData, isDummy } from "../utils";
  import {
    addObject as addBattleCharacterObject,
    unpackBattleCharacter,
  } from "../utils/battleCharacter";
  import {
    addFloor as addBattleStageFloor,
    addObject as addBattleStageObject,
    unpackBattleStage,
  } from "../utils/battleStage";
  import type { Texture } from "../utils/model";
  import {
    addBattlefieldFloor,
    addFloor as addMpdFloor,
    addObject as addMpdObject,
    unpackMpd,
  } from "../utils/mpd";

  export let assetIndex: number;
  export let type: string;

  let canvasEl: HTMLDivElement;
  let threeEl: HTMLDivElement;

  let innerWidth = 0;

  let canvas: Canvas;
  let three: Three;
  let canvasTexture: Canvas;

  let hideCanvas = false;
  let hideTree = false;

  function handleCameraFit(): void {
    three.fitCameraToScene();
  }

  function handleCameraReset(): void {
    three.resetCamera();
  }

  function handleKeyDown(event: any): void {
    if (!event.ctrlKey && !event.metaKey && event.key === "f") {
      event.preventDefault();

      handleCameraFit();
    } else if (!event.ctrlKey && !event.metaKey && event.key === "r") {
      event.preventDefault();

      handleCameraReset();
    }
  }

  async function updateCanvas(): Promise<void> {
    debug.clear();

    canvas.reset();
    three.reset();

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    const dataView = getFileData(type, assetIndex);

    if (isDummy(dataView)) {
      three.setLoading(false);

      canvas.resize(1, 1);
      canvas.render();

      return;
    }

    let textures: Texture[] = [];

    if (type === "battleCharacter") {
      const battleCharacter = await unpackBattleCharacter(
        canvasTexture,
        dataView,
      );

      if (instanceId !== three.getInstanceId()) {
        return;
      }

      debug.log(battleCharacter);

      if (battleCharacter) {
        battleCharacter.objects.forEach((offset) => {
          const mesh = addBattleCharacterObject(
            battleCharacter.objectsBaseOffset,
            offset,
            battleCharacter.textures,
            three,
            instanceId,
            dataView,
          );

          if (mesh) {
            mesh.scale.x = 10;
            mesh.scale.y = 10;
            mesh.scale.z = 10;
          }
        });

        textures = battleCharacter.textures;
      }
    } else if (type === "battleStage") {
      const battleStage = await unpackBattleStage(canvasTexture, dataView);

      if (instanceId !== three.getInstanceId()) {
        return;
      }

      debug.log(battleStage);

      if (battleStage) {
        battleStage.objects.forEach((object) => {
          const { offset, position, rotation, scale } = object;

          const meshId = offset.toHex();

          let mesh: Mesh | null;

          if (three.isMeshCached(meshId)) {
            mesh = three.cloneCachedMesh(meshId, instanceId);
          } else {
            mesh = addBattleStageObject(
              battleStage.objectsBaseOffset,
              offset,
              battleStage.textures,
              three,
              instanceId,
              dataView,
            );
          }

          if (mesh) {
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;

            mesh.rotation.order = "ZYX";

            mesh.rotation.x = rotation.x;
            mesh.rotation.y = rotation.y;
            mesh.rotation.z = rotation.z;

            mesh.scale.x = scale.x;
            mesh.scale.y = scale.y;
            mesh.scale.z = scale.z;

            const clone = three.clone(mesh);

            clone.applyMatrix4(new Matrix4().makeScale(-1, 1, -1));

            clone.position.z -= 256;
          }
        });

        addBattleStageFloor(battleStage.floor.texture, three, instanceId);

        textures = battleStage.textures;
      }
    } else if (type === "location") {
      const mpd = await unpackMpd(canvasTexture, dataView);

      if (instanceId !== three.getInstanceId()) {
        return;
      }

      debug.log(mpd);

      if (mpd) {
        mpd.objects.forEach((object) => {
          const { offset, position, rotation, scale } = object;

          const meshId = offset.toHex();

          let mesh: Mesh | null;

          if (three.isMeshCached(meshId)) {
            mesh = three.cloneCachedMesh(meshId, instanceId);
          } else {
            mesh = addMpdObject(
              offset,
              mpd.textures,
              three,
              instanceId,
              dataView,
            );
          }

          if (mesh) {
            mesh.position.x = position.x;
            mesh.position.y = position.y;
            mesh.position.z = position.z;

            mesh.rotation.order = "ZYX";

            mesh.rotation.x = rotation.x;
            mesh.rotation.y = rotation.y;
            mesh.rotation.z = rotation.z;

            mesh.scale.x = scale.x;
            mesh.scale.y = scale.y;
            mesh.scale.z = scale.z;
          }
        });

        if (mpd.floor.battlefield) {
          addBattlefieldFloor(
            mpd.floor.battlefield.offset,
            mpd.floor.battlefield.heightMap,
            mpd.textures,
            three,
            instanceId,
            dataView,
          );
        }

        addMpdFloor(
          mpd.floor.texture,
          mpd.floor.position,
          mpd.isBattlefield,
          three,
          instanceId,
        );

        textures = mpd.textures;
      }
    }

    three.setLoading(false);

    const sheet = generateGraphicsSheet(128, textures);

    canvas.resize(sheet.width, sheet.height);

    textures.forEach((texture, index) => {
      canvas.addGraphic(
        "sprite",
        texture.data,
        texture.width,
        texture.height,
        sheet.coordinates[index].x,
        sheet.coordinates[index].y,
      );
    });

    canvas.render();
  }

  onMount(async () => {
    canvas = new Canvas({ canvasEl });

    canvas.addLayer("sprite", "image");

    three = new Three(threeEl);

    canvasTexture = new Canvas({
      width: 32,
      height: 32,
    });

    canvasTexture.addLayer("texture", "image");

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
    three.destroy();
    canvasTexture.destroy();
  });

  $: {
    assetIndex, type;

    if (canvas) {
      updateCanvas();
    }
  }

  $: {
    innerWidth;

    if (three && canvasTexture) {
      const width = threeEl.clientWidth;
      const height = width / 1.78;

      (threeEl.children[0] as HTMLCanvasElement).style.width = "0";

      three.resize(width, height);
    }
  }
</script>

<svelte:window bind:innerWidth on:keydown={handleKeyDown} />

<div class="gtc-modelviewer">
  <div class="gtc-modelviewer-content">
    <div
      class="gtc-modelviewer-canvas"
      class:gtc-modelviewer-canvas-hidden={hideCanvas}
    >
      <div bind:this={canvasEl} />
    </div>
    <div
      class="gtc-modelviewer-three"
      class:gtc-modelviewer-three-hidden={hideTree}
    >
      <div bind:this={threeEl} />
    </div>
  </div>
</div>

<style lang="postcss">
  .gtc-modelviewer {
    @apply flex-1;

    & .gtc-modelviewer-content {
      @apply flex;

      & .gtc-modelviewer-canvas,
      & .gtc-modelviewer-three {
        @apply self-start p-2 w-fit bg-primary-700 rounded;
      }

      & .gtc-modelviewer-canvas {
        @apply shrink-0 mr-4 min-w-36;

        &.gtc-modelviewer-canvas-hidden {
          @apply hidden;
        }
      }

      & .gtc-modelviewer-three {
        @apply relative w-full;

        &.gtc-modelviewer-three-hidden {
          @apply hidden;
        }
      }
    }
  }
</style>
