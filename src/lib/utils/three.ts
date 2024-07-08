import {
  AmbientLight,
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group,
  Mesh,
  MeshBasicMaterial,
  type MeshBasicMaterialParameters,
  MeshLambertMaterial,
  MirroredRepeatWrapping,
  NearestFilter,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils";
import { generateUUID } from "three/src/math/MathUtils";

import { isDebug } from "$lib/stores";

import debug from "./debug";
import { getLocalStorage, setLocalStorage } from "./format";

export interface GeometryOptions {
  nonIndexed?: boolean;
  smoothAngle?: number;
}

export interface MaterialOptions {
  color?: number;
  depthTest?: boolean;
  doubleSide?: boolean;
  model?: "basic" | "lambert";
  texture?: {
    base64?: string;
    flipY?: boolean;
    repeatX?: boolean | "mirrored";
    repeatY?: boolean | "mirrored";
    opacity?: number;
  };
}

export default class Three {
  private threeEl: HTMLDivElement;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private raycaster: Raycaster;
  private cache: { [id: string]: string };
  private instanceId: string;
  private isLoading: boolean;
  private message: HTMLParagraphElement;
  private group: Group;
  private groupLocked: Group;
  private width: number;
  private height: number;
  private gridHelper: GridHelper;
  private wireframe: boolean;
  private gui: GUI;
  private guiController: {
    grid: boolean;
    wireframe: boolean;
    cameraFit: () => void;
    cameraReset: () => void;
  };
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
    },
  ) {
    const width = options?.width || 0;
    const height = options?.height || 0;

    this.threeEl = threeEl;

    this.width = width;
    this.height = height;

    this.scene = new Scene();
    this.scene.background = new Color(0x2a3441);

    this.camera = new PerspectiveCamera(40, width / height, 1, 40000);
    this.scene.add(this.camera);

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

    this.message = document.createElement("p");
    this.message.classList.add("gtc-three-message");
    this.threeEl.appendChild(this.message);

    // Groups

    this.group = new Group();
    this.scene.add(this.group);

    this.groupLocked = new Group();
    this.scene.add(this.groupLocked);

    // Lights

    const ambientLight = new AmbientLight(0x7c7c7c, 3.0);
    this.scene.add(ambientLight);

    const light = new DirectionalLight(0xffffff, 3.0);
    light.position.set(0, 1, 0);
    this.scene.add(light);

    // Grid Helper

    this.gridHelper = new GridHelper(1000, 8);

    const lsGrid = getLocalStorage("threeGrid");

    this.gridHelper.visible = lsGrid !== undefined ? lsGrid === "true" : true;

    this.scene.add(this.gridHelper);

    // Wireframe

    this.wireframe = getLocalStorage("threeWireframe") === "true";

    // GUI

    this.guiController = {
      grid: this.gridHelper.visible,
      wireframe: this.wireframe,
      cameraFit: this.fitCameraToScene.bind(this),
      cameraReset: this.resetCamera.bind(this),
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
        [this.group, this.groupLocked].forEach((group) =>
          group.traverse((object) => {
            this.setWireframe(object, this.guiController.wireframe);
          }),
        );

        this.wireframe = this.guiController.wireframe;
        setLocalStorage("threeWireframe", `${this.guiController.wireframe}`);
      });

    const cameraFolder = this.gui.addFolder("Camera");
    cameraFolder.add(this.guiController, "cameraFit").name("Fit");
    cameraFolder.add(this.guiController, "cameraReset").name("Reset");

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
    this.renderer.render(this.scene, this.camera);
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

      object.dummy.geometry = object.reference.geometry;
      object.dummy.position.copy(object.reference.position);
      object.dummy.rotation.copy(object.reference.rotation);
      object.dummy.scale.copy(object.reference.scale);
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
      this.gridHelper.visible = false;

      this.setMessage("Loading...");
    } else if (
      this.isGroupEmpty(this.group) &&
      this.isGroupEmpty(this.groupLocked)
    ) {
      this.setMessage("The scene is empty");
    } else {
      this.controls.enabled = true;
      this.gui.show();
      this.group.visible = true;
      this.gridHelper.visible = this.guiController.grid;
      this.setMessage("");
    }
  }

  public setMessage(text: string): void {
    this.message.innerText = text;
  }

  private onMouseDown(event: MouseEvent): void {
    this.mousemove.startX = event.pageX;
    this.mousemove.startY = event.pageY;
  }

  private onMouseMove(event: MouseEvent): void {
    const bounding = this.threeEl.getBoundingClientRect();

    let pointer = new Vector2();

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
    const delta = 6;

    const diffX = Math.abs(event.pageX - this.mousemove.startX);
    const diffY = Math.abs(event.pageY - this.mousemove.startY);

    if (diffX < delta && diffY < delta) {
      if (this.hoveredObject.reference) {
        if (this.selectedObject.reference !== this.hoveredObject.reference) {
          this.setDummy("select", this.hoveredObject.reference);

          if (isDebug) {
            this.group.children.forEach((child, index) => {
              if (child === this.hoveredObject.reference) {
                console.log({
                  index,
                  position: {
                    x: child.position.x,
                    y: child.position.y,
                    z: child.position.z,
                  },
                  rotation: {
                    x: Math.round((child.rotation.x / (2 * Math.PI)) * 360),
                    y: Math.round((child.rotation.y / (2 * Math.PI)) * 360),
                    z: Math.round((child.rotation.z / (2 * Math.PI)) * 360),
                  },
                  scale: {
                    x: child.scale.x,
                    y: child.scale.y,
                    z: child.scale.z,
                  },
                });
              }
            });
          }
        } else {
          this.setDummy("select");

          this.selectedObject.reference = null;
        }
      } else if (this.selectedObject.reference) {
        this.setDummy("select");

        this.selectedObject.reference = null;
      }
    }
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
    vertices: number[],
    indices: number[],
    uvs: number[],
    instanceId: string,
    options?: {
      id?: string;
      group?: Group;
      locked?: boolean;
      renderLast?: boolean;
      geometry?: GeometryOptions;
      material?: MaterialOptions | MaterialOptions[];
    },
  ): Mesh | null {
    if (instanceId !== this.instanceId) {
      return null;
    }

    const id = options?.id;
    const group = options?.group;
    const locked = options?.locked || false;
    const renderLast = options?.renderLast || false;

    const geometry = this.generateGeometry(
      vertices,
      indices,
      uvs,
      options?.geometry,
    );

    let material;

    if (Array.isArray(options?.material)) {
      material = [];

      options?.material.forEach((option, index) => {
        geometry.addGroup(index * 6, 6, index);

        material.push(
          this.generateMaterial({
            ...option,
            depthTest: !renderLast,
          }),
        );
      });
    } else {
      material = this.generateMaterial({
        ...options?.material,
        depthTest: !renderLast,
      });
    }

    const mesh = new Mesh(geometry, material);
    mesh.receiveShadow = true;

    if (renderLast) {
      mesh.renderOrder = -1;
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

    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));

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
    const doubleSide = options?.doubleSide || false;
    const model = options?.model || "basic";
    const texture = {
      base64: options?.texture?.base64 || "",
      flipY:
        options?.texture?.flipY !== undefined ? options?.texture?.flipY : true,
      repeatX: options?.texture?.repeatX || false,
      repeatY: options?.texture?.repeatY || false,
      opacity: options?.texture?.opacity || 1,
    };

    let materialParams: MeshBasicMaterialParameters = {
      alphaTest: 0.1,
      depthTest,
      opacity: texture.opacity,
      transparent: true,
      wireframe: this.wireframe,
    };

    if (doubleSide) {
      materialParams.side = DoubleSide;
    }

    if (texture.base64) {
      const map = new TextureLoader().load(texture.base64);
      map.flipY = texture.flipY;
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

      materialParams.map = map;
    } else {
      materialParams.color = color;
    }

    if (model === "lambert") {
      return new MeshLambertMaterial(materialParams);
    }

    return new MeshBasicMaterial(materialParams);
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

    this.camera.near = distance / 100;
    this.camera.far = distance * 100;
    this.camera.updateProjectionMatrix();

    this.camera.position.copy(this.controls.target).sub(direction);

    this.controls.update();
  }

  public resetCamera(): void {
    this.camera.near = 1;
    this.camera.far = 40000;
    this.camera.position.set(0, 1000, 1500);
    this.camera.updateProjectionMatrix();

    this.controls.target = new Vector3(0, 250, 0);
    this.controls.update();
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
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

  private setWireframe(object: Object3D, wireframe: boolean): void {
    if ("isMesh" in object) {
      const mesh = object as Mesh;

      const materials = (
        !Array.isArray(mesh.material) ? [mesh.material] : mesh.material
      ) as MeshBasicMaterial[];

      materials.forEach((material) => {
        material.wireframe = wireframe;
      });
    }
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
  }

  public destroy(): void {
    this.reset();
    this.gui.destroy();
    this.renderer.dispose();
    this.scene.clear();

    this.threeEl.removeEventListener("mousedown", this.onMouseDown);
    this.threeEl.removeEventListener("mousemove", this.onMouseMove);
    this.threeEl.removeEventListener("mouseup", this.onMouseUp);
  }
}
