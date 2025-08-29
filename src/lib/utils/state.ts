import { get } from "svelte/store";

import {
  dataJson,
  dataView,
  dataViewAlt,
  dataViewAltMetas,
  fileHeaderShift,
  fileName,
  gameJson,
  gameRegion,
  gameUtils,
  isDirty,
} from "$lib/stores";
import {
  dataViewKey,
  editedOffsets,
  highlightsTemplate,
  rowsOffset,
  search,
  searchBigEndian,
  searchType,
  selectedOffset,
  selectedView,
} from "$lib/stores/fileVisualizer";
import { utilsExists } from "$lib/utils/format";

import type { GameJson } from "$lib/types";

export function reset(): void {
  const $gameUtils = get(gameUtils) as any;

  if (utilsExists("onReset")) {
    $gameUtils.onReset();
  }

  // Main
  dataJson.set(undefined);
  dataView.set(new DataView(new ArrayBuffer(0)));
  dataViewAlt.set({});
  dataViewAltMetas.set({});
  fileHeaderShift.set(0x0);
  fileName.set("");
  gameJson.set({} as GameJson);
  gameRegion.set(-1);
  isDirty.set(false);

  // File Visualizer
  dataViewKey.set(undefined);
  editedOffsets.set([]);
  highlightsTemplate.set({});
  rowsOffset.set(0x0);
  search.set("");
  searchBigEndian.set(false);
  searchType.set("uint8");
  selectedOffset.set(0x0);
  selectedView.set("hexview");
}
