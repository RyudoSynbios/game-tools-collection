import { setInt } from "$lib/utils/bytes";
import Prng from "$lib/utils/prng";

import { mainDolModels } from "../../romEditor/utils/resource";
import { Options } from "../utils";

export function randomizeGeneral(prng: Prng, options: Options): void {
  if (options.general.weaponMoonStonesColor === 0x0) {
    return;
  }

  // Moon Stones Color

  // prettier-ignore
  if (options.general.weaponMoonStonesColor === 0x1) {
    for (let i = 0x0; i < mainDolModels.weaponColors.count; i += 0x1) {
      const offset = i * mainDolModels.weaponColors.length;

      const red = prng.getFloat(0, 1, `general_weaponMoonStonesColor_red_1_${i}`);
      const green = prng.getFloat(0, 1, `general_weaponMoonStonesColor_green_1_${i}`);
      const blue = prng.getFloat(0, 1, `general_weaponMoonStonesColor_blue_1_${i}`);

      setInt(offset, "float32", red, { bigEndian: true }, 'weaponColors');
      setInt(offset + 0x4, "float32", green, { bigEndian: true }, 'weaponColors');
      setInt(offset + 0x8, "float32", blue, { bigEndian: true }, 'weaponColors');
    }
  }
}
