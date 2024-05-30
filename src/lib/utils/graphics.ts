import { BufferAttribute, type BufferGeometry, Vector3 } from "three";

import { getInt } from "$lib/utils/bytes";

import type { Palette } from "$lib/types";

export function getPalette15Bit(
  offset: number,
  length: number,
  transparent = false,
): Palette {
  const palette = [];

  for (let i = 0x0; i < length; i += 0x1) {
    const color = getInt(offset + i * 0x2, "uint16");

    const red = (color & 0x1f) << 0x3;
    const green = ((color >> 0x5) & 0x1f) << 0x3;
    const blue = ((color >> 0xa) & 0x1f) << 0x3;
    const alpha = transparent && i === 0x0 ? 0 : 255;

    palette.push([red, green, blue, alpha]);
  }

  return palette;
}

export function convertPaletteMegaDrive(
  rawPalette: number[],
  transparent = false,
): Palette {
  const palette: number[][] = [];

  rawPalette.forEach((color, index) => {
    let red = color & 0xf;
    let green = (color & 0xf0) >> 0x4;
    let blue = (color & 0xf00) >> 0x8;

    const alpha = transparent && index === 0x0 ? 0x0 : 0xff;

    red = (red << 0x4) | red;
    green = (green << 0x4) | green;
    blue = (blue << 0x4) | blue;

    palette.push([red, green, blue, alpha]);
  });

  return palette;
}

export function flipTileData(
  data: number[],
  width: number,
  axis: "x" | "y",
): number[] {
  const flippedData = [];

  if (axis === "x") {
    for (let i = 0; i < data.length; i += width) {
      flippedData.push(...data.slice(i, i + width).reverse());
    }
  } else if (axis === "y") {
    for (let i = data.length; i > 0; i -= width) {
      flippedData.push(...data.slice(i - width, i));
    }
  }

  return flippedData;
}

export function flipUvs(uvs: number[], axis: "x" | "y"): number[] {
  return uvs.map((uv, index) => {
    if (
      (axis === "x" && index % 2 === 0) ||
      (axis === "y" && index % 2 !== 0)
    ) {
      uv ^= 1;
    }

    return uv;
  });
}

export function applyPalette(
  data: number[] | Uint8Array,
  palette: Palette,
): Uint8Array {
  const tileData = new Uint8Array(data.length * 4);

  data.forEach((paletteIndex, index) => {
    const color = palette[paletteIndex];

    if (color.length > 0) {
      tileData[index * 4 + 0] = color[0]; // Red
      tileData[index * 4 + 1] = color[1]; // Green
      tileData[index * 4 + 2] = color[2]; // Blue
      tileData[index * 4 + 3] = color[3]; // Alpha
    }
  });

  return tileData;
}

interface GraphicsSheet {
  width: number;
  height: number;
  coordinates: Coordinates[];
}

interface Coordinates {
  x: number;
  y: number;
}

export function generateGraphicsSheet(
  width: number,
  images: { width: number; height: number }[],
): GraphicsSheet {
  const sheet: GraphicsSheet = {
    width,
    height: 1,
    coordinates: [],
  };

  let previousY = 0;

  images.forEach((image, index) => {
    let x =
      index > 0 ? sheet.coordinates[index - 1].x + images[index - 1].width : 0;
    let y = previousY;

    if (x + image.width > sheet.width) {
      x = 0;
      y = sheet.height;
      previousY = sheet.height;
    }

    sheet.coordinates.push({ x, y });

    if (!width && image.width > width) {
      sheet.width = image.width;
    }

    if (y + image.height > sheet.height) {
      sheet.height = y + image.height;
    }
  });

  return sheet;
}

// Adapted from Three.BufferGeometryUtils (import of this library causes troubles)
export function toCreasedNormals(
  geometry: BufferGeometry,
  creaseAngle = Math.PI / 3,
) {
  const creaseDot = Math.cos(creaseAngle);
  const hashMultiplier = (1 + 1e-10) * 100;
  const verts = [new Vector3(), new Vector3(), new Vector3()];
  const tempVec1 = new Vector3();
  const tempVec2 = new Vector3();
  const tempNorm = new Vector3();
  const tempNorm2 = new Vector3();

  function hashVertex(v: Vector3) {
    const x = ~~(v.x * hashMultiplier);
    const y = ~~(v.y * hashMultiplier);
    const z = ~~(v.z * hashMultiplier);

    return `${x},${y},${z}`;
  }

  const resultGeometry = geometry.index ? geometry.toNonIndexed() : geometry;
  const posAttr = resultGeometry.attributes.position;
  const vertexMap: any = {};

  for (let i = 0, l = posAttr.count / 3; i < l; i++) {
    const i3 = 3 * i;
    const a = verts[0].fromBufferAttribute(posAttr, i3 + 0);
    const b = verts[1].fromBufferAttribute(posAttr, i3 + 1);
    const c = verts[2].fromBufferAttribute(posAttr, i3 + 2);

    tempVec1.subVectors(c, b);
    tempVec2.subVectors(a, b);

    const normal = new Vector3().crossVectors(tempVec1, tempVec2).normalize();

    for (let n = 0; n < 3; n++) {
      const vert = verts[n];
      const hash = hashVertex(vert);
      if (!(hash in vertexMap)) {
        vertexMap[hash] = [];
      }
      vertexMap[hash].push(normal);
    }
  }

  const normalArray = new Float32Array(posAttr.count * 3);
  const normAttr = new BufferAttribute(normalArray, 3, false);

  for (let i = 0, l = posAttr.count / 3; i < l; i++) {
    const i3 = 3 * i;
    const a = verts[0].fromBufferAttribute(posAttr, i3 + 0);
    const b = verts[1].fromBufferAttribute(posAttr, i3 + 1);
    const c = verts[2].fromBufferAttribute(posAttr, i3 + 2);

    tempVec1.subVectors(c, b);
    tempVec2.subVectors(a, b);
    tempNorm.crossVectors(tempVec1, tempVec2).normalize();

    for (let n = 0; n < 3; n++) {
      const vert = verts[n];
      const hash = hashVertex(vert);
      const otherNormals = vertexMap[hash];
      tempNorm2.set(0, 0, 0);

      for (let k = 0, lk = otherNormals.length; k < lk; k++) {
        const otherNorm = otherNormals[k];

        if (tempNorm.dot(otherNorm) > creaseDot) {
          tempNorm2.add(otherNorm);
        }
      }

      tempNorm2.normalize();
      normAttr.setXYZ(i3 + n, tempNorm2.x, tempNorm2.y, tempNorm2.z);
    }
  }

  resultGeometry.setAttribute("normal", normAttr);

  return resultGeometry;
}
