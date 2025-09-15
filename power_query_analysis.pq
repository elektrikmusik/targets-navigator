// Power Query M Code for Comprehensive Company Analysis
// This code connects to Supabase and creates the same statistics as the SQL analysis

// Step 1: Define the base data source (replace with your Supabase connection)
let
    // Replace these with your actual Supabase connection details
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_SUPABASE_ANON_KEY", // Replace with your actual key
    
    // Step 2: Create the main data table combining all three sources
    CombinedData = let
        // Get companies_profile data
        CompaniesProfile = let
            Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_profile?select=*", [
                Headers = [
                    #"apikey" = SupabaseKey,
                    #"Authorization" = "Bearer " & SupabaseKey
                ]
            ])),
            ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
            ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
                {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"}, 
                {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"})
        in ExpandColumns,
        
        // Get company_financial data
        CompanyFinancial = let
            Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/company_financial?select=*", [
                Headers = [
                    #"apikey" = SupabaseKey,
                    #"Authorization" = "Bearer " & SupabaseKey
                ]
            ])),
            ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
            ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
                {"key", "annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"}, 
                {"key", "annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"})
        in ExpandColumns,
        
        // Get companies_ip data
        CompaniesIP = let
            Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_ip?select=*", [
                Headers = [
                    #"apikey" = SupabaseKey,
                    #"Authorization" = "Bearer " & SupabaseKey
                ]
            ])),
            ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
            ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
                {"key", "IPActivityScore", "IPOverallRating", "IPRelevantPatentsScore", "IPCeresCitationsScore", "IPPortfolioGrowthScore", "IPFilingRecencyScore"}, 
                {"key", "IPActivityScore", "IPOverallRating", "IPRelevantPatentsScore", "IPCeresCitationsScore", "IPPortfolioGrowthScore", "IPFilingRecencyScore"})
        in ExpandColumns,
        
        // Join all tables
        JoinFinancial = Table.NestedJoin(CompaniesProfile, {"key"}, CompanyFinancial, {"key"}, "Financial", JoinKind.LeftOuter),
        ExpandFinancial = Table.ExpandTableColumn(JoinFinancial, "Financial", 
            {"annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"}, 
            {"annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"}),
        
        JoinIP = Table.NestedJoin(ExpandFinancial, {"key"}, CompaniesIP, {"key"}, "IP", JoinKind.LeftOuter),
        ExpandIP = Table.ExpandTableColumn(JoinIP, "IP", 
            {"IPActivityScore", "IPOverallRating", "IPRelevantPatentsScore", "IPCeresCitationsScore", "IPPortfolioGrowthScore", "IPFilingRecencyScore"}, 
            {"IPActivityScore", "IPOverallRating", "IPRelevantPatentsScore", "IPCeresCitationsScore", "IPPortfolioGrowthScore", "IPFilingRecencyScore"}),
        
        // Add calculated columns
        AddMaxRevenue = Table.AddColumn(ExpandIP, "max_revenue", each 
            List.Max({[annual_revenue] ?? 0, [groupRevenue] ?? 0}), type number),
        
        AddRevenueCategory = Table.AddColumn(AddMaxRevenue, "revenue_category", each 
            if [max_revenue] >= 200 then "High Revenue (>=200)"
            else if [max_revenue] >= 50 then "Medium Revenue (50-199)"
            else if [max_revenue] >= 10 then "Low Revenue (10-49)"
            else "Very Low Revenue (<10)", type text)
            
    in AddRevenueCategory,
    
    // Step 3: Create Overall Statistics
    OverallStats = let
        Source = CombinedData,
        Grouped = Table.Group(Source, {}, {
            {"total_companies", each Table.RowCount(_), type number},
            {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
            {"tier2_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 2")), type number},
            {"tier3_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 3")), type number},
            {"tier4_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 4")), type number},
            {"partner_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Partner")), type number},
            {"avg_overall_score", each List.Average([overallScore]), type number},
            {"avg_finance_score", each List.Average([finance_score]), type number},
            {"avg_ip_score", each List.Average([IPActivityScore]), type number},
            {"avg_max_revenue", each List.Average([max_revenue]), type number}
        })
    in Grouped,
    
    // Step 4: Create Tier Analysis
    TierAnalysis = let
        Source = CombinedData,
        Grouped = Table.Group(Source, {"Tier"}, {
            {"company_count", each Table.RowCount(_), type number},
            {"percentage", each Table.RowCount(_) * 100.0 / Table.RowCount(Source), type number},
            {"avg_overall_score", each List.Average([overallScore]), type number},
            {"avg_finance_score", each List.Average([finance_score]), type number},
            {"avg_ip_score", each List.Average([IPActivityScore]), type number},
            {"avg_max_revenue", each List.Average([max_revenue]), type number},
            {"max_revenue_company", each List.Max([max_revenue]), type number},
            {"min_revenue_company", each List.Min([max_revenue]), type number}
        }),
        Sorted = Table.Sort(Grouped, {
            {"Tier", Order.Ascending, (x, y) => 
                let tierOrder = {"Tier 1", "Tier 2", "Tier 3", "Tier 4", "Partner"}
                in List.PositionOf(tierOrder, x) - List.PositionOf(tierOrder, y)}
        })
    in Sorted,
    
    // Step 5: Create Regional Analysis
    RegionalAnalysis = let
        Source = CombinedData,
        Grouped = Table.Group(Source, {"ceres_region"}, {
            {"company_count", each Table.RowCount(_), type number},
            {"percentage", each Table.RowCount(_) * 100.0 / Table.RowCount(Source), type number},
            {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
            {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number},
            {"avg_overall_score", each List.Average([overallScore]), type number},
            {"avg_finance_score", each List.Average([finance_score]), type number},
            {"avg_ip_score", each List.Average([IPActivityScore]), type number},
            {"avg_max_revenue", each List.Average([max_revenue]), type number},
            {"max_revenue_company", each List.Max([max_revenue]), type number}
        }),
        Sorted = Table.Sort(Grouped, {{"company_count", Order.Descending}})
    in Sorted,
    
    // Step 6: Create Country Analysis
    CountryAnalysis = let
        Source = CombinedData,
        Filtered = Table.SelectRows(Source, each [country] <> null),
        Grouped = Table.Group(Filtered, {"country"}, {
            {"company_count", each Table.RowCount(_), type number},
            {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
            {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number},
            {"avg_overall_score", each List.Average([overallScore]), type number},
            {"avg_finance_score", each List.Average([finance_score]), type number},
            {"avg_ip_score", each List.Average([IPActivityScore]), type number},
            {"avg_max_revenue", each List.Average([max_revenue]), type number},
            {"max_revenue_company", each List.Max([max_revenue]), type number}
        }),
        FilteredMin5 = Table.SelectRows(Grouped, each [company_count] >= 5),
        Sorted = Table.Sort(FilteredMin5, {{"company_count", Order.Descending}})
    in Sorted,
    
    // Step 7: Create IP Performance Analysis
    IPPerformance = let
        Source = Table.SelectRows(CombinedData, each [IPActivityScore] <> null),
        Grouped = Table.Group(Source, {"Tier"}, {
            {"company_count", each Table.RowCount(_), type number},
            {"avg_ip_activity_score", each List.Average([IPActivityScore]), type number},
            {"avg_patents_score", each List.Average([IPRelevantPatentsScore]), type number},
            {"avg_citations_score", each List.Average([IPCeresCitationsScore]), type number},
            {"avg_growth_score", each List.Average([IPPortfolioGrowthScore]), type number},
            {"avg_recency_score", each List.Average([IPFilingRecencyScore]), type number},
            {"excellent_ip_count", each Table.RowCount(Table.SelectRows(_, each [IPOverallRating] = "Excellent")), type number},
            {"good_ip_count", each Table.RowCount(Table.SelectRows(_, each [IPOverallRating] = "Good")), type number},
            {"fair_ip_count", each Table.RowCount(Table.SelectRows(_, each [IPOverallRating] = "Fair")), type number},
            {"poor_ip_count", each Table.RowCount(Table.SelectRows(_, each [IPOverallRating] = "Poor")), type number}
        }),
        Sorted = Table.Sort(Grouped, {
            {"Tier", Order.Ascending, (x, y) => 
                let tierOrder = {"Tier 1", "Tier 2", "Tier 3", "Tier 4", "Partner"}
                in List.PositionOf(tierOrder, x) - List.PositionOf(tierOrder, y)}
        })
    in Sorted,
    
    // Step 8: Create Revenue vs IP Correlation
    RevenueIPCorrelation = let
        Source = Table.SelectRows(CombinedData, each [IPActivityScore] <> null),
        Grouped = Table.Group(Source, {"revenue_category"}, {
            {"company_count", each Table.RowCount(_), type number},
            {"avg_ip_score", each List.Average([IPActivityScore]), type number},
            {"avg_finance_score", each List.Average([finance_score]), type number},
            {"avg_overall_score", each List.Average([overallScore]), type number},
            {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
            {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number}
        }),
        Sorted = Table.Sort(Grouped, {
            {"revenue_category", Order.Ascending, (x, y) => 
                let categoryOrder = {"High Revenue (>=200)", "Medium Revenue (50-199)", "Low Revenue (10-49)", "Very Low Revenue (<10)"}
                in List.PositionOf(categoryOrder, x) - List.PositionOf(categoryOrder, y)}
        })
    in Sorted,
    
    // Step 9: Create the final result table with all analyses
    FinalResult = Table.FromRecords({
        [Analysis = "Overall Statistics", Data = OverallStats],
        [Analysis = "Tier Analysis", Data = TierAnalysis],
        [Analysis = "Regional Analysis", Data = RegionalAnalysis],
        [Analysis = "Country Analysis", Data = CountryAnalysis],
        [Analysis = "IP Performance", Data = IPPerformance],
        [Analysis = "Revenue vs IP Correlation", Data = RevenueIPCorrelation]
    })
    
in FinalResult

