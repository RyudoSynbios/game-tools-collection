import { get } from "svelte/store";

import { debugOptions } from "$lib/stores";
import { setLocalStorage } from "$lib/utils/format";

import "$lib/utils/prototype";

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  window.debugGTC = {
    toggleTool: (tool: string) => {
      const $debugOptions = get(debugOptions);

      $debugOptions[tool] = !$debugOptions[tool];

      debugOptions.set($debugOptions);

      setLocalStorage("debugOptions", `${JSON.stringify($debugOptions)}`);
    },
  };
}
