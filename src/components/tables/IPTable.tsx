import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type IPData = Database["public"]["Tables"]["companies_ip"]["Row"];

const columns: ColumnDef<IPData>[] = [
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
    accessorKey: "IPActivityScore",
    header: ({ column }) => (
      <SortableHeader column={column}>Overall IP Activity Score</SortableHeader>
    ),
    cell: ({ row }) => <ScoreBadge score={row.getValue("IPActivityScore")} />,
  },
  {
    accessorKey: "IPRelevantPatentsScore",
    header: ({ column }) => <SortableHeader column={column}>Relevant Patents</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("IPRelevantPatentsScore")} />,
  },
  {
    accessorKey: "IPCeresCitationsScore",
    header: ({ column }) => <SortableHeader column={column}>CERES Citations</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("IPCeresCitationsScore")} />,
  },
  {
    accessorKey: "IPPortfolioGrowthScore",
    header: ({ column }) => <SortableHeader column={column}>Portfolio Growth</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("IPPortfolioGrowthScore")} />,
  },
  {
    accessorKey: "IPFilingRecencyScore",
    header: ({ column }) => <SortableHeader column={column}>Filing Recency</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("IPFilingRecencyScore")} />,
  },
  {
    accessorKey: "evaluationDate",
    header: ({ column }) => <SortableHeader column={column}>Evaluation Date</SortableHeader>,
    cell: ({ row }) => {
      const date = row.getValue("evaluationDate") as string;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "IPRelevantPatentsJustification",
    header: "Relevant Patents Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("IPRelevantPatentsJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPCeresCitationsJustification",
    header: "CERES Citations Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("IPCeresCitationsJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPPortfolioGrowthJustification",
    header: "Portfolio Growth Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("IPPortfolioGrowthJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPFilingRecencyJustification",
    header: "Filing Recency Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("IPFilingRecencyJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPStrategySummary",
    header: "IP Strategy Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">
        {row.getValue("IPStrategySummary") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPResearch",
    header: "IP Research Data",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {typeof row.getValue("IPResearch") === "object"
          ? JSON.stringify(row.getValue("IPResearch")).substring(0, 100) + "..."
          : row.getValue("IPResearch") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "IPOverallRating",
    header: "Overall IP Rating",
    cell: ({ row }) => {
      const rating = row.getValue("IPOverallRating") as string;
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
            label: "View IP Details",
            onClick: () => console.log("View IP details", row.original),
          },
          {
            label: "Edit IP Data",
            onClick: () => console.log("Edit IP data", row.original),
          },
        ]}
      />
    ),
  },
];

interface IPTableProps {
  data: IPData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function IPTable({ data, loading = false, totalCount, hasMore, onLoadMore }: IPTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Intellectual Property & Patent Assessment
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive IP analysis including relevant patents, CERES citations, portfolio growth,
            filing recency, strategy summaries, and detailed justifications for {data.length}{" "}
            companies.
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
        emptyMessage="No IP data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="ip-data"
      />
    </div>
  );
}
