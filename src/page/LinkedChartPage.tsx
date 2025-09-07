"use client";

import { useState, useMemo } from "react";
import { CompanyOverview } from "@/lib/supabase";
import { LinkedChart } from "@/components/charts/LinkedChart";
import { useCompanyOverview } from "@/hooks/useCompanyOverview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Building2,
    Target,
    RefreshCw,
    EyeOff,
    X,
    Download,
    TrendingUp,
    Users,
    Star,
} from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import {
    ICON_SIZES,
    LOADING_DIMENSIONS,
    GRID_CONFIGS,
} from "@/constants/dimensions";



// Selected company details component
const SelectedCompanyDetails = ({
    selectedCompany,
    onClearSelection,
}: {
    selectedCompany: CompanyOverview;
    onClearSelection: () => void;
}) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className={ICON_SIZES.md} />
                        {selectedCompany.englishName || selectedCompany.companyName}
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={onClearSelection}>
                        <EyeOff className={`${ICON_SIZES.sm} mr-2`} />
                        Clear Selection
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className={GRID_CONFIGS.details}>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Overall Score</Label>
                        <div className="text-2xl font-bold">
                            {Number(selectedCompany.overallScore)?.toFixed(1) || "N/A"}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Strategic Fit</Label>
                        <div className="text-2xl font-bold">
                            {Number(selectedCompany.strategicFit)?.toFixed(1) || "N/A"}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Ability to Execute</Label>
                        <div className="text-2xl font-bold">
                            {Number(selectedCompany.abilityToExecute)?.toFixed(1) || "N/A"}
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Tier</Label>
                        <div className="mt-1">
                            <Badge variant="secondary">
                                {selectedCompany.Tier || "N/A"}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className={`mt-4 ${GRID_CONFIGS.companyInfo}`}>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Country</Label>
                        <div className="text-sm">{selectedCompany.country || "N/A"}</div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium text-gray-500">Primary Market</Label>
                        <div className="text-sm">{selectedCompany.primaryMarket || "N/A"}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export const LinkedChartPage = () => {
    const { data, loading, error } = useCompanyOverview();
    const [selectedCompany, setSelectedCompany] = useState<CompanyOverview | null>(null);
    const [searchTerm] = useState("");

    // Debug logging
    console.log('LinkedChartPage - Data status:', { 
        dataLength: data?.length || 0, 
        loading, 
        error,
        hasData: !!data
    });
    
    // Debug: Check data structure
    if (data && data.length > 0) {
        console.log('Sample company data:', data[0]);
        console.log('Available fields:', Object.keys(data[0]));
    }

    // Filter data based on search term only (LinkedChart handles tier filtering)
    const filteredData = useMemo(() => {
        if (!data) return data;

        if (!searchTerm) return data;

        return data.filter(company =>
            (company.englishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             company.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             company.primaryMarket?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [data, searchTerm]);

    const clearSelection = () => {
        setSelectedCompany(null);
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
                <div className="text-center">
                    <div className="text-blue-500 mb-4">Loading data...</div>
                    <DashboardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center ${LOADING_DIMENSIONS.large}`}>
                <div className="text-center">
                    <div className="text-red-500 mb-4">Error loading data: {error}</div>
                    <Button onClick={() => window.location.reload()}>
                        <RefreshCw className={`${ICON_SIZES.sm} mr-2`} />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // If no data, show empty state with debug info
    if (!data || data.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="w-full px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Linked Chart Analysis</h1>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Charts Page</h2>
                        <p>This page displays interactive charts and data visualization components.</p>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Data status: {data ? 'No data available' : 'Loading...'}</p>
                            <p className="text-sm text-gray-600">Data length: {data?.length || 0}</p>
                            <p className="text-sm text-gray-600">Loading: {loading ? 'Yes' : 'No'}</p>
                            <p className="text-sm text-gray-600">Error: {error || 'None'}</p>
                            <Button onClick={() => window.location.reload()} className="mt-2">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ErrorBoundary fallback={<DashboardSkeleton />}>
            <div className="bg-gray-50 h-screen flex flex-col">
                <div className="w-full px-4 py-8 flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="flex-shrink-0 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                            <div className="min-w-0">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 truncate">Strategic Mapping Dashboard</h1>
                                <p className="text-gray-600 mt-2 text-sm lg:text-base">
                                    Interactive bubble chart with synchronized table view for comprehensive company analysis
                                </p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <Button variant="outline" size="sm" onClick={clearSelection} disabled={!selectedCompany}>
                                    <X className={`${ICON_SIZES.sm} mr-2`} />
                                    Clear Selection
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className={`${ICON_SIZES.sm} mr-2`} />
                                    Export
                                </Button>
                            </div>
                        </div>

                        
                    </div>

                    

                    {/* Main Content - Linked Chart */}
                    <div className="flex-1 min-h-0">
                        <LinkedChart
                            data={filteredData}
                            loading={loading}
                            title=""
                            enableTableSync={true}
                            enableChartInteractions={true}
                            enableFiltering={true}
                            enableSearch={true}
                            onCompanySelect={(company) => {
                                setSelectedCompany(company);
                            }}
                            onDataFilter={(filteredData) => {
                                // Update statistics when data is filtered
                                console.log('Data filtered:', filteredData.length, 'companies');
                            }}
                        />
                    </div>

                    {/* Selected Company Details */}
                    {selectedCompany && (
                        <div className="flex-shrink-0 mt-6">
                            <SelectedCompanyDetails
                                selectedCompany={selectedCompany}
                                onClearSelection={clearSelection}
                            />
                        </div>
                    )}

                </div>
            </div>
        </ErrorBoundary>
    );
};