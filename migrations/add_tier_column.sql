-- Migration: Add Tier column to companies_profile table
-- This migration adds a Tier column to the companies_profile table
-- and updates the calculate_company_scores function to include tier calculation

-- Step 1: Add Tier column to companies_profile table (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'companies_profile' 
        AND column_name = 'Tier' 
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE companies_profile ADD COLUMN "Tier" text;
    END IF;
END $$;

-- Step 2: Update the calculate_company_scores function with tier calculation logic
CREATE OR REPLACE FUNCTION public.calculate_company_scores()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    industry_score numeric;
    hydrogen_score numeric;
    manufacturing_score numeric;
    finance_score numeric;
    ip_score numeric;
    ownership_score numeric;
    
    -- Dynamic weights from scoring_weights table
    industry_weight numeric;
    hydrogen_weight numeric;
    manufacturing_weight numeric;
    finance_weight numeric;
    ip_weight numeric;
    ownership_weight numeric;
    
    strategic_fit numeric;
    ability_to_execute numeric;
    overall_score numeric;
    tier_value text;
    ceres_region_value text;
    
    company_key bigint;
BEGIN
    -- Determine which company key to use
    IF TG_OP = 'INSERT' THEN
        company_key := NEW.key;
    ELSE
        company_key := OLD.key;
    END IF;
    
    -- Skip if no company key
    IF company_key IS NULL THEN
        RETURN COALESCE(NEW, OLD);
    END IF;
    
    -- Dynamically fetch weights from scoring_weights table
    SELECT COALESCE(weight, 0) INTO industry_weight
    FROM scoring_weights WHERE criteria = 'industry';
    
    SELECT COALESCE(weight, 0) INTO hydrogen_weight
    FROM scoring_weights WHERE criteria = 'hydrogen';
    
    SELECT COALESCE(weight, 0) INTO manufacturing_weight
    FROM scoring_weights WHERE criteria = 'manufacturing';
    
    SELECT COALESCE(weight, 0) INTO finance_weight
    FROM scoring_weights WHERE criteria = 'finance';
    
    SELECT COALESCE(weight, 0) INTO ip_weight
    FROM scoring_weights WHERE criteria = 'ip';
    
    SELECT COALESCE(weight, 0) INTO ownership_weight
    FROM scoring_weights WHERE criteria = 'ownership';
    
    -- Get scores from respective tables using EXACT column names with proper quoting
    SELECT COALESCE(ci."industry_score", 0) INTO industry_score
    FROM companies_industry ci WHERE ci.key = company_key;
    
    SELECT COALESCE(ch."H2Score", 0) INTO hydrogen_score
    FROM companies_hydrogen ch WHERE ch.key = company_key;
    
    SELECT COALESCE(cm."manufacturing_score", 0) INTO manufacturing_score
    FROM companies_manufacturing cm WHERE cm.key = company_key;
    
    SELECT COALESCE(cf."finance_score", 0) INTO finance_score
    FROM company_financial cf WHERE cf.key = company_key;
    
    SELECT COALESCE(cip."IPActivityScore", 0) INTO ip_score
    FROM companies_ip cip WHERE cip.key = company_key;
    
    SELECT COALESCE(co."OwnershipScore", 0) INTO ownership_score
    FROM companies_ownership co WHERE co.key = company_key;
    
    -- Get ceres_region for tier calculation
    SELECT cp."ceres_region" INTO ceres_region_value
    FROM companies_profile cp WHERE cp.key = company_key;
    
    -- Calculate Strategic Fit
    strategic_fit := CASE 
        WHEN (industry_weight + hydrogen_weight + manufacturing_weight) > 0 THEN
            (industry_score * industry_weight + hydrogen_score * hydrogen_weight + manufacturing_score * manufacturing_weight) / 
            (industry_weight + hydrogen_weight + manufacturing_weight)
        ELSE 0
    END;
    
    -- Calculate Ability to Execute
    ability_to_execute := CASE 
        WHEN (finance_weight + ip_weight + ownership_weight) > 0 THEN
            (finance_score * finance_weight + ip_score * ip_weight + ownership_score * ownership_weight) / 
            (finance_weight + ip_weight + ownership_weight)
        ELSE 0
    END;
    
    -- Calculate Overall Score
    overall_score := CASE 
        WHEN (industry_weight + hydrogen_weight + manufacturing_weight + finance_weight + ip_weight + ownership_weight) > 0 THEN
            (industry_score * industry_weight + hydrogen_score * hydrogen_weight + manufacturing_score * manufacturing_weight + 
             finance_score * finance_weight + ip_score * ip_weight + ownership_score * ownership_weight) / 
            (industry_weight + hydrogen_weight + manufacturing_weight + finance_weight + ip_weight + ownership_weight)
        ELSE 0
    END;
    
    -- Calculate Tier based on the specified logic:
    -- if ceres_region = Partner then Tier = Partner
    -- if strategicFit > 5 and abilityToExecute > 5 then Tier = Tier 1
    -- if strategicFit <= 5 and abilityToExecute >= 5 then Tier = Tier 2
    -- if strategicFit >= 5 and abilityToExecute < 5 then Tier = Tier 3
    -- if strategicFit < 5 and abilityToExecute < 5 then Tier = Tier 4
    tier_value := CASE 
        WHEN ceres_region_value = 'Partner' THEN 'Partner'
        WHEN strategic_fit > 5 AND ability_to_execute > 5 THEN 'Tier 1'
        WHEN strategic_fit <= 5 AND ability_to_execute >= 5 THEN 'Tier 2'
        WHEN strategic_fit >= 5 AND ability_to_execute < 5 THEN 'Tier 3'
        WHEN strategic_fit < 5 AND ability_to_execute < 5 THEN 'Tier 4'
        ELSE 'Unclassified'
    END;
    
    -- Update companies_profile with calculated scores and tier
    UPDATE companies_profile 
    SET 
        "strategicFit" = strategic_fit,
        "abilityToExecute" = ability_to_execute,
        "overallScore" = overall_score,
        "Tier" = tier_value
    WHERE key = company_key;
    
    RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Step 3: Create a function to recalculate tiers for existing companies
-- This can be used to populate the Tier column for existing records
CREATE OR REPLACE FUNCTION public.recalculate_all_tiers()
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    company_record RECORD;
    industry_score numeric;
    hydrogen_score numeric;
    manufacturing_score numeric;
    finance_score numeric;
    ip_score numeric;
    ownership_score numeric;
    
    -- Dynamic weights from scoring_weights table
    industry_weight numeric;
    hydrogen_weight numeric;
    manufacturing_weight numeric;
    finance_weight numeric;
    ip_weight numeric;
    ownership_weight numeric;
    
    strategic_fit numeric;
    ability_to_execute numeric;
    overall_score numeric;
    tier_value text;
BEGIN
    -- Get weights once
    SELECT COALESCE(weight, 0) INTO industry_weight
    FROM scoring_weights WHERE criteria = 'industry';
    
    SELECT COALESCE(weight, 0) INTO hydrogen_weight
    FROM scoring_weights WHERE criteria = 'hydrogen';
    
    SELECT COALESCE(weight, 0) INTO manufacturing_weight
    FROM scoring_weights WHERE criteria = 'manufacturing';
    
    SELECT COALESCE(weight, 0) INTO finance_weight
    FROM scoring_weights WHERE criteria = 'finance';
    
    SELECT COALESCE(weight, 0) INTO ip_weight
    FROM scoring_weights WHERE criteria = 'ip';
    
    SELECT COALESCE(weight, 0) INTO ownership_weight
    FROM scoring_weights WHERE criteria = 'ownership';
    
    -- Loop through all companies
    FOR company_record IN 
        SELECT key, "ceres_region" FROM companies_profile
    LOOP
        -- Get scores for this company
        SELECT COALESCE(ci."industry_score", 0) INTO industry_score
        FROM companies_industry ci WHERE ci.key = company_record.key;
        
        SELECT COALESCE(ch."H2Score", 0) INTO hydrogen_score
        FROM companies_hydrogen ch WHERE ch.key = company_record.key;
        
        SELECT COALESCE(cm."manufacturing_score", 0) INTO manufacturing_score
        FROM companies_manufacturing cm WHERE cm.key = company_record.key;
        
        SELECT COALESCE(cf."finance_score", 0) INTO finance_score
        FROM company_financial cf WHERE cf.key = company_record.key;
        
        SELECT COALESCE(cip."IPActivityScore", 0) INTO ip_score
        FROM companies_ip cip WHERE cip.key = company_record.key;
        
        SELECT COALESCE(co."OwnershipScore", 0) INTO ownership_score
        FROM companies_ownership co WHERE co.key = company_record.key;
        
        -- Calculate Strategic Fit
        strategic_fit := CASE 
            WHEN (industry_weight + hydrogen_weight + manufacturing_weight) > 0 THEN
                (industry_score * industry_weight + hydrogen_score * hydrogen_weight + manufacturing_score * manufacturing_weight) / 
                (industry_weight + hydrogen_weight + manufacturing_weight)
            ELSE 0
        END;
        
        -- Calculate Ability to Execute
        ability_to_execute := CASE 
            WHEN (finance_weight + ip_weight + ownership_weight) > 0 THEN
                (finance_score * finance_weight + ip_score * ip_weight + ownership_score * ownership_weight) / 
                (finance_weight + ip_weight + ownership_weight)
            ELSE 0
        END;
        
        -- Calculate Overall Score
        overall_score := CASE 
            WHEN (industry_weight + hydrogen_weight + manufacturing_weight + finance_weight + ip_weight + ownership_weight) > 0 THEN
                (industry_score * industry_weight + hydrogen_score * hydrogen_weight + manufacturing_score * manufacturing_weight + 
                 finance_score * finance_weight + ip_score * ip_weight + ownership_score * ownership_weight) / 
                (industry_weight + hydrogen_weight + manufacturing_weight + finance_weight + ip_weight + ownership_weight)
            ELSE 0
        END;
        
        -- Calculate Tier
        tier_value := CASE 
            WHEN company_record."ceres_region" = 'Partner' THEN 'Partner'
            WHEN strategic_fit > 5 AND ability_to_execute > 5 THEN 'Tier 1'
            WHEN strategic_fit <= 5 AND ability_to_execute >= 5 THEN 'Tier 2'
            WHEN strategic_fit >= 5 AND ability_to_execute < 5 THEN 'Tier 3'
            WHEN strategic_fit < 5 AND ability_to_execute < 5 THEN 'Tier 4'
            ELSE 'Unclassified'
        END;
        
        -- Update the company record
        UPDATE companies_profile 
        SET 
            "strategicFit" = strategic_fit,
            "abilityToExecute" = ability_to_execute,
            "overallScore" = overall_score,
            "Tier" = tier_value
        WHERE key = company_record.key;
    END LOOP;
END;
$function$;

-- Step 4: Run the recalculation function to populate tiers for existing companies
SELECT public.recalculate_all_tiers();

-- Step 5: Update the company_overview view to include the Tier column
DROP VIEW IF EXISTS public.company_overview;

-- Recreate the company_overview view with the new Tier column
CREATE VIEW public.company_overview AS
SELECT 
    cp.key,
    cp."englishName",
    cp."companyName",
    cp."logoUrl",
    cp.website,
    cp.country,
    cp.ceres_region,
    cp.company_state,
    cp.parent_company_name,
    cp.ticker,
    cp."visualElement",
    cp."primaryMarket",
    cp."businessModel",
    cp."Tier",  -- New Tier column
    
    -- Scoring fields (these come directly from companies_profile table)
    COALESCE(cp."overallScore", 0) as "overallScore",
    COALESCE(cp."strategicFit", 0) as "strategicFit", 
    COALESCE(cp."abilityToExecute", 0) as "abilityToExecute",
    
    -- Financial data
    cf.annual_revenue,
    COALESCE(cf.revenue_score + cf."3Y_score" + cf."netProfitScore" + cf."investCapacityScore", 0) / 4 as finance_score,
    cf."overallRating" as financial_rating,
    
    -- Industry data  
    ci.industry_score,
    ci.rationale as industry_rationale,
    
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
LEFT JOIN public.company_financial cf ON cp.key = cf.key  
LEFT JOIN public.companies_industry ci ON cp.key = ci.key
LEFT JOIN public.companies_hydrogen ch ON cp.key = ch.key
LEFT JOIN public.companies_ip cip ON cp.key = cip.key
LEFT JOIN public.companies_manufacturing cm ON cp.key = cm.key
LEFT JOIN public.companies_ownership co ON cp.key = co.key;

-- Grant appropriate permissions on the updated view
GRANT SELECT ON public.company_overview TO authenticated;
GRANT SELECT ON public.company_overview TO anon;
