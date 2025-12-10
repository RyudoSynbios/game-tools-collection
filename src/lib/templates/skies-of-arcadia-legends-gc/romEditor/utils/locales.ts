import { get } from "svelte/store";

import { dataViewAlt, gameRegion } from "$lib/stores";
import { getInt, intToArray } from "$lib/utils/bytes";
import { getFile, writeFile } from "$lib/utils/common/gamecube";
import { getRegionArray, mergeUint8Arrays } from "$lib/utils/format";

import { offsetToDescriptionPointers, offsetToMainDolStart } from "../template";
import { getModelShift } from "./dataView";
import { abilityTypes, mainDolModels } from "./resource";

export const NAME_LENGTH = 0x20;
export const NAME_LENGTH_OFFSET = NAME_LENGTH - 0x1;
export const DESCRIPTION_LENGTH = 0x80;
export const DESCRIPTION_LENGTH_OFFSET = DESCRIPTION_LENGTH - 0x1;
export const LOCALE_LENGTH = NAME_LENGTH + DESCRIPTION_LENGTH;

function getLocaleString(offset: number, dataView: DataView): number[] {
  const name = [];

  for (let i = 0x0; i < DESCRIPTION_LENGTH - 0x1; i += 0x1) {
    const code = getInt(offset, "uint8", {}, dataView);

    if (code === 0x0) {
      break;
    } else if (code === 0xa) {
      name.push(0x5c, 0x6e);
    } else {
      name.push(code);
    }

    offset += 0x1;
  }

  return name;
}

// prettier-ignore
function setLocaleString(
  type: "name" | "description",
  offsetSrc: number,
  offsetDst: number,
  dataViewSrc: DataView,
  data: Uint8Array,
): number {
  const $gameRegion = get(gameRegion);

  const isNonEuropeDescription = $gameRegion !== 0 && type === "description";

  let stringLengthOffset = NAME_LENGTH_OFFSET;
  let maxLength = NAME_LENGTH;

  if (type === "description") {
    stringLengthOffset = DESCRIPTION_LENGTH_OFFSET;
    maxLength = DESCRIPTION_LENGTH;
  }

  if (isNonEuropeDescription) {
    maxLength = getInt(offsetSrc + stringLengthOffset, "uint8", {}, dataViewSrc);
  }

  let length = 0x0;

  while (length < maxLength) {
    let code8 = getInt(offsetSrc + length, "uint8", {}, dataViewSrc);
    let code16 = getInt(offsetSrc + length, "uint16", { bigEndian: true }, dataViewSrc);

    if (code8 === 0x0) {
      break;
    } else if ($gameRegion !== 0 && code16 === 0x5c6e) {
      code8 = 0xa;
      length += 0x1;
    }

    data[offsetDst] = code8;
    length += 0x1;
    offsetDst += 0x1;
  }

  data[offsetDst] = 0x0;

  if (isNonEuropeDescription) {
    while (length < maxLength) {
      data[offsetDst] = 0x20;
      length += 0x1;
      offsetDst += 0x1;
    }
  }

  return length;
}

const sotFiles = ["english.sot", "french.sot", "german.sot", "spanish.sot"];

// prettier-ignore
export function generateEuropeLocales(): void {
  const $dataViewAlt = get(dataViewAlt);

  const dataLocales: { [name: string]: Uint8Array } = {};

  sotFiles.forEach((sotFile, index) => {
    const locale = getFile(sotFile);

    if (!locale) {
      return;
    }

    Object.entries(mainDolModels).forEach(([name, model]) => {
      if (!model.hasName) {
        return;
      }

      if (!dataLocales[name]) {
        const length = model.count * LOCALE_LENGTH * sotFiles.length;

        dataLocales[name] = new Uint8Array(length);
      }

      let nameOffset = getInt(model.europe.namePointer, "uint32", {}, locale.dataView);
      let descriptionOffset = getInt(model.europe.descriptionPointer, "uint32", {}, locale.dataView);
      let localeOffset = index * model.count * LOCALE_LENGTH;

      for (let i = 0; i < model.count; i += 1) {
        const localeName = getLocaleString(nameOffset, locale.dataView);

        dataLocales[name].set(localeName, localeOffset);

        nameOffset += localeName.length + 0x1;
        localeOffset += NAME_LENGTH;

        if (model.hasDescription) {
          const localeDescription = getLocaleString(descriptionOffset, locale.dataView);

          dataLocales[name].set(localeDescription, localeOffset);

          descriptionOffset += localeDescription.length + 0x1;
        }

        localeOffset += DESCRIPTION_LENGTH;
      }
    });
  });

  Object.entries(dataLocales).forEach(([name, data]) => {
    $dataViewAlt[`${name}Locales`] = new DataView(data.buffer);
  });
}

// prettier-ignore
export function generateNonEuropeLocales(): void {
  const $dataViewAlt = get(dataViewAlt);

  const dataLocales: { [name: string]: Uint8Array } = {};

  let pointerOffset = getRegionArray(offsetToDescriptionPointers);

  Object.entries(mainDolModels).forEach(([name, model]) => {
    if (!model.hasName) {
      return;
    }

    if (!dataLocales[name]) {
      dataLocales[name] = new Uint8Array(model.count * LOCALE_LENGTH);
    }

    if (name === "crew") {
      pointerOffset += abilityTypes[0].count * 0x4;
    }

    let nameOffset = 0x0;
    let localeOffset = 0x0;

    for (let i = 0; i < model.count; i += 1) {
      const localeName = getLocaleString(nameOffset, $dataViewAlt[name]);

      dataLocales[name].set(localeName, localeOffset);

      nameOffset += model.length;
      localeOffset += NAME_LENGTH;

      if (model.hasDescription) {
        const descriptionOffset = getInt(pointerOffset, "uint32", { bigEndian: true }, $dataViewAlt["main.dol"]) - 0x80003000;

        const localeDescription = getLocaleString(descriptionOffset, $dataViewAlt["main.dol"]);

        dataLocales[name].set(localeDescription, localeOffset);
        dataLocales[name][localeOffset + DESCRIPTION_LENGTH_OFFSET] = localeDescription.length;

        pointerOffset += 0x4;
      }

      localeOffset += DESCRIPTION_LENGTH;
    }
  });

  Object.entries(dataLocales).forEach(([name, data]) => {
    $dataViewAlt[`${name}Locales`] = new DataView(data.buffer);
  });
}

// prettier-ignore
export function writeEuropeLocales(): void {
  const $dataViewAlt = get(dataViewAlt);

  sotFiles.forEach((sotFile, index) => {
    const locale = getFile(sotFile);

    if (!locale) {
      return;
    }

    const sotSections: { [offset: number]: Uint8Array } = {};

    const count = getInt(0x0, "uint32", {}, locale.dataView);

    for (let i = 0x0; i < count; i += 0x1) {
      const offset = getInt(0x30 + i * 0x30, "uint32", {}, locale.dataView);
      const size = getInt(0x3c + i * 0x30, "uint32", {}, locale.dataView);

      sotSections[0x30 + i * 0x30] = new Uint8Array(
        locale.dataView.buffer,
      ).slice(offset, offset + size);
    }

    Object.entries(mainDolModels).forEach(([name, model]) => {
      if (!model.hasName) {
        return;
      }

      const namesData = new Uint8Array(model.count * NAME_LENGTH);
      const descriptionsData = new Uint8Array(model.count * DESCRIPTION_LENGTH);

      let nameOffset = 0x0;
      let descriptionOffset = 0x0;
      let localeOffset = index * model.count * LOCALE_LENGTH;

      for (let i = 0; i < model.count; i += 1) {
        const nameLength = setLocaleString("name", localeOffset, nameOffset, $dataViewAlt[`${name}Locales`], namesData);

        nameOffset += nameLength + 0x1;
        localeOffset += NAME_LENGTH;

        if (model.hasDescription) {
          const descriptionLength = setLocaleString("description", localeOffset, descriptionOffset, $dataViewAlt[`${name}Locales`], descriptionsData);

          descriptionOffset += descriptionLength + 0x1;
        }

        localeOffset += DESCRIPTION_LENGTH;
      }

      sotSections[model.europe.namePointer] = namesData.slice(0x0, nameOffset);

      if (model.hasDescription) {
        sotSections[model.europe.descriptionPointer] = descriptionsData.slice(0x0, descriptionOffset);
      }
    });

    let offset = getInt(0x30, "uint32", {}, locale.dataView);

    const header = new Uint8Array(locale.dataView.buffer).slice(0x0, offset);

    const uint8Arrays: Uint8Array[] = [];

    Object.values(sotSections).forEach((data, index) => {
      header.set(intToArray(offset, "uint32"), 0x30 + index * 0x30);
      header.set(intToArray(data.byteLength, "uint32"), 0x3c + index * 0x30);

      uint8Arrays.push(data);

      offset += data.byteLength;
    });

    const data = mergeUint8Arrays(header, ...uint8Arrays);

    writeFile(sotFile, new DataView(data.buffer));
  });
}

// prettier-ignore
export function writeNonEuropeLocales(data: Uint8Array): void {
  const $dataViewAlt = get(dataViewAlt);

  let nameOffset = getRegionArray(offsetToMainDolStart);
  let pointerOffset = getRegionArray(offsetToDescriptionPointers);

  Object.entries(mainDolModels).forEach(([name, model]) => {
    if (!model.hasName) {
      nameOffset += getModelShift(model);
      return;
    }

    if (name === "crew") {
      pointerOffset += 0x24 * 0x4;
    }

    let localeOffset = 0x0;

    for (let i = 0; i < model.count; i += 1) {
      setLocaleString("name", localeOffset, nameOffset, $dataViewAlt[`${name}Locales`], data);

      nameOffset += model.length;
      localeOffset += NAME_LENGTH;

      if (model.hasDescription) {
        const descriptionOffset = getInt(pointerOffset, "uint32", { bigEndian: true }, $dataViewAlt["main.dol"]) - 0x80003000;

        setLocaleString("description", localeOffset, descriptionOffset, $dataViewAlt[`${name}Locales`], data);

        pointerOffset += 0x4;
      }

      localeOffset += DESCRIPTION_LENGTH;
    }
  });
}
