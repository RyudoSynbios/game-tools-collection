import { getInt, getString } from "../bytes";
import { checkValidator } from "../validator";

interface Cpk {
  film: Film;
  fdsc: Fdsc;
  stab: Stab;
}

interface Film {
  signature: string;
  length: number;
  formatVersion: string;
}

interface Fdsc {
  signature: string;
  length: number;
  videoCodec: string;
  videoHeight: number;
  videoWidth: number;
  videoBpp: number;
  audioChannels: number;
  audioSamplingResolution: number;
  audioCompression: number;
  audioSamplingFrequency: number;
}

interface Stab {
  signature: string;
  length: number;
  baseFramerate: number;
  sampleTableEntryCount: number;
  sampleTable: SampleEntry[];
}

interface SampleEntry {
  offset: number;
  length: number;
  sampleInfo1: number;
  sampleInfo2: number;
  cvidHeader: {
    flags: number;
    length: number;
    width: number;
    height: number;
    stripCount: number;
  };
}

export function isCpk(dataView: DataView): boolean {
  const validator = [0x46, 0x49, 0x4c, 0x4d]; // "FILM"

  return checkValidator(validator, 0x0, dataView);
}

export function unpackCpk(dataView: DataView): Cpk {
  const cpk = {} as Cpk;

  // Film

  cpk.film = {} as Film;

  cpk.film.signature = getString(0x0, 0x4, "uint8", {}, dataView);
  cpk.film.length = getInt(0x4, "uint32", { bigEndian: true }, dataView);
  cpk.film.formatVersion = getString(0x8, 0x4, "uint8", {}, dataView);

  // FDSC

  cpk.fdsc = {} as Fdsc;

  cpk.fdsc.signature = getString(0x10, 0x4, "uint8", {}, dataView);
  cpk.fdsc.length = getInt(0x14, "uint32", { bigEndian: true }, dataView);
  cpk.fdsc.videoCodec = getString(0x18, 0x4, "uint8", {}, dataView);
  cpk.fdsc.videoHeight = getInt(0x1c, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  cpk.fdsc.videoWidth = getInt(0x20, "uint32", { bigEndian: true }, dataView);
  cpk.fdsc.videoBpp = getInt(0x24, "uint8", {}, dataView);
  cpk.fdsc.audioChannels = getInt(0x25, "uint8", {}, dataView);
  cpk.fdsc.audioSamplingResolution = getInt(0x26, "uint8", {}, dataView);
  cpk.fdsc.audioCompression = getInt(0x27, "uint8", {}, dataView);
  cpk.fdsc.audioSamplingFrequency = getInt(0x28, "uint16", { bigEndian: true }, dataView); // prettier-ignore

  cpk.stab = {} as Stab;

  cpk.stab.signature = getString(0x30, 0x4, "uint8", {}, dataView);
  cpk.stab.length = getInt(0x34, "uint32", { bigEndian: true }, dataView);
  cpk.stab.baseFramerate = getInt(0x38, "uint32", { bigEndian: true }, dataView); // prettier-ignore
  cpk.stab.sampleTableEntryCount = getInt(0x3c, "uint32", { bigEndian: true }, dataView); // prettier-ignore

  cpk.stab.sampleTable = [
    ...Array(cpk.stab.sampleTableEntryCount).keys(),
  ].reduce((entries: SampleEntry[], index) => {
    const offset = cpk.film.length + getInt(0x40 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const length = cpk.film.length + getInt(0x44 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const sampleInfo1 = getInt(0x48 + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore
    const sampleInfo2 = getInt(0x4c + index * 0x10, "uint32", { bigEndian: true }, dataView); // prettier-ignore

    entries.push({
      offset,
      length,
      sampleInfo1,
      sampleInfo2,
      cvidHeader: {
        flags: getInt(offset, "uint8", {}, dataView),
        length: getInt(offset + 0x1, "uint24", { bigEndian: true }, dataView),
        width: getInt(offset + 0x4, "uint16", { bigEndian: true }, dataView),
        height: getInt(offset + 0x6, "uint16", { bigEndian: true }, dataView),
        stripCount: getInt(offset + 0x8, "uint16", { bigEndian: true }, dataView), // prettier-ignore
      },
    });

    return entries;
  }, []);

  return cpk;
}
