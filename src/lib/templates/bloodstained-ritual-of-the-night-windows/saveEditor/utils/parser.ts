import type { StructProperty } from "$lib/utils/gvas";
import Parser from "$lib/utils/gvas/parser";

interface Inventory {
  Equipment: string[][];
  Inventory: Item[][];
}

interface Item {
  id: string;
  quantity: number;
  index: number;
  unknown1: number;
  unknown2: number;
  unknown3: number;
  unknown4: number;
}

export function parseInventoryData(json: StructProperty): Inventory {
  const data = new Uint8Array(json.InventoryData as number[]);
  const dataView = new DataView(data.buffer);

  const inventoryData: Inventory = {
    Equipment: [],
    Inventory: [],
  };

  const parser = new Parser(dataView);

  // Skip the first unused fields
  parser.getString();
  parser.getString();

  parser.shiftOffset(0x4);

  // Equipment

  for (let i = 0x0; i < 0x9; i += 0x1) {
    parser.shiftOffset(0x4);

    const set = [];

    for (let j = 0x0; j < 0xd; j += 0x1) {
      set.push(parser.getString());
    }

    inventoryData.Equipment.push(set);
  }

  // Inventory

  for (let i = 0x0; i < 0x10; i += 0x1) {
    const type: Item[] = [];

    const count = parser.getInt("uint32", true);

    if (count > 0) {
      for (let j = 0x0; j < count; j += 0x1) {
        type.push({
          id: parser.getString(),
          quantity: parser.getInt("uint32", true),
          index: parser.getInt("uint32", true),
          unknown1: parser.getInt("uint32", true),
          unknown2: parser.getInt("uint32", true),
          unknown3: parser.getInt("uint32", true),
          unknown4: parser.getInt("uint32", true),
        });
      }
    }

    inventoryData.Inventory.push(type);

    if (i === 0xe) {
      parser.shiftOffset(0x1);
    }
  }

  return inventoryData;
}
