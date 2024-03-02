export type Bit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
  | ItemSection
  | ItemString
  | ItemTabs;

export type ObjectKeyValue<T> = { key: string; value: T };

export type Palette = number[][];

export type RegionValidator = Validator | LogicalOperator<Validator>;

export type Validator = { [key: number]: number[] };

export type TimeUnit = "milliseconds" | "seconds" | "minutes" | "hours";

export interface Binary {
  bitStart: Bit;
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
    regions: { [key: string]: RegionValidator };
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
  label: string;
  separator?: boolean;
  disabled?: boolean;
  hidden?: boolean;
}

export interface ItemBitflags {
  id?: string;
  name?: string;
  type: "bitflags";
  flags: ItemBitflag[];
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
  overrideShift?: {
    parent: number;
    shift: number;
  };
  disabled?: boolean;
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
  instanceType: "section" | "tabs";
  enumeration?: string;
  disableSubinstanceIf?:
    | ItemIntCondition
    | LogicalOperator<ItemIntCondition>
    | string;
  prependSubinstance?: ItemTab[];
  appendSubinstance?: ItemTab[];
  enumerationOrder?: number[];
  resource?: string;
  vertical?: boolean;
  flex?: boolean;
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
  binary?: Binary;
  binaryCodedDecimal?: boolean;
  bit?: Bit;
  disableIfNegative?: boolean;
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
  autocomplete?: boolean;
  suffix?: string;
  disabled?: boolean;
  hidden?: boolean;
  test?: boolean;
}

export interface ItemIntCondition {
  offset: number;
  type: "variable";
  dataType: Exclude<DataType, "boolean" | "string">;
  bigEndian?: boolean;
  value: number;
}

export interface ItemSection {
  id?: string;
  name?: string;
  type: "section";
  background?: boolean;
  flex?: boolean;
  flex1?: boolean;
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
  bigEndian?: boolean;
  letterDataType: "uint8" | "uint16" | "uint24" | "uint32";
  letterBigEndian?: boolean;
  fallback?: number;
  resource?: string;
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
  vertical?: boolean;
  enumeration?: string;
  enumerationOrder?: number[];
  resource?: string;
  items: ItemTab[];
  hidden?: boolean;
}

export interface LogicalOperator<T> {
  $and?: (LogicalOperator<T> | T)[];
  $or?: (LogicalOperator<T> | T)[];
}
