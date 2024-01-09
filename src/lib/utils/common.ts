import { getInt } from "./bytes";

// Sony: Playstation

export function checkPlaystationSlots(
  index: number,
  validators: number[][],
): boolean {
  const offset = (index + 1) * 0x80 + 0xa;
  const length = validators[0].length;

  for (let i = offset; i < offset + length; i += 0x1) {
    if (
      validators.every(
        (validator) => getInt(i, "uint8") !== validator[i - offset],
      )
    ) {
      return false;
    }
  }

  if (getInt(offset - 0xa, "uint8") !== 0x51) {
    return false;
  }

  return true;
}
