// Simplified Power Query M Code for Excel
// Copy each section into separate queries in Excel

// ========================================
// QUERY 1: Main Combined Data
// ========================================
let
    // Replace with your Supabase details
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_SUPABASE_ANON_KEY",
    
    // Get all data in one call (simpler approach)
    Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_profile?select=*,company_financial(*),companies_ip(*)", [
        Headers = [
            #"apikey" = SupabaseKey,
            #"Authorization" = "Bearer " & SupabaseKey
        ]
    ])),
    
    // Convert to table
    ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore", "company_financial", "companies_ip"}, 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore", "company_financial", "companies_ip"}),
    
    // Expand financial data
    ExpandFinancial = Table.ExpandTableColumn(ExpandColumns, "company_financial", 
        {"annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"}, 
        {"annual_revenue", "groupRevenue", "revenueScoreRev", "growthRate", "netProfitMargin", "investCapacityScore", "finance_score"}),
    
    // Expand IP data
    ExpandIP = Table.ExpandTableColumn(ExpandFinancial, "companies_ip", 
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
        
in AddRevenueCategory

// ========================================
// QUERY 2: Tier Analysis
// ========================================
let
    Source = CombinedData, // Reference to the main query
    Grouped = Table.Group(Source, {"Tier"}, {
        {"company_count", each Table.RowCount(_), type number},
        {"percentage", each Table.RowCount(_) * 100.0 / Table.RowCount(Source), type number},
        {"avg_overall_score", each List.Average([overallScore]), type number},
        {"avg_finance_score", each List.Average([finance_score]), type number},
        {"avg_ip_score", each List.Average([IPActivityScore]), type number},
        {"avg_max_revenue", each List.Average([max_revenue]), type number}
    })
in Grouped

// ========================================
// QUERY 3: Regional Analysis
// ========================================
let
    Source = CombinedData,
    Grouped = Table.Group(Source, {"ceres_region"}, {
        {"company_count", each Table.RowCount(_), type number},
        {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
        {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number},
        {"avg_overall_score", each List.Average([overallScore]), type number},
        {"avg_finance_score", each List.Average([finance_score]), type number},
        {"avg_ip_score", each List.Average([IPActivityScore]), type number}
    }),
    Sorted = Table.Sort(Grouped, {{"company_count", Order.Descending}})
in Sorted

// ========================================
// QUERY 4: Country Analysis
// ========================================
let
    Source = Table.SelectRows(CombinedData, each [country] <> null),
    Grouped = Table.Group(Source, {"country"}, {
        {"company_count", each Table.RowCount(_), type number},
        {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
        {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number},
        {"avg_overall_score", each List.Average([overallScore]), type number},
        {"avg_finance_score", each List.Average([finance_score]), type number},
        {"avg_ip_score", each List.Average([IPActivityScore]), type number}
    }),
    FilteredMin5 = Table.SelectRows(Grouped, each [company_count] >= 5),
    Sorted = Table.Sort(FilteredMin5, {{"company_count", Order.Descending}})
in Sorted

// ========================================
// QUERY 5: Revenue vs IP Correlation
// ========================================
let
    Source = Table.SelectRows(CombinedData, each [IPActivityScore] <> null),
    Grouped = Table.Group(Source, {"revenue_category"}, {
        {"company_count", each Table.RowCount(_), type number},
        {"avg_ip_score", each List.Average([IPActivityScore]), type number},
        {"avg_finance_score", each List.Average([finance_score]), type number},
        {"avg_overall_score", each List.Average([overallScore]), type number},
        {"tier1_count", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")), type number},
        {"tier1_percentage", each Table.RowCount(Table.SelectRows(_, each [Tier] = "Tier 1")) * 100.0 / Table.RowCount(_), type number}
    })
in Grouped

