import React from "react";
import { CompanyOverview } from "@/lib/supabase";
import { Building2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { ICON_SIZES, AVATAR_SIZES, LOADING_DIMENSIONS } from "@/constants/dimensions";

interface SimpleCompanyTableProps {
  data: CompanyOverview[];
  loading?: boolean;
  onCompanySelect?: (company: CompanyOverview) => void;
  selectedCompany?: CompanyOverview | null;
}

export const SimpleCompanyTable: React.FC<SimpleCompanyTableProps> = ({
  data,
  loading = false,
}) => {
  // Define columns for the table
  const columns: ColumnDef<CompanyOverview>[] = [
    {
      accessorKey: "logoUrl",
      header: "Logo",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="flex items-center">
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.englishName || company.companyName || "Company"}
                className={`${AVATAR_SIZES.md} rounded-full object-cover`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div
                className={`${AVATAR_SIZES.md} flex items-center justify-center rounded-full bg-gray-200`}
              >
                <Building2 className={ICON_SIZES.sm} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "englishName",
      header: "Company Name",
      cell: ({ row }) => {
        const company = row.original;
        return (
          <div className="font-medium text-gray-900">
            {company.englishName || company.companyName || "N/A"}
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.small}`}>
        <div
          className={`animate-spin rounded-full ${LOADING_DIMENSIONS.spinner.lg} border-b-2 border-blue-600`}
        ></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.small} text-gray-500`}>
        No companies to display
      </div>
    );
  }

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={data}
        pageSize={10}
        enableGlobalFilter={false}
        isLoading={loading}
        emptyMessage="No companies to display"
        tableKey="simple-company-table"
      />
    </div>
  );
};
