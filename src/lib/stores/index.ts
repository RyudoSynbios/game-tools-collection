import { writable } from "svelte/store";

import type { DataViewAltMetas, DebugOptions, GameJson } from "$lib/types";

import { getLocalStorage } from "../utils/format";

const lsDebugOptions = JSON.parse(getLocalStorage("debugOptions") || "{}");

export const dataJson = writable<any>();
export const dataView = writable<DataView>(new DataView(new ArrayBuffer(0)));
export const dataViewAlt = writable<{ [key: string]: DataView }>({});
export const dataViewAltMetas = writable<{
  [key: string]: DataViewAltMetas | undefined;
}>({});
export const debugOptions = writable<DebugOptions>(lsDebugOptions);
export const fileHeaderShift = writable(0x0);
export const fileName = writable("");
export const gameJson = writable({} as GameJson);
export const gameRegion = writable(-1);
export const gameTemplate = writable({} as GameJson);
export const gameUtils = writable({}) as any;
export const isDebug = writable(getLocalStorage("debug") === "true");
export const isDirty = writable(false);
export const isFileVisualizerOpen = writable(false);
export const locale = writable<string>("");
