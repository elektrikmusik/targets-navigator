// Unified filtering system type definitions

export type FilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "greater"
  | "greater_equal"
  | "less"
  | "less_equal"
  | "between"
  | "in"
  | "not_in"
  | "is_null"
  | "is_not_null";

export type FilterFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "multiSelect"
  | "boolean"
  | "range";

export type FilterLogic = "AND" | "OR";

export interface FilterField {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: Array<{ value: unknown; label: string; count?: number }>;
  operators: FilterOperator[];
  placeholder?: string;
  unit?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };
}

export interface FilterExpression {
  id: string;
  field: string;
  operator: FilterOperator;
  value: unknown;
  logic?: FilterLogic;
  groupId?: string;
}

export interface FilterGroup {
  id: string;
  expressions: FilterExpression[];
  logic: FilterLogic;
}

export interface FilterState {
  expressions: FilterExpression[];
  groups: FilterGroup[];
  globalSearch: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  pageSize: number;
  currentPage: number;
}

export interface FilterOptions {
  countries: string[];
  ceresRegions: string[];
  tiers: string[];
  companyStates: string[];
}

export interface FilterResult<T> {
  data: T[];
  totalCount: number;
  filteredCount: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface FilterAnalytics {
  filterType: string;
  field: string;
  operator: FilterOperator;
  timestamp: number;
  resultCount: number;
}

// Type guards for runtime type checking
export const isString = (value: unknown): value is string => typeof value === "string";
export const isNumber = (value: unknown): value is number => typeof value === "number";
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
export const isArray = (value: unknown): value is unknown[] => Array.isArray(value);
export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// Utility types for filter values
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | { min?: number; max?: number }
  | unknown[];

export interface FilterValidationError {
  field: string;
  message: string;
  code: "INVALID_VALUE" | "MISSING_REQUIRED" | "OUT_OF_RANGE" | "INVALID_FORMAT";
}

export interface FilterValidationResult {
  isValid: boolean;
  errors: FilterValidationError[];
}
