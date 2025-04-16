import { dataTypeToLength } from "$lib/utils/bytes";

import type {
  ContentType,
  DataType,
  Item,
  ItemInt,
  ItemIntCondition,
} from "$lib/types";

export interface HighlightedOffset {
  offset: number;
  text: string;
  type: ContentType | "search";
  dataType?: DataType;
}

export interface HighlightedOffsets {
  [dataView: string]: {
    [offset: number]: HighlightedOffset;
  };
}

export function addItem(
  dataView: string,
  highlightedOffsets: HighlightedOffsets,
  offset: number,
  text: string,
  type: ContentType,
  dataType?: DataType,
): void {
  if (!highlightedOffsets[dataView]) {
    highlightedOffsets[dataView] = {};
  }

  if (!highlightedOffsets[dataView][offset]) {
    highlightedOffsets[dataView][offset] = {
      offset,
      text,
      type,
      dataType,
    };
  } else {
    highlightedOffsets[dataView][offset].text += `\n${text}`;
  }
}

export function parseItem(
  highlightedOffsets: HighlightedOffsets,
  item: Item,
  name = "",
): void {
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
          highlightedOffsets,
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
          highlightedOffsets,
          item.offset + i,
          `${isPartial ? `${item.dataType}: ` : ""}${item.name || name}`,
          item.type,
          isPartial ? "uint8" : item.dataType,
        );
      }
    }
  } else if (item.type === "group" || item.type === "section") {
    item.items.forEach((subitem) => {
      parseItem(highlightedOffsets, subitem, item.name);
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
        parseItem(highlightedOffsets, {
          ...(group.disableTabIf as ItemInt),
          name: `disableTabIf value === ${(
            group.disableTabIf as ItemIntCondition
          ).value.toHex(2)}`,
        });
      }

      if (!group.disabled) {
        group.items.forEach((subitem) => {
          parseItem(highlightedOffsets, subitem);
        });
      }
    });
  }
}
