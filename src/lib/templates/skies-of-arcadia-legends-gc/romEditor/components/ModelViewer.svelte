<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Group } from "three";

  import Modal from "$lib/components/Modal.svelte";
  import ModelViewer from "$lib/components/ModelViewer.svelte";
  import { dataViewAlt } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import Three from "$lib/utils/three";

  import { getFileData, type Entity, type Model } from "../utils";
  import {
    addMeshs,
    getTextures,
    getVertices,
    type Texture,
    type VerticesCache,
  } from "../utils/model";
  import { unpackNmld } from "../utils/nmld";
  import { unpackSml } from "../utils/sml";
  import TextureViewer from "./TextureViewer.svelte";

  export let assetIndex: number;
  export let type: string;

  let previousAssetId = "";

  let entityIndex = -1;

  let canvas: Canvas;
  let three: Three;

  let threeEl: HTMLDivElement;

  let textures: { [key: string]: DataView } = {};
  let texturesCache: { [key: string]: Texture } = {};
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
      three.updateCameraSettings([0, 30, 100], [0, 20, 0]);
    } else if (type === "weapon") {
      three.updateCameraSettings([-40, 20, 0], [0, 0, 0]);
    } else {
      three.updateCameraSettings([0, 100, 300], [0, 50, 0]);
    }

    three.reset();

    if (getAssetId() !== previousAssetId) {
      entityIndex = -1;
    }

    const instanceId = three.getInstanceId();

    three.setLoading(true);

    const dataView = getFileData(type, assetIndex);

    if (dataView.byteLength === 0) {
      three.setLoading(false);

      return;
    }

    $dataViewAlt.debug = dataView;

    let model: Model;

    if (type === "battleStage") {
      model = unpackSml(dataView);
    } else {
      model = unpackNmld(dataView);
    }

    debug.log(model);

    const filteredEntities = model.entities.filter(
      (entity) => entity.linkedNjcmFiles.length,
    );

    const entities: Entity[] = [];

    if (entityIndex === -1) {
      filteredEntities.forEach((entity) => entities.push(entity));
    } else {
      entities.push(model.entities[entityIndex]);
    }

    if (filteredEntities.length > 1) {
      const list: { [key: string]: number } = {
        All: -1,
      };

      filteredEntities.forEach((file) => {
        list[`${file.index}: ${file.name}`] = file.index;
      });

      three.addGuiListElement(
        "entityIndex",
        "Entity",
        entityIndex,
        (value) => {
          entityIndex = value;
        },
        list,
      );
    }

    let error = false;

    texturesCache = {};

    await entities.reduce(async (previousEntity, entity, index) => {
      await previousEntity;

      if (instanceId !== three.getInstanceId()) {
        return previousEntity;
      }

      const njtl = model.njtlFiles[entity.linkedNjtlFiles[0]];

      const textures: Texture[] = await getTextures(
        njtl,
        model,
        canvas,
        texturesCache,
      );

      const vertexBuffer: number[] = [];

      const mainGroup = three.addGroup();
      const groupIds: number[] = [];

      if (entityIndex === -1) {
        mainGroup.position.x = entity.transform.positionX;
        mainGroup.position.y = entity.transform.positionY;
        mainGroup.position.z = entity.transform.positionZ;

        mainGroup.rotation.order = "ZYX";

        mainGroup.rotation.x = entity.transform.rotationX;
        mainGroup.rotation.y = entity.transform.rotationY;
        mainGroup.rotation.z = entity.transform.rotationZ;

        mainGroup.scale.x = entity.transform.scaleX;
        mainGroup.scale.y = entity.transform.scaleY;
        mainGroup.scale.z = entity.transform.scaleZ;
      }

      // TODO: Temporary

      if (type === "shipBattle" && entity.entityId < 9000) {
        mainGroup.position.x += 100;
        mainGroup.position.y += 100;
      }

      const verticesCache: VerticesCache = {
        instance: -1,
        status: "complete",
        index: -1,
        rewind: false,
      };

      entity.linkedNjcmFiles.forEach((njcmIndex) => {
        const njcm = model.njcmFiles[njcmIndex];

        for (let i = 0; i < njcm.objects.length; i += 1) {
          const object = njcm.objects[i];

          const group = new Group();

          groupIds.push(group.id);

          if (object.index === 0) {
            mainGroup.add(group);
          } else {
            const parentId = groupIds[object.parentIndex];

            const parent = mainGroup.getObjectById(parentId);

            if (parent) {
              parent.add(group);
            } else {
              debug.warn("parent not found");
              mainGroup.add(group);
            }
          }

          debug.color(
            `{${object.parentIndex}} [${object.index}] (0x${object.offset.toHex(8)}) Object > flags: ${object.flags.debug}, vertices: 0x${(object.verticesOffset || 0).toHex(8)}, meshs: 0x${(object.meshsOffset || 0).toHex(8)}`,
            "darkblue",
          );

          if (object.verticesOffset) {
            const { error: verticesError } = getVertices(
              entityIndex,
              object,
              vertexBuffer,
              dataView,
              njcm.objects,
            );

            if (verticesError) {
              error = true;
            }
          }

          if (object.meshsOffset) {
            const { error: meshsError } = addMeshs(
              entity,
              object,
              vertexBuffer,
              dataView,
              three,
              instanceId,
              group,
              textures,
              verticesCache,
            );

            if (meshsError) {
              error = true;
            }
          }

          if (verticesCache.rewind) {
            i = verticesCache.index;
            verticesCache.rewind = false;
          }
        }
      });

      if (instanceId === three.getInstanceId()) {
        three.updateLoadingProgression(
          (index + 1) / entities.length,
          instanceId,
        );
      }
    }, Promise.resolve());

    if (error) {
      debug.error("Something went wrong");
    } else {
      debug.color("Successfully completed", "green");
    }

    textures = model.textures;

    three.setTextureListCallback(
      Object.keys(textures).length > 0 ? handleModalOpen : undefined,
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

    three = new Three(threeEl, {
      gridSize: 100,
    });

    updateCanvas();
  });

  onDestroy(() => {
    canvas.destroy();
    three.destroy();
  });

  $: {
    assetIndex, entityIndex, type;

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
