"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AdvancedDataTable } from "@/components/ui/advanced-data-table";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { CompanyOverview } from "@/lib/supabase";
import { ExternalLink, Building2, Globe, TrendingUp } from "lucide-react";
import type { ColumnMeta } from "@/types/data-table";

// Score badge component with color coding
const ScoreBadge = ({
  score,
  label,
  showLabel = true,
}: {
  score: number | null;
  label: string;
  showLabel?: boolean;
}) => {
  if (score === null || score === undefined) {
    return <Badge variant="outline">N/A</Badge>;
  }

  const getColor = (score: number) => {
    if (score >= 8) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 7) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="flex flex-col items-center space-y-1">
      <Badge className={`${getColor(score)} border`}>{score.toFixed(1)}</Badge>
      {showLabel && <span className="text-muted-foreground text-xs">{label}</span>}
    </div>
  );
};

// Revenue formatter
const formatRevenue = (revenue: number | null) => {
  if (!revenue) return "N/A";
  if (revenue >= 1000) return `$${(revenue / 1000).toFixed(1)}T`;
  if (revenue >= 1) return `$${revenue.toFixed(1)}B`;
  return `$${(revenue * 1000).toFixed(1)}M`;
};

// Calculate optimal width for company name column
const calculateCompanyNameWidth = (data: CompanyOverview[]) => {
  if (!data || data.length === 0) return 300;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 300;

  // Set font to match the table font
  context.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  let maxWidth = 0;

  data.forEach((company) => {
    const englishName = company.englishName || company.companyName || "";
    const companyName = company.companyName || "";
    const website = company.website ? "Website" : "";

    // Calculate width for main name
    const mainNameWidth = context.measureText(englishName).width;

    // Calculate width for secondary name (if different)
    const secondaryNameWidth =
      companyName && companyName !== englishName ? context.measureText(companyName).width : 0;

    // Calculate width for website link
    const websiteWidth = website ? context.measureText(website).width + 20 : 0; // +20 for icon

    // Get the maximum width needed
    const totalWidth = Math.max(mainNameWidth, secondaryNameWidth, websiteWidth);

    // Add padding and margins (approximately 40px)
    const paddedWidth = totalWidth + 40;

    if (paddedWidth > maxWidth) {
      maxWidth = paddedWidth;
    }
  });

  // Ensure minimum and maximum bounds
  return Math.max(200, Math.min(500, maxWidth));
};

const columns: ColumnDef<CompanyOverview>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.getValue("logoUrl") as string;
      if (!logoUrl) {
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-gray-100">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
        );
      }

      return (
        <div className="relative">
          <img
            src={logoUrl}
            alt="Company logo"
            className="h-10 w-10 rounded-lg border object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden h-10 w-10 items-center justify-center rounded-lg border bg-gray-100">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "englishName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Company Name" />,
    cell: ({ row }) => {
      const englishName = row.getValue("englishName") as string;
      const companyName = row.original.companyName;

      return (
        <div className="flex flex-col space-y-1">
          <div className="font-medium">{englishName || companyName}</div>
          {companyName && companyName !== englishName && (
            <div className="text-muted-foreground text-sm">{companyName}</div>
          )}
        </div>
      );
    },
    size: 300, // Set a reasonable default width
    minSize: 200, // Minimum width
    maxSize: 500, // Maximum width
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "website",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Website" />,
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      if (!website) return <span className="text-muted-foreground">N/A</span>;

      return (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="mr-1 h-3 w-3" />
          {website.replace(/^https?:\/\//, "")}
        </a>
      );
    },
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Globe className="text-muted-foreground h-4 w-4" />
        <span>{row.getValue("country") || "N/A"}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const normalize = (v: unknown) =>
        v == null || v === "" ? "N/A" : String(v).trim().toLowerCase();
      const cellValue = normalize(row.getValue(id));
      const selected = Array.isArray(value) ? value.map(normalize) : [normalize(value as unknown)];
      return selected.includes(cellValue);
    },
    meta: {
      variant: "multiSelect",
      label: "Country",
    } as ColumnMeta,
  },
  {
    accessorKey: "ceres_region",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Region" />,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("ceres_region") || "N/A"}</Badge>,
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const normalize = (v: unknown) =>
        v == null || v === "" ? "N/A" : String(v).trim().toLowerCase();
      const cellValue = normalize(row.getValue(id));
      const selected = Array.isArray(value) ? value.map(normalize) : [normalize(value as unknown)];
      return selected.includes(cellValue);
    },
    meta: {
      variant: "multiSelect",
      label: "BD Territory",
    } as ColumnMeta,
  },
  {
    accessorKey: "Tier",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tier" />,
    cell: ({ row }) => {
      const tier = row.getValue("Tier") as string;
      if (!tier) return <Badge variant="outline">N/A</Badge>;

      const getTierColor = (tier: string) => {
        switch (tier) {
          case "Partner":
            return "text-[#59315F] border-[#59315F] bg-[#59315F]/10";
          case "Tier 1":
            return "bg-green-100 text-green-800 border-green-200";
          case "Tier 2":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "Tier 3":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "Tier 4":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return <Badge className={`${getTierColor(tier)} border font-semibold`}>{tier}</Badge>;
    },
    enableSorting: true,
    enableHiding: true,
    enableColumnFilter: true,
    filterFn: (row, id, value) => {
      const normalize = (v: unknown) =>
        v == null || v === "" ? "N/A" : String(v).trim().toLowerCase();
      const cellValue = normalize(row.getValue(id));
      const selected = Array.isArray(value) ? value.map(normalize) : [normalize(value as unknown)];
      return selected.includes(cellValue);
    },
    meta: {
      variant: "multiSelect",
      label: "Tier",
    } as ColumnMeta,
  },
  {
    accessorKey: "overallScore",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Overall Score" allowWrap={true} />
    ),
    cell: ({ row }) => (
      <ScoreBadge score={row.getValue("overallScore")} label="Overall" showLabel={false} />
    ),
    size: 120,
    minSize: 100,
    maxSize: 150,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "strategicFit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Strategic Fit" allowWrap={true} />
    ),
    cell: ({ row }) => (
      <ScoreBadge score={row.getValue("strategicFit")} label="Strategic" showLabel={false} />
    ),
    size: 120,
    minSize: 100,
    maxSize: 150,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "abilityToExecute",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ability to Execute" allowWrap={true} />
    ),
    cell: ({ row }) => (
      <ScoreBadge score={row.getValue("abilityToExecute")} label="Execute" showLabel={false} />
    ),
    size: 120,
    minSize: 100,
    maxSize: 150,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "primaryMarket",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Primary Market" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <Building2 className="text-muted-foreground h-4 w-4" />
        <span className="max-w-[150px] truncate">{row.getValue("primaryMarket") || "N/A"}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "businessModel",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Business Model" />,
    cell: ({ row }) => (
      <div className="max-w-[150px] truncate">{row.getValue("businessModel") || "N/A"}</div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "annual_revenue",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Annual Revenue" />,
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <TrendingUp className="text-muted-foreground h-4 w-4" />
        <span className="font-mono">{formatRevenue(row.getValue("annual_revenue"))}</span>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: "ticker",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ticker" />,
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono">
        {row.getValue("ticker") || "N/A"}
      </Badge>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={[
          {
            label: "View Details",
            onClick: (row) => {
              console.log("View details for:", row.original);
              // Add navigation or modal logic here
            },
          },
          {
            label: "Export Data",
            onClick: (row) => {
              const data = row.original;
              const csvContent = Object.entries(data)
                .map(([key, value]) => `${key},${value}`)
                .join("\n");
              const blob = new Blob([csvContent], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${data.englishName || data.companyName}-data.csv`;
              a.click();
            },
          },
          {
            label: "Compare",
            onClick: (row) => {
              console.log("Compare with:", row.original);
              // Add comparison logic here
            },
          },
        ]}
      />
    ),
  },
];

interface CompanyOverviewAdvancedTableProps {
  data: CompanyOverview[];
  loading?: boolean;
  filterOptions?: {
    countries: string[];
    ceresRegions: string[];
    tiers: string[];
    companyStates: string[];
  };
}

export function CompanyOverviewAdvancedTable({
  data,
  loading = false,
  filterOptions,
}: CompanyOverviewAdvancedTableProps) {
  // Calculate optimal width for company name column
  const optimalCompanyNameWidth = React.useMemo(() => {
    return calculateCompanyNameWidth(data);
  }, [data]);

  // Create columns with dynamic sizing
  const dynamicColumns = React.useMemo(() => {
    return columns.map((col) => {
      if ("accessorKey" in col && col.accessorKey === "englishName") {
        return {
          ...col,
          size: optimalCompanyNameWidth,
        };
      }
      return col;
    });
  }, [optimalCompanyNameWidth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-gray-500">Live data</span>
            </span>
            <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <AdvancedDataTable
        columns={dynamicColumns}
        data={data}
        filterOptions={filterOptions}
        pageSize={10}
        isLoading={loading}
        emptyMessage="No companies found in the database"
      />
    </div>
  );
}
