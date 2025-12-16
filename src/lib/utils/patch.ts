import LZString from "lz-string";
import { get } from "svelte/store";

import { dataViewAlt, dataViewAltMetas } from "$lib/stores";
import { setInt } from "$lib/utils/bytes";
import { updateResources } from "$lib/utils/parser";

import type { Patch } from "$lib/types";

export interface PatchData {
  dataViews: { [key: string]: string };
}

export function generateDataViewAltPatch(
  identifier: string,
  version: string,
  regions?: string[],
): Patch<PatchData> {
  const $dataViewAlt = get(dataViewAlt);
  const $dataViewAltMetas = get(dataViewAltMetas);

  const dataViews: { [key: string]: string } = {};

  Object.keys($dataViewAlt).forEach((key) => {
    if ($dataViewAltMetas[key]?.isDirty) {
      dataViews[key] = LZString.compress(
        JSON.stringify($dataViewAltMetas[key].patch),
      );
    }
  });

  const patch: Patch<PatchData> = {
    identifier,
    version,
    regions,
    data: {
      dataViews,
    },
  };

  return patch;
}

export function importDataViewAltPatch(patch: Patch<PatchData>): void {
  const dataViews = patch.data.dataViews;

  if (dataViews) {
    Object.entries(dataViews).forEach(([key, dataView]) => {
      const decompressedJson = LZString.decompress(dataView);

      const addresses = JSON.parse(decompressedJson);

      Object.entries(addresses).forEach(([address, value]) => {
        setInt(parseInt(address), "uint8", value as number, {}, key);
      });
    });
  }

  updateResources();
}
