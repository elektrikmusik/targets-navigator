import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type OwnershipData = Database["public"]["Tables"]["companies_ownership"]["Row"];

const columns: ColumnDef<OwnershipData>[] = [
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
    accessorKey: "OwnershipScore",
    header: ({ column }) => (
      <SortableHeader column={column}>Overall Ownership Score</SortableHeader>
    ),
    cell: ({ row }) => <ScoreBadge score={row.getValue("OwnershipScore")} />,
  },
  {
    accessorKey: "OwnershipTypeScore",
    header: ({ column }) => <SortableHeader column={column}>Ownership Type</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("OwnershipTypeScore")} />,
  },
  {
    accessorKey: "OwnershipDecisionMakingScore",
    header: ({ column }) => <SortableHeader column={column}>Decision Making</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("OwnershipDecisionMakingScore")} />,
  },
  {
    accessorKey: "OwnershipAlignmentScore",
    header: ({ column }) => <SortableHeader column={column}>Strategic Alignment</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("OwnershipAlignmentScore")} />,
  },
  {
    accessorKey: "OwnershipPartnershipsScore",
    header: ({ column }) => (
      <SortableHeader column={column}>Partnership Capabilities</SortableHeader>
    ),
    cell: ({ row }) => <ScoreBadge score={row.getValue("OwnershipPartnershipsScore")} />,
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
    accessorKey: "OwnershipTypeJustification",
    header: "Ownership Type Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("OwnershipTypeJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipDecisionMakingJustification",
    header: "Decision Making Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("OwnershipDecisionMakingJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipAlignmentJustification",
    header: "Strategic Alignment Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("OwnershipAlignmentJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipPartnershipsJustification",
    header: "Partnerships Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("OwnershipPartnershipsJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipSummary",
    header: "Ownership Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">
        {row.getValue("OwnershipSummary") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipResearch",
    header: "Research Data",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("OwnershipResearch") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "OwnershipOverallRating",
    header: "Overall Rating",
    cell: ({ row }) => {
      const rating = row.getValue("OwnershipOverallRating") as string;
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
            label: "View Ownership Details",
            onClick: () => console.log("View ownership details", row.original),
          },
          {
            label: "Edit Ownership Data",
            onClick: () => console.log("Edit ownership data", row.original),
          },
        ]}
      />
    ),
  },
];

interface OwnershipTableProps {
  data: OwnershipData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function OwnershipTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: OwnershipTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Ownership Structure & Decision-Making Analysis
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive ownership analysis including ownership type, decision-making processes,
            strategic alignment, partnership capabilities, and detailed justifications for{" "}
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
        emptyMessage="No ownership data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="ownership-data"
      />
    </div>
  );
}
