// Fixed Power Query M Code with Correct Supabase Authentication
// This version uses the proper authentication method for Supabase

// ========================================
// QUERY 1: Main Combined Data (Fixed Auth)
// ========================================
let
    // Supabase connection details
    SupabaseUrl = "https://dnlnfohcjvoqwuufpyyo.supabase.co",
    SupabaseKey = "YOUR_SUPABASE_ANON_KEY", // Replace with your actual anon key
    
    // Method 1: Using Web.Contents with proper headers
    Source = Json.Document(Web.Contents(SupabaseUrl & "/rest/v1/companies_profile?select=*", [
        Headers = [
            #"apikey" = SupabaseKey,
            #"Authorization" = "Bearer " & SupabaseKey,
            #"Content-Type" = "application/json"
        ]
    ])),
    
    // Convert to table
    ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"}, 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"})
        
in ExpandColumns

// ========================================
// ALTERNATIVE METHOD: Using OData Feed
// ========================================
let
    // Alternative approach using OData
    Source = OData.Feed("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", null, [
        Headers = [
            #"apikey" = "YOUR_SUPABASE_ANON_KEY",
            #"Authorization" = "Bearer YOUR_SUPABASE_ANON_KEY"
        ]
    ])
in Source

// ========================================
// METHOD 3: Using Web API with Query Parameters
// ========================================
let
    // Using query parameters instead of headers
    Source = Json.Document(Web.Contents("https://dnlnfohcjvoqwuufpyyo.supabase.co/rest/v1/companies_profile", [
        Query = [
            apikey = "YOUR_SUPABASE_ANON_KEY"
        ],
        Headers = [
            #"Authorization" = "Bearer YOUR_SUPABASE_ANON_KEY"
        ]
    ])),
    
    ToTable = Table.FromList(Source, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    ExpandColumns = Table.ExpandRecordColumn(ToTable, "Column1", 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"}, 
        {"key", "companyName", "Tier", "ceres_region", "country", "strategicFit", "abilityToExecute", "overallScore"})
in ExpandColumns

