<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { Group } from "three";

  import Modal from "$lib/components/Modal.svelte";
  import ModelViewer from "$lib/components/ModelViewer.svelte";
  import { dataViewAlt, isDebug } from "$lib/stores";
  import Canvas from "$lib/utils/canvas";
  import debug from "$lib/utils/debug";
  import Three from "$lib/utils/three";

  import { getFileData, type Model } from "../utils";
  import {
    addMeshs,
    getTextures,
    getVertices,
    type Texture,
  } from "../utils/model";
  import { unpackNmld } from "../utils/nmld";
  import { unpackSml } from "../utils/sml";
  import TextureViewer from "./TextureViewer.svelte";

  export let assetIndex: number;
  export let type: string;

  let previousAssetId = "";

  let entityIndex = 113;
  let njcmIndex = 0;

  let canvas: Canvas;
  let three: Three;

  let threeEl: HTMLDivElement;

  let textures: { [key: string]: DataView } = {};
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
      entityIndex = 0;
      njcmIndex = 0;
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

    let loadAllEntities = false;

    if (type === "battleStage") {
      model = unpackSml(dataView);
      loadAllEntities = true;
    } else {
      model = unpackNmld(dataView);
    }

    debug.log(model);

    const filteredEntity = model.entities.filter(
      (entity) => entity.linkedNjcmFiles.length,
    );

    const entities: number[] = [];

    if (loadAllEntities) {
      filteredEntity.forEach((entity) => entities.push(entity.index));
    }

    if (entities.length === 0) {
      if (!filteredEntity.find((entity) => entity.index === entityIndex)) {
        entityIndex = filteredEntity[0].index;
      }

      const list: { [key: string]: number } = {};

      filteredEntity.forEach((file) => {
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

      entities.push(entityIndex);
    }

    await entities.reduce(async (previousEntity, entityIndex) => {
      await previousEntity;

      const entity = model.entities[entityIndex];
      const njtl = model.njtlFiles[entity.linkedNjtlFiles[0]];

      let njcm = model.njcmFiles[njcmIndex];

      if (loadAllEntities) {
        njcm = model.njcmFiles[entity.linkedNjcmFiles[0]];
      } else if (!entity.linkedNjcmFiles.includes(njcmIndex)) {
        njcmIndex = entity.linkedNjcmFiles[0];
        njcm = model.njcmFiles[njcmIndex];
      }

      if (entity.linkedNjcmFiles.length > 1) {
        const list: { [key: string]: number } = {};

        entity.linkedNjcmFiles.forEach((njcm) => {
          list[njcm.toHex()] = njcm;
        });

        three.addGuiListElement(
          "njcmIndex",
          "NJCM",
          njcmIndex,
          (value) => {
            njcmIndex = value;
          },
          list,
        );
      }

      debug.log(njcm);

      const textures: Texture[] = await getTextures(njtl, model, canvas);

      const vertexBuffer: number[] = [];

      const mainGroup = three.addGroup();
      const groupIds: number[] = [];

      let error = false;

      njcm.objects.forEach((object, index) => {
        const group = new Group();

        groupIds.push(group.id);

        if (index === 0) {
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
          `{${object.parentIndex}} [${index}] (0x${(0).toHex(8)}) Object > unk: 0x${(object.unknown1 || 0).toHex(8)}, vertices: 0x${(object.verticesOffset || 0).toHex(8)}, meshs: 0x${(object.meshsOffset || 0).toHex(8)}`,
          "darkblue",
        );

        if (object.verticesOffset) {
          const { error: verticesError, vertices } = getVertices(
            object.verticesOffset,
            vertexBuffer,
            dataView,
            object,
            index,
          );

          if (verticesError) {
            error = true;
          }

          if ($isDebug && vertices.length > 0) {
            three.addPoints(vertices, instanceId, { group });
          }
        }

        if (object.meshsOffset) {
          const { error: meshsError } = addMeshs(
            object.meshsOffset,
            vertexBuffer,
            dataView,
            three,
            instanceId,
            group,
            textures,
            object,
            index,
            njcm.objects,
          );

          if (meshsError) {
            error = true;
          }
        }

        if (entities.length > 1 || index > 0) {
          group.position.x = object.transform.positionX;
          group.position.y = object.transform.positionY;
          group.position.z = object.transform.positionZ;

          group.rotation.order = "ZYX";

          group.rotation.x = object.transform.rotationX;
          group.rotation.y = object.transform.rotationY;
          group.rotation.z = object.transform.rotationZ;

          group.scale.x = object.transform.scaleX;
          group.scale.y = object.transform.scaleY;
          group.scale.z = object.transform.scaleZ;
        }
      });

      if (error) {
        debug.error("Something went wrong");
      } else {
        debug.color("Successfully completed", "green");
      }
    }, Promise.resolve());

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
    assetIndex, entityIndex, njcmIndex, type;

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
