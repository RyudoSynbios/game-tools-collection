import FileSaver from "file-saver";
import { GUI } from "lil-gui";
import { get } from "svelte/store";
import {
  AmbientLight,
  BackSide,
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  FrontSide,
  GridHelper,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MirroredRepeatWrapping,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Quaternion,
  Raycaster,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
  type MeshBasicMaterialParameters,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { isDebug } from "$lib/stores";
import { generateUUID } from "$lib/utils/format";

import debug from "./debug";
import { getLocalStorage, setLocalStorage } from "./format";
import OBJExporter from "./three/OBJExporter";

export type Side = "front" | "back" | "double";

export interface GeometryOptions {
  nonIndexed?: boolean;
  smoothAngle?: number;
}

export interface MaterialOptions {
  color?: number;
  depthTest?: boolean;
  model?: "basic" | "lambert";
  opacity?: number;
  side?: Side;
  texture?: TextureOptions;
}

export interface MeshOptions {
  id?: string;
  group?: Group;
  locked?: boolean;
  renderOrder?: number;
  onClick?: () => void;
}

export interface TextureOptions {
  base64?: string;
  flipY?: boolean;
  repeatX?: boolean | "mirrored";
  repeatY?: boolean | "mirrored";
}

export default class Three {
  private debug: boolean;
  private threeEl: HTMLDivElement;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private cameraSettings: {
    fov: number;
    near: number;
    far: number;
    position: [number, number, number];
    target: [number, number, number];
  };
  private controls: OrbitControls;
  private raycaster: Raycaster;
  private cache: { [id: string]: string };
  private instanceId: string;
  private isLoading: boolean;
  private messageEl: HTMLParagraphElement;
  private progressionEl: HTMLDivElement;
  private group: Group;
  private groupLocked: Group;
  private width: number;
  private height: number;
  private fullscreen: boolean;
  private gridHelper: GridHelper;
  private gridSize: number;
  private textureFlipY: boolean;
  private wireframe: boolean;
  private stats?: Stats;
  private statsDrawCalls?: Stats.Panel;
  private gui: GUI;
  private guiController: {
    grid: boolean;
    wireframe: boolean;
    custom: { [key: string]: number };
    cameraFit: () => void;
    cameraReset: () => void;
    fullscreenToggle: () => void;
    textureListCallback: () => void;
    exportObj: () => void;
  };
  private guiCustomFolder: GUI;
  private hoveredObject: {
    dummy: Mesh;
    reference: Mesh | null;
  };
  private selectedObject: {
    dummy: Mesh;
    reference: Mesh | null;
  };
  private mousemove: {
    startX: number;
    startY: number;
  };

  constructor(
    threeEl: HTMLDivElement,
    options?: {
      width?: number;
      height?: number;
      camera?: {
        position: [number, number, number];
        target: [number, number, number];
      };
      gridSize?: number;
      textureFlipY?: boolean;
    },
  ) {
    const width = options?.width || 0;
    const height = options?.height || 0;
    const textureFlipY =
      options?.textureFlipY !== undefined ? options?.textureFlipY : true;

    this.debug = get(isDebug);

    this.threeEl = threeEl;

    this.width = width;
    this.height = height;

    this.fullscreen = false;

    this.scene = new Scene();
    this.scene.background = new Color(0x2a3441);

    this.cameraSettings = {
      fov: 40,
      near: 1,
      far: 40000,
      position: options?.camera?.position || [0, 1000, 1500],
      target: options?.camera?.target || [0, 250, 0],
    };

    this.camera = new PerspectiveCamera(
      this.cameraSettings.fov,
      width / height,
      this.cameraSettings.near,
      this.cameraSettings.far,
    );
    this.scene.add(this.camera);

    this.gridSize = options?.gridSize || 1000;

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    this.threeEl.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.resetCamera();

    this.raycaster = new Raycaster();

    // Cache

    this.cache = {};

    // Instance

    this.instanceId = generateUUID();

    // Loading

    this.isLoading = false;

    this.messageEl = document.createElement("p");
    this.messageEl.classList.add("gtc-three-message");
    this.threeEl.appendChild(this.messageEl);

    this.progressionEl = document.createElement("div");
    this.progressionEl.classList.add("gtc-three-progression");
    this.threeEl.appendChild(this.progressionEl);

    const progressionInnerEl = document.createElement("div");
    this.progressionEl.appendChild(progressionInnerEl);

    const progressionNumberEl = document.createElement("p");
    this.progressionEl.appendChild(progressionNumberEl);

    // Groups

    this.group = new Group();
    this.scene.add(this.group);

    this.groupLocked = new Group();
    this.scene.add(this.groupLocked);

    // Lights

    const ambientLight = new AmbientLight(0x7c7c7c, 8.0);
    this.scene.add(ambientLight);

    const light = new DirectionalLight(0xffffff, 8.0);
    light.position.set(0, 1, 0);
    this.scene.add(light);

    // Grid Helper

    this.gridHelper = new GridHelper(this.gridSize, 8);

    const lsGrid = getLocalStorage("threeGrid");

    this.gridHelper.visible = lsGrid !== undefined ? lsGrid === "true" : true;

    this.scene.add(this.gridHelper);

    // Wireframe

    this.wireframe = getLocalStorage("threeWireframe") === "true";

    // Flip Textures

    this.textureFlipY = textureFlipY;

    // Stats

    if (this.debug) {
      this.stats = new Stats();

      this.statsDrawCalls = this.stats.addPanel(
        new Stats.Panel("DC", "#ff8", "#221"),
      );

      this.stats.showPanel(0);

      this.stats.dom.style.position = "absolute";
      this.stats.dom.style.top = "0.5rem";
      this.stats.dom.style.left = "0.5rem";

      this.threeEl.appendChild(this.stats.dom);
    }

    // GUI

    this.guiController = {
      grid: this.gridHelper.visible,
      wireframe: this.wireframe,
      custom: {},
      cameraFit: this.fitCameraToScene.bind(this),
      cameraReset: this.resetCamera.bind(this),
      fullscreenToggle: this.fullscreenToggle.bind(this),
      textureListCallback: () => {},
      exportObj: this.exportObj.bind(this),
    };

    this.gui = new GUI({
      container: this.threeEl,
    });

    this.gui
      .add(this.guiController, "grid")
      .name("Grid")
      .onChange(() => {
        this.gridHelper.visible = this.guiController.grid;
        setLocalStorage("threeGrid", `${this.guiController.grid}`);
      });

    this.gui
      .add(this.guiController, "wireframe")
      .name("Wireframe")
      .onChange(() => {
        this.wireframe = this.guiController.wireframe;
        this.setWireframe(this.guiController.wireframe);
        setLocalStorage("threeWireframe", `${this.guiController.wireframe}`);
      });

    this.gui.onOpenClose((gui) => {
      if (gui.parent === undefined) {
        setLocalStorage("threeGuiClosed", `${gui._closed}`);
      }
    });

    const lsGuiClosed = getLocalStorage("threeGuiClosed");

    if (lsGuiClosed === "true") {
      this.gui.close();
    }

    this.guiCustomFolder = this.gui.addFolder("Custom");
    this.guiCustomFolder.show(false);

    const cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.guiController, "cameraFit").name("Fit to scene (F)");
    cameraFolder.add(this.guiController, "cameraReset").name("Reset (R)");

    const miscellaneousFolder = this.gui.addFolder("Miscellaneous");
    miscellaneousFolder
      .add(this.guiController, "fullscreenToggle")
      .name("Toggle Fullscreen");
    miscellaneousFolder
      .add(this.guiController, "textureListCallback")
      .name("Texture List")
      .hide();

    if (this.debug) {
      miscellaneousFolder
        .add(this.guiController, "exportObj")
        .name("Export OBJ");
    }

    // Dummies

    const hoveredDummy = new Mesh(
      new BufferGeometry(),
      new MeshBasicMaterial({
        color: 0xcccccc,
        wireframe: true,
      }),
    );
    hoveredDummy.visible = false;
    this.scene.add(hoveredDummy);

    this.hoveredObject = {
      dummy: hoveredDummy,
      reference: null,
    };

    const selectedDummy = new Mesh(
      new BufferGeometry(),
      new MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
      }),
    );
    selectedDummy.visible = false;
    this.scene.add(selectedDummy);

    this.selectedObject = {
      dummy: selectedDummy,
      reference: null,
    };

    this.mousemove = {
      startX: 0,
      startY: 0,
    };

    // Event Listeners

    this.threeEl.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.threeEl.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.threeEl.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  public animate(): void {
    if (this.stats) {
      this.stats.begin();
    }

    this.renderer.render(this.scene, this.camera);

    if (this.stats) {
      this.stats.end();
      this.statsDrawCalls!.update(this.renderer.info.render.calls, 1000);
    }
  }

  public setDummy(type: "hover" | "select", reference?: Mesh): void {
    if (this.isLoading) {
      return;
    }

    let object: {
      dummy: Mesh;
      reference: Mesh | null;
    };

    if (type === "hover") {
      object = this.hoveredObject;
    } else {
      object = this.selectedObject;
    }

    if (reference) {
      object.reference = reference;

      const position = new Vector3();
      const quaternion = new Quaternion();
      const scale = new Vector3();

      object.reference.getWorldPosition(position);
      object.reference.getWorldQuaternion(quaternion);
      object.reference.getWorldScale(scale);

      object.dummy.geometry = object.reference.geometry;
      object.dummy.position.copy(position);
      object.dummy.quaternion.copy(quaternion);
      object.dummy.scale.copy(scale);
      object.dummy.visible = true;
    } else {
      object.reference = null;

      object.dummy.visible = false;
    }
  }

  public setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;

    if (this.isLoading) {
      this.controls.enabled = false;
      this.gui.hide();
      this.group.visible = false;
      this.groupLocked.visible = false;
      this.gridHelper.visible = false;
      this.setMessage("Loading...");
      this.updateLoadingProgression(0);
    } else if (
      this.isGroupEmpty(this.group) &&
      this.isGroupEmpty(this.groupLocked)
    ) {
      this.setMessage("The scene is empty");
      this.updateLoadingProgression(-1);
    } else {
      this.controls.enabled = true;
      this.gui.show();
      this.group.visible = true;
      this.groupLocked.visible = true;
      this.gridHelper.visible = this.guiController.grid;
      if (this.wireframe) {
        this.setWireframe(true);
      }
      this.setMessage("");
    }
  }

  public updateLoadingProgression(ratio: number, instanceId?: string): void {
    if (ratio === -1) {
      this.progressionEl.style.display = "none";
    }

    if (instanceId && instanceId !== this.getInstanceId()) {
      return;
    }

    const progressionInnerEl = this.progressionEl.children[0] as HTMLDivElement;
    const progressionNumberEl = this.progressionEl
      .children[1] as HTMLParagraphElement;

    progressionInnerEl.style.width = `${Math.floor(ratio * 100)}%`;
    progressionNumberEl.innerHTML = `${Math.floor(ratio * 100)}%`;
  }

  public setMessage(text: string): void {
    this.messageEl.innerText = text;
    this.progressionEl.style.display = text === "" ? "none" : "block";
  }

  private onMouseDown(event: MouseEvent): void {
    this.mousemove.startX = event.pageX;
    this.mousemove.startY = event.pageY;
  }

  private onMouseMove(event: MouseEvent): void {
    const bounding = this.threeEl.getBoundingClientRect();

    const pointer = new Vector2();

    pointer.x = ((event.clientX - bounding.left) / this.width) * 2 - 1;
    pointer.y = (-(event.clientY - bounding.top) / this.height) * 2 + 1;

    this.raycaster.setFromCamera(pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(
      this.group.children,
      true,
    );

    const intersect = intersects.find(
      (intersect) => "isMesh" in intersect.object,
    );

    if (intersect) {
      const object = intersect.object as Mesh;

      if (this.hoveredObject.reference !== object) {
        this.setDummy("hover", object);
      }
    } else if (this.hoveredObject.reference) {
      this.setDummy("hover");

      this.hoveredObject.reference = null;
    }
  }

  private onMouseUp(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.tagName !== "CANVAS") {
      return;
    }

    const delta = 6;

    const diffX = Math.abs(event.pageX - this.mousemove.startX);
    const diffY = Math.abs(event.pageY - this.mousemove.startY);

    if (diffX < delta && diffY < delta) {
      if (this.hoveredObject.reference) {
        if (this.selectedObject.reference !== this.hoveredObject.reference) {
          this.setDummy("select", this.hoveredObject.reference);

          this.group.traverse((object) => {
            if (
              object === this.hoveredObject.reference &&
              typeof object.userData.onClick === "function"
            ) {
              object.userData.onClick();
            }
          });
        } else {
          this.setDummy("select");

          this.selectedObject.reference = null;
        }
      } else if (this.selectedObject.reference) {
        this.setDummy("select");

        this.selectedObject.reference = null;
      }
    }

    this.updateFitControllerName();
  }

  public getInstanceId(): string {
    return this.instanceId;
  }

  public addGroup(locked = false): Group {
    const group = new Group();

    if (locked) {
      this.groupLocked.add(group);
    } else {
      this.group.add(group);
    }

    return group;
  }

  public addMesh(
    geometry: BufferGeometry,
    material: Material | Material[],
    instanceId: string,
    options?: MeshOptions,
  ): Mesh | null {
    if (instanceId !== this.instanceId) {
      return null;
    }

    const id = options?.id;
    const group = options?.group;
    const locked = options?.locked || false;

    const renderOrder = options?.renderOrder || 0;

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.userData.onClick = options?.onClick;

    if (renderOrder) {
      mesh.renderOrder = renderOrder;
    }

    if (group) {
      group.add(mesh);
    } else if (locked) {
      this.groupLocked.add(mesh);
    } else {
      this.group.add(mesh);
    }

    if (id !== undefined) {
      this.cache[id] = mesh.uuid;
    }

    return mesh;
  }

  public addPoints(
    vertices: number[],
    instanceId: string,
    options?: {
      id?: string;
      group?: Group;
    },
  ): Points | null {
    if (instanceId !== this.instanceId) {
      return null;
    }

    const group = options?.group;

    const geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3),
    );

    const material = new PointsMaterial({
      size: 1,
      sizeAttenuation: false,
    });

    const points = new Points(geometry, material);

    if (group) {
      group.add(points);
    } else {
      this.group.add(points);
    }

    return points;
  }

  public generateGeometry(
    vertices: number[],
    indices: number[],
    uvs: number[],
    options?: GeometryOptions,
  ): BufferGeometry {
    const nonIndexed = options?.nonIndexed || false;
    const smoothAngle = options?.smoothAngle || 0;

    let geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3),
    );

    geometry.setIndex(indices);

    if (nonIndexed) {
      geometry = geometry.toNonIndexed();
    }

    if (uvs.length > 0) {
      geometry.setAttribute(
        "uv",
        new BufferAttribute(new Float32Array(uvs), 2),
      );
    }

    geometry.computeVertexNormals();

    if (nonIndexed && smoothAngle) {
      geometry = toCreasedNormals(geometry, smoothAngle);
    }

    return geometry;
  }

  public generateMaterial(
    options?: MaterialOptions,
  ): MeshBasicMaterial | MeshLambertMaterial {
    const color = options?.color !== undefined ? options?.color : 0xffffff;
    const depthTest =
      options?.depthTest !== undefined ? options?.depthTest : true;
    const model = options?.model || "basic";
    const opacity = options?.opacity !== undefined ? options?.opacity : 1;
    const side = options?.side || "front";
    const texture = {
      base64: options?.texture?.base64 || "",
      repeatX: options?.texture?.repeatX || false,
      repeatY: options?.texture?.repeatY || false,
    };

    const materialParams: MeshBasicMaterialParameters = {
      alphaTest: 0.1,
      depthTest,
      opacity,
      transparent: true,
    };

    switch (side) {
      case "front":
        materialParams.side = FrontSide;
        break;
      case "back":
        materialParams.side = BackSide;
        break;
      case "double":
        materialParams.side = DoubleSide;
        break;
    }

    if (texture.base64) {
      materialParams.map = this.generateMaterialMap(texture);
    } else {
      materialParams.color = color;
    }

    if (model === "lambert") {
      return new MeshLambertMaterial(materialParams);
    }

    return new MeshBasicMaterial(materialParams);
  }

  public generateMaterialMap(options: TextureOptions): Texture {
    const texture = {
      base64: options?.base64 || "",
      repeatX: options?.repeatX || false,
      repeatY: options?.repeatY || false,
    };

    const map = new TextureLoader().load(texture.base64);
    map.colorSpace = SRGBColorSpace;
    map.flipY = this.textureFlipY;
    map.minFilter = NearestFilter;
    map.magFilter = NearestFilter;

    if (texture.repeatX === "mirrored") {
      map.wrapS = MirroredRepeatWrapping;
    } else if (texture.repeatX) {
      map.wrapS = RepeatWrapping;
    }

    if (texture.repeatY === "mirrored") {
      map.wrapT = MirroredRepeatWrapping;
    } else if (texture.repeatY) {
      map.wrapT = RepeatWrapping;
    }

    return map;
  }

  public clone(object: Object3D): Object3D {
    const clone = object.clone();

    this.group.add(clone);

    return clone;
  }

  public cloneCachedMesh(
    id: string,
    instanceId: string,
    group?: Group,
  ): Mesh | null {
    if (instanceId !== this.instanceId) {
      return null;
    }

    if (this.isMeshCached(id)) {
      const cachedMesh = this.group.getObjectByProperty("uuid", this.cache[id]);

      if (cachedMesh) {
        const mesh = cachedMesh.clone() as Mesh;

        if (group) {
          group.add(mesh);
        } else {
          this.group.add(mesh);
        }

        return mesh;
      } else {
        debug.warn(`Mesh ${id} is cached but couldn't be find in scene`);
      }
    } else {
      debug.warn(`Mesh ${id} is not cached`);
    }

    return null;
  }

  public isMeshCached(id: string): boolean {
    return Boolean(this.cache[id]);
  }

  public isGroupEmpty(group: Group): boolean {
    return group.children.length === 0;
  }

  // Adapted from https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24
  public fitCameraToScene(): void {
    const box = new Box3();
    const center = new Vector3();
    const size = new Vector3();

    if (this.isGroupEmpty(this.group)) {
      return;
    }

    if (this.selectedObject.reference) {
      box.expandByObject(this.selectedObject.reference);
    } else {
      box.expandByObject(this.group);
    }

    box.getSize(size);
    box.getCenter(center);

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance =
      maxSize / (2 * Math.atan((Math.PI * this.camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / this.camera.aspect;
    const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = this.controls.target
      .clone()
      .sub(this.camera.position)
      .normalize()
      .multiplyScalar(distance);

    this.controls.target.copy(center);

    this.camera.updateProjectionMatrix();

    this.camera.position.copy(this.controls.target).sub(direction);

    this.controls.update();
  }

  public resetCamera(): void {
    this.camera.near = this.cameraSettings.near;
    this.camera.far = this.cameraSettings.far;
    this.camera.position.set(...this.cameraSettings.position);
    this.camera.updateProjectionMatrix();

    this.controls.target = new Vector3(...this.cameraSettings.target);
    this.controls.update();
  }

  public updateCameraSettings(
    position: [number, number, number],
    target: [number, number, number],
  ): void {
    this.cameraSettings.position = position;
    this.cameraSettings.target = target;
  }

  public isFullscreen(): boolean {
    return this.fullscreen;
  }

  public fullscreenToggle(): void {
    this.fullscreen = !this.fullscreen;

    if (this.fullscreen) {
      this.threeEl.parentElement!.style.setProperty("position", "absolute");
      this.threeEl.parentElement!.style.setProperty("top", "0");
      this.threeEl.parentElement!.style.setProperty("right", "0");
      this.threeEl.parentElement!.style.setProperty("bottom", "0");
      this.threeEl.parentElement!.style.setProperty("left", "0");
    } else {
      this.threeEl.parentElement!.style.setProperty("position", "relative");
      this.threeEl.parentElement!.style.setProperty("top", "inherit");
      this.threeEl.parentElement!.style.setProperty("right", "inherit");
      this.threeEl.parentElement!.style.setProperty("bottom", "inherit");
      this.threeEl.parentElement!.style.setProperty("left", "inherit");
    }

    this.resize();
  }

  public exportObj(): void {
    const exporter = new OBJExporter();

    const data = exporter.parse(this.group, this.textureFlipY);

    const blob = new Blob([data], {
      type: "application/octet-stream",
    });

    FileSaver.saveAs(blob, "object.obj");
  }

  public resize(): void {
    if (this.threeEl.parentElement) {
      const bounding = this.threeEl.parentElement.getBoundingClientRect();

      this.width = this.threeEl.clientWidth;
      this.height = innerHeight - bounding.top - (this.fullscreen ? 16 : 32);

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
    }
  }

  public setTextureListCallback(callback: (() => void) | undefined): void {
    if (callback === undefined) {
      this.gui.folders[2].children[1].hide();
      this.guiController.textureListCallback = () => {};
    } else {
      this.gui.folders[2].children[1].show();
      this.guiController.textureListCallback = callback;
    }
  }

  private dispose(object: Object3D): void {
    if ("isMesh" in object) {
      const mesh = object as Mesh;

      mesh.geometry.dispose();

      const materials = (
        !Array.isArray(mesh.material) ? [mesh.material] : mesh.material
      ) as MeshBasicMaterial[];

      materials.forEach((material) => {
        if (material.map && material.map.isTexture) {
          material.map.dispose();
        }

        material.dispose();
      });
    }
  }

  public resetGui(): void {
    this.guiController.custom = {};
    this.guiController.textureListCallback = () => {};

    Object.values(this.guiCustomFolder.children).forEach((children) => {
      children.destroy();
    });

    this.guiCustomFolder.show(false);
  }

  public addGuiListElement(
    name: string,
    label: string,
    value: number,
    callback: (value: number) => void,
    options = {},
  ): void {
    this.guiCustomFolder.show(true);

    this.guiController.custom[name] = value;

    this.guiCustomFolder
      .add(this.guiController.custom, name, options)
      .name(label)
      .onChange(callback);
  }

  private updateFitControllerName(): void {
    this.gui.folders[1].controllers[0].name(
      `Fit to ${this.selectedObject.reference ? "object" : "scene"} (F)`,
    );
  }

  private setWireframe(wireframe: boolean): void {
    [this.group, this.groupLocked].forEach((group) =>
      group.traverse((object) => {
        if ("isMesh" in object) {
          const mesh = object as Mesh;
          const wireframeObj = mesh.getObjectByName("wireframe");

          if (wireframe && !wireframeObj) {
            const geometry = new WireframeGeometry(mesh.geometry);
            const material = new LineBasicMaterial({
              color: 0xffffff,
            });

            const wireframe = new LineSegments(geometry, material);

            wireframe.name = "wireframe";

            mesh.add(wireframe);
          } else if (!wireframe && wireframeObj) {
            mesh.remove(wireframeObj);
          }
        }
      }),
    );
  }

  public reset(): void {
    this.resetCamera();

    this.cache = {};

    this.instanceId = generateUUID();

    this.hoveredObject.dummy.visible = false;
    this.hoveredObject.reference = null;

    this.selectedObject.dummy.visible = false;
    this.selectedObject.reference = null;

    this.group.traverse((object) => this.dispose(object));
    this.group.remove(...this.group.children);

    this.groupLocked.traverse((object) => this.dispose(object));
    this.groupLocked.remove(...this.groupLocked.children);

    this.updateFitControllerName();

    this.resetGui();
  }

  public destroy(): void {
    this.reset();
    this.controls.dispose();
    this.gui.destroy();
    this.renderer.dispose();
    this.scene.clear();

    this.threeEl.removeEventListener("mousedown", this.onMouseDown);
    this.threeEl.removeEventListener("mousemove", this.onMouseMove);
    this.threeEl.removeEventListener("mouseup", this.onMouseUp);
  }
}
