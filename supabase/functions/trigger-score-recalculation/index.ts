import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Get the company key from query parameters (optional)
    const url = new URL(req.url);
    const companyKey = url.searchParams.get("company_key");

    let result;

    if (companyKey) {
      // Recalculate for specific company
      const { data, error } = await supabaseClient.rpc("recalculate_company_scores", {
        company_key_param: parseInt(companyKey),
      });

      if (error) {
        throw error;
      }

      result = data;
    } else {
      // Recalculate for all companies
      const { data, error } = await supabaseClient.rpc("trigger_score_recalculation");

      if (error) {
        throw error;
      }

      result = data;
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error triggering score recalculation",
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
