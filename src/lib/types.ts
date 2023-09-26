export type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ContentType =
  | "bitflags"
  | "checksum"
  | "component"
  | "container"
  | "group"
  | "list"
  | "section"
  | "tabs"
  | "variable";

export type DataType =
  | "bit"
  | "boolean"
  | "lower4"
  | "upper4"
  | "string"
  | DataTypeInt;

export type DataTypeInt =
  | "int8"
  | "int16"
  | "int24"
  | "int32"
  | "int64"
  | "uint8"
  | "uint16"
  | "uint24"
  | "uint32"
  | "uint64";

export type EditorType = "saveEditor" | "romEditor" | "randomizer";

export type IntOperation = { [operand: string]: number | IntOperationConvert };

export type IntOperationConvert = { from: TimeUnit; to: TimeUnit };

export type Item =
  | ItemBitflags
  | ItemBoolean
  | ItemChecksum
  | ItemComponent
  | ItemContainer
  | ItemGroup
  | ItemInt
  | ItemList
  | ItemSection
  | ItemString
  | ItemTabs;

export type ObjectKeyValue<T> = { key: string; value: T };

export type Palette = number[][];

export type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours";

export interface Manufacturer {
  id: string;
  name: string;
}

export interface Console {
  id: string;
  name: string;
  manufacturer: Manufacturer;
}

export interface Game {
  id: string;
  name: string;
  console: {
    id: string;
    name: string;
  };
  randomizer?: {
    regions: string[];
  };
  romEditor?: {
    regions: string[];
  };
  saveEditor?: {
    regions: string[];
  };
}

export interface GameJson {
  validator: {
    regions: { [key: string]: { [key: number]: any } };
    text: string;
    error: string;
  };
  checksums?: ItemChecksum[];
  items: Item[];
  resources?: {
    [key: string]:
      | { [key: number]: number | string }
      | { [key: number]: number | string }[]
      | string;
  };
  resourcesOrder?: {
    [key: string]: number[];
  };
}

export interface ItemBitflag {
  offset: number;
  bit: Bit;
  name: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemBitflagDivider {
  divider: true;
}

export interface ItemBitflags {
  id?: string;
  name?: string;
  type: "bitflags";
  flags: (ItemBitflag | ItemBitflagDivider)[];
  noMargin?: boolean;
  reversed?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemBoolean {
  id?: string;
  name?: string;
  offset: number;
  type: "variable";
  dataType: "boolean";
  resource?: string;
  overrideStep?: {
    parent: number;
    step: number;
  };
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemChecksum {
  id?: string;
  name?: string;
  offset: number;
  type: "checksum";
  dataType: DataTypeInt;
  bigEndian?: boolean;
  control: {
    offset: number;
    length: number;
  };
  overrideStep?: {
    parent: number;
    step: number;
  };
  hidden?: boolean;
}

export interface ItemComponent {
  type: "component";
  component: string;
  props?: { [key: string]: any };
}

export interface ItemContainer {
  id?: string;
  pointer?: number | number[];
  pointerDataType?: DataTypeInt;
  length: number;
  type: "container";
  instanceId?: string;
  instances: number;
  instanceType: "list" | "section" | "tabs";
  enumeration?: string;
  disableSubinstanceIf?: ItemIntCondition | string;
  prependSubinstance?: (ItemListElement | ItemTab)[];
  appendSubinstance?: (ItemListElement | ItemTab)[];
  enumerationOrder?: number[];
  flex?: boolean;
  resource?: string;
  items: Item[];
  hidden?: boolean;
}

export interface ItemContent {
  items: Item[];
  hidden?: boolean;
}

export interface ItemGroup {
  name?: string;
  type: "group";
  mode?: "chrono" | "fraction" | "time";
  items: ItemInt[];
  hidden?: boolean;
}

export interface ItemInt {
  id?: string;
  name?: string;
  offset: number;
  type: "variable";
  dataType: Exclude<DataType, "boolean" | "string">;
  bigEndian?: boolean;
  binaryCodedDecimal?: boolean;
  bit?: Bit;
  leadingZeros?: number;
  min?: number;
  max?: number;
  step?: number;
  operations?: IntOperation[];
  resource?: string;
  autocomplete?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemIntCondition {
  offset: number;
  type: "variable";
  dataType: Exclude<DataType, "boolean" | "string">;
  bigEndian?: boolean;
  value: number;
}

export interface ItemList {
  id?: string;
  type: "list";
  enumeration?: string;
  enumerationOrder?: number[];
  resource?: string;
  items: ItemListElement[];
  hidden?: boolean;
}

export interface ItemListElement {
  name: string;
  flex?: boolean;
  disableElementIf?: ItemIntCondition | string;
  items: Item[];
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemSection {
  name?: string;
  type: "section";
  background?: boolean;
  flex?: boolean;
  noMargin?: true;
  items: Item[];
  hidden?: boolean;
}

export interface ItemString {
  id?: string;
  name?: string;
  offset: number;
  length: number;
  type: "variable";
  dataType: "string";
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32";
  fallback?: number;
  bigEndian?: boolean;
  resource?: string;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemTab {
  name: string;
  flex?: boolean;
  disableTabIf?: ItemIntCondition | string;
  items: Item[];
  disabled?: boolean;
  hidden?: boolean;
  planned?: boolean;
}

export interface ItemTabs {
  id?: string;
  type: "tabs";
  enumeration?: string;
  enumerationOrder?: number[];
  resource?: string;
  items: ItemTab[];
  hidden?: boolean;
}
