import { ColumnDef } from "@tanstack/react-table";
import { DataTable, SortableHeader } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { CompanyOverview } from "@/lib/supabase";

const columns: ColumnDef<CompanyOverview>[] = [
  {
    accessorKey: "logoUrl",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.getValue("logoUrl") as string;
      if (!logoUrl) {
        return (
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
            <span className="text-xs text-gray-500">?</span>
          </div>
        );
      }

      return (
        <img
          src={logoUrl}
          alt="Company logo"
          className="h-8 w-8 rounded object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
      );
    },
  },
  {
    accessorKey: "englishName",
    header: ({ column }) => <SortableHeader column={column}>Company Name</SortableHeader>,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("englishName") || row.getValue("companyName")}
      </div>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      if (!website) return <span className="text-gray-400">N/A</span>;

      return (
        <a
          href={website.startsWith("http") ? website : `https://${website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-[150px] truncate text-sm text-blue-600 underline hover:text-blue-800"
        >
          {website.replace(/^https?:\/\//, "")}
        </a>
      );
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => <SortableHeader column={column}>Country</SortableHeader>,
    cell: ({ row }) => (
      <Badge variant="outline" className="text-xs">
        {row.getValue("country") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "ceres_region",
    header: ({ column }) => <SortableHeader column={column}>Ceres Region</SortableHeader>,
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-xs">
        {row.getValue("ceres_region") || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "Tier",
    header: ({ column }) => <SortableHeader column={column}>Tier</SortableHeader>,
    cell: ({ row }) => {
      const tier = row.getValue("Tier") as string;
      if (!tier) return <span className="text-gray-400">N/A</span>;

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
  },
  {
    accessorKey: "overallScore",
    header: ({ column }) => <SortableHeader column={column}>Overall Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("overallScore") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      const getScoreColor = (score: number) => {
        if (score >= 8) return "bg-green-100 text-green-800";
        if (score >= 6) return "bg-blue-100 text-blue-800";
        if (score >= 4) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
      };

      return <Badge className={`${getScoreColor(score)} font-semibold`}>{score.toFixed(1)}</Badge>;
    },
  },
  {
    accessorKey: "strategicFit",
    header: ({ column }) => <SortableHeader column={column}>Strategic Fit</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("strategicFit") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "abilityToExecute",
    header: ({ column }) => <SortableHeader column={column}>Ability to Execute</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("abilityToExecute") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "primaryMarket",
    header: "Primary Market",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm">{row.getValue("primaryMarket") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "businessModel",
    header: "Business Model",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-sm">{row.getValue("businessModel") || "N/A"}</div>
    ),
  },
  {
    accessorKey: "annual_revenue",
    header: ({ column }) => <SortableHeader column={column}>Annual Revenue ($B)</SortableHeader>,
    cell: ({ row }) => {
      const revenue = row.getValue("annual_revenue") as number;
      if (!revenue) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">${revenue.toFixed(1)}B</div>;
    },
  },
  {
    accessorKey: "finance_score",
    header: ({ column }) => <SortableHeader column={column}>Financial Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("finance_score") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      const getScoreColor = (score: number) => {
        if (score >= 8) return "bg-green-100 text-green-800";
        if (score >= 6) return "bg-blue-100 text-blue-800";
        if (score >= 4) return "bg-yellow-100 text-yellow-800";
        return "bg-red-100 text-red-800";
      };

      return <Badge className={`${getScoreColor(score)} text-xs`}>{score.toFixed(1)}</Badge>;
    },
  },
  {
    accessorKey: "industry_score",
    header: ({ column }) => <SortableHeader column={column}>Industry Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("industry_score") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "H2Score",
    header: ({ column }) => <SortableHeader column={column}>H2 Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("H2Score") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "manufacturing_score",
    header: ({ column }) => <SortableHeader column={column}>Manufacturing Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("manufacturing_score") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "IPActivityScore",
    header: ({ column }) => <SortableHeader column={column}>IP Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("IPActivityScore") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "OwnershipScore",
    header: ({ column }) => <SortableHeader column={column}>Ownership Score</SortableHeader>,
    cell: ({ row }) => {
      const score = row.getValue("OwnershipScore") as number;
      if (!score) return <span className="text-gray-400">N/A</span>;

      return <div className="text-sm font-medium">{score.toFixed(1)}</div>;
    },
  },
  {
    accessorKey: "ticker",
    header: "Ticker",
    cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("ticker") || "N/A"}</div>,
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const website = row.getValue("website") as string;
      if (!website) return <span className="text-gray-400">N/A</span>;

      return (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 underline hover:text-blue-800"
        >
          Visit
        </a>
      );
    },
  },
];

interface CompanyOverviewTableProps {
  data: CompanyOverview[];
  loading?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const CompanyOverviewTable: React.FC<CompanyOverviewTableProps> = ({
  data,
  loading = false,
  totalCount,
  hasMore = false,
  onLoadMore,
}) => {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchColumn="englishName"
      searchPlaceholder="Search companies..."
      enableGlobalFilter={true}
      enableExport={true}
      pageSize={50}
      isLoading={loading}
      emptyMessage="No companies found."
      totalCount={totalCount}
      hasMore={hasMore}
      onLoadMore={onLoadMore}
      tableKey="company-overview"
    />
  );
};
