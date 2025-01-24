import { get } from "svelte/store";

import { dataView, dataViewAlt, gameRegion } from "$lib/stores";
import { getInt } from "$lib/utils/bytes";
import {
  File,
  getFile,
  getFiles,
  readGcm,
  writeFile,
} from "$lib/utils/common/gamecube";
import { getRegionArray, mergeUint8Arrays } from "$lib/utils/format";

import { offsetToParty } from "../template";
import { getDecompressedData } from "../utils";
import { mainDolDataViews } from "./resource";

export function initDataViewAlts(): void {
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  readGcm();

  let partyOffset = getRegionArray(offsetToParty);

  const main = getFile("system/main.dol")!;
  const locale = getFile("english.sot");

  $dataViewAlt["main.dol"] = main.dataView;

  const buffer = main.dataView.buffer;
  const localeDataView =
    $gameRegion === 0 && locale ? locale.dataView : undefined;

  mainDolDataViews.forEach((model) => {
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
            const int = getInt(textOffset, "uint8", {}, localeDataView); // prettier-ignore

            part.push(int);

            textOffset += 0x1;

            if (int === 0x0) {
              break;
            }
          }

          data.set(new Uint8Array(part), i * model.length);
        }

        model.europe.operations.forEach((operation) => {
          const part = buffer.slice(
            offset + operation.start,
            offset + operation.end,
          );

          data.set(new Uint8Array(part), i * model.length + operation.offset);
        });
      }
    } else {
      for (let i = 0; i < model.count; i += 1) {
        const offset = partyOffset + i * model.length;
        const part = buffer.slice(offset, offset + model.length);

        data.set(new Uint8Array(part), i * model.length);
      }
    }

    $dataViewAlt[model.name] = new DataView(data.buffer);

    const shift = getRegionArray(model.shifts);

    if ($gameRegion === 0) {
      partyOffset += shift || model.count * model.europe.length;
    } else {
      partyOffset += shift || model.count * model.length;
    }
  });

  // Battle

  const files = getFiles();

  ["ebinit", "ecinit"].forEach((type) => {
    const uint8Arrays: Uint8Array[] = [];

    files.forEach((entry) => {
      if (
        entry.type === "file" &&
        entry.name.match(new RegExp(`^${type}(.*?).dat$`))
      ) {
        const file = getFile(`battle/${entry.name}`) as File & {
          dataView: DataView;
        };

        const data = getDecompressedData(file.dataView);

        uint8Arrays.push(data);
      }
    });

    const uint8Array = mergeUint8Arrays(...uint8Arrays);

    $dataViewAlt[`${type}.dat`] = new DataView(uint8Array.buffer);
  });
}

export function exportDataViewAlts(): ArrayBufferLike {
  const $dataView = get(dataView);
  const $dataViewAlt = get(dataViewAlt);
  const $gameRegion = get(gameRegion);

  let partyOffset = getRegionArray(offsetToParty);

  const data = new Uint8Array($dataViewAlt["main.dol"].buffer);

  mainDolDataViews.forEach((model) => {
    if ($gameRegion === 0) {
      for (let i = 0; i < model.count; i += 1) {
        const offset = i * model.length;

        model.europe.operations.toReversed().forEach((operation) => {
          const part = $dataViewAlt[model.name].buffer.slice(
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
        const part = $dataViewAlt[model.name].buffer.slice(
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

  return $dataView.buffer;
}
