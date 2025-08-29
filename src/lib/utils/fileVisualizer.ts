import { get } from "svelte/store";

import { gameJson } from "$lib/stores";
import {
  dataViewKey,
  highlightsTemplate,
  rows,
  rowsOffset,
  selectedDataView,
} from "$lib/stores/fileVisualizer";

import {
  ContentType,
  DataType,
  Item,
  ItemInt,
  ItemIntCondition,
} from "$lib/types";

import { dataTypeToLength } from "./bytes";

export interface HighlightedOffset {
  offset: number;
  text: string;
  type: ContentType;
  dataType?: DataType;
}

export function getCellsNumber(): number {
  const $rows = get(rows);
  const $selectedDataView = get(selectedDataView);

  return Math.min(Math.ceil($rows) * 0x10, $selectedDataView.byteLength);
}

export function getHighlight(offset: number): HighlightedOffset | undefined {
  const $dataViewKey = get(dataViewKey);
  const $highlightsTemplate = get(highlightsTemplate);

  const key = $dataViewKey !== undefined ? $dataViewKey : "main";

  return $highlightsTemplate[key]?.[offset];
}

export function getMaxRows(): number {
  const $selectedDataView = get(selectedDataView);

  return Math.ceil($selectedDataView.byteLength / 0x10);
}

export function scrollDataView(value: number): void {
  const $rows = get(rows);
  const $rowsOffset = get(rowsOffset);

  const rowsFloor = Math.floor($rows);
  const maxRows = getMaxRows();

  let newRowsOffset = $rowsOffset + value;

  if (rowsFloor + newRowsOffset > maxRows) {
    newRowsOffset = maxRows - rowsFloor;
  }

  newRowsOffset = Math.max(0, newRowsOffset);

  if ($rowsOffset !== newRowsOffset) {
    rowsOffset.set(newRowsOffset);
  }
}

export function parseGameJson(): void {
  const $gameJson = get(gameJson);

  Object.values($gameJson.items).forEach((item) => {
    parseItem(item);
  });

  // We force the update of highlightsTemplate
  highlightsTemplate.set(get(highlightsTemplate));
}

export function addItem(
  dataView: string,
  offset: number,
  text: string,
  type: ContentType,
  dataType?: DataType,
): void {
  const $highlightsTemplate = get(highlightsTemplate);

  if (!$highlightsTemplate[dataView]) {
    $highlightsTemplate[dataView] = {};
  }

  if (!$highlightsTemplate[dataView][offset]) {
    $highlightsTemplate[dataView][offset] = {
      offset,
      text,
      type,
      dataType,
    };
  } else {
    $highlightsTemplate[dataView][offset].text += `\n${text}`;
  }
}

export function parseItem(item: Item, name = ""): void {
  let dataView = "main";

  if ("uncontrolled" in item && item.uncontrolled) {
    return;
  }

  if ("dataViewAltKey" in item && item.dataViewAltKey) {
    dataView = item.dataViewAltKey;
  }

  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      if ("offset" in flag) {
        addItem(
          dataView,
          flag.offset,
          `[${flag.bit}]: ${item.name || ""} ${flag.label || name}`,
          item.type,
        );
      }
    });
  } else if (item.type === "checksum" || item.type === "variable") {
    if (item.offset !== undefined) {
      let dataTypeLength = 1;

      if (
        item.type === "checksum" ||
        (item.type === "variable" && item.dataType !== "string")
      ) {
        dataTypeLength = dataTypeToLength(item.dataType);
      } else if (item.type === "variable" && item.dataType === "string") {
        dataTypeLength = item.length;
      }

      for (let i = 0; i < dataTypeLength; i += 1) {
        const isPartial =
          item.dataType === "lower4" || item.dataType === "upper4";

        addItem(
          dataView,
          item.offset + i,
          `${isPartial ? `${item.dataType}: ` : ""}${item.name || name}`,
          item.type,
          isPartial ? "uint8" : item.dataType,
        );
      }
    }
  } else if (item.type === "group" || item.type === "section") {
    item.items.forEach((subitem) => {
      parseItem(subitem, item.name);
    });
  } else if (item.type === "tabs") {
    item.items.forEach((group) => {
      if (
        "disableTabIf" in group &&
        group.disableTabIf &&
        typeof group.disableTabIf !== "string" &&
        !("$and" in group.disableTabIf) &&
        !("$or" in group.disableTabIf)
      ) {
        parseItem({
          ...(group.disableTabIf as ItemInt),
          name: `disableTabIf value === ${(
            group.disableTabIf as ItemIntCondition
          ).value.toHex(2)}`,
        });
      }

      if (!group.disabled) {
        group.items.forEach((subitem) => {
          parseItem(subitem);
        });
      }
    });
  }
}
