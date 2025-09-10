export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ColumnMeta {
  variant?: "text" | "number" | "range" | "date" | "dateRange" | "select" | "multiSelect";
  label?: string;
  placeholder?: string;
  options?: Option[];
  unit?: string;
}

// Extend TanStack Table's ColumnMeta
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    variant?: "text" | "number" | "range" | "date" | "dateRange" | "select" | "multiSelect";
    label?: string;
    placeholder?: string;
    options?: Option[];
    unit?: string;
  }
}
