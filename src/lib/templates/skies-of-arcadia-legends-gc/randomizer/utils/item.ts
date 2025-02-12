import { get } from "svelte/store";

import { dataViewAlt } from "$lib/stores";
import { getInt, setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import {
  itemEffects,
  mainDolModels,
  shipItemEffects,
} from "../../romEditor/utils/resource";
import { Options } from "../utils";

export interface Item {
  index: number;
  type: string;
  characters: number;
}

const effectRates = [0, 0, 1];

export function generateInventory(): Item[] {
  const $dataViewAlt = get(dataViewAlt);

  const inventory: Item[] = [];

  let index = 0;

  for (let i = 0x0; i < mainDolModels.weapons.count; i += 0x1) {
    const offset = i * mainDolModels.weapons.length;

    const type = getInt(offset + 0x11, 'uint8', {}, $dataViewAlt.weapons); // prettier-ignore
    const unknown = getInt(offset + 0x13, 'uint8', {}, $dataViewAlt.weapons); // prettier-ignore

    if (unknown !== 0xff) {
      inventory.push({ index, type: "weapon", characters: type });
    }

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.armors.count; i += 0x1) {
    const offset = i * mainDolModels.armors.length;

    const characters = getInt(offset + 0x11, 'uint8', {}, $dataViewAlt.armors); // prettier-ignore

    if (characters !== 0x0) {
      inventory.push({ index, type: "armor", characters });
    }

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.accessories.count; i += 0x1) {
    const offset = i * mainDolModels.accessories.length;

    const characters = getInt(offset + 0x11, 'uint8', {}, $dataViewAlt.accessories); // prettier-ignore

    if (characters !== 0x0) {
      inventory.push({ index, type: "accessory", characters });
    }

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.items.count; i += 0x1) {
    const offset = i * mainDolModels.items.length;

    const unknown = getInt(offset + 0x17, 'uint8', {}, $dataViewAlt.items); // prettier-ignore

    if (unknown !== 0xff) {
      inventory.push({ index, type: "item", characters: 0xff });
    }

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.keyItems.count; i += 0x1) {
    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.shipWeapons.count; i += 0x1) {
    const offset = i * mainDolModels.shipWeapons.length;

    const ships = getInt(offset + 0x11, 'uint8', {}, $dataViewAlt.shipWeapons); // prettier-ignore

    if (ships !== 0x0) {
      inventory.push({ index, type: "shipWeapon", characters: 0xff });
    }

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.shipAccessories.count; i += 0x1) {
    inventory.push({ index, type: "shipAccessory", characters: 0xff });

    index += 1;
  }

  for (let i = 0x0; i < mainDolModels.shipItems.count; i += 0x1) {
    inventory.push({ index, type: "shipItem", characters: 0xff });

    index += 1;
  }

  return inventory;
}

function generateEffect(
  prng: Prng,
  effects: number[],
  key: string,
): [number, number] {
  const effectRateIndex = prng.getInt(0, effectRates.length - 1, key.replace('%', 'hasEffect')); // prettier-ignore

  let effect = -1;
  let effectValue = 0;

  if (effectRates[effectRateIndex]) {
    const effectIndex = prng.getInt(0, effects.length - 1, key.replace('%', 'effect')); // prettier-ignore

    effect = effects[effectIndex];

    if (effectValue === 0) {
      effectValue = prng.getInt(-5, 50, key.replace("%", "effectValue"));
    }
  }

  return [effect, effectValue];
}

export function randomizeItems(prng: Prng, options: Options): void {
  const $dataViewAlt = get(dataViewAlt);

  if (
    options.items.stats === 0x0 &&
    options.items.effects === 0x0 &&
    options.items.prices === 0x0
  ) {
    return;
  }

  const effects = Object.keys(itemEffects).map((i) => parseInt(i));
  const shipEffects = Object.keys(shipItemEffects).map((i) => parseInt(i));

  for (let i = 0x0; i < mainDolModels.weapons.count; i += 0x1) {
    const offset = i * mainDolModels.weapons.length;

    let price = getInt(offset + 0x16, "uint16", { bigEndian: true }, $dataViewAlt.weapons); // prettier-ignore
    let attack = getInt(offset + 0x18, "int16", { bigEndian: true }, $dataViewAlt.weapons); // prettier-ignore
    let hit = getInt(offset + 0x1a, "int16", { bigEndian: true }, $dataViewAlt.weapons); // prettier-ignore
    let effect = getInt(offset + 0x1c, "uint8", {}, $dataViewAlt.weapons); // prettier-ignore
    let effectValue = getInt(offset + 0x1e, "int16", { bigEndian: true }, $dataViewAlt.weapons); // prettier-ignore

    // Effects

    if (options.items.effects === 0x1) {
      [effect, effectValue] = generateEffect(prng, effects, `items_weapon_%_${i}`); // prettier-ignore
    }

    // Stats

    if (options.items.stats === 0x1) {
      attack *= prng.getFloat(0.5, 1.5, `items_weapon_attack_1_${i}`);
      hit *= prng.getFloat(0.9, 1.1, `items_weapon_hit_1_${i}`);
      effectValue *= prng.getFloat(0.5, 1.5, `items_weapon_effectValue_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      attack *= prng.getFloat(0.1, 4, `items_weapon_attack_2_${i}`);
      hit *= prng.getFloat(0.5, 1.5, `items_weapon_hit_2_${i}`);
      effectValue *= prng.getFloat(0.1, 4, `items_weapon_effectValue_2_${i}`);
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_weapon_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_weapon_price_2_${i}`);
    }

    setInt(offset + 0x16, "uint16", price, { bigEndian: true }, "weapons");
    setInt(offset + 0x18, "int16", attack, { bigEndian: true }, "weapons");
    setInt(offset + 0x1a, "int16", hit, { bigEndian: true }, "weapons");
    setInt(offset + 0x1c, "uint8", effect, {}, "weapons");
    setInt(offset + 0x1e, "int16", effectValue, { bigEndian: true }, "weapons");
  }

  for (let i = 0x0; i < mainDolModels.armors.count; i += 0x1) {
    const offset = i * mainDolModels.armors.length;

    let price = getInt(offset + 0x16, "uint16", { bigEndian: true }, $dataViewAlt.armors); // prettier-ignore
    let effect1 = getInt(offset + 0x18, "uint8", {}, $dataViewAlt.armors); // prettier-ignore
    let effect1Value = getInt(offset + 0x1a, "int16", { bigEndian: true }, $dataViewAlt.armors); // prettier-ignore
    let effect2 = getInt(offset + 0x1c, "uint8", {}, $dataViewAlt.armors); // prettier-ignore
    let effect2Value = getInt(offset + 0x1e, "int16", { bigEndian: true }, $dataViewAlt.armors); // prettier-ignore
    let effect3 = getInt(offset + 0x20, "uint8", {}, $dataViewAlt.armors); // prettier-ignore
    let effect3Value = getInt(offset + 0x22, "int16", { bigEndian: true }, $dataViewAlt.armors); // prettier-ignore
    let effect4 = getInt(offset + 0x24, "uint8", {}, $dataViewAlt.armors); // prettier-ignore
    let effect4Value = getInt(offset + 0x26, "int16", { bigEndian: true }, $dataViewAlt.armors); // prettier-ignore

    // Effects

    if (options.items.effects === 0x1) {
      [effect1, effect1Value] = generateEffect(prng, effects, `items_armor_%1_${i}`); // prettier-ignore
      [effect2, effect2Value] = generateEffect(prng, effects, `items_armor_%2_${i}`); // prettier-ignore
      [effect3, effect3Value] = generateEffect(prng, effects, `items_armor_%3_${i}`); // prettier-ignore
      [effect4, effect4Value] = generateEffect(prng, effects, `items_armor_%4_${i}`); // prettier-ignore
    }

    // Stats

    if (options.items.stats === 0x1) {
      effect1Value *= prng.getFloat(0.5, 1.5, `items_armor_effect1Value_1_${i}`); // prettier-ignore
      effect2Value *= prng.getFloat(0.5, 1.5, `items_armor_effect2Value_1_${i}`); // prettier-ignore
      effect3Value *= prng.getFloat(0.5, 1.5, `items_armor_effect3Value_1_${i}`); // prettier-ignore
      effect4Value *= prng.getFloat(0.5, 1.5, `items_armor_effect4Value_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      effect1Value *= prng.getFloat(0.1, 4, `items_armor_effect1Value_2_${i}`);
      effect2Value *= prng.getFloat(0.1, 4, `items_armor_effect2Value_2_${i}`);
      effect3Value *= prng.getFloat(0.1, 4, `items_armor_effect3Value_2_${i}`);
      effect4Value *= prng.getFloat(0.1, 4, `items_armor_effect4Value_2_${i}`);
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_armor_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_armor_price_2_${i}`);
    }

    setInt(offset + 0x16, "uint16", price, { bigEndian: true }, 'armors'); // prettier-ignore
    setInt(offset + 0x18, "uint8", effect1, {}, 'armors'); // prettier-ignore
    setInt(offset + 0x1a, "int16", effect1Value, { bigEndian: true }, 'armors'); // prettier-ignore
    setInt(offset + 0x1c, "uint8", effect2, {}, 'armors'); // prettier-ignore
    setInt(offset + 0x1e, "int16", effect2Value, { bigEndian: true }, 'armors'); // prettier-ignore
    setInt(offset + 0x20, "uint8", effect3, {}, 'armors'); // prettier-ignore
    setInt(offset + 0x22, "int16", effect3Value, { bigEndian: true }, 'armors'); // prettier-ignore
    setInt(offset + 0x24, "uint8", effect4, {}, 'armors'); // prettier-ignore
    setInt(offset + 0x26, "int16", effect4Value, { bigEndian: true }, 'armors'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.accessories.count; i += 0x1) {
    const offset = i * mainDolModels.accessories.length;

    let price = getInt(offset + 0x16, "uint16", { bigEndian: true }, $dataViewAlt.accessories); // prettier-ignore
    let effect1 = getInt(offset + 0x18, "uint8", {}, $dataViewAlt.accessories); // prettier-ignore
    let effect1Value = getInt(offset + 0x1a, "int16", { bigEndian: true }, $dataViewAlt.accessories); // prettier-ignore
    let effect2 = getInt(offset + 0x1c, "uint8", {}, $dataViewAlt.accessories); // prettier-ignore
    let effect2Value = getInt(offset + 0x1e, "int16", { bigEndian: true }, $dataViewAlt.accessories); // prettier-ignore
    let effect3 = getInt(offset + 0x20, "uint8", {}, $dataViewAlt.accessories); // prettier-ignore
    let effect3Value = getInt(offset + 0x22, "int16", { bigEndian: true }, $dataViewAlt.accessories); // prettier-ignore
    let effect4 = getInt(offset + 0x24, "uint8", {}, $dataViewAlt.accessories); // prettier-ignore
    let effect4Value = getInt(offset + 0x26, "int16", { bigEndian: true }, $dataViewAlt.accessories); // prettier-ignore

    // Effects

    if (options.items.effects === 0x1) {
      [effect1, effect1Value] = generateEffect(prng, effects, `items_accessory_%1_${i}`); // prettier-ignore
      [effect2, effect2Value] = generateEffect(prng, effects, `items_accessory_%2_${i}`); // prettier-ignore
      [effect3, effect3Value] = generateEffect(prng, effects, `items_accessory_%3_${i}`); // prettier-ignore
      [effect4, effect4Value] = generateEffect(prng, effects, `items_accessory_%4_${i}`); // prettier-ignore
    }

    // Stats

    if (options.items.stats === 0x1) {
      effect1Value *= prng.getFloat(0.5, 1.5, `items_accessory_effect1Value_1_${i}`); // prettier-ignore
      effect2Value *= prng.getFloat(0.5, 1.5, `items_accessory_effect2Value_1_${i}`); // prettier-ignore
      effect3Value *= prng.getFloat(0.5, 1.5, `items_accessory_effect3Value_1_${i}`); // prettier-ignore
      effect4Value *= prng.getFloat(0.5, 1.5, `items_accessory_effect4Value_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      effect1Value *= prng.getFloat(0.1, 4, `items_accessory_effect1Value_2_${i}`); // prettier-ignore
      effect2Value *= prng.getFloat(0.1, 4, `items_accessory_effect2Value_2_${i}`); // prettier-ignore
      effect3Value *= prng.getFloat(0.1, 4, `items_accessory_effect3Value_2_${i}`); // prettier-ignore
      effect4Value *= prng.getFloat(0.1, 4, `items_accessory_effect4Value_2_${i}`); // prettier-ignore
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_accessory_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_accessory_price_2_${i}`);
    }

    setInt(offset + 0x16, "uint16", price, { bigEndian: true }, 'accessories'); // prettier-ignore
    setInt(offset + 0x18, "uint8", effect1, {}, 'accessories'); // prettier-ignore
    setInt(offset + 0x1a, "int16", effect1Value, { bigEndian: true }, 'accessories'); // prettier-ignore
    setInt(offset + 0x1c, "uint8", effect2, {}, 'accessories'); // prettier-ignore
    setInt(offset + 0x1e, "int16", effect2Value, { bigEndian: true }, 'accessories'); // prettier-ignore
    setInt(offset + 0x20, "uint8", effect3, {}, 'accessories'); // prettier-ignore
    setInt(offset + 0x22, "int16", effect3Value, { bigEndian: true }, 'accessories'); // prettier-ignore
    setInt(offset + 0x24, "uint8", effect4, {}, 'accessories'); // prettier-ignore
    setInt(offset + 0x26, "int16", effect4Value, { bigEndian: true }, 'accessories'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.items.count; i += 0x1) {
    const offset = i * mainDolModels.items.length;

    // let effect = getInt(offset + 0x12, "uint8", {}, $dataViewAlt.items); // prettier-ignore
    let price = getInt(offset + 0x18, "uint16", { bigEndian: true }, $dataViewAlt.items); // prettier-ignore
    let effectValue = getInt(offset + 0x1c, "int16", { bigEndian: true }, $dataViewAlt.items); // prettier-ignore

    // Effects

    // if (options.items.effects === 0x1) {
    //   [effect, effectValue] = generateEffect(prng, abilityEffects, `items_item_%_${i}`); // prettier-ignore
    // }

    // Stats

    if (options.items.stats === 0x1) {
      effectValue *= prng.getFloat(0.5, 1.5, `items_item_effectValue_1_${i}`);
    } else if (options.items.stats === 0x2) {
      effectValue *= prng.getFloat(0.1, 4, `items_item_effectValue_2_${i}`);
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_item_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_item_price_2_${i}`);
    }

    // setInt(offset + 0x12, "uint8", effect, {}, 'items'); // prettier-ignore
    setInt(offset + 0x18, "uint16", price, { bigEndian: true }, 'items'); // prettier-ignore
    setInt(offset + 0x1c, "int16", effectValue, { bigEndian: true }, 'items'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.keyItems.count; i += 0x1) {
    const offset = i * mainDolModels.keyItems.length;

    let price = getInt(offset + 0x14, "uint16", { bigEndian: true }, $dataViewAlt.keyItems); // prettier-ignore

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_keyItem_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_keyItem_price_2_${i}`);
    }

    setInt(offset + 0x14, "uint16", price, { bigEndian: true }, 'keyItems'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.shipWeapons.count; i += 0x1) {
    const offset = i * mainDolModels.shipWeapons.length;

    let attack = getInt(offset + 0x14, "int16", { bigEndian: true }, $dataViewAlt.shipWeapons); // prettier-ignore
    let hit = getInt(offset + 0x16, "int16", { bigEndian: true }, $dataViewAlt.shipWeapons); // prettier-ignore
    let spirit = getInt(offset + 0x18, "int8", {}, $dataViewAlt.shipWeapons); // prettier-ignore
    let limit = getInt(offset + 0x19, "int8", {}, $dataViewAlt.shipWeapons); // prettier-ignore
    let effect = getInt(offset + 0x1a, "uint8", {}, $dataViewAlt.shipWeapons); // prettier-ignore
    let effectValue = getInt(offset + 0x1c, "int16", { bigEndian: true }, $dataViewAlt.shipWeapons); // prettier-ignore
    let price = getInt(offset + 0x1e, "uint16", { bigEndian: true }, $dataViewAlt.shipWeapons); // prettier-ignore

    // Effects

    if (options.items.effects === 0x1) {
      [effect, effectValue] = generateEffect(prng, shipEffects, `items_shipWeapon_%_${i}`); // prettier-ignore
    }

    // Stats

    if (options.items.stats === 0x1) {
      attack *= prng.getFloat(0.5, 1.5, `items_shipWeapon_attack_1_${i}`);
      spirit *= prng.getFloat(0.5, 1.5, `items_shipWeapon_attack_1_${i}`);
      limit *= prng.getFloat(0.5, 1.5, `items_shipWeapon_attack_1_${i}`);
      hit *= prng.getFloat(0.9, 1.1, `items_shipWeapon_hit_1_${i}`);
      effectValue *= prng.getFloat(0.5, 1.5, `items_shipWeapon_effectValue_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      attack *= prng.getFloat(0.1, 4, `items_shipWeapon_attack_2_${i}`);
      spirit *= prng.getFloat(0.1, 4, `items_shipWeapon_attack_2_${i}`);
      limit *= prng.getFloat(0.1, 4, `items_shipWeapon_attack_2_${i}`);
      hit *= prng.getFloat(0.5, 1.5, `items_shipWeapon_hit_2_${i}`);
      effectValue *= prng.getFloat(0.1, 4, `items_shipWeapon_effectValue_2_${i}`); // prettier-ignore
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_shipWeapon_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_shipWeapon_price_2_${i}`);
    }

    setInt(offset + 0x14, "int16", attack, { bigEndian: true }, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x16, "int16", hit, { bigEndian: true }, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x18, "int8", spirit, {}, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x19, "int8", limit, {}, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x1a, "uint8", effect, {}, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x1c, "int16", effectValue, { bigEndian: true }, 'shipWeapons'); // prettier-ignore
    setInt(offset + 0x1e, "uint16", price, { bigEndian: true }, 'shipWeapons'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.shipAccessories.count; i += 0x1) {
    const offset = i * mainDolModels.shipAccessories.length;

    let effect1 = getInt(offset + 0x12, "uint8", {}, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect1Value = getInt(offset + 0x14, "int16", { bigEndian: true }, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect2 = getInt(offset + 0x16, "uint8", {}, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect2Value = getInt(offset + 0x18, "int16", { bigEndian: true }, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect3 = getInt(offset + 0x1a, "uint8", {}, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect3Value = getInt(offset + 0x1c, "int16", { bigEndian: true }, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect4 = getInt(offset + 0x1e, "uint8", {}, $dataViewAlt.shipAccessories); // prettier-ignore
    let effect4Value = getInt(offset + 0x20, "int16", { bigEndian: true }, $dataViewAlt.shipAccessories); // prettier-ignore
    let price = getInt(offset + 0x22, "uint16", { bigEndian: true }, $dataViewAlt.shipAccessories); // prettier-ignore

    // Effects

    if (options.items.effects === 0x1) {
      [effect1, effect1Value] = generateEffect(prng, shipEffects, `items_shipAccessory_%1_${i}`); // prettier-ignore
      [effect2, effect2Value] = generateEffect(prng, shipEffects, `items_shipAccessory_%2_${i}`); // prettier-ignore
      [effect3, effect3Value] = generateEffect(prng, shipEffects, `items_shipAccessory_%3_${i}`); // prettier-ignore
      [effect4, effect4Value] = generateEffect(prng, shipEffects, `items_shipAccessory_%4_${i}`); // prettier-ignore
    }

    // Stats

    if (options.items.stats === 0x1) {
      effect1Value *= prng.getFloat(0.5, 1.5, `items_shipAccessory_effect1Value_1_${i}`); // prettier-ignore
      effect2Value *= prng.getFloat(0.5, 1.5, `items_shipAccessory_effect2Value_1_${i}`); // prettier-ignore
      effect3Value *= prng.getFloat(0.5, 1.5, `items_shipAccessory_effect3Value_1_${i}`); // prettier-ignore
      effect4Value *= prng.getFloat(0.5, 1.5, `items_shipAccessory_effect4Value_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      effect1Value *= prng.getFloat(0.1, 4, `items_shipAccessory_effect1Value_2_${i}`); // prettier-ignore
      effect2Value *= prng.getFloat(0.1, 4, `items_shipAccessory_effect2Value_2_${i}`); // prettier-ignore
      effect3Value *= prng.getFloat(0.1, 4, `items_shipAccessory_effect3Value_2_${i}`); // prettier-ignore
      effect4Value *= prng.getFloat(0.1, 4, `items_shipAccessory_effect4Value_2_${i}`); // prettier-ignore
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_shipAccessory_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_shipAccessory_price_2_${i}`);
    }

    setInt(offset + 0x12, "uint8", effect1, {}, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x14, "int16", effect1Value, { bigEndian: true }, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x16, "uint8", effect2, {}, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x18, "int16", effect2Value, { bigEndian: true }, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x1a, "uint8", effect3, {}, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x1c, "int16", effect3Value, { bigEndian: true }, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x1e, "uint8", effect4, {}, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x20, "int16", effect4Value, { bigEndian: true }, 'shipAccessories'); // prettier-ignore
    setInt(offset + 0x22, "uint16", price, { bigEndian: true }, 'shipAccessories'); // prettier-ignore
  }

  for (let i = 0x0; i < mainDolModels.shipItems.count; i += 0x1) {
    const offset = i * mainDolModels.shipItems.length;

    // let effect = getInt(offset + 0x12, "uint8", {}, $dataViewAlt.shipItems); // prettier-ignore
    let price = getInt(offset + 0x16, "uint16", { bigEndian: true }, $dataViewAlt.shipItems); // prettier-ignore
    let effectValue = getInt(offset + 0x1c, "int16", { bigEndian: true }, $dataViewAlt.shipItems); // prettier-ignore

    // Effects

    // if (options.items.effects === 0x1) {
    //   [effect, effectValue] = generateEffect(prng, shipAbilityEffects, `items_shipItem_%_${i}`); // prettier-ignore
    // }

    // Stats

    if (options.items.stats === 0x1) {
      effectValue *= prng.getFloat(0.5, 1.5, `items_shipItem_effectValue_1_${i}`); // prettier-ignore
    } else if (options.items.stats === 0x2) {
      effectValue *= prng.getFloat(0.1, 4, `items_shipItem_effectValue_2_${i}`); // prettier-ignore
    }

    // Prices

    if (options.items.prices === 0x1) {
      price *= prng.getFloat(0.5, 1.5, `items_shipItem_price_1_${i}`);
    } else if (options.items.prices === 0x2) {
      price *= prng.getFloat(0.1, 4, `items_shipItem_price_2_${i}`);
    }

    // setInt(offset + 0x12, "uint8", effect, {}, 'shipItems'); // prettier-ignore
    setInt(offset + 0x16, "uint16", price, { bigEndian: true }, 'shipItems'); // prettier-ignore
    setInt(offset + 0x1c, "int16", effectValue, { bigEndian: true }, 'shipItems'); // prettier-ignore
  }
}
