-- Create a function to manually trigger score recalculation
-- This can be called remotely via Supabase Edge Functions or direct SQL

CREATE OR REPLACE FUNCTION public.trigger_score_recalculation()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    result json;
    companies_updated integer := 0;
    start_time timestamp;
    end_time timestamp;
BEGIN
    start_time := clock_timestamp();
    
    -- Call the existing recalculation function
    PERFORM public.recalculate_all_tiers();
    
    -- Get count of companies that were updated
    SELECT COUNT(*) INTO companies_updated 
    FROM companies_profile 
    WHERE "Tier" IS NOT NULL;
    
    end_time := clock_timestamp();
    
    -- Return result with metadata
    result := json_build_object(
        'success', true,
        'message', 'Score recalculation completed successfully',
        'companies_updated', companies_updated,
        'execution_time_ms', EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
        'timestamp', end_time
    );
    
    RETURN result;
END;
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.trigger_score_recalculation() TO authenticated;

-- Create a simpler function for individual company recalculation
CREATE OR REPLACE FUNCTION public.recalculate_company_scores(company_key_param bigint)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    result json;
    company_exists boolean := false;
    start_time timestamp;
    end_time timestamp;
BEGIN
    start_time := clock_timestamp();
    
    -- Check if company exists
    SELECT EXISTS(SELECT 1 FROM companies_profile WHERE key = company_key_param) INTO company_exists;
    
    IF NOT company_exists THEN
        result := json_build_object(
            'success', false,
            'message', 'Company not found',
            'company_key', company_key_param
        );
        RETURN result;
    END IF;
    
    -- Trigger the calculation for this specific company by updating a related record
    -- This will fire the trigger that calls calculate_company_scores
    UPDATE companies_profile 
    SET "overallScore" = "overallScore" 
    WHERE key = company_key_param;
    
    end_time := clock_timestamp();
    
    result := json_build_object(
        'success', true,
        'message', 'Company scores recalculated successfully',
        'company_key', company_key_param,
        'execution_time_ms', EXTRACT(EPOCH FROM (end_time - start_time)) * 1000,
        'timestamp', end_time
    );
    
    RETURN result;
END;
$function$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.recalculate_company_scores(bigint) TO authenticated;

