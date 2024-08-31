import { get } from "svelte/store";

import {
  dataView,
  dataViewAlt,
  fileHeaderShift,
  fileName,
  fileVisualizerAddress,
  fileVisualizerDataViewKey,
  gameJson,
  gameRegion,
  gameUtils,
  isDirty,
} from "$lib/stores";
import { utilsExists } from "$lib/utils/format";

import type { GameJson } from "$lib/types";

export function reset(): void {
  const $gameUtils = get(gameUtils) as any;

  if (utilsExists("onReset")) {
    $gameUtils.onReset();
  }

  dataView.set(new DataView(new ArrayBuffer(0)));
  dataViewAlt.set({});
  fileHeaderShift.set(0x0);
  fileName.set("");
  fileVisualizerAddress.set(0x0);
  fileVisualizerDataViewKey.set("main");
  gameJson.set({} as GameJson);
  gameRegion.set(-1);
  isDirty.set(false);
}
