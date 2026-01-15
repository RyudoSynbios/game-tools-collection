import { Application } from "@pixi/app";
import {
  BaseTexture,
  BufferResource,
  extensions,
  Filter,
  Texture,
} from "@pixi/core";
import { Container } from "@pixi/display";
import "@pixi/events";
import { Extract } from "@pixi/extract";
import { Sprite } from "@pixi/sprite";
import { TilingSprite } from "@pixi/sprite-tiling";

import debug from "$lib/utils/debug";

import highlightArea from "./fragments/highlightArea";

export type Axis = "x" | "y";

type LayerType = "image" | "sprites" | "tilingSprite";

interface Animation {
  axis: Axis;
  speed: number;
}

interface FilterArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface Layer {
  type: LayerType;
  width: number;
  height: number;
  datas: Uint8Array[];
  container: Container;
  animation?: Animation;
}

extensions.add(Extract);

export default class Canvas {
  private app: Application;
  private width: number;
  private height: number;
  private scale: number;
  private animation: boolean;
  private filter: boolean;
  private filterArea: FilterArea;
  private layers: { [key: string]: Layer };

  constructor(options?: {
    canvasEl?: HTMLDivElement;
    width?: number;
    height?: number;
    scale?: number;
    backgroundAlpha?: number;
    animation?: boolean;
    filter?: boolean;
  }) {
    const canvasEl = options?.canvasEl;
    const width = options?.width || 0;
    const height = options?.height || 0;
    const scale = options?.scale || 1;
    const backgroundAlpha = options?.backgroundAlpha || 0;
    const animation =
      options?.animation !== undefined ? options?.animation : true;
    const filter = options?.filter !== undefined ? options?.filter : false;

    this.width = width;
    this.height = height;
    this.scale = scale;
    this.layers = {};
    this.animation = animation;
    this.filter = filter;
    this.filterArea = { width: 0, height: 0, x: 0, y: 0 };

    this.app = new Application({
      width,
      height,
      backgroundAlpha,
      resolution: this.scale,
    });

    this.app.stage.sortableChildren = true;

    this.app.ticker.add((delta) => {
      if (this.animation) {
        Object.values(this.layers).forEach((layer) => {
          if (layer.type === "tilingSprite" && layer.animation) {
            const tilingSprite = layer.container.getChildAt(0) as TilingSprite;

            tilingSprite.tilePosition[layer.animation.axis] +=
              layer.animation.speed * delta;
          }
        });
      }
    });

    this.reset();

    if (canvasEl) {
      canvasEl.appendChild(this.app.view as any);
    }
  }

  public addLayer(
    key: string,
    type: LayerType,
    options?: {
      width?: number;
      height?: number;
      animation?: Animation;
      hidden?: boolean;
      order?: number;
    },
  ): void {
    if (!["image", "sprites", "tilingSprite"].includes(type)) {
      debug.warn(`The type '${type}' is not available`);
      return;
    }

    const width = options?.width || 0;
    const height = options?.height || 0;
    const animation = options?.animation;
    const hidden = options?.hidden || false;
    const order = options?.order || 0;

    const container = new Container();

    container.visible = !hidden;
    container.zIndex = order;

    if (type === "image") {
      container.addChild(new Sprite());

      this.layers[key] = {
        type,
        width: this.width,
        height: this.height,
        datas: [new Uint8Array(this.width * this.height * 4)],
        container,
        animation,
      };
    } else if (type === "sprites") {
      this.layers[key] = {
        type,
        width,
        height,
        datas: [],
        container,
        animation,
      };
    } else if (type === "tilingSprite") {
      container.addChild(
        new TilingSprite(Texture.EMPTY, this.width, this.height),
      );

      this.layers[key] = {
        type,
        width,
        height,
        datas: [new Uint8Array(width * height * 4)],
        container,
        animation,
      };
    }

    this.app.stage.addChild(container);
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
      this.layers[key].container.visible = false;
    }
  }

  public showLayer(key: string): void {
    if (this.layers[key]) {
      this.layers[key].container.visible = true;
    }
  }

  public getLayerVisibility(key: string): boolean {
    if (this.layers[key]) {
      return this.layers[key].container.visible;
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
      this.layers[key].animation = undefined;
    }
  }

  public changeLayerOpacity(key: string, opacity: number) {
    if (this.layers[key]) {
      this.layers[key].container.alpha = opacity;
    }
  }

  public changeLayerOrder(layers: string[]) {
    layers.forEach((key, index) => {
      if (this.layers[key]) {
        this.layers[key].container.zIndex = index;
      }
    });
  }

  // TODO: Handle cache (add optional id on addGraphic)
  public addGraphic(
    layer: string,
    data: Uint8Array,
    width: number,
    height: number,
    x = 0,
    y = 0,
  ): void {
    if (!data || data.length === 0) {
      debug.error("Data field is empty");
      return;
    }

    const split = layer.split(".");

    layer = split[0];

    const spriteIndex = split[1] ? parseInt(split[1]) : 0;

    if (!this.layers[layer]) {
      debug.error("This layer doesn't exists");
      return;
    }

    const lineSize = width * 4;

    let graphicWidth = this.layers[layer].width;
    const graphicHeight = this.layers[layer].height;

    if (this.layers[layer].type === "sprites") {
      const sprite = this.layers[layer].container.getChildAt(spriteIndex) as
        | Sprite
        | TilingSprite;

      graphicWidth = sprite.width;
    }

    let truncateStartX = 0;
    let truncateEndX = 0;
    let truncateStartY = 0;
    let truncateEndY = 0;

    if (x < 0 || x + width > graphicWidth) {
      debug.warn(
        `Tried to draw outside of width bounds: ${
          x < 0 ? x : x + width
        }px > ${graphicWidth}px`,
      );

      truncateStartX = Math.abs(Math.min(x, 0));
      truncateEndX = Math.abs(Math.min(graphicWidth - (x + width), 0));
    }

    if (y < 0 || y + height > graphicHeight) {
      debug.warn(
        `Tried to draw outside of height bounds: ${
          y < 0 ? y : y + height
        }px > ${graphicHeight}px`,
      );

      truncateStartY = Math.abs(Math.min(y, 0));
      truncateEndY = Math.abs(Math.min(graphicHeight - (y + height), 0));
    }

    for (let line = truncateStartY; line < height - truncateEndY; line += 1) {
      const start = line * lineSize;
      const end = (line + 1) * lineSize;
      const offset = x * 4 + y * graphicWidth * 4 + line * graphicWidth * 4;

      if (
        offset + end - start <=
        this.layers[layer].datas[spriteIndex].length
      ) {
        const slice = new Uint8Array(data.slice(start, end));

        for (let i = truncateStartX; i < width - truncateEndX; i += 1) {
          const subStart = i * 4;
          const subEnd = (i + 1) * 4;

          this.layers[layer].datas[spriteIndex].set(
            slice.slice(subStart, subEnd),
            offset + i * 4,
          );
        }
      }
    }
  }

  public addSprite(
    layer: string,
    width: number,
    height: number,
    x: number,
    y: number,
    events?: { [key: string]: () => void },
  ) {
    if (!this.layers[layer]) {
      debug.error("This layer doesn't exists");
      return;
    }

    if (this.layers[layer].type !== "sprites") {
      debug.error("This layer is not a sprites type");
      return;
    }

    this.layers[layer].datas.push(new Uint8Array(width * height * 4));

    const sprite = new Sprite();

    sprite.width = width;
    sprite.height = height;
    sprite.position.x = x;
    sprite.position.y = y;

    if (events) {
      Object.entries(events).forEach(([key, callback]) => {
        sprite.cursor = "pointer";
        sprite.eventMode = "static";
        sprite.on(key, callback);
      });
    }

    this.layers[layer].container.addChild(sprite);
  }

  public defineHighlightArea(
    width: number,
    height: number,
    x: number,
    y: number,
  ) {
    const filter = new Filter(undefined, highlightArea, {
      uRect: new Float32Array([x, y, width, height]),
      uResolution: new Float32Array([
        this.app.renderer.width,
        this.app.renderer.height,
      ]),
      uDarkness: 0.5,
    });

    this.filterArea = { width, height, x, y };

    if (this.filter) {
      this.app.stage.filters = [filter];
    }
  }

  public enableFilter() {
    this.filter = true;

    this.defineHighlightArea(
      this.filterArea.width,
      this.filterArea.height,
      this.filterArea.x,
      this.filterArea.y,
    );
  }

  public disableFilter() {
    this.app.stage.filters = null;
    this.filter = false;
  }

  public getFilterStatus(): boolean {
    return this.filter;
  }

  public reset() {
    Object.values(this.layers).forEach((layer) => {
      switch (layer.type) {
        case "image":
          layer.width = this.width;
          layer.height = this.height;
          layer.datas = [new Uint8Array(this.width * this.height * 4)];
          break;

        case "sprites":
          layer.width = this.width;
          layer.height = this.height;
          layer.datas = [];
          layer.container.children.forEach((child) => child.destroy());
          break;

        case "tilingSprite":
          layer.datas = [new Uint8Array(layer.width * layer.height * 4)];

          const tilingSprite = layer.container.getChildAt(0) as TilingSprite;

          tilingSprite.width = this.width;
          tilingSprite.height = this.height;
          break;
      }
    });
  }

  public exportGraphicData(layer: string): Uint8Array {
    if (!this.layers[layer]) {
      debug.error("This layer doesn't exists");
      return new Uint8Array();
    }

    return this.layers[layer].datas[0];
  }

  public resize(width: number, height: number) {
    this.width = width || 1;
    this.height = height || 1;

    this.reset();

    this.app.renderer.resize(width, height);
  }

  public render(): void {
    Object.values(this.layers).forEach((layer) => {
      layer.container.children.forEach((displayObject, index) => {
        const sprite = displayObject as Sprite | TilingSprite;

        const width = layer.type === "sprites" ? sprite.width : layer.width;
        const height = layer.type === "sprites" ? sprite.height : layer.height;

        const baseTexture = new BaseTexture(
          new BufferResource(layer.datas[index], { width, height }),
          { scaleMode: 0 },
        );

        const texture = Texture.from(baseTexture);

        sprite.texture = texture;
      });
    });
  }

  public async export(): Promise<string> {
    this.render();

    return await this.app.renderer.extract.base64(this.app.stage);
  }

  public destroy(): void {
    Object.values(this.layers).forEach((object) => object.container.destroy());

    this.layers = {};

    this.app.destroy();
  }
}
