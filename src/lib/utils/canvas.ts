import { Application } from "@pixi/app";
import { BaseTexture, BufferResource, Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";

export type Axis = "x" | "y";
type LayerType = "image" | "sprite" | "tilingSprite";

interface Animation {
  axis: Axis;
  speed: number;
}

interface Layer {
  type: LayerType;
  width: number;
  height: number;
  data: Uint8Array;
  sprite: Sprite | TilingSprite;
  animation: Animation | null;
}

export class Canvas {
  private app: Application;
  private width: number;
  private height: number;
  private scale: number;
  private animation: boolean;
  private layers: { [key: string]: Layer };

  constructor(
    canvasEl: any,
    options?: {
      width?: number;
      height?: number;
      scale?: number;
      backgroundAlpha?: number;
      animation?: boolean;
    },
  ) {
    const width = options?.width || 0;
    const height = options?.height || 0;
    const scale = options?.scale || 1;
    const backgroundAlpha = options?.backgroundAlpha || 0;
    const animation =
      options?.animation !== undefined ? options?.animation : true;

    this.width = width;
    this.height = height;
    this.scale = scale;
    this.layers = {};
    this.animation = animation;

    this.app = new Application({
      width,
      height,
      backgroundAlpha,
      resolution: scale,
    });

    this.app.ticker.add((delta) => {
      if (this.animation) {
        Object.values(this.layers).forEach((layer) => {
          if (layer.type === "tilingSprite" && layer.animation) {
            (layer.sprite as TilingSprite).tilePosition[layer.animation.axis] +=
              layer.animation.speed * delta;
          }
        });
      }
    });

    this.reset();

    canvasEl.appendChild(this.app.view as any);
  }

  public addLayer(
    key: string,
    type: LayerType,
    options?: {
      width?: number;
      height?: number;
      animation?: Animation;
      hidden?: boolean;
    },
  ): void {
    if (!["image", "sprite", "tilingSprite"].includes(type)) {
      console.warn(`The type '${type}' is not available`);

      return;
    }

    const width = options?.width || 0;
    const height = options?.height || 0;
    const animation = options?.animation || null;
    const hidden = options?.hidden || false;

    if (type === "image") {
      this.layers[key] = {
        type,
        width: this.width,
        height: this.height,
        data: new Uint8Array(this.width * this.height * 4),
        sprite: new Sprite(),
        animation,
      };
    } else if (type === "sprite") {
      this.layers[key] = {
        type,
        width,
        height,
        data: new Uint8Array(width * height * 4),
        sprite: new Sprite(),
        animation,
      };
    } else if (type === "tilingSprite") {
      this.layers[key] = {
        type,
        width,
        height,
        data: new Uint8Array(width * height * 4),
        sprite: new TilingSprite(Texture.EMPTY, this.width, this.height),
        animation,
      };
    }

    if (hidden) {
      this.layers[key].sprite.visible = false;
    }

    this.app.stage.addChild(this.layers[key].sprite);
  }

  public enableAnimation(): void {
    this.animation = true;
  }

  public disableAnimation(): void {
    this.animation = false;
  }

  public getAnimationStatus(): boolean {
    return this.animation;
  }

  public hideLayer(key: string): void {
    if (this.layers[key]) {
      this.layers[key].sprite.visible = false;
    }
  }

  public showLayer(key: string): void {
    if (this.layers[key]) {
      this.layers[key].sprite.visible = true;
    }
  }

  public getLayerVisibility(key: string): boolean {
    if (this.layers[key]) {
      return this.layers[key].sprite.visible;
    }

    return false;
  }

  public startLayerAnimation(key: string, animation: Animation): void {
    if (this.layers[key]) {
      this.layers[key].animation = animation;
    }
  }

  public stopLayerAnimation(key: string): void {
    if (this.layers[key]) {
      this.layers[key].animation = null;
    }
  }

  public changeLayerOpacity(key: string, opacity: number) {
    if (this.layers[key]) {
      this.layers[key].sprite.alpha = opacity;
    }
  }

  // TODO: Handle cache (add optional id on addTitle)
  public addTile(
    layer: string,
    data: Uint8Array,
    width: number,
    height: number,
    x = 0,
    y = 0,
    manipulations = {
      flipHorizontal: false,
    },
  ): void {
    if (!this.layers[layer]) {
      console.error("This layer doesn't exists");

      return;
    }

    const lineSize = width * 4;

    for (let line = 0; line < height; line += 1) {
      const start = line * lineSize;
      const end = (line + 1) * lineSize;
      const offset =
        x * 4 +
        y * this.layers[layer].width * 4 +
        line * this.layers[layer].width * 4;

      if (offset + end - start <= this.layers[layer].data.length) {
        const slice = new Uint8Array(data.slice(start, end));

        for (let i = 0; i < width; i += 1) {
          const subStart = i * 4;
          const subEnd = (i + 1) * 4;

          if (slice[subStart + 0x3] > 0x0) {
            let subOffset = offset + i * 4;

            if (manipulations.flipHorizontal) {
              subOffset = offset + lineSize - (i + 1) * 4;
            }

            this.layers[layer].data.set(
              slice.slice(subStart, subEnd),
              subOffset,
            );
          }
        }
      }
    }
  }

  public reset() {
    Object.keys(this.layers).forEach((key) => {
      if (this.layers[key].type === "image") {
        this.layers[key].width = this.width;
        this.layers[key].height = this.height;
        this.layers[key].data = new Uint8Array(this.width * this.height * 4);
      } else if (this.layers[key].type === "sprite") {
        this.layers[key].data = new Uint8Array(
          this.layers[key].width * this.layers[key].height * 4,
        );
      } else if (this.layers[key].type === "tilingSprite") {
        this.layers[key].data = new Uint8Array(
          this.layers[key].width * this.layers[key].height * 4,
        );

        this.layers[key].sprite.width = this.width;
        this.layers[key].sprite.height = this.height;
      }
    });
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.reset();

    // TODO: Take account of resolution

    this.app.renderer.resize(width, height);
  }

  public render(): void {
    Object.keys(this.layers).forEach((key) => {
      const baseTexture = new BaseTexture(
        new BufferResource(this.layers[key].data, {
          width: this.layers[key].width,
          height: this.layers[key].height,
        }),
        { scaleMode: 0 },
      );

      const texture = Texture.from(baseTexture);

      this.layers[key].sprite.texture = texture;
    });
  }

  public destroy(): void {
    Object.values(this.layers).forEach((object) => object.sprite.destroy());

    this.layers = {};

    this.app.destroy();
  }
}
