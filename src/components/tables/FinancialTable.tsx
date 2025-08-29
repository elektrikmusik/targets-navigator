import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type FinancialData = Database["public"]["Tables"]["company_financial"]["Row"];

const columns: ColumnDef<FinancialData>[] = [
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
    accessorKey: "finance_score",
    header: ({ column }) => <SortableHeader column={column}>Overall Finance Score</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("finance_score")} />,
  },
  {
    accessorKey: "annual_revenue",
    header: ({ column }) => <SortableHeader column={column}>Annual Revenue</SortableHeader>,
    cell: ({ row }) => {
      const revenue = row.getValue("annual_revenue") as number;
      return revenue ? (
        <span className="font-mono">${revenue.toFixed(1)}B</span>
      ) : (
        <span className="text-gray-400">N/A</span>
      );
    },
  },
  {
    accessorKey: "revenue_score",
    header: ({ column }) => <SortableHeader column={column}>Revenue Score</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("revenue_score")} />,
  },
  {
    accessorKey: "3Y_score",
    header: ({ column }) => <SortableHeader column={column}>3Y Performance</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("3Y_score")} />,
  },
  {
    accessorKey: "netProfitScore",
    header: ({ column }) => <SortableHeader column={column}>Net Profit</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("netProfitScore")} />,
  },
  {
    accessorKey: "investCapacityScore",
    header: ({ column }) => <SortableHeader column={column}>Investment Capacity</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("investCapacityScore")} />,
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
    accessorKey: "revenue_justification",
    header: "Revenue Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("revenue_justification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "3Y_justification",
    header: "3Y Performance Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("3Y_justification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "netProfitJustification",
    header: "Net Profit Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("netProfitJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "investCapacityJustification",
    header: "Investment Capacity Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("investCapacityJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "financialSummary",
    header: "Financial Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">
        {row.getValue("financialSummary") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "revenueTrend",
    header: "Revenue Trend",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[250px] truncate text-sm">
        {row.getValue("revenueTrend") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "profitabilityAssessment",
    header: "Profitability Assessment",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("profitabilityAssessment") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "investmentReadiness",
    header: "Investment Readiness",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("investmentReadiness") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "overallRating",
    header: "Overall Rating",
    cell: ({ row }) => {
      const rating = row.getValue("overallRating") as string;
      const getVariant = (rating: string) => {
        if (rating?.toLowerCase().includes("excellent")) return "bg-green-100 text-green-800";
        if (rating?.toLowerCase().includes("strong")) return "bg-blue-100 text-blue-800";
        if (rating?.toLowerCase().includes("good")) return "bg-yellow-100 text-yellow-800";
        if (rating?.toLowerCase().includes("fair")) return "bg-orange-100 text-orange-800";
        return "bg-gray-100 text-gray-800";
      };

      return rating ? (
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getVariant(rating)}`}>
          {rating}
        </span>
      ) : (
        <span className="text-gray-400">Not rated</span>
      );
    },
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
            label: "View Financial Details",
            onClick: () => console.log("View financial details", row.original),
          },
          {
            label: "Edit Financial Data",
            onClick: () => console.log("Edit financial data", row.original),
          },
        ]}
      />
    ),
  },
];

interface FinancialTableProps {
  data: FinancialData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function FinancialTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: FinancialTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Financial Performance & Investment Readiness
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive financial analysis including revenues, profitability, investment capacity,
            and detailed justifications for {data.length} companies.
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
        emptyMessage="No financial data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="financial-data"
      />
    </div>
  );
}
