import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type ManufacturingData = Database["public"]["Tables"]["companies_manufacturing"]["Row"];

const columns: ColumnDef<ManufacturingData>[] = [
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
    accessorKey: "manufacturing_score",
    header: ({ column }) => (
      <SortableHeader column={column}>Overall Manufacturing Score</SortableHeader>
    ),
    cell: ({ row }) => <ScoreBadge score={row.getValue("manufacturing_score")} />,
  },
  {
    accessorKey: "ManufacturingMaterialsScore",
    header: ({ column }) => <SortableHeader column={column}>Materials</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("ManufacturingMaterialsScore")} />,
  },
  {
    accessorKey: "ManufacturingScaleScore",
    header: ({ column }) => <SortableHeader column={column}>Scale</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("ManufacturingScaleScore")} />,
  },
  {
    accessorKey: "ManufacturingQualityScore",
    header: ({ column }) => <SortableHeader column={column}>Quality</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("ManufacturingQualityScore")} />,
  },
  {
    accessorKey: "ManufacturingSupplyChainScore",
    header: ({ column }) => <SortableHeader column={column}>Supply Chain</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("ManufacturingSupplyChainScore")} />,
  },
  {
    accessorKey: "ManufacturingRDScore",
    header: ({ column }) => <SortableHeader column={column}>R&D</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("ManufacturingRDScore")} />,
  },
  {
    accessorKey: "EvaluationDate",
    header: ({ column }) => <SortableHeader column={column}>Evaluation Date</SortableHeader>,
    cell: ({ row }) => {
      const date = row.getValue("EvaluationDate") as string;
      return date ? new Date(date).toLocaleDateString() : "N/A";
    },
  },
  {
    accessorKey: "ManufacturingMaterialsJustification",
    header: "Materials Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingMaterialsJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingScaleJustification",
    header: "Scale Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingScaleJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingQualityJustification",
    header: "Quality Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingQualityJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingSupplyChainJustification",
    header: "Supply Chain Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingSupplyChainJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingRDJustification",
    header: "R&D Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingRDJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingSummary",
    header: "Manufacturing Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">
        {row.getValue("ManufacturingSummary") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingResearch",
    header: "Research Data",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("ManufacturingResearch") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "ManufacturingOverallRating",
    header: "Overall Rating",
    cell: ({ row }) => {
      const rating = row.getValue("ManufacturingOverallRating") as string;
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
            label: "View Manufacturing Details",
            onClick: () => console.log("View manufacturing details", row.original),
          },
          {
            label: "Edit Manufacturing Data",
            onClick: () => console.log("Edit manufacturing data", row.original),
          },
        ]}
      />
    ),
  },
];

interface ManufacturingTableProps {
  data: ManufacturingData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function ManufacturingTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: ManufacturingTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manufacturing Capabilities & Supply Chain
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive manufacturing analysis including materials handling, scale capabilities,
            quality management, supply chain, R&D capabilities, and detailed justifications for{" "}
            {data.length} companies.
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
        emptyMessage="No manufacturing data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="manufacturing-data"
      />
    </div>
  );
}
