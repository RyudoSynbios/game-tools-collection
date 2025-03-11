import {
  BufferAttribute,
  Color,
  ColorManagement,
  Line,
  Matrix3,
  Mesh,
  Object3D,
  Points,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from "three";

// Adapted from https://github.com/mrdoob/three.js/blob/dev/examples/jsm/exporters/OBJExporter.js
export default class OBJExporter {
  parse(object: Object3D) {
    let output = "";

    let indexVertex = 0;
    let indexVertexUvs = 0;
    let indexNormals = 0;

    const vertex = new Vector3();
    const color = new Color();
    const normal = new Vector3();
    const uv = new Vector2();

    const face: string[] = [];

    function parseMesh(mesh: Mesh) {
      let nbVertex = 0;
      let nbNormals = 0;
      let nbVertexUvs = 0;

      const geometry = mesh.geometry;

      const normalMatrixWorld = new Matrix3();

      const vertices = geometry.getAttribute("position");
      const normals = geometry.getAttribute("normal");
      const uvs = geometry.getAttribute("uv");
      const indices = geometry.getIndex();

      output += "o " + mesh.name + "\n";

      // if (mesh.material && mesh.material.name) {
      //   output += "usemtl " + mesh.material.name + "\n";
      // }

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);

          vertex.applyMatrix4(mesh.matrixWorld);

          output += "v " + vertex.x + " " + vertex.y + " " + vertex.z + "\n";
        }
      }

      if (uvs !== undefined) {
        for (let i = 0, l = uvs.count; i < l; i++, nbVertexUvs++) {
          uv.fromBufferAttribute(uvs as BufferAttribute, i);

          output += "vt " + uv.x + " " + uv.y + "\n";
        }
      }

      if (normals !== undefined) {
        normalMatrixWorld.getNormalMatrix(mesh.matrixWorld);

        for (let i = 0, l = normals.count; i < l; i++, nbNormals++) {
          normal.fromBufferAttribute(normals, i);

          normal.applyMatrix3(normalMatrixWorld).normalize();

          output += "vn " + normal.x + " " + normal.y + " " + normal.z + "\n";
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
                  (normals ? "/" + (indexNormals + j) : "")
                : "");
          }

          output += "f " + face.join(" ") + "\n";
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
                  (normals ? "/" + (indexNormals + j) : "")
                : "");
          }

          output += "f " + face.join(" ") + "\n";
        }
      }

      indexVertex += nbVertex;
      indexVertexUvs += nbVertexUvs;
      indexNormals += nbNormals;
    }

    function parseLine(line: Line) {
      let nbVertex = 0;

      const geometry = line.geometry;
      const type = line.type;

      const vertices = geometry.getAttribute("position");

      output += "o " + line.name + "\n";

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);

          vertex.applyMatrix4(line.matrixWorld);

          output += "v " + vertex.x + " " + vertex.y + " " + vertex.z + "\n";
        }
      }

      if (type === "Line") {
        output += "l ";

        for (let j = 1, l = vertices.count; j <= l; j++) {
          output += indexVertex + j + " ";
        }

        output += "\n";
      }

      if (type === "LineSegments") {
        for (
          let j = 1, k = j + 1, l = vertices.count;
          j < l;
          j += 2, k = j + 1
        ) {
          output += "l " + (indexVertex + j) + " " + (indexVertex + k) + "\n";
        }
      }

      indexVertex += nbVertex;
    }

    function parsePoints(points: Points) {
      let nbVertex = 0;

      const geometry = points.geometry;

      const vertices = geometry.getAttribute("position");
      const colors = geometry.getAttribute("color");

      output += "o " + points.name + "\n";

      if (vertices !== undefined) {
        for (let i = 0, l = vertices.count; i < l; i++, nbVertex++) {
          vertex.fromBufferAttribute(vertices, i);
          vertex.applyMatrix4(points.matrixWorld);

          output += "v " + vertex.x + " " + vertex.y + " " + vertex.z;

          if (colors !== undefined) {
            color.fromBufferAttribute(colors, i);

            ColorManagement.fromWorkingColorSpace(color, SRGBColorSpace);

            output += " " + color.r + " " + color.g + " " + color.b;
          }

          output += "\n";
        }

        output += "p ";

        for (let j = 1, l = vertices.count; j <= l; j++) {
          output += indexVertex + j + " ";
        }

        output += "\n";
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

    return output;
  }
}
