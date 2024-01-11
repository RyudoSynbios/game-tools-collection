import { writable } from "svelte/store";

import type { GameJson } from "$lib/types";

let debug = false;

const isBrowser = typeof window !== "undefined";

if (isBrowser && localStorage.debug === "true") {
  debug = true;
}

export const dataView = writable(new DataView(new ArrayBuffer(0)));
export const fileIsLoading = writable(false);
export const fileHeaderShift = writable(0x0);
export const fileName = writable("");
export const gameJson = writable({} as GameJson);
export const gameRegion = writable(-1);
export const gameTemplate = writable({} as GameJson);
export const gameUtils = writable({}) as any;
export const isDebug = writable(debug);
export const isDirty = writable(false);
export const isFileVisualizerOpen = writable(false);
