import { extractBit, getInt } from "$lib/utils/bytes";
import { getColor } from "$lib/utils/graphics";

export interface MaterialOption {
  type?: number;
  doubleSided?: boolean;
  texture?: {
    enabled: boolean;
    index: number;
    flipX?: boolean;
    flipY?: boolean;
    flags?: number;
  };
  unknown4?: number;
  meshColor?: number;
  unknown8?: number;
}

export function getMaterialOptions(
  offset: number,
  count: number,
  dataView: DataView,
): MaterialOption[] {
  const options: MaterialOption[] = [];

  for (let i = 0x0; i < count; i += 0x1) {
    const type = getInt(offset, "uint16", { bigEndian: true }, dataView);
    const flags = getInt(offset + 0xa, "uint16", { bigEndian: true }, dataView);
    const rawColor = getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView); // prettier-ignore

    const color = getColor(rawColor, "BGR555");
    const meshColor = (color[0] << 0x10) | (color[1] << 0x8) | color[2];

    options.push({
      type,
      doubleSided: extractBit(type, 8),
      texture: {
        enabled: extractBit(type, 2),
        index: getInt(offset + 0x2, "uint16", { bigEndian: true }, dataView),
        flipX: extractBit(flags, 4),
        flipY: extractBit(flags, 5),
        flags,
      },
      unknown4: getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView),
      meshColor,
      unknown8: getInt(offset + 0x8, "uint16", { bigEndian: true }, dataView),
    });

    offset += 0xc;
  }

  return options;
}
