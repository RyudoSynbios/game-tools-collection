<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Matrix4, Mesh } from "three";

  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import { generateGraphicsSheet } from "$lib/utils/graphics";
  import Three from "$lib/utils/three";

  import { getFileData, getScenario, isDummy } from "../utils";
  import {
    addObject as addBattleCharacterObject,
    getModels,
    unpackBattleCharacter,
  } from "../utils/battleCharacter";
  import {
    addFloor as addBattleStageFloor,
    addObject as addBattleStageObject,
    unpackBattleStage,
  } from "../utils/battleStage";
  import { getTextureData, type Texture } from "../utils/model";
  import {
    addBattlefieldFloor,
    addFloor as addMpdFloor,
    addObject as addMpdObject,
    unpackMpd,
  } from "../utils/mpd";

  export let assetIndex: number;
  export let type: string;

  let previousAssetId = "";

  let modelIndex = 0;

  let canvasEl: HTMLDivElement;
  let threeEl: HTMLDivElement;

  let innerWidth = 0;

  let canvas: Canvas;
  let three: Three;
  let canvasTexture: Canvas;

  let hideCanvas = false;
  let hideTree = false;

  function getAssetId() {
    return `${type}_${assetIndex}`;
  }

  function handleCameraFit(): void {
    three.fitCameraToScene();
  }

  function handleCameraReset(): void {
    three.resetCamera();
  }

  function handleKeyDown(event: KeyboardEvent): void {
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

    if (getAssetId() !== previousAssetId) {
      modelIndex = 0;
    }

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    let dataView = getFileData(type, assetIndex);

    if (isDummy(0x0, dataView)) {
      three.setLoading(false);

      canvas.resize(1, 1);
      canvas.render();

      return;
    }

    const scenario = getScenario();

    let textures: Texture[] = [];

    if (type === "battleCharacter") {
      const models = getModels(assetIndex);

      if (models.length > 1) {
        const list: { [key: string]: number } = {};

        for (let i = 0; i < models.length; i += 1) {
          list[`Model ${i + 1}`] = i;
        }

        three.addGuiElement(
          "modelIndex",
          "Model",
          modelIndex,
          (value) => {
            modelIndex = value;
          },
          list,
        );
      }

      if (modelIndex > 0) {
        dataView = new DataView(dataView.buffer.slice(models[modelIndex]));
      }

      const battleCharacter = unpackBattleCharacter(dataView);

      debug.log(battleCharacter);

      if (battleCharacter) {
        await battleCharacter.objects.reduce(async (previousObject, offset) => {
          await previousObject;

          if (instanceId !== three.getInstanceId()) {
            return;
          }

          const mesh = await addBattleCharacterObject(
            battleCharacter.objectsBaseOffset,
            offset,
            battleCharacter.textures,
            three,
            instanceId,
            canvasTexture,
            dataView,
          );

          if (mesh) {
            mesh.scale.x = 10;
            mesh.scale.y = 10;
            mesh.scale.z = 10;
          }
        }, Promise.resolve());

        textures = battleCharacter.textures;
      }
    } else if (type === "battleStage") {
      const battleStage = await unpackBattleStage(canvasTexture, dataView);

      debug.log(battleStage);

      if (battleStage) {
        await battleStage.objects.reduce(async (previousObject, object) => {
          await previousObject;

          if (instanceId !== three.getInstanceId()) {
            return;
          }

          const { offset, position, rotation, scale } = object;

          const meshId = offset.toHex();

          let mesh: Mesh | null;

          if (three.isMeshCached(meshId)) {
            mesh = three.cloneCachedMesh(meshId, instanceId);
          } else {
            mesh = await addBattleStageObject(
              battleStage.objectsBaseOffset,
              offset,
              battleStage.textures,
              three,
              instanceId,
              canvasTexture,
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

            const scaleX = scenario === "1" ? -1 : 1;

            clone.applyMatrix4(new Matrix4().makeScale(scaleX, 1, -1));

            clone.position.z -= 256;
          }
        }, Promise.resolve());

        addBattleStageFloor(battleStage.floor.texture, three, instanceId);

        textures = battleStage.textures;
      }
    } else if (type === "location") {
      const mpd = await unpackMpd(canvasTexture, dataView);

      debug.log(mpd);

      if (mpd) {
        await mpd.objects.reduce(async (previousObject, object) => {
          await previousObject;

          if (instanceId !== three.getInstanceId()) {
            return;
          }

          const { offset, position, rotation, scale } = object;

          const meshId = offset.toHex();

          let mesh: Mesh | null;

          if (three.isMeshCached(meshId)) {
            mesh = three.cloneCachedMesh(meshId, instanceId);
          } else {
            mesh = await addMpdObject(
              mpd.objectsBaseOffset,
              offset,
              mpd.textures,
              object.overrideOptions,
              three,
              instanceId,
              canvasTexture,
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
        }, Promise.resolve());

        if (mpd.floor.battlefield) {
          await addBattlefieldFloor(
            mpd.floor.battlefield.offset,
            mpd.floor.battlefield.heightMap,
            mpd.textures,
            three,
            instanceId,
            canvasTexture,
            dataView,
          );
        }

        addMpdFloor(
          mpd.floor.texture,
          mpd.floor.position,
          mpd.floor.repeat,
          three,
          instanceId,
        );

        textures = mpd.textures;
      }
    }

    if (instanceId !== three.getInstanceId()) {
      return;
    }

    three.setLoading(false);

    const sheet = generateGraphicsSheet(128, textures);

    canvas.resize(sheet.width, sheet.height);

    textures.forEach((texture, index) => {
      if (texture.data.length === 0) {
        texture.data = getTextureData(texture);
      }

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
    assetIndex, modelIndex, type;

    if (canvas) {
      updateCanvas();
    }

    previousAssetId = getAssetId();
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
        @apply w-fit self-start rounded bg-primary-700 p-2;
      }

      & .gtc-modelviewer-canvas {
        @apply mr-4 min-w-36 shrink-0;

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
