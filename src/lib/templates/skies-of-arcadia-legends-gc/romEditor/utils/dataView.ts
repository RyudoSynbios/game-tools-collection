import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  gameRegion,
} from "$lib/stores";
import { getInt, getIntFromArray } from "$lib/utils/bytes";
import {
  File,
  getFile,
  getFiles,
  readGcm,
  rebuildGcm,
  writeFile,
} from "$lib/utils/common/gamecube";
import { getRegionArray, mergeUint8Arrays } from "$lib/utils/format";

import { offsetToParty } from "../template";
import { getCompressedData, getDecompressedData } from "../utils";
import { mainDolModels } from "./resource";

function getEnemyGroupFiles(): File[] {
  return getFiles().filter(
    (file) =>
      file.path !== "field/a099a_ep.enp" && file.path.match(/.(enp|evp)$/i),
  );
}

export function initDataViewAlt(): void {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  readGcm();

  // Main

  let partyOffset = getRegionArray(offsetToParty);

  const mainDol = getFile("system/main.dol")!;
  const firstLmt = getFile("battle/first.lmt")!;

  $dataViewAlt["main.dol"] = mainDol.dataView;
  $dataViewAlt.experienceCurves = firstLmt.dataView;

  const mainDolData = mainDol.dataView.buffer;

  let localeDataView = undefined;

  if ($gameRegion === 0) {
    const locale = getFile("english.sot");

    if (locale) {
      localeDataView = locale.dataView;
    }
  }

  Object.entries(mainDolModels).forEach(([name, model]) => {
    const data = new Uint8Array(model.count * model.length);

    if ($gameRegion === 0) {
      let textOffset = model.europe.textPointer
        ? getInt(model.europe.textPointer, "uint32", {}, localeDataView)
        : 0x0;

      for (let i = 0; i < model.count; i += 1) {
        const offset = partyOffset + i * model.europe.length;

        if (model.europe.textPointer) {
          const part = [];

          for (let j = 0x0; j < 0x100; j += 0x1) {
            const int = getInt(textOffset, "uint8", {}, localeDataView);

            part.push(int);

            textOffset += 0x1;

            if (int === 0x0) {
              break;
            }
          }

          data.set(new Uint8Array(part), i * model.length);
        }

        model.europe.operations.forEach((operation) => {
          const part = mainDolData.slice(
            offset + operation.start,
            offset + operation.end,
          );

          data.set(new Uint8Array(part), i * model.length + operation.offset);
        });
      }
    } else {
      for (let i = 0; i < model.count; i += 1) {
        const offset = partyOffset + i * model.length;
        const part = mainDolData.slice(offset, offset + model.length);

        data.set(new Uint8Array(part), i * model.length);
      }
    }

    $dataViewAlt[name] = new DataView(data.buffer);

    const shift = getRegionArray(model.shifts);

    if ($gameRegion === 0) {
      partyOffset += shift || model.count * model.europe.length;
    } else {
      partyOffset += shift || model.count * model.length;
    }
  });

  // Enemies

  const enemyGroupsUint8Arrays: Uint8Array[] = [];
  const enemyEventGroupsUint8Arrays: Uint8Array[] = [];

  const enemies = new Uint8Array(0xff * 0x20c);

  const files = getEnemyGroupFiles();

  files.forEach((file) => {
    const fileTmp = getFile(file.path);

    const decompressedData = getDecompressedData(fileTmp!.dataView);

    const dataView = new DataView(decompressedData.buffer);

    let offset = 0x0;

    const enemyIndexes = [];
    let startDataOffset = -1;

    while (true) {
      const index = getInt(offset, "int32", { bigEndian: true }, dataView);
      const dataOffset = getInt(offset + 0x4, "uint32", { bigEndian: true }, dataView); // prettier-ignore

      if (index === -1) {
        break;
      }

      enemyIndexes.push(index);

      if (startDataOffset === -1) {
        startDataOffset = dataOffset;
      }

      enemies.set(
        decompressedData.slice(dataOffset, dataOffset + 0x20c),
        index * 0x20c,
      );

      offset += 0x8;
    }

    if (file.name === "epevent.evp") {
      const uint8Array = new Uint8Array(0xa0 + 0x100 * 0x25).fill(0xff);

      enemyIndexes.forEach((int, index) => {
        uint8Array[index] = int;
      });

      uint8Array.set(decompressedData.slice(0x640, startDataOffset), 0xa0);

      enemyEventGroupsUint8Arrays.push(uint8Array);
    } else {
      const uint8Array = new Uint8Array(0x10 + 0x20 * 0xa).fill(0xff);

      enemyIndexes.forEach((int, index) => {
        uint8Array[index] = int;
      });

      uint8Array.set(decompressedData.slice(0x2a0, startDataOffset), 0x10);

      enemyGroupsUint8Arrays.push(uint8Array);
    }
  });

  $dataViewAlt.enemies = new DataView(enemies.buffer);
  $dataViewAlt.enemyGroups = new DataView(
    mergeUint8Arrays(...enemyGroupsUint8Arrays).buffer,
  );
  $dataViewAlt.enemyEventGroups = new DataView(
    mergeUint8Arrays(...enemyEventGroupsUint8Arrays).buffer,
  );
}

export function exportDataViewAlt(): ArrayBufferLike {
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);
  const $gameRegion = get(gameRegion);

  // Main

  let partyOffset = getRegionArray(offsetToParty);

  const data = new Uint8Array($dataViewAlt["main.dol"].buffer);

  Object.entries(mainDolModels).forEach(([name, model]) => {
    if ($gameRegion === 0) {
      for (let i = 0; i < model.count; i += 1) {
        const offset = i * model.length;

        model.europe.operations.toReversed().forEach((operation) => {
          const part = $dataViewAlt[name].buffer.slice(
            offset + operation.offset,
            offset + operation.offset + (operation.end - operation.start),
          );

          data.set(
            new Uint8Array(part),
            partyOffset + i * model.europe.length + operation.start,
          );
        });
      }
    } else {
      for (let i = 0; i < model.count; i += 1) {
        const offset = i * model.length;
        const part = $dataViewAlt[name].buffer.slice(
          offset,
          offset + model.length,
        );

        data.set(new Uint8Array(part), partyOffset + i * model.length);
      }
    }

    const shift = getRegionArray(model.shifts);

    if ($gameRegion === 0) {
      partyOffset += shift || model.count * model.europe.length;
    } else {
      partyOffset += shift || model.count * model.length;
    }
  });

  writeFile("system/main.dol", new DataView(data.buffer));

  // Enemies

  if (
    $dataViewAltMetas?.enemies?.isDirty ||
    $dataViewAltMetas?.enemyGroups?.isDirty ||
    $dataViewAltMetas?.enemyEventGroups?.isDirty
  ) {
    const enemiesData = new Uint8Array($dataViewAlt.enemies.buffer);

    const files = getEnemyGroupFiles();

    files.forEach((file, fileIndex) => {
      const fileTmp = getFile(file.path);

      const decompressedData = getDecompressedData(fileTmp!.dataView);

      let offset = 0x0;

      while (true) {
        const index = getIntFromArray(decompressedData, offset, "int32", true);
        const dataOffset = getIntFromArray(decompressedData, offset + 0x4, "uint32", true); // prettier-ignore

        if (index === -1) {
          break;
        }

        decompressedData.set(
          enemiesData.slice(index * 0x20c, (index + 0x1) * 0x20c),
          dataOffset,
        );

        offset += 0x8;
      }

      if (file.name === "epevent.evp") {
        const part = new Uint8Array(
          $dataViewAlt.enemyEventGroups.buffer.slice(0xa0),
        );

        decompressedData.set(part, 0x640);
      } else {
        const offset = (fileIndex - 1) * 0x150;

        const part = new Uint8Array(
          $dataViewAlt.enemyGroups.buffer.slice(offset + 0x10, offset + 0x150),
        );

        decompressedData.set(part, 0x2a0);
      }

      const compressedData = getCompressedData(
        new DataView(decompressedData.buffer),
      );

      writeFile(file.path, new DataView(compressedData.buffer));
    });
  }

  rebuildGcm();

  return get(dataView).buffer;
}
