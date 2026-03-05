import FileSaver from "file-saver";
import { get } from "svelte/store";

import { debugOptions, isDebug } from "$lib/stores";

class Debug {
  private requiredOption: string;

  constructor() {
    this.requiredOption = "";
  }

  private canPrint(): boolean {
    const $debugOptions = get(debugOptions);
    const $isDebug = get(isDebug);

    let boolean = false;

    if (
      $isDebug &&
      (this.requiredOption === "" || $debugOptions[this.requiredOption])
    ) {
      boolean = true;
    }

    this.requiredOption = "";

    return boolean;
  }

  public clear(): void {
    if (this.canPrint()) {
      console.clear();
    }
  }

  public color(data: unknown, color: number | string): void {
    if (this.canPrint()) {
      console.log(`%c${data}`, `color: ${color};`);
    }
  }

  public dump(
    data: Uint8Array | Uint16Array | Uint32Array,
    name = "dump",
  ): void {
    const blob = new Blob([JSON.stringify(data)], {
      type: "octet-stream/json",
    });

    FileSaver.saveAs(blob, name);
  }

  public error(...data: unknown[]): void {
    if (this.canPrint()) {
      console.error(...data);
    }
  }

  public log(...data: unknown[]): void {
    if (this.canPrint()) {
      console.log(...data);
    }
  }

  public warn(...data: unknown[]): void {
    if (this.canPrint()) {
      console.warn(...data);
    }
  }

  public option(option: string): Debug {
    this.requiredOption = option;
    return this;
  }
}

const debug = new Debug();

export default debug;
