import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader, RowActions } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/lib/supabase";

type CompanyProfile = Database["public"]["Tables"]["companies_profile"]["Row"];

const columns: ColumnDef<CompanyProfile>[] = [
  {
    accessorKey: "englishName",
    header: ({ column }) => <SortableHeader column={column}>English Name</SortableHeader>,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("englishName") || row.getValue("companyName")}
      </div>
    ),
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader column={column}>Company Name</SortableHeader>,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("companyName")}</div>,
  },
  {
    accessorKey: "key",
    header: ({ column }) => <SortableHeader column={column}>Key</SortableHeader>,
    cell: ({ row }) => <Badge variant="outline">{row.getValue("key")}</Badge>,
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
    accessorKey: "productTags",
    header: "Product Tags",
    cell: ({ row }) => {
      const tags = row.getValue("productTags") as string;
      return tags ? (
        <div className="flex flex-wrap gap-1">
          {tags
            .split(",")
            .slice(0, 3)
            .map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag.trim()}
              </Badge>
            ))}
          {tags.split(",").length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.split(",").length - 3}
            </Badge>
          )}
        </div>
      ) : (
        <span className="text-gray-400">No tags</span>
      );
    },
  },
  {
    accessorKey: "marketPosition",
    header: "Market Position",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[300px] truncate text-sm">
        {row.getValue("marketPosition") || "Not specified"}
      </div>
    ),
  },
  {
    accessorKey: "basicInformation",
    header: "Basic Information",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("basicInformation") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "productServices",
    header: "Products & Services",
    cell: ({ row }) => (
      <div className="max-w-[250px] truncate text-sm">
        {row.getValue("productServices") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "missionVisionValues",
    header: "Mission & Vision",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("missionVisionValues") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "historyBackground",
    header: "History",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("historyBackground") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "executiveTeam",
    header: "Executive Team",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("executiveTeam") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "customerSegments",
    header: "Customer Segments",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("customerSegments") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("products") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "news_md",
    header: "News",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("news_md") || "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "sentiment_md",
    header: "Sentiment",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm">
        {row.getValue("sentiment_md") || "N/A"}
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
            label: "View Details",
            onClick: () => console.log("View", row.original),
          },
          {
            label: "Edit",
            onClick: () => console.log("Edit", row.original),
          },
        ]}
      />
    ),
  },
];

interface CompanyProfileTableProps {
  data: CompanyProfile[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function CompanyProfileTable({
  data,
  loading = false,
  totalCount,
  hasMore,
  onLoadMore,
}: CompanyProfileTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Company Profiles</h1>
          <p className="mt-2 text-gray-600">
            Complete company information and basic details for {data.length} companies from the
            database.
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
        emptyMessage="No companies found in the database"
        totalCount={totalCount}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        tableKey="company-profiles"
      />
    </div>
  );
}
