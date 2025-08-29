import React, { useState, useMemo } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Badge } from "./badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu";
import { Search, X, ChevronDown, SlidersHorizontal } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "range";
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

interface ActiveFilter {
  key: string;
  label: string;
  value: string | number | { min?: number; max?: number };
  operator?: "equals" | "contains" | "greater" | "less" | "between";
}

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: FilterOption[];
  activeFilters: ActiveFilter[];
  onFiltersChange: (filters: ActiveFilter[]) => void;
  placeholder?: string;
  className?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  filters,
  activeFilters,
  onFiltersChange,
  placeholder = "Search...",
  className = "",
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<
    Record<string, string | number | { min?: number; max?: number }>
  >({});

  const addFilter = (
    filterKey: string,
    value: string | number | { min?: number; max?: number },
    operator = "equals",
  ) => {
    const filter = filters.find((f) => f.key === filterKey);
    if (!filter || !value) return;

    const newFilter: ActiveFilter = {
      key: filterKey,
      label: filter.label,
      value,
      operator,
    };

    const updatedFilters = activeFilters.filter((f) => f.key !== filterKey);
    updatedFilters.push(newFilter);
    onFiltersChange(updatedFilters);

    // Clear temp filter
    setTempFilters((prev) => {
      const updated = { ...prev };
      delete updated[filterKey];
      return updated;
    });
  };

  const removeFilter = (filterKey: string) => {
    const updatedFilters = activeFilters.filter((f) => f.key !== filterKey);
    onFiltersChange(updatedFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange([]);
    setTempFilters({});
    onSearchChange("");
  };

  const renderFilterInput = (filter: FilterOption) => {
    const tempValue = tempFilters[filter.key] || "";

    switch (filter.type) {
      case "text":
        return (
          <div className="flex gap-2">
            <Input
              placeholder={filter.placeholder || `Search ${filter.label}...`}
              value={tempValue}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))
              }
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addFilter(filter.key, tempValue, "contains");
                }
              }}
            />
            <Button
              size="sm"
              onClick={() => addFilter(filter.key, tempValue, "contains")}
              disabled={!tempValue}
            >
              Add
            </Button>
          </div>
        );

      case "number":
        return (
          <div className="flex gap-2">
            <select
              value={tempFilters[`${filter.key}_operator`] || "equals"}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, [`${filter.key}_operator`]: e.target.value }))
              }
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="equals">=</option>
              <option value="greater">&gt;</option>
              <option value="less">&lt;</option>
            </select>
            <Input
              type="number"
              placeholder="Value"
              value={tempValue}
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))
              }
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addFilter(
                    filter.key,
                    Number(tempValue),
                    tempFilters[`${filter.key}_operator`] || "equals",
                  );
                }
              }}
            />
            <Button
              size="sm"
              onClick={() =>
                addFilter(
                  filter.key,
                  Number(tempValue),
                  tempFilters[`${filter.key}_operator`] || "equals",
                )
              }
              disabled={!tempValue}
            >
              Add
            </Button>
          </div>
        );

      case "select":
        return (
          <select
            value={tempValue}
            onChange={(e) => {
              if (e.target.value) {
                addFilter(filter.key, e.target.value);
              }
            }}
            className="w-full rounded border px-2 py-1"
          >
            <option value="">Select {filter.label}...</option>
            {filter.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "range":
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={tempFilters[`${filter.key}_min`] || ""}
                onChange={(e) =>
                  setTempFilters((prev) => ({ ...prev, [`${filter.key}_min`]: e.target.value }))
                }
              />
              <Input
                type="number"
                placeholder="Max"
                value={tempFilters[`${filter.key}_max`] || ""}
                onChange={(e) =>
                  setTempFilters((prev) => ({ ...prev, [`${filter.key}_max`]: e.target.value }))
                }
              />
            </div>
            <Button
              size="sm"
              onClick={() => {
                const min = tempFilters[`${filter.key}_min`];
                const max = tempFilters[`${filter.key}_max`];
                if (min || max) {
                  addFilter(
                    filter.key,
                    { min: Number(min) || undefined, max: Number(max) || undefined },
                    "between",
                  );
                }
              }}
              className="w-full"
              disabled={!tempFilters[`${filter.key}_min`] && !tempFilters[`${filter.key}_max`]}
            >
              Add Range
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = activeFilters.length > 0 || searchTerm.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main search bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs"
                >
                  {activeFilters.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {filters.map((filter) => (
              <div key={filter.key} className="space-y-2 p-3">
                <label className="text-sm font-medium text-gray-700">{filter.label}</label>
                {renderFilterInput(filter)}
              </div>
            ))}

            {hasActiveFilters && (
              <>
                <DropdownMenuSeparator />
                <div className="p-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={`${filter.key}-${index}`}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1"
            >
              <span className="text-xs">
                {filter.label}:{" "}
                {typeof filter.value === "object" && filter.value !== null
                  ? `${filter.value.min || ""}${filter.value.min && filter.value.max ? "-" : ""}${filter.value.max || ""}`
                  : filter.value}
              </span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

// Hook for managing advanced search state
export const useAdvancedSearch = <T extends Record<string, unknown>>(
  data: T[],
  searchFields: (keyof T)[],
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply text search
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(lowerSearchTerm);
        }),
      );
    }

    // Apply filters
    activeFilters.forEach((filter) => {
      result = result.filter((item) => {
        const itemValue = item[filter.key];

        if (itemValue === undefined || itemValue === null) {
          return false;
        }

        switch (filter.operator) {
          case "contains": {
            return itemValue
              .toString()
              .toLowerCase()
              .includes(filter.value.toString().toLowerCase());
          }
          case "equals": {
            return itemValue === filter.value;
          }
          case "greater": {
            return Number(itemValue) > Number(filter.value);
          }
          case "less": {
            return Number(itemValue) < Number(filter.value);
          }
          case "between": {
            const numValue = Number(itemValue);
            const rangeValue = filter.value as { min?: number; max?: number };
            const min = rangeValue.min;
            const max = rangeValue.max;
            return (!min || numValue >= min) && (!max || numValue <= max);
          }
          default: {
            return true;
          }
        }
      });
    });

    return result;
  }, [data, searchTerm, activeFilters, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    activeFilters,
    setActiveFilters,
    filteredData,
    hasFilters: searchTerm.length > 0 || activeFilters.length > 0,
    totalCount: data.length,
    filteredCount: filteredData.length,
  };
};
