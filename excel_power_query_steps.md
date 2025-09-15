# Excel Power Query Setup for Company Analysis

## Prerequisites

1. **Supabase Connection Details**:
   - URL: `https://dnlnfohcjvoqwuufpyyo.supabase.co`
   - Anon Key: Your Supabase anon key
   - Tables: `companies_profile`, `company_financial`, `companies_ip`

## Step-by-Step Setup

### Step 1: Create Base Data Connection

1. **Open Excel** → Data → Get Data → From Other Sources → Blank Query
2. **Paste this M code** for the main data connection:

```m
let
    // Replace with your actual Supabase details
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_SUPABASE_ANON_KEY",

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

in AddRevenueCategory
```

3. **Name this query**: `CombinedData`
4. **Load to worksheet**: Create a new worksheet

### Step 2: Create Tier Analysis Query

1. **New Query** → Blank Query
2. **Paste this M code**:

```m
let
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
in Sorted
```

3. **Name this query**: `TierAnalysis`
4. **Load to worksheet**: Create a new worksheet

### Step 3: Create Regional Analysis Query

1. **New Query** → Blank Query
2. **Paste this M code**:

```m
let
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
in Sorted
```

3. **Name this query**: `RegionalAnalysis`
4. **Load to worksheet**: Create a new worksheet

### Step 4: Create Country Analysis Query

1. **New Query** → Blank Query
2. **Paste this M code**:

```m
let
    Source = Table.SelectRows(CombinedData, each [country] <> null),
    Grouped = Table.Group(Source, {"country"}, {
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
in Sorted
```

3. **Name this query**: `CountryAnalysis`
4. **Load to worksheet**: Create a new worksheet

### Step 5: Create IP Performance Query

1. **New Query** → Blank Query
2. **Paste this M code**:

```m
let
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
in Sorted
```

3. **Name this query**: `IPPerformance`
4. **Load to worksheet**: Create a new worksheet

### Step 6: Create Revenue vs IP Correlation Query

1. **New Query** → Blank Query
2. **Paste this M code**:

```m
let
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
in Sorted
```

3. **Name this query**: `RevenueIPCorrelation`
4. **Load to worksheet**: Create a new worksheet

## Usage Instructions

1. **Refresh Data**: Right-click any query → Refresh to update data
2. **Create Pivot Tables**: Use the `CombinedData` query as source for custom pivot tables
3. **Create Charts**: Use the analysis queries to create charts and visualizations
4. **Filter Data**: Use Excel's built-in filtering on the loaded tables

## Troubleshooting

- **Authentication Error**: Check your Supabase anon key
- **Data Type Errors**: Ensure all numeric columns are properly formatted
- **Missing Data**: Some companies may not have IP data (null values)
- **Performance**: Large datasets may take time to load initially

## Customization

- **Add Filters**: Modify the source queries to add WHERE clauses
- **Add Calculations**: Add more calculated columns to the base query
- **Change Groupings**: Modify the GROUP BY clauses for different analysis
- **Add Time Filters**: Include date ranges for time-based analysis
