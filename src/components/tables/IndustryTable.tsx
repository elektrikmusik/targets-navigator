import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type IndustryData = Database["public"]["Tables"]["companies_industry"]["Row"];

const columns: ColumnDef<IndustryData>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => <SortableHeader column={column}>Company</SortableHeader>,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("englishName") || row.getValue("companyName")}
      </div>
    ),
  },
  {
    accessorKey: "industry_score",
    header: ({ column }) => <SortableHeader column={column}>Overall Industry Score</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("industry_score")} />,
  },
  {
    accessorKey: "core_business_score",
    header: ({ column }) => <SortableHeader column={column}>Core Business</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("core_business_score")} />,
  },
  {
    accessorKey: "technology_score",
    header: ({ column }) => <SortableHeader column={column}>Technology</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("technology_score")} />,
  },
  {
    accessorKey: "market_score",
    header: ({ column }) => <SortableHeader column={column}>Market Position</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("market_score")} />,
  },
  {
    accessorKey: "evaluation_date",
    header: ({ column }) => <SortableHeader column={column}>Evaluation Date</SortableHeader>,
    cell: ({ row }) => {
      const date = row.getValue("evaluation_date") as string;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "core_business_justification",
    header: "Core Business Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("core_business_justification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "technology_justification",
    header: "Technology Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("technology_justification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "market_justification",
    header: "Market Position Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("market_justification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "rationale",
    header: "Evaluation Rationale",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">{row.getValue("rationale") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "opportunities",
    header: "Key Opportunities",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("opportunities") || "Not specified"}
      </div>
    ),
  },
  {
    accessorKey: "industry_output",
    header: "Industry Analysis Data",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {typeof row.getValue("industry_output") === "object"
          ? JSON.stringify(row.getValue("industry_output")).substring(0, 100) + "..."
          : row.getValue("industry_output") || "N/A"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => (
      <RowActions
        row={
          {
            original: {
              id: row.original.id.toString(),
            },
          } as { original: { id: string } }
        }
        actions={[
          {
            label: "View Industry Details",
            onClick: () => console.log("View industry details", row.original),
          },
          {
            label: "Edit Industry Data",
            onClick: () => console.log("Edit industry data", row.original),
          },
        ]}
      />
    ),
  },
];

interface IndustryTableProps {
  data: IndustryData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function IndustryTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: IndustryTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Industry Analysis & Business Evaluation
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive industry analysis including core business model, technology capabilities,
            market positioning, and strategic opportunities for {data.length} companies.
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
              <span className="text-gray-500">Live data</span>
            </span>
            <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchColumn="englishName"
        searchPlaceholder="Search companies by name..."
        enableGlobalFilter={true}
        enableExport={true}
        pageSize={50}
        isLoading={loading}
        emptyMessage="No industry analysis data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="industry-data"
      />
    </div>
  );
}
