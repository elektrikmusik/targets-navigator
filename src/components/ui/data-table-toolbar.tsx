"use client";

import type { Column, Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import * as React from "react";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import type { Option } from "@/types/data-table";

interface DataTableToolbarProps<TData> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  filterOptions?: {
    countries: string[];
    ceresRegions: string[];
    tiers: string[];
    companyStates: string[];
  };
}

export function DataTableToolbar<TData>({
  table,
  filterOptions,
  children,
  className,
  ...props
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table],
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
    table.resetSorting();
    table.setPageIndex(0);
    table.setPageSize(50);
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn("flex w-full items-start justify-between gap-2 p-1", className)}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} filterOptions={filterOptions} />
        ))}

        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            size="sm"
            className="border-dashed"
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
  filterOptions?: {
    countries: string[];
    ceresRegions: string[];
    tiers: string[];
    companyStates: string[];
  };
}

function DataTableToolbarFilter<TData>({
  column,
  filterOptions,
}: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="h-8 w-40 lg:w-56"
          />
        );
      case "number":
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn("h-8 w-[120px]", columnMeta.unit && "pr-8")}
            />
            {columnMeta.unit && (
              <span className="bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );
      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === "multiSelect"}
          />
        );
      default:
        return null;
    }
  }, [column, columnMeta]);

  // Handle specific columns with filter options
  if (column.id === "country" && filterOptions?.countries) {
    const countryOptions: Option[] = filterOptions.countries
      .map((country) => ({
        label: country || "N/A",
        value: country || "N/A",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <DataTableFacetedFilter
        column={column}
        title="Country"
        options={countryOptions}
        multiple={true}
      />
    );
  }

  if (column.id === "ceres_region" && filterOptions?.ceresRegions) {
    const regionOptions: Option[] = filterOptions.ceresRegions
      .map((region) => ({
        label: region || "N/A",
        value: region || "N/A",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <DataTableFacetedFilter
        column={column}
        title="BD Territory"
        options={regionOptions}
        multiple={true}
      />
    );
  }

  if (column.id === "Tier" && filterOptions?.tiers) {
    const tierOptions: Option[] = filterOptions.tiers
      .map((tier) => ({
        label: tier || "N/A",
        value: tier || "N/A",
      }))
      .sort((a, b) => {
        // Custom sorting for tier values
        const tierOrder = [
          "Partner",
          "Tier 1",
          "Tier 2",
          "Tier 3",
          "Tier 4",
          "Unclassified",
          "N/A",
        ];
        const aIndex = tierOrder.indexOf(a.label);
        const bIndex = tierOrder.indexOf(b.label);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        return a.label.localeCompare(b.label);
      });

    return (
      <DataTableFacetedFilter column={column} title="Tier" options={tierOptions} multiple={true} />
    );
  }

  if (column.id === "company_state" && filterOptions?.companyStates) {
    const stateOptions: Option[] = filterOptions.companyStates
      .map((state) => ({
        label: state || "N/A",
        value: state || "N/A",
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    return (
      <DataTableFacetedFilter
        column={column}
        title="Company State"
        options={stateOptions}
        multiple={true}
      />
    );
  }

  return onFilterRender();
}
