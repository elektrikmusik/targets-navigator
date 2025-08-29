import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions, ScoreBadge } from "@/components/ui/data-table";
import { Database } from "@/lib/supabase";

type HydrogenData = Database["public"]["Tables"]["companies_hydrogen"]["Row"];

const columns: ColumnDef<HydrogenData>[] = [
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
    accessorKey: "H2Score",
    header: ({ column }) => <SortableHeader column={column}>Overall H2 Score</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2Score")} />,
  },
  {
    accessorKey: "H2investScore",
    header: ({ column }) => <SortableHeader column={column}>Investment</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2investScore")} />,
  },
  {
    accessorKey: "H2partnersScore",
    header: ({ column }) => <SortableHeader column={column}>Partnerships</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2partnersScore")} />,
  },
  {
    accessorKey: "H2TechScore",
    header: ({ column }) => <SortableHeader column={column}>Technology</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2TechScore")} />,
  },
  {
    accessorKey: "H2CommitScore",
    header: ({ column }) => <SortableHeader column={column}>Commitment</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2CommitScore")} />,
  },
  {
    accessorKey: "H2ParticipationScore",
    header: ({ column }) => <SortableHeader column={column}>Market Participation</SortableHeader>,
    cell: ({ row }) => <ScoreBadge score={row.getValue("H2ParticipationScore")} />,
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
    accessorKey: "H2investJustification",
    header: "Investment Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2investJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2partnersJustification",
    header: "Partnership Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2partnersJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2TechJustification",
    header: "Technology Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2TechJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2CommitJustification",
    header: "Commitment Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2CommitJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2ParticipationJustification",
    header: "Participation Justification",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2ParticipationJustification") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2Summary",
    header: "H2 Strategy Summary",
    cell: ({ row }) => (
      <div className="max-w-[400px] truncate text-sm">{row.getValue("H2Summary") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "H2investmentFocus",
    header: "Investment Focus Areas",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2investmentFocus") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2partnershipStrategy",
    header: "Partnership Strategy",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2partnershipStrategy") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2technologyReadiness",
    header: "Technology Readiness",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2technologyReadiness") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2marketPositioning",
    header: "Market Positioning",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2marketPositioning") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2Research",
    header: "Research Activities",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("H2Research") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "H2OverallRating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.getValue("H2OverallRating") as string;
      const getVariant = (rating: string) => {
        if (rating?.toLowerCase().includes("excellent")) return "bg-green-100 text-green-800";
        if (rating?.toLowerCase().includes("good")) return "bg-blue-100 text-blue-800";
        if (rating?.toLowerCase().includes("fair")) return "bg-yellow-100 text-yellow-800";
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
            label: "View H2 Details",
            onClick: () => console.log("View H2 details", row.original),
          },
          {
            label: "Edit H2 Data",
            onClick: () => console.log("Edit H2 data", row.original),
          },
        ]}
      />
    ),
  },
];

interface HydrogenTableProps {
  data: HydrogenData[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function HydrogenTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: HydrogenTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Hydrogen Commitment & Strategic Focus
          </h1>
          <p className="mt-2 text-gray-600">
            Comprehensive hydrogen industry analysis including investment focus, partnerships,
            technology readiness, and strategic positioning for {data.length} companies.
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
        emptyMessage="No hydrogen data found"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="hydrogen-data"
      />
    </div>
  );
}
