import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  gameRegion,
} from "$lib/stores";
import { getInt, intToArray } from "$lib/utils/bytes";
import {
  File,
  getFile,
  getFiles,
  readGcm,
  rebuildGcm,
  writeFile,
} from "$lib/utils/common/gamecube";
import { getRegionArray, mergeUint8Arrays } from "$lib/utils/format";

import { offsetToMainDolStart } from "../template";
import {
  getCompressedData,
  getDecompressedData,
  getEnemyGroupDetails,
} from "../utils";
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

  let partyOffset = getRegionArray(offsetToMainDolStart);

  const mainDol = getFile("system/main.dol")!;
  const firstLmt = getFile("battle/first.lmt")!;
  const enemiesBackup = getFile("enemies_backup.gct");

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

  let enemies: Uint8Array;

  if (enemiesBackup) {
    enemies = new Uint8Array(enemiesBackup.dataView.buffer);
  } else {
    enemies = new Uint8Array(0xff * 0x20c);
  }

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

      if (!enemiesBackup) {
        enemies.set(
          decompressedData.slice(dataOffset, dataOffset + 0x20c),
          index * 0x20c,
        );
      }

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

  let partyOffset = getRegionArray(offsetToMainDolStart);

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
  writeFile("battle/first.lmt", $dataViewAlt.experienceCurves);

  // Enemies

  if (
    $dataViewAltMetas?.enemies?.isDirty ||
    $dataViewAltMetas?.enemyGroups?.isDirty ||
    $dataViewAltMetas?.enemyEventGroups?.isDirty
  ) {
    const enemiesData = new Uint8Array($dataViewAlt.enemies.buffer);

    writeFile("enemies_backup.gct", $dataViewAlt.enemies);

    const files = getEnemyGroupFiles();

    // Reserved for a099a_ep.enp file
    const a099aHeadersUint8Arrays: Uint8Array[] = [
      new Uint8Array([0x00, 0x00, 0xff, 0xff, 0x00, 0x0d, 0xff, 0xff]),
    ];
    const a099aDataUint8Arrays: Uint8Array[] = [];

    let a099aDataOffset = 0x1a8;

    files.forEach((file, fileIndex) => {
      const isEventGroup = file.name === "epevent.evp";

      let groupLength = 0xa;
      let headerLength = 0x2a0;

      if (isEventGroup) {
        groupLength = 0x25;
        headerLength = 0x640;
      }

      const { enemies, groupCount } = getEnemyGroupDetails(
        isEventGroup ? -1 : fileIndex - 1,
      );

      const enemyStatsOffset = headerLength + groupCount * groupLength;

      const uint8Array = new Uint8Array(
        enemyStatsOffset + enemies.length * 0x20c,
      ).fill(0xff);

      enemies.forEach((enemy, index) => {
        const enemyIndex = intToArray(enemy, "uint32", true);
        const dataOffset = intToArray(
          enemyStatsOffset + index * 0x20c,
          "uint32",
          true,
        );

        uint8Array.set([...enemyIndex, ...dataOffset], index * 0x8);

        uint8Array.set(
          enemiesData.slice(enemy * 0x20c, (enemy + 0x1) * 0x20c),
          enemyStatsOffset + index * 0x20c,
        );
      });

      if (isEventGroup) {
        const part = new Uint8Array(
          $dataViewAlt.enemyEventGroups.buffer.slice(0xa0),
        );

        uint8Array.set(part, 0x640);
      } else {
        const offset = (fileIndex - 1) * 0x150;

        const part = new Uint8Array(
          $dataViewAlt.enemyGroups.buffer.slice(
            offset + 0x10,
            offset + 0x10 + groupCount * groupLength,
          ),
        );

        uint8Array.set(part, 0x2a0);
      }

      // If a099a_ep.enp subfile, then push to a099a Uint8Array
      if (file.name.match(/a099a/)) {
        const name: number[] = [];

        file.name
          .replace(".enp", ".bin")
          .split("")
          .forEach((char) => {
            name.push(char.charCodeAt(0));
          });

        const heaader = new Uint8Array(0x20);

        heaader.set(name, 0x0);
        heaader.set(intToArray(a099aDataOffset, "uint32", true), 0x14);
        heaader.set(intToArray(uint8Array.byteLength, "uint32", true), 0x18);
        heaader.set(intToArray(0xffffffff, "uint32", true), 0x1c);

        a099aHeadersUint8Arrays.push(heaader);
        a099aDataUint8Arrays.push(uint8Array);

        a099aDataOffset += uint8Array.byteLength;
      }

      const compressedData = getCompressedData(new DataView(uint8Array.buffer));

      writeFile(file.path, new DataView(compressedData.buffer));
    });

    // Writing a099a_ep.enp file
    const a099aUint8Array = mergeUint8Arrays(
      ...a099aHeadersUint8Arrays,
      ...a099aDataUint8Arrays,
    );

    const compressedData = getCompressedData(
      new DataView(a099aUint8Array.buffer),
    );

    writeFile("field/a099a_ep.enp", new DataView(compressedData.buffer));
  }

  rebuildGcm();

  return get(dataView).buffer;
}
