import { dataTypeToLength } from "$lib/utils/bytes";

import type { ContentType, DataType, Item } from "$lib/types";

export interface HighlightedOffset {
  offset: number;
  text: string;
  type: ContentType;
  dataType?: DataType;
}

export interface HighlightedOffsets {
  [key: number]: HighlightedOffset;
}

export function parseItem(
  highlightedOffsets: HighlightedOffsets,
  item: Item,
  name = "",
): void {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      if ("offset" in flag) {
        if (!highlightedOffsets[flag.offset]) {
          highlightedOffsets[flag.offset] = {
            offset: flag.offset,
            text: `${item.name || ""} [${flag.bit}]: ${flag.name || name}`,
            type: item.type,
          };
        } else {
          highlightedOffsets[flag.offset].text += `\n${item.name || ""} [${
            flag.bit
          }]: ${flag.name || name}`;
        }
      }
    });
  } else if (item.type === "checksum" || item.type === "variable") {
    if (item.offset !== undefined) {
      let length = 1;

      if (
        item.type === "checksum" ||
        (item.type === "variable" && item.dataType !== "string")
      ) {
        length = dataTypeToLength(item.dataType);
      } else if (item.type === "variable" && item.dataType === "string") {
        length = item.length;
      }

      for (let i = 0; i < length; i += 1) {
        const isPartial =
          item.dataType === "lower4" || item.dataType === "upper4";

        if (!highlightedOffsets[item.offset + i]) {
          highlightedOffsets[item.offset + i] = {
            offset: item.offset + i,
            text: `${isPartial ? `${item.dataType}: ` : ""}${
              item.name || name
            }`,
            type: item.type,
            dataType: isPartial ? "uint8" : item.dataType,
          };
        } else {
          highlightedOffsets[item.offset + i].text += `\n${
            isPartial ? `${item.dataType}: ` : ""
          }${item.name || name}`;
        }
      }
    }
  } else if (item.type === "group" || item.type === "section") {
    item.items.forEach((subitem) => {
      parseItem(highlightedOffsets, subitem, item.name);
    });
  } else if (item.type === "list" || item.type === "tabs") {
    item.items.forEach((group) => {
      group.items.forEach((subitem) => {
        parseItem(highlightedOffsets, subitem);
      });
    });
  }
}
