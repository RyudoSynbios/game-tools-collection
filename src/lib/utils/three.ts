import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  GridHelper,
  Group,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  type MeshBasicMaterialParameters,
  MirroredRepeatWrapping,
  NearestFilter,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class Three {
  private scene: Scene;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private group: Group;
  private groupWireframe: Group;
  private width: number;
  private height: number;
  private gridHelper: GridHelper;
  private wireframe: boolean;

  constructor(
    threeEl: HTMLDivElement,
    options?: {
      width?: number;
      height?: number;
      wireframe?: boolean;
      gridHelper?: boolean;
    },
  ) {
    const width = options?.width || 0;
    const height = options?.height || 0;
    const gridHelper = options?.gridHelper || false;
    const wireframe = options?.wireframe || false;

    this.width = width;
    this.height = height;
    this.wireframe = wireframe;

    this.scene = new Scene();
    this.scene.background = new Color(0x2a3441);

    this.camera = new PerspectiveCamera(40, width / height, 1, 40000);
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);

    threeEl.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.resetCamera();

    this.group = new Group();
    this.scene.add(this.group);

    this.groupWireframe = new Group();
    this.scene.add(this.groupWireframe);

    this.gridHelper = new GridHelper(1000, 8);

    if (!gridHelper) {
      this.gridHelper.visible = false;
    }

    this.scene.add(this.gridHelper);
  }

  public addMesh(
    vertices: number[],
    indices: number[],
    uvs: number[],
    options?: {
      color?: number;
      texture?: string;
      textureRepeatX?: boolean | "mirrored";
      textureRepeatY?: boolean | "mirrored";
      opacity?: number;
    },
  ): void {
    const color = options?.color !== undefined ? options?.color : 0xffffff;
    const texture = options?.texture || "";
    const textureRepeatX = options?.textureRepeatX || false;
    const textureRepeatY = options?.textureRepeatY || false;
    const opacity = options?.opacity || 1;

    const geometry = new BufferGeometry();

    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(vertices), 3),
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));

    let material: MeshBasicMaterialParameters = {
      alphaTest: 0.1,
      opacity,
      transparent: true,
    };

    if (texture) {
      const map = new TextureLoader().load(texture);
      map.flipY = false;
      map.minFilter = NearestFilter;
      map.magFilter = NearestFilter;

      if (textureRepeatX === "mirrored") {
        map.wrapS = MirroredRepeatWrapping;
      } else if (textureRepeatX) {
        map.wrapS = RepeatWrapping;
      }

      if (textureRepeatY === "mirrored") {
        map.wrapT = MirroredRepeatWrapping;
      } else if (textureRepeatY) {
        map.wrapT = RepeatWrapping;
      }

      material.map = map;
    } else {
      material.color = color;
    }

    const mesh = new Mesh(geometry, new MeshBasicMaterial(material));

    this.group.add(mesh);

    const wireframe = new WireframeGeometry(geometry);
    const lineSegments = new LineSegments(wireframe);

    if (!this.wireframe) {
      this.groupWireframe.visible = false;
    }

    this.groupWireframe.add(lineSegments);
  }

  public isEmpty(): boolean {
    return this.group.children.length === 0;
  }

  public hideGridHelper(): void {
    this.gridHelper.visible = false;
  }

  public showGridHelper(): void {
    this.gridHelper.visible = true;
  }

  public getGridHelperStatus(): boolean {
    return this.gridHelper.visible;
  }

  public hideWireframe(): void {
    this.groupWireframe.visible = false;
    this.wireframe = false;
  }

  public showWireframe(): void {
    this.groupWireframe.visible = true;
    this.wireframe = true;
  }

  public getWireframeStatus(): boolean {
    return this.wireframe;
  }

  // Adapted from https://discourse.threejs.org/t/camera-zoom-to-fit-object/936/24
  public fitCameraToScene(): void {
    const box = new Box3();
    const center = new Vector3();
    const size = new Vector3();

    if (this.isEmpty()) {
      return;
    }

    box.expandByObject(this.group);
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
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  public reset(): void {
    this.resetCamera();

    [...this.group.children, ...this.groupWireframe.children].forEach(
      (object) => {
        if ("isMesh" in object) {
          const mesh = object as Mesh;

          mesh.geometry.dispose();

          const basicMaterial = mesh.material as MeshBasicMaterial;

          if (Array.isArray(basicMaterial)) {
            basicMaterial.forEach((material) => {
              material.dispose();
            });
          } else {
            if (basicMaterial.map && basicMaterial.map.isTexture) {
              basicMaterial.map.dispose();
            }

            basicMaterial.dispose();
          }
        }
      },
    );

    this.group.remove(...this.group.children);
    this.groupWireframe.remove(...this.groupWireframe.children);
  }

  public destroy(): void {
    this.reset();
    this.renderer.dispose();
    this.scene.clear();
  }
}
