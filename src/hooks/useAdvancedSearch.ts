import { useState, useMemo } from "react";

interface ActiveFilter {
  key: string;
  label: string;
  value: string | number | { min?: number; max?: number };
  operator?: "equals" | "contains" | "greater" | "less" | "between";
}

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
