-- Migration: Update company_overview view to include logoUrl column
-- Run this in your Supabase SQL editor

-- Note: logoUrl column already exists in companies_profile table
-- This migration only updates the company_overview view to include the logoUrl column

-- Step 3: Drop and recreate the company_overview view to include the logo column
-- Note: This assumes the view exists and includes the current columns
DROP VIEW IF EXISTS public.company_overview;

-- Step 4: Recreate the company_overview view with the new logo column
-- This view combines data from multiple tables including the new logo field
CREATE VIEW public.company_overview AS
SELECT 
    cp.key,
    cp."englishName",
    cp."companyName",
    cp.logoUrl,  -- New logoUrl column
    cp.website,
    cp.country,
    cp.ceres_region,
    cp.company_state,
    cp.parent_company_name,
    cp.ticker,
    cp."visualElement",
    cp."primaryMarket",
    cp."businessModel",
    
    -- Scoring fields (these come from other tables - adjust table aliases as needed)
    COALESCE(cs.overall_score, 0) as "overallScore",
    COALESCE(cs.strategic_fit, 0) as "strategicFit", 
    COALESCE(cs.ability_to_execute, 0) as "abilityToExecute",
    
    -- Financial data
    cf.annual_revenue,
    COALESCE(cf.revenue_score + cf."3Y_score" + cf."netProfitScore" + cf."investCapacityScore", 0) / 4 as finance_score,
    cf."overallRating" as financial_rating,
    
    -- Industry data  
    ci.industry_score,
    ci.industry_rationale,
    
    -- Hydrogen data
    ch."H2Score",
    ch."H2OverallRating",
    
    -- IP data
    cip."IPActivityScore", 
    cip."IPOverallRating",
    
    -- Manufacturing data
    cm.manufacturing_score,
    cm."ManufacturingOverallRating",
    
    -- Ownership data
    co."OwnershipScore",
    co."OwnershipOverallRating"

FROM public.companies_profile cp
LEFT JOIN public.companies_scoring cs ON cp.key = cs.key
LEFT JOIN public.companies_financial cf ON cp.key = cf.key  
LEFT JOIN public.companies_industry ci ON cp.key = ci.key
LEFT JOIN public.companies_hydrogen ch ON cp.key = ch.key
LEFT JOIN public.companies_ip cip ON cp.key = cip.key
LEFT JOIN public.companies_manufacturing cm ON cp.key = cm.key
LEFT JOIN public.companies_ownership co ON cp.key = co.key;

-- Step 5: Grant appropriate permissions on the view
GRANT SELECT ON public.company_overview TO authenticated;
GRANT SELECT ON public.company_overview TO anon;

-- Step 6: Create an index on the logoUrl column for better performance (optional)
-- Note: This is optional since logoUrl column already exists
-- CREATE INDEX IF NOT EXISTS idx_companies_profile_logoUrl ON public.companies_profile(logoUrl) WHERE logoUrl IS NOT NULL;

-- Verification query to check the view structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'company_overview' AND table_schema = 'public'
-- ORDER BY ordinal_position;
