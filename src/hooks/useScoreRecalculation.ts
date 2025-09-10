import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface RecalculationResult {
  success: boolean;
  message: string;
  companies_updated?: number;
  company_key?: number;
  execution_time_ms?: number;
  timestamp?: string;
  error?: string;
}

export const useScoreRecalculation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recalculateAllScores = async (): Promise<RecalculationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("trigger_score_recalculation");

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        message: "Failed to recalculate scores",
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const recalculateCompanyScores = async (
    companyKey: number,
  ): Promise<RecalculationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc("recalculate_company_scores", {
        company_key_param: companyKey,
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        message: "Failed to recalculate company scores",
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const triggerViaEdgeFunction = async (
    companyKey?: number,
  ): Promise<RecalculationResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke("trigger-score-recalculation", {
        body: companyKey ? { company_key: companyKey } : {},
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      return {
        success: false,
        message: "Failed to trigger recalculation via edge function",
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    recalculateAllScores,
    recalculateCompanyScores,
    triggerViaEdgeFunction,
  };
};
