<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Matrix4, Mesh } from "three";

  import Modal from "$lib/components/Modal.svelte";
  import ModelViewer from "$lib/components/ModelViewer.svelte";
  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
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
  import { type Texture } from "../utils/model";
  import {
    addBattlefieldFloor,
    addFloor as addMpdFloor,
    addObject as addMpdObject,
    unpackMpd,
  } from "../utils/mpd";
  import TextureViewer from "./TextureViewer.svelte";

  export let assetIndex: number;
  export let type: string;

  let previousAssetId = "";

  let modelIndex = 0;

  let canvas: Canvas;
  let three: Three;

  let threeEl: HTMLDivElement;

  let textures: Texture[] = [];
  let isModalOpen = false;

  function getAssetId() {
    return `${type}_${assetIndex}`;
  }

  function handleModalClose(): void {
    isModalOpen = false;
  }

  function handleModalOpen(): void {
    isModalOpen = true;
  }

  async function updateCanvas(): Promise<void> {
    debug.clear();

    if (type === "battleCharacter") {
      three.updateCameraSettings([0, 1000, -1500], [0, 250, 0]);
    } else {
      three.updateCameraSettings([0, 1000, 1500], [0, 250, 0]);
    }

    three.reset();

    if (getAssetId() !== previousAssetId) {
      modelIndex = 0;
    }

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    let dataView = getFileData(type, assetIndex);

    if (isDummy(0x0, dataView)) {
      three.setLoading(false);

      return;
    }

    const scenario = getScenario();

    textures = [];

    if (type === "battleCharacter") {
      const models = getModels(assetIndex);

      if (models.length > 1) {
        const list: { [key: string]: number } = {};

        for (let i = 0; i < models.length; i += 1) {
          list[`Model ${i + 1}`] = i;
        }

        three.addGuiListElement(
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
        await battleCharacter.objects.reduce(
          async (previousObject, offset, index) => {
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
              canvas,
              dataView,
            );

            if (mesh) {
              mesh.scale.x = 10;
              mesh.scale.y = 10;
              mesh.scale.z = 10;
            }

            if (instanceId === three.getInstanceId()) {
              three.updateLoadingProgression(
                (index + 1) / battleCharacter.objects.length,
                instanceId,
              );
            }
          },
          Promise.resolve(),
        );

        textures = battleCharacter.textures;
      }
    } else if (type === "battleStage") {
      const battleStage = await unpackBattleStage(canvas, dataView);

      debug.log(battleStage);

      if (battleStage) {
        await battleStage.objects.reduce(
          async (previousObject, object, index) => {
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
                canvas,
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

            three.updateLoadingProgression(
              (index + 1) / battleStage.objects.length,
              instanceId,
            );
          },
          Promise.resolve(),
        );

        addBattleStageFloor(battleStage.floor.texture, three, instanceId);

        textures = battleStage.textures;
      }
    } else if (type === "location") {
      const mpd = await unpackMpd(canvas, dataView);

      debug.log(mpd);

      if (mpd) {
        await mpd.objects.reduce(async (previousObject, object, index) => {
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
              canvas,
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

          three.updateLoadingProgression(
            (index + 1) / mpd.objects.length,
            instanceId,
          );
        }, Promise.resolve());

        if (mpd.floor.battlefield) {
          await addBattlefieldFloor(
            mpd.floor.battlefield.offset,
            mpd.floor.battlefield.heightMap,
            mpd.textures,
            three,
            instanceId,
            canvas,
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

    three.setTextureListCallback(
      textures.length > 0 ? handleModalOpen : undefined,
    );

    if (instanceId !== three.getInstanceId()) {
      return;
    }

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
    assetIndex, modelIndex, type;

    if (canvas) {
      updateCanvas();
    }

    previousAssetId = getAssetId();
  }
</script>

<ModelViewer {three} bind:threeEl />

{#if isModalOpen}
  <Modal onClose={handleModalClose}>
    <TextureViewer {textures} />
  </Modal>
{/if}

<style lang="postcss">
</style>
