import {
  BufferAttribute,
  Color,
  ColorManagement,
  Line,
  Matrix3,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Points,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from "three";

import { generateUUID } from "../format";

// Adapted from https://github.com/mrdoob/three.js/blob/dev/examples/jsm/exporters/OBJExporter.js
export default class OBJExporter {
  parse(
    object: Object3D,
    textureFlipY: boolean,
  ): { obj: string; mtl: string; textures: { [name: string]: string } } {
    let obj = "mtllib object.mtl\n\n";
    let mtl = "";

    const textures: { [name: string]: string } = {};

    let indexVertex = 0;
    let indexVertexUvs = 0;
    let indexNormals = 0;

    const vertex = new Vector3();
    const color = new Color();
    const normal = new Vector3();
    const uv = new Vector2();

    const face: string[] = [];

    function parseMesh(mesh: Mesh): void {
      let nbVertex = 0;
      let nbNormals = 0;
      let nbVertexUvs = 0;

      const geometry = mesh.geometry;

      const normalMatrixWorld = new Matrix3();

      const vertices = geometry.getAttribute("position");
      const normals = geometry.getAttribute("normal");
      const uvs = geometry.getAttribute("uv");
      const indices = geometry.getIndex();

      obj += `o ${mesh.name}\n`;

      if (mesh.material && !Array.isArray(mesh.material)) {
        const material = mesh.material as MeshLambertMaterial;

        const name = `material.${generateUUID()}`;

        obj += `usemtl ${name}\n`;

        mtl += `\nnewmtl ${name}\n`;
        mtl += `Ns 100\n`;
        mtl += `Ka 0 0 0\n`;
        mtl += `Kd ${material.color.r} ${material.color.g} ${material.color.b}\n`;
        mtl += `Ks 0 0 0\n`;
        mtl += `Ke 0 0 0\n`;
        mtl += `Ni 1\n`;
        mtl += `d ${material.opacity}\n`;
        mtl += `illum 1\n`;

        if (material.map?.name) {
          mtl += `map_Kd ${material.map.name}.png\n`;

          textures[material.map.name] = material.map.source.data.src.replace(
            "data:image/png;base64,",
            "",
          );
        }
      }

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);

          vertex.applyMatrix4(mesh.matrixWorld);

          obj += `v ${vertex.x} ${vertex.y} ${vertex.z}\n`;
        }
      }

      if (uvs !== undefined) {
        for (let i = 0, l = uvs.count; i < l; i++, nbVertexUvs++) {
          uv.fromBufferAttribute(uvs as BufferAttribute, i);

          if (!textureFlipY) {
            uv.y = 1 - uv.y;
            uvs.setY(i, uv.y);
          }

          obj += `vt ${uv.x} ${uv.y}\n`;
        }
      }

      if (normals !== undefined) {
        normalMatrixWorld.getNormalMatrix(mesh.matrixWorld);

        for (let i = 0, l = normals.count; i < l; i++, nbNormals++) {
          normal.fromBufferAttribute(normals, i);

          normal.applyMatrix3(normalMatrixWorld).normalize();

          obj += `vn ${normal.x} ${normal.y} ${normal.z}\n`;
        }
      }

      if (indices !== null) {
        for (let i = 0, l = indices.count; i < l; i += 3) {
          for (let m = 0; m < 3; m++) {
            const j = indices.getX(i + m) + 1;

            face[m] =
              indexVertex +
              j +
              (normals || uvs
                ? "/" +
                  (uvs ? indexVertexUvs + j : "") +
                  (normals ? `/${indexNormals + j}` : "")
                : "");
          }

          obj += `f ${face.join(" ")}\n`;
        }
      } else {
        for (let i = 0, l = vertices.count; i < l; i += 3) {
          for (let m = 0; m < 3; m++) {
            const j = i + m + 1;

            face[m] =
              indexVertex +
              j +
              (normals || uvs
                ? "/" +
                  (uvs ? indexVertexUvs + j : "") +
                  (normals ? `/${indexNormals + j}` : "")
                : "");
          }

          obj += `f ${face.join(" ")}\n`;
        }
      }

      indexVertex += nbVertex;
      indexVertexUvs += nbVertexUvs;
      indexNormals += nbNormals;
    }

    function parseLine(line: Line): void {
      let nbVertex = 0;

      const geometry = line.geometry;
      const type = line.type;

      const vertices = geometry.getAttribute("position");

      obj += `\no ${line.name}\n`;

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);

          vertex.applyMatrix4(line.matrixWorld);

          obj += `v ${vertex.x} ${vertex.y} ${vertex.z}\n`;
        }
      }

      if (type === "Line") {
        obj += "l ";

        for (let j = 1, l = vertices.count; j <= l; j++) {
          obj += `${indexVertex + j} `;
        }

        obj += "\n";
      }

      if (type === "LineSegments") {
        for (
          let j = 1, k = j + 1, l = vertices.count;
          j < l;
          j += 2, k = j + 1
        ) {
          obj += `l ${indexVertex + j} ${indexVertex + k}\n`;
        }
      }

      indexVertex += nbVertex;
    }

    function parsePoints(points: Points): void {
      let nbVertex = 0;

      const geometry = points.geometry;

      const vertices = geometry.getAttribute("position");
      const colors = geometry.getAttribute("color");

      obj += `\no ${points.name}\n`;

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);
          vertex.applyMatrix4(points.matrixWorld);

          obj += `v ${vertex.x} ${vertex.y} ${vertex.z}`;

          if (colors !== undefined) {
            color.fromBufferAttribute(colors, i);

            ColorManagement.fromWorkingColorSpace(color, SRGBColorSpace);

            obj += ` ${color.r} ${color.g} ${color.b}`;
          }

          obj += "\n";
        }

        obj += "p ";

        for (let j = 1, l = vertices.count; j <= l; j++) {
          obj += `${indexVertex + j} `;
        }

        obj += "\n";
      }

      indexVertex += nbVertex;
    }

    object.traverse((child) => {
      if ("isMesh" in child) {
        parseMesh(child as Mesh);
      }

      if ("isLine" in child) {
        parseLine(child as Line);
      }

      if ("isPoints" in child) {
        parsePoints(child as Points);
      }
    });

    return { obj, mtl, textures };
  }
}
