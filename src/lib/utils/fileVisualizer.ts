import { get } from "svelte/store";

import { fileHeaderShift, gameJson } from "$lib/stores";
import { dataTypeToLength } from "$lib/utils/bytes";

import type { ContentType, DataType, Item, ItemInt } from "$lib/types";

export interface HighlightedOffset {
  offset: number;
  text: string;
  type: ContentType;
  dataType?: DataType;
}

export interface HighlightedOffsets {
  [key: number]: HighlightedOffset;
}

export function addItem(
  highlightedOffsets: HighlightedOffsets,
  offset: number,
  text: string,
  type: ContentType,
  dataType?: DataType,
) {
  if (!highlightedOffsets[offset]) {
    highlightedOffsets[offset] = {
      offset,
      text,
      type,
      dataType,
    };
  } else {
    highlightedOffsets[offset].text += `\n${text}`;
  }
}

export function parseItem(
  highlightedOffsets: HighlightedOffsets,
  item: Item,
  name = "",
): void {
  if (item.type === "bitflags") {
    item.flags.forEach((flag) => {
      if ("offset" in flag) {
        addItem(
          highlightedOffsets,
          flag.offset,
          `${item.name || ""} [${flag.bit}]: ${flag.label || name}`,
          item.type,
        );
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

        addItem(
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
        !Array.isArray(group.disableTabIf)
      ) {
        parseItem(highlightedOffsets, {
          ...(group.disableTabIf as ItemInt),
          name: `disableTabIf value === ${group.disableTabIf.value.toHex(2)}`,
        });
      }

      group.items.forEach((subitem) => {
        parseItem(highlightedOffsets, subitem);
      });
    });
  }
}

export function parseCondition(
  highlightedOffsets: HighlightedOffsets,
  key: string,
  condition: { [key: number]: any },
) {
  const $fileHeaderShift = get(fileHeaderShift);

  Object.values(condition).forEach((value) => {
    value.forEach((item: { [key: number | string]: any }) => {
      if (item.$and || item.$or) {
        parseCondition(highlightedOffsets, key, item);
      } else {
        const offset = parseInt(Object.keys(item)[0]);
        const length = item[offset].length;

        for (let i = offset; i < offset + length; i += 1) {
          addItem(
            highlightedOffsets,
            i + $fileHeaderShift,
            `Validator (${key})`,
            "variable",
            "string",
          );
        }
      }
    });
  });
}

export function parseValidator(highlightedOffsets: HighlightedOffsets) {
  const $gameJson = get(gameJson);

  Object.entries($gameJson.validator.regions).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((condition) =>
        parseCondition(highlightedOffsets, key, condition),
      );
    } else if (Object.keys(value).length > 0) {
      const offset = parseInt(Object.keys(value)[0]);
      const length = value[offset].length;

      for (let i = offset; i < offset + length; i += 1) {
        addItem(
          highlightedOffsets,
          i,
          `Validator (${key})`,
          "variable",
          "string",
        );
      }
    }
  });
}
