import { derived, writable } from "svelte/store";

import { dataView, dataViewAlt } from "$lib/stores";
import type { HighlightedOffset } from "$lib/utils/fileVisualizer";

interface HighlightsTemplate {
  [dataView: string]: {
    [offset: number]: HighlightedOffset;
  };
}

export const cellEdit = writable<string | null>(null);
export const dataViewKey = writable<string | undefined>();
export const editedOffsets = writable<number[]>([]);
export const highlightsTemplate = writable<HighlightsTemplate>({});
export const rows = writable(0);
export const rowsOffset = writable(0x0);
export const search = writable("");
export const searchBigEndian = writable(false);
export const searchType = writable("uint8");
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
