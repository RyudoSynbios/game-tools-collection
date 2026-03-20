import { derived, writable } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";
import type { HighlightedOffset } from "$lib/utils/fileVisualizer";
import { getLocalStorage } from "$lib/utils/format";

import type { DataTypeUInt, fileVisualizerOptions } from "$lib/types";

interface HighlightsTemplate {
  [dataView: string]: {
    [offset: number]: HighlightedOffset;
  };
}

const lsFileVisualizerOptions = JSON.parse(
  getLocalStorage("fileVisualizerOptions") || "{}",
);

export const cellEdit = writable<string | null>(null);
export const dataViewKey = writable<string | undefined>();
export const editedOffsets = writable<number[]>([]);
export const highlightsTemplate = writable<HighlightsTemplate>({});
export const options = writable<fileVisualizerOptions>(lsFileVisualizerOptions);
export const rows = writable(0);
export const rowsOffset = writable(0x0);
export const search = writable("");
export const searchBigEndian = writable(false);
export const searchType = writable<DataTypeUInt | "float32" | "aob">("uint8");
export const selectedDataView = derived(
  [dataView, dataViewAlt, dataViewKey],
  ([$dataView, $dataViewAlt, $dataViewKey]) => {
    if ($dataViewKey === undefined) {
      return $dataView;
    }
    return $dataViewAlt[$dataViewKey];
  },
);
export const selectedOffset = writable(0x0);
export const selectedView = writable<"hexview" | "charview" | null>("hexview");
export const tooltipEl = writable<HTMLDivElement>();
