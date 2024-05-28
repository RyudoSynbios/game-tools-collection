import { get } from "svelte/store";

import { isDebug } from "$lib/stores";

class Debug {
  public clear(): void {
    const $isDebug = get(isDebug);

    if ($isDebug) {
      console.clear();
    }
  }

  public color(data: any, color: number | string): void {
    const $isDebug = get(isDebug);

    if ($isDebug) {
      console.log(`%c${data}`, `color: ${color};`);
    }
  }

  public error(...data: any[]): void {
    const $isDebug = get(isDebug);

    if ($isDebug) {
      console.error(...data);
    }
  }

  public log(...data: any[]): void {
    const $isDebug = get(isDebug);

    if ($isDebug) {
      console.log(...data);
    }
  }

  public warn(...data: any[]): void {
    const $isDebug = get(isDebug);

    if ($isDebug) {
      console.warn(...data);
    }
  }
}

const debug = new Debug();

export default debug;
