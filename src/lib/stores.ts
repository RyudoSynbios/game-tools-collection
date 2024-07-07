import { writable } from "svelte/store";

import type { GameJson } from "$lib/types";

import { getLocalStorage } from "./utils/format";

export const dataView = writable(new DataView(new ArrayBuffer(0)));
export const fileIsLoading = writable(false);
export const fileHeaderShift = writable(0x0);
export const fileName = writable("");
export const gameJson = writable({} as GameJson);
export const gameRegion = writable(-1);
export const gameTemplate = writable({} as GameJson);
export const gameUtils = writable({}) as any;
export const isDebug = writable(getLocalStorage("debug"));
export const isDirty = writable(false);
export const isFileVisualizerOpen = writable(false);
