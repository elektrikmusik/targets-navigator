import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useScoreRecalculation } from "@/hooks/useScoreRecalculation";

interface RecalculationResult {
  success: boolean;
  message: string;
  companies_updated?: number;
  company_key?: number;
  execution_time_ms?: number;
  timestamp?: string;
  error?: string;
}

interface ScoreRecalculationButtonProps {
  companyKey?: number;
  onSuccess?: () => void;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const ScoreRecalculationButton = ({
  companyKey,
  onSuccess,
  variant = "outline",
  size = "sm",
  className = "",
}: ScoreRecalculationButtonProps) => {
  const { loading, error, recalculateAllScores, recalculateCompanyScores } =
    useScoreRecalculation();
  const [lastResult, setLastResult] = useState<RecalculationResult | null>(null);

  const handleRecalculate = async () => {
    try {
      const result = companyKey
        ? await recalculateCompanyScores(companyKey)
        : await recalculateAllScores();

      if (result?.success) {
        setLastResult(result);
        console.log(
          companyKey
            ? `Company scores recalculated successfully`
            : `All company scores recalculated successfully (${result.companies_updated} companies)`,
          `Execution time: ${result.execution_time_ms?.toFixed(0)}ms`,
        );
        onSuccess?.();
      } else {
        console.error(result?.message || "Failed to recalculate scores");
      }
    } catch (err) {
      console.error("An unexpected error occurred:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={handleRecalculate}
        disabled={loading}
        variant={variant}
        size={size}
        className={`flex items-center gap-2 ${className}`}
      >
        {loading ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : error ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : lastResult?.success ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <RefreshCw className="h-4 w-4" />
        )}
        {loading
          ? "Recalculating..."
          : companyKey
            ? "Recalculate Company Scores"
            : "Recalculate All Scores"}
      </Button>

      {lastResult?.success && lastResult.timestamp && (
        <span className="text-muted-foreground text-xs">
          Last run: {new Date(lastResult.timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};
