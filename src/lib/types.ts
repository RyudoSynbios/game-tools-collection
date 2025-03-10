export type Color = [number, number, number, number];

export type ColorType =
  | "ABGR555"
  | "ARGB555"
  | "ARGB8888"
  | "BGR333"
  | "BGR555"
  | "RGB555"
  | "RGB565"
  | "RGB5A3"
  | "RGBA555";

export type ContentType =
  | "bitflags"
  | "checksum"
  | "component"
  | "container"
  | "group"
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
  | "uint64"
  | "float32";

export type DebugTools = {
  showInputValues?: boolean;
  showTabIndexes?: boolean;
};

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
  | ItemSection
  | ItemString
  | ItemTabs;

export type ObjectKeyValue<T> = { key: string; value: T };

export type Palette = Color[];

export type RegionValidator = Validator | LogicalOperator<Validator>;

export type Resource = { [key: number]: string };

export type Resources = {
  [key: string]: Resource | Resource[] | string;
};

export type ResourceGroups = { name: string; options: number[] }[];

export type ResourceLabels = { [key: number]: string };

export type TimeUnit =
  | "milliseconds"
  | "seconds"
  | "minutes"
  | "hours"
  | "day"
  | "month"
  | "year";

export type Validator = { [key: number]: number[] };

export interface Binary {
  bitStart: number;
  bitLength: number;
}

export interface Manufacturer {
  id: string;
  name: string;
}

export interface Console {
  id: string;
  name: string;
  manufacturer: Manufacturer;
}

export interface DataViewAltMetas {
  isDirty?: boolean;
  patch?: { [offset: number]: bigint | number };
}

export interface Game {
  id: string;
  name: string;
  console: {
    id: string;
    name: string;
  };
  createdAt: string;
  tools: {
    saveEditor?: {
      regions: string[];
    };
    romEditor?: {
      regions: string[];
    };
    randomizer?: {
      regions: string[];
    };
  };
}

export interface GameJson {
  validator: {
    fileNames?: (RegExp | string)[];
    regions: { [key: string]: RegionValidator | boolean };
    text: string;
    hint?: string;
    error: string;
  };
  checksums?: ItemChecksum[];
  items: Item[];
  resources?: Resources;
  resourcesGroups?: {
    [key: string]: ResourceGroups | string;
  };
  resourcesLabels?: {
    [key: string]: ResourceLabels;
  };
  resourcesOrder?: {
    [key: string]: number[];
  };
}

export interface ItemBitflag {
  offset: number;
  bit: number;
  label: string;
  reversed?: boolean;
  separator?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemBitflags {
  id?: string;
  name?: string;
  dataViewAltKey?: string;
  type: "bitflags";
  flags: ItemBitflag[];
  hint?: string;
  noMargin?: boolean;
  reversed?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemBoolean {
  id?: string;
  name?: string;
  dataViewAltKey?: string;
  offset: number;
  type: "variable";
  dataType: "boolean";
  on?: number;
  off?: number;
  resource?: string;
  overrideShift?: {
    parent: number;
    shift: number;
  };
  separator?: boolean;
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
    offsetStart: number;
    offsetEnd: number;
  };
  order?: number;
  overrideShift?: {
    parent: number;
    shift: number;
  };
  disabled?: boolean;
}

export interface ItemComponent {
  type: "component";
  component: string;
  props?: { [key: string]: any };
}

export interface ItemContainer {
  id?: string;
  instanceId?: string;
  pointer?: number | number[];
  pointerDataType?: DataTypeInt;
  length: number;
  type: "container";
  instances: number;
  instanceType: "section" | "tabs";
  enumeration?: string;
  disableSubinstanceIf?:
    | ItemIntCondition
    | LogicalOperator<ItemIntCondition>
    | string;
  prependSubinstance?: ItemTab[];
  appendSubinstance?: ItemTab[];
  resource?: string;
  resourceOrder?: boolean;
  defaultIndex?: number;
  vertical?: boolean;
  onTabChange?: string;
  flex?: boolean;
  noMargin?: boolean;
  items: Item[];
  hidden?: boolean;
}

export interface ItemContent {
  items: Item[];
  hidden?: boolean;
}

export interface ItemGroup {
  id?: string;
  name?: string;
  type: "group";
  mode?: "chrono" | "date" | "fraction" | "time";
  items: ItemInt[];
  hint?: string;
  hidden?: boolean;
}

export interface ItemInt {
  id?: string;
  name?: string;
  dataViewAltKey?: string;
  offset: number;
  type: "variable";
  dataType: Exclude<DataType, "boolean" | "string">;
  bigEndian?: boolean;
  binary?: Binary;
  binaryCodedDecimal?: boolean;
  hex?: boolean;
  bit?: number;
  leadingZeros?: number;
  operations?: IntOperation[];
  min?: number;
  max?: number;
  step?: number;
  resource?: string;
  overrideShift?: {
    parent: number;
    shift: number;
  };
  size?: "md" | "lg";
  autocomplete?: boolean;
  button?: {
    label: string;
    action: string;
  };
  uncontrolled?: boolean;
  hint?: string;
  prefix?: string;
  suffix?: string;
  disableIfNegative?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  test?: boolean;
}

export interface ItemIntCondition {
  dataViewAltKey?: string;
  offset: number;
  type: "variable";
  dataType: Exclude<DataType, "boolean" | "string">;
  bigEndian?: boolean;
  binary?: Binary;
  bit?: number;
  operator: "=" | "!=" | ">" | ">=" | "<" | "<=";
  value: number;
}

export interface ItemSection {
  id?: string;
  name?: string;
  type: "section";
  background?: boolean;
  flex?: boolean;
  flex1?: boolean;
  noMargin?: boolean;
  items: Item[];
  hidden?: boolean;
}

export interface ItemString {
  id?: string;
  name?: string;
  dataViewAltKey?: string;
  offset: number;
  length: number;
  type: "variable";
  dataType: "string";
  bigEndian?: boolean;
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32";
  letterBigEndian?: boolean;
  fallback?: number;
  zeroTerminated?: boolean;
  regex?: string;
  resource?: string;
  overrideShift?: {
    parent: number;
    shift: number;
  };
  size?: "md" | "lg";
  disabled?: boolean;
  hidden?: boolean;
  test?: boolean;
}

export interface ItemTab {
  id?: string;
  name: string;
  flex?: boolean;
  disableTabIf?: ItemIntCondition | LogicalOperator<ItemIntCondition> | string;
  items: Item[];
  disabled?: boolean;
  hidden?: boolean;
  planned?: boolean;
}

export interface ItemTabs {
  id?: string;
  type: "tabs";
  enumeration?: string;
  resource?: string;
  resourceOrder?: boolean;
  defaultIndex?: number;
  indexes?: boolean;
  vertical?: boolean;
  onTabChange?: string;
  items: ItemTab[];
  hidden?: boolean;
}

export interface LogicalOperator<T> {
  $and?: (LogicalOperator<T> | T)[];
  $or?: (LogicalOperator<T> | T)[];
}

export interface Patch<T> {
  identifier: string;
  version: string;
  data: T;
}
